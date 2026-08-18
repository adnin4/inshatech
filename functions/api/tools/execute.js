/**
 * Cloudflare Pages Function: /api/tools/execute
 * Enterprise Tool Policy Engine & Execution Gateway
 * Implements 6-Level Bounded Execution Spectrum (L0 to L5)
 */

import { PERMISSION_LEVELS, AGENT_REGISTRY, ANTI_LOOP_CONFIG } from '../../_shared/ai_brain/agents/agent_registry.js';

export const SIX_LEVEL_TOOL_REGISTRY = {
    // LEVEL 0: READ ONLY (L0 - Observe only)
    'search_knowledge': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 3000, desc: 'Search RAG documents' },
    'get_services': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.0005, timeoutMs: 2000, desc: 'Query service catalog' },
    'get_customer': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000, desc: 'Read customer profile' },
    'get_analytics': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.002, timeoutMs: 4000, desc: 'Query telemetry metrics' },
    'get_system_health': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000, desc: 'Check container health' },
    'get_affiliates': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000, desc: 'Read affiliate partner list' },
    'get_revenue': { level: 'LEVEL_0_READ', risk: 'LOW', costUSD: 0.001, timeoutMs: 2000, desc: 'Read financial ledger' },

    // LEVEL 1: THINK & DRAFT (L1 - Propose & Draft, Zero Side Effects)
    'create_quote': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.003, timeoutMs: 3000, desc: 'Synthesize custom pricing quote' },
    'draft_email': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.004, timeoutMs: 4000, desc: 'Draft outreach email copy' },
    'draft_proposal': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.005, timeoutMs: 5000, desc: 'Generate technical SOW HTML' },
    'draft_content': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.004, timeoutMs: 4000, desc: 'Draft case study or blog article' },
    'calculate_roi': { level: 'LEVEL_1_DRAFT', risk: 'LOW', costUSD: 0.001, timeoutMs: 1000, desc: 'Compute client ROI multiplier' },

    // LEVEL 2: LOW-RISK EXECUTE (L2 - Safe Internal Execution)
    'create_lead': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.005, timeoutMs: 3000, desc: 'Ingest qualified lead into CRM' },
    'update_lead': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.003, timeoutMs: 3000, desc: 'Update lead status in CRM' },
    'create_ticket': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.002, timeoutMs: 2000, desc: 'Open customer support ticket' },
    'create_affiliate_link': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.002, timeoutMs: 2000, desc: 'Generate referral tracking link' },
    'track_referral': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.001, timeoutMs: 1000, desc: 'Record affiliate attribution' },

    // LEVEL 3: EXTERNAL ACTION (L3 - Outbound Communication & Publishing)
    'send_message': { level: 'LEVEL_2_EXECUTE', risk: 'MEDIUM', costUSD: 0.004, timeoutMs: 4000, desc: 'Dispatch in-app message' },
    'send_whatsapp': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.008, timeoutMs: 5000, desc: 'Send external WhatsApp message' },
    'publish_content': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000, desc: 'Publish live article to blog' },

    // LEVEL 4: FINANCIAL / BUSINESS APPROVAL (L4 - Owner Approval Mandatory)
    'create_order': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000, desc: 'Create payable order ledger entry' },
    'process_refund': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000, desc: 'Trigger financial refund' },
    'approve_payout': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.010, timeoutMs: 5000, desc: 'Release affiliate commission payout' },
    'create_deployment': { level: 'LEVEL_3_APPROVAL', risk: 'HIGH', costUSD: 0.020, timeoutMs: 10000, desc: 'Deploy release to production edge' },

    // LEVEL 5: ROOT RESTRICTED (L5 - Permanently Prohibited)
    'change_credentials': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0, desc: 'Change master passwords' },
    'delete_production_data': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0, desc: 'Delete production rows' },
    'unrestricted_transfer': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0, desc: 'Direct fund transfer' },
    'drop_database': { level: 'LEVEL_4_RESTRICTED', risk: 'CRITICAL', costUSD: 0, timeoutMs: 0, desc: 'Drop SQL database' }
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

        if (!tool_name || !SIX_LEVEL_TOOL_REGISTRY[tool_name]) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: `Unknown or unregistered tool: ${tool_name}`
            }), { headers, status: 400 });
        }

        const toolDef = SIX_LEVEL_TOOL_REGISTRY[tool_name];
        const permission = PERMISSION_LEVELS[toolDef.level] || { auto_approve: true };

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

        // 2. Security Check: Level 5 Root Restricted (L5)
        if (permission.blocked || toolDef.level === 'LEVEL_4_RESTRICTED') {
            return new Response(JSON.stringify({
                status: 'RESTRICTED',
                error: `Tool ${tool_name} is permanently restricted from autonomous execution (Level 5 Root Restricted).`,
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

        // 3. Human Approval Gate: Level 4 Financial / Approval (L4)
        if (!permission.auto_approve) {
            return new Response(JSON.stringify({
                status: 'APPROVAL_REQUIRED',
                message: `Owner authorization required for ${tool_name} (Level 4 Financial/Critical Gate).`,
                approval_id: `appr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                tool_name,
                agent_id,
                arguments: toolArgs,
                risk_level: toolDef.risk,
                estimated_cost_usd: toolDef.costUSD,
                timestamp: new Date().toISOString()
            }), { headers, status: 202 });
        }

        // 4. Autonomous Safe Execution
        const simulatedResult = {
            executed_by: agent_id,
            tool: tool_name,
            args: toolArgs,
            output: `Executed ${tool_name} successfully via policy-verified gateway.`,
            status: 'COMPLETED'
        };

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            result: simulatedResult,
            receipt: {
                tool_name,
                agent_id,
                status: 'EXECUTED',
                cost_usd: toolDef.costUSD,
                duration_ms: Date.now() - startTime,
                timestamp: new Date().toISOString()
            }
        }), { headers });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Agent-ID, X-Admin-Token'
        },
        status: 204
    });
}
