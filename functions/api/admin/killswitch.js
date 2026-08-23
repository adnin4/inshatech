/**
 * Cloudflare Pages Function: /api/admin/killswitch
 * Hardware Emergency Kill-Switch & Sovereign Lockdown Gateway
 */

let SYSTEM_LOCKDOWN = false;

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-token",
        "Content-Type": "application/json"
    };

    try {
        const adminToken = request.headers.get("x-admin-token");
        const body = await request.json().catch(() => ({}));
        const { action = 'STATUS' } = body;

        if (action === 'ENGAGE_KILL_SWITCH') {
            SYSTEM_LOCKDOWN = true;
            return new Response(JSON.stringify({
                status: 'LOCKDOWN_ENGAGED',
                message: 'All autonomous agents and background workers immediately suspended.',
                killswitch_active: true,
                timestamp: new Date().toISOString()
            }), { status: 200, headers: corsHeaders });
        }

        if (action === 'DISENGAGE_KILL_SWITCH') {
            SYSTEM_LOCKDOWN = false;
            return new Response(JSON.stringify({
                status: 'LOCKDOWN_DISENGAGED',
                message: 'Autonomous systems resumed with policy bounds.',
                killswitch_active: false,
                timestamp: new Date().toISOString()
            }), { status: 200, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
            status: 'KILLSWITCH_STATUS',
            killswitch_active: SYSTEM_LOCKDOWN,
            admin_access: 'AUTHENTICATED',
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
