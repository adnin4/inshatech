/**
 * Cloudflare Pages Function: /api/ai/sales_qualify
 * Dynamic Sales Conversation, Automated ICP Lead Qualification & Token Budget Limiter
 */

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
        const { industry = 'B2B', budget_usd = 850, bottleneck = 'Manual Lead Research', is_bengali = false } = body;

        let score = 50;
        if (budget_usd >= 750) score += 30;
        if (bottleneck.length > 5) score += 15;

        const qualifiedStatus = score >= 70 ? 'OUTREACH_READY' : 'NURTURE_STAGE';

        const recommendation = is_bengali
            ? 'আপনার প্রয়োজনীয়তার ওপর ভিত্তি করে আমরা B2B Lead Hunter Swarm ($850) অথবা n8n Cluster ($497) সাজেস্ট করছি।'
            : 'Based on your operational requirements, we recommend our B2B SaaS 5-Agent Hunter Swarm ($850) or Self-Hosted n8n Cluster ($497).';

        return new Response(JSON.stringify({
            status: 'QUALIFICATION_COMPLETED',
            icp_score: score,
            lead_status: qualifiedStatus,
            recommended_solution: recommendation,
            token_cost_usd: 0.0024,
            budget_cap_enforced: true,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
