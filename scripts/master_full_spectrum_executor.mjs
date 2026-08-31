/**
 * IINSHA AI-BOS: Master Full-Spectrum Runtime Verification
 * Verifies repository-local contracts and controlled simulation invariants.
 * This script MUST NOT claim production/live verification by itself.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

console.log('='.repeat(80));
console.log('IINSHA AI-BOS: MASTER FULL-SPECTRUM RUNTIME VERIFICATION');
console.log('='.repeat(80));

let passed = 0;
const total = 15;

function verify(condition, id, description) {
    if (!condition) {
        console.error(`[FAIL] ${id}: ${description}`);
        process.exitCode = 1;
        throw new Error(`${id} failed`);
    }
    console.log(`[PASS] ${id}: ${description}`);
    passed += 1;
}

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

try {
    // 1. Source/build identity. In CI, the runner-provided GITHUB_SHA is authoritative.
    const buildInfo = JSON.parse(fs.readFileSync('build-info.json', 'utf8'));
    const expectedSha = process.env.GITHUB_SHA || buildInfo.git_commit_sha;
    const embeddedSha = buildInfo.git_commit_sha;
    verify(
        typeof expectedSha === 'string' && /^[0-9a-f]{40}$/i.test(expectedSha),
        'PROBE-01',
        `Repository build identity is present (${expectedSha.slice(0, 7)})`
    );
    if (process.env.GITHUB_SHA) {
        verify(
            embeddedSha.toLowerCase() === process.env.GITHUB_SHA.toLowerCase(),
            'PROBE-01B',
            'Committed build-info SHA matches the current CI commit'
        );
    }

    // 2. Canonical service catalog integrity.
    const services = JSON.parse(fs.readFileSync('knowledge/services.json', 'utf8'));
    verify(
        Array.isArray(services) && services.length >= 5 && services.every(s => s?.id && Number(s.priceUSD) > 0),
        'PROBE-02',
        `Canonical service catalog is structurally valid (${services.length} entries)`
    );

    // 3-5. Sales calculations executed locally with deterministic fixture data.
    const { SalesEngine } = await import('../ai_brain/sales_engine.js');
    const engine = new SalesEngine();
    const leadScore = engine.calculateLeadScore({ industry: 'SaaS', pain: 'manual leads', budget: '1000' });
    const recommended = engine.recommendServices({ pain: 'leads', industry: 'SaaS' }, services);
    const roi = engine.calculateROI(services[0], { industry: 'SaaS' });
    verify(leadScore >= 65, 'PROBE-03', `Sales qualification fixture executed (${leadScore}/100)`);
    verify(recommended.length > 0, 'PROBE-04', 'Service recommendation fixture executed');
    verify(Number(roi.roiPercent) > 0, 'PROBE-05', 'Deterministic ROI fixture executed');

    // 6. Cryptographic checkpoint simulation; no external state mutation.
    const missionCheckpoint = { mission_id: 'fixture', state: 'RUNNING', step: 1 };
    const checkpointSig = sha256(JSON.stringify(missionCheckpoint));
    verify(/^[0-9a-f]{64}$/.test(checkpointSig), 'PROBE-06', 'Mission checkpoint signature simulation verified');

    // 7. Tool gateway configuration presence; not external execution.
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    verify(packageJson.name === 'iinsha-ai-bos', 'PROBE-07', 'Agent runtime package contract present');

    // 8. Public HTML surface presence.
    const htmlFiles = [
        'index.html', 'store.html', 'marketplace.html', 'portal.html',
        'affiliate.html', 'compare.html', 'blog.html', 'admin.html'
    ];
    verify(htmlFiles.every(file => fs.existsSync(file)), 'PROBE-08', `All ${htmlFiles.length} public HTML surfaces exist`);

    // 9. Checkout contract presence only; no payment is attempted.
    const appJs = fs.readFileSync('app.js', 'utf8');
    verify(appJs.includes('openCheckoutModal'), 'PROBE-09', 'Checkout UI contract is present (no payment executed)');

    // 10-15. Backend control-plane contract presence. These are NOT claimed as live execution.
    const contracts = [
        ['PROBE-10', 'functions/api/v1/business/control-tower.js', 'Business control tower contract present'],
        ['PROBE-11', 'functions/api/v1/operations/slo-control.js', 'SLO/cost guardrail contract present'],
        ['PROBE-12', 'functions/api/v1/governance/evaluate.js', 'Governed learning/evaluation contract present'],
        ['PROBE-13', 'functions/api/v1/revenue/customer-success-loop.js', 'Revenue/customer-success contract present'],
        ['PROBE-14', 'functions/api/v1/kernel/orchestrate.js', 'Workflow kernel/evidence contract present'],
        ['PROBE-15', 'functions/api/v1/chaos/resilience-drill.js', 'Resilience-drill contract present']
    ];
    for (const [id, file, description] of contracts) {
        verify(fs.existsSync(path.resolve(file)), id, description);
    }

    console.log('='.repeat(80));
    console.log(`LOCAL_RUNTIME_VERIFIED: ${passed}/${total} probes passed`);
    console.log('LIVE_VERIFICATION: PENDING');
    console.log('PRODUCTION_PAYMENT: NOT_TESTED');
    console.log('REAL_CUSTOMER: NOT_TESTED');
    console.log('REAL_PROVIDER_EXECUTION: NOT_TESTED');
    console.log('NOTE: Passing this script is repository-local evidence, not production certification.');
    console.log('='.repeat(80));
} catch (error) {
    console.error('Runtime verification failed:', error?.message || error);
    process.exitCode = 1;
}
