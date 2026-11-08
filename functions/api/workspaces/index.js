/**
 * Cloudflare Pages Function: /api/workspaces/index
 * Multi-Tenant Workspace & Client Isolation API
 */

export const WORKSPACE_REGISTRY = [
    {
        workspace_id: "ws_iinsha_primary",
        workspace_name: "IINSHA AI Primary Cloud",
        workspace_slug: "iinsha-main",
        plan_tier: "ENTERPRISE_COMMAND",
        allocated_budget_usd: 20.00,
        active_agents_count: 13,
        status: "ACTIVE"
    },
    {
        workspace_id: "ws_agency_partner_01",
        workspace_name: "Apex Growth Agency Workspace",
        workspace_slug: "apex-growth",
        plan_tier: "RESELLER_PRO",
        allocated_budget_usd: 50.00,
        active_agents_count: 8,
        status: "ACTIVE"
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
        total_workspaces: WORKSPACE_REGISTRY.length,
        workspaces: WORKSPACE_REGISTRY
    }), { headers, status: 200 });
}

