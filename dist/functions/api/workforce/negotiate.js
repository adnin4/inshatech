/**
 * Cloudflare Pages Function: /api/workforce/negotiate
 * Agent-to-Agent Commercial Negotiation Handler
 */

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
        const targetPriceUSD = body.target_price_usd || 500.00;
        const catalogPriceUSD = body.catalog_price_usd || 750.00;

        // Sales Agent consults Finance Agent & Architect
        const negotiation = {
            negotiation_id: "neg_" + Date.now().toString().slice(-6),
            client_requested_price_usd: targetPriceUSD,
            catalog_price_usd: catalogPriceUSD,
            agent_consensus: {
                finance_decision: targetPriceUSD < 600 ? "MARGIN_TOO_LOW_NEED_SCOPE_REDUCTION" : "ACCEPTABLE",
                architect_scope_adjustment: targetPriceUSD < 600 ? "Remove custom Zapier migration, keep standard WhatsApp bot" : "Full scope retained",
                final_counter_offer_usd: Math.max(600, targetPriceUSD),
                agreed_gross_margin_percent: 51.5
            },
            status: "COUNTER_OFFER_READY",
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            negotiation
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
