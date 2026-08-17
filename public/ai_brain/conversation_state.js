/**
 * IINSHA AI-BOS — PHASE 1: CONVERSATION STATE ENGINE
 * Stateful conversation architecture managing session contracts, state transitions,
 * known facts, decisions, constraints, and question/answer deduplication.
 */

class ConversationStateEngine {
    constructor(storageAdapter = null) {
        this.storage = storageAdapter || new MemoryStorageAdapter();
    }

    /**
     * Creates a new conversation contract
     */
    createConversationContract(conversationId, userId = 'user_default', initialGoal = '') {
        const now = new Date().toISOString();
        return {
            conversation_id: conversationId,
            user_id: userId,
            created_at: now,
            updated_at: now,
            active_goal: initialGoal,
            last_intent: 'INITIAL_CONTACT',
            conversation_summary: 'Conversation initialized.',
            messages: [],
            conversation_state: {
                known_facts: [],       // [ { fact, confidence, source, timestamp } ]
                unknown_facts: [],     // [ { required_field, description } ]
                decisions: [],         // [ { decision, rationale, timestamp } ]
                constraints: [],       // [ { constraint, type, value } ]
                asked_questions: [],   // [ { question_id, question, intent, timestamp } ]
                answered_questions: [],// [ { question, answer, extracted_facts, timestamp } ]
                pending_tasks: [],     // [ { task_id, description, status } ]
                resolved_intents: [],  // [ intent ]
                next_best_action: 'AWAIT_USER_GOAL'
            }
        };
    }

    /**
     * Loads existing conversation or initializes new contract
     */
    async loadConversation(conversationId, userId = 'user_default') {
        let contract = await this.storage.get(conversationId);
        if (!contract) {
            contract = this.createConversationContract(conversationId, userId);
            await this.storage.set(conversationId, contract);
        }
        return contract;
    }

    /**
     * Loads recent N messages (defaults to last 10-20 turns)
     */
    loadRecentMessages(contract, limit = 16) {
        if (!contract || !contract.messages) return [];
        return contract.messages.slice(-limit);
    }

    /**
     * Loads active conversation summary
     */
    loadConversationSummary(contract) {
        return contract?.conversation_summary || 'No prior summary available.';
    }

    /**
     * Loads full structured conversation state
     */
    loadConversationState(contract) {
        return contract?.conversation_state || {};
    }

    /**
     * Appends a message turn (user, assistant, or tool)
     */
    async appendMessage(conversationId, messageObj) {
        const contract = await this.loadConversation(conversationId);
        const msg = {
            id: 'msg_' + Math.random().toString(36).substr(2, 9),
            role: messageObj.role || 'user',
            content: messageObj.content || '',
            tool_calls: messageObj.tool_calls || null,
            tool_results: messageObj.tool_results || null,
            timestamp: new Date().toISOString()
        };
        contract.messages.push(msg);
        contract.updated_at = new Date().toISOString();
        await this.storage.set(conversationId, contract);
        return contract;
    }

    /**
     * Updates and persists conversation state contract with extracted facts, decisions, and constraints
     */
    async saveConversationState(conversationId, stateUpdates) {
        const contract = await this.loadConversation(conversationId);
        const state = contract.conversation_state;

        if (stateUpdates.active_goal) contract.active_goal = stateUpdates.active_goal;
        if (stateUpdates.last_intent) contract.last_intent = stateUpdates.last_intent;
        if (stateUpdates.next_best_action) state.next_best_action = stateUpdates.next_best_action;

        // Merge known facts (deduplicated by fact text)
        if (Array.isArray(stateUpdates.known_facts)) {
            stateUpdates.known_facts.forEach(newFact => {
                const text = typeof newFact === 'string' ? newFact : newFact.fact;
                const exists = state.known_facts.some(k => (typeof k === 'string' ? k : k.fact).toLowerCase() === text.toLowerCase());
                if (!exists) {
                    state.known_facts.push(typeof newFact === 'object' ? newFact : { fact: newFact, confidence: 1.0, timestamp: new Date().toISOString() });
                }
            });
        }

        // Merge constraints
        if (Array.isArray(stateUpdates.constraints)) {
            stateUpdates.constraints.forEach(c => {
                const desc = typeof c === 'string' ? c : c.constraint;
                const exists = state.constraints.some(ec => (typeof ec === 'string' ? ec : ec.constraint).toLowerCase() === desc.toLowerCase());
                if (!exists) {
                    state.constraints.push(typeof c === 'object' ? c : { constraint: c, timestamp: new Date().toISOString() });
                }
            });
        }

        // Merge decisions
        if (Array.isArray(stateUpdates.decisions)) {
            stateUpdates.decisions.forEach(d => {
                state.decisions.push(typeof d === 'object' ? d : { decision: d, timestamp: new Date().toISOString() });
            });
        }

        // Merge answered questions
        if (Array.isArray(stateUpdates.answered_questions)) {
            stateUpdates.answered_questions.forEach(aq => {
                state.answered_questions.push(aq);
            });
        }

        // Merge asked questions
        if (Array.isArray(stateUpdates.asked_questions)) {
            stateUpdates.asked_questions.forEach(q => {
                state.asked_questions.push(q);
            });
        }

        contract.updated_at = new Date().toISOString();
        await this.storage.set(conversationId, contract);
        return contract;
    }

    /**
     * Updates structured conversation summary
     */
    async updateConversationSummary(conversationId, newSummary) {
        const contract = await this.loadConversation(conversationId);
        contract.conversation_summary = newSummary;
        contract.updated_at = new Date().toISOString();
        await this.storage.set(conversationId, contract);
        return contract;
    }
}

/**
 * In-Memory & LocalStorage Adaptive Storage Adapter
 */
class MemoryStorageAdapter {
    constructor() {
        this.cache = new Map();
    }

    async get(key) {
        if (typeof localStorage !== 'undefined') {
            try {
                const val = localStorage.getItem('iinsha_conv_' + key);
                if (val) return JSON.parse(val);
            } catch (e) {}
        }
        return this.cache.get(key) || null;
    }

    async set(key, value) {
        this.cache.set(key, value);
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('iinsha_conv_' + key, JSON.stringify(value));
            } catch (e) {}
        }
        return true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConversationStateEngine, MemoryStorageAdapter };
} else {
    window.ConversationStateEngine = ConversationStateEngine;
    window.MemoryStorageAdapter = MemoryStorageAdapter;
}
