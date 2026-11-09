/**
 * Cloudflare Pages Function: /api/agents/registry
 * Canonical 18-Specialist Agent Autonomous Business Organization Registry Endpoint
 */

import { AGENT_REGISTRY, FIVE_TIER_HITL_MATRIX, AUTONOMY_SPECTRUM, PERMISSION_LEVELS, ANTI_LOOP_CONFIG } from '../../_shared/ai_brain/agents/agent_registry.js';

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const primaryAgents = Object.entries(AGENT_REGISTRY)
        .filter(([key]) => !['CEO_AGENT', 'SALES_AGENT', 'SDR_AGENT', 'DEVOPS_AGENT', 'MARKETING_AGENT', 'SUCCESS_AGENT', 'FINANCE_AGENT', 'GUARDIAN_AGENT'].includes(key))
        .map(([key, agent]) => ({
            key,
            id: agent.identity.id,
            name: agent.identity.name,
            department: agent.identity.department,
            role: agent.identity.role,
            primary_goal: agent.goal.primary,
            allowed_objectives: agent.goal.allowed_objectives,
            forbidden_objectives: agent.goal.forbidden_objectives,
            memory: {
                context_tokens: agent.memory.context_tokens,
                persist_state: agent.memory.persist_state
            },
            tools: agent.tools.allowed,
            max_tool_calls: agent.tools.max_calls,
            autonomy_level: agent.permissions.autonomy_level,
            risk_class: agent.permissions.risk_class || 'LOW',
            permission_level: agent.permissions.permission_level,
            requires_hitl: agent.permissions.requires_hitl || false,
            evaluation: agent.evaluation
        }));

    return new Response(JSON.stringify({
        status: 'SUCCESS',
        architecture: 'IINSHA_AI_BOS_18_SPECIALIST_AGENTS',
        count: primaryAgents.length,
        agents: primaryAgents,
        governance: {
            hitl_matrix: FIVE_TIER_HITL_MATRIX,
            autonomy_spectrum: AUTONOMY_SPECTRUM,
            permission_levels: PERMISSION_LEVELS,
            anti_loop_policy: ANTI_LOOP_CONFIG
        },
        verified_at: new Date().toISOString()
    }), { status: 200, headers });
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get("Origin") || "*";
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
