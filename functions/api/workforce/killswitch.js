/**
 * Cloudflare Pages Function: /api/workforce/killswitch
 * Emergency Control Plane: Pause / Resume Swarm & Individual Departments.
 * Protected by server-side authorization: requires valid owner Bearer token.
 */

import { getCorsHeaders, httpStatusForAuthError, verifyServerSession } from '../../_shared/auth_gate.js';

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
    const headers = getCorsHeaders(context.request);

    return new Response(JSON.stringify({
        status: "SUCCESS",
        kill_switch_state: KILL_SWITCH_STATE
    }), { headers, status: 200 });
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    // Privileged mutation: require server session authorization
    const auth = await verifyServerSession(request, env, {
        requiredRole: 'owner',
        minHierarchyLevel: 1,
        requireMfa: true
    });

    if (!auth.authorized) {
        const httpStatus = httpStatusForAuthError(auth.status);
        return new Response(JSON.stringify({
            status: auth.status,
            error: auth.error || 'Server authorization required for kill-switch activation'
        }), { headers, status: httpStatus });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const { target, action } = body; // target: 'system', 'sales', 'marketing', 'payouts', 'tools' | action: 'pause', 'resume'

        if (!target || !action) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing required fields: target and action'
            }), { headers, status: 400 });
        }

        if (target === 'system') {
            KILL_SWITCH_STATE.system_paused = (action === 'pause');
        } else if (target === 'sales') {
            KILL_SWITCH_STATE.sales_paused = (action === 'pause');
        } else if (target === 'marketing') {
            KILL_SWITCH_STATE.marketing_paused = (action === 'pause');
        } else if (target === 'payouts') {
            KILL_SWITCH_STATE.payouts_paused = (action === 'pause');
        } else if (target === 'tools') {
            KILL_SWITCH_STATE.external_tools_paused = (action === 'pause');
        }

        KILL_SWITCH_STATE.last_action = `${action.toUpperCase()}_${target.toUpperCase()}`;
        KILL_SWITCH_STATE.updated_at = new Date().toISOString();

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: `Emergency Kill Switch: Target ${target} set to ${action.toUpperCase()}`,
            authorized_by: auth.user.email,
            kill_switch_state: KILL_SWITCH_STATE
        }), { headers, status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
