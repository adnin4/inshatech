/**
 * IINSHA AI-BOS: Unified Agent Runtime Engine
 * Central orchestrator managing Control Plane vs Data Plane separation,
 * Dynamic Risk Engine, Zero-Trust Token Scoping, and Mission Lifecycles.
 */

import { AGENT_REGISTRY, PERMISSION_LEVELS, ANTI_LOOP_CONFIG } from './agents/agent_registry.js';

export class AgentRuntime {
    constructor() {
        this.activeMissions = new Map();
        this.eventListeners = [];
        this.systemState = 'ONLINE'; // ONLINE, PAUSED, EMERGENCY_STOP
    }

    /**
     * Compute Dynamic Risk Score (0 - 100)
     * Formula: Agent Risk + Customer Risk + Financial Risk + Data Risk + Action Risk - Confidence
     */
    computeDynamicRisk(context) {
        const {
            agent_id = 'SALES_AGENT',
            action = 'send_message',
            amount_usd = 0,
            recipient_count = 1,
            data_classification = 'PUBLIC', // PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
            confidence_score = 0.95
        } = context;

        let riskScore = 10; // baseline

        // 1. Financial exposure
        if (amount_usd > 1000) riskScore += 40;
        else if (amount_usd > 100) riskScore += 20;
        else if (amount_usd > 0) riskScore += 10;

        // 2. Blast radius / Audience scale
        if (recipient_count > 1000) riskScore += 30;
        else if (recipient_count > 50) riskScore += 15;

        // 3. Data classification
        if (data_classification === 'RESTRICTED') riskScore += 50;
        else if (data_classification === 'CONFIDENTIAL') riskScore += 30;
        else if (data_classification === 'INTERNAL') riskScore += 10;

        // 4. Model confidence offset
        const confidenceDiscount = Math.round(confidence_score * 15);
        riskScore = Math.max(0, riskScore - confidenceDiscount);

        // 5. Categorize into Execution Level
        let requiredLevel = 'LEVEL_0_READ';
        if (riskScore >= 70) requiredLevel = 'LEVEL_4_RESTRICTED';
        else if (riskScore >= 45) requiredLevel = 'LEVEL_3_APPROVAL';
        else if (riskScore >= 20) requiredLevel = 'LEVEL_2_EXECUTE';
        else if (riskScore >= 10) requiredLevel = 'LEVEL_1_DRAFT';

        return {
            risk_score: Math.min(100, riskScore),
            risk_tier: riskScore >= 70 ? 'CRITICAL' : riskScore >= 45 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW',
            assigned_level: requiredLevel,
            requires_human_approval: riskScore >= 45
        };
    }

    /**
     * Dispatch event through the Universal Event Bus
     */
    emitEvent(eventType, payload) {
        const eventRecord = {
            event_id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
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
     * Execute Mission step with Zero-Trust Permission Check
     */
    async executeMissionStep(missionId, agentId, toolName, toolArgs) {
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
            amount_usd: toolArgs.amount || 0
        });

        return {
            status: riskEvaluation.requires_human_approval ? 'APPROVAL_REQUIRED' : 'EXECUTED',
            mission_id: missionId,
            agent_id: agentId,
            tool_name: toolName,
            risk_evaluation: riskEvaluation,
            timestamp: new Date().toISOString()
        };
    }
}

export const GlobalAgentRuntime = new AgentRuntime();

