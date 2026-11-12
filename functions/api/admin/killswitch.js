/**
 * Cloudflare Pages Function: /api/admin/killswitch
 * Hardware Emergency Kill-Switch & Sovereign Lockdown Gateway
 * Protected by server-side authorization: requires valid owner session.
 */

import { getCorsHeaders, verifyServerSession } from '../../_shared/auth_gate.js';

let SYSTEM_LOCKDOWN = false;

async function getLockdownState(env = {}) {
    if (env.KV_STATE && typeof env.KV_STATE.get === 'function') {
        try {
            const val = await env.KV_STATE.get('system_lockdown');
            if (val !== null) return val === 'true';
        } catch (_) {}
    }
    return SYSTEM_LOCKDOWN;
}

async function setLockdownState(active, env = {}) {
    SYSTEM_LOCKDOWN = Boolean(active);
    if (env.KV_STATE && typeof env.KV_STATE.put === 'function') {
        try {
            await env.KV_STATE.put('system_lockdown', active ? 'true' : 'false');
        } catch (_) {}
    }
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);
    const active = await getLockdownState(env);

    return new Response(JSON.stringify({
        status: 'KILLSWITCH_STATUS',
        killswitch_active: active,
        timestamp: new Date().toISOString()
    }), { status: 200, headers });
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    // Require Level 1 Owner Authentication
    const auth = await verifyServerSession(request, env, {
        requiredRole: 'owner',
        minHierarchyLevel: 1,
        requireMfa: true
    });

    if (!auth.authorized) {
        const httpStatus = auth.status === 'CONFIGURATION_ERROR' ? 503 :
                           auth.status === 'PRIVILEGE_REJECTED' || auth.status === 'HIERARCHY_REJECTED' ? 403 : 401;
        return new Response(JSON.stringify({
            status: auth.status,
            error: auth.error || 'Server authorization required for kill-switch activation'
        }), { status: httpStatus, headers });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const { action = 'STATUS' } = body;

        if (action === 'ENGAGE_KILL_SWITCH') {
            await setLockdownState(true, env);
            return new Response(JSON.stringify({
                status: 'LOCKDOWN_ENGAGED',
                message: 'All autonomous agents and background workers immediately suspended.',
                killswitch_active: true,
                dispatched_by: auth.user.email,
                timestamp: new Date().toISOString()
            }), { status: 200, headers });
        }

        if (action === 'DISENGAGE_KILL_SWITCH') {
            await setLockdownState(false, env);
            return new Response(JSON.stringify({
                status: 'LOCKDOWN_DISENGAGED',
                message: 'Autonomous systems resumed with policy bounds.',
                killswitch_active: false,
                dispatched_by: auth.user.email,
                timestamp: new Date().toISOString()
            }), { status: 200, headers });
        }

        const active = await getLockdownState(env);
        return new Response(JSON.stringify({
            status: 'KILLSWITCH_STATUS',
            killswitch_active: active,
            admin_access: 'AUTHENTICATED',
            user: auth.user.email,
            timestamp: new Date().toISOString()
        }), { status: 200, headers });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { status: 500, headers });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
