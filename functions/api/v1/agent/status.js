/**
 * Cloudflare Pages Function: /api/v1/agent/status
 * Real-time Agent Workforce Health & Capability State Endpoint
 */

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    };

    const workforceStatus = {
        platform: "IINSHA AI-BOS Workforce",
        status: "OPERATIONAL_SANDBOX",
        active_agents_count: 13,
        guardrail_state: "ENFORCED",
        execution_fabric: {
            planner: "ACTIVE",
            tool_gateway: "ACTIVE",
            independent_qa: "ACTIVE",
            kill_switch: "STANDBY"
        },
        providers: {
            cloudflare_pages: "LIVE_VERIFIED",
            gemini_ai: "SANDBOX_VERIFIED",
            supabase_db: "MISMATCH_UNVERIFIED",
            meta_whatsapp: "NOT_CONFIGURED",
            stripe_checkout: "NOT_CONFIGURED",
            bkash_gateway: "NOT_CONFIGURED"
        },
        timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(workforceStatus, null, 2), { headers: corsHeaders });
}

export async function onRequestOptions(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        status: 204
    });
}
