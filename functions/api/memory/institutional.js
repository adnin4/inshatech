/**
 * Cloudflare Pages Function: /api/memory/institutional
 * Institutional Business Learnings & Winning Patterns API
 */

export const INSTITUTIONAL_PATTERNS = [
    {
        category: "WINNING_SALES_HOOKS",
        topic: "E-Commerce WhatsApp Automation",
        pattern: "Highlighting 24/7 COD order confirmation and 20-minute catalog ingestion yields 4.2x higher close rate.",
        effectiveness_score: 96.5
    },
    {
        category: "PRICING_EXPERIMENTS",
        topic: "Self-Hosted n8n VPS Cluster",
        pattern: "Contrasting $497 one-time setup against Zapier's $1,200/yr recurring cost eliminates price objections in 88% of cases.",
        effectiveness_score: 94.0
    }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        total_patterns: INSTITUTIONAL_PATTERNS.length,
        institutional_memory: INSTITUTIONAL_PATTERNS
    }), { headers, status: 200 });
}
