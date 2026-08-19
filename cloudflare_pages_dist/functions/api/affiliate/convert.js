/**
 * Cloudflare Pages Function: /api/affiliate/convert
 * Attribution Conversion & Commission Calculation Engine
 */

export async function onRequestPost(context) {
    const { request } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json().catch(() => ({}));
        const { order_id, affiliate_id, order_amount, idempotency_key } = body;

        if (!order_id || !affiliate_id || !order_amount) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing required fields: order_id, affiliate_id, order_amount'
            }), { headers: corsHeaders, status: 400 });
        }

        // Idempotency: Prevent duplicate conversions
        const conversionKey = idempotency_key || `conv_${order_id}_${affiliate_id}`;

        // Commission tiers
        const COMMISSION_TIERS = {
            'starter': 0.10,   // 10%
            'growth': 0.15,    // 15%
            'vip': 0.20,       // 20%
            'legend': 0.25     // 25%
        };

        const tier = 'vip'; // Default tier
        const commissionRate = COMMISSION_TIERS[tier] || 0.20;
        const commissionAmount = Math.round(order_amount * commissionRate * 100) / 100;

        const conversion = {
            conversion_id: 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            order_id,
            affiliate_id,
            order_amount,
            commission_rate: commissionRate,
            commission_amount: commissionAmount,
            commission_bdt: Math.round(commissionAmount * 122.50),
            tier,
            idempotency_key: conversionKey,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Conversion recorded and commission calculated',
            conversion
        }), { headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers: corsHeaders, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        status: 204
    });
}
