/**
 * Cloudflare Pages Function: /api/cms/content
 * Dynamic CMS Engine & Catalog Versioning
 */

const CANONICAL_SERVICES = [
    { id: "b2b-lead-swarm", name: "B2B SaaS 5-Agent Hunter Swarm", priceUSD: 850, priceBDT: 104125, deliveryDays: 3 },
    { id: "ecommerce-ai-whatsapp", name: "24/7 E-Commerce WhatsApp & Messenger Sales Agent", priceUSD: 750, priceBDT: 91875, deliveryDays: 2 },
    { id: "voice-ai-receptionist", name: "AI Voice Receptionist (Twilio + Gemini WebRTC)", priceUSD: 1800, priceBDT: 220500, deliveryDays: 5 },
    { id: "n8n-docker-cluster", name: "Self-Hosted n8n Enterprise Cluster Deployment", priceUSD: 497, priceBDT: 60882, deliveryDays: 1 },
    { id: "invoice-ocr-pipeline", name: "Autonomous Invoice & Document OCR Pipeline", priceUSD: 249, priceBDT: 30502, deliveryDays: 1 }
];

export async function onRequestGet(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        catalog_version: "v10.0.0",
        exchange_rate: 122.50,
        currency: "USD/BDT",
        services: CANONICAL_SERVICES,
        price_lock_invariant: "SERVER_AUTHORITATIVE",
        timestamp: new Date().toISOString()
    }), { status: 200, headers: corsHeaders });
}
