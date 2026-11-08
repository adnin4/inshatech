/**
 * IINSHA AI-BOS — Read-Only Browser Return Gateway
 * 
 * INVARIANT: This endpoint is strictly READ-ONLY.
 * It handles the customer's browser redirection after completing payment at a gateway.
 * 
 * RULES:
 * 1. Accepts GET only (POST returns 405 Method Not Allowed; browser GET queries read-only status).
 * 2. Resolves order status from database if Supabase credentials exist.
 * 3. NEVER mutates order payment_status to 'paid'.
 * 4. Redirects to /portal.html?order_id=... with explanatory status indicators.
 */

const ORIGINS = new Set(['https://inshatech.pages.dev', 'https://inshatech.com', 'https://www.inshatech.com', 'https://admin.inshatech.com']);
const cors = r => {
    const o = r.headers.get('Origin') || '';
    return {
        'Access-Control-Allow-Origin': ORIGINS.has(o) ? o : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
};

export async function onRequestGet(context) {
    return handleBrowserReturn(context);
}

export async function onRequestPost({ request }) {
    const h = cors(request);
    return new Response(JSON.stringify({
        status: 'METHOD_NOT_ALLOWED',
        error: 'Method Not Allowed',
        message: 'Browser payment return endpoint is strictly GET-only and read-only.'
    }), { status: 405, headers: h });
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: cors(request) });
}

async function handleBrowserReturn({ request, env = {} }) {
    const h = cors(request);
    const url = new URL(request.url);

    let orderId = url.searchParams.get('order_id') || url.searchParams.get('tran_id') || '';
    let status = url.searchParams.get('status') || '';
    let gateway = url.searchParams.get('gateway') || url.searchParams.get('provider') || 'generic';

    orderId = String(orderId || '').trim();

    // Read-only state resolution
    let currentPaymentStatus = 'awaiting_confirmation';
    let serviceName = 'IINSHA Service';

    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && orderId) {
        try {
            const base = `${env.SUPABASE_URL}/rest/v1`;
            const key = env.SUPABASE_SERVICE_ROLE_KEY;
            const auth = { apikey: key, Authorization: `Bearer ${key}` };

            const checkRes = await fetch(`${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderId)}&select=payment_status,order_status,service_title`, {
                headers: auth
            });

            if (checkRes.ok) {
                const orders = await checkRes.json().catch(() => []);
                if (Array.isArray(orders) && orders.length > 0) {
                    currentPaymentStatus = orders[0].payment_status || 'awaiting_payment';
                    serviceName = orders[0].service_title || serviceName;
                }
            }
        } catch (dbErr) {
            console.warn('Browser return read-only check notice:', dbErr.message);
        }
    }

    const portalRedirectUrl = `https://inshatech.pages.dev/portal.html?order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status)}&payment_status=${encodeURIComponent(currentPaymentStatus)}`;

    // If browser accepts HTML, redirect to customer portal
    const acceptHeader = request.headers.get('Accept') || '';
    if (acceptHeader.includes('text/html')) {
        return new Response(null, {
            status: 302,
            headers: {
                'Location': portalRedirectUrl,
                'Cache-Control': 'no-store'
            }
        });
    }

    // Otherwise return clean JSON status
    return new Response(JSON.stringify({
        status: 'BROWSER_RETURN_RECORDED',
        order_id: orderId,
        payment_status: currentPaymentStatus,
        service_name: serviceName,
        portal_url: portalRedirectUrl,
        security_notice: 'Payment confirmation is authoritative only via signed server-to-server webhook/IPN.',
        timestamp: new Date().toISOString()
    }), { status: 200, headers: h });
}