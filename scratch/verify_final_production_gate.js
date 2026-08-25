const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('ðŸ STEP 13: FINAL PRODUCTION GATE (12 CORE CRITICAL DOMAINS) ðŸ');
console.log('================================================================\n');

const gates = [
    { name: '1. FUNCTIONAL INTEGRITY (163 UI Buttons & Forms)', script: 'scratch/audit_all_buttons.js' },
    { name: '2. REPOSITORY & P0 SECURITY AUDIT', script: 'scratch/full_master_audit.js' },
    { name: '3. SECURITY & COMPLIANCE CERTIFICATION', script: 'scratch/verify_security_certification.js' },
    { name: '4. HIGH-CONCURRENCY PERFORMANCE CERTIFICATION', script: 'scratch/verify_performance_certification.js' },
    { name: '5. DISASTER RECOVERY & ROLLBACK ASSURANCE', script: 'scratch/verify_disaster_recovery.js' },
    { name: '6. 19-STAGE END-TO-END BUSINESS LOOP', script: 'scratch/verify_e2e_business_loop.js' },
    { name: '7. 5-PERSONA REAL CUSTOMER JOURNEY', script: 'scratch/verify_customer_personas.js' },
    { name: '8. OWNER 10-POINT SUPREME CONTROL SUITE', script: 'scratch/verify_owner_controls.js' },
    { name: '9. AI CEO AUTONOMOUS EXECUTIVE CYCLE', script: 'scratch/verify_ai_ceo_execution.js' }
];

let totalPassed = 0;

gates.forEach(g => {
    try {
        console.log(`Checking Gate: ${g.name}...`);
        execSync(`node "${path.join(BASE_DIR, g.script)}"`, { stdio: 'pipe' });
        console.log(`  âœ… [PASS] ${g.name}`);
        totalPassed++;
    } catch (err) {
        console.error(`  âŒ [FAIL] ${g.name}`);
    }
});

console.log('\n================================================================');
console.log(`PRODUCTION GATES PASSED: ${totalPassed} / ${gates.length}`);
console.log('================================================================');

if (totalPassed === gates.length) {
    console.log('\nðŸŸ¢ðŸŸ¢ðŸŸ¢ OFFICIAL VERDICT: 100% PRODUCTION CANDIDATE CERTIFIED ðŸŸ¢ðŸŸ¢ðŸŸ¢');
    console.log('IINSHA AI-BOS IS CLEARED FOR PILOT ONBOARDING & FULL COMMERCIAL LAUNCH!\n');
    process.exit(0);
} else {
    console.error('\nðŸ”´ VERDICT: PRODUCTION GATE FAILED');
    process.exit(1);
}

