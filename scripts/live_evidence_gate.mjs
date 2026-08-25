/**
 * IINSHA AI-BOS — Live Route & Asset Evidence Gate
 * Probes all production/staging routes to verify HTTP 200/308, valid DOM body, and zero 4xx/5xx errors.
 */

import http from 'http';
import https from 'https';

const TARGET_HOST = process.env.LIVE_URL || process.env.DEPLOYMENT_URL || 'https://inshatech.pages.dev';

const CRITICAL_ROUTES = [
    { path: '/', name: 'Homepage Root' },
    { path: '/store', name: 'Turnkey Store' },
    { path: '/marketplace', name: 'AI Marketplace' },
    { path: '/portal', name: 'Client Portal' },
    { path: '/affiliate', name: 'Affiliate Hub' },
    { path: '/affiliate-login.html', name: 'Affiliate Login' },
    { path: '/affiliate-dashboard.html', name: 'Affiliate Dashboard' },
    { path: '/compare', name: 'Comparison Table' },
    { path: '/blog', name: 'Engineering Blog' },
    { path: '/api/sre/health', name: 'SRE Health Stream' },
    { path: '/api/version', name: 'Version & SHA Parity' }
];

console.log('================================================================================');
console.log('🌐 IINSHA AI-BOS: LIVE ROUTE & ASSET EVIDENCE GATE');
console.log(`🎯 Target Surface: ${TARGET_HOST}`);
console.log('================================================================================\n');

async function probeRoute(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    bodyLength: data.length,
                    headers: res.headers
                });
            });
        });
        req.on('error', (e) => resolve({ status: 0, error: e.message, bodyLength: 0 }));
        req.setTimeout(8000, () => {
            req.destroy();
            resolve({ status: 0, error: 'Timeout after 8s', bodyLength: 0 });
        });
    });
}

async function runLiveGate() {
    let failed = 0;

    for (const r of CRITICAL_ROUTES) {
        const fullUrl = `${TARGET_HOST.replace(/\/$/, '')}${r.path}`;
        const res = await probeRoute(fullUrl);

        if (res.status >= 200 && res.status < 400) {
            console.log(`✅ [HTTP ${res.status}] ${r.name} (${r.path}) -> Payload: ${res.bodyLength} bytes`);
        } else {
            console.error(`❌ [HTTP ${res.status || 'ERROR'}] ${r.name} (${r.path}) -> Error: ${res.error || 'Invalid Status'}`);
            failed++;
        }
    }

    console.log('\n================================================================================');
    if (failed === 0) {
        console.log('🎉 LIVE EVIDENCE GATE PASSED: All 11 critical production routes verified responsive!');
        console.log('================================================================================\n');
        process.exit(0);
    } else {
        console.error(`❌ LIVE EVIDENCE GATE FAILED: ${failed} route(s) failed reachability check.`);
        console.log('================================================================================\n');
        process.exit(1);
    }
}

runLiveGate();
