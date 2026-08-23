/**
 * Cloudflare Pages Function: /api/control/autonomy
 * Autonomy Slider Policy Engine & Operational Mode Dispatcher
 */

let AUTONOMY_STATE = {
    current_mode: 'SEMI_AUTONOMOUS', // 'MANUAL', 'ASSISTED', 'SEMI_AUTONOMOUS', 'AUTONOMOUS', 'HIGH_AUTONOMY'
    financial_threshold_usd: 500.00,
    rules: {
        MANUAL: { label: "Manual Mode", auto_execute_level: 0, require_approval_for_all: true },
        ASSISTED: { label: "Assisted Mode", auto_execute_level: 1, require_approval_for_leads: true },
        SEMI_AUTONOMOUS: { label: "Semi-Autonomous (Default)", auto_execute_level: 2, require_approval_for_money: true },
        AUTONOMOUS: { label: "Autonomous Mode", auto_execute_level: 2, auto_campaigns: true, require_approval_for_money: true },
        HIGH_AUTONOMY: { label: "High Autonomy", auto_execute_level: 3, hard_blocks_retained: true }
    },
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
        autonomy_state: AUTONOMY_STATE
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
        const mode = body.mode || 'SEMI_AUTONOMOUS';

        if (AUTONOMY_STATE.rules[mode]) {
            AUTONOMY_STATE.current_mode = mode;
            AUTONOMY_STATE.updated_at = new Date().toISOString();
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: `Workforce Autonomy Level updated to: ${mode}`,
            autonomy_state: AUTONOMY_STATE
        }), { headers, status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

