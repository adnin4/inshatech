/**
 * Cloudflare Pages Function: /api/control/command
 * Universal Command Bar (⌘ K) Natural Language Processor & Action Dispatcher
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const query = (body.query || '').trim().toLowerCase();

        let response = {
            query: body.query,
            intent: 'UNKNOWN',
            action_type: 'INFO',
            summary: "IINSHA Control Plane: Command recognized.",
            data: {},
            proposed_action: null
        };

        if (query.includes('revenue') || query.includes('sales') || query.includes('earning')) {
            response.intent = 'REVENUE_LOOKUP';
            response.summary = "Today's Gross Revenue: $1,850 USD (৳226,625 BDT) across 3 orders (+18% vs 7-day average).";
            response.data = { todayUSD: 1850, monthUSD: 24820, profitMargin: "68.4%" };
        } else if (query.includes('budget') || query.includes('cost') || query.includes('spend')) {
            response.intent = 'BUDGET_ANALYSIS';
            response.summary = "Active AI Workforce daily spend: $4.12 USD of $45.00 allocated limit (9.1% utilization).";
            response.data = { dailyLimitUSD: 45.00, spentTodayUSD: 4.12, topSpender: "AG-SALES-002 ($1.24)" };
            if (query.includes('increase') || query.includes('change') || query.includes('30')) {
                response.proposed_action = {
                    title: "Increase Sales Agent Daily Budget to $30",
                    impact: "+12% execution capacity, estimated +$3.40 daily cost",
                    action_key: "SET_BUDGET_SALES_30"
                };
            }
        } else if (query.includes('affiliate') || query.includes('partner')) {
            response.intent = 'PARTNER_PERFORMANCE';
            response.summary = "Active Growth Partners: 32. Top performer: PARTNER-284 with 12 conversions ($2,160 GMV).";
            response.data = { activePartners: 32, conversionsMonth: 78, pendingPayoutsUSD: 420 };
        } else if (query.includes('attention') || query.includes('pending') || query.includes('approval')) {
            response.intent = 'ATTENTION_ITEMS';
            response.summary = "3 items require your attention: 1 Proposal Approval ($1,800), 1 Suspicious Conversion review, 1 Campaign launch.";
            response.data = { pendingApprovals: 3, criticalCount: 1 };
        } else {
            response.intent = 'GENERAL_QUERY';
            response.summary = `Control Plane executing query "${body.query}". All systems running autonomously.`;
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            result: response
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
