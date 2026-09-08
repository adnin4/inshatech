/**
 * IINSHA AI-BOS — Payment Checkout
 *
 * Payment authority rules:
 * - Client input is untrusted for service identity, price, currency and payment state.
 * - ibos_services is the canonical service/package/price authority.
 * - Orders are persisted using the canonical ibos_orders schema.
 * - Frontend never becomes payment authority.
 *
 * Compatibility:
 * - Existing clients may continue sending service_id as the service slug.
 * - Public response fields remain compatible with existing payment UI consumers.
 */

const ORIGINS = new Set([
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com'
]);

const SUPPORTED_PROVIDERS = new Set(['sslcommerz', 'lemonsqueezy', 'bkash', 'stripe']);
const BDT_RATE = 122.5;
const SSL_MIN_BDT = 10;
const SSL_MAX_BDT = 500000;

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

const json = (body, status, headers) => new Response(JSON.stringify(body), { status, headers });

function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normalizePackageName(value) {
    return String(value || '').trim().toLowerCase();
}

function resolvePackage(packages, requestedName) {
    if (!Array.isArray(packages) || packages.length === 0) return null;
    const requested = normalizePackageName(requestedName);
    const standard = packages.find(p => normalizePackageName(p?.name) === 'standard');
    const fallback = packages.length === 1 ? packages[0] : standard;
    const selected = requested
        ? packages.find(p => normalizePackageName(p?.name) === requested)
        : fallback;
    if (!selected) return null;

    const name = String(selected.name || '').trim();
    const price = Number(selected.price);
    const deliveryDays = Number.isFinite(Number(selected.delivery_days)) ? Number(selected.delivery_days) : null;
    if (!name || !Number.isFinite(price) || price < 0) return null;
    return { name, price, deliveryDays };
}

export async function onRequestPost({ request, env = {} }) {
    const h = cors(request);

    try {
        const b = await request.json().catch(() => ({}));
        const requestedServiceIdentity = String(b.service_id || b.service_slug || '').trim();
        const requestedPackage = String(b.package_name || '').trim();

        if (!requestedServiceIdentity) {
            return json({
                status: 'ERROR',
                code: 'INVALID_SERVICE_ID',
                message: 'A service identifier is required.'
            }, 400, h);
        }

        const provider = String(b.payment_provider || 'sslcommerz').toLowerCase().trim();
        if (!SUPPORTED_PROVIDERS.has(provider)) {
            return json({
                status: 'UNSUPPORTED_PAYMENT_PROVIDER',
                code: 'UNSUPPORTED_PROVIDER',
                message: `Payment provider '${provider}' is not enabled for this checkout route.`
            }, 400, h);
        }

        const rawEmail = String(b.customer_email || '').trim().toLowerCase();
        if (!rawEmail || !/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(rawEmail)) {
            return json({
                status: 'ERROR',
                code: 'INVALID_CUSTOMER_EMAIL',
                message: 'A valid customer email address is required.'
            }, 400, h);
        }

        const customerName = String(b.customer_name || 'Valued Client').trim().slice(0, 255);
        const customerEmail = rawEmail.slice(0, 255);
        const customerPhone = String(b.customer_phone || '').trim().slice(0, 50);
        const coupon = String(b.coupon_code || '').toUpperCase().trim();
        const idempotencyKey = String(b.idempotency_key || '').trim().slice(0, 128);

        if (!idempotencyKey) {
            return json({
                status: 'ERROR',
                code: 'IDEMPOTENCY_KEY_REQUIRED',
                message: 'A stable idempotency key is required for payment checkout.'
            }, 400, h);
        }

        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            return json({
                status: 'DATABASE_CONFIGURATION_REQUIRED',
                message: 'Supabase server configuration is required before creating a durable payment order.'
            }, 500, h);
        }

        const base = `${env.SUPABASE_URL}/rest/v1`;
        const key = env.SUPABASE_SERVICE_ROLE_KEY;
        const auth = {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
        };

        const existingRes = await fetch(
            `${base}/ibos_orders?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=order_code,service_id,service_slug,service_title,package_name,amount,currency,bdt_amount,payment_provider,payment_reference,payment_status,order_status,metadata&limit=1`,
            { method: 'GET', headers: auth }
        );
        if (existingRes.ok) {
            const existingOrders = await existingRes.json().catch(() => []);
            if (Array.isArray(existingOrders) && existingOrders.length > 0) {
                const existing = existingOrders[0];
                return json({
                    status: 'SUCCESS',
                    action: 'idempotent_order_reused',
                    order_id: existing.order_code,
                    provider: existing.payment_provider || provider,
                    amount_usd: existing.amount !== null && existing.amount !== undefined ? Number(existing.amount) : null,
                    amount_bdt: existing.bdt_amount !== null && existing.bdt_amount !== undefined ? Number(existing.bdt_amount) : null,
                    redirect_url: null,
                    gateway_data: null,
                    payment_status: existing.payment_status || 'awaiting_payment',
                    order_status: existing.order_status || 'pending'
                }, 200, h);
            }
        }

        const lookup = isUuid(requestedServiceIdentity)
            ? `id=eq.${encodeURIComponent(requestedServiceIdentity)}`
            : `slug=eq.${encodeURIComponent(requestedServiceIdentity)}`;

        const serviceRes = await fetch(
            `${base}/ibos_services?${lookup}&status=eq.published&select=id,slug,title,price,packages&limit=2`,
            { method: 'GET', headers: auth }
        );
        if (!serviceRes.ok) {
            return json({
                status: 'DATABASE_ERROR',
                code: 'SERVICE_LOOKUP_FAILED',
                message: 'Unable to resolve the selected published service from the canonical database.'
            }, 500, h);
        }

        const services = await serviceRes.json().catch(() => []);
        if (!Array.isArray(services) || services.length !== 1 || !services[0]?.id) {
            return json({
                status: 'ERROR',
                code: 'SERVICE_NOT_AVAILABLE',
                message: 'The selected service is not uniquely available as a published catalog item.'
            }, 409, h);
        }

        const service = services[0];
        const serviceTitle = String(service.title || '').trim().slice(0, 255);
        const serviceSlug = String(service.slug || requestedServiceIdentity).trim().slice(0, 255);
        const serviceBasePrice = Number(service.price);
        if (!serviceTitle || !serviceSlug || !Number.isFinite(serviceBasePrice) || serviceBasePrice < 0) {
            return json({
                status: 'ERROR',
                code: 'INVALID_SERVICE_CONFIGURATION',
                message: 'The selected service has an invalid server-side configuration.'
            }, 500, h);
        }

        const packageSelection = resolvePackage(service.packages, requestedPackage);
        if (!packageSelection) {
            return json({
                status: 'ERROR',
                code: 'INVALID_PACKAGE',
                message: 'The requested package is not available for this published service.'
            }, 409, h);
        }

        let authoritativeUsdAmount = packageSelection.price;

        // Coupon rules intentionally remain unchanged until the dedicated coupon-policy gate.
        if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') {
            authoritativeUsdAmount = Math.round(authoritativeUsdAmount * 0.90);
        } else if (coupon === 'APEX15') {
            authoritativeUsdAmount = Math.round(authoritativeUsdAmount * 0.85);
        }

        if (!Number.isFinite(authoritativeUsdAmount) || authoritativeUsdAmount < 0) {
            return json({
                status: 'ERROR',
                code: 'INVALID_FINAL_PRICE',
                message: 'The calculated server-side amount is invalid.'
            }, 500, h);
        }

        const authoritativeBdtAmount = Math.round(authoritativeUsdAmount * BDT_RATE);
        if (provider === 'sslcommerz' && (authoritativeBdtAmount < SSL_MIN_BDT || authoritativeBdtAmount > SSL_MAX_BDT)) {
            return json({
                status: 'ERROR',
                code: 'PROVIDER_AMOUNT_OUT_OF_RANGE',
                message: 'The calculated payment amount is outside the SSLCommerz supported range.'
            }, 422, h);
        }

        if (provider === 'bkash' && !customerPhone) {
            return json({
                status: 'ERROR',
                code: 'CUSTOMER_PHONE_REQUIRED',
                message: 'A customer phone number is required for bKash checkout.'
            }, 400, h);
        }

        const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
        const metadata = {
            authority: 'ibos_services',
            service_id_source: isUuid(requestedServiceIdentity) ? 'client_uuid_lookup' : 'client_slug_lookup',
            coupon_applied: coupon || null,
            client_ip: request.headers.get('CF-Connecting-IP') || null,
            user_agent: request.headers.get('User-Agent') || null,
            package_delivery_days: packageSelection.deliveryDays,
            pricing: {
                base_package_price_usd: packageSelection.price,
                service_base_price_usd: serviceBasePrice,
                final_price_usd: authoritativeUsdAmount,
                bdt_rate: BDT_RATE
            }
        };

        const dbOrderPayload = {
            order_code: orderId,
            service_id: service.id,
            service_slug: serviceSlug,
            service_title: serviceTitle,
            package_name: packageSelection.name,
            amount: authoritativeUsdAmount,
            currency: 'USD',
            bdt_amount: authoritativeBdtAmount,
            client_name: customerName,
            client_email: customerEmail,
            client_phone: customerPhone || null,
            payment_provider: provider,
            payment_status: 'awaiting_payment',
            order_status: 'pending',
            idempotency_key: idempotencyKey,
            metadata,
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
                    if (Array.isArray(retryRows) && retryRows.length === 1) {
                        const existing = retryRows[0];
                        return json({
                            status: 'SUCCESS',
                            action: 'idempotent_order_reused',
                            order_id: existing.order_code,
                            provider: existing.payment_provider || provider,
                            amount_usd: Number(existing.amount),
                            amount_bdt: existing.bdt_amount !== null ? Number(existing.bdt_amount) : null,
                            redirect_url: null,
                            gateway_data: null,
                            payment_status: existing.payment_status || 'awaiting_payment',
                            order_status: existing.order_status || 'pending'
                        }, 200, h);
                    }
                }
            }

            return json({
                status: 'DATABASE_ERROR',
                code: 'ORDER_PERSIST_FAILED',
                message: 'Failed to persist the canonical durable order record before checkout.',
                detail: errText
            }, 500, h);
        }

        const usdForGateway = authoritativeUsdAmount;
        const bdtForGateway = authoritativeBdtAmount;
        let redirectUrl = null;
        let gatewayResponse = {};

        if (provider === 'sslcommerz') {
            const storeId = env.SSLCOMMERZ_STORE_ID;
            const storePass = env.SSLCOMMERZ_STORE_PASSWORD;
            if (!storeId || !storePass) {
                return json({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'SSLCommerz',
                    message: 'SSLCommerz Store ID & Store Password must be set in Cloudflare Environment Secrets.',
                    order_id: orderId,
                    amount_bdt: bdtForGateway
                }, 422, h);
            }

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
        } else if (provider === 'lemonsqueezy') {
            const apiKey = env.LEMONSQUEEZY_API_KEY;
            const storeId = env.LEMONSQUEEZY_STORE_ID;
            const variantId = env.LEMONSQUEEZY_VARIANT_ID;
            if (!apiKey || !storeId || !variantId) {
                return json({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'Lemon Squeezy',
                    message: 'LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, and LEMONSQUEEZY_VARIANT_ID required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_usd: usdForGateway
                }, 422, h);
            }
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
                                description: `Order ${orderId}${packageSelection.deliveryDays ? ` - Delivery SLA: ${packageSelection.deliveryDays} Days` : ''}`,
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
        } else if (provider === 'bkash') {
            const appKey = env.BKASH_APP_KEY;
            const appSecret = env.BKASH_APP_SECRET;
            const username = env.BKASH_USERNAME;
            const password = env.BKASH_PASSWORD;
            if (!appKey || !appSecret || !username || !password) {
                return json({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'bKash Tokenized Merchant',
                    message: 'BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, and BKASH_PASSWORD required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_bdt: bdtForGateway
                }, 422, h);
            }
            const tokenRes = await fetch('https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', username, password },
                body: JSON.stringify({ app_key: appKey, app_secret: appSecret })
            });
            const tokenData = await tokenRes.json().catch(() => ({}));
            if (!tokenData.id_token) {
                return json({ status: 'GATEWAY_ERROR', gateway: 'bKash Tokenized Merchant', order_id: orderId }, 502, h);
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
        } else if (provider === 'stripe') {
            const stripeKey = env.STRIPE_SECRET_KEY;
            if (!stripeKey) {
                return json({
                    status: 'GATEWAY_CREDENTIALS_REQUIRED',
                    gateway: 'Stripe',
                    message: 'STRIPE_SECRET_KEY required in Cloudflare Secrets.',
                    order_id: orderId,
                    amount_usd: usdForGateway
                }, 422, h);
            }
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
        }

        return json({
            status: 'SUCCESS',
            order_id: orderId,
            provider,
            amount_usd: usdForGateway,
            amount_bdt: bdtForGateway,
            redirect_url: redirectUrl,
            gateway_data: gatewayResponse
        }, 200, h);
    } catch (err) {
        return json({
            status: 'GATEWAY_ERROR',
            message: err?.message || 'Unexpected payment gateway error.'
        }, 500, h);
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: cors(request) });
}
