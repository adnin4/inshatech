/**
 * IINSHA AI-BOS — Security & Content Hardening Gate
 * Scans deployable source files and fails on known high-risk security/content patterns.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_EXTENSIONS = new Set(['.html', '.js', '.mjs', '.json', '.sql']);
const EXCLUDE_DIRS = new Set([
    'node_modules',
    '.git',
    'docs',
    'Implementation_Reports_Markdown',
    'scratch'
]);

const FORBIDDEN_PATTERNS = [
    { name: 'Hardcoded Default DB Password', regex: /@@@mahin12/i, severity: 'P0_CRITICAL' },
    { name: 'Client-Side Admin Bypass', regex: /1-Click Instant Demo Login|quickLoginAs\(/i, severity: 'P0_CRITICAL' },
    { name: 'Raw Credit Card Input Field', regex: /name=["']card_number["']|id=["']card-number["']/i, severity: 'P0_CRITICAL' },
    { name: 'Unsafe Cloudflare Bypass Wording', regex: /Cloudflare bypass|anti-bot bypass/i, severity: 'P0_CRITICAL' },
    { name: 'Absolute 100% Reliable Marketing Claim', regex: /100% Reliable Data Stream/i, severity: 'P1_WARNING' }
];

console.log('================================================================================');
console.log('IINSHA AI-BOS: P0 SECURITY & CONTENT INTEGRITY SCANNER');
console.log('================================================================================\n');

let totalFilesScanned = 0;
let violationsFound = 0;

function scanDirectory(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(ROOT_DIR, fullPath);

        if (entry.isDirectory()) {
            if (!EXCLUDE_DIRS.has(entry.name)) scanDirectory(fullPath);
            continue;
        }

        const extension = path.extname(entry.name);
        if (!entry.isFile() || !SCAN_EXTENSIONS.has(extension) || entry.name === 'live_index.html') {
            continue;
        }

        totalFilesScanned += 1;
        const content = fs.readFileSync(fullPath, 'utf8');

        for (const pattern of FORBIDDEN_PATTERNS) {
            if (pattern.regex.test(content)) {
                console.error(`FAIL [${pattern.severity}] ${pattern.name}`);
                console.error(`     File: ${relativePath}`);
                violationsFound += 1;
            }
        }
    }
}

scanDirectory(ROOT_DIR);

console.log('================================================================================');
console.log(`SCAN COMPLETE: ${totalFilesScanned} files | Violations: ${violationsFound}`);

if (violationsFound > 0) {
    console.error('SECURITY GATE FAILED: remediate every finding before production release.');
    process.exit(1);
}

console.log('SECURITY GATE PASSED: no configured P0/P1 findings.');
console.log('================================================================================\n');
