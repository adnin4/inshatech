/**
 * Cloudflare Pages Function: /api/developer/public_api
 * Developer Ecosystem, Public API Gateway & Key Provisioning Engine
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Role",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { developer_name = "Enterprise Developer", app_name = "Custom ERP Connector", tier = "growth" } = body;

        const apiKey = `iinsha_live_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;

        const developerAccount = {
            developer_name,
            app_name,
            tier,
            api_key: apiKey,
            rate_limit_rpm: 600,
            allowed_endpoints: ["/api/knowledge/search", "/api/payments/checkout", "/api/ai/chat", "/api/services"],
            webhook_support_enabled: true,
            status: "ACTIVE",
            created_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Developer API credentials generated successfully.",
            developer: developerAccount
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}
