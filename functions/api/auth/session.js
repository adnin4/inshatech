/**
 * Cloudflare Pages Function: /api/auth/session
 * Enterprise-Hardened Fail-Closed Owner Authentication Gateway.
 * Supports adaptive salted PBKDF2 and constant-time legacy verification.
 * Emits HttpOnly Secure session cookies and strict CORS boundaries.
 */

import { resolveCorsOrigin } from '../../_shared/origin_policy.js';

function corsHeaders(request) {
    const allowOrigin = resolveCorsOrigin(request);
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
}

const b64 = (s) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

async function sha256Hex(s) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}

const MIN_PBKDF2_ITERATIONS = 100000;
const MAX_PBKDF2_ITERATIONS = 1000000;

async function verifyPassword(password, storedHash) {
    if (typeof password !== 'string' || !password || typeof storedHash !== 'string' || !storedHash.startsWith('pbkdf2:')) {
        return false;
    }
    // Format: PBKDF2 -> pbkdf2:<iterations>:<saltHex>:<hashHex>
    const parts = storedHash.split(':');
    if (parts.length !== 4) return false;

    const iterStr = parts[1];
    const saltHex = parts[2];
    const expectedHashHex = parts[3];

    if (!/^[0-9]+$/.test(iterStr)) return false;
    const iterations = Number(iterStr);
    if (!Number.isSafeInteger(iterations) || iterations < MIN_PBKDF2_ITERATIONS || iterations > MAX_PBKDF2_ITERATIONS) {
        return false;
    }

    if (!/^[0-9a-f]{32,}$/i.test(saltHex) || saltHex.length % 2 !== 0) return false;
    if (!/^[0-9a-f]{64}$/i.test(expectedHashHex)) return false;

    try {
        const saltBytes = saltHex.match(/.{2}/g);
        if (!saltBytes) return false;
        const salt = new Uint8Array(saltBytes.map(byte => parseInt(byte, 16)));
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        const derived = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
            key,
            256
        );
        const derivedHex = [...new Uint8Array(derived)].map(x => x.toString(16).padStart(2, '0')).join('');
        return constantTimeEqual(derivedHex.toLowerCase(), expectedHashHex.toLowerCase());
    } catch (_) {
        return false;
    }
}

async function signJwt(payload, secret) {
    if (!secret) throw new Error('JWT_SECRET_NOT_CONFIGURED');
    const body = b64(JSON.stringify(payload));
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = b64(String.fromCharCode(...new Uint8Array(
        await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    )));
    return `${body}.${sig}`;
}

export function base32Decode(str) {
    if (typeof str !== 'string') return null;
    let s = str.trim().toUpperCase().replace(/[\s-]/g, '');
    if (!s) return null;
    let padCount = 0;
    while (s.endsWith('=')) {
        padCount++;
        s = s.slice(0, -1);
    }
    // RFC 4648 padding constraint: padded strings must have total length as multiple of 8
    // and valid padding counts in Base32 are only 1, 3, 4, 6
    if (padCount > 0) {
        if ((s.length + padCount) % 8 !== 0) return null;
        if (![1, 3, 4, 6].includes(padCount % 8)) return null;
    }
    // Unpadded strings with length % 8 of 1, 3, or 6 cannot form complete octets
    if ([1, 3, 6].includes(s.length % 8)) return null;
    if (!/^[A-Z2-7]+$/.test(s)) return null;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = 0;
    let value = 0;
    const output = [];
    for (let i = 0; i < s.length; i++) {
        const idx = alphabet.indexOf(s[i]);
        if (idx === -1) return null;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            output.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    // RFC 4648 Section 3.5: Any unused bits in the final quantum MUST be zero.
    // Non-zero unused bits indicate non-canonical encoding and must be rejected.
    if (bits > 0 && (value & ((1 << bits) - 1)) !== 0) {
        return null;
    }
    return new Uint8Array(output);
}

export async function computeTotp(secret, timeSec, digits = 6, hash = 'SHA-1') {
    let keyBytes = base32Decode(secret);
    if (!keyBytes || keyBytes.length === 0) {
        keyBytes = new TextEncoder().encode(secret);
    }
    const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'HMAC', hash }, false, ['sign']);
    const counter = Math.floor(timeSec / 30);
    const ab = new ArrayBuffer(8);
    new DataView(ab).setBigUint64(0, BigInt(counter));
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab));
    const offset = sig[sig.length - 1] & 15;
    const binCode = ((sig[offset] & 127) << 24 | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]);
    const otp = binCode % (10 ** digits);
    return String(otp).padStart(digits, '0');
}

export async function verifyTotp(token, secret, options = {}) {
    const digits = options.digits || 6;
    const hash = options.algorithm || options.hash || 'SHA-1';
    const stepSec = options.step || 30;
    const timestamp = typeof options.timestamp === 'number' ? options.timestamp : Date.now();
    const allowDrift = options.allowDrift !== false; // default true (+/- 1 step)

    if (!secret) {
        return { valid: false, matchedStep: null };
    }

    const tokenStr = String(token || '').trim();
    if (!new RegExp(`^[0-9]{${digits}}$`).test(tokenStr)) {
        return { valid: false, matchedStep: null };
    }

    // Standard RFC 4648 Base32 decode
    let keyBytes = base32Decode(secret);
    if (!keyBytes || keyBytes.length === 0) {
        if (options.allowLegacyUtf8 === true) {
            keyBytes = new TextEncoder().encode(secret);
        } else {
            return { valid: false, matchedStep: null, error: 'INVALID_BASE32_SECRET' };
        }
    }

    const key = await crypto.subtle.importKey(
        'raw',
        keyBytes,
        { name: 'HMAC', hash },
        false,
        ['sign']
    );

    const counter = Math.floor(Math.floor(timestamp / 1000) / stepSec);
    const minDrift = allowDrift ? -1 : 0;
    const maxDrift = allowDrift ? 1 : 0;

    for (let drift = minDrift; drift <= maxDrift; drift++) {
        const step = counter + drift;
        const ab = new ArrayBuffer(8);
        new DataView(ab).setBigUint64(0, BigInt(step));
        const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab));
        const offset = sig[sig.length - 1] & 15;
        const binCode = ((sig[offset] & 127) << 24 | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]);
        const code = binCode % (10 ** digits);
        if (constantTimeEqual(String(code).padStart(digits, '0'), tokenStr)) {
            return { valid: true, matchedStep: step };
        }
    }
    return { valid: false, matchedStep: null };
}

export async function onRequestPost({ request, env = {} }) {
    const headers = corsHeaders(request);

    try {
        // Enforce required server configuration
        for (const key of ['JWT_SECRET', 'ADMIN_PASSWORD_HASH', 'ADMIN_EMAIL', 'MFA_SECRET']) {
            if (!env[key]) {
                return new Response(JSON.stringify({
                    status: 'CONFIGURATION_ERROR',
                    error: 'Required authentication secrets are not configured'
                }), { status: 503, headers });
            }
        }

        const body = await request.json().catch(() => ({}));

        if (body.refresh_token) {
            return new Response(JSON.stringify({
                status: 'REFRESH_REAUTH_REQUIRED'
            }), { status: 401, headers });
        }

        const emailMatch = constantTimeEqual(
            String(body.email || '').trim().toLowerCase(),
            env.ADMIN_EMAIL.trim().toLowerCase()
        );

        const passwordValid = await verifyPassword(String(body.password || ''), env.ADMIN_PASSWORD_HASH);

        if (!emailMatch || !passwordValid) {
            return new Response(JSON.stringify({
                status: 'INVALID_CREDENTIALS'
            }), { status: 401, headers });
        }

        const allowLegacy = env.ALLOW_LEGACY_TOTP_SECRET === 'true' || (env.ENVIRONMENT !== 'production' && env.ENVIRONMENT !== 'staging');
        const mfaResult = await verifyTotp(body.mfa_token, env.MFA_SECRET, { allowLegacyUtf8: allowLegacy });
        if (!mfaResult.valid) {
            return new Response(JSON.stringify({
                status: 'MFA_REQUIRED'
            }), { status: 401, headers });
        }

        // Anti-Replay check via SecurityCoordinator (fail closed on coordinator unavailability)
        const hasCoordinator = env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function';
        const requiresCoordinator = env.REQUIRE_SECURITY_COORDINATOR === 'true' || env.ENVIRONMENT === 'production' || env.ENVIRONMENT === 'staging';

        if (requiresCoordinator && !hasCoordinator) {
            return new Response(JSON.stringify({
                status: 'SECURITY_AUTHORITY_UNAVAILABLE',
                error: 'Required MFA anti-replay coordinator binding is missing in runtime environment'
            }), { status: 503, headers });
        }

        if (hasCoordinator) {
            try {
                const id = env.SECURITY_COORDINATOR.idFromName('mfa-replay-guard');
                const stub = env.SECURITY_COORDINATOR.get(id);
                const replayRes = await stub.fetch('https://coordinator/mfa-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: String(body.mfa_token), step: mfaResult.matchedStep })
                });
                if (replayRes.status === 409) {
                    return new Response(JSON.stringify({
                        status: 'REPLAY_DETECTED',
                        error: 'MFA TOTP code already used in this time step'
                    }), { status: 401, headers });
                }
                if (!replayRes.ok) {
                    return new Response(JSON.stringify({
                        status: 'SECURITY_AUTHORITY_UNAVAILABLE',
                        error: 'MFA anti-replay coordinator returned non-200 status'
                    }), { status: 503, headers });
                }
            } catch (_) {
                return new Response(JSON.stringify({
                    status: 'SECURITY_AUTHORITY_UNAVAILABLE',
                    error: 'MFA anti-replay coordinator communication failure'
                }), { status: 503, headers });
            }
        }

        const now = Math.floor(Date.now() / 1000);
        const sessionToken = await signJwt({
            sub: env.ADMIN_EMAIL,
            role: 'owner',
            hierarchy_level: 1,
            mfa_verified: true,
            iat: now,
            exp: now + 3600,
            jti: crypto.randomUUID()
        }, env.JWT_SECRET);

        // Append HttpOnly SameSite=Strict cookie for hardened browser session defense
        headers['Set-Cookie'] = `__Host-iinsha_admin_session=${sessionToken}; Path=/; Max-Age=3600; Secure; HttpOnly; SameSite=Strict`;

        return new Response(JSON.stringify({
            status: 'AUTHENTICATED',
            session_token: sessionToken,
            expires_in: 3600,
            user: {
                email: env.ADMIN_EMAIL,
                role: 'owner',
                hierarchy_level: 1,
                mfa_verified: true
            }
        }), { status: 200, headers });

    } catch (_) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: 'Authentication processing error'
        }), { status: 500, headers });
    }
}

export function onRequestGet({ request }) {
    const headers = corsHeaders(request);
    headers['Allow'] = 'POST, OPTIONS';
    return new Response(JSON.stringify({
        status: 'METHOD_NOT_ALLOWED',
        error: 'Use POST /api/auth/session'
    }), { status: 405, headers });
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
}
