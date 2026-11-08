/**
 * IINSHA AI-BOS: Canonical Production Truth Policy (PR #11 Implementation)
 * 
 * Enforces strict non-ambiguous state transitions:
 * NOT_CONFIGURED | CONFIGURED_NOT_VERIFIED | AUTHORIZED | QUEUED | 
 * DISPATCHED | EXECUTION_STARTED | PROVIDER_RESPONDED | EVIDENCE_CAPTURED | 
 * EXECUTED_REAL | LIVE_VERIFIED | FAILED | BLOCKED
 * 
 * Zero tolerance for unevidenced "EXECUTED", "COMPLETED", or "SUCCESS".
 */

export const CANONICAL_EXECUTION_STATES = {
    NOT_CONFIGURED: 'NOT_CONFIGURED',
    CONFIGURED_NOT_VERIFIED: 'CONFIGURED_NOT_VERIFIED',
    AUTHORIZED: 'AUTHORIZED',
    QUEUED: 'QUEUED',
    DISPATCHED: 'DISPATCHED',
    EXECUTION_STARTED: 'EXECUTION_STARTED',
    PROVIDER_RESPONDED: 'PROVIDER_RESPONDED',
    EVIDENCE_CAPTURED: 'EVIDENCE_CAPTURED',
    EXECUTED_REAL: 'EXECUTED_REAL',
    LIVE_VERIFIED: 'LIVE_VERIFIED',
    FAILED: 'FAILED',
    BLOCKED: 'BLOCKED'
};

export class ProductionTruthPolicy {
    /**
     * Validates an execution record against strict truth invariants
     */
    static validateExecution(record) {
        if (!record) {
            return { valid: false, reason: 'Execution record is missing' };
        }

        const {
            execution_id,
            provider,
            provider_receipt_id,
            status,
            started_at,
            finished_at,
            verified,
            test_double,
            environment
        } = record;

        // Invariant 1: Status must be in canonical set
        if (!Object.values(CANONICAL_EXECUTION_STATES).includes(status)) {
            return { valid: false, reason: `Invalid status: ${status}. Must be a canonical state.` };
        }

        // Invariant 2: EXECUTED_REAL or LIVE_VERIFIED requires real evidence
        if (status === CANONICAL_EXECUTION_STATES.EXECUTED_REAL || status === CANONICAL_EXECUTION_STATES.LIVE_VERIFIED) {
            if (!execution_id) return { valid: false, reason: 'Missing execution_id' };
            if (!provider) return { valid: false, reason: 'Missing provider declaration' };
            if (!started_at || !finished_at) return { valid: false, reason: 'Missing execution timestamps' };
            if (verified !== true) return { valid: false, reason: 'Execution not cryptographically or independently verified' };
            if (test_double === true && environment === 'production') {
                return { valid: false, reason: 'Test double execution cannot be marked EXECUTED_REAL in production' };
            }
        }

        // Invariant 3: Unconfigured providers must fail-closed
        if (status === CANONICAL_EXECUTION_STATES.NOT_CONFIGURED && !record.missing_dependency) {
            return { valid: false, reason: 'NOT_CONFIGURED must specify missing_dependency' };
        }

        return { valid: true, status };
    }
}
