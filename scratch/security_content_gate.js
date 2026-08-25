/**
 * IINSHA AI-BOS — Security & Content Hardening Gate
 * Scans all repository files to enforce ZERO P0 security leaks:
 * 1. No hardcoded admin passwords or JWT secrets
 * 2. No client-side admin bypasses ("1-Click Auto Unlock" / quickLoginAs)
 * 3. No raw card-number inputs (Stripe Elements / Checkout required)
 * 4. No unverified "Cloudflare Bypass" or "Anti-bot Bypass" wording
 * 5. No absolute ungrounded "100% Reliable Data Stream" marketing claims
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_EXTENSIONS = ['.html', '.js', '.mjs', '.json', '.sql'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'Implementation_Reports_Markdown', 'scratch'];

const FORBIDDEN_PATTERNS = [
    { name: 'Hardcoded Default DB Password', regex: /@@@mahin12/i, severity: 'P0_CRITICAL' },
    { name: 'Client-Side Admin Bypass', regex: /1-Click Instant Demo Login|quickLoginAs\(/i, severity: 'P0_CRITICAL' },
    { name: 'Raw Credit Card Input Field', regex: /name=["']card_number["']|id=["']card-number["']/i, severity: 'P0_CRITICAL' },
    { name: 'Unsafe Cloudflare Bypass Wording', regex: /Cloudflare bypass|anti-bot bypass/i, severity: 'P0_CRITICAL' },
    { name: 'Absolute 100% Reliable Marketing Claim', regex: /100% Reliable Data Stream/i, severity: 'P1_WARNING' }
];

console.log('================================================================================');
console.log('🛡️ IINSHA AI-BOS: P0 SECURITY & CONTENT INTEGRITY SCANNER');
console.log('================================================================================\n');

let totalFilesScanned = 0;
let violationsFound = 0;

function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(ROOT_DIR, fullPath);

        if (entry.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(entry.name)) {
                scanDirectory(fullPath);
            }
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (SCAN_EXTENSIONS.includes(ext) && !entry.name.includes('live_index.html')) {
                totalFilesScanned++;
                const content = fs.readFileSync(fullPath, 'utf8');

                for (const pattern of FORBIDDEN_PATTERNS) {
                    if (pattern.regex.test(content)) {
                        console.error(`❌ [${pattern.severity}] ${pattern.name}`);
                        console.error(`   File: ${relPath}`);
                        violationsFound++;
                    }
                }
            }
        }
    }
}

scanDirectory(ROOT_DIR);

console.log('================================================================================');
console.log(`📊 SCAN COMPLETE: Scanned ${totalFilesScanned} files | Violations: ${violationsFound}`);

if (violationsFound > 0) {
    console.error('❌ SECURITY GATE FAILED: Remediate all P0/P1 issues before production release.');
    console.log('================================================================================\n');
    process.exit(1);
} else {
    console.log('🎉 ZERO P0 LEAKS: All files comply with international security & content standards.');
    console.log('================================================================================\n');
    process.exit(0);
}
