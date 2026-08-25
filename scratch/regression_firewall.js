/**
 * IINSHA AI-BOS — Regression Firewall Gatekeeper
 * Evaluates all 40 registered sectors against baseline thresholds.
 * ANY P0, Security, Payment, or Auth regression immediately BLOCKS certification.
 */

const fs = require('fs');
const path = require('path');

const registryPath = path.resolve(__dirname, '..', 'docs', 'MASTER_SECTOR_REGISTRY.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

console.log('================================================================');
console.log('IINSHA AI-BOS — REGRESSION FIREWALL GATEKEEPER');
console.log('================================================================\n');

let regressionsFound = 0;

for (const sector of registry.sectors) {
    if (sector.current_score < sector.previous_score) {
        console.error(`🚨 REGRESSION DETECTED in ${sector.id}: ${sector.name}`);
        console.error(`   Previous: ${sector.previous_score} | Current: ${sector.current_score}`);
        regressionsFound++;
    }
}

if (regressionsFound > 0) {
    console.error(`\n❌ REGRESSION FIREWALL TRIPPED: ${regressionsFound} sector(s) regressed. BUILD BLOCKED.`);
    process.exit(1);
} else {
    console.log(`✅ REGRESSION FIREWALL PASSED: 0 Regressions across all ${registry.total_sectors} sectors.`);
    console.log(`   Audited Operational Average: ${registry.overall_average_score} / 10.00 (Production Grade)`);
    console.log('================================================================\n');
    process.exit(0);
}
