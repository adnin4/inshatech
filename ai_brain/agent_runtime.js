/**
 * IINSHA AI-BOS: Unified Agent Runtime Engine
 * Central orchestrator for policy, risk, authorization and tool execution.
 * Production rule: owner approval credentials stay out of tool arguments.
 */

import { AGENT_REGISTRY } from './agents/agent_registry.js';
import { ToolExecutionGateway } from './tool_execution_gateway.js';

export class AgentRuntime {
    constructor() {
        this.activeMissions = new Map();
        this.eventListeners = [];
        this.systemState = 'ONLINE';
        this.toolGateway = new ToolExecutionGateway();
    }

    computeDynamicRisk(context) {
        const {
            action = 'send_message',
            amount_usd = 0,
            recipient_count = 1,
            data_classification = 'PUBLIC',
            confidence_score = 0.95
        } = context;
        let riskScore = 10;
        if (amount_usd > 1000) riskScore += 40;
        else if (amount_usd > 100) riskScore += 20;
        else if (amount_usd > 0) riskScore += 10;
        if (recipient_count > 1000) riskScore += 30;
        else if (recipient_count > 50) riskScore += 15;
        if (data_classification === 'RESTRICTED') riskScore += 50;
        else if (data_classification === 'CONFIDENTIAL') riskScore += 30;
        else if (data_classification === 'INTERNAL') riskScore += 10;
        riskScore = Math.max(0, riskScore - Math.round(confidence_score * 15));
        let requiredLevel = 'LEVEL_0_READ';
        if (riskScore >= 70) requiredLevel = 'LEVEL_4_RESTRICTED';
        else if (riskScore >= 45) requiredLevel = 'LEVEL_3_APPROVAL';
        else if (riskScore >= 20) requiredLevel = 'LEVEL_2_EXECUTE';
        else if (riskScore >= 10) requiredLevel = 'LEVEL_1_DRAFT';
        return {
            risk_score: Math.min(100, riskScore),
            risk_tier: riskScore >= 70 ? 'CRITICAL' : riskScore >= 45 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW',
            assigned_level: requiredLevel,
            requires_human_approval: riskScore >= 45,
            action
        };
    }

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
     * executionContext is trusted control-plane input. Do not put owner tokens in toolArgs.
     */
    async executeMissionStep(missionId, agentId, toolName, toolArgs = {}, executionContext = {}) {
        if (this.systemState === 'EMERGENCY_STOP') throw new Error('System is in EMERGENCY STOP lockdown. Autonomous execution halted.');
        const agent = AGENT_REGISTRY[agentId];
        if (!agent) throw new Error(`Unregistered agent: ${agentId}`);

        const allowedTools = agent.tools?.allowed || [];
        if (!allowedTools.includes(toolName) && !allowedTools.includes('*')) {
            throw new Error(`Zero-Trust Violation: Agent ${agentId} is not permitted to access tool ${toolName}`);
        }

        const riskEvaluation = this.computeDynamicRisk({
            agent_id: agentId,
            action: toolName,
            amount_usd: Number(toolArgs.amount || 0),
            confidence_score: Number(toolArgs.confidence_score || 0.95)
        });

        if (riskEvaluation.requires_human_approval && !executionContext.owner_approved) {
            return {
                status: 'APPROVAL_REQUIRED',
                mission_id: missionId,
                agent_id: agentId,
                tool_name: toolName,
                risk_evaluation: riskEvaluation,
                timestamp: new Date().toISOString()
            };
        }

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
