/**
 * IINSHA AI-BOS — REVENUE LIFECYCLE SANDBOX TEST
 * Validates:
 * - Real Lead Qualification
 * - Margin-Gated Proposal Generation
 * - Unverified Payment Project Blocking
 * - Verified Payment Project Initialization
 * - Synthetic Lead Quarantine
 */

const { RevenueLifecycleEngine } = require('../ai_brain/revenue_lifecycle_engine.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA REVENUE LIFECYCLE ENGINE');
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

const engine = new RevenueLifecycleEngine();

// 1. Synthetic Lead Quarantine
const syntheticAttempt = engine.createLead({
    name: 'Demo Person',
    email: 'demo@synthetic.local',
    classification: 'SYNTHETIC_DEMO'
});

assert(
    'Synthetic Lead Strictly Blocked from Revenue Pipeline',
    syntheticAttempt.status === 'BLOCKED',
    syntheticAttempt.reason
);

// 2. Real Lead Ingestion
const realLead = engine.createLead({
    name: 'Shahriar Ahmed',
    email: 'shahriar@dhakatech.com',
    company: 'Dhaka Tech Solutions',
    classification: 'REAL_PROSPECT',
    serviceId: 'b2b-lead-swarm',
    budgetUSD: 850
});

assert(
    'Real Lead Qualified for Proposal Generation',
    realLead.status === 'QUALIFIED' && realLead.lead.id.startsWith('LEAD-'),
    `Lead ID: ${realLead.lead.id}`
);

// 3. Margin-Gated Proposal
const proposal = engine.generateMarginGatedProposal(realLead.lead.id, 850);
assert(
    'Proposal Generated Within Safe Margin Floor',
    proposal.status === 'PROPOSAL_GENERATED' && proposal.proposal.priceUSD === 850,
    `Proposal ID: ${proposal.proposal.id}`
);

// 4. Proposal Acceptance
const accepted = engine.acceptProposal(proposal.proposal.id);
assert(
    'Proposal Accepted & Order Created in PENDING Payment State',
    accepted.status === 'ACCEPTED' && accepted.order.paymentStatus === 'PENDING',
    `Order ID: ${accepted.orderId}`
);

// 5. Unverified Payment -> Project Creation BLOCKED
const unverifiedAttempt = engine.processPayment(accepted.orderId, { isVerifiedGatewayPayload: false });
assert(
    'Unverified Payment Strictly Blocks Project Creation',
    unverifiedAttempt.status === 'PAYMENT_UNVERIFIED_BLOCKED' && unverifiedAttempt.paymentStatus === 'UNVERIFIED',
    unverifiedAttempt.message
);

// 6. Verified Payment -> Project Created in PLANNING State
const verifiedPayment = engine.processPayment(accepted.orderId, {
    isVerifiedGatewayPayload: true,
    transactionRef: 'TXN-STRIPE-LIVE-789012'
});

assert(
    'Verified Gateway Payment Unlocks Project DAG in PLANNING Stage',
    verifiedPayment.status === 'PAID' && verifiedPayment.project.status === 'PLANNING',
    `Project ID: ${verifiedPayment.project.id} | Milestones: ${verifiedPayment.project.milestones.length}`
);

console.log('\n================================================================================');
console.log(`🎯 REVENUE LIFECYCLE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
