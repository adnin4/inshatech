/**
 * IINSHA AI-BOS — PHASE 3: ANTI-REPETITION ENGINE
 * Intercepts every candidate question before output.
 * Audits known_facts, answered_questions, conversation_summary, and memories.
 * Blocks duplicate questions and enforces safe assumption-based execution.
 */

class AntiRepetitionEngine {
    constructor() {}

    /**
     * Checks if a proposed question is safe to ask or if it should be blocked
     * @param {string} proposedQuestion
     * @param {object} context - Structured context from ContextEngine
     * @returns {object} { should_ask: boolean, reason: string, existing_value: any, assumption: string }
     */
    evaluateQuestion(proposedQuestion, context) {
        if (!proposedQuestion || typeof proposedQuestion !== 'string') {
            return { should_ask: false, reason: 'EMPTY_QUESTION', assumption: null };
        }

        const lowerQ = proposedQuestion.toLowerCase().trim();
        const state = context.conversation_state || {};
        const knownFacts = state.known_facts || [];
        const answeredQuestions = state.answered_questions || [];
        const constraints = state.constraints || [];
        const recentTurns = context.recent_turns || [];
        const summary = (context.conversation_summary || '').toLowerCase();

        // 1. Check if question was already asked in this session
        const alreadyAsked = (state.asked_questions || []).some(q => {
            const text = typeof q === 'string' ? q : q.question;
            return this.computeSimilarity(text.toLowerCase(), lowerQ) > 0.75;
        });

        // 2. Check if topic relates to Company Type / Target Audience
        if (lowerQ.includes('company') || lowerQ.includes('business') || lowerQ.includes('industry') || lowerQ.includes('niche')) {
            const knownCompany = this.findMatchingFact(knownFacts, ['saas', 'b2b', 'agency', 'ecom', 'real estate', 'healthcare', 'clinic', 'logistics', 'fintech']);
            if (knownCompany) {
                return {
                    should_ask: false,
                    reason: 'ALREADY_KNOWN_IN_STATE',
                    existing_value: knownCompany,
                    assumption: `Targeting established ${knownCompany} industry.`
                };
            }
        }

        // 3. Check if topic relates to Company Size / Employees
        if (lowerQ.includes('employee') || lowerQ.includes('size') || lowerQ.includes('headcount') || lowerQ.includes('team')) {
            const knownSize = this.findMatchingFact(knownFacts, ['employee', 'team', '50-200', '10-50', '200+', 'headcount', 'size']);
            if (knownSize) {
                return {
                    should_ask: false,
                    reason: 'ALREADY_KNOWN_IN_STATE',
                    existing_value: knownSize,
                    assumption: `Targeting company headcount: ${knownSize}.`
                };
            }
        }

        // 4. Check if topic relates to Lead Volume / Quantity
        if (lowerQ.includes('how many') || lowerQ.includes('quantity') || lowerQ.includes('volume') || lowerQ.includes('lead count')) {
            const knownQty = this.findMatchingFact(knownFacts, ['100', '50', '200', '500', 'leads', 'quantity']);
            if (knownQty) {
                return {
                    should_ask: false,
                    reason: 'ALREADY_KNOWN_IN_STATE',
                    existing_value: knownQty,
                    assumption: `Proceeding with lead quantity: ${knownQty}.`
                };
            }
        }

        // 5. Check if answer exists in Answered Questions list
        const matchingAnswer = answeredQuestions.find(aq => {
            return this.computeSimilarity(aq.question.toLowerCase(), lowerQ) > 0.65;
        });
        if (matchingAnswer) {
            return {
                should_ask: false,
                reason: 'ALREADY_ANSWERED',
                existing_value: matchingAnswer.answer,
                assumption: `Using previous answer: ${matchingAnswer.answer}`
            };
        }

        // 6. Check if question was already asked previously without user response
        if (alreadyAsked) {
            return {
                should_ask: false,
                reason: 'ALREADY_ASKED_PREVIOUSLY',
                assumption: 'Proceeding with standard enterprise configuration to avoid friction.'
            };
        }

        // 7. Legitimate new question
        return {
            should_ask: true,
            reason: 'NO_PRIOR_RECORD_FOUND',
            assumption: null
        };
    }

    findMatchingFact(facts, keywords) {
        for (const f of facts) {
            const text = (typeof f === 'string' ? f : f.fact).toLowerCase();
            for (const kw of keywords) {
                if (text.includes(kw)) return typeof f === 'string' ? f : f.fact;
            }
        }
        return null;
    }

    computeSimilarity(strA, strB) {
        if (strA === strB) return 1.0;
        const wordsA = new Set(strA.split(/\s+/));
        const wordsB = new Set(strB.split(/\s+/));
        let common = 0;
        wordsA.forEach(w => { if (wordsB.has(w)) common++; });
        return (2.0 * common) / (wordsA.size + wordsB.size);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AntiRepetitionEngine };
} else {
    window.AntiRepetitionEngine = AntiRepetitionEngine;
}
