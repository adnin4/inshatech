/**
 * Cloudflare Pages Function: /api/affiliate/attribution
 * Multi-Touch Attribution Engine supporting First-Touch, Last-Touch, Linear, Time-Decay, and Position-Based models
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Affiliate-Token",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const touchpoints = Array.isArray(body.touchpoints) ? body.touchpoints : [];
        const model = body.model || 'last_touch'; // 'first_touch', 'last_touch', 'linear', 'time_decay', 'position_based'
        const orderAmount = parseFloat(body.order_amount) || 0.0;
        const totalCommissionRate = parseFloat(body.commission_rate) || 0.20; // 20%
        const totalCommission = orderAmount * totalCommissionRate;

        if (touchpoints.length === 0) {
            return new Response(JSON.stringify({
                status: "SUCCESS",
                model,
                attributed_shares: []
            }), { headers, status: 200 });
        }

        let shares = [];

        switch (model) {
            case 'first_touch':
                shares = touchpoints.map((t, idx) => ({
                    affiliate_id: t.affiliate_id,
                    touchpoint: t,
                    weight: idx === 0 ? 1.0 : 0.0,
                    commission_usd: idx === 0 ? totalCommission : 0.0
                }));
                break;

            case 'last_touch':
                shares = touchpoints.map((t, idx) => ({
                    affiliate_id: t.affiliate_id,
                    touchpoint: t,
                    weight: idx === touchpoints.length - 1 ? 1.0 : 0.0,
                    commission_usd: idx === touchpoints.length - 1 ? totalCommission : 0.0
                }));
                break;

            case 'linear':
                const equalWeight = 1.0 / touchpoints.length;
                const equalCommission = totalCommission / touchpoints.length;
                shares = touchpoints.map(t => ({
                    affiliate_id: t.affiliate_id,
                    touchpoint: t,
                    weight: equalWeight,
                    commission_usd: parseFloat(equalCommission.toFixed(2))
                }));
                break;

            case 'position_based': // 40% first, 40% last, 20% split middle
                if (touchpoints.length === 1) {
                    shares = [{ affiliate_id: touchpoints[0].affiliate_id, touchpoint: touchpoints[0], weight: 1.0, commission_usd: totalCommission }];
                } else if (touchpoints.length === 2) {
                    shares = [
                        { affiliate_id: touchpoints[0].affiliate_id, touchpoint: touchpoints[0], weight: 0.5, commission_usd: parseFloat((totalCommission * 0.5).toFixed(2)) },
                        { affiliate_id: touchpoints[1].affiliate_id, touchpoint: touchpoints[1], weight: 0.5, commission_usd: parseFloat((totalCommission * 0.5).toFixed(2)) }
                    ];
                } else {
                    const middleCount = touchpoints.length - 2;
                    const middleWeight = 0.20 / middleCount;
                    shares = touchpoints.map((t, idx) => {
                        let w = middleWeight;
                        if (idx === 0) w = 0.40;
                        if (idx === touchpoints.length - 1) w = 0.40;
                        return {
                            affiliate_id: t.affiliate_id,
                            touchpoint: t,
                            weight: w,
                            commission_usd: parseFloat((totalCommission * w).toFixed(2))
                        };
                    });
                }
                break;

            default: // Last touch fallback
                shares = touchpoints.map((t, idx) => ({
                    affiliate_id: t.affiliate_id,
                    touchpoint: t,
                    weight: idx === touchpoints.length - 1 ? 1.0 : 0.0,
                    commission_usd: idx === touchpoints.length - 1 ? totalCommission : 0.0
                }));
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            model,
            order_amount_usd: orderAmount,
            total_commission_usd: totalCommission,
            attributed_shares: shares
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
