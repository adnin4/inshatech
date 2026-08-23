/**
 * Cloudflare Pages Function: /api/finance/subscription
 * Subscription Lifecycle Engine & 30-Day Recurring Retainers
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
        const { plan_name = 'Enterprise Retainer', interval = 'monthly', amount_usd = 299 } = body;

        return new Response(JSON.stringify({
            status: 'SUBSCRIPTION_ACTIVE',
            subscription_id: `SUB-${Date.now()}`,
            plan: plan_name,
            amount_usd,
            amount_bdt: Math.round(amount_usd * 122.50),
            billing_interval: interval,
            next_renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            auto_renew: true,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
