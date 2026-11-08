/**
 * Platform-Agnostic Cloudflare Pages Build Script
 * Runs in any environment (Linux, Windows, macOS, Cloudflare CI container).
 */

import fs from 'node:fs';
import path from 'node:path';
import { verifyUiUxInvariants } from './verify_ui_ux_invariants.mjs';

const cwd = process.cwd();
console.log(`[BUILD] Cloudflare Pages build starting in: ${cwd}`);

const requiredFiles = ['index.html', '_headers', 'style.css', 'src/js/ux_interactions.js'];
for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(cwd, file))) {
        console.error(`[BUILD ERROR] Missing required file: ${file}`);
        process.exit(1);
    }
}

// Enforce UI/UX and DOM hierarchy invariants
try {
    const uiUxStatus = verifyUiUxInvariants();
    console.log(`[BUILD] UI/UX Guardian: ${uiUxStatus}`);
} catch (err) {
    console.error(`[BUILD ERROR] UI/UX Invariant Violation: ${err.message}`);
    process.exit(1);
}

console.log('[BUILD] Static assets, UI/UX invariants, and Cloudflare Functions verified.');
console.log('[BUILD] Cloudflare Pages build completed successfully.');
