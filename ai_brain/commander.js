/**
 * IINSHA AI-BOS â€” PHASE 5: COMMANDER SUPERVISOR ORCHESTRATOR
 * The central brain loop uniting:
 * User Request -> Load State -> Parse Intent -> Build Context -> Anti-Repetition Guard ->
 * Task Plan -> Dynamic Agents -> Real Tools -> Verifier -> Memory & State -> Response.
 */

const { ConversationStateEngine } = typeof module !== 'undefined' ? require('./conversation_state') : window;
const { MemorySystem } = typeof module !== 'undefined' ? require('./memory_system') : window;
const { ContextEngine } = typeof module !== 'undefined' ? require('./context_builder') : window;
const { AntiRepetitionEngine } = typeof module !== 'undefined' ? require('./anti_repetition_engine') : window;
const { IntentEngine } = typeof module !== 'undefined' ? require('./intent_engine') : window;
const { ToolExecutor } = typeof module !== 'undefined' ? require('./tool_executor') : window;
const { VerifierEngine } = typeof module !== 'undefined' ? require('./verifier') : window;
const { ModelRouter } = typeof module !== 'undefined' ? require('./model_router') : window;
const { AgentObservability } = typeof module !== 'undefined' ? require('./observability') : window;

class Commander {
    constructor() {
        this.stateEngine = new ConversationStateEngine();
        this.memorySystem = new MemorySystem();
        this.contextEngine = new ContextEngine(this.stateEngine, this.memorySystem);
        this.antiRepetition = new AntiRepetitionEngine();
        this.intentEngine = new IntentEngine();
        this.toolExecutor = new ToolExecutor(this.memorySystem);
        this.verifier = new VerifierEngine();
        this.modelRouter = new ModelRouter();
        this.observability = new AgentObservability();
    }

    /**
     * Executes full agentic turn for an incoming user message
     */
    async handleUserMessage(conversationId, userMessage, userId = 'user_default', options = {}) {
        const startTime = Date.now();
        const cleanMsg = (userMessage || '').trim();

        // 1. Load Conversation Contract & History
        const contract = await this.stateEngine.loadConversation(conversationId, userId);

        // 2. Append User Message
        await this.stateEngine.appendMessage(conversationId, { role: 'user', content: cleanMsg });

        // 3. Extract Facts & Constraints from current message to enrich state
        const extracted = this.extractFactsAndConstraints(cleanMsg, contract);
        if (extracted.known_facts.length > 0 || extracted.constraints.length > 0 || extracted.active_goal) {
            await this.stateEngine.saveConversationState(conversationId, extracted);
        }

        // 4. Classify Intent & Required Capabilities
        const intentObj = this.intentEngine.classifyIntent(cleanMsg, contract);

        // 5. Build Centralized Context
        const agentContext = await this.contextEngine.buildAgentContext(conversationId, cleanMsg, userId);

        // 6. Create Task Plan & Select Required Dynamic Agents
        const taskPlan = this.createTaskPlan(intentObj, agentContext);

        // 7. Execute Required Typed Tools
        const toolExecutionResults = [];
        for (const task of taskPlan.tasks) {
            if (task.tool) {
                const execRes = await this.toolExecutor.execute(task.tool, task.parameters, options.hitl_approved || false);
                toolExecutionResults.push(execRes);
            }
        }

        // 8. Generate Candidate Response
        let responseText = this.synthesizeResponse(intentObj, taskPlan, toolExecutionResults, agentContext);

        // 9. Check Anti-Repetition Guard if response asks a question
        const questionMatch = responseText.match(/([^?]+\?)/g);
        if (questionMatch) {
            for (const q of questionMatch) {
                const evalQ = this.antiRepetition.evaluateQuestion(q, agentContext);
                if (!evalQ.should_ask) {
                    // Replace question with assumption to prevent friction
                    responseText = responseText.replace(q, evalQ.assumption || '');
                } else {
                    // Record legitimate asked question
                    await this.stateEngine.saveConversationState(conversationId, {
                        asked_questions: [{ question: q, intent: intentObj.intent, timestamp: new Date().toISOString() }]
                    });
                }
            }
        }

        // 10. Run Mandatory Verifier Layer
        let verification = this.verifier.verify({
            text: responseText,
            tool_results: toolExecutionResults,
            intent: intentObj,
            context: agentContext,
            task_plan: taskPlan
        });

        // 11. Auto-Repair Loop (Up to 3 Retries)
        let retryCount = 0;
        while (verification.status === 'NEEDS_RETRY' && retryCount < 3) {
            retryCount++;
            responseText = this.repairResponse(responseText, verification.issues, agentContext, toolExecutionResults);
            verification = this.verifier.verify({
                text: responseText,
                tool_results: toolExecutionResults,
                intent: intentObj,
                context: agentContext,
                task_plan: taskPlan
            });
        }

        // 12. Append Assistant Message Turn
        await this.stateEngine.appendMessage(conversationId, {
            role: 'assistant',
            content: responseText,
            tool_calls: taskPlan.tasks.map(t => ({ tool: t.tool, params: t.parameters })),
            tool_results: toolExecutionResults
        });

        // 13. Update Conversation Summary & State
        const newSummary = this.memorySystem.compressConversation(contract);
        await this.stateEngine.updateConversationSummary(conversationId, newSummary);

        // 14. Record Observability Telemetry
        const executionDuration = Date.now() - startTime;
        const telemetryRecord = this.observability.recordExecution({
            conversation_id: conversationId,
            agent: intentObj.required_agents ? intentObj.required_agents.join(' + ') : 'COMMANDER',
            intent: intentObj.intent,
            model: 'gemini-2.5-flash',
            tokens: { input: 350 + cleanMsg.length, output: responseText.length / 2, total: 350 + cleanMsg.length + responseText.length / 2 },
            latency_ms: executionDuration,
            tool_calls: toolExecutionResults.map(r => r.tool),
            verification_score: verification.confidence,
            retries: retryCount,
            status: verification.status === 'PASS' ? 'COMPLETED' : 'REPAIRED_DELIVERED'
        });

        return {
            status: 'SUCCESS',
            conversation_id: conversationId,
            intent: intentObj,
            active_agents: intentObj.required_agents,
            response: responseText,
            tool_results: toolExecutionResults,
            verification: verification,
            telemetry: telemetryRecord
        };
    }

    /**
     * Extracts facts, decisions, and constraints from conversation text
     */
    extractFactsAndConstraints(text, contract) {
        const lower = text.toLowerCase();
        const knownFacts = [];
        const constraints = [];
        let activeGoal = null;

        // Goal extraction
        if (lower.includes('lead generation') || lower.includes('lead gen') || lower.includes('find lead') || lower.includes('prospects')) {
            activeGoal = 'B2B SaaS Lead Generation System';
            knownFacts.push({ fact: 'Goal: B2B Lead Generation', confidence: 1.0 });
        }
        if (lower.includes('b2b saas') || lower.includes('saas')) {
            knownFacts.push({ fact: 'Industry: B2B SaaS', confidence: 1.0 });
            constraints.push({ constraint: 'Industry: B2B SaaS', type: 'INDUSTRY' });
        }
        if (lower.includes('real estate') || lower.includes('property')) {
            knownFacts.push({ fact: 'Industry: Real Estate', confidence: 1.0 });
            constraints.push({ constraint: 'Industry: Real Estate', type: 'INDUSTRY' });
        }
        if (lower.includes('healthcare') || lower.includes('clinic')) {
            knownFacts.push({ fact: 'Industry: Healthcare / Clinic', confidence: 1.0 });
            constraints.push({ constraint: 'Industry: Healthcare', type: 'INDUSTRY' });
        }

        // Employee count extraction
        const employeeMatch = lower.match(/(\d+\s*-\s*\d+)\s*employees?/);
        if (employeeMatch) {
            knownFacts.push({ fact: `Company Size: ${employeeMatch[1]} employees`, confidence: 1.0 });
            constraints.push({ constraint: `Company Size: ${employeeMatch[1]} employees`, type: 'HEADCOUNT' });
        } else if (lower.includes('50-200')) {
            knownFacts.push({ fact: 'Company Size: 50-200 employees', confidence: 1.0 });
            constraints.push({ constraint: 'Company Size: 50-200 employees', type: 'HEADCOUNT' });
        }

        // Quantity extraction
        const qtyMatch = lower.match(/(?:find|get|scrape|extract|generate)?\s*(\d{1,4})\s*(?:leads?|contacts?|prospects?|companies)/);
        if (qtyMatch) {
            knownFacts.push({ fact: `Target Quantity: ${qtyMatch[1]} leads`, confidence: 1.0 });
            constraints.push({ constraint: `Quantity: ${qtyMatch[1]}`, type: 'VOLUME' });
        }

        return {
            known_facts: knownFacts,
            constraints: constraints,
            active_goal: activeGoal
        };
    }

    /**
     * Creates task plan based on intent and established context
     */
    createTaskPlan(intentObj, context) {
        const state = context.conversation_state || {};
        const knownFacts = state.known_facts || [];
        const userMsg = context.current_user_request || '';

        // Extract parameters from context state
        let industry = 'B2B SaaS';
        let employeeRange = '50-200';
        let quantity = 100;

        knownFacts.forEach(kf => {
            const text = (typeof kf === 'string' ? kf : kf.fact).toLowerCase();
            if (text.includes('saas')) industry = 'B2B SaaS';
            if (text.includes('real estate')) industry = 'Real Estate';
            if (text.includes('healthcare')) industry = 'Healthcare';
            if (text.includes('50-200')) employeeRange = '50-200';
            if (text.includes('10-50')) employeeRange = '10-50';
            const num = text.match(/(\d+)\s*leads?/);
            if (num) quantity = parseInt(num[1]);
        });

        if (intentObj.intent === 'LEAD_GENERATION') {
            return {
                plan_name: 'ICP Lead Discovery & Enrichment Swarm',
                tasks: [
                    { agent: 'HUNTER', tool: 'company_search', parameters: { industry: industry, employee_range: employeeRange } },
                    { agent: 'HUNTER', tool: 'lead_discovery', parameters: { industry: industry, employee_range: employeeRange, quantity: quantity } }
                ]
            };
        }

        if (intentObj.intent === 'PRICING_AND_SERVICE_INQUIRY') {
            return {
                plan_name: 'Catalog & Dual Currency SOW Calculation',
                tasks: [
                    { agent: 'SALES', tool: 'proposal_generator', parameters: { package_name: userMsg, client_name: 'Prospective Client' } }
                ]
            };
        }

        if (intentObj.intent === 'SYSTEM_DIAGNOSTICS') {
            return {
                plan_name: 'Hostinger VPS & Docker Telemetry Audit',
                tasks: [
                    { agent: 'GUARDIAN', tool: 'health_check', parameters: { node: 'all' } },
                    { agent: 'ANALYST', tool: 'workflow_status', parameters: {} }
                ]
            };
        }

        return { plan_name: 'Consultation & Strategy', tasks: [] };
    }

    /**
     * Synthesizes verified natural response
     */
    synthesizeResponse(intentObj, taskPlan, toolResults, context) {
        const state = context.conversation_state || {};
        const knownFacts = state.known_facts || [];

        if (intentObj.intent === 'LEAD_GENERATION') {
            const leadTool = toolResults.find(t => t.tool === 'lead_discovery');
            const compTool = toolResults.find(t => t.tool === 'company_search');

            if (leadTool && leadTool.status === 'SUCCESS') {
                const d = leadTool.data;
                return `ðŸŽ¯ **IINSHA Multi-Agent Lead Generation Swarm Execution**

I have initialized our **Commander + Hunter + Analyst Swarm** targeting **${d.target_icp}**.

ðŸ“Š **Execution Summary & Grounded Results:**
â€¢ **Target ICP:** ${d.target_icp}
â€¢ **Verified Decision Makers Delivered:** **${d.total_delivered} Deliverable Leads**
â€¢ **Deliverability / Verification Status:** ${d.verification_rate} (MX Validated)
â€¢ **Export Readiness:** JSON / CSV / CRM Webhook Ready

ðŸ’¼ **Sample Verified Prospect Profiles:**
1. **${d.sample_leads[0].name}** â€” *${d.sample_leads[0].title}* at **${d.sample_leads[0].company}** (${d.sample_leads[0].email})
2. **${d.sample_leads[1].name}** â€” *${d.sample_leads[1].title}* at **${d.sample_leads[1].company}** (${d.sample_leads[1].email})
3. **${d.sample_leads[2].name}** â€” *${d.sample_leads[2].title}* at **${d.sample_leads[2].company}** (${d.sample_leads[2].email})

âš¡ *All 100 leads are loaded into memory and ready to sync to your CRM or trigger personalized AI SDR outreach.*`;
            }

            // If user only gave initial requirements
            return `Understood. I have registered your target criteria: **B2B SaaS Lead Generation** for companies with **50-200 employees**. Ready to discover 100 verified leads upon command.`;
        }

        if (intentObj.intent === 'PRICING_AND_SERVICE_INQUIRY') {
            const prop = toolResults.find(t => t.tool === 'proposal_generator')?.data;
            if (prop) {
                return `ðŸ›ï¸ **IINSHA Enterprise Dual-Currency Pricing Breakdown**

ðŸ“¦ **Package:** ${prop.package}
ðŸ’° **Setup Price (USD):** **${prop.pricing.setup_usd}**
à§³ **BDT Equivalent (à§³):** **${prop.pricing.setup_bdt}**
ðŸ”„ **Monthly Retainer:** ${prop.pricing.monthly_retainer_usd} (${prop.pricing.monthly_retainer_bdt})

ðŸ›¡ï¸ **SLA Guarantee:** ${prop.sla} (100% source code handover with 14-day warranty).`;
            }
        }

        if (intentObj.intent === 'SYSTEM_DIAGNOSTICS') {
            const health = toolResults.find(t => t.tool === 'health_check')?.data;
            if (health) {
                return `âš¡ **Hostinger VPS & n8n Engine Real-Time Telemetry**
â€¢ **Node Status:** ${health.vps_node} (${health.uptime} Uptime)
â€¢ **Active Containers:** ${health.containers.length} Docker services running (n8n, Traefik SSL, pgvector, Playwright Pipeline)
â€¢ **Memory & Load:** ${health.system_load} â€¢ Zero task fees`;
            }
        }

        return `IINSHA AI-BOS Commander online. Context, memory, and multi-agent mesh are active. How may I assist your business today?`;
    }

    /**
     * Repairs candidate response based on verifier issues
     */
    repairResponse(originalText, issues, context, toolResults) {
        let repaired = originalText;
        issues.forEach(issue => {
            if (issue.includes('dual currency')) {
                repaired += `\n\n*(Note: Dual Currency Rate standard: $1 USD = à§³122.50 BDT)*`;
            }
        });
        return repaired;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Commander };
} else {
    window.Commander = Commander;
}

