/**
 * IINSHA AI-BOS — AUTONOMOUS BUSINESS MILESTONE TEST
 * Tests the complete post-sale operating cycle:
 * Real Lead -> Opportunity -> Proposal -> Acceptance -> Payment Checkout (NOT_CONFIGURED check) ->
 * Webhook Idempotency (DUPLICATE_IGNORED check) -> Project Delivered -> Support -> Renewal -> Unverified Learning.
 */

const { AutonomousBusinessEngine } = require('../ai_brain/autonomous_business_engine.js');
const { InMemoryBusinessStore } = require('./in_memory_business_store.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA AUTONOMOUS BUSINESS EXECUTION MILESTONE');
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

const store = new InMemoryBusinessStore();
const engine = new AutonomousBusinessEngine(store);

// 1. Sales Opportunity
const opp = engine.createOpportunity({
    name: 'Nayeem Islam',
    company: 'Apex Automation Ltd',
    serviceId: 'b2b-lead-swarm'
});
assert('Sales Opportunity Created in PROPOSAL State', opp.status === 'PROPOSAL', `Opportunity ID: ${opp.id}`);

// 2. Proposal & Acceptance
const prop = engine.createProposal(opp.id, 850);
const order = engine.acceptProposal(prop.id);
assert('Proposal Accepted & Order Generated', order.id.startsWith('ORD-'), `Order ID: ${order.id}`);

// 3. Checkout (Truthful NOT_CONFIGURED check in absence of live credentials)
const checkout = engine.initiateCheckout(order.id, 'stripe');
assert('Payment Checkout Returns NOT_CONFIGURED Truthfully', checkout.status === 'NOT_CONFIGURED', checkout.message);

// 4. Webhook Idempotency Check
const hook1 = engine.processWebhook({ orderId: order.id, amount: 850 }, 'evt_stripe_1001');
const hook2 = engine.processWebhook({ orderId: order.id, amount: 850 }, 'evt_stripe_1001'); // Duplicate replay
assert(
    'Webhook Replay Safely Deduplicated (DUPLICATE_IGNORED)',
    hook1.status === 'PAYMENT_VERIFIED_SUCCESS' && hook2.status === 'DUPLICATE_IGNORED',
    hook2.message
);

// 5. Project Execution, Independent QA, Client Approval & Delivery
const execution = engine.createAndExecuteProject(order.id);
assert(
    'Project Successfully Delivered with QA Pass, Support Ticket, and Scheduled Renewal',
    execution.status === 'PROJECT_DELIVERED_SUCCESS' &&
    execution.project.status === 'DELIVERED' &&
    execution.supportTicket.status === 'OPEN' &&
    execution.renewal.status === 'SCHEDULED',
    `Project ID: ${execution.project.id} | Support Ticket: ${execution.supportTicket.id}`
);

// 6. Learning Record Created in UNVERIFIED State
assert(
    'Learned Experience Recorded in UNVERIFIED State (Requires Human Review)',
    execution.learningRecord.verificationStatus === 'UNVERIFIED',
    `Pattern: ${execution.learningRecord.pattern}`
);

console.log('\n================================================================================');
console.log(`🎯 AUTONOMOUS BUSINESS EXECUTION RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
