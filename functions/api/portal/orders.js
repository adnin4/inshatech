/**
 * Cloudflare Pages Function: /api/portal/orders
 * Interactive Customer Portal (Orders, Deliverables & Live Service Status)
 */

export async function onRequestGet(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const mockOrders = [
        {
            order_id: "ORD-APEX-101",
            service_name: "B2B SaaS 5-Agent Hunter Swarm",
            amount_usd: 850,
            amount_bdt: 104125,
            status: "DELIVERED",
            milestone_progress: 100,
            deliverables_url: "https://inshatech.pages.dev/deliverables/B2B-LEAD-SWARM-V1.tar.gz",
            created_at: "2026-08-23T10:00:00Z"
        }
    ];

    return new Response(JSON.stringify({
        status: "SUCCESS",
        customer_portal_ready: true,
        orders: mockOrders,
        sla_tier: "ENTERPRISE_2_HOUR",
        timestamp: new Date().toISOString()
    }), { status: 200, headers: corsHeaders });
}
