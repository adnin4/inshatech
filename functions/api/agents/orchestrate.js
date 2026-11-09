/**
 * Cloudflare Pages Function: /api/agents/orchestrate
 * Multi-Agent Swarm Orchestrator, Anti-Loop Recursion Bounding & Tool Sandbox Gateway
 * Governs the complete 18-Specialist Agent Autonomous Business Organization
 */

import { AGENT_REGISTRY, FIVE_TIER_HITL_MATRIX, ANTI_LOOP_CONFIG } from '../../_shared/ai_brain/agents/agent_registry.js';

function resolveAgent(identifier) {
    if (!identifier) return AGENT_REGISTRY.CHIEF_ORCHESTRATOR_AGENT;
    const normalized = String(identifier).toLowerCase().trim();

    for (const [key, agent] of Object.entries(AGENT_REGISTRY)) {
        if (key.toLowerCase() === normalized) return agent;
        if (agent.identity && agent.identity.id === normalized) return agent;
        if (key.toLowerCase().replace(/_agent$/, '') === normalized) return agent;
    }

    // Default fallback
    return AGENT_REGISTRY.CHIEF_ORCHESTRATOR_AGENT;
}

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const agentsList = Object.entries(AGENT_REGISTRY)
        .filter(([key]) => !['CEO_AGENT', 'SALES_AGENT', 'SDR_AGENT', 'DEVOPS_AGENT', 'MARKETING_AGENT', 'SUCCESS_AGENT', 'FINANCE_AGENT', 'GUARDIAN_AGENT'].includes(key))
        .map(([key, agent]) => ({
            key,
            id: agent.identity.id,
            name: agent.identity.name,
            department: agent.identity.department,
            role: agent.identity.role,
            autonomy_level: agent.permissions.autonomy_level,
            risk_class: agent.permissions.risk_class || 'LOW',
            requires_hitl: agent.permissions.requires_hitl || false,
            tools: agent.tools.allowed
        }));

    return new Response(JSON.stringify({
        status: 'OK',
        swarm_version: '18_SPECIALIST_AGENTS_V5',
        total_registered_agents: agentsList.length,
        agents: agentsList,
        hitl_matrix: FIVE_TIER_HITL_MATRIX,
        anti_loop_config: ANTI_LOOP_CONFIG
    }), { status: 200, headers });
}

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const {
            agent_id = 'orchestrator',
            prompt = '',
            delegation_depth = 1,
            task_context = {}
        } = body;

        // Anti-Loop Recursion Guard (Max depth 5)
        if (delegation_depth > (ANTI_LOOP_CONFIG.max_delegation_depth || 5)) {
            return new Response(JSON.stringify({
                status: 'RECURSION_LIMIT_EXCEEDED',
                error: `Anti-loop policy strictly halts agent delegation depth > ${ANTI_LOOP_CONFIG.max_delegation_depth || 5}.`,
                delegation_depth
            }), { status: 400, headers: corsHeaders });
        }

        const targetAgent = resolveAgent(agent_id);

        // Check HITL gate
        const requiresHitl = targetAgent.permissions?.requires_hitl === true || targetAgent.permissions?.autonomy_level === 'L3_APPROVAL';
        const isProhibited = targetAgent.permissions?.autonomy_level === 'L4_PROHIBITED';

        if (isProhibited) {
            return new Response(JSON.stringify({
                status: 'ACTION_BLOCKED_POLICY_VIOLATION',
                error: 'Requested action falls into L4_PROHIBITED tier and cannot be executed autonomously.',
                agent: targetAgent.identity
            }), { status: 403, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
            status: 'ORCHESTRATION_SUCCESS',
            agent: {
                id: targetAgent.identity.id,
                name: targetAgent.identity.name,
                department: targetAgent.identity.department,
                role: targetAgent.identity.role
            },
            permissions: targetAgent.permissions,
            delegation_depth,
            decision: requiresHitl ? 'AWAITING_HUMAN_APPROVAL_GATE' : 'DELEGATE_SAFE_SANDBOX',
            requires_hitl: requiresHitl,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get("Origin") || "*";
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
