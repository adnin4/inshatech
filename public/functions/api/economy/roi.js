/**
 * Cloudflare Pages Function: /api/economy/roi
 * Agent Economy & Direct Revenue Influence ROI Analytics
 */

export const AGENT_ECONOMY_STATS = [
    {
        employee_code: "AG-SALES-002",
        name: "AI Sales Executive",
        compute_cost_usd: 18.42,
        revenue_influenced_usd: 4820.00,
        economic_roi_multiplier: "261.6×",
        tasks_completed: 321,
        status: "HIGH_VALUE_PRODUCER"
    },
    {
        employee_code: "AG-ARCH-003",
        name: "Solution Architect Lead",
        compute_cost_usd: 12.10,
        revenue_influenced_usd: 2400.00,
        economic_roi_multiplier: "198.3×",
        tasks_completed: 184,
        status: "HIGH_VALUE_PRODUCER"
    },
    {
        employee_code: "AG-CEO-001",
        name: "CEO Strategic Commander",
        compute_cost_usd: 4.80,
        revenue_influenced_usd: 7220.00,
        economic_roi_multiplier: "1504.1×",
        tasks_completed: 142,
        status: "EXECUTIVE_ORCHESTRATOR"
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

    const totalCost = AGENT_ECONOMY_STATS.reduce((acc, a) => acc + a.compute_cost_usd, 0);
    const totalRev = AGENT_ECONOMY_STATS.reduce((acc, a) => acc + a.revenue_influenced_usd, 0);

    return new Response(JSON.stringify({
        status: "SUCCESS",
        aggregate_economy: {
            total_ai_compute_spend_usd: totalCost,
            total_revenue_influenced_usd: totalRev,
            overall_portfolio_roi: `${(totalRev / totalCost).toFixed(1)}×`,
            cost_to_revenue_ratio_percent: `${((totalCost / totalRev) * 100).toFixed(2)}%`
        },
        agents: AGENT_ECONOMY_STATS
    }), { headers, status: 200 });
}
