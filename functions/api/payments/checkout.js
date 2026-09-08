/**
 * IINSHA AI-BOS — Payment Checkout
 *
 * Payment authority rules:
 * - Client input is untrusted for service identity, price, currency and payment state.
 * - Orders are persisted using the canonical ibos_orders schema.
 * - Frontend never becomes payment authority.
 */

const ORIGINS = new Set([
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com'
]);

const cors = r => {
    const o = r.headers.get('Origin') || '';
    return {
        'Access-Control-Allow-Origin': ORIGINS.has(o) ? o : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
};

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

const BDT_RATE = 122.5;

export async function onRequestPost({ request, env = {} }) {
    const h = cors(request);

    try {
        const b = await request.json().catch(() => ({}));
        const serviceSlug = String(b.service_id || '').trim();

        if (!serviceSlug || !CATALOG[serviceSlug]) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                code: 'INVALID_SERVICE_ID',
                message: `Service ID '${serviceSlug}' is not recognized by server catalog authority.`
            }), { status: 400, headers: h });
        }

        const item = CATALOG[serviceSlug];

        const rawEmail = String(b.customer_email || '').trim().toLowerCase();
        if (!rawEmail || !rawEmail.includes('@') || rawEmail.length < 5) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                code: 'INVALID_CUSTOMER_EMAIL',
                message: 'A valid customer email address is required.'
            }), { status: 400, headers: h });
        }

        const customerName = String(b.customer_name || 'Valued Client').slice(0, 255);
        const customerEmail = rawEmail.slice(0, 255);
        const customerPhone = String(b.customer_phone || '+8801629286887').slice(0, 50);
        const provider = String(b.payment_provider || 'sslcommerz').toLowerCase().trim();

        // Existing public API is preserved, but price authority is recalculated server-side.
        let usdAmount = Number(item[1]);
        const coupon = String(b.coupon_code || '').toUpperCase().trim();
        if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') usdAmount = Math.round(usdAmount * 0.90);
        else if (coupon === 'APEX15') usdAmount = Math.round(usdAmount * 0.85);
        usdAmount = Math.max(Number(item[2]), usdAmount);
        const bdtAmount = Math.round(usdAmount * BDT_RATE);

        const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const idempotencyKey = String(b.idempotency_key || `idem_${orderId}`).slice(0, 128);

        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            return new Response(JSON.stringify({
                status: 'DATABASE_CONFIGURATION_REQUIRED',
                message: 'Supabase server configuration is required before creating a durable payment order.'
            }), { status: 500, headers: h });
        }

        const base = `${env.SUPABASE_URL}/rest/v1`;
        const key = env.SUPABASE_SERVICE_ROLE_KEY;
        const auth = {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
        };

        const existingRes = await fetch(
            `${base}/ibos_orders?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=order_code,amount,currency,bdt_amount,payment_provider,payment_status,order_status&limit=1`,
            { method: 'GET', headers: auth }
        );
        if (existingRes.ok) {
            const existingOrders = await existingRes.json().catch(() => []);
            if (Array.isArray(existingOrders) && existingOrders.length > 0) {
                const existing = existingOrders[0];
                return new Response(JSON.stringify({
                    status: 'SUCCESS',
                    action: 'idempotent_order_reused',
                    order_id: existing.order_code,
                    provider: existing.payment_provider || provider,
                    amount_usd: existing.amount !== null && existing.amount !== undefined ? Number(existing.amount) : usdAmount,
                    amount_bdt: existing.bdt_amount !== null && existing.bdt_amount !== undefined ? Number(existing.bdt_amount) : bdtAmount,
                    redirect_url: null,
                    payment_status: existing.payment_status || 'awaiting_payment'
                }), { status: 200, headers: h });
            }
        }

        // Step 02/03 compatible authority lookup: the canonical DB service determines
        // UUID/title/price. The static catalog remains only for backwards-compatible
        // package metadata until the package selector is made fully database-driven.
        const sLookupRes = await fetch(
            `${base}/ibos_services?slug=eq.${encodeURIComponent(serviceSlug)}&status=eq.published&select=id,slug,title,price,packages&limit=1`,
            { method: 'GET', headers: auth }
        );
        if (!sLookupRes.ok) {
            return new Response(JSON.stringify({
                status: 'DATABASE_ERROR',
                code: 'SERVICE_LOOKUP_FAILED',
                message: 'Unable to resolve the selected published service from the canonical database.'
            }), { status: 500, headers: h });
        }

        const serviceRows = await sLookupRes.json().catch(() => []);
        if (!Array.isArray(serviceRows) || serviceRows.length !== 1 || !serviceRows[0]?.id) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                code: 'SERVICE_NOT_AVAILABLE',
                message: 'The selected service is not uniquely available as a published catalog item.'
            }), { status: 409, headers: h });
        }

        const service = serviceRows[0];
        const serviceTitle = String(service.title || item[0]).slice(0, 255);
        const servicePrice = Number(service.price);
        if (!Number.isFinite(servicePrice) || servicePrice < 0) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                code: 'INVALID_SERVICE_PRICE',
                message: 'The selected service has an invalid server-side price configuration.'
            }), { status: 500, headers: h });
        }

        // The DB price is the authoritative base price. Coupon rules remain unchanged
        // for now; their lifecycle/eligibility engine is the next dedicated gate.
        let authoritativeUsdAmount = servicePrice;
        if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') authoritativeUsdAmount = Math.round(authoritativeUsdAmount * 0.90);
        else if (coupon === 'APEX15') authoritativeUsdAmount = Math.round(authoritativeUsdAmount * 0.85);
        authoritativeUsdAmount = Math.max(Number(item[2]), authoritativeUsdAmount);
        const authoritativeBdtAmount = Math.round(authoritativeUsdAmount * BDT_RATE);

        const dbOrderPayload = {
            order_code: orderId,
            service_id: service.id,
            service_slug: String(service.slug || serviceSlug).slice(0, 255),
            service_title: serviceTitle,
            package_name: 'Standard',
            amount: authoritativeUsdAmount,
            currency: 'USD',
            bdt_amount: authoritativeBdtAmount,
            client_name: customerName,
            client_email: customerEmail,
            client_phone: customerPhone,
            payment_provider: provider,
            payment_status: 'awaiting_payment',
            order_status: 'pending',
            idempotency_key: idempotencyKey,
            metadata: {
                coupon_applied: coupon || null,
                client_ip: request.headers.get('CF-Connecting-IP') || null,
                user_agent: request.headers.get('User-Agent') || null,
                authority: 'server',
                catalog_source: 'ibos_services'
            },
            created_at: new Date().toISOString()
        };

        const dbRes = await fetch(`${base}/ibos_orders`, {
            method: 'POST',
            headers: { ...auth, Prefer: 'return=representation' },
            body: JSON.stringify(dbOrderPayload)
        });

        if (!dbRes.ok) {
            const errText = await dbRes.text().catch(() => 'DB error');
            if (dbRes.status === 409 || dbRes.status === 422) {
                const retryRes = await fetch(
                    `${base}/ibos_orders?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=order_code,amount,currency,bdt_amount,payment_provider,payment_status,order_status&limit=1`,
                    { method: 'GET', headers: auth }
                );
                if (retryRes.ok) {
                    const retryRows = await retryRes.json().catch(() => []);
                    if (Array.isArray(retryRows) && retryRows.length > 0) {
                        const existing = retryRows[0];
                        return new Response(JSON.stringify({
                            status: 'SUCCESS',
                            action: 'idempotent_order_reused',
                            order_id: existing.order_code,
                            provider: existing.payment_provider || provider,
                            amount_usd: existing.amount !== null && existing.amount !== undefined ? Number(existing.amount) : authoritativeUsdAmount,
                            amount_bdt: existing.bdt_amount !== null && existing.bdt_amount !== undefined ? Number(existing.bdt_amount) : authoritativeBdtAmount,
                            redirect_url: null,
                            payment_status: existing.payment_status || 'awaiting_payment'
                        }), { status: 200, headers: h });
                    }
                }
            }

            return new Response(JSON.stringify({
                status: 'DATABASE_ERROR',
                code: 'ORDER_PERSIST_FAILED',
                message: 'Failed to persist the canonical durable order record before checkout.',
                detail: errText
            }), { status: 500, headers: h });
        }

        const usdForGateway = authoritativeUsdAmount;
        const bdtForGateway = authoritativeBdtAmount;
        let redirectUrl = null;
        let gatewayResponse = {};

        if (provider === 'sslcommerz') {
            const storeId = env.SSLCOMMERZ_STORE_ID;
            const storePass = env.SSLCOMMERZ_STORE_PASSWORD;
            if (storeId && storePass) {
                const postData = new URLSearchParams({
                    store_id: storeId,
                    store_passwd: storePass,
                    total_amount: bdtForGateway.toString(),
                    currency: 'BDT',
                    tran_id: orderId,
                    success_url: `https://inshatech.pages.dev/api/payments/return?order_id=${orderId}&status=success`,
                    fail_url: `https://inshatech.pages.dev/api/payments/return?order_id=${orderId}&status=failed`,
                    cancel_url: `https://inshatech.pages.dev/api/payments/return?order_id=${orderId}&status=canceled`,
                    ipn_url: 'https://inshatech.pages.dev/api/payments/webhook',
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
                const liveRes = await fetch('https://securepay.sslcommerz.com/gwprocess/v4/api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: postData.toString()
                });
                gatewayResponse = await liveRes.json().catch(() => ({}));
                if (gatewayResponse.GatewayPageURL) redirectUrl = gatewayResponse.GatewayPageURL;
            } else {
                return new Response(JSON.stringify({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'SSLCommerz',
                    message: 'SSLCommerz Store ID & Store Password must be set in Cloudflare Environment Secrets.',
                    order_id: orderId,
                    amount_bdt: bdtForGateway
                }), { status: 422, headers: h });
            }
        } else if (provider === 'lemonsqueezy') {
            const apiKey = env.LEMONSQUEEZY_API_KEY;
            const storeId = env.LEMONSQUEEZY_STORE_ID;
            const variantId = env.LEMONSQUEEZY_VARIANT_ID;
            if (apiKey && storeId && variantId) {
                const liveRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
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
                                custom_price: Math.round(usdForGateway * 100),
                                product_options: {
                                    name: serviceTitle,
                                    description: `Order ${orderId} - Instant Delivery SLA: ${item[3]} Days`,
                                    redirect_url: `https://inshatech.pages.dev/portal.html?order_id=${orderId}`
                                },
                                checkout_data: {
                                    email: customerEmail,
                                    name: customerName,
                                    custom: { order_id: orderId }
                                }
                            },
                            relationships: {
                                store: { data: { type: 'stores', id: storeId.toString() } },
                                variant: { data: { type: 'variants', id: variantId.toString() } }
                            }
                        }
                    })
                });
                gatewayResponse = await liveRes.json().catch(() => ({}));
                if (gatewayResponse.data?.attributes?.url) redirectUrl = gatewayResponse.data.attributes.url;
            } else {
                return new Response(JSON.stringify({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'Lemon Squeezy',
                    message: 'LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, and LEMONSQUEEZY_VARIANT_ID required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_usd: usdForGateway
                }), { status: 422, headers: h });
            }
        } else if (provider === 'bkash') {
            const appKey = env.BKASH_APP_KEY;
            const appSecret = env.BKASH_APP_SECRET;
            const username = env.BKASH_USERNAME;
            const password = env.BKASH_PASSWORD;
            if (appKey && appSecret && username && password) {
                const tokenRes = await fetch('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', username, password },
                    body: JSON.stringify({ app_key: appKey, app_secret: appSecret })
                });
                const tokenData = await tokenRes.json().catch(() => ({}));
                if (tokenData.id_token) {
                    const createRes = await fetch('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: tokenData.id_token,
                            'X-APP-Key': appKey
                        },
                        body: JSON.stringify({
                            mode: '0011',
                            payerReference: customerPhone,
                            callbackURL: `https://inshatech.pages.dev/api/payments/return?order_id=${orderId}&provider=bkash&status=return`,
                            amount: bdtForGateway.toString(),
                            currency: 'BDT',
                            intent: 'sale',
                            merchantInvoiceNumber: orderId
                        })
                    });
                    const createData = await createRes.json().catch(() => ({}));
                    if (createData.bkashURL) {
                        redirectUrl = createData.bkashURL;
                        gatewayResponse = createData;
                    }
                }
            } else {
                return new Response(JSON.stringify({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'bKash Tokenized Merchant',
                    message: 'BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, and BKASH_PASSWORD required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_bdt: bdtForGateway
                }), { status: 422, headers: h });
            }
        } else if (provider === 'stripe') {
            const stripeKey = env.STRIPE_SECRET_KEY;
            if (stripeKey) {
                const postParams = new URLSearchParams({
                    success_url: `https://inshatech.pages.dev/portal.html?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
                    cancel_url: 'https://inshatech.pages.dev/store.html?canceled=true',
                    'payment_method_types[0]': 'card',
                    mode: 'payment',
                    customer_email: customerEmail,
                    client_reference_id: orderId,
                    'line_items[0][price_data][currency]': 'usd',
                    'line_items[0][price_data][unit_amount]': Math.round(usdForGateway * 100).toString(),
                    'line_items[0][price_data][product_data][name]': serviceTitle,
                    'line_items[0][quantity]': '1'
                });
                const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${stripeKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: postParams.toString()
                });
                gatewayResponse = await stripeRes.json().catch(() => ({}));
                if (gatewayResponse.url) redirectUrl = gatewayResponse.url;
            } else {
                return new Response(JSON.stringify({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'Stripe',
                    message: 'STRIPE_SECRET_KEY required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_usd: usdForGateway
                }), { status: 422, headers: h });
            }
        } else {
            return new Response(JSON.stringify({
                status: 'UNSUPPORTED_PAYMENT_PROVIDER',
                code: 'UNSUPPORTED_PROVIDER',
                message: `Payment provider '${provider}' is not enabled for this checkout route.`,
                order_id: orderId
            }), { status: 400, headers: h });
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            order_id: orderId,
            provider,
            amount_usd: usdForGateway,
            amount_bdt: bdtForGateway,
            redirect_url: redirectUrl,
            gateway_data: gatewayResponse
        }), { status: 200, headers: h });
    } catch (err) {
        return new Response(JSON.stringify({
            status: 'GATEWAY_ERROR',
            message: err?.message || 'Unexpected payment gateway error.'
        }), { status: 500, headers: h });
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: cors(request) });
}
