/**
 * Cloudflare Pages Function: /api/tools/registry
 * Tool Registry Schema Catalog & Access Controller
 */

export const SYSTEM_TOOL_CATALOG = [
    {
        tool_name: "search_knowledge",
        risk_level: "LEVEL_0_READ",
        description: "Searches canonical JSON knowledge bases and FAQs",
        allowed_departments: ["ALL"],
        rate_limit_per_minute: 120,
        requires_approval: false
    },
    {
        tool_name: "create_lead",
        risk_level: "LEVEL_2_EXECUTE",
        description: "Creates or updates an enriched lead record in the CRM",
        allowed_departments: ["DEPT_REV", "DEPT_MKTG"],
        rate_limit_per_minute: 30,
        requires_approval: false
    },
    {
        tool_name: "create_order",
        risk_level: "LEVEL_3_APPROVAL",
        description: "Dispatches binding service agreements or invoices",
        allowed_departments: ["DEPT_REV", "DEPT_FIN"],
        rate_limit_per_minute: 10,
        requires_approval: true
    },
    {
        tool_name: "process_payout",
        risk_level: "LEVEL_3_APPROVAL",
        description: "Disburses affiliate commissions via bKash / Bank / Stripe",
        allowed_departments: ["DEPT_FIN"],
        rate_limit_per_minute: 5,
        requires_approval: true
    },
    {
        tool_name: "delete_production_database",
        risk_level: "LEVEL_4_RESTRICTED",
        description: "Destructive schema modification or data purge",
        allowed_departments: [],
        rate_limit_per_minute: 0,
        requires_approval: true
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
        total_registered_tools: SYSTEM_TOOL_CATALOG.length,
        tools: SYSTEM_TOOL_CATALOG
    }), { headers, status: 200 });
}
