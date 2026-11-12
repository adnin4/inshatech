/**
 * Cloudflare Pages Function: /api/auth/logout
 * Sovereign Admin Session Revocation & Cookie Clear Endpoint.
 * Invalidate active jti token and clear HttpOnly session cookies.
 */

import { getCorsHeaders, verifyServerSession, revokeSessionToken } from '../../_shared/auth_gate.js';

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: null, // Allow any valid authenticated user/role to logout
            minHierarchyLevel: 99,
            requireMfa: false
        });

        if (auth.authorized && auth.user?.jti) {
            await revokeSessionToken(auth.user.jti, env);
        }

        // Expire session cookies immediately
        headers['Set-Cookie'] = '__Host-iinsha_admin_session=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Strict';

        return new Response(JSON.stringify({
            status: 'LOGGED_OUT',
            message: 'Session revoked and security cookies cleared',
            revoked_jti: auth.user?.jti || null,
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
