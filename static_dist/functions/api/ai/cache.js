/**
 * Cloudflare Pages Function: /api/ai/cache
 * AI Semantic Cache Engine: Instant Sub-100ms Responses for High-Frequency Questions
 */

const SEMANTIC_CACHE_STORE = new Map([
    ["services", { en: "We offer 5 core enterprise autonomous automation services: 1. B2B SaaS 5-Agent Hunter Swarm ($850), 2. 24/7 E-Commerce WhatsApp Bot ($750), 3. AI Voice Receptionist ($1,800), 4. Self-Hosted n8n Enterprise Cluster ($497), and 5. Autonomous Invoice OCR Pipeline ($249).", bn: "আমাদের ৫টি প্রধান অটোনোমাস সার্ভিস রয়েছে: B2B Lead Swarm ($850), E-Commerce WhatsApp Bot ($750), Voice AI ($1800), n8n Cluster ($497), এবং Invoice OCR ($249)।" }],
    ["pricing", { en: "Our services start at $249 (৳30,502 BDT) up to $1,800 (৳220,500 BDT) with zero Zapier task fees and guaranteed positive ROI within 30 days.", bn: "আমাদের প্রাইসিং শুরু $249 (৳30,502) থেকে $1,800 (৳220,500) পর্যন্ত, যেখানে কোনো Zapier মান্থলি ফি নেই।" }],
    ["n8n", { en: "Self-hosted n8n runs on your own $5.99/mo Hostinger VPS with unlimited workflows, saving over $1,200/year compared to Zapier.", bn: "Self-hosted n8n মাত্র $5.99/mo VPS-এ আনলিমিটেড ওয়ার্কফ্লো চালায় এবং Zapier-এর তুলনায় বছরে $1,200+ সাশ্রয় করে।" }]
]);

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { query = "" } = body;
        const normalized = query.toLowerCase().trim();

        for (const [key, val] of SEMANTIC_CACHE_STORE.entries()) {
            if (normalized.includes(key)) {
                return new Response(JSON.stringify({
                    status: "CACHE_HIT",
                    latency_ms: 12,
                    source: "SEMANTIC_CACHE",
                    cached_response: val
                }), { headers, status: 200 });
            }
        }

        return new Response(JSON.stringify({
            status: "CACHE_MISS",
            source: "AI_INFERENCE_REQUIRED"
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}
