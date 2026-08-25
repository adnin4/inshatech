/**
 * Lemon Squeezy Official Production Integration — Checkout Session Creation
 * Upstream API: https://api.lemonsqueezy.com/v1/checkouts
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
        const apiKey = env.LEMONSQUEEZY_API_KEY;
        const storeId = env.LEMONSQUEEZY_STORE_ID;
        const variantId = env.LEMONSQUEEZY_VARIANT_ID;

        if (!apiKey || !storeId || !variantId) {
            return new Response(JSON.stringify({
                status: 'NOT_CONFIGURED',
                provider: 'Lemon Squeezy',
                message: 'LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, and LEMONSQUEEZY_VARIANT_ID required in Cloudflare Secrets.',
                code: 'CREDENTIALS_MISSING'
            }), { status: 422, headers: CORS_HEADERS });
        }

        const body = await request.json().catch(() => ({}));
        const orderId = String(body.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`);
        const amountUsd = Number(body.amount_usd || 0);

        if (amountUsd <= 0) {
            return new Response(JSON.stringify({ status: 'INVALID_AMOUNT', message: 'Amount in USD must be greater than 0' }), { status: 400, headers: CORS_HEADERS });
        }

        const upstreamRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                data: {
                    type: 'checkouts',
                    attributes: {
                        custom_price: Math.round(amountUsd * 100),
                        product_options: {
                            name: String(body.service_title || 'IINSHA AI Automation Package'),
                            description: `Order ${orderId} - Instant Delivery & SLA Active`,
                            redirect_url: `https://inshatech.pages.dev/portal.html?payment=success&order_id=${orderId}`
                        },
                        checkout_data: {
                            email: String(body.customer_email || 'client@inshatech.com'),
                            name: String(body.customer_name || 'Valued Client'),
                            custom: {
                                order_id: orderId
                            }
                        }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: 'stores',
                                id: storeId.toString()
                            }
                        },
                        variant: {
                            data: {
                                type: 'variants',
                                id: variantId.toString()
                            }
                        }
                    }
                }
            })
        });

        const data = await upstreamRes.json().catch(() => ({}));

        if (data.data?.attributes?.url) {
            return new Response(JSON.stringify({
                status: 'SUCCESS',
                provider: 'Lemon Squeezy',
                order_id: orderId,
                checkout_id: data.data.id,
                redirect_url: data.data.attributes.url,
                amount_usd: amountUsd
            }), { status: 200, headers: CORS_HEADERS });
        } else {
            return new Response(JSON.stringify({
                status: 'GATEWAY_INITIATION_FAILED',
                provider: 'Lemon Squeezy',
                errors: data.errors || 'Failed to create checkout session with Lemon Squeezy'
            }), { status: 502, headers: CORS_HEADERS });
        }

    } catch (err) {
        return new Response(JSON.stringify({ status: 'SERVER_ERROR', message: err.message }), { status: 500, headers: CORS_HEADERS });
    }
}

export function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
