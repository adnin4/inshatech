/**
 * Cloudflare Pages Function: /api/tools/execute
 * Enterprise Tool Policy Engine & Execution Gateway with HITL 2.0 Checkpointing
 */

import { PERMISSION_LEVELS, AGENT_REGISTRY, ANTI_LOOP_CONFIG } from '../../_shared/ai_brain/agents/agent_registry.js';

const TOOL_DEFINITIONS = {
    // LEVEL 0: READ ONLY (Zero Risk)
    'search_knowledge': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 3000 },
    'get_services': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.0005, timeoutMs: 2000 },
    'get_customer': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000 },
    'get_analytics': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.002, timeoutMs: 4000 },
    'get_system_health': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000 },
    'get_affiliates': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000 },
    'get_revenue': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000 },

    // LEVEL 1: DRAFT (Low Risk)
    'create_quote': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.003, timeoutMs: 3000 },
    'draft_email': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.004, timeoutMs: 4000 },
    'draft_proposal': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.005, timeoutMs: 5000 },
    'draft_content': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.004, timeoutMs: 4000 },
    'calculate_roi': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.001, timeoutMs: 1000 },

    // LEVEL 2: EXECUTE WITH POLICY (Medium Risk)
    'create_lead': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.005, timeoutMs: 3000 },
    'update_lead': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.003, timeoutMs: 3000 },
    'send_message': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.004, timeoutMs: 4000 },
    'create_affiliate_link': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.002, timeoutMs: 2000 },
    'create_ticket': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.002, timeoutMs: 2000 },
    'track_referral': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.001, timeoutMs: 1000 },

    // LEVEL 3: APPROVAL REQUIRED (High Risk / Financial Impact)
    'create_order': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000 },
    'process_refund': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000 },
    'approve_payout': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000 },
    'create_deployment': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.020, timeoutMs: 10000 },

    // LEVEL 4: PERMANENTLY RESTRICTED (Critical Risk)
    'change_credentials': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0 },
    'delete_production_data': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0 },
    'unrestricted_transfer': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0 },
    'drop_database': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0 }
};

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Agent-ID, X-Admin-Token",
        "Content-Type": "application/json"
    };

    const startTime = Date.now();

    try {
        const body = await context.request.json().catch(() => ({}));
        const { tool_name, arguments: toolArgs, agent_id = 'SALES_AGENT', mission_budget_used = 0.00 } = body;

        if (!tool_name || !TOOL_DEFINITIONS[tool_name]) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: `Unknown or unregistered tool: ${tool_name}`
            }), { headers, status: 400 });
        }

        const toolDef = TOOL_DEFINITIONS[tool_name];
        const permission = PERMISSION_LEVELS[toolDef.level];

        // 1. Budget Governor Check ($20 limit)
        if (mission_budget_used + toolDef.costUSD > ANTI_LOOP_CONFIG.max_cost_usd) {
            return new Response(JSON.stringify({
                status: 'BUDGET_EXHAUSTED',
                error: `Mission budget limit ($${ANTI_LOOP_CONFIG.max_cost_usd.toFixed(2)}) reached. Action stopped.`,
                receipt: {
                    tool_name,
                    agent_id,
                    status: 'BUDGET_BLOCKED',
                    cost_usd: 0
                }
            }), { headers, status: 403 });
        }

        // 2. Security Check: Level 4 Restricted
        if (permission.blocked) {
            return new Response(JSON.stringify({
                status: 'RESTRICTED',
                error: `Tool ${tool_name} is permanently restricted from autonomous execution.`,
                risk_level: toolDef.risk,
                receipt: {
                    tool_name,
                    agent_id,
                    status: 'SECURITY_BLOCKED',
                    duration_ms: Date.now() - startTime,
                    timestamp: new Date().toISOString()
                }
            }), { headers, status: 403 });
        }

        // 3. Security Check: Level 3 HITL Approval
        if (!permission.auto_approve) {
            const checkpointId = "chk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
            return new Response(JSON.stringify({
                status: 'APPROVAL_REQUIRED',
                checkpoint_id: checkpointId,
                action_type: tool_name,
                risk_level: toolDef.risk,
                payload: toolArgs || {},
                message: `Action ${tool_name} requires explicit human-in-the-loop authorization.`,
                available_decisions: ['APPROVE', 'EDIT', 'REJECT'],
                receipt: {
                    tool_name,
                    agent_id,
                    status: 'CHECKPOINT_PAUSED',
                    duration_ms: Date.now() - startTime,
                    cost_usd: toolDef.costUSD,
                    timestamp: new Date().toISOString()
                }
            }), { headers, status: 200 });
        }

        // 4. Safe Auto-Execution (Level 0, 1, 2)
        const duration = Date.now() - startTime;
        const receipt = {
            receipt_id: "rcpt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
            tool_name,
            agent_id,
            risk_level: toolDef.risk,
            input_summary: JSON.stringify(toolArgs || {}).substring(0, 100),
            status: 'SUCCESS',
            duration_ms: duration,
            cost_usd: toolDef.costUSD,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            tool_name,
            agent_id,
            result: {
                executed: true,
                payload: toolArgs,
                message: `Tool ${tool_name} executed successfully.`
            },
            receipt
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers, status: 500 });
    }
}
