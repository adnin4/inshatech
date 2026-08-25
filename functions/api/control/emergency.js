/**
 * Cloudflare Pages Function: /api/control/emergency
 * Emergency Command Center API.
 *
 * This endpoint only authorizes an emergency action. It never claims that a
 * side effect occurred unless an independently verified executor receipt exists.
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
        const { action, target_id, reason = 'Owner Emergency Intervention' } = body;

        const EMERGENCY_ACTIONS = {
            pause_all_ai: true,
            resume_all_ai: true,
            kill_agent: true,
            disable_tool: true,
            freeze_payments: true,
            freeze_affiliates: true,
            lock_admin: true,
            rotate_secrets: true
        };

        if (!action || !EMERGENCY_ACTIONS[action]) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: `Invalid emergency action. Valid actions: ${Object.keys(EMERGENCY_ACTIONS).join(', ')}`
            }), { headers, status: 400 });
        }

        // This API currently has no bound side-effect executor. Do not claim
        // EXECUTED merely because the owner requested the action.
        const incidentId = `inc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        return new Response(JSON.stringify({
            status: 'BLOCKED',
            reason: 'EMERGENCY_EXECUTOR_NOT_CONFIGURED',
            production_claim: false,
            verified: false,
            test_double: false,
            incident_id: incidentId,
            action,
            target_id: target_id || null,
            owner_request: true,
            requested_reason: reason,
            message: 'Emergency action recorded but no verified side-effect executor is bound. No production side effect is claimed.',
            timestamp: new Date().toISOString()
        }), { headers, status: 202 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers, status: 500 });
    }
}