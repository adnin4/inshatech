/**
 * IINSHA AI-BOS — CI Failure Evidence Runner
 *
 * Runs critical verification suites independently so each failure is captured
 * with exit code, duration, stdout/stderr, and a machine-readable result.
 * This runner diagnoses; it never upgrades a result to production certification.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'ci-failure-evidence');
const DOCS_DIR = path.join(ROOT, 'docs');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(DOCS_DIR, { recursive: true });

function resolveCommitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    const gitExe = 'C:\\Users\\mahin khan\\AppData\\Local\\GitHubDesktop\\app-3.6.4\\resources\\app\\git\\cmd\\git.exe';
    if (fs.existsSync(gitExe)) {
      return execFileSync(gitExe, ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
    }
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'UNKNOWN_SHA';
  }
}

function resolveBranch() {
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    const gitExe = 'C:\\Users\\mahin khan\\AppData\\Local\\GitHubDesktop\\app-3.6.4\\resources\\app\\git\\cmd\\git.exe';
    if (fs.existsSync(gitExe)) {
      return execFileSync(gitExe, ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
    }
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'UNKNOWN_BRANCH';
  }
}

const currentSha = resolveCommitSha();
const currentBranch = resolveBranch();

const suites = [
  ['reality_boundary', ['node', ['scripts/verify_reality_boundary.mjs']]],
  ['system_claims', ['node', ['scripts/verify_all_system_claims.mjs']]],
  ['security_gate', ['node', ['scripts/real_world_security_gate.mjs']]],
  ['check_direct_db', ['node', ['scripts/check-direct-db-access.js']]],
  ['visual_baseline', ['node', ['scripts/visual_regression_baseline.mjs']]],
  ['form_contract', ['node', ['scripts/form_contract_audit.mjs']]],
  ['solution_finder', ['node', ['scripts/solution_finder_e2e.mjs']]],
  ['copilot_e2e', ['node', ['scripts/copilot_e2e.mjs']]],
  ['service_authority', ['node', ['scripts/test_service_authority_and_pricing.mjs']]],
  ['payment_schema', ['node', ['scripts/verify_payment_schema_parity.mjs']]],
  ['payment_coupon', ['node', ['scripts/test_payment_coupon_policy.mjs']]],
  ['payment_fx', ['node', ['scripts/test_payment_fx_policy.mjs']]],
  ['payment_state_machine', ['node', ['scripts/test_payment_state_machine.mjs']]],
  ['payment_webhook_contract', ['node', ['scripts/payment_webhook_contract.mjs']]],
  ['payment_hardening', ['node', ['scripts/test_payment_hardening_contract.mjs']]],
  ['payment_adversarial', ['node', ['scripts/test_payment_adversarial_suite.mjs']]],
  ['payment_replay_concurrency', ['node', ['scripts/test_payment_replay_concurrency.mjs']]],
  ['payment_reconciliation', ['node', ['scripts/test_payment_reconciliation.mjs']]],
  ['tenant_rls', ['node', ['scripts/test_tenant_rls_isolation.mjs']]],
  ['tenant_isolation_adversarial', ['node', ['scripts/test_tenant_isolation_adversarial.mjs']]],
  ['production_slo_dr', ['node', ['scripts/production_slo_dr_certification.mjs']]],
  ['production_browser', ['node', ['scripts/production_browser_certification.mjs']]],
  ['business_truth_gates', ['node', ['scripts/verify_business_truth_gates.mjs']]]
];

console.log('================================================================================');
console.log('🔬 IINSHA AI-BOS: DETERMINISTIC CI FAILURE EVIDENCE RUNNER');
console.log(`Commit: ${currentSha} | Branch: ${currentBranch}`);
console.log('================================================================================\n');

const results = [];
for (const [id, [command, args]] of suites) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();

  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    env: { ...process.env, CI_EVIDENCE_MODE: 'true' },
    maxBuffer: 12 * 1024 * 1024,
  });

  const durationMs = Date.now() - startedMs;
  const finishedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  const stdout = result.stdout ?? '';
  const stderr = result.stderr ?? '';

  let status = 'PASS';
  if (exitCode !== 0) {
    if (result.error && result.error.code === 'ETIMEDOUT') {
      status = 'TIMEOUT';
    } else if (result.error) {
      status = 'ENVIRONMENT_ERROR';
    } else if (stderr.includes('NOT_CONFIGURED') || stdout.includes('NOT_CONFIGURED')) {
      status = 'NOT_CONFIGURED';
    } else if (stderr.includes('BLOCKED') || stdout.includes('BLOCKED')) {
      status = 'BLOCKED';
    } else {
      status = 'FAILED';
    }
  }

  const evidenceFileName = `${id}.json`;
  const record = {
    suite: id,
    test: id,
    command: [command, ...args].join(' '),
    status,
    exit_code: exitCode,
    signal: result.signal ?? null,
    duration_ms: durationMs,
    started_at: startedAt,
    finished_at: finishedAt,
    commit_sha: currentSha,
    environment: process.env.CI ? 'github_actions' : 'local_diagnostics',
    evidence_file: `ci-failure-evidence/${evidenceFileName}`,
    error: result.error ? String(result.error.message || result.error) : null,
    stdout: stdout.slice(0, 10000),
    stderr: stderr.slice(0, 10000)
  };

  results.push(record);
  fs.writeFileSync(path.join(OUT_DIR, evidenceFileName), JSON.stringify(record, null, 2) + '\n');

  const symbol = status === 'PASS' ? '🟢' : '🔴';
  console.log(`${symbol} [${status}] ${id} (exit=${exitCode}, ${durationMs}ms)`);
}

const failed = results.filter((r) => r.status !== 'PASS');
const summary = {
  platform: 'IINSHA AI-BOS CI Diagnostics',
  generated_at: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY ?? 'adnin4/inshatech',
  commit_sha: currentSha,
  ref: currentBranch,
  workflow_run_id: process.env.GITHUB_RUN_ID ?? null,
  runner: 'scripts/ci_evidence_runner.mjs',
  evidence_only: true,
  production_certification: false,
  counts: {
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length
  },
  taxonomy: {
    passed: results.filter(r => r.status === 'PASS').length,
    failed: results.filter(r => r.status === 'FAILED').length,
    blocked: results.filter(r => r.status === 'BLOCKED').length,
    unverified: results.filter(r => r.status === 'UNVERIFIED').length,
    not_configured: results.filter(r => r.status === 'NOT_CONFIGURED').length,
    timeout: results.filter(r => r.status === 'TIMEOUT').length,
    environment_error: results.filter(r => r.status === 'ENVIRONMENT_ERROR').length
  },
  results: results.map(({ stdout, stderr, ...rest }) => rest)
};

fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
fs.writeFileSync(path.join(DOCS_DIR, 'CI_FAILURE_EVIDENCE.json'), JSON.stringify(summary, null, 2) + '\n');

const md = [
  '# IINSHA AI-BOS CI Failure Evidence Report',
  '',
  `* **Generated At:** ${summary.generated_at}`,
  `* **Repository:** ${summary.repository}`,
  `* **Commit SHA:** ${summary.commit_sha}`,
  `* **Branch / Ref:** ${summary.ref}`,
  `* **Workflow Run ID:** ${summary.workflow_run_id ?? 'LOCAL_EXECUTION'}`,
  '',
  '## Evidence Boundary & Non-Certification',
  '- This artifact records diagnostic CI execution evidence only.',
  '- Zero static assertions or test passes self-certify production readiness.',
  '- External runtime evidence is mandatory for production and revenue certification.',
  '',
  '## Execution Summary',
  `- **Total Suites Audited:** ${summary.counts.total}`,
  `- **Passed:** ${summary.counts.passed}`,
  `- **Failed:** ${summary.counts.failed}`,
  '',
  '## Suite Breakdown',
  '| Suite | Status | Exit Code | Duration (ms) | Started At | Finished At |',
  '|---|---|---:|---:|---|---|',
  ...results.map((r) => `| \`${r.suite}\` | **${r.status}** | \`${r.exit_code}\` | ${r.duration_ms} ms | ${r.started_at} | ${r.finished_at} |`),
  '',
  '## Diagnostic Output for Non-Passing Suites',
  failed.length === 0
    ? 'All suites passed with zero failures. Green baseline established.'
    : failed.flatMap((r) => [
        `### Suite: \`${r.suite}\` (${r.status})`,
        '',
        '```text',
        r.stdout.trim() || '(no stdout)',
        r.stderr.trim() || '(no stderr)',
        '```',
        ''
      ]).join('\n')
].join('\n');

fs.writeFileSync(path.join(OUT_DIR, 'summary.md'), md + '\n');
fs.writeFileSync(path.join(DOCS_DIR, 'CI_FAILURE_EVIDENCE.md'), md + '\n');

console.log('\n================================================================================');
console.log(`📊 CI EVIDENCE SUMMARY: ${summary.counts.passed}/${summary.counts.total} SUITES PASSED`);
console.log(`Artifacts Written:`);
console.log(`- ci-failure-evidence/summary.json`);
console.log(`- ci-failure-evidence/summary.md`);
console.log(`- docs/CI_FAILURE_EVIDENCE.json`);
console.log(`- docs/CI_FAILURE_EVIDENCE.md`);
console.log('================================================================================\n');

process.exit(failed.length ? 1 : 0);
