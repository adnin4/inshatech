/**
 * Cloudflare Pages Function: /api/orders/quote
 * Solution Quote Calculator & Server-Side Price Lock Engine
 */

const BASE_RATES = {
    'b2b-lead-swarm': 850,
    'ecommerce-ai-whatsapp': 750,
    'voice-ai-receptionist': 1800,
    'n8n-docker-cluster': 497,
    'invoice-ocr-pipeline': 249
};

const EXCHANGE_RATE = 122.50;

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const { service_id = 'b2b-lead-swarm', custom_add_ons = [] } = body;

        const basePriceUSD = BASE_RATES[service_id] || 850;
        let addOnPriceUSD = custom_add_ons.length * 150;
        const totalPriceUSD = basePriceUSD + addOnPriceUSD;
        const totalPriceBDT = Math.round(totalPriceUSD * EXCHANGE_RATE);

        return new Response(JSON.stringify({
            status: 'QUOTE_GENERATED',
            quote_id: `QUOTE-${Date.now()}`,
            service_id,
            total_usd: totalPriceUSD,
            total_bdt: totalPriceBDT,
            exchange_rate_locked: EXCHANGE_RATE,
            price_tamper_shield: 'SERVER_LOCKED',
            valid_hours: 48,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
