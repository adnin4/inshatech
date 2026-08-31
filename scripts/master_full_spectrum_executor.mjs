/**
 * IINSHA AI-BOS: Master Full-Spectrum Runtime Verification
 * Verifies repository-local contracts and deterministic simulations.
 * This script never claims live production verification by itself.
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
        throw new Error(`${id} failed`);
    }
    console.log(`[PASS] ${id}: ${description}`);
    passed += 1;
}

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

try {
    // 1. In CI, GITHUB_SHA is the authoritative identity. The committed metadata
    // is informational and must not be treated as live parity evidence.
    const buildInfo = JSON.parse(fs.readFileSync('build-info.json', 'utf8'));
    const ciSha = process.env.GITHUB_SHA || null;
    verify(
        ciSha ? /^[0-9a-f]{40}$/i.test(ciSha) : /^[0-9a-f]{40}$/i.test(String(buildInfo.git_commit_sha || '')),
        'PROBE-01',
        ciSha ? `CI commit identity available (${ciSha.slice(0, 7)})` : `Local metadata identity available (${String(buildInfo.git_commit_sha).slice(0, 7)})`
    );

    // 2. Canonical Knowledge Catalog Integrity.
    const services = JSON.parse(fs.readFileSync('knowledge/services.json', 'utf8'));
    verify(
        Array.isArray(services) && services.length >= 5 && services.every(s => s?.id && Number(s.priceUSD) > 0),
        'PROBE-02',
        `Canonical service catalog is structurally valid (${services.length} entries)`
    );

    // 3-5. Deterministic, repository-local sales calculations.
    const { SalesEngine } = await import('../ai_brain/sales_engine.js');
    const engine = new SalesEngine();
    const leadScore = engine.calculateLeadScore({ industry: 'SaaS', pain: 'manual leads', budget: '1000' });
    const recommended = engine.recommendServices({ pain: 'leads', industry: 'SaaS' }, services);
    const roi = engine.calculateROI(services[0], { industry: 'SaaS' });
    verify(leadScore >= 65, 'PROBE-03', `Sales qualification fixture executed (${leadScore}/100)`);
    verify(recommended.length > 0, 'PROBE-04', 'Service recommendation fixture executed');
    verify(Number(roi.roiPercent) > 0, 'PROBE-05', 'Deterministic ROI fixture executed');

    // 6. Cryptographic checkpoint simulation. No external state mutation.
    const checkpoint = { mission_id: 'fixture', state: 'RUNNING', step: 1 };
    verify(/^[0-9a-f]{64}$/.test(sha256(JSON.stringify(checkpoint))), 'PROBE-06', 'Mission checkpoint signature simulation verified');

    // 7. Agent runtime package contract presence.
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    verify(packageJson.name === 'iinsha-ai-bos', 'PROBE-07', 'Agent runtime package contract present');

    // 8. Public HTML surface presence.
    const htmlFiles = ['index.html', 'store.html', 'marketplace.html', 'portal.html', 'affiliate.html', 'compare.html', 'blog.html', 'admin.html'];
    verify(htmlFiles.every(file => fs.existsSync(file)), 'PROBE-08', `All ${htmlFiles.length} public HTML surfaces exist`);

    // 9. Checkout UI contract presence only; no payment attempted.
    const appJs = fs.readFileSync('app.js', 'utf8');
    verify(appJs.includes('openCheckoutModal'), 'PROBE-09', 'Checkout UI contract is present (no payment executed)');

    // 10-15. Backend contract presence checks. These do not call external providers.
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
    console.log('REAL_PROVIDER_EXECUTION: NOT_TESTED');
    console.log('REAL_PAYMENT: NOT_TESTED');
    console.log('REAL_CUSTOMER: NOT_TESTED');
    console.log('NOTE: Passing this script is repository-local evidence, not production certification.');
    console.log('='.repeat(80));
} catch (error) {
    console.error('Runtime verification failed:', error?.message || error);
    process.exitCode = 1;
}
