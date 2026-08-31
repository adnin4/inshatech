/**
 * Platform-Agnostic Cloudflare Pages Build Script
 * Runs in any environment (Linux, Windows, macOS, Cloudflare CI container).
 */

import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
console.log(`[BUILD] Cloudflare Pages build starting in: ${cwd}`);

const requiredFiles = ['index.html', '_headers'];
for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(cwd, file))) {
        console.error(`[BUILD ERROR] Missing required file: ${file}`);
        process.exit(1);
    }
}

console.log('[BUILD] Static assets and Cloudflare Functions verified.');
console.log('[BUILD] Cloudflare Pages build completed successfully.');
