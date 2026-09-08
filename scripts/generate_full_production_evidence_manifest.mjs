/**
 * IINSHA AI-BOS — Full Production Evidence Manifest Compiler
 *
 * IMPORTANT:
 * This compiler records evidence; it must never manufacture verification.
 * A repository checkout proves source identity only. Runtime/deployment/payment
 * claims require explicit external evidence supplied by the certification pipeline.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const criticalFiles = [
    'index.html',
    'store.html',
    'portal.html',
    'admin.html',
    'app.js',
    'functions/_middleware.js',
    'functions/api/payments/checkout.js',
    'functions/api/payments/return.js',
    'functions/api/payments/webhook.js',
    'functions/api/payments/_middleware.js',
    'CANONICAL_SYSTEM_STATE.json'
];

function git(args) {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function getGitIdentity() {
    const sha = git(['rev-parse', 'HEAD']);
    const branch = process.env.GITHUB_REF_NAME || (() => {
        try {
            const value = git(['branch', '--show-current']);
            return value || 'DETACHED';
        } catch {
            return 'DETACHED';
        }
    })();
    return { sha, branch };
}

const { sha: repositoryHeadSha, branch: checkoutBranch } = getGitIdentity();

const fileHashes = {};
for (const relPath of criticalFiles) {
    if (fs.existsSync(relPath)) {
        const content = fs.readFileSync(relPath);
        fileHashes[relPath] = crypto.createHash('sha256').update(content).digest('hex');
    }
}

const deployedCodeSha = process.env.DEPLOYED_CODE_SHA || null;
const runtimeSha = process.env.RUNTIME_SHA || null;
const runtimeDbRef = process.env.RUNTIME_DB_REF || null;
const cloudflareDeploymentId = process.env.CLOUDFLARE_DEPLOYMENT_ID || null;
const cloudflareDeploymentBranch = process.env.CLOUDFLARE_DEPLOYMENT_BRANCH || null;

const parityChecks = {
    source_to_deployed_code: deployedCodeSha ? repositoryHeadSha === deployedCodeSha : false,
    deployed_to_runtime: deployedCodeSha && runtimeSha ? deployedCodeSha === runtimeSha : false,
    runtime_to_database: runtimeDbRef === 'kitwadizsvjmuxkfewxj',
};

const manifest = {
    platform: 'IINSHA AI-BOS Autonomous Company OS',
    manifest_id: `EVD-MANIFEST-${Date.now().toString(36).toUpperCase()}`,
    generated_at: new Date().toISOString(),
    provenance: {
        evidence_compiler: 'scripts/generate_full_production_evidence_manifest.mjs',
        repository_head_sha: repositoryHeadSha,
        checkout_branch: checkoutBranch,
        source_of_truth: 'git-checkout',
    },
    canonical_repository: 'https://github.com/adnin4/inshatech.git',
    canonical_branch: 'master',
    database_project_ref: 'kitwadizsvjmuxkfewxj',
    deployment: {
        cloudflare_deployment_id: cloudflareDeploymentId,
        deployment_branch: cloudflareDeploymentBranch,
        deployed_code_sha: deployedCodeSha,
        runtime_sha: runtimeSha,
        runtime_db_ref: runtimeDbRef,
        source_to_deployed_code_parity: parityChecks.source_to_deployed_code,
        deployed_to_runtime_parity: parityChecks.deployed_to_runtime,
        runtime_to_database_parity: parityChecks.runtime_to_database,
    },
    critical_file_checksums: fileHashes,
    verification_policy: {
        rule: 'No file presence, static assertion, or generated report is sufficient to certify production.',
        external_runtime_proof_required: true,
        live_payment_proof_required_for_revenue: true,
        real_customer_proof_required_for_revenue: true,
    },
    test_verification_matrix: {
        system_claims_classification: { status: 'UNVERIFIED' },
        business_truth_gates: { status: 'UNVERIFIED' },
        enterprise_security_gate: { status: 'UNVERIFIED' },
        public_site_e2e_surface: { status: 'UNVERIFIED' },
        ui_ux_regression_guardian: { status: 'UNVERIFIED' },
        payment_hardening_contract: { status: 'UNVERIFIED' },
        tenant_isolation_adversarial: { status: 'UNVERIFIED' },
        disaster_recovery_rollback_drill: { status: 'UNVERIFIED' },
        golden_e2e_master_suite: { status: 'UNVERIFIED' },
        frontier_master_suite: { status: 'UNVERIFIED' },
    },
    certification_ladder: {
        ready_for_staging: true,
        staging_verified: false,
        production_candidate: false,
        production_verified: false,
        revenue_operational: false,
        autonomous_operational: false,
        reason: 'This manifest contains source/release evidence only. Runtime, payment, customer, finance, and autonomous certification require independently captured evidence.',
    },
};

const outDir = path.resolve('docs', 'production');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
    path.join(outDir, 'FULL_PRODUCTION_EVIDENCE_MANIFEST.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
);

const md = [
    '# IINSHA AI-BOS: FULL PRODUCTION EVIDENCE MANIFEST',
    '',
    `* **Manifest ID:** ${manifest.manifest_id}`,
    `* **Generated At:** ${manifest.generated_at}`,
    `* **Repository HEAD SHA:** ${manifest.provenance.repository_head_sha}`,
    `* **Checkout Branch:** ${manifest.provenance.checkout_branch}`,
    `* **Canonical Branch:** ${manifest.canonical_branch}`,
    `* **Canonical Database:** ${manifest.database_project_ref}`,
    '',
    '## Release / Runtime Evidence',
    `- Deployed code SHA: ${manifest.deployment.deployed_code_sha ?? 'UNVERIFIED'}`,
    `- Runtime SHA: ${manifest.deployment.runtime_sha ?? 'UNVERIFIED'}`,
    `- Cloudflare deployment ID: ${manifest.deployment.cloudflare_deployment_id ?? 'UNVERIFIED'}`,
    `- Cloudflare deployment branch: ${manifest.deployment.deployment_branch ?? 'UNVERIFIED'}`,
    `- Source → deployed parity: ${manifest.deployment.source_to_deployed_code_parity ? 'PASS' : 'UNVERIFIED'}`,
    `- Deployed → runtime parity: ${manifest.deployment.deployed_to_runtime_parity ? 'PASS' : 'UNVERIFIED'}`,
    `- Runtime → database parity: ${manifest.deployment.runtime_to_database_parity ? 'PASS' : 'UNVERIFIED'}`,
    '',
    '## Certification Truth Rule',
    '- Generated artifacts never self-certify production.',
    '- External runtime evidence is mandatory for production parity.',
    '- Real payment and real customer evidence are mandatory for Revenue Operational.',
    '- Autonomous Operational requires every preceding gate plus governed human override and kill-switch evidence.',
    '',
    '## Current Certification',
    '- READY_FOR_STAGING: TRUE',
    '- STAGING_VERIFIED: FALSE',
    '- PRODUCTION_CANDIDATE: FALSE',
    '- PRODUCTION_VERIFIED: FALSE',
    '- REVENUE_OPERATIONAL: FALSE',
    '- AUTONOMOUS_OPERATIONAL: FALSE',
    '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'FULL_PRODUCTION_EVIDENCE_MANIFEST.md'), `${md}\n`, 'utf8');
console.log(`Generated production evidence manifest for ${repositoryHeadSha}`);
