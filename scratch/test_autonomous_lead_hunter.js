/**
 * IINSHA AI-BOS — Autonomous Lead Hunter Test Suite
 * Tests ICP discovery, personalized bilingual outreach generation, and lead qualification scores.
 */

const { AutonomousLeadHunter } = require('../ai_brain/autonomous_lead_hunter.js');

console.log('================================================================================');
console.log('🎯 TESTING IINSHA AUTONOMOUS LEAD HUNTER & PROSPECTING ENGINE');
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

const hunter = new AutonomousLeadHunter();

// 1. Discover Leads for all ICPs
const discovery = hunter.discoverLeads(null, 5);
assert(
    'Autonomous ICP Discovery & Batch Generation',
    discovery.status === 'DISCOVERY_COMPLETE' && discovery.totalDiscovered === 5,
    `Discovered ${discovery.totalDiscovered} qualified enterprise leads across target ICPs`
);

// 2. Target Industry Specific Prospecting
const b2bDiscovery = hunter.discoverLeads('B2B SaaS', 3);
assert(
    'Industry-Specific Filtering (B2B SaaS)',
    b2bDiscovery.leads.every(l => l.industry.includes('B2B SaaS')),
    `Targeted 3 leads specifically for B2B SaaS Hunter Swarm`
);

// 3. Bilingual Personalized Outreach Verification
const sampleLead = b2bDiscovery.leads[0];
assert(
    'Bilingual Personalized Outreach Generation',
    sampleLead.outreachMessage_EN.includes(sampleLead.name) && 
    sampleLead.outreachMessage_BN.includes('আসসালামু আলাইকুম') &&
    sampleLead.landingUrl.includes('ref=autohunter'),
    `Generated personalized English & Bangla copy containing trackable landing link`
);

// 4. Lead Scoring Invariant
assert(
    'Proprietary Lead Qualification Scoring',
    sampleLead.qualificationScore >= 80 && sampleLead.status === 'QUALIFIED_READY_FOR_OUTREACH',
    `Lead qualification score: ${sampleLead.qualificationScore} (Threshold >= 80)`
);

console.log('\n================================================================================');
console.log(`🎯 LEAD HUNTER ENGINE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================================');

if (failed > 0) process.exit(1);
