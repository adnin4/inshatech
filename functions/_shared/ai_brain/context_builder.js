/**
 * IINSHA AI-BOS â€” PHASE 2: CONTEXT ENGINE
 * Centralized context assembler assembling structured prompt context from:
 * 1. System instructions & SOPs
 * 2. User profile
 * 3. Business profile (pricing, services)
 * 4. Compact conversation summary
 * 5. Recent relevant messages (last 8-16 turns)
 * 6. Conversation state (known_facts, decisions, constraints)
 * 7. Relevant long-term memories & RAG documents
 * 8. Active mission & pending approvals
 * 9. Current user message
 */

class ContextEngine {
    constructor(stateEngine, memorySystem) {
        this.stateEngine = stateEngine;
        this.memorySystem = memorySystem;
    }

    /**
     * Builds complete structured context for the AI Commander & Worker Agents
     */
    async buildAgentContext(conversationId, userMessage, userId = 'user_default', activeMission = null) {
        const contract = await this.stateEngine.loadConversation(conversationId, userId);
        const userProfile = this.memorySystem.getUserProfile(userId);
        const businessMemory = this.memorySystem.getBusinessMemory();
        const recentMessages = this.stateEngine.loadRecentMessages(contract, 12);
        const conversationSummary = this.stateEngine.loadConversationSummary(contract);
        const conversationState = this.stateEngine.loadConversationState(contract);
        const relevantMemories = this.memorySystem.retrieveRelevantMemories(userMessage, userId, 3);

        const systemInstructions = `
You are the IINSHA AI-BOS Master Commander & Autonomous Agent Intelligence Engine.
You operate on strict Production-Grade Agentic Principles:
1. Multi-turn State Preservation: You MUST NEVER forget facts, decisions, or constraints established earlier in the conversation.
2. Anti-Repetition Rule: NEVER ask a question if the answer is already recorded in known_facts, conversation_summary, or previous turns.
3. Real Execution & Honesty: NEVER fabricate search results, mock numbers, fake savings, or fake leads. If a tool executes, return the exact tool output.
4. Dual Currency: Always present prices with USD ($) and BDT (à§³) equivalent @ 122.50.
5. Verification: Every response must be grounded, factual, complete, and schema-compliant.
`.trim();

        return {
            system_instructions: systemInstructions,
            user_profile: userProfile,
            business_context: businessMemory,
            conversation_summary: conversationSummary,
            recent_turns: recentMessages,
            conversation_state: {
                known_facts: conversationState.known_facts || [],
                decisions: conversationState.decisions || [],
                constraints: conversationState.constraints || [],
                asked_questions: conversationState.asked_questions || [],
                answered_questions: conversationState.answered_questions || [],
                pending_tasks: conversationState.pending_tasks || [],
                active_goal: contract.active_goal || '',
                last_intent: contract.last_intent || ''
            },
            relevant_memories: relevantMemories,
            active_mission: activeMission || null,
            current_user_request: userMessage
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContextEngine };
} else {
    window.ContextEngine = ContextEngine;
}

