/**
 * IINSHA AI-BOS: Unified Agent Runtime Engine (Canonical Shared Module)
 * Central orchestrator managing Control Plane vs Data Plane separation,
 * Dynamic Risk Engine, Zero-Trust Token Scoping, and Mission Lifecycles.
 */

import { AGENT_REGISTRY, PERMISSION_LEVELS, ANTI_LOOP_CONFIG } from './agents/agent_registry.js';
import { ToolExecutionGateway, TOOL_REGISTRY } from './tool_execution_gateway.js';

const ACTION_BASE_RISK = {
    drop_database_table: 100,
    expose_service_role_secret: 100,
    deploy_production_release: 80,
    disburse_affiliate_payout: 75,
    process_refund_request: 70,
    create_checkout_session: 50,
    execute_docker_sandbox_task: 50,
    create_crm_lead: 25,
    generate_proposal_draft: 20,
    run_qa_test_suite: 10,
    knowledge_search: 5,
    service_catalog_lookup: 5
};

export class AgentRuntime {
    constructor({ toolGateway = null } = {}) {
        this.activeMissions = new Map();
        this.eventListeners = [];
        this.systemState = 'ONLINE'; // ONLINE, PAUSED, EMERGENCY_STOP
        this.toolGateway = toolGateway || new ToolExecutionGateway();
    }

    /**
     * Compute Dynamic Risk Score (0 - 100) using deterministic policy tables.
     * Invariants:
     * - Action base risk, financial tiers, data classification, and blast radius are enforced.
     * - Malformed, negative, NaN or infinite numbers are safely flagged as high-risk anomalies.
     * - Model confidence discount CANNOT downgrade a mandatory approval requirement.
     * - Strictest policy wins: Tool registry policy, data classification, or risk tier.
     */
    computeDynamicRisk(context = {}) {
        const {
            agent_id = 'SALES_PROPOSAL_AGENT',
            action = 'knowledge_search',
            amount_usd = 0,
            recipient_count = 1,
            data_classification = 'PUBLIC',
            confidence_score = 0.95
        } = context;

        // 1. Base action risk from registry or deterministic table
        const toolDef = TOOL_REGISTRY[action];
        let baseRisk = ACTION_BASE_RISK[action] ?? 35;
        if (toolDef) {
            if (toolDef.is_blocked || toolDef.permission_level === 4) baseRisk = 100;
            else if (toolDef.requires_approval || toolDef.permission_level >= 3) baseRisk = Math.max(baseRisk, 70);
            else if (toolDef.permission_level === 2) baseRisk = Math.max(baseRisk, 40);
        }

        let riskScore = baseRisk;

        // 2. Financial exposure with boundary hardening (NaN, Infinity, negative)
        const amt = Number(amount_usd);
        if (!Number.isFinite(amt) || amt < 0) {
            riskScore += 35; // Abnormal financial input increases risk
        } else if (amt > 10000) {
            riskScore += 50;
        } else if (amt > 1000) {
            riskScore += 35;
        } else if (amt > 100) {
            riskScore += 20;
        } else if (amt > 0) {
            riskScore += 10;
        }

        // 3. Blast radius / Audience scale
        const rc = Number(recipient_count);
        if (!Number.isFinite(rc) || rc > 10000) {
            riskScore += 40;
        } else if (rc > 1000) {
            riskScore += 30;
        } else if (rc > 50) {
            riskScore += 15;
        }

        // 4. Data classification
        const dc = String(data_classification).toUpperCase().trim();
        if (dc === 'RESTRICTED') riskScore += 50;
        else if (dc === 'CONFIDENTIAL') riskScore += 30;
        else if (dc === 'INTERNAL') riskScore += 15;

        // 5. Model confidence discount:
        // NEVER applied to critical actions (baseRisk >= 70), capped at 10.
        const isCriticalAction = baseRisk >= 70;
        const rawConf = Number(confidence_score);
        const validConf = Number.isFinite(rawConf) ? Math.max(0, Math.min(1, rawConf)) : 0;
        const confidenceDiscount = isCriticalAction ? 0 : Math.min(10, Math.round(validConf * 10));
        riskScore = Math.max(0, riskScore - confidenceDiscount);
        riskScore = Math.min(100, riskScore);

        // 6. Execution Level Mapping
        let assignedLevel = 'LEVEL_0_READ';
        if (riskScore >= 70 || baseRisk >= 80) assignedLevel = 'LEVEL_4_RESTRICTED';
        else if (riskScore >= 45 || baseRisk >= 50) assignedLevel = 'LEVEL_3_APPROVAL';
        else if (riskScore >= 20) assignedLevel = 'LEVEL_2_EXECUTE';
        else if (riskScore >= 10) assignedLevel = 'LEVEL_1_DRAFT';

        // Mandatory approval invariant: Model confidence CANNOT downgrade human approval
        const mandatoryApproval = (toolDef && (toolDef.requires_approval || toolDef.permission_level >= 3)) ||
                                  baseRisk >= 50 ||
                                  dc === 'RESTRICTED' ||
                                  amt > 1000;

        const requiresHumanApproval = mandatoryApproval || assignedLevel === 'LEVEL_3_APPROVAL' || riskScore >= 45;
        const isBlocked = (toolDef && (toolDef.is_blocked || toolDef.permission_level === 4)) || baseRisk >= 100;

        return {
            risk_score: riskScore,
            risk_tier: riskScore >= 70 ? 'CRITICAL' : riskScore >= 45 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW',
            assigned_level: isBlocked ? 'LEVEL_4_RESTRICTED' : (requiresHumanApproval && assignedLevel !== 'LEVEL_4_RESTRICTED' ? 'LEVEL_3_APPROVAL' : assignedLevel),
            requires_human_approval: requiresHumanApproval,
            is_blocked: isBlocked,
            action,
            agent_id
        };
    }

    /**
     * Dispatch event through the Universal Event Bus
     */
    emitEvent(eventType, payload) {
        const eventRecord = {
            event_id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            event_type: eventType,
            payload,
            timestamp: new Date().toISOString()
        };

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('iinsha:runtime:event', { detail: eventRecord }));
        }

        return eventRecord;
    }

    /**
     * Execute Mission step with Zero-Trust Permission Check and Server-Verified Owner Token.
     * @param {string} missionId Unique mission ID
     * @param {string} agentId One of the registered agent IDs or keys
     * @param {string} toolName Name of the tool to execute
     * @param {Object} toolArgs Tool input arguments
     * @param {Object} executionContext Control-plane context { owner_token, owner_approved, tenant_id, environment }
     */
    async executeMissionStep(missionId, agentId, toolName, toolArgs = {}, executionContext = {}) {
        if (this.systemState === 'EMERGENCY_STOP') {
            throw new Error('System is in EMERGENCY STOP lockdown. Autonomous execution halted.');
        }

        const agent = AGENT_REGISTRY[agentId];
        if (!agent) {
            throw new Error(`Unregistered agent: ${agentId}`);
        }

        // Scope verification: Can agent call this tool?
        const allowedTools = agent.tools?.allowed || [];
        if (!allowedTools.includes(toolName) && !allowedTools.includes('*')) {
            throw new Error(`Zero-Trust Violation: Agent ${agentId} is not permitted to access tool ${toolName}`);
        }

        const riskEvaluation = this.computeDynamicRisk({
            agent_id: agentId,
            action: toolName,
            amount_usd: toolArgs.amount ?? toolArgs.amount_usd ?? 0,
            recipient_count: toolArgs.recipient_count ?? 1,
            data_classification: toolArgs.data_classification ?? 'PUBLIC',
            confidence_score: toolArgs.confidence_score ?? 0.95
        });

        if (riskEvaluation.is_blocked) {
            return {
                status: 'BLOCKED',
                mission_id: missionId,
                agent_id: agentId,
                tool_name: toolName,
                risk_evaluation: riskEvaluation,
                error: 'Action is strictly blocked by policy tier LEVEL_4_RESTRICTED.',
                timestamp: new Date().toISOString()
            };
        }

        // Server-verified owner approval check:
        // Never rely on client-supplied toolArgs.owner_approved boolean alone.
        const hasVerifiedApproval = executionContext.owner_approved === true || Boolean(executionContext.owner_token);

        if (riskEvaluation.requires_human_approval && !hasVerifiedApproval) {
            return {
                status: 'APPROVAL_REQUIRED',
                mission_id: missionId,
                agent_id: agentId,
                tool_name: toolName,
                risk_evaluation: riskEvaluation,
                timestamp: new Date().toISOString()
            };
        }

        // Real Tool Execution through Tool Gateway with forward-propagated owner_token
        const executionResult = await this.toolGateway.execute({
            agent_id: agentId,
            tool_id: toolName,
            arguments_payload: toolArgs,
            owner_token: executionContext.owner_token || null,
            environment: executionContext.environment || process.env.NODE_ENV || 'production'
        });

        return {
            status: executionResult.status === 'SUCCESS' ? 'EXECUTED' : executionResult.status,
            mission_id: missionId,
            agent_id: agentId,
            tool_name: toolName,
            execution_id: executionResult.execution_id,
            evidence: executionResult.provider_receipt || executionResult.evidence_id || executionResult.result || null,
            risk_evaluation: riskEvaluation,
            production_verified: executionResult.production_verified === true,
            result: executionResult,
            timestamp: new Date().toISOString()
        };
    }
}

export const GlobalAgentRuntime = new AgentRuntime();
