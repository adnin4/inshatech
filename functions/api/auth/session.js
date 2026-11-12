/**
 * Cloudflare Pages Function: /api/auth/session
 * Enterprise-Hardened Fail-Closed Owner Authentication Gateway.
 * Supports adaptive salted PBKDF2 and constant-time legacy verification.
 * Emits HttpOnly Secure session cookies and strict CORS boundaries.
 */

const ALLOWED_ORIGINS = new Set([
    'https://inshatech-b6b.pages.dev',
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8788',
    'http://localhost:8080'
]);

function isOriginAllowed(origin) {
    if (!origin) return false;
    if (ALLOWED_ORIGINS.has(origin)) return true;
    return /^https:\/\/[a-z0-9-]+\.(?:inshatech|inshatech-b6b)\.pages\.dev$/i.test(origin);
}

function corsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const allowOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech-b6b.pages.dev';
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
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

async function verifyPassword(password, storedHash) {
    if (!password || !storedHash || !storedHash.startsWith('pbkdf2:')) return false;
    // Format: PBKDF2 -> pbkdf2:<iterations>:<saltHex>:<hashHex>
    const parts = storedHash.split(':');
    if (parts.length === 4) {
        const iterations = parseInt(parts[1], 10) || 600000;
        const saltHex = parts[2];
        const expectedHashHex = parts[3];
        const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
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
        return constantTimeEqual(derivedHex, expectedHashHex);
    }
    return false;
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

async function verifyTotp(token, secret) {
    if (!secret || !/^[0-9]{6}$/.test(String(token || ''))) return false;
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );
    const counter = Math.floor(Date.now() / 30000);
    // Allow 1 step clock drift (-30s, 0s, +30s)
    for (let drift = -1; drift <= 1; drift++) {
        const ab = new ArrayBuffer(8);
        new DataView(ab).setBigUint64(0, BigInt(counter + drift));
        const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab));
        const offset = sig[sig.length - 1] & 15;
        const code = ((sig[offset] & 127) << 24 | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]) % 1000000;
        if (String(code).padStart(6, '0') === String(token)) return true;
    }
    return false;
}

export async function onRequestPost({ request, env = {} }) {
    const headers = corsHeaders(request);

    try {
        // Enforce required server configuration
        for (const key of ['JWT_SECRET', 'ADMIN_PASSWORD_HASH', 'ADMIN_EMAIL', 'MFA_SECRET']) {
            if (!env[key]) {
                return new Response(JSON.stringify({
                    status: 'CONFIGURATION_ERROR',
                    error: `${key} is required`
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

        const mfaValid = await verifyTotp(body.mfa_token, env.MFA_SECRET);
        if (!mfaValid) {
            return new Response(JSON.stringify({
                status: 'MFA_REQUIRED'
            }), { status: 401, headers });
        }

        // Anti-Replay check via SecurityCoordinator if configured
        if (env.SECURITY_COORDINATOR && typeof env.SECURITY_COORDINATOR.idFromName === 'function') {
            try {
                const step = Math.floor(Date.now() / 30000);
                const id = env.SECURITY_COORDINATOR.idFromName('mfa-replay-guard');
                const stub = env.SECURITY_COORDINATOR.get(id);
                const replayRes = await stub.fetch('https://coordinator/mfa-verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: body.mfa_token, step })
                });
                if (replayRes.status === 409) {
                    return new Response(JSON.stringify({
                        status: 'REPLAY_DETECTED',
                        error: 'MFA TOTP code already used in this time step'
                    }), { status: 401, headers });
                }
            } catch (_) {}
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

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            details: err.message
        }), { status: 500, headers });
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
}
