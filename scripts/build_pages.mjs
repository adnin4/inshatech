/**
 * Platform-Agnostic Cloudflare Pages Build Script
 * Runs in any environment (Linux, Windows, macOS, Cloudflare CI container).
 * 
 * Guarantees:
 * 1. Executes build_premium_service_pages.mjs to generate all 10 service landing pages.
 * 2. Enforces UI/UX and DOM hierarchy invariants via verifyUiUxInvariants().
 * 3. Builds and synchronizes full static distribution into dist-pages/.
 * 4. Verifies static routing parity (_routes.json, _headers).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { verifyUiUxInvariants } from './verify_ui_ux_invariants.mjs';

const cwd = process.cwd();
console.log(`[BUILD] Cloudflare Pages build starting in: ${cwd}`);

// 1. Build 10 commercial service landing pages
console.log('[BUILD] Step 1: Compiling commercial service landing pages...');
try {
    const buildServicesScript = path.join(cwd, 'scripts', 'build_premium_service_pages.mjs');
    if (fs.existsSync(buildServicesScript)) {
        execSync(`node "${buildServicesScript}"`, { stdio: 'inherit' });
    }
} catch (err) {
    console.error(`[BUILD ERROR] Failed to compile premium service pages: ${err.message}`);
    process.exit(1);
}

// 2. Enforce UI/UX and DOM hierarchy invariants
console.log('[BUILD] Step 2: Enforcing UI/UX invariants...');
try {
    const uiUxStatus = verifyUiUxInvariants();
    console.log(`[BUILD] UI/UX Guardian: ${uiUxStatus}`);
} catch (err) {
    console.error(`[BUILD ERROR] UI/UX Invariant Violation: ${err.message}`);
    process.exit(1);
}

// 3. Synchronize static build output into dist-pages/
console.log('[BUILD] Step 3: Synchronizing distribution bundle into dist-pages/...');
const distDir = path.join(cwd, 'dist-pages');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy top-level HTML, CSS, JS, JSON, and dot/underscore files
const rootFiles = fs.readdirSync(cwd);
for (const item of rootFiles) {
    if (['node_modules', '.git', 'dist-pages', '.system_generated', '.antigravity-backup'].includes(item)) {
        continue;
    }
    const srcPath = path.join(cwd, item);
    const destPath = path.join(distDir, item);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
        if (['services', 'assets', 'css', 'js', 'src', 'knowledge'].includes(item)) {
            copyRecursiveSync(srcPath, destPath);
        }
    } else {
        if (item.endsWith('.html') || item.endsWith('.css') || item.endsWith('.js') || item.endsWith('.json') || item === '_headers' || item === '_routes.json' || item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.ico') || item.endsWith('.txt')) {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 4. Verify output files
const requiredDistFiles = [
    'index.html',
    '_headers',
    '_routes.json',
    'style.css',
    'services/ai-video-studio.html',
    'services/ai-saas-engineering.html',
    'services/ai-governance-operations.html',
    'services/ecommerce-growth-operations.html',
    'services/ai-finance-automation.html',
    'services/ai-data-operations.html',
    'services/enterprise-knowledge-search.html',
    'services/software-qa-release.html',
    'services/cloud-finops-reliability.html',
    'services/computer-vision-systems.html'
];

for (const req of requiredDistFiles) {
    const full = path.join(distDir, req);
    if (!fs.existsSync(full)) {
        console.error(`[BUILD ERROR] Missing required dist-pages file: ${req}`);
        process.exit(1);
    }
}

console.log(`[BUILD] Static assets, UI/UX invariants, and Cloudflare Pages bundle in dist-pages/ verified.`);
console.log('[BUILD] Cloudflare Pages build completed successfully.');
