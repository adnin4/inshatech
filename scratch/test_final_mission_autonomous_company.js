/**
 * IINSHA AI-BOS — FINAL MISSION AUTONOMOUS COMPANY VERIFICATION TEST
 * Tests Event Bus, Customer Success, AI CFO, Independent QA Verifier, and Full Business Loop Orchestrator.
 */

const { CompanyEventBus } = require('../ai_brain/company_event_bus.js');
const { CustomerSuccessEngine } = require('../ai_brain/customer_success_engine.js');
const { AiCfoEngine } = require('../ai_brain/ai_cfo_engine.js');
const { IndependentQaVerifier } = require('../ai_brain/independent_qa_verifier.js');
const { AutonomousCompanyOrchestrator } = require('../ai_brain/autonomous_company_orchestrator.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA FINAL MISSION: BOUNDED AUTONOMOUS COMPANY ENGINE');
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

// 1. Company Event Bus Test
const eventBus = new CompanyEventBus();
let eventDelivered = false;
eventBus.subscribe('proposal.accepted', (payload) => {
    eventDelivered = true;
    return 'RECEIVED_BY_FINANCE';
}, 'FINANCE_DIRECTOR');

const pubReceipt = eventBus.publish('proposal.accepted', { proposalId: 'PROP_99', amountUSD: 850 }, 'SALES_DIRECTOR');
assert(
    'Company Event Bus Subscription & Delivery',
    eventDelivered && pubReceipt.deliveries[0].status === 'DELIVERED',
    `Published proposal.accepted event and verified delivery to subscriber`
);

// 2. Customer Success & Churn Risk Engine
const csEngine = new CustomerSuccessEngine();
const goodHealth = csEngine.evaluateCustomerHealth({
    customerId: 'CUST_001',
    deliveryOnTime: true,
    openTicketsCount: 0,
    daysSinceLastLogin: 1,
    npsScore: 10,
    monthlySpendUSD: 850
});

const churnRiskCustomer = csEngine.evaluateCustomerHealth({
    customerId: 'CUST_002',
    deliveryOnTime: false,
    openTicketsCount: 3,
    daysSinceLastLogin: 35,
    npsScore: 4,
    monthlySpendUSD: 200
});

assert(
    'Customer Health Score & Expansion Eligibility Evaluated',
    goodHealth.healthScore >= 85 && goodHealth.churnRisk === 'LOW' && goodHealth.isUpsellReady,
    `Health Score: ${goodHealth.healthScore}, Churn Risk: ${goodHealth.churnRisk}, Upsell: Eligible`
);

assert(
    'Critical Churn Risk Interception & P0 Escalation',
    churnRiskCustomer.churnRisk === 'CRITICAL' && churnRiskCustomer.recommendedAction.priority.includes('P0'),
    `Correctly flagged CRITICAL churn risk and scheduled Owner intervention`
);

// 3. AI CFO Engine Test
const cfo = new AiCfoEngine();
const cfoReport = cfo.generateFinancialReport();
assert(
    'AI CFO Unit Economics & Double-Entry Verification',
    cfoReport.doubleEntryBalanceVerified && cfoReport.summary.totalGrossRevenueUSD > 0,
    `Verified Double-Entry balance: Gross $${cfoReport.summary.totalGrossRevenueUSD} (Net Margin: ${cfoReport.summary.blendedNetMarginPercent})`
);

// 4. Independent QA Verifier (Two-Agent Rule)
const verifier = new IndependentQaVerifier();
const selfCertAttempt = verifier.verifyDeliverable({
    builderAgentId: 'QA_SUPERVISOR_VERIFIER_01', // Violating Two-Agent Rule
    deliverableType: 'b2b-lead-swarm'
});

const properQaAudit = verifier.verifyDeliverable({
    builderAgentId: 'DEVELOPER_SWARM_LEAD',
    deliverableType: 'b2b-lead-swarm',
    codeArtifacts: 'Valid Cloudflare Edge Function',
    rlsPoliciesConfigured: true
});

assert(
    'Two-Agent Dual Verification Rule Strictly Enforced (No Self-Certification)',
    selfCertAttempt.verdict === 'FAIL' && selfCertAttempt.status.includes('SELF_CERTIFICATION_VIOLATION'),
    'Self-certification by builder agent was strictly rejected'
);

assert(
    'Independent QA Multi-Dimensional Audit Certification',
    properQaAudit.verdict === 'PASS_CERTIFIED' && properQaAudit.clientReviewEligible,
    'Independent Verifier certified deliverable across functionality, RLS, and security'
);

// 5. Full Business Loop Master Orchestrator
const orchestrator = new AutonomousCompanyOrchestrator();
const loopTrace = orchestrator.runFullBusinessLoop({
    name: 'Samiul Islam',
    email: 'samiul@apexagency.com',
    company: 'Apex Digital Agency',
    industry: 'B2B SaaS & Digital Agencies',
    role: 'Managing Director',
    classification: 'REAL_PROSPECT',
    visitedPricing: true,
    interactedWithCopilot: true,
    proposedPriceUSD: 850
});

assert(
    'Full Closed-Loop Autonomous Business Lifecycle Execution',
    loopTrace.overallStatus === 'CLOSED_LOOP_BUSINESS_CYCLE_VERIFIED_PASS' &&
    loopTrace.stages.leadAcquisition.status === 'INGESTED_SUCCESS' &&
    loopTrace.stages.independentQa.verdict === 'PASS_CERTIFIED' &&
    loopTrace.stages.customerHealth.healthScore >= 80,
    'Successfully orchestrated end-to-end loop: Ingestion -> Negotiation -> Payment -> QA -> Success -> Knowledge -> Briefing'
);

console.log('\n================================================================================');
console.log(`🎯 FINAL MISSION AUTONOMOUS COMPANY RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
