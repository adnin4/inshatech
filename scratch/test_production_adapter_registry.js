/**
 * IINSHA AI-BOS — PRODUCTION ADAPTER REGISTRY TEST
 * Tests:
 * - NOT_CONFIGURED state for unauthenticated external providers
 * - QA Confidence Threshold (0.91 blocked, 0.99 authorized)
 * - Owner Approval Gate for Production Delivery (APPROVAL_REQUIRED -> AUTHORIZED -> DELIVERED)
 * - Continuous Learning Lifecycle (Candidate -> Benchmark -> Approved Skill)
 */

const { ProductionAdapterRegistry } = require('../ai_brain/production_adapter_registry.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA PRODUCTION ADAPTER REGISTRY & LIFECYCLE GATES');
console.log('================================================================================\n');

let passed = 0;
let failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        passed++;
        console.log(`✅ [PASS] ${name}`);
        if (detail) console.log(`   📁 Detail: ${detail}`);
    } else {
        failed++;
        console.error(`❌ [FAIL] ${name}`);
        if (detail) console.error(`   ⚠️ Failure: ${detail}`);
    }
}

const registry = new ProductionAdapterRegistry();

// 1. Adapter Status Checks
const paymentAdapter = registry.getAdapter('PAYMENT');
const crmAdapter = registry.getAdapter('CRM');
assert(
    'External Adapters Truthfully Report NOT_CONFIGURED',
    paymentAdapter.status === 'NOT_CONFIGURED' && crmAdapter.status === 'NOT_CONFIGURED',
    'Unauthenticated external adapters report NOT_CONFIGURED without fabricating success'
);

// 2. QA Confidence Threshold Gate
const lowQa = registry.evaluateQaGate({ confidence: 0.91 });
const highQa = registry.evaluateQaGate({ confidence: 0.99 });
assert(
    'QA Confidence Threshold Enforced (0.91 Blocked, 0.99 Authorized)',
    lowQa.status === 'QA_BLOCKED' && highQa.status === 'CLIENT_REVIEW_AUTHORIZED',
    `Low QA: ${lowQa.status} | High QA: ${highQa.status}`
);

// 3. Owner-Controlled Production Delivery Gate
const unapprovedDelivery = registry.requestProductionDelivery('PROJ-1001', false);
const approvedDelivery = registry.requestProductionDelivery('PROJ-1001', true);
assert(
    'Production Delivery Gate Requires Owner Sign-Off (APPROVAL_REQUIRED -> AUTHORIZED)',
    unapprovedDelivery.status === 'APPROVAL_REQUIRED' && approvedDelivery.status === 'AUTHORIZED',
    `Unapproved: ${unapprovedDelivery.status} | Approved: ${approvedDelivery.status}`
);

// 4. Continuous Learning Promotion Lifecycle
const unverifiedCandidate = registry.processLearningCandidate({ pattern: 'Playwright scraper', benchmarkScore: 0.85 });
const benchmarkedCandidate = registry.processLearningCandidate({ pattern: 'n8n webhook cluster', benchmarkScore: 0.95, reviewedByHuman: false });
const approvedSkill = registry.processLearningCandidate({ pattern: 'Voice AI SIP Gateway', benchmarkScore: 0.98, reviewedByHuman: true });

assert(
    'Learning Candidate Lifecycle Verified (Candidate -> Benchmark -> Approved Skill)',
    unverifiedCandidate.status === 'CANDIDATE' &&
    benchmarkedCandidate.status === 'BENCHMARKED_PENDING_APPROVAL' &&
    approvedSkill.status === 'APPROVED_SKILL',
    `Candidate: ${unverifiedCandidate.status} | Benchmarked: ${benchmarkedCandidate.status} | Approved: ${approvedSkill.status}`
);

console.log('\n================================================================================');
console.log(`🎯 PRODUCTION ADAPTER REGISTRY RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
