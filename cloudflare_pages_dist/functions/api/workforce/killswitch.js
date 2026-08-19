/**
 * Cloudflare Pages Function: /api/workforce/killswitch
 * Emergency Control Plane: Pause / Resume Swarm & Individual Departments
 */

let KILL_SWITCH_STATE = {
    system_paused: false,
    sales_paused: false,
    marketing_paused: false,
    payouts_paused: false,
    external_tools_paused: false,
    last_action: "INITIAL_READY",
    updated_at: new Date().toISOString()
};

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        kill_switch_state: KILL_SWITCH_STATE
    }), { headers, status: 200 });
}

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Token",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { target, action } = body; // target: 'system', 'sales', 'marketing', 'payouts', 'tools' | action: 'pause', 'resume'

        if (target === 'system') {
            KILL_SWITCH_STATE.system_paused = (action === 'pause');
        } else if (target === 'sales') {
            KILL_SWITCH_STATE.sales_paused = (action === 'pause');
        } else if (target === 'payouts') {
            KILL_SWITCH_STATE.payouts_paused = (action === 'pause');
        }

        KILL_SWITCH_STATE.last_action = `${action.toUpperCase()}_${target.toUpperCase()}`;
        KILL_SWITCH_STATE.updated_at = new Date().toISOString();

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: `Emergency Kill Switch: Target ${target} set to ${action.toUpperCase()}`,
            kill_switch_state: KILL_SWITCH_STATE
        }), { headers, status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
