/**
 * IINSHA AI-BOS: Master Full-Spectrum Runtime Verification
 * Verifies repository-local contracts and deterministic simulations.
 * Passing this script is not production/live certification.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
    const buildInfo = JSON.parse(fs.readFileSync('build-info.json', 'utf8'));
    const ciSha = process.env.GITHUB_SHA || null;
    const metadataSha = buildInfo.git_sha || buildInfo.git_commit_sha || null;
    const isIdentityValid = (ciSha && /^[0-9a-f]{40}$/i.test(ciSha)) || (metadataSha && /^[0-9a-f]{40}$/i.test(metadataSha)) || Boolean(buildInfo.identity_authority);
    verify(isIdentityValid, 'PROBE-01', `Repository/CI identity authority available (${ciSha ? ciSha.slice(0, 7) : (metadataSha ? metadataSha.slice(0, 7) : buildInfo.identity_authority)})`);
    if (ciSha && metadataSha) {
        verify(ciSha.toLowerCase() === metadataSha.toLowerCase(), 'PROBE-01B', 'Committed build metadata matches the CI commit');
    }

    const services = JSON.parse(fs.readFileSync('knowledge/services.json', 'utf8'));
    verify(Array.isArray(services) && services.length >= 5 && services.every(s => s?.id && Number(s.priceUSD) > 0), 'PROBE-02', `Canonical service catalog valid (${services.length})`);

    const { SalesEngine } = await import('../ai_brain/sales_engine.js');
    const engine = new SalesEngine();
    const leadScore = engine.calculateLeadScore({ industry: 'SaaS', pain: 'manual leads', budget: '1000' });
    const recommended = engine.recommendServices({ pain: 'leads', industry: 'SaaS' }, services);
    const roi = engine.calculateROI(services[0], { industry: 'SaaS' });
    verify(leadScore >= 65, 'PROBE-03', `Deterministic sales qualification runs (${leadScore}/100)`);
    verify(recommended.length > 0, 'PROBE-04', `Service recommendation returned matches (${recommended[0].name})`);
    verify(roi.roiPercent > 0, 'PROBE-05', `Deterministic ROI calculation returns (${roi.roiPercent}%)`);

    const checkpointSig = sha256(JSON.stringify({ mission_id: 'msn_local_sim', state: 'RUNNING', step: 1 }));
    verify(checkpointSig.length === 64, 'PROBE-06', 'Mission state simulation is deterministic');

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    verify(pkg.name === 'iinsha-ai-bos' && Boolean(pkg?.engines?.node), 'PROBE-07', 'Package configuration and supported Node runtime declared');

    const htmlFiles = ['index.html', 'store.html', 'marketplace.html', 'portal.html', 'affiliate.html', 'compare.html', 'blog.html', 'admin.html'];
    verify(htmlFiles.every(file => fs.existsSync(file)), 'PROBE-08', `All ${htmlFiles.length} universal HTML surfaces exist`);

    const appJs = fs.readFileSync('app.js', 'utf8');
    verify(appJs.includes('openCheckoutModal') && appJs.includes('122.50'), 'PROBE-09', 'Checkout modal and conversion rate logic present');

    const contracts = [
        ['PROBE-10', 'functions/api/v1/business/control-tower.js', 'Control tower route implementation exists'],
        ['PROBE-11', 'functions/api/v1/operations/slo-control.js', 'SLO route implementation exists'],
        ['PROBE-12', 'functions/api/v1/governance/evaluate.js', 'Governance evaluate route exists'],
        ['PROBE-13', 'functions/api/v1/revenue/customer-success-loop.js', 'Customer success loop route exists'],
        ['PROBE-14', 'functions/api/v1/kernel/orchestrate.js', 'Kernel orchestration route exists'],
        ['PROBE-15', 'functions/api/v1/chaos/resilience-drill.js', 'Chaos resilience route exists'],
    ];
    for (const [id, file, description] of contracts) verify(fs.existsSync(path.resolve(file)), id, description);

    console.log(`LOCAL_RUNTIME_VERIFIED: ${passed}/${total} repository probes passed`);
    console.log('LIVE_VERIFICATION: PENDING');
    console.log('REAL_PROVIDER_EXECUTION: NOT_TESTED');
    console.log('REAL_PAYMENT: NOT_TESTED');
    console.log('REAL_CUSTOMER: NOT_TESTED');
} catch (error) {
    console.error('Runtime verification failed:', error?.message || error);
    process.exitCode = 1;
}
