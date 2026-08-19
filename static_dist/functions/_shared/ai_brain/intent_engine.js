/**
 * IINSHA AI-BOS — PHASE 4: INTENT CLASSIFIER & CAPABILITY ROUTER
 * Parses user input into a strict structured intent schema.
 * Identifies required capabilities, agents, typed tools, and risk tiers (Level 0 - Level 3).
 */

class IntentEngine {
    constructor() {}

    /**
     * Parses and classifies user intent
     * @param {string} userMessage
     * @param {object} context
     * @returns {object} Structured Intent Object
     */
    classifyIntent(userMessage, context = {}) {
        const text = (userMessage || '').toLowerCase();
        const state = context.conversation_state || {};
        const knownFacts = state.known_facts || [];

        // 1. Lead Generation / Outbound Hunter Intent
        if (text.includes('lead') || text.includes('prospect') || text.includes('scrape') || text.includes('enrich') || text.includes('hunter') || text.includes('sdr') || text.includes('find company') || text.includes('companies')) {
            return {
                intent: 'LEAD_GENERATION',
                sub_intent: text.includes('enrich') ? 'ENRICHMENT' : 'DISCOVERY',
                urgency: 'HIGH',
                required_capabilities: ['ICP_SEARCH', 'DATA_EXTRACTION', 'EMAIL_VERIFICATION'],
                required_agents: ['COMMANDER', 'HUNTER', 'ANALYST'],
                required_tools: ['company_search', 'lead_discovery', 'lead_enrichment'],
                risk_level: 'LEVEL_1', // Safe read/draft operation
                requires_clarification: false,
                confidence: 0.96
            };
        }

        // 2. Service & Pricing Inquiry (Dual Currency USD/BDT)
        if (text.includes('price') || text.includes('cost') || text.includes('taka') || text.includes('bdt') || text.includes('usd') || text.includes('package') || text.includes('service') || text.includes('khoroch') || text.includes('dam') || text.includes('proposal')) {
            return {
                intent: 'PRICING_AND_SERVICE_INQUIRY',
                sub_intent: 'PRICE_CALCULATION',
                urgency: 'MEDIUM',
                required_capabilities: ['CATALOG_LOOKUP', 'CURRENCY_CONVERSION', 'SOW_GENERATION'],
                required_agents: ['COMMANDER', 'SALES'],
                required_tools: ['crm_lookup', 'proposal_generator'],
                risk_level: 'LEVEL_0', // Read-only
                requires_clarification: false,
                confidence: 0.98
            };
        }

        // 3. n8n / VPS / Docker / Automation Workflow Architecture
        if (text.includes('n8n') || text.includes('workflow') || text.includes('vps') || text.includes('docker') || text.includes('webhook') || text.includes('automation') || text.includes('deploy') || text.includes('hostinger')) {
            return {
                intent: 'WORKFLOW_AUTOMATION',
                sub_intent: 'N8N_DOCKER_DEPLOY',
                urgency: 'MEDIUM',
                required_capabilities: ['WORKFLOW_COMPOSITION', 'SYSTEM_DIAGNOSTICS', 'CONTAINER_ORCHESTRATION'],
                required_agents: ['COMMANDER', 'BUILDER', 'GUARDIAN'],
                required_tools: ['n8n_trigger', 'workflow_status', 'health_check'],
                risk_level: text.includes('restart') || text.includes('delete') ? 'LEVEL_3' : 'LEVEL_1',
                requires_clarification: false,
                confidence: 0.94
            };
        }

        // 4. System Health / Telemetry / Diagnostics
        if (text.includes('status') || text.includes('health') || text.includes('uptime') || text.includes('memory') || text.includes('telemetry') || text.includes('audit')) {
            return {
                intent: 'SYSTEM_DIAGNOSTICS',
                sub_intent: 'HEALTH_AUDIT',
                urgency: 'LOW',
                required_capabilities: ['METRICS_EXTRACTION', 'RESOURCE_AUDITING'],
                required_agents: ['COMMANDER', 'GUARDIAN'],
                required_tools: ['health_check', 'analytics_query'],
                risk_level: 'LEVEL_0',
                requires_clarification: false,
                confidence: 0.99
            };
        }

        // 5. General Business Strategic Planning & Conversation
        return {
            intent: 'GENERAL_CONSULTATION',
            sub_intent: 'STRATEGY_PLANNING',
            urgency: 'LOW',
            required_capabilities: ['KNOWLEDGE_RETRIEVAL', 'EXECUTIVE_SYNTHESIS'],
            required_agents: ['COMMANDER', 'RESEARCHER'],
            required_tools: ['web_search', 'database_query'],
            risk_level: 'LEVEL_0',
            requires_clarification: false,
            confidence: 0.88
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IntentEngine };
} else {
    window.IntentEngine = IntentEngine;
}
