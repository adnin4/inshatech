/**
 * Cloudflare Pages Function: /api/agents/orchestrate
 * Multi-Agent Swarm Orchestrator, Anti-Loop Recursion Bounding & Tool Sandbox Gateway
 * Governs the complete 18-Specialist Agent Autonomous Business Organization.
 */

import { AGENT_REGISTRY, FIVE_TIER_HITL_MATRIX, ANTI_LOOP_CONFIG } from '../../_shared/ai_brain/agents/agent_registry.js';
import { AgentRuntime } from '../../_shared/ai_brain/agent_runtime.js';

function resolveAgent(identifier) {
    if (!identifier) return { key: 'CHIEF_ORCHESTRATOR_AGENT', agent: AGENT_REGISTRY.CHIEF_ORCHESTRATOR_AGENT };
    const normalized = String(identifier).trim().toUpperCase();

    // Direct key match
    if (AGENT_REGISTRY[normalized]) {
        return { key: normalized, agent: AGENT_REGISTRY[normalized] };
    }

    // Check with _AGENT suffix
    const withSuffix = `${normalized}_AGENT`;
    if (AGENT_REGISTRY[withSuffix]) {
        return { key: withSuffix, agent: AGENT_REGISTRY[withSuffix] };
    }

    // Match by identity.id
    for (const [key, agent] of Object.entries(AGENT_REGISTRY)) {
        if (agent.identity && agent.identity.id.toUpperCase() === normalized) {
            return { key, agent };
        }
    }

    // Strict validation: unknown IDs must return null (never silently fall back to sales or orchestrator)
    return null;
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
    const { request, env = {} } = context;
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
            tool_name = null,
            tool_args = {},
            delegation_depth = 1,
            task_context = {},
            owner_token = null,
            tenant_id = 'default'
        } = body;

        // Anti-Loop Recursion Guard (Max depth 5)
        if (delegation_depth > (ANTI_LOOP_CONFIG.max_delegation_depth || 5)) {
            return new Response(JSON.stringify({
                status: 'DENIED',
                error: 'RECURSION_LIMIT_EXCEEDED',
                message: `Anti-loop policy strictly halts agent delegation depth > ${ANTI_LOOP_CONFIG.max_delegation_depth || 5}.`,
                delegation_depth
            }), { status: 400, headers: corsHeaders });
        }

        // Strict Agent Resolution — no silent fallback
        const resolved = resolveAgent(agent_id);
        if (!resolved) {
            return new Response(JSON.stringify({
                status: 'DENIED',
                error: 'UNKNOWN_AGENT',
                message: `Agent identifier '${agent_id}' is not recognized in the 18-Specialist Swarm.`,
                available_specialists: [
                    'orchestrator', 'requirements', 'architect', 'developer', 'reviewer',
                    'qa', 'security', 'evidence', 'research', 'lead_hunter', 'crm_outreach',
                    'sales_proposal', 'payment_verifier', 'finance_cfo', 'devops_sre',
                    'support_success', 'analytics_renewal', 'deployment_release'
                ]
            }), { status: 400, headers: corsHeaders });
        }

        const { key: targetAgentKey, agent: targetAgent } = resolved;

        // Policy Check: L4 Prohibited Tier
        const isProhibited = targetAgent.permissions?.autonomy_level === 'L4_PROHIBITED';
        if (isProhibited) {
            return new Response(JSON.stringify({
                status: 'DENIED',
                error: 'ACTION_BLOCKED_POLICY_VIOLATION',
                message: 'Requested agent tier falls into L4_PROHIBITED and cannot be executed autonomously.',
                agent: targetAgent.identity
            }), { status: 403, headers: corsHeaders });
        }

        const runtime = new AgentRuntime();
        const missionId = `MSN-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        // Case A: Specific tool execution requested
        if (tool_name) {
            const reqHost = (() => { try { return new URL(request.url).hostname.toLowerCase(); } catch (_) { return ''; } })();
            const resolvedEnv = reqHost.endsWith('.pages.dev') ? (reqHost.split('.').length > 3 ? 'preview' : 'staging') : (env.ENVIRONMENT || 'staging');
            const executionContext = {
                owner_token: owner_token || request.headers.get('X-Owner-Approval-Token') || null,
                owner_approved: Boolean(owner_token || request.headers.get('X-Owner-Approval-Token')),
                tenant_id,
                environment: resolvedEnv
            };

            const stepResult = await runtime.executeMissionStep(
                missionId,
                targetAgentKey,
                tool_name,
                tool_args,
                executionContext
            );

            const httpStatus = stepResult.status === 'APPROVAL_REQUIRED' ? 403 :
                               stepResult.status === 'BLOCKED' || stepResult.status === 'DENIED' ? 403 :
                               stepResult.status === 'NOT_CONFIGURED' ? 501 : 200;

            return new Response(JSON.stringify({
                status: stepResult.status,
                mission_id: missionId,
                agent: {
                    id: targetAgent.identity.id,
                    name: targetAgent.identity.name,
                    department: targetAgent.identity.department,
                    role: targetAgent.identity.role
                },
                tool_name,
                execution_id: stepResult.execution_id || null,
                evidence: stepResult.evidence || null,
                risk_evaluation: stepResult.risk_evaluation,
                production_verified: stepResult.production_verified === true,
                result: stepResult.result,
                timestamp: new Date().toISOString()
            }), { status: httpStatus, headers: corsHeaders });
        }

        // Case B: Routing / Planning prompt (no tool executed yet)
        const riskEvaluation = runtime.computeDynamicRisk({
            agent_id: targetAgentKey,
            action: 'plan_mission',
            amount_usd: Number(task_context.amount_usd || 0),
            data_classification: task_context.data_classification || 'PUBLIC'
        });

        const requiresHitl = targetAgent.permissions?.requires_hitl === true ||
                              targetAgent.permissions?.autonomy_level === 'L3_APPROVAL' ||
                              riskEvaluation.requires_human_approval;

        return new Response(JSON.stringify({
            status: requiresHitl ? 'APPROVAL_REQUIRED' : 'ACCEPTED',
            mission_id: missionId,
            agent: {
                id: targetAgent.identity.id,
                name: targetAgent.identity.name,
                department: targetAgent.identity.department,
                role: targetAgent.identity.role
            },
            permissions: targetAgent.permissions,
            delegation_depth,
            decision: requiresHitl ? 'AWAITING_HUMAN_APPROVAL_GATE' : 'DISPATCH_READY',
            requires_hitl: requiresHitl,
            risk_evaluation: riskEvaluation,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'FAILED',
            error: err.message
        }), { status: 500, headers: corsHeaders });
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
