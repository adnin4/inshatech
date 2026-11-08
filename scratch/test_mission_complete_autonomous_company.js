/**
 * IINSHA AI-BOS — MASTER MISSION-COMPLETE VERIFICATION SUITE
 * Tests Canonical Parity, Lead Source Adapters, Real vs Synthetic Classification,
 * Opportunity Scoring, Margin Guardian, Dual-Agent QA, and Closed-Loop Orchestration.
 */

const { LeadAcquisitionEngine, LeadSourceAdapter } = require('../ai_brain/lead_acquisition_engine.js');
const { NegotiationMarginEngine } = require('../ai_brain/negotiation_margin_engine.js');
const { CustomerSuccessEngine } = require('../ai_brain/customer_success_engine.js');
const { AiCfoEngine } = require('../ai_brain/ai_cfo_engine.js');
const { IndependentQaVerifier } = require('../ai_brain/independent_qa_verifier.js');
const { AutonomousCompanyOrchestrator } = require('../ai_brain/autonomous_company_orchestrator.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA MISSION-COMPLETE: BOUNDED AUTONOMOUS COMPANY ENGINE');
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

// 1. LeadSourceAdapter & Ingestion Test
const engine = new LeadAcquisitionEngine();

// Real prospect
const realProspect = engine.ingestProspect({
    name: 'Habibullah Khan',
    email: 'habib@enterprise-ai.co',
    company: 'Enterprise AI Labs',
    industry: 'B2B SaaS & Digital Agencies',
    role: 'Founder & CEO',
    classification: 'REAL_PROSPECT',
    visitedPricing: true,
    interactedWithCopilot: true,
    painPoint: 'Manual prospecting taking 20 hours/week'
});

assert(
    'Real Prospect Ingested with Opportunity Score & OUTREACH_READY Status',
    realProspect.classification === 'REAL_PROSPECT' &&
    realProspect.leadStatus === 'OUTREACH_READY' &&
    realProspect.opportunityScore >= 80,
    `Opportunity Score: ${realProspect.opportunityScore} | Status: ${realProspect.leadStatus}`
);

// Synthetic Demo Lead (Strictly labeled)
const demoLead = engine.ingestProspect({
    name: 'Demo User',
    email: 'demo@synthetic.local',
    company: 'Simulated Company',
    classification: 'SYNTHETIC_DEMO',
    visitedPricing: true
});

assert(
    'Synthetic Demo Lead Correctly Tagged (Blocked from Production Outreach)',
    demoLead.classification === 'SYNTHETIC_DEMO' &&
    demoLead.leadStatus === 'QUALIFIED_DEMO_ONLY' &&
    !demoLead.isOutreachEligible,
    'Synthetic demo prospect barred from entering production outreach queue'
);

// Opt-out suppression
engine.registerOptOut('suppressed@client.com');
const optOutAttempt = engine.ingestProspect({
    name: 'Blocked Person',
    email: 'suppressed@client.com',
    company: 'Opted Out Inc',
    classification: 'REAL_PROSPECT'
});

assert(
    'Opt-Out & Suppression Registry Active',
    optOutAttempt.status === 'SUPPRESSED',
    'Suppressed email successfully blocked from ingestion'
);

// 2. Margin Guardian & Floor Rule
const marginEngine = new NegotiationMarginEngine();
const floor = marginEngine.calculateFinancialFloor('b2b-lead-swarm');
const normalPrice = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 850);
const safeDiscount = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 800);
const deepDiscount = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 750);
const lossOffer = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 300);

assert(
    'Dynamic Margin Guardian Enforces Pricing Policies & L3 Escalation',
    normalPrice.decision === 'ACCEPT_FULL_PRICE' &&
    safeDiscount.decision === 'ACCEPT_AUTONOMOUS_DISCOUNT' &&
    deepDiscount.decision === 'REQUIRES_L3_OWNER_APPROVAL' &&
    lossOffer.decision === 'REJECT_UNPROFITABLE_OFFER',
    'Pricing boundaries strictly enforced (Autonomous <=10%, L3 Approval >10%, Loss-making Rejected)'
);

// 3. Two-Agent Independent QA Verifier Rule
const verifier = new IndependentQaVerifier();
const builderSelfCert = verifier.verifyDeliverable({
    builderAgentId: 'QA_SUPERVISOR_VERIFIER_01', // Violating Two-Agent Rule
    deliverableType: 'b2b-lead-swarm'
});

const independentAudit = verifier.verifyDeliverable({
    builderAgentId: 'DEVELOPER_SWARM_LEAD',
    deliverableType: 'b2b-lead-swarm',
    codeArtifacts: 'Production Edge Bundle',
    rlsPoliciesConfigured: true
});

assert(
    'Independent Dual-Agent QA Rule Enforced (Builder != Verifier)',
    builderSelfCert.verdict === 'FAIL' && independentAudit.verdict === 'PASS_CERTIFIED',
    'Self-certification rejected; independent multi-dimensional verification certified'
);

// 4. Closed-Loop Autonomous Company Business Runtime
const orchestrator = new AutonomousCompanyOrchestrator();
const loopTrace = orchestrator.runFullBusinessLoop({
    name: 'Tariq Mahmud',
    email: 'tariq@dhakafinance.com',
    company: 'Dhaka Financial Systems',
    industry: 'B2B SaaS & Digital Agencies',
    role: 'Managing Director',
    classification: 'REAL_PROSPECT',
    visitedPricing: true,
    interactedWithCopilot: true,
    painPoint: 'High customer support latency and manual billing'
});

assert(
    'End-to-End Autonomous Business Runtime Loop Verified',
    loopTrace.overallStatus === 'CLOSED_LOOP_BUSINESS_CYCLE_VERIFIED_PASS' &&
    loopTrace.stages.payment.status === 'SETTLED_SUCCESS' &&
    loopTrace.stages.independentQa.verdict === 'PASS_CERTIFIED' &&
    loopTrace.stages.customerHealth.healthScore >= 80,
    'End-to-end trace: Discovery -> Opportunity -> Negotiation -> Payment -> QA -> CS -> Knowledge -> CEO Briefing'
);

console.log('\n================================================================================');
console.log(`🎯 MISSION-COMPLETE VERIFICATION RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
