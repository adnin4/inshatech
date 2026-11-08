/**
 * Stripe Official Production Integration — Checkout Session Creation
 * Upstream API: https://api.stripe.com/v1/checkout/sessions
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://inshatech.pages.dev',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
};

export async function onRequestPost({ request, env = {} }) {
    try {
        const stripeKey = env.STRIPE_SECRET_KEY;

        if (!stripeKey) {
            return new Response(JSON.stringify({
                status: 'NOT_CONFIGURED',
                provider: 'Stripe',
                message: 'STRIPE_SECRET_KEY required in Cloudflare Environment Secrets.',
                code: 'CREDENTIALS_MISSING'
            }), { status: 422, headers: CORS_HEADERS });
        }

        const body = await request.json().catch(() => ({}));
        const orderId = String(body.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`);
        const amountUsd = Number(body.amount_usd || 0);

        if (amountUsd <= 0) {
            return new Response(JSON.stringify({ status: 'INVALID_AMOUNT', message: 'Amount in USD must be greater than 0' }), { status: 400, headers: CORS_HEADERS });
        }

        const postParams = new URLSearchParams({
            'success_url': `https://inshatech.pages.dev/portal.html?payment=success&session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            'cancel_url': `https://inshatech.pages.dev/store.html?canceled=true&order_id=${orderId}`,
            'payment_method_types[0]': 'card',
            'mode': 'payment',
            'customer_email': String(body.customer_email || 'client@inshatech.com'),
            'client_reference_id': orderId,
            'line_items[0][price_data][currency]': 'usd',
            'line_items[0][price_data][unit_amount]': Math.round(amountUsd * 100).toString(),
            'line_items[0][price_data][product_data][name]': String(body.service_title || 'IINSHA AI Automation Service'),
            'line_items[0][quantity]': '1',
            'metadata[order_id]': orderId
        });

        const upstreamRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${stripeKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postParams.toString()
        });

        const data = await upstreamRes.json().catch(() => ({}));

        if (data.url) {
            return new Response(JSON.stringify({
                status: 'SUCCESS',
                provider: 'Stripe',
                order_id: orderId,
                session_id: data.id,
                redirect_url: data.url,
                amount_usd: amountUsd
            }), { status: 200, headers: CORS_HEADERS });
        } else {
            return new Response(JSON.stringify({
                status: 'GATEWAY_INITIATION_FAILED',
                provider: 'Stripe',
                error: data.error?.message || 'Failed to create Stripe Checkout session'
            }), { status: 502, headers: CORS_HEADERS });
        }

    } catch (err) {
        return new Response(JSON.stringify({ status: 'SERVER_ERROR', message: err.message }), { status: 500, headers: CORS_HEADERS });
    }
}

export function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
