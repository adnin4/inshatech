import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AutonomousBusinessEngine } = require('../ai_brain/autonomous_business_engine.js');

const engine = new AutonomousBusinessEngine();

const checkout = await engine.initiateCheckout('ORD-TEST-1');
assert.equal(checkout.status, 'NOT_CONFIGURED');
assert.equal(checkout.blocked_from_success_claim, true);
assert.equal(checkout.production_verified, false);

const webhookNoVerifier = await engine.processWebhook(
    { orderId: 'ORD-TEST-1', amount: 100, currency: 'USD' },
    'evt-test-1',
    'fake-signature'
);
assert.equal(webhookNoVerifier.status, 'NOT_CONFIGURED');
assert.equal(webhookNoVerifier.blocked_from_success_claim, true);

const webhookMissingKey = await engine.processWebhook(
    { orderId: 'ORD-TEST-1', amount: 100, currency: 'USD' },
    null,
    'fake-signature'
);
assert.equal(webhookMissingKey.status, 'BLOCKED_MISSING_IDEMPOTENCY_KEY');

const projectNoPayment = engine.createAndExecuteProject('ORD-TEST-1', {
    paymentVerified: false
});
assert.equal(projectNoPayment.status, 'BLOCKED_PAYMENT_NOT_VERIFIED');

const projectMissingQa = engine.createAndExecuteProject('ORD-TEST-1', {
    paymentVerified: true,
    qaEvidence: {
        functionalCorrectness: true,
        securityRlsEnabled: true,
        priceTamperProtected: true,
        accessibilityWcagPass: true,
        zeroHardcodedSecrets: true,
        evidenceRefs: []
    }
});
assert.equal(projectMissingQa.status, 'BLOCKED_QA');
assert.equal(projectMissingQa.qaResult.verdict, 'BLOCKED_MISSING_EVIDENCE_REFS');

const projectMissingApproval = engine.createAndExecuteProject('ORD-TEST-1', {
    paymentVerified: true,
    qaEvidence: {
        functionalCorrectness: true,
        securityRlsEnabled: true,
        priceTamperProtected: true,
        accessibilityWcagPass: true,
        zeroHardcodedSecrets: true,
        evidenceRefs: ['qa://test/audit-1']
    }
});
assert.equal(projectMissingApproval.status, 'BLOCKED_CLIENT_APPROVAL_REQUIRED');

const approvedProject = engine.createAndExecuteProject('ORD-TEST-1', {
    paymentVerified: true,
    qaEvidence: {
        functionalCorrectness: true,
        securityRlsEnabled: true,
        priceTamperProtected: true,
        accessibilityWcagPass: true,
        zeroHardcodedSecrets: true,
        evidenceRefs: ['qa://test/audit-1']
    },
    clientApproval: true,
    clientApprovalEvidenceRef: 'approval://test/client-1'
});
assert.equal(approvedProject.status, 'PROJECT_DELIVERED_SUCCESS');
assert.equal(approvedProject.production_verified, true);
assert.equal(approvedProject.blocked_from_success_claim, false);

console.log('Business truth gates: PASS');
