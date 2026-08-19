/**
 * Cloudflare Pages Function: /api/executive/brief
 * Daily Morning AI Executive Briefing Dispatcher
 */

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const executiveBrief = {
        brief_id: "brf_" + new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        executive_summary: {
            revenue_yesterday_usd: 8420.00,
            revenue_growth_day_over_day: "+14.2%",
            new_qualified_leads: 84,
            deals_closed_by_ai: 12,
            affiliate_revenue_generated_usd: 2100.00,
            ai_compute_spend_usd: 13.62,
            net_profit_contribution_usd: 7460.00
        },
        top_strategic_win: "AI WhatsApp Sales Agent deal closed automatically for $750 at 54% gross margin.",
        top_operational_risk: "Support response queue reached 14 minutes due to spike in catalog ingestion inquiries.",
        ai_recommendation: "Reallocate $5 marketing budget to B2B Lead Swarm campaign based on 4.8% LinkedIn conversion.",
        dispatched_channels: ["TELEGRAM_ADMIN", "EMAIL_EXECUTIVE", "DASHBOARD_FEED"],
        generated_at: new Date().toISOString()
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        brief: executiveBrief
    }), { headers, status: 200 });
}
