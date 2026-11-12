/**
 * Fail-Closed Handler Factory for Legacy Direct/Simulated Payment Routes.
 * All authoritative payments must initialize through POST /api/payments/checkout
 * using server-side catalog lookups (ibos_services) and durable orders (ibos_orders).
 */

import { resolveCorsOrigin } from '../origin_policy.js';

function corsHeaders(request) {
    return {
        'Access-Control-Allow-Origin': resolveCorsOrigin(request),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
    };
}

export function createDirectBypassDisabledHandlers(providerName) {
    return {
        async onRequestPost({ request }) {
            return new Response(JSON.stringify({
                status: 'DIRECT_AMOUNT_DISABLED',
                provider: providerName,
                message: 'Direct client-specified amounts and simulated execution are disabled. Initialize payment via /api/payments/checkout using a canonical service_id.'
            }), { status: 400, headers: corsHeaders(request) });
        },
        onRequestOptions({ request }) {
            return new Response(null, { status: 204, headers: corsHeaders(request) });
        }
    };
}
