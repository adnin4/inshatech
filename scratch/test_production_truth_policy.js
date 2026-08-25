import assert from 'node:assert/strict';
import { assertProductionSuccess, normalizeUnavailable, productionEvidenceIsValid } from '../ai_brain/production_truth_policy.js';

assert.throws(() => assertProductionSuccess({ status: 'EXECUTED' }), /PRODUCTION_TRUTH_VIOLATION/);
assert.throws(() => assertProductionSuccess({ status: 'EXECUTED_REAL' }), /PRODUCTION_TRUTH_VIOLATION/);

const unavailable = normalizeUnavailable('provider credentials missing');
assert.equal(unavailable.status, 'NOT_CONFIGURED');
assert.equal(unavailable.production_claim, false);
assert.equal(unavailable.verified, false);

const validEvidence = {
  environment: 'production',
  execution_id: 'exec-test-1',
  started_at: '2026-08-25T00:00:00.000Z',
  finished_at: '2026-08-25T00:00:01.000Z',
  provider: 'test-provider',
  provider_receipt_id: 'receipt-test-1',
  test_double: false,
  verified: true
};
assert.equal(productionEvidenceIsValid(validEvidence), true);
assert.doesNotThrow(() => assertProductionSuccess({ status: 'EXECUTED_REAL', evidence: validEvidence }));

console.log('PRODUCTION_TRUTH_POLICY_TEST: PASS');
