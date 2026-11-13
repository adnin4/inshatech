import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';

const tests = [
  { name: 'node --check app.js', cmd: 'node', args: ['--check', 'app.js'] },
  { name: 'npm run build', cmd: 'npm.cmd', args: ['run', 'build'] },
  { name: 'npm test', cmd: 'npm.cmd', args: ['test'] },
  { name: 'node scripts/test_admin_auth_security.mjs', cmd: 'node', args: ['scripts/test_admin_auth_security.mjs'] },
  { name: 'node scripts/test_payment_adversarial_suite.mjs', cmd: 'node', args: ['scripts/test_payment_adversarial_suite.mjs'] },
  { name: 'node scripts/test_sslcommerz_native_adapter.mjs', cmd: 'node', args: ['scripts/test_sslcommerz_native_adapter.mjs'] },
  { name: 'node scripts/test_payment_hardening_contract.mjs', cmd: 'node', args: ['scripts/test_payment_hardening_contract.mjs'] },
  { name: 'node scripts/test_service_authority_and_pricing.mjs', cmd: 'node', args: ['scripts/test_service_authority_and_pricing.mjs'] },
  { name: 'node scripts/verify_payment_reconciliation.mjs', cmd: 'node', args: ['scripts/verify_payment_reconciliation.mjs'] },
  { name: 'node scripts/check_functions_imports.mjs', cmd: 'node', args: ['scripts/check_functions_imports.mjs'] },
  { name: 'node scripts/total_defect_scanner.mjs', cmd: 'node', args: ['scripts/total_defect_scanner.mjs'] },
  { name: 'node scripts/verify_deploy_artifact.mjs', cmd: 'node', args: ['scripts/verify_deploy_artifact.mjs'] },
  { name: 'npm run security:gate', cmd: 'npm.cmd', args: ['run', 'security:gate'] },
  { name: 'npm run e2e', cmd: 'npm.cmd', args: ['run', 'e2e'] },
  { name: 'node scripts/ci_evidence_runner.mjs', cmd: 'node', args: ['scripts/ci_evidence_runner.mjs'] },
  { name: 'node scripts/verify_handoff_docs.mjs', cmd: 'node', args: ['scripts/verify_handoff_docs.mjs'] }
];

console.log('================================================================================');
console.log('IINSHA AI-BOS — V7 MANDATORY TEST SUITE EXECUTION');
console.log('================================================================================');

const results = [];
let allPassed = true;

for (const t of tests) {
  const startTime = Date.now();
  console.log(`\n>>> EXECUTING: ${t.name}`);
  const res = spawnSync(t.cmd, t.args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: true,
    timeout: 120000
  });
  const duration = Date.now() - startTime;
  const passed = res.status === 0;
  if (!passed) allPassed = false;

  console.log(`Status: ${passed ? 'PASS' : 'FAIL'} (exit ${res.status}) in ${duration}ms`);
  if (res.stdout) {
    const lines = res.stdout.trim().split('\n');
    console.log(`Output: ${lines.slice(0, 5).join(' | ')}${lines.length > 5 ? ' ... ' + lines.slice(-2).join(' | ') : ''}`);
  }
  if (res.stderr && res.status !== 0) {
    console.log(`Error: ${res.stderr.trim().slice(0, 300)}`);
  }

  results.push({
    test: t.name,
    exitCode: res.status,
    status: passed ? 'PASS' : 'FAIL',
    durationMs: duration,
    outputSummary: res.stdout ? res.stdout.trim().split('\n').pop() : ''
  });
}

console.log('\n================================================================================');
console.log(`SUMMARY: ${results.filter(r => r.status === 'PASS').length}/${results.length} PASSED`);
console.log('================================================================================');
results.forEach(r => {
  console.log(`${r.status.padEnd(6)} | exit ${r.exitCode} | ${r.durationMs.toString().padStart(6)}ms | ${r.test}`);
});

writeFileSync('docs/IINSHA_V7_TEST_EXECUTION_RESULTS.json', JSON.stringify({
  timestamp: new Date().toISOString(),
  allPassed,
  totalTests: results.length,
  passCount: results.filter(r => r.status === 'PASS').length,
  failCount: results.filter(r => r.status === 'FAIL').length,
  results
}, null, 2));

if (!allPassed) {
  process.exit(1);
}
