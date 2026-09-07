/**
 * Browser payment-return endpoint.
 *
 * Security invariant:
 * A browser redirect can be forged, replayed, refreshed, or skipped. It MUST
 * NOT change payment state. Only an authenticated/verified provider webhook or
 * server-side provider verification may confirm payment.
 */

const PUBLIC_ORIGIN = 'https://inshatech.pages.dev';
const PORTAL_PATH = '/portal.html';
const ALLOWED_PROVIDERS = new Set(['sslcommerz', 'lemonsqueezy', 'bkash', 'stripe']);
const ALLOWED_STATUSES = new Set(['success', 'failed', 'cancelled', 'canceled', 'pending', 'unknown']);

function safeOrderCode(value) {
    const order = String(value || '').trim();
    return /^ORD-[A-Z0-9]{8,32}$/.test(order) ? order : '';
}

function safeProvider(value) {
    const provider = String(value || '').trim().toLowerCase();
    return ALLOWED_PROVIDERS.has(provider) ? provider : '';
}

export async function onRequestGet({ request }) {
    const url = new URL(request.url);
    const orderId = safeOrderCode(
        url.searchParams.get('order_id') ||
        url.searchParams.get('tran_id') ||
        url.searchParams.get('merchantInvoiceNumber')
    );
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
        message: 'Browser payment return is GET-only. Payment confirmation is handled by verified provider webhook/IPN processing.'
    }), {
        status: 405,
        headers: {
            'Content-Type': 'application/json',
            Allow: 'GET',
            'Cache-Control': 'no-store'
        }
    });
}
