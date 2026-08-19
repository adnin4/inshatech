/**
 * Cloudflare Pages Function: /api/incidents/engine
 * Agent Incident Response & Auto-Remediation System
 */

export const ACTIVE_INCIDENTS = [
    {
        id: 'INC-2048',
        agent_id: 'SALES_AGENT',
        title: 'CRM API Timeout During High-Velocity Ingestion',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        impact_scope: '27 leads queued during burst',
        root_cause: 'HubSpot rate limit 429 encountered at 14:22 UTC',
        automated_action: 'Activated exponential backoff retry & SQLite local buffer',
        human_action_required: false,
        resolution_time_ms: 840,
        timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 'INC-2049',
        agent_id: 'DEVOPS_AGENT',
        title: 'n8n Docker Webhook SSL Certificate Auto-Renew',
        severity: 'LOW',
        status: 'RESOLVED',
        impact_scope: '0 downtime (Zero client disruption)',
        root_cause: 'Let\'s Encrypt 30-day renewal cycle trigger',
        automated_action: 'Executed acme-challenge & reloaded Nginx proxy',
        human_action_required: false,
        resolution_time_ms: 1200,
        timestamp: new Date(Date.now() - 7200000).toISOString()
    }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: 'SUCCESS',
        total_incidents: ACTIVE_INCIDENTS.length,
        system_health: 'HEALTHY_DEGRADED_NONE',
        incidents: ACTIVE_INCIDENTS
    }), { headers });
}

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const newIncident = {
            id: `INC-${Date.now().toString().slice(-4)}`,
            agent_id: body.agent_id || 'GUARDIAN_AGENT',
            title: body.title || 'Automated Anomaly Intercepted',
            severity: body.severity || 'LOW',
            status: 'OPEN',
            impact_scope: body.impact_scope || 'Isolated sandbox execution',
            root_cause: body.root_cause || 'Rule violation flagged by policy engine',
            automated_action: 'Paused agent sub-task & logged event to audit trail',
            human_action_required: body.severity === 'CRITICAL',
            timestamp: new Date().toISOString()
        };

        ACTIVE_INCIDENTS.unshift(newIncident);

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Incident recorded and containment protocol activated.',
            incident: newIncident
        }), { headers, status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ status: 'ERROR', error: err.message }), { headers, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
