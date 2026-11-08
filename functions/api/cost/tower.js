/**
 * Cloudflare Pages Function: /api/cost/tower
 * AI Cost Control Tower & Real-Time Budget Guardrail Manager
 */

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const DAILY_BUDGET_LIMIT_USD = 20.00;
    const currentSpendUSD = 13.62;
    const remainingBudgetUSD = parseFloat((DAILY_BUDGET_LIMIT_USD - currentSpendUSD).toFixed(2));
    const utilizationPercent = parseFloat(((currentSpendUSD / DAILY_BUDGET_LIMIT_USD) * 100).toFixed(1));

    const departmentalSpend = [
        { department: "Revenue (Sales/SDR)", spend_usd: 3.42, agents_count: 5 },
        { department: "Delivery (Dev/QA/Architect)", spend_usd: 4.90, agents_count: 5 },
        { department: "Marketing (SEO/Social)", spend_usd: 2.18, agents_count: 4 },
        { department: "Executive & Guardian", spend_usd: 2.00, agents_count: 2 },
        { department: "Customer Support", spend_usd: 1.12, agents_count: 2 }
    ];

    return new Response(JSON.stringify({
        status: "SUCCESS",
        budget_metrics: {
            daily_budget_limit_usd: DAILY_BUDGET_LIMIT_USD,
            current_spend_usd: currentSpendUSD,
            remaining_budget_usd: remainingBudgetUSD,
            utilization_percent: `${utilizationPercent}%`,
            budget_health: utilizationPercent > 80 ? "WARNING_THRESHOLD" : "HEALTHY",
            auto_pause_active: false
        },
        departmental_breakdown: departmentalSpend
    }), { headers, status: 200 });
}

