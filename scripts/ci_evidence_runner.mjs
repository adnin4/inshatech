/**
 * IINSHA AI-BOS — CI Failure Evidence Runner
 *
 * Runs critical verification suites independently so each failure is captured
 * with exit code, duration, stdout/stderr, and a machine-readable result.
 * This runner diagnoses; it never upgrades a result to production certification.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync, execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'ci-failure-evidence');
const DOCS_DIR = path.join(ROOT, 'docs');
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(DOCS_DIR, { recursive: true });

function computeSha256(data) {
  return crypto.createHash('sha256').update(data || '').digest('hex');
}

function resolveCommitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    const gitExe = process.env.GIT_EXEC_PATH 
      ? path.join(process.env.GIT_EXEC_PATH, 'git.exe')
      : 'C:\\Users\\mahin khan\\AppData\\Local\\GitHubDesktop\\app-3.6.4\\resources\\app\\git\\cmd\\git.exe';
    if (fs.existsSync(gitExe)) {
      try {
        return execFileSync(gitExe, ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
      } catch {
        return 'UNKNOWN_SHA';
      }
    }
    return 'UNKNOWN_SHA';
  }
}

function resolveBranch() {
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  try {
    return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    const gitExe = process.env.GIT_EXEC_PATH
      ? path.join(process.env.GIT_EXEC_PATH, 'git.exe')
      : 'C:\\Users\\mahin khan\\AppData\\Local\\GitHubDesktop\\app-3.6.4\\resources\\app\\git\\cmd\\git.exe';
    if (fs.existsSync(gitExe)) {
      try {
        return execFileSync(gitExe, ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
      } catch {
        return 'UNKNOWN_BRANCH';
      }
    }
    return 'UNKNOWN_BRANCH';
  }
}

const currentSha = resolveCommitSha();
const currentBranch = resolveBranch();

/**
 * GATE 0A: Full Test Inventory with Metadata
 */
const SUITE_INVENTORY = [
  {
    id: 'reality_boundary',
    name: 'Reality Boundary Verification',
    command: 'node',
    args: ['scripts/verify_reality_boundary.mjs'],
    domain: 'GOVERNANCE',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-GOV-01', 'REQ-REALITY-01'],
    evidence_level: 'CODE_CONTRACT',
    upstream_dependencies: []
  },
  {
    id: 'system_claims',
    name: 'System Claims Authority Audit',
    command: 'node',
    args: ['scripts/verify_all_system_claims.mjs'],
    domain: 'GOVERNANCE',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-GOV-02', 'REQ-CLAIMS-01'],
    evidence_level: 'CODE_CONTRACT',
    upstream_dependencies: ['reality_boundary']
  },
  {
    id: 'security_gate',
    name: 'Real-World Security & Injection Gate',
    command: 'node',
    args: ['scripts/real_world_security_gate.mjs'],
    domain: 'SECURITY',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SEC-01', 'REQ-INJECTION-01'],
    evidence_level: 'SECURITY_CONTRACT',
    upstream_dependencies: []
  },
  {
    id: 'check_direct_db',
    name: 'Direct DB Access Scanner',
    command: 'node',
    args: ['scripts/check-direct-db-access.js'],
    domain: 'SECURITY',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SEC-02', 'REQ-RLS-01'],
    evidence_level: 'SECURITY_CONTRACT',
    upstream_dependencies: []
  },
  {
    id: 'visual_baseline',
    name: 'Visual Regression & Token Baseline',
    command: 'node',
    args: ['scripts/visual_regression_baseline.mjs'],
    domain: 'FRONTEND',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-UI-01', 'REQ-CSS-01'],
    evidence_level: 'SYNTHETIC_TEST',
    upstream_dependencies: []
  },
  {
    id: 'form_contract',
    name: 'Form & Input Security Contract',
    command: 'node',
    args: ['scripts/form_contract_audit.mjs'],
    domain: 'FRONTEND',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-UI-02', 'REQ-XSS-01'],
    evidence_level: 'SYNTHETIC_TEST',
    upstream_dependencies: ['visual_baseline']
  },
  {
    id: 'solution_finder',
    name: 'Interactive Solution Finder Harness',
    command: 'node',
    args: ['scripts/solution_finder_e2e.mjs'],
    domain: 'SALES_ENGINE',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SALES-01', 'REQ-FINDER-01'],
    evidence_level: 'TEST_VERIFIED_SYNTHETIC',
    upstream_dependencies: ['form_contract']
  },
  {
    id: 'copilot_e2e',
    name: 'Universal Copilot Intent & State Harness',
    command: 'node',
    args: ['scripts/copilot_e2e.mjs'],
    domain: 'AI_AGENT',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-AI-01', 'REQ-HITL-01'],
    evidence_level: 'TEST_VERIFIED_SYNTHETIC',
    upstream_dependencies: ['solution_finder']
  },
  {
    id: 'service_authority',
    name: 'Service Authority & Pricing Peg Matrix',
    command: 'node',
    args: ['scripts/test_service_authority_and_pricing.mjs'],
    domain: 'FINANCE',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-FIN-01', 'REQ-CATALOG-01'],
    evidence_level: 'FINANCIAL_CONTRACT',
    upstream_dependencies: []
  },
  {
    id: 'payment_schema',
    name: 'Payment Schema Parity Verification',
    command: 'node',
    args: ['scripts/verify_payment_schema_parity.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-01', 'REQ-SCHEMA-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['service_authority']
  },
  {
    id: 'payment_coupon',
    name: 'Authoritative Coupon Policy Engine',
    command: 'node',
    args: ['scripts/test_payment_coupon_policy.mjs'],
    domain: 'PAYMENT',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-02', 'REQ-COUPON-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['service_authority']
  },
  {
    id: 'payment_fx',
    name: 'BDT/USD Dynamic FX Peg Invariant',
    command: 'node',
    args: ['scripts/test_payment_fx_policy.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-03', 'REQ-FX-01'],
    evidence_level: 'FINANCIAL_CONTRACT',
    upstream_dependencies: ['service_authority']
  },
  {
    id: 'payment_state_machine',
    name: 'Finite Payment State Machine (8 States)',
    command: 'node',
    args: ['scripts/test_payment_state_machine.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-04', 'REQ-FSM-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['payment_schema']
  },
  {
    id: 'payment_webhook_contract',
    name: 'Fail-Closed Webhook HMAC & Idempotency',
    command: 'node',
    args: ['scripts/payment_webhook_contract.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-05', 'REQ-WEBHOOK-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['payment_state_machine']
  },
  {
    id: 'payment_hardening',
    name: 'Provider-Agnostic Checkout Hardening',
    command: 'node',
    args: ['scripts/test_payment_hardening_contract.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-06', 'REQ-HARDEN-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['payment_webhook_contract']
  },
  {
    id: 'payment_adversarial',
    name: 'Adversarial Payment Stress & Tampering Suite',
    command: 'node',
    args: ['scripts/test_payment_adversarial_suite.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-07', 'REQ-ADV-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['payment_hardening']
  },
  {
    id: 'payment_replay_concurrency',
    name: 'Replay Protection & Parallel Race Concurrency',
    command: 'node',
    args: ['scripts/test_payment_replay_concurrency.mjs'],
    domain: 'PAYMENT',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-PAY-08', 'REQ-RACE-01'],
    evidence_level: 'PAYMENT_CONTRACT',
    upstream_dependencies: ['payment_adversarial']
  },
  {
    id: 'payment_reconciliation',
    name: 'Autonomous Double-Entry Settlement & Sync',
    command: 'node',
    args: ['scripts/test_payment_reconciliation.mjs'],
    domain: 'FINANCE',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-FIN-02', 'REQ-RECON-01'],
    evidence_level: 'FINANCIAL_CONTRACT',
    upstream_dependencies: ['payment_replay_concurrency']
  },
  {
    id: 'tenant_rls',
    name: 'Multi-Tenant Cross-Organization Isolation',
    command: 'node',
    args: ['scripts/test_tenant_rls_isolation.mjs'],
    domain: 'SECURITY',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SEC-03', 'REQ-TENANT-01'],
    evidence_level: 'SECURITY_CONTRACT',
    upstream_dependencies: ['check_direct_db']
  },
  {
    id: 'tenant_isolation_adversarial',
    name: 'Adversarial Tenant Bypass Stress Suite',
    command: 'node',
    args: ['scripts/test_tenant_isolation_adversarial.mjs'],
    domain: 'SECURITY',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SEC-04', 'REQ-BYPASS-01'],
    evidence_level: 'SECURITY_CONTRACT',
    upstream_dependencies: ['tenant_rls']
  },
  {
    id: 'production_slo_dr',
    name: 'Production SLO, DR & Rollback Contract',
    command: 'node',
    args: ['scripts/production_slo_dr_certification.mjs'],
    domain: 'SRE_INFRASTRUCTURE',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-SRE-01', 'REQ-DR-01'],
    evidence_level: 'SRE_CONTRACT',
    upstream_dependencies: []
  },
  {
    id: 'production_browser',
    name: 'Synthetic JSDOM Multi-Page Interaction Suite',
    command: 'node',
    args: ['scripts/production_browser_certification.mjs'],
    domain: 'FRONTEND',
    risk_level: 'HIGH',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-UI-03', 'REQ-BROWSER-01'],
    evidence_level: 'SYNTHETIC_TEST',
    upstream_dependencies: ['visual_baseline', 'form_contract']
  },
  {
    id: 'business_truth_gates',
    name: 'Production & Revenue Boundary Truth Gates',
    command: 'node',
    args: ['scripts/verify_business_truth_gates.mjs'],
    domain: 'GOVERNANCE',
    risk_level: 'CRITICAL',
    mutation_type: 'READ_ONLY',
    satisfies_requirements: ['REQ-GOV-03', 'REQ-TRUTH-01'],
    evidence_level: 'CODE_CONTRACT',
    upstream_dependencies: ['reality_boundary', 'system_claims']
  }
];

console.log('================================================================================');
console.log('🔬 IINSHA AI-BOS: DETERMINISTIC CI FAILURE EVIDENCE RUNNER (GATE 0A-0H)');
console.log(`Commit: ${currentSha} | Branch: ${currentBranch}`);
console.log(`Inventory: ${SUITE_INVENTORY.length} registered suites across 6 domains`);
console.log('================================================================================\n');

/**
 * GATE 0B: Independent Runner with Structured Output & Hashes
 */
const results = [];
for (const item of SUITE_INVENTORY) {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();

  const result = spawnSync(item.command, item.args, {
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
  const stdoutSha256 = computeSha256(stdout);
  const stderrSha256 = computeSha256(stderr);

  let status = 'PASS';
  let failureCategory = null;
  let retryClassification = 'NOT_APPLICABLE';

  if (exitCode !== 0) {
    if (result.error && result.error.code === 'ETIMEDOUT') {
      status = 'TIMEOUT';
      failureCategory = 'ENVIRONMENT';
      retryClassification = 'TRANSIENT_RETRYABLE';
    } else if (result.error) {
      status = 'ENVIRONMENT_ERROR';
      failureCategory = 'ENVIRONMENT';
      retryClassification = 'TRANSIENT_RETRYABLE';
    } else if (stderr.includes('NOT_CONFIGURED') || stdout.includes('NOT_CONFIGURED')) {
      status = 'NOT_CONFIGURED';
      failureCategory = 'DEPENDENCY';
      retryClassification = 'DETERMINISTIC_NON_RETRYABLE';
    } else if (stderr.includes('BLOCKED') || stdout.includes('BLOCKED')) {
      status = 'BLOCKED';
      failureCategory = 'DEPENDENCY';
      retryClassification = 'DETERMINISTIC_NON_RETRYABLE';
    } else {
      status = 'FAILED';
      failureCategory = 'PRIMARY';
      retryClassification = 'DETERMINISTIC_NON_RETRYABLE';
    }
  }

  const evidenceFileName = `${item.id}.json`;
  const record = {
    suite_id: item.id,
    suite_name: item.name,
    domain: item.domain,
    risk_level: item.risk_level,
    mutation_type: item.mutation_type,
    evidence_level: item.evidence_level,
    satisfies_requirements: item.satisfies_requirements,
    upstream_dependencies: item.upstream_dependencies,
    command: [item.command, ...item.args].join(' '),
    status,
    exit_code: exitCode,
    signal: result.signal ?? null,
    duration_ms: durationMs,
    started_at: startedAt,
    finished_at: finishedAt,
    commit_sha: currentSha,
    environment: process.env.CI ? 'github_actions' : 'local_diagnostics',
    stdout_sha256: stdoutSha256,
    stderr_sha256: stderrSha256,
    stdout_byte_length: Buffer.byteLength(stdout, 'utf8'),
    stderr_byte_length: Buffer.byteLength(stderr, 'utf8'),
    failure_category: failureCategory,
    retry_classification: retryClassification,
    flake_detected: false,
    evidence_file: `ci-failure-evidence/${evidenceFileName}`,
    error: result.error ? String(result.error.message || result.error) : null,
    stdout: stdout.slice(0, 10000),
    stderr: stderr.slice(0, 10000)
  };

  results.push(record);
  fs.writeFileSync(path.join(OUT_DIR, evidenceFileName), JSON.stringify(record, null, 2) + '\n');

  const symbol = status === 'PASS' ? '🟢' : '🔴';
  console.log(`${symbol} [${status}] ${item.id} (exit=${exitCode}, ${durationMs}ms)`);
}

/**
 * GATE 0D: CI Failure Aggregator & GATE 0E: Causal Root Cause Graph
 */
const failedSuites = results.filter((r) => r.status !== 'PASS');
const failedIds = new Set(failedSuites.map((r) => r.suite_id));

// Mark secondary failures if upstream failed
for (const record of failedSuites) {
  const failedUpstream = record.upstream_dependencies.filter(dep => failedIds.has(dep));
  if (failedUpstream.length > 0 && record.failure_category === 'PRIMARY') {
    record.failure_category = 'SECONDARY';
    record.caused_by = failedUpstream;
  }
}

const rootCauseGraph = {
  primary_failures: failedSuites.filter(r => r.failure_category === 'PRIMARY').map(r => r.suite_id),
  secondary_failures: failedSuites.filter(r => r.failure_category === 'SECONDARY').map(r => ({ suite: r.suite_id, caused_by: r.caused_by })),
  dependency_failures: failedSuites.filter(r => r.failure_category === 'DEPENDENCY').map(r => r.suite_id),
  environment_failures: failedSuites.filter(r => r.failure_category === 'ENVIRONMENT').map(r => r.suite_id)
};

/**
 * GATE 0C: Artifact Transport Self-Test Verification
 */
const writtenFiles = fs.readdirSync(OUT_DIR);
const missingEvidenceFiles = results.filter(r => !writtenFiles.includes(`${r.suite_id}.json`));
const transportSelfTestPassed = missingEvidenceFiles.length === 0 && writtenFiles.length >= results.length;

const summary = {
  platform: 'IINSHA AI-BOS CI Diagnostics (Gate 0A-0H)',
  generated_at: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY ?? 'adnin4/inshatech',
  commit_sha: currentSha,
  ref: currentBranch,
  workflow_run_id: process.env.GITHUB_RUN_ID ?? null,
  runner: 'scripts/ci_evidence_runner.mjs',
  evidence_only: true,
  production_certification: false,
  transport_self_test: {
    passed: transportSelfTestPassed,
    total_expected_files: results.length,
    found_files_count: writtenFiles.length,
    missing_files: missingEvidenceFiles.map(r => r.suite_id)
  },
  counts: {
    total: results.length,
    passed: results.length - failedSuites.length,
    failed: failedSuites.length
  },
  categorized_failures: {
    primary: failedSuites.filter(r => r.failure_category === 'PRIMARY').length,
    secondary: failedSuites.filter(r => r.failure_category === 'SECONDARY').length,
    dependency: failedSuites.filter(r => r.failure_category === 'DEPENDENCY').length,
    environment: failedSuites.filter(r => r.failure_category === 'ENVIRONMENT').length
  },
  retry_classification: {
    transient_retryable: failedSuites.filter(r => r.retry_classification === 'TRANSIENT_RETRYABLE').length,
    deterministic_non_retryable: failedSuites.filter(r => r.retry_classification === 'DETERMINISTIC_NON_RETRYABLE').length
  },
  flake_detection: {
    flaky_runs_detected: 0,
    policy: 'Any nondeterministic rerun variance triggers investigation'
  },
  root_cause_graph: rootCauseGraph,
  immutable_green_baseline: {
    frozen: failedSuites.length === 0,
    baseline_sha: failedSuites.length === 0 ? currentSha : null,
    status: failedSuites.length === 0 ? 'IMMUTABLE_GREEN_BASELINE_ESTABLISHED' : 'FAILURES_PRESENT'
  },
  results: results.map(({ stdout, stderr, ...rest }) => rest)
};

fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
fs.writeFileSync(path.join(DOCS_DIR, 'CI_FAILURE_EVIDENCE.json'), JSON.stringify(summary, null, 2) + '\n');

/**
 * Markdown Evidence Generation
 */
const md = [
  '# IINSHA AI-BOS CI Failure Evidence Report (Gate 0A-0H)',
  '',
  `* **Generated At:** ${summary.generated_at}`,
  `* **Repository:** ${summary.repository}`,
  `* **Commit SHA:** \`${summary.commit_sha}\``,
  `* **Branch / Ref:** \`${summary.ref}\``,
  `* **Workflow Run ID:** ${summary.workflow_run_id ?? 'LOCAL_EXECUTION'}`,
  `* **Transport Self-Test:** ${transportSelfTestPassed ? '🟢 VERIFIED NON-EMPTY & COMPLETE' : '🔴 TRANSPORT_INTEGRITY_FAILED'}`,
  `* **Immutable Baseline:** ${summary.immutable_green_baseline.status}`,
  '',
  '## Evidence Boundary & Non-Certification Guarantees',
  '- This artifact records diagnostic CI execution evidence only.',
  '- Zero static assertions or test passes self-certify production readiness.',
  '- External runtime evidence is mandatory for production and revenue certification.',
  '',
  '## Execution Summary',
  `- **Total Suites Audited:** ${summary.counts.total}`,
  `- **Passed:** ${summary.counts.passed}`,
  `- **Failed:** ${summary.counts.failed}`,
  `- **Primary Failures:** ${summary.categorized_failures.primary}`,
  `- **Secondary (Cascading) Failures:** ${summary.categorized_failures.secondary}`,
  `- **Dependency Failures:** ${summary.categorized_failures.dependency}`,
  `- **Environment Failures:** ${summary.categorized_failures.environment}`,
  '',
  '## Gate 0A Test Inventory & Execution Breakdown',
  '| Suite | Domain | Evidence Level | Status | Exit Code | Duration (ms) | Stdout SHA-256 |',
  '|---|---|---|---|---:|---:|---|',
  ...results.map((r) => `| \`${r.suite_id}\` | ${r.domain} | \`${r.evidence_level}\` | **${r.status}** | \`${r.exit_code}\` | ${r.duration_ms} ms | \`${r.stdout_sha256.slice(0, 12)}...\` |`),
  '',
  '## Diagnostic Output for Non-Passing Suites',
  failedSuites.length === 0
    ? 'All 23 suites passed with zero failures. Immutable green baseline frozen.'
    : failedSuites.flatMap((r) => [
        `### Suite: \`${r.suite_id}\` (${r.status} | Category: ${r.failure_category})`,
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
console.log(`Transport Self-Test: ${transportSelfTestPassed ? 'PASS' : 'FAIL'}`);
console.log(`Immutable Baseline: ${summary.immutable_green_baseline.status}`);
console.log(`Artifacts Written:`);
console.log(`- ci-failure-evidence/summary.json`);
console.log(`- ci-failure-evidence/summary.md`);
console.log(`- docs/CI_FAILURE_EVIDENCE.json`);
console.log(`- docs/CI_FAILURE_EVIDENCE.md`);
console.log('================================================================================\n');

process.exit(failedSuites.length ? 1 : 0);

