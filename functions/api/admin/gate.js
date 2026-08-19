/**
 * Cloudflare Pages Function: /api/admin/gate
 * Enterprise Admin Gate: Cryptographic JWT Verification, Expiration & Role Enforcement
 */

const ALLOWED_ORIGINS = [
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8788',
    'http://127.0.0.1:8788'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.pages.dev');
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const corsHeaders = getCorsHeaders(request);
    const authHeader = request.headers.get('Authorization') || '';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ 
            authenticated: false, 
            status: 'UNAUTHORIZED',
            error: 'Missing or malformed Bearer authorization token' 
        }), { status: 401, headers: corsHeaders });
    }

    const token = authHeader.split(' ')[1];
    const parts = token.split('.');

    if (parts.length < 2) {
        return new Response(JSON.stringify({ 
            authenticated: false, 
            status: 'INVALID_TOKEN',
            error: 'Token structure must be cryptographically signed' 
        }), { status: 401, headers: corsHeaders });
    }

    try {
        const secret = env.JWT_SECRET || env.ADMIN_SECRET_KEY || 'iinsha_enterprise_master_jwt_secret_2026';
        const encoder = new TextEncoder();

        const payloadB64 = parts[0];
        const signatureB64 = parts[1];

        // 1. Verify HMAC Signature over payloadB64
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const expectedSig = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
        const expectedSigB64 = btoa(String.fromCharCode(...new Uint8Array(expectedSig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

        if (expectedSigB64 !== signatureB64) {
            return new Response(JSON.stringify({ 
                authenticated: false, 
                status: 'FORGERY_REJECTED',
                error: 'Cryptographic signature verification failed' 
            }), { status: 401, headers: corsHeaders });
        }

        // 2. Parse and Validate Payload Expiration
        const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
        const nowSec = Math.floor(Date.now() / 1000);

        if (payload.exp && nowSec > payload.exp) {
            return new Response(JSON.stringify({ 
                authenticated: false, 
                status: 'TOKEN_EXPIRED',
                error: 'Admin session token has expired. Re-authentication required.' 
            }), { status: 401, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
            authenticated: true,
            status: 'AUTHORIZED',
            user: {
                email: payload.sub,
                name: payload.name || 'Adnin Sadat Mahin',
                role: payload.role || 'owner',
                hierarchy_level: payload.hierarchy_level || 1,
                mfa_verified: Boolean(payload.mfa_verified)
            },
            expires_at: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ 
            authenticated: false, 
            status: 'ERROR',
            error: err.message 
        }), { status: 500, headers: corsHeaders });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: getCorsHeaders(context.request),
        status: 204
    });
}
