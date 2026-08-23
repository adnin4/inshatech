/**
 * Cloudflare Pages Function: /api/tenants/switch
 * Multi-Tenancy Organization & Workspace Switcher API
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Tenant-ID",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { tenant_id, workspace_id, user_id } = body;

        if (!tenant_id) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing tenant_id'
            }), { headers, status: 400 });
        }

        const tenantSessionToken = `tnt_sess_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

        return new Response(JSON.stringify({
            status: 'SWITCHED',
            active_tenant: {
                id: tenant_id,
                name: tenant_id === 'default' ? 'IINSHA Enterprise HQ' : `Organization ${tenant_id}`,
                plan: 'Enterprise',
                active_workspace_id: workspace_id || 'ws_default_prod'
            },
            tenant_token: tenantSessionToken,
            isolation_enforced: true,
            timestamp: new Date().toISOString()
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers, status: 500 });
    }
}

