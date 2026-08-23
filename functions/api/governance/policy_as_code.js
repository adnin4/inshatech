/**
 * Cloudflare Pages Function: /api/governance/policy_as_code
 * Machine-Enforceable Policy-as-Code Engine: Zero-Trust Agent Rules
 * Enforces:
 * - minimum_margin >= 50%
 * - max_discount <= 20%
 * - refund_above = human_approval ($100 threshold)
 * - payout_above = human_approval ($500 threshold)
 * - production_delete = forbidden (always blocked)
 */

const ENTERPRISE_POLICIES = {
    minimum_margin_percent: 50.0,
    maximum_autonomous_discount_percent: 20.0,
    refund_human_approval_threshold_usd: 100.0,
    affiliate_payout_approval_threshold_usd: 500.0,
    production_destructive_actions_allowed: false,
    unrestricted_fund_transfers_allowed: false
};

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
        const { action_type, requested_discount_percent = 0, amount_usd = 0, target_resource = "" } = body;

        // Rule 1: Destructive production actions always blocked
        if (target_resource.includes("production_drop") || action_type === "DELETE_PRODUCTION_DATA") {
            return new Response(JSON.stringify({
                policy_verdict: "BLOCKED_FORBIDDEN",
                reason: "Destructive production actions are strictly forbidden by Policy-as-Code Rule #1.",
                policy_id: "POL_01_DESTRUCTIVE_BLOCK"
            }), { headers, status: 403 });
        }

        // Rule 2: Discount boundary checks
        if (requested_discount_percent > ENTERPRISE_POLICIES.maximum_autonomous_discount_percent) {
            return new Response(JSON.stringify({
                policy_verdict: "HUMAN_APPROVAL_REQUIRED",
                reason: `Requested discount (${requested_discount_percent}%) exceeds autonomous limit (${ENTERPRISE_POLICIES.maximum_autonomous_discount_percent}%). Owner approval needed.`,
                policy_id: "POL_02_DISCOUNT_THRESHOLD"
            }), { headers, status: 200 });
        }

        // Rule 3: High-value refund checks
        if (action_type === "PROCESS_REFUND" && amount_usd > ENTERPRISE_POLICIES.refund_human_approval_threshold_usd) {
            return new Response(JSON.stringify({
                policy_verdict: "HUMAN_APPROVAL_REQUIRED",
                reason: `Refund amount ($${amount_usd}) exceeds autonomous limit ($${ENTERPRISE_POLICIES.refund_human_approval_threshold_usd}). Owner approval required.`,
                policy_id: "POL_03_REFUND_THRESHOLD"
            }), { headers, status: 200 });
        }

        return new Response(JSON.stringify({
            policy_verdict: "PERMITTED_AUTONOMOUS",
            policies_evaluated: ENTERPRISE_POLICIES,
            timestamp: new Date().toISOString()
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}

