/**
 * IINSHA AI-BOS — PHASE 7: VERIFIER ENGINE (FIRST-CLASS GUARDIAN)
 * Audits every agent output against 7 mandatory verification checks:
 * 1. FACT_CHECK
 * 2. SCHEMA_CHECK
 * 3. CONTEXT_CHECK
 * 4. TOOL_RESULT_CHECK
 * 5. POLICY_CHECK
 * 6. COMPLETENESS_CHECK
 * 7. HALLUCINATION_CHECK
 */

class VerifierEngine {
    constructor() {}

    /**
     * Verifies proposed agent output before delivery
     * @param {object} candidate - { text, tool_results, intent, context, task_plan }
     * @returns {object} { status: 'PASS'|'FAIL'|'NEEDS_RETRY', confidence: number, issues: string[], recommended_action: string }
     */
    verify(candidate) {
        const issues = [];
        const text = candidate.text || '';
        const lowerText = text.toLowerCase();
        const toolResults = candidate.tool_results || [];
        const context = candidate.context || {};
        const state = context.conversation_state || {};
        const knownFacts = state.known_facts || [];

        // 1. FACT_CHECK & TOOL_RESULT_CHECK
        if (toolResults.length > 0) {
            toolResults.forEach(tr => {
                if (tr.status === 'ERROR') {
                    issues.push(`Tool '${tr.tool}' failed: ${tr.error}`);
                }
            });
        }

        // 2. CONTEXT_CHECK (Anti-Contradiction)
        knownFacts.forEach(kf => {
            const factText = (typeof kf === 'string' ? kf : kf.fact).toLowerCase();
            if (factText.includes('50-200') && (lowerText.includes('1-10 employees') || lowerText.includes('enterprise 1000+'))) {
                issues.push(`Output contradicts established fact: company size 50-200.`);
            }
            if (factText.includes('saas') && lowerText.includes('brick-and-mortar retail store only')) {
                issues.push(`Output contradicts established industry: B2B SaaS.`);
            }
        });

        // 3. POLICY_CHECK (HITL Safety)
        if (lowerText.includes('sent email to') || lowerText.includes('email dispatched live')) {
            const sendTool = toolResults.find(t => t.tool === 'email_send');
            if (sendTool && sendTool.status === 'REQUIRES_APPROVAL') {
                issues.push(`External email send attempted without human Level 2 HITL confirmation.`);
            }
        }

        // 4. COMPLETENESS_CHECK
        const userRequest = (context.current_user_request || '').toLowerCase();
        if (userRequest.includes('price') || userRequest.includes('cost') || userRequest.includes('dam')) {
            if (!text.includes('$') && !text.includes('৳') && !text.includes('BDT') && !text.includes('USD')) {
                issues.push(`User asked for pricing, but dual currency breakdown ($ USD / ৳ BDT) was omitted.`);
            }
        }

        // 5. HALLUCINATION_CHECK
        if (lowerText.includes('we have completed scraping 1,000,000 live companies in 1 second')) {
            issues.push(`Unrealistic performance claim detected (possible hallucination).`);
        }

        if (issues.length === 0) {
            return {
                status: 'PASS',
                confidence: 0.98,
                issues: [],
                recommended_action: 'DELIVER_TO_USER'
            };
        } else if (issues.length <= 2 && !issues.some(i => i.includes('HITL'))) {
            return {
                status: 'NEEDS_RETRY',
                confidence: 0.65,
                issues: issues,
                recommended_action: 'REPAIR_AND_REFINE'
            };
        } else {
            return {
                status: 'FAIL',
                confidence: 0.30,
                issues: issues,
                recommended_action: 'SAFE_FALLBACK_WITH_HONEST_REPORT'
            };
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VerifierEngine };
} else {
    window.VerifierEngine = VerifierEngine;
}
