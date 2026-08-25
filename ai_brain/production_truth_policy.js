/**
 * IINSHA AI-BOS — Production Truth Policy
 *
 * A production claim is valid only when independently verifiable evidence exists.
 * This module is intentionally conservative: configured adapters and formatted
 * dispatches are NOT executions, and test doubles can never certify production.
 */

const TERMINAL_PRODUCTION_STATUSES = new Set([
  'EXECUTED_REAL',
  'MESSAGE_SENT',
  'PERSISTED_TO_POSTGRES',
  'DELIVERED',
  'DEPLOYED',
  'QA_PASSED',
  'ROLLBACK_COMPLETED'
]);

const FORBIDDEN_SUCCESS_STATUSES = new Set([
  'EXECUTED',
  'COMPLETED',
  'CONNECTOR_READY',
  'DISPATCH_FORMATTED',
  'DISPATCH_QUEUED',
  'QUALIFIED_IN_CRM_PIPELINE',
  'PIPELINE_EXECUTED',
  'POLICY_VERIFIED_INTERNAL'
]);

export function productionEvidenceIsValid(evidence = {}) {
  if (evidence.environment !== 'production') return false;
  if (!evidence.execution_id) return false;
  if (!evidence.started_at || !evidence.finished_at) return false;
  if (!evidence.provider) return false;
  if (!evidence.provider_receipt_id) return false;
  if (evidence.test_double === true) return false;
  if (evidence.verified !== true) return false;
  return true;
}

export function assertProductionSuccess(result = {}) {
  const status = result.status || result.result?.status;
  if (FORBIDDEN_SUCCESS_STATUSES.has(status)) {
    throw new Error(`PRODUCTION_TRUTH_VIOLATION: '${status}' cannot represent production execution.`);
  }

  if (TERMINAL_PRODUCTION_STATUSES.has(status)) {
    const evidence = result.evidence || result.result?.evidence || result.receipt?.evidence;
    if (!productionEvidenceIsValid(evidence)) {
      throw new Error(`PRODUCTION_TRUTH_VIOLATION: '${status}' requires verified provider evidence.`);
    }
  }

  return result;
}

export function normalizeUnavailable(reason, details = {}) {
  return {
    status: 'NOT_CONFIGURED',
    reason,
    ...details,
    production_claim: false,
    verified: false,
    test_double: false,
    timestamp: new Date().toISOString()
  };
}

export function normalizeBlocked(reason, details = {}) {
  return {
    status: 'BLOCKED',
    reason,
    ...details,
    production_claim: false,
    verified: false,
    test_double: false,
    timestamp: new Date().toISOString()
  };
}

export const PRODUCTION_TRUTH_STATUSES = Object.freeze({
  VERIFIED: 'LIVE_VERIFIED',
  CONFIGURED: 'CONFIGURED_NOT_VERIFIED',
  UNAVAILABLE: 'NOT_CONFIGURED',
  BLOCKED: 'BLOCKED',
  UNVERIFIED: 'UNVERIFIED'
});
