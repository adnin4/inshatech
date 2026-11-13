/**
 * Universal Server-Side Authorization Verifier & Token Security Engine
 * Fail-closed authentication and role verification for all privileged API routes.
 */

import { resolveCorsOrigin } from './origin_policy.js';

export function getCorsHeaders(request) {
    const allowOrigin = resolveCorsOrigin(request);
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Agent-ID, X-Admin-Token',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
}

export function httpStatusForAuthError(authStatus) {
    if (authStatus === 'CONFIGURATION_ERROR' || authStatus === 'SECURITY_AUTHORITY_UNAVAILABLE') {
        return 503;
    }
    if (authStatus === 'PRIVILEGE_REJECTED' || authStatus === 'HIERARCHY_REJECTED') {
        return 403;
    }
    return 401;
}

function unb64(str) {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - str.length % 4) % 4));
}

export function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

function getCookie(request, name) {
    const cookieHeader = request.headers?.get('Cookie') || '';
    if (!cookieHeader) return null;
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const cookie of cookies) {
        const [k, ...v] = cookie.split('=');
        if (k === name) return v.join('=');
    }
    return null;
}

const IN_MEMORY_REVOKED_JTIS = new Set();

export async function revokeSessionToken(jti, env = {}) {
    if (!jti) return;
    IN_MEMORY_REVOKED_JTIS.add(jti);

    const hasCoordinator = env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function';
    const hasKv = env.REVOCATION_KV && typeof env.REVOCATION_KV.put === 'function';
    const isProdOrStaging = env.ENVIRONMENT === 'production' || env.ENVIRONMENT === 'staging';
    const requiresDurableCoordinator = env.REQUIRE_DURABLE_COORDINATOR === 'true' || isProdOrStaging;
    const requiresSharedAuthority = requiresDurableCoordinator || env.REQUIRE_SHARED_REVOCATION === 'true';

    if (requiresDurableCoordinator && !hasCoordinator) {
        throw new Error('Authoritative Durable Object security coordinator (SECURITY_COORDINATOR) is not configured in runtime environment');
    }
    if (requiresSharedAuthority && !hasCoordinator && !hasKv) {
        throw new Error('Shared revocation authority (Durable Object / KV) is not configured in runtime environment');
    }

    // 1. Strongly Consistent Durable Objects Authority (fail closed on coordinator error)
    if (hasCoordinator) {
        const partitionKey = 'revocation:' + String(jti).slice(0, 8);
        const id = env.SECURITY_COORDINATOR.idFromName(partitionKey);
        const stub = env.SECURITY_COORDINATOR.get(id);
        const res = await stub.fetch('https://coordinator/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jti })
        });
        if (!res.ok) {
            throw new Error(`SecurityCoordinator revocation failed with HTTP ${res.status}`);
        }
    }

    // 2. Eventually Consistent KV Cache (Secondary read acceleration)
    if (hasKv) {
        await env.REVOCATION_KV.put(`revoked:${jti}`, 'true', { expirationTtl: 86400 });
    }
}

export async function checkSessionRevocationState(jti, env = {}) {
    if (!jti) return { status: 'ACTIVE' };
    if (IN_MEMORY_REVOKED_JTIS.has(jti)) return { status: 'REVOKED' };

    const hasCoordinator = env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function';
    const hasKv = env.REVOCATION_KV && typeof env.REVOCATION_KV.get === 'function';
    const isProdOrStaging = env.ENVIRONMENT === 'production' || env.ENVIRONMENT === 'staging';
    const requiresDurableCoordinator = env.REQUIRE_DURABLE_COORDINATOR === 'true' || isProdOrStaging;
    const requiresSharedAuthority = requiresDurableCoordinator || env.REQUIRE_SHARED_REVOCATION === 'true';

    // In production/staging, Durable Object is strictly required as the strongly-consistent authoritative store
    if (requiresDurableCoordinator && !hasCoordinator) {
        return {
            status: 'UNAVAILABLE',
            error: 'Authoritative Durable Object security coordinator (SECURITY_COORDINATOR) is required in production/staging'
        };
    }

    if (requiresSharedAuthority && !hasCoordinator && !hasKv) {
        return {
            status: 'UNAVAILABLE',
            error: 'Shared revocation authority (Durable Object / KV) is not configured in runtime environment'
        };
    }

    // 1. Check eventual KV cache for fast-path rejection
    if (hasKv) {
        try {
            const val = await env.REVOCATION_KV.get(`revoked:${jti}`);
            if (val) return { status: 'REVOKED' };
        } catch (_) {
            // KV cache miss or transient failure delegates to authoritative coordinator
        }
    }

    // 2. Strongly Consistent Durable Objects Authority
    if (hasCoordinator) {
        try {
            const partitionKey = 'revocation:' + String(jti).slice(0, 8);
            const id = env.SECURITY_COORDINATOR.idFromName(partitionKey);
            const stub = env.SECURITY_COORDINATOR.get(id);
            const res = await stub.fetch(`https://coordinator/is-revoked?jti=${encodeURIComponent(jti)}`);
            if (!res.ok) {
                return {
                    status: 'UNAVAILABLE',
                    error: `Security authority returned status ${res.status}`
                };
            }
            const data = await res.json().catch(() => ({}));
            if (data.is_revoked) return { status: 'REVOKED' };
        } catch (err) {
            return {
                status: 'UNAVAILABLE',
                error: err?.message || 'Security authority communication failure'
            };
        }
    }

    return { status: 'ACTIVE' };
}

export async function isSessionRevoked(jti, env = {}) {
    const state = await checkSessionRevocationState(jti, env);
    return state.status !== 'ACTIVE';
}

/**
 * Verifies signed Bearer token or session cookie against environment JWT_SECRET.
 * Enforces signature (constant-time), expiration, revocation, required role, and MFA status.
 *
 * @param {Request} request
 * @param {Object} env
 * @param {Object} [options]
 * @param {string} [options.requiredRole='owner']
 * @param {number} [options.minHierarchyLevel=1]
 * @param {boolean} [options.requireMfa=true]
 * @returns {Promise<{authorized: boolean, status: string, user?: Object, error?: string}>}
 */
export async function verifyServerSession(request, env = {}, options = {}) {
    const {
        requiredRole = 'owner',
        minHierarchyLevel = 1,
        requireMfa = true,
        skipRevocationCheck = false
    } = options;

    if (!env.JWT_SECRET) {
        return {
            authorized: false,
            status: 'CONFIGURATION_ERROR',
            error: 'Server authentication secret not configured'
        };
    }

    const authHeader = request.headers.get('Authorization') || request.headers.get('X-Admin-Token') || '';
    let token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader.trim();

    if (!token) {
        token = getCookie(request, '__Host-iinsha_admin_session') ||
                getCookie(request, 'iinsha_admin_jwt') ||
                getCookie(request, 'iinsha_session') || '';
    }

    if (!token) {
        return {
            authorized: false,
            status: 'UNAUTHORIZED',
            error: 'Missing Authorization Bearer token or session cookie'
        };
    }

    const [payloadB64, signature] = token.split('.');
    if (!payloadB64 || !signature) {
        return {
            authorized: false,
            status: 'INVALID_TOKEN',
            error: 'Malformed session token structure'
        };
    }

    try {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(env.JWT_SECRET),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const expectedSig = btoa(
            String.fromCharCode(
                ...new Uint8Array(
                    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
                )
            )
        ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        if (!constantTimeEqual(expectedSig, signature)) {
            return {
                authorized: false,
                status: 'FORGERY_REJECTED',
                error: 'Cryptographic signature verification failed'
            };
        }

        const payload = JSON.parse(unb64(payloadB64));
        const now = Math.floor(Date.now() / 1000);

        if (!payload.exp || now >= payload.exp) {
            return {
                authorized: false,
                status: 'TOKEN_EXPIRED',
                error: 'Session token has expired'
            };
        }

        if (!skipRevocationCheck && payload.jti) {
            const revocationState = await checkSessionRevocationState(payload.jti, env);
            if (revocationState.status === 'UNAVAILABLE') {
                return {
                    authorized: false,
                    status: 'SECURITY_AUTHORITY_UNAVAILABLE',
                    error: revocationState.error || 'Security authority unavailable during revocation check'
                };
            }
            if (revocationState.status === 'REVOKED') {
                return {
                    authorized: false,
                    status: 'TOKEN_REVOKED',
                    error: 'Session token has been revoked'
                };
            }
        }

        if (requiredRole && payload.role !== requiredRole) {
            return {
                authorized: false,
                status: 'PRIVILEGE_REJECTED',
                error: `Role '${payload.role}' does not satisfy required role '${requiredRole}'`
            };
        }

        if (typeof minHierarchyLevel === 'number' && (payload.hierarchy_level || 99) > minHierarchyLevel) {
            return {
                authorized: false,
                status: 'HIERARCHY_REJECTED',
                error: 'Hierarchy level insufficient for privileged operation'
            };
        }

        if (requireMfa && payload.mfa_verified !== true) {
            return {
                authorized: false,
                status: 'MFA_REQUIRED',
                error: 'Multi-factor authentication (MFA) verification required'
            };
        }

        return {
            authorized: true,
            status: 'AUTHORIZED',
            user: {
                email: payload.sub,
                role: payload.role,
                hierarchy_level: payload.hierarchy_level,
                mfa_verified: payload.mfa_verified,
                jti: payload.jti || null
            },
            expires_at: new Date(payload.exp * 1000).toISOString()
        };
    } catch (err) {
        return {
            authorized: false,
            status: 'INVALID_TOKEN',
            error: err.message || 'Token parsing failure'
        };
    }
}
