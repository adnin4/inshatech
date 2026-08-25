/**
 * IINSHA AI-BOS: Unified Agent Runtime Engine
 * Control-plane authorization is deliberately separate from real execution.
 */
import { AGENT_REGISTRY } from './agents/agent_registry.js';
import { assertProductionSuccess, normalizeBlocked } from './production_truth_policy.js';

export class AgentRuntime {
  constructor() {
    this.activeMissions = new Map();
    this.eventListeners = [];
    this.systemState = 'ONLINE';
  }

  computeDynamicRisk(context = {}) {
    const { amount_usd = 0, recipient_count = 1, data_classification = 'PUBLIC', confidence_score = 0.95 } = context;
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
    const assigned_level = riskScore >= 70 ? 'LEVEL_4_RESTRICTED' : riskScore >= 45 ? 'LEVEL_3_APPROVAL' : riskScore >= 20 ? 'LEVEL_2_EXECUTE' : riskScore >= 10 ? 'LEVEL_1_DRAFT' : 'LEVEL_0_READ';
    return { risk_score: Math.min(100, riskScore), risk_tier: riskScore >= 70 ? 'CRITICAL' : riskScore >= 45 ? 'HIGH' : riskScore >= 20 ? 'MEDIUM' : 'LOW', assigned_level, requires_human_approval: riskScore >= 45 };
  }

  emitEvent(eventType, payload) {
    const eventRecord = { event_id: `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, event_type: eventType, payload, timestamp: new Date().toISOString() };
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('iinsha:runtime:event', { detail: eventRecord }));
    return eventRecord;
  }

  async executeMissionStep(missionId, agentId, toolName, toolArgs = {}, executor = null) {
    if (this.systemState === 'EMERGENCY_STOP') throw new Error('System is in EMERGENCY STOP lockdown. Autonomous execution halted.');
    const agent = AGENT_REGISTRY[agentId];
    if (!agent) throw new Error(`Unregistered agent: ${agentId}`);
    const allowedTools = agent.tools?.allowed || [];
    if (!allowedTools.includes(toolName) && !allowedTools.includes('*')) throw new Error(`Zero-Trust Violation: Agent ${agentId} is not permitted to access tool ${toolName}`);

    const risk_evaluation = this.computeDynamicRisk({ action: toolName, amount_usd: toolArgs.amount || 0, recipient_count: toolArgs.recipient_count || 1, data_classification: toolArgs.data_classification || 'PUBLIC', confidence_score: toolArgs.confidence_score ?? 0.95 });
    const base = { mission_id: missionId, agent_id: agentId, tool_name: toolName, risk_evaluation, timestamp: new Date().toISOString() };

    if (risk_evaluation.requires_human_approval) return { ...base, status: 'APPROVAL_REQUIRED', production_claim: false, verified: false };
    if (typeof executor !== 'function') return { ...normalizeBlocked('TOOL_EXECUTOR_NOT_BOUND'), ...base };

    this.emitEvent('mission.execution_started', base);
    const result = await executor({ mission_id: missionId, agent_id: agentId, tool_name: toolName, args: toolArgs, risk_evaluation });
    assertProductionSuccess(result);
    const finalResult = { ...base, ...result, timestamp: new Date().toISOString() };
    this.emitEvent('mission.execution_finished', finalResult);
    return finalResult;
  }
}

export const GlobalAgentRuntime = new AgentRuntime();
