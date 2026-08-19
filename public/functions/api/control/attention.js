/**
 * Cloudflare Pages Function: /api/control/attention
 * Actionable Triage Queue (Needs Your Attention items)
 */

export const ATTENTION_ITEMS = [
    {
        id: "att_001",
        severity: "CRITICAL",
        category: "PROPOSAL_APPROVAL",
        title: "Approve $1,800 AI Receptionist Proposal",
        description: "Client: Apex Real Estate Ltd. (Lead score: 94). Scope: Twilio + Gemini WebRTC bot.",
        value_usd: 1800,
        actions: ["APPROVE", "EDIT", "REJECT"],
        status: "PENDING"
    },
    {
        id: "att_002",
        severity: "HIGH",
        category: "PAYOUT_VALIDATION",
        title: "Validate $420 bKash Partner Payout",
        description: "Partner: TechVenture BD (12 verified conversions, 0 refund risk detected).",
        value_usd: 420,
        actions: ["APPROVE_PAYOUT", "HOLD"],
        status: "PENDING"
    },
    {
        id: "att_003",
        severity: "MEDIUM",
        category: "CAMPAIGN_LAUNCH",
        title: "Launch B2B Lead Gen Swarm Q3 Campaign",
        description: "Estimated budget: $15. Target: 100 verified SaaS founder contacts.",
        actions: ["START_CAMPAIGN", "ADJUST_TARGETS"],
        status: "PENDING"
    }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        pending_count: ATTENTION_ITEMS.length,
        items: ATTENTION_ITEMS
    }), { headers, status: 200 });
}
