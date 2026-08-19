/**
 * Cloudflare Pages Function: /api/auth/rbac
 * Enterprise 14-Role RBAC & Granular Permission Evaluation Engine
 */

export const ENTERPRISE_ROLES = {
    owner: { title: 'Owner & Founder', level: 1, permissions: ['*'] },
    super_admin: { title: 'Super Admin', level: 2, permissions: ['*'] },
    admin: { title: 'Administrator', level: 3, permissions: ['service.*', 'order.*', 'payment.view', 'agent.*', 'tool.execute', 'affiliate.approve'] },
    ops_manager: { title: 'Operations Manager', level: 4, permissions: ['agent.execute', 'agent.pause', 'tool.execute', 'order.view'] },
    finance_manager: { title: 'Finance Manager', level: 5, permissions: ['payment.*', 'order.refund', 'affiliate.payout', 'budget.override'] },
    sales_manager: { title: 'Sales Manager', level: 6, permissions: ['order.view', 'service.view', 'lead.*', 'proposal.*'] },
    marketing_manager: { title: 'Marketing Manager', level: 7, permissions: ['campaign.*', 'content.*', 'analytics.view'] },
    support_manager: { title: 'Support Manager', level: 8, permissions: ['ticket.*', 'customer.*', 'order.view'] },
    ai_ops_manager: { title: 'AI Operations Manager', level: 9, permissions: ['agent.*', 'tool.*', 'autonomy.set'] },
    security_manager: { title: 'Security Manager', level: 10, permissions: ['secret.*', 'audit.view', 'security.*'] },
    developer: { title: 'Developer / Engineer', level: 11, permissions: ['agent.execute', 'tool.execute', 'service.view'] },
    analyst: { title: 'Data Analyst', level: 12, permissions: ['analytics.view', 'order.view', 'report.generate'] },
    content_editor: { title: 'Content Editor', level: 13, permissions: ['content.edit', 'blog.edit'] },
    read_only: { title: 'Read Only', level: 14, permissions: ['*.view', '*.read'] }
};

export function hasPermission(userRole, requiredPermission) {
    if (!userRole) return false;
    const roleConfig = ENTERPRISE_ROLES[userRole];
    if (!roleConfig) return false;

    // Wildcard permissions
    if (roleConfig.permissions.includes('*')) return true;

    // Exact match
    if (roleConfig.permissions.includes(requiredPermission)) return true;

    // Prefix wildcard match (e.g. 'service.*' matches 'service.create')
    const [domain] = requiredPermission.split('.');
    if (roleConfig.permissions.includes(`${domain}.*`)) return true;

    return false;
}

export async function onRequestPost(context) {
    try {
        const body = await context.request.json();
        const { role, permission } = body;

        if (!role || !permission) {
            return new Response(JSON.stringify({ error: 'Missing role or permission' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }

        const allowed = hasPermission(role, permission);
        const roleInfo = ENTERPRISE_ROLES[role] || { title: 'Unknown', level: 99 };

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            role,
            role_title: roleInfo.title,
            hierarchy_level: roleInfo.level,
            permission,
            allowed,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
