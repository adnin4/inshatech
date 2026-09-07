/**
 * Browser payment-return endpoint.
 *
 * This endpoint is intentionally read-only. A browser return can be forged,
 * replayed, refreshed, or skipped, so it MUST NOT change payment state.
 * Only a verified provider webhook/IPN may confirm payment.
 */

const PUBLIC_ORIGIN = 'https://inshatech.pages.dev';
const PORTAL_PATH = '/portal.html';
const ALLOWED_STATUSES = new Set(['success', 'failed', 'cancelled', 'canceled', 'pending', 'unknown']);

function safeOrderCode(value) {
    const order = String(value || '').trim();
    return /^ORD-[A-Z0-9]{8,32}$/.test(order) ? order : '';
}

function safeProvider(value) {
    const provider = String(value || '').trim().toLowerCase();
    return ['sslcommerz', 'lemonsqueezy', 'bkash', 'stripe'].includes(provider) ? provider : '';
}

export async function onRequestGet({ request }) {
    const url = new URL(request.url);
    const orderId = safeOrderCode(url.searchParams.get('order_id'));
    const provider = safeProvider(url.searchParams.get('provider'));
    const requestedStatus = String(url.searchParams.get('status') || 'unknown').trim().toLowerCase();
    const status = ALLOWED_STATUSES.has(requestedStatus) ? requestedStatus : 'unknown';

    if (!orderId) {
        return new Response(JSON.stringify({
            status: 'INVALID_RETURN',
            message: 'A valid order_id is required.'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        });
    }

    const destination = new URL(PORTAL_PATH, PUBLIC_ORIGIN);
    destination.searchParams.set('order_id', orderId);
    destination.searchParams.set('payment_return', '1');
    destination.searchParams.set('status', status);
    if (provider) destination.searchParams.set('provider', provider);

    return Response.redirect(destination.toString(), 303);
}

export async function onRequestPost() {
    return new Response(JSON.stringify({
        status: 'METHOD_NOT_ALLOWED',
        message: 'Browser payment return is GET-only. Payment confirmation is handled by the provider webhook/IPN.'
    }), {
        status: 405,
        headers: {
            'Content-Type': 'application/json',
            Allow: 'GET',
            'Cache-Control': 'no-store'
        }
    });
}
