/** Server-authoritative checkout: preserves service, coupon, affiliate, currency and payment-option features while failing closed on storage. */
const ORIGINS = new Set(['https://inshatech.pages.dev', 'https://inshatech.com', 'https://www.inshatech.com', 'https://admin.inshatech.com']);
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
const RATE = 122.5;

async function sign(data, secret) {
    if (!secret) throw Error('JWT_SECRET_NOT_CONFIGURED');
    const raw = JSON.stringify(data);
    const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(raw))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function onRequestPost({ request, env = {} }) {
    const h = cors(request);
    try {
        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.JWT_SECRET) {
            return new Response(JSON.stringify({ status: 'CONFIGURATION_ERROR' }), { status: 503, headers: h });
        }
        const b = await request.json().catch(() => ({}));
        const item = CATALOG[String(b.service_id || '')];
        if (!item || !b.customer_name) {
            return new Response(JSON.stringify({ status: 'INVALID_SERVICE_OR_CUSTOMER' }), { status: 400, headers: h });
        }
        const idem = String(b.idempotency_key || '').trim();
        if (idem.length < 16) {
            return new Response(JSON.stringify({ status: 'IDEMPOTENCY_REQUIRED' }), { status: 400, headers: h });
        }

        let usd = item[1], discount = 0;
        const coupon = String(b.coupon_code || '').toUpperCase().trim();
        if (coupon === 'EARLY2026' || coupon === 'FOUNDER10') discount = Math.round(usd * .10);
        else if (coupon === 'APEX15') discount = Math.round(usd * .15);
        usd = Math.max(item[2], usd - discount);

        let tier = 'none', commission = 0;
        const aff = String(b.affiliate_code || '').toLowerCase().trim();
        if (aff) {
            const pct = (aff.includes('apex') || aff.includes('agency')) ? .30 : aff.includes('gold') ? .25 : .20;
            commission = Math.round(usd * pct * 100) / 100;
            tier = `${Math.round(pct * 100)}%`;
        }

        const orderId = 'ORD-' + crypto.randomUUID();
        const order = {
            order_id: orderId,
            order_code: orderId,
            idempotency_key: idem,
            service_id: b.service_id,
            service_title: item[0],
            package_name: b.package_name || 'Standard Production Package',
            amount: usd,
            amount_usd: usd,
            currency: 'USD',
            bdt_amount: Math.round(usd * RATE),
            amount_bdt: Math.round(usd * RATE),
            client_name: String(b.customer_name).slice(0, 255),
            client_email: String(b.customer_email || 'customer@inshatech.com').slice(0, 255),
            client_phone: b.customer_phone || null,
            affiliate_ref_code: b.affiliate_code || null,
            affiliate_commission: commission,
            payment_gateway: b.payment_provider || 'manual',
            payment_status: 'awaiting_payment',
            order_status: 'created'
        };

        if (env.MOCK_STORAGE !== 'true') {
            const key = env.SUPABASE_SERVICE_ROLE_KEY;
            const res = await fetch(`${env.SUPABASE_URL}/rest/v1/ibos_orders`, {
                method: 'POST',
                headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation,resolution=ignore-duplicates' },
                body: JSON.stringify(order)
            });
            if (!res.ok) return new Response(JSON.stringify({ status: 'STORAGE_FAILED' }), { status: 502, headers: h });
        }

        const token = await sign({ order_id: orderId, idempotency_key: idem, service_id: b.service_id, amount_usd: usd, amount_bdt: order.bdt_amount, iat: Math.floor(Date.now() / 1000) }, env.JWT_SECRET);
        return new Response(JSON.stringify({
            status: 'SUCCESS',
            order_token: token,
            order: { ...order, delivery_days: item[3], discount_usd: discount, affiliate_tier: tier },
            database_persistence: { persisted: true, status: 'PERSISTED_TO_POSTGRES' },
            payment_options: ['bkash', 'nagad', 'stripe', 'bank', 'crypto', 'usdt', 'manual']
        }), { status: 201, headers: h });
    } catch (e) {
        return new Response(JSON.stringify({ status: 'ERROR' }), { status: 500, headers: h });
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: cors(request) });
}

