/**
 * IINSHA AI-BOS checkout gateway.
 *
 * Security contract:
 * - server-side catalog is authoritative for price and product identity
 * - unknown service/provider is rejected
 * - idempotency key is required
 * - durable order is created before an upstream gateway request
 * - client-supplied amount is never trusted
 * - gateway failures never become payment success
 */

const ORIGINS = new Set([
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com'
]);

const CATALOG = {
    'b2b-lead-swarm': ['B2B SaaS 5-Agent Hunter Swarm', 850, 700, 3],
    'ecommerce-ai-whatsapp': ['24/7 E-Commerce WhatsApp & Messenger Sales Agent', 750, 600, 2],
    'voice-ai-receptionist': ['AI Voice Receptionist (Twilio + Gemini WebRTC)', 1800, 1500, 5],
    'n8n-docker-cluster': ['Self-Hosted n8n Enterprise Cluster Deployment', 497, 400, 1],
    'invoice-ocr-pipeline': ['Autonomous Invoice & Document OCR Pipeline', 249, 200, 1],
    'ai-saas-mvp': ['Full-Stack Autonomous AI SaaS MVP', 2500, 2000, 7],
    'custom-agent-swarm': ['Custom Multi-Agent Department Mesh', 1200, 1000, 4],
    'playwright-scraping-farm': ['Authorized Web Data Pipeline', 75, 50, 1],
    'stripe-churn-recovery': ['Stripe Churn Recovery n8n Engine', 50, 40, 1],
    'apollo-enrichment-leadgen': ['Apollo MX Verifier & Enrichment Swarm', 60, 45, 1]
};

const PROVIDERS = new Set(['sslcommerz', 'lemonsqueezy', 'bkash', 'stripe']);
const BDT_RATE = 122.5;

function cors(request) {
    const origin = request.headers.get('Origin') || '';
    return {
        'Access-Control-Allow-Origin': ORIGINS.has(origin) ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Idempotency-Key',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
}

function json(status, payload, headers) {
    return new Response(JSON.stringify(payload), { status, headers });
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function supabaseRequest(env, path, init = {}) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('PAYMENT_DATABASE_NOT_CONFIGURED');
    }

    const key = env.SUPABASE_SERVICE_ROLE_KEY;
    const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, {
        ...init,
        headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            ...(init.headers || {})
        }
    });

    const text = await response.text();
    let body = {};
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }

    return { response, body };
}

async function findExistingOrder(env, idempotencyKey) {
    const { response, body } = await supabaseRequest(
        env,
        `ibos_orders?select=id,order_code,payment_status,order_status,payment_provider,amount,currency,bdt_amount& idempotency_key=eq.${encodeURIComponent(idempotencyKey)}`.replace(' ', ''),
        { method: 'GET' }
    );
    if (!response.ok) throw new Error(`ORDER_LOOKUP_FAILED_${response.status}`);
    return Array.isArray(body) ? body[0] || null : null;
}

async function createOrder(env, order) {
    const { response, body } = await supabaseRequest(env, 'ibos_orders', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(order)
    });

    if (response.status === 409) {
        return { duplicate: true, order: await findExistingOrder(env, order.idempotency_key) };
    }

    if (!response.ok) {
        throw new Error(`ORDER_CREATE_FAILED_${response.status}`);
    }

    return { duplicate: false, order: Array.isArray(body) ? body[0] : body };
}

export async function onRequestPost({ request, env = {} }) {
    const H = cors(request);

    try {
        const body = await request.json();
        const serviceId = String(body?.service_id || '').trim();
        const provider = String(body?.payment_provider || '').trim().toLowerCase();
        const idempotencyKey = String(request.headers.get('Idempotency-Key') || body?.idempotency_key || '').trim();
        const customerName = String(body?.customer_name || '').trim().slice(0, 255);
        const customerEmail = String(body?.customer_email || '').trim().slice(0, 255);
        const customerPhone = String(body?.customer_phone || '').trim().slice(0, 50);

        if (!serviceId || !CATALOG[serviceId]) {
            return json(400, { status: 'INVALID_SERVICE', message: 'Unknown service_id.' }, H);
        }
        if (!PROVIDERS.has(provider)) {
            return json(400, { status: 'INVALID_PROVIDER', message: 'Unsupported payment provider.' }, H);
        }
        if (!idempotencyKey || idempotencyKey.length < 12 || idempotencyKey.length > 255) {
            return json(400, { status: 'IDEMPOTENCY_KEY_REQUIRED', message: 'Provide a stable Idempotency-Key for the checkout request.' }, H);
        }
        if (!customerName || !validEmail(customerEmail)) {
            return json(400, { status: 'INVALID_CUSTOMER', message: 'Valid customer name and email are required.' }, H);
        }

        const [serviceTitle, listPrice, minimumPrice, deliveryDays] = CATALOG[serviceId];

        let usdAmount = listPrice;
        const coupon = String(body?.coupon_code || '').trim().toUpperCase();
        if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') usdAmount = Math.round(listPrice * 0.90);
        else if (coupon === 'APEX15') usdAmount = Math.round(listPrice * 0.85);
        usdAmount = Math.max(minimumPrice, usdAmount);
        const bdtAmount = Math.round(usdAmount * BDT_RATE);

        const existing = await findExistingOrder(env, idempotencyKey);
        if (existing) {
            return json(200, {
                status: 'IDEMPOTENT_REPLAY',
                order_id: existing.order_code,
                payment_status: existing.payment_status,
                order_status: existing.order_status,
                provider: existing.payment_provider,
                amount_usd: Number(existing.amount),
                amount_bdt: Number(existing.bdt_amount)
            }, H);
        }

        const orderId = `ORD-${crypto.randomUUID().replaceAll('-', '').slice(0, 20).toUpperCase()}`;
        const orderPayload = {
            order_code: orderId,
            service_title: serviceTitle,
            service_slug: serviceId,
            package_name: serviceTitle,
            amount: usdAmount,
            currency: 'USD',
            bdt_amount: bdtAmount,
            client_name: customerName,
            client_email: customerEmail,
            client_phone: customerPhone || null,
            affiliate_ref_code: body?.affiliate_ref_code ? String(body.affiliate_ref_code).trim().slice(0, 100) : null,
            affiliate_commission: 0,
            payment_status: 'pending',
            order_status: 'processing',
            idempotency_key: idempotencyKey,
            payment_provider: provider,
            metadata: {
                catalog_version: 'server-catalog-v1',
                delivery_days: deliveryDays,
                coupon: coupon || null,
                created_from: 'payment_checkout'
            }
        };

        const created = await createOrder(env, orderPayload);
        if (created.duplicate && created.order) {
            return json(200, {
                status: 'IDEMPOTENT_REPLAY',
                order_id: created.order.order_code,
                payment_status: created.order.payment_status,
                order_status: created.order.order_status,
                provider: created.order.payment_provider,
                amount_usd: Number(created.order.amount),
                amount_bdt: Number(created.order.bdt_amount)
            }, H);
        }

        let redirectUrl = null;
        let gatewayReference = null;
        let gatewayResponse = {};

        if (provider === 'sslcommerz') {
            const storeId = env.SSLCOMMERZ_STORE_ID;
            const storePass = env.SSLCOMMERZ_STORE_PASSWORD;
            if (!storeId || !storePass) {
                return json(503, { status: 'GATEWAY_NOT_CONFIGURED', gateway: 'SSLCommerz', order_id: orderId }, H);
            }

            const postData = new URLSearchParams({
                store_id: storeId,
                store_passwd: storePass,
                total_amount: String(bdtAmount),
                currency: 'BDT',
                tran_id: orderId,
                success_url: `https://inshatech.pages.dev/api/payments/webhook?status=success&order_id=${encodeURIComponent(orderId)}`,
                fail_url: `https://inshatech.pages.dev/api/payments/webhook?status=failed&order_id=${encodeURIComponent(orderId)}`,
                cancel_url: `https://inshatech.pages.dev/store.html?canceled=${encodeURIComponent(orderId)}`,
                cus_name: customerName,
                cus_email: customerEmail,
                cus_add1: 'Dhaka, Bangladesh',
                cus_city: 'Dhaka',
                cus_country: 'Bangladesh',
                cus_phone: customerPhone,
                shipping_method: 'NO',
                product_name: serviceTitle,
                product_category: 'AI Software & Automation',
                product_profile: 'non-physical-goods'
            });

            const upstream = await fetch('https://securepay.sslcommerz.com/gwprocess/v4/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: postData.toString()
            });
            gatewayResponse = await upstream.json().catch(() => ({}));
            redirectUrl = gatewayResponse.GatewayPageURL || null;
            gatewayReference = gatewayResponse.sessionkey || gatewayResponse.tran_id || null;
        }

        if (provider === 'lemonsqueezy') {
            const apiKey = env.LEMONSQUEEZY_API_KEY;
            const storeId = env.LEMONSQUEEZY_STORE_ID;
            const variantId = env.LEMONSQUEEZY_VARIANT_ID;
            if (!apiKey || !storeId || !variantId) {
                return json(503, { status: 'GATEWAY_NOT_CONFIGURED', gateway: 'Lemon Squeezy', order_id: orderId }, H);
            }

            const upstream = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
                method: 'POST',
                headers: {
                    Accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    data: {
                        type: 'checkouts',
                        attributes: {
                            custom_price: Math.round(usdAmount * 100),
                            product_options: {
                                name: serviceTitle,
                                description: `Order ${orderId} - Delivery SLA: ${deliveryDays} days`,
                                redirect_url: `https://inshatech.pages.dev/portal.html?order_id=${encodeURIComponent(orderId)}`
                            },
                            checkout_data: {
                                email: customerEmail,
                                name: customerName,
                                custom: { order_id: orderId }
                            }
                        },
                        relationships: {
                            store: { data: { type: 'stores', id: String(storeId) } },
                            variant: { data: { type: 'variants', id: String(variantId) } }
                        }
                    }
                })
            });
            gatewayResponse = await upstream.json().catch(() => ({}));
            redirectUrl = gatewayResponse.data?.attributes?.url || null;
            gatewayReference = gatewayResponse.data?.id || null;
        }

        if (provider === 'bkash') {
            const appKey = env.BKASH_APP_KEY;
            const appSecret = env.BKASH_APP_SECRET;
            const username = env.BKASH_USERNAME;
            const password = env.BKASH_PASSWORD;
            if (!appKey || !appSecret || !username || !password) {
                return json(503, { status: 'GATEWAY_NOT_CONFIGURED', gateway: 'bKash', order_id: orderId }, H);
            }

            const tokenRes = await fetch('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', username, password },
                body: JSON.stringify({ app_key: appKey, app_secret: appSecret })
            });
            const tokenData = await tokenRes.json().catch(() => ({}));
            if (!tokenData.id_token) {
                return json(502, { status: 'GATEWAY_ERROR', gateway: 'bKash', order_id: orderId }, H);
            }

            const createRes = await fetch('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: tokenData.id_token,
                    'X-APP-Key': appKey
                },
                body: JSON.stringify({
                    mode: '0011',
                    payerReference: customerPhone || customerEmail,
                    callbackURL: `https://inshatech.pages.dev/api/payments/webhook?provider=bkash&order_id=${encodeURIComponent(orderId)}`,
                    amount: String(bdtAmount),
                    currency: 'BDT',
                    intent: 'sale',
                    merchantInvoiceNumber: orderId
                })
            });
            gatewayResponse = await createRes.json().catch(() => ({}));
            redirectUrl = gatewayResponse.bkashURL || null;
            gatewayReference = gatewayResponse.paymentID || gatewayResponse.trxID || null;
        }

        if (provider === 'stripe') {
            const stripeKey = env.STRIPE_SECRET_KEY;
            if (!stripeKey) {
                return json(503, { status: 'GATEWAY_NOT_CONFIGURED', gateway: 'Stripe', order_id: orderId }, H);
            }

            const params = new URLSearchParams({
                success_url: `https://inshatech.pages.dev/portal.html?session_id={CHECKOUT_SESSION_ID}&order_id=${encodeURIComponent(orderId)}`,
                cancel_url: `https://inshatech.pages.dev/store.html?canceled=true`,
                'payment_method_types[0]': 'card',
                mode: 'payment',
                customer_email: customerEmail,
                client_reference_id: orderId,
                'line_items[0][price_data][currency]': 'usd',
                'line_items[0][price_data][unit_amount]': String(Math.round(usdAmount * 100)),
                'line_items[0][price_data][product_data][name]': serviceTitle,
                'line_items[0][quantity]': '1'
            });

            const upstream = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });
            gatewayResponse = await upstream.json().catch(() => ({}));
            redirectUrl = gatewayResponse.url || null;
            gatewayReference = gatewayResponse.id || null;
        }

        if (!redirectUrl) {
            return json(502, {
                status: 'GATEWAY_ERROR',
                order_id: orderId,
                message: 'Gateway did not return a checkout URL. The durable order remains pending for reconciliation.'
            }, H);
        }

        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && gatewayReference) {
            const { response } = await supabaseRequest(
                env,
                `ibos_orders?order_code=eq.${encodeURIComponent(orderId)}`,
                {
                    method: 'PATCH',
                    headers: { Prefer: 'return=minimal' },
                    body: JSON.stringify({ payment_reference: String(gatewayReference).slice(0, 255), updated_at: new Date().toISOString() })
                }
            );
            if (!response.ok) {
                return json(502, {
                    status: 'ORDER_RECONCILIATION_REQUIRED',
                    order_id: orderId,
                    message: 'Checkout was created upstream but the local payment reference could not be persisted.'
                }, H);
            }
        }

        return json(200, {
            status: 'CHECKOUT_CREATED',
            order_id: orderId,
            provider,
            amount_usd: usdAmount,
            amount_bdt: bdtAmount,
            redirect_url: redirectUrl
        }, H);

    } catch (error) {
        const message = error instanceof Error ? error.message : 'UNKNOWN_CHECKOUT_ERROR';
        return json(message === 'PAYMENT_DATABASE_NOT_CONFIGURED' ? 503 : 500, {
            status: 'CHECKOUT_ERROR',
            message
        }, cors(request));
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: cors(request) });
}
