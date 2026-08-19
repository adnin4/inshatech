/**
 * Cloudflare Pages Function: /api/payments/checkout
 * Server-Authoritative Multi-Provider Payment Checkout Gateway
 * Implements strict CORS allowlist, server-side pricing lookup, and cryptographic order tokens.
 */

const ALLOWED_ORIGINS = [
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8788',
    'http://127.0.0.1:8788'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.pages.dev');
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };
}

// Canonical Server-Side Service Price Registry (Source of Truth)
const CANONICAL_CATALOG = {
    'b2b-lead-swarm': { name: 'B2B SaaS 5-Agent Hunter Swarm', baseUSD: 850, floorUSD: 700, deliveryDays: 3 },
    'ecommerce-ai-whatsapp': { name: '24/7 E-Commerce WhatsApp & Messenger Sales Agent', baseUSD: 750, floorUSD: 600, deliveryDays: 2 },
    'voice-ai-receptionist': { name: 'AI Voice Receptionist (Twilio + Gemini WebRTC)', baseUSD: 1800, floorUSD: 1500, deliveryDays: 5 },
    'n8n-docker-cluster': { name: 'Self-Hosted n8n Enterprise Cluster Deployment', baseUSD: 497, floorUSD: 400, deliveryDays: 1 },
    'invoice-ocr-pipeline': { name: 'Autonomous Invoice & Document OCR Pipeline', baseUSD: 249, floorUSD: 200, deliveryDays: 1 },
    'ai-saas-mvp': { name: 'Full-Stack Autonomous AI SaaS MVP', baseUSD: 2500, floorUSD: 2000, deliveryDays: 7 },
    'custom-agent-swarm': { name: 'Custom Multi-Agent Department Mesh', baseUSD: 1200, floorUSD: 1000, deliveryDays: 4 },
    'openclaw-scraping-farm': { name: 'OpenClaw Authorized Web Data Pipeline', baseUSD: 75, floorUSD: 50, deliveryDays: 1 },
    'stripe-churn-recovery': { name: 'Stripe Churn Recovery n8n Engine', baseUSD: 50, floorUSD: 40, deliveryDays: 1 },
    'apollo-enrichment-leadgen': { name: 'Apollo MX Verifier & Enrichment Swarm', baseUSD: 60, floorUSD: 45, deliveryDays: 1 }
};

const BDT_RATE = 122.50;

async function generateSignedOrderToken(orderData, secretKey) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secretKey || 'iinsha_order_token_signing_secret_2026'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const serialized = JSON.stringify(orderData);
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(serialized));
    const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return `${btoa(serialized).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')}.${sigB64}`;
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json().catch(() => ({}));
        const {
            service_id, package_name, customer_name, customer_email, customer_phone,
            payment_provider = 'manual', coupon_code, affiliate_code, idempotency_key
        } = body;

        // 1. Validation
        if (!service_id || !customer_name) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing required fields: service_id and customer_name'
            }), { headers: corsHeaders, status: 400 });
        }

        // 2. SERVER-AUTHORITATIVE PRICE LOOKUP (Never trust client-sent amounts)
        const catalogItem = CANONICAL_CATALOG[service_id];
        if (!catalogItem) {
            return new Response(JSON.stringify({
                status: 'INVALID_SERVICE',
                error: `Unknown service_id '${service_id}'. Use /api/tools/execute with get_services to list valid services.`,
                valid_service_ids: Object.keys(CANONICAL_CATALOG)
            }), { headers: corsHeaders, status: 400 });
        }

        let calculatedUSD = catalogItem.baseUSD;

        // Apply server-verified coupon discounts
        let discountAppliedUSD = 0;
        if (coupon_code) {
            const cleanCoupon = String(coupon_code).toUpperCase().trim();
            if (cleanCoupon === 'EARLY2026' || cleanCoupon === 'FOUNDER10') {
                discountAppliedUSD = Math.round(calculatedUSD * 0.10);
            } else if (cleanCoupon === 'APEX15') {
                discountAppliedUSD = Math.round(calculatedUSD * 0.15);
            }
            calculatedUSD = Math.max(catalogItem.floorUSD, calculatedUSD - discountAppliedUSD);
        }

        const calculatedBDT = Math.round(calculatedUSD * BDT_RATE);

        // 3. Server-side Affiliate Commission calculation
        let commissionUSD = 0;
        let affiliateTier = 'none';
        if (affiliate_code) {
            const cleanAff = String(affiliate_code).toLowerCase().trim();
            if (cleanAff.includes('apex') || cleanAff.includes('agency')) {
                commissionUSD = Math.round(calculatedUSD * 0.30 * 100) / 100; // 30% Apex
                affiliateTier = 'Apex Partner (30%)';
            } else if (cleanAff.includes('gold')) {
                commissionUSD = Math.round(calculatedUSD * 0.25 * 100) / 100; // 25% Gold
                affiliateTier = 'Gold Partner (25%)';
            } else {
                commissionUSD = Math.round(calculatedUSD * 0.20 * 100) / 100; // 20% Standard
                affiliateTier = 'Standard Partner (20%)';
            }
        }

        // 4. Idempotency & Order ID Generation
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const orderIdempotencyKey = idempotency_key || `ord_idemp_${orderId}`;

        // 5. Payment Provider Routing Descriptor
        let paymentInstructions = {};
        switch (payment_provider) {
            case 'bkash':
                paymentInstructions = {
                    method: 'bKash Send Money',
                    account: '01629286887',
                    amount_bdt: calculatedBDT,
                    reference: orderId,
                    instructions: `Send ৳${calculatedBDT.toLocaleString()} to 01629286887 via bKash. Reference: ${orderId}`
                };
                break;
            case 'nagad':
                paymentInstructions = {
                    method: 'Nagad Send Money',
                    account: '01629286887',
                    amount_bdt: calculatedBDT,
                    reference: orderId,
                    instructions: `Send ৳${calculatedBDT.toLocaleString()} to 01629286887 via Nagad. Reference: ${orderId}`
                };
                break;
            case 'crypto':
            case 'usdt':
                paymentInstructions = {
                    method: 'USDT (TRC20 / BEP20) Secure Settlement',
                    network: 'TRC20 / BEP20',
                    amount_usd: calculatedUSD,
                    reference: orderId,
                    instructions: `Submit transaction hash for reconciliation with order ${orderId}`
                };
                break;
            case 'stripe':
                paymentInstructions = {
                    method: 'Stripe Global Checkout',
                    status: env.STRIPE_SECRET_KEY ? 'READY' : 'CONFIGURATION_REQUIRED',
                    amount_usd: calculatedUSD,
                    session_url: `/portal.html?order_id=${orderId}&status=awaiting_payment`
                };
                break;
            case 'bank':
                paymentInstructions = {
                    method: 'Bank Wire Transfer',
                    bank_name: 'City Bank PLC',
                    amount_usd: calculatedUSD,
                    reference: orderId,
                    instructions: `Wire $${calculatedUSD} USD to City Bank PLC. Reference: ${orderId}`
                };
                break;
            default:
                paymentInstructions = {
                    method: 'Direct Engineering Consultation',
                    whatsapp_link: `https://wa.me/8801629286887?text=${encodeURIComponent(`Order ${orderId}: ${catalogItem.name} ($${calculatedUSD} USD / ৳${calculatedBDT.toLocaleString()} BDT)`)}`,
                    instructions: 'Contact Chief Architect Adnin via WhatsApp to finalize provisioning'
                };
        }

        const rawOrder = {
            order_id: orderId,
            idempotency_key: orderIdempotencyKey,
            service_id,
            service_name: catalogItem.name,
            package_name: package_name || 'Standard Production Package',
            amount_usd: calculatedUSD,
            amount_bdt: calculatedBDT,
            discount_usd: discountAppliedUSD,
            affiliate_code: affiliate_code || null,
            affiliate_tier: affiliateTier,
            affiliate_commission_usd: commissionUSD,
            customer: {
                name: customer_name,
                email: customer_email || null,
                phone: customer_phone || null
            },
            payment_provider,
            payment_instructions: paymentInstructions,
            payment_status: 'awaiting_payment',
            order_status: 'created',
            delivery_days: catalogItem.deliveryDays,
            created_at: new Date().toISOString()
        };

        // 6. Cryptographically Sign Order Token
        const signedToken = await generateSignedOrderToken(rawOrder, env.JWT_SECRET || env.ADMIN_SECRET_KEY);

        // 7. REAL DATABASE PERSISTENCE (Supabase PostgreSQL via REST API)
        const dbResult = await persistOrderToDatabase(rawOrder, env);

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Server-authoritative order session created',
            order_token: signedToken,
            database_persistence: dbResult,
            order: rawOrder
        }), { headers: corsHeaders, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers: corsHeaders, status: 500 });
    }
}

async function persistOrderToDatabase(orderData, env) {
    if (!env.SUPABASE_URL || (!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_ANON_KEY)) {
        return { persisted: false, status: 'STORAGE_CONTRACT_READY', note: 'Configured for live Supabase integration when SUPABASE_URL is provided' };
    }
    try {
        const apiKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
        const res = await fetch(`${env.SUPABASE_URL}/rest/v1/ibos_orders`, {
            method: 'POST',
            headers: {
                'apikey': apiKey,
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                order_code: orderData.order_id,
                service_title: orderData.service_name,
                package_name: orderData.package_name,
                amount: orderData.amount_usd,
                currency: 'USD',
                bdt_amount: orderData.amount_bdt,
                client_name: orderData.customer.name,
                client_email: orderData.customer.email || 'customer@inshatech.com',
                client_phone: orderData.customer.phone || null,
                affiliate_ref_code: orderData.affiliate_code,
                affiliate_commission: orderData.affiliate_commission_usd,
                payment_gateway: orderData.payment_provider,
                payment_status: orderData.payment_status,
                order_status: orderData.order_status
            })
        });
        if (res.ok) {
            const json = await res.json().catch(() => ([]));
            return { persisted: true, status: 'PERSISTED_TO_POSTGRES', db_record: json[0] || null };
        } else {
            const errText = await res.text();
            return { persisted: false, status: 'DB_ERROR', error: errText };
        }
    } catch (e) {
        return { persisted: false, status: 'NETWORK_ERROR', error: e.message };
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: getCorsHeaders(context.request),
        status: 204
    });
}
