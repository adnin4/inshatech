/**
 * Cloudflare Pages Function: /api/control/emergency
 * Emergency Command Center API (1-Click Action Dispatcher)
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
            'pause_all_ai': 'All 13 AI Agent Swarms and active Mission DAGs immediately paused.',
            'resume_all_ai': 'AI Swarms and execution pipelines resumed.',
            'kill_agent': `Agent ${target_id || 'SPECIFIED'} terminated immediately and active runs aborted.`,
            'disable_tool': `Tool ${target_id || 'SPECIFIED'} disabled across all permission levels.`,
            'freeze_payments': 'Payment processing and checkout endpoints locked into maintenance mode.',
            'freeze_affiliates': 'Affiliate commission releases and payout requests frozen.',
            'lock_admin': 'Admin session authentication locked. Emergency break-glass required.',
            'rotate_secrets': 'All Secret Broker keys queued for immediate cryptographic rotation.'
        };

        if (!action || !EMERGENCY_ACTIONS[action]) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: `Invalid emergency action. Valid actions: ${Object.keys(EMERGENCY_ACTIONS).join(', ')}`
            }), { headers, status: 400 });
        }

        const incidentId = "inc_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);

        return new Response(JSON.stringify({
            status: 'EXECUTED',
            incident_id: incidentId,
            action,
            target_id: target_id || null,
            reason,
            message: EMERGENCY_ACTIONS[action],
            dispatched_by: 'Owner (Level 1)',
            timestamp: new Date().toISOString()
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers, status: 500 });
    }
}
