/**
 * Universal Server-Side Authorization Verifier & Token Security Engine
 * Fail-closed authentication and role verification for all privileged API routes.
 */

const ORIGINS = new Set([
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8080',
    'http://localhost:8788',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8788'
]);

export function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ORIGINS.has(origin) || origin.endsWith('.pages.dev');
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Agent-ID, X-Admin-Token',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
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

    // 1. Strongly Consistent Durable Objects Authority (Zero Eventual Consistency Delay)
    if (env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function') {
        try {
            const partitionKey = 'revocation:' + String(jti).slice(0, 8);
            const id = env.SECURITY_COORDINATOR.idFromName(partitionKey);
            const stub = env.SECURITY_COORDINATOR.get(id);
            await stub.fetch('https://coordinator/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jti })
            });
        } catch (_) {}
    }

    // 2. Eventually Consistent KV Cache (Secondary read acceleration)
    if (env.REVOCATION_KV && typeof env.REVOCATION_KV.put === 'function') {
        try {
            await env.REVOCATION_KV.put(`revoked:${jti}`, 'true', { expirationTtl: 86400 });
        } catch (_) {}
    }
}

export async function isSessionRevoked(jti, env = {}) {
    if (!jti) return false;
    if (IN_MEMORY_REVOKED_JTIS.has(jti)) return true;

    // 1. Strongly Consistent Durable Objects Authority
    if (env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function') {
        try {
            const partitionKey = 'revocation:' + String(jti).slice(0, 8);
            const id = env.SECURITY_COORDINATOR.idFromName(partitionKey);
            const stub = env.SECURITY_COORDINATOR.get(id);
            const res = await stub.fetch(`https://coordinator/is-revoked?jti=${encodeURIComponent(jti)}`);
            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                if (data.is_revoked) return true;
            }
        } catch (_) {
            // Fail closed on security authority communication error
            return true;
        }
    }

    // 2. Eventually Consistent KV Cache
    if (env.REVOCATION_KV && typeof env.REVOCATION_KV.get === 'function') {
        try {
            const val = await env.REVOCATION_KV.get(`revoked:${jti}`);
            if (val) return true;
        } catch (_) {}
    }
    return false;
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
        requireMfa = true
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

        if (payload.jti && await isSessionRevoked(payload.jti, env)) {
            return {
                authorized: false,
                status: 'TOKEN_REVOKED',
                error: 'Session token has been revoked'
            };
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
