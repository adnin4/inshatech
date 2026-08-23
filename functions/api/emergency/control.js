/**
 * Cloudflare Pages Function: /api/emergency/control
 * Granular Kill Switch & Emergency Freeze Controller
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { target_action = 'PAUSE_ALL', scope = 'GLOBAL', reason = 'Manual super-admin intervention' } = body;

        return new Response(JSON.stringify({
            status: "SUCCESS",
            emergency_event: {
                event_id: "emg_" + Date.now(),
                target_action,
                scope,
                triggered_at: new Date().toISOString(),
                state: "ACTIVE_FREEZE",
                affected_systems: [
                    "AI Autonomous Dispatcher",
                    "External Webhooks",
                    "Payout Gateway"
                ],
                reason
            }
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

