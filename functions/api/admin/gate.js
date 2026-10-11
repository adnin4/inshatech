/**
 * IINSHA Admin Gate — Fail-closed HMAC Session Verification Endpoint.
 * Serves /api/admin/gate to verify server-side session validity before allowing UI or privileged access.
 */

import { getCorsHeaders, verifyServerSession } from '../../_shared/auth_gate.js';

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: true
        });

        if (!auth.authorized) {
            const httpStatus = auth.status === 'CONFIGURATION_ERROR' ? 503 :
                               auth.status === 'PRIVILEGE_REJECTED' || auth.status === 'HIERARCHY_REJECTED' ? 403 : 401;
            return new Response(JSON.stringify({
                authenticated: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatus, headers });
        }

        return new Response(JSON.stringify({
            authenticated: true,
            status: 'AUTHORIZED',
            user: auth.user,
            expires_at: auth.expires_at
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            authenticated: false,
            status: 'INVALID_TOKEN',
            error: e.message || 'Token verification error'
        }), { status: 401, headers });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
