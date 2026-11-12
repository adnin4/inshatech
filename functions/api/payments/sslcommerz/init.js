/**
 * SSLCommerz Legacy Init Endpoint (Hardened Fail-Closed Wrapper)
 * Authoritative payments must go through /api/payments/checkout with ibos_services lookup.
 */

const ORIGINS = new Set([
    'https://inshatech-b6b.pages.dev',
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com'
]);

function isOriginAllowed(origin) {
    if (!origin) return false;
    if (ORIGINS.has(origin)) return true;
    return /^https:\/\/[a-z0-9-]+\.(?:inshatech|inshatech-b6b)\.pages\.dev$/i.test(origin);
}

function getCorsHeaders(request) {
    const origin = request?.headers?.get('Origin') || '';
    return {
        'Access-Control-Allow-Origin': isOriginAllowed(origin) ? origin : 'https://inshatech-b6b.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
    };
}

export async function onRequestPost({ request }) {
    return new Response(JSON.stringify({
        status: 'DIRECT_AMOUNT_DISABLED',
        provider: 'SSLCommerz',
        message: 'Direct client-specified amounts are disabled. Initialize payment via /api/payments/checkout using a canonical service_id.'
    }), { status: 400, headers: getCorsHeaders(request) });
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: getCorsHeaders(request) });
}
