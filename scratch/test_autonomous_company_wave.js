/**
 * IINSHA AI-BOS — AUTONOMOUS COMPANY WAVE VERIFICATION SUITE
 * Tests Lead Acquisition Engine, Negotiation Margin Guardian, Skill Registry Engine,
 * Technical Experience Graph, AI CEO Executive Loop, and Channel Adapters.
 */

const { LeadAcquisitionEngine } = require('../ai_brain/lead_acquisition_engine.js');
const { NegotiationMarginEngine } = require('../ai_brain/negotiation_margin_engine.js');
const { SkillRegistryEngine } = require('../ai_brain/skill_registry_engine.js');
const { TechnicalExperienceGraph } = require('../ai_brain/technical_experience_graph.js');
const { AiCeoExecutiveLoop } = require('../ai_brain/ai_ceo_executive_loop.js');
const { AutonomousChannelAdapters } = require('../ai_brain/autonomous_channel_adapters.js');

console.log('================================================================================');
console.log('👑 TESTING IINSHA AUTONOMOUS COMPANY WAVE (REAL-WORLD CAPABILITIES)');
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

// 1. Lead Acquisition Engine
const leadEngine = new LeadAcquisitionEngine();
const realLead = leadEngine.ingestProspect({
    name: 'Asif Karim',
    email: 'asif@cloudscale.io',
    company: 'CloudScale Technologies',
    industry: 'B2B SaaS',
    role: 'Founder & CEO',
    classification: 'REAL_PROSPECT',
    visitedPricing: true,
    interactedWithCopilot: true
});

assert(
    'Real Prospect Ingested with Correct Classification',
    realLead.classification === 'REAL_PROSPECT' && !realLead.record.is_synthetic && realLead.opportunityScore >= 75,
    `Ingested REAL_PROSPECT with score ${realLead.opportunityScore}`
);

// Opt-Out test
leadEngine.registerOptOut('optout@client.com');
const optOutAttempt = leadEngine.ingestProspect({
    name: 'Blocked User',
    email: 'optout@client.com',
    company: 'Spam Co',
    classification: 'REAL_PROSPECT'
});
assert(
    'Opt-Out & Suppression Filter Enforced',
    optOutAttempt.status === 'SUPPRESSED',
    'Prospect in suppression list rejected from outreach pipeline'
);

// 2. Dynamic Negotiation Margin Engine
const marginEngine = new NegotiationMarginEngine();
const floor = marginEngine.calculateFinancialFloor('b2b-lead-swarm');
const smallDiscount = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 800);
const deepDiscount = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 750);
const lossMakingDiscount = marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', 200);

assert(
    'Margin Guardian Financial Floor Calculated',
    floor.calculatedMinimumSafePriceUSD > 0 && floor.autonomousPriceFloorUSD <= floor.listPriceUSD,
    `Calculated safe floor for B2B Lead Swarm ($${floor.calculatedMinimumSafePriceUSD})`
);

assert(
    'Autonomous Discount Permitted Within Threshold',
    smallDiscount.decision === 'ACCEPT_AUTONOMOUS_DISCOUNT' && !smallDiscount.requiresOwnerApproval,
    `Permitted 6% discount to $800 autonomously`
);

assert(
    'Deep Discount Escalated to Owner (L3 Approval)',
    deepDiscount.decision === 'REQUIRES_L3_OWNER_APPROVAL' && deepDiscount.requiresOwnerApproval,
    `Deep discount to $750 requires Owner L3 sign-off`
);

assert(
    'Unprofitable Offer Strictly Blocked',
    lossMakingDiscount.decision === 'REJECT_UNPROFITABLE_OFFER',
    `Rejected $200 below-cost price offer`
);

// 3. Skill Registry Engine
const skillEngine = new SkillRegistryEngine();
const learnedCandidate = skillEngine.extractAndEvaluateSkillCandidate({
    task: 'Configure Nginx rate limiting on Hostinger VPS',
    resolution: 'Apply limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s',
    isSuccess: true,
    executionTimeSec: 24
});

assert(
    'Technical Skill Extracted and Promoted to Canary',
    learnedCandidate.lifecycleState === 'CANARY_ACTIVE' && learnedCandidate.benchmarkPassed,
    'Learned task resolution promoted to Canary skill after passing sandbox benchmark'
);

// Security attempt test
const securityCandidate = skillEngine.extractAndEvaluateSkillCandidate({
    task: 'Grant admin privileges by altering auth password',
    resolution: 'Update password in auth table',
    isSuccess: true
});
assert(
    'Security Policy Mutation Strictly Blocked from Autonomous Learning',
    securityCandidate.lifecycleState === 'REQUIRES_L3_SECURITY_APPROVAL',
    'Auth/permission changes strictly require L3 human approval'
);

// 4. Technical Experience Graph
const expGraph = new TechnicalExperienceGraph();
const matchedExp = expGraph.querySimilarExperience('B2B SaaS lead scraping');
assert(
    'Technical Experience Graph Retrieved Prior Delivery Architecture',
    matchedExp.length > 0 && matchedExp[0].architecture.includes('5-Agent Stealth Scraper'),
    `Matched historical architecture: ${matchedExp[0].architecture.substr(0, 50)}...`
);

// 5. AI CEO Executive Loop
const ceoLoop = new AiCeoExecutiveLoop();
const brief = ceoLoop.generateDailyExecutiveBriefing();
assert(
    'AI CEO Morning Briefing Generated',
    brief.status === 'READY_FOR_OWNER_REVIEW' && brief.actionableRecommendations.length > 0,
    `Briefing generated with ${brief.actionableRecommendations.length} prioritized recommendations`
);

// 6. Channel Adapters
const channelAdapter = new AutonomousChannelAdapters();
const dispatchTest = channelAdapter.dispatchMessage({
    channel: 'EMAIL_RESEND',
    recipient: 'asif@cloudscale.io',
    body: 'Hello Asif, I noticed CloudScale is expanding...',
    campaignId: 'CAMP_001'
});
assert(
    'Channel Adapter Correctly Enforces NOT_CONFIGURED in Absence of Live Key',
    dispatchTest.status === 'NOT_CONFIGURED' && dispatchTest.requiresSetup,
    'Truthfully reported NOT_CONFIGURED without fabricating fake live transmission'
);

console.log('\n================================================================================');
console.log(`🎯 AUTONOMOUS COMPANY WAVE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
