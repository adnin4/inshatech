/**
 * Cloudflare Pages Function: /api/onboarding/segment
 * Audience Segmentation & Value Proposition Router
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
        const { company_type = 'SMB', primary_goal = 'Lead Automation', team_size = 5 } = body;

        const segment = team_size > 20 || company_type === 'Enterprise' ? 'ENTERPRISE_CUSTOM' : 'TURNKEY_SMB';
        const recommendedTiers = segment === 'ENTERPRISE_CUSTOM'
            ? ['voice-ai-receptionist', 'b2b-lead-swarm']
            : ['ecommerce-ai-whatsapp', 'n8n-docker-cluster', 'invoice-ocr-pipeline'];

        return new Response(JSON.stringify({
            status: 'SEGMENTATION_RESOLVED',
            segment,
            recommended_catalog_items: recommendedTiers,
            onboarding_flow_url: `https://inshatech.pages.dev/store.html?segment=${segment.toLowerCase()}`,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
