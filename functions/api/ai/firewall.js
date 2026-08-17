/**
 * Cloudflare Pages Function: /api/ai/firewall
 * AI Permission Firewall: Stamps Agent Identity, Enforces Risk Scoring & Policy Boundaries
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { agent_id = 'sales', version = 'v2.1.0', action_requested, payload = {} } = body;

        // Calculate dynamic risk score (0 to 100)
        let riskScore = 10;
        let requiresHITL = false;

        if (action_requested.includes('refund') || action_requested.includes('payout')) {
            riskScore = 85;
            requiresHITL = true;
        } else if (action_requested.includes('create') || action_requested.includes('send')) {
            riskScore = 35;
        } else if (action_requested.includes('delete') || action_requested.includes('destroy')) {
            riskScore = 95;
            requiresHITL = true;
        }

        const agentIdentityStamp = {
            agent_id,
            version,
            department: 'Revenue & Operations',
            action_requested,
            risk_score: riskScore,
            policy_check: riskScore > 80 ? 'HITL_REQUIRED' : 'POLICY_PASS',
            autonomy_level: riskScore > 80 ? 'LEVEL_6_EXECUTE_WITH_APPROVAL' : 'LEVEL_5_EXECUTE_LOW_RISK',
            decision: requiresHITL ? 'PAUSED_FOR_APPROVAL' : 'PERMITTED_TO_EXECUTE',
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: 'FIREWALL_VERIFIED',
            identity_stamp: agentIdentityStamp
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}
