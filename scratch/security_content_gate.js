/**
 * IINSHA AI-BOS — Security & Content Hardening Gate
 * Scans repository files to enforce ZERO P0 security leaks.
 *
 * The gate intentionally fails closed. On failure it also emits a deterministic
 * machine-readable report so CI failures remain diagnosable even when hosted
 * job logs are unavailable.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT_DIR, 'security-gate-report');

const SCAN_EXTENSIONS = ['.html', '.js', '.mjs', '.json', '.sql'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'Implementation_Reports_Markdown', 'scratch', 'scripts', 'security-gate-report'];

const FORBIDDEN_PATTERNS = [
    { name: 'Hardcoded Default DB Password', regex: /@@@mahin12/i, severity: 'P0_CRITICAL' },
    { name: 'Client-Side Admin Bypass', regex: /1-Click Instant Demo Login|quickLoginAs\(/i, severity: 'P0_CRITICAL' },
    { name: 'Raw Credit Card Input Field', regex: /name=["']card_number["']|id=["']card-number["']/i, severity: 'P0_CRITICAL' },
    { name: 'Unsafe Cloudflare Bypass Wording', regex: /Cloudflare bypass|anti-bot bypass/i, severity: 'P0_CRITICAL' }
];

console.log('================================================================================');
console.log('🛡️ IINSHA AI-BOS: P0 SECURITY & CONTENT LEAK AUDIT');
console.log('================================================================================\n');

const violations = [];
let filesScanned = 0;

function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(ROOT_DIR, fullPath);

        if (entry.isDirectory()) {
            if (EXCLUDE_DIRS.includes(entry.name)) continue;
            scanDir(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            if (!SCAN_EXTENSIONS.includes(ext)) continue;

            filesScanned++;
            const content = fs.readFileSync(fullPath, 'utf-8');

            for (const rule of FORBIDDEN_PATTERNS) {
                if (!rule.regex.test(content)) continue;

                const lines = content.split(/\r?\n/);
                const matchingLines = [];
                for (let i = 0; i < lines.length; i++) {
                    if (rule.regex.test(lines[i])) matchingLines.push(i + 1);
                }

                violations.push({
                    severity: rule.severity,
                    rule: rule.name,
                    file: relPath,
                    lines: matchingLines
                });

                console.error(`❌ [${rule.severity}] ${rule.name} found in: ${relPath}`);
                if (matchingLines.length) console.error(`   Lines: ${matchingLines.join(', ')}`);
            }
        }
    }
}

scanDir(ROOT_DIR);

fs.mkdirSync(REPORT_DIR, { recursive: true });
const report = {
    generated_at: new Date().toISOString(),
    repository_gate: 'P0_SECURITY_CONTENT',
    files_scanned: filesScanned,
    violation_count: violations.length,
    violations
};
fs.writeFileSync(path.join(REPORT_DIR, 'security-gate-report.json'), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(
    path.join(REPORT_DIR, 'security-gate-report.md'),
    [
        '# IINSHA P0 Security Gate Report',
        '',
        `Generated: ${report.generated_at}`,
        `Files scanned: ${filesScanned}`,
        `Violations: ${violations.length}`,
        '',
        ...(violations.length
            ? violations.map(v => `- **${v.severity}** ${v.rule} — \`${v.file}\`${v.lines.length ? ` (lines ${v.lines.join(', ')})` : ''}`)
            : ['No forbidden patterns detected.'])
    ].join('\n') + '\n'
);

console.log(`\nAudited ${filesScanned} files. Violations: ${violations.length}`);
console.log(`Evidence report: ${path.relative(ROOT_DIR, path.join(REPORT_DIR, 'security-gate-report.json'))}`);

if (violations.length === 0) {
    console.log('✅ P0 SECURITY & CONTENT GATE PASSED: ZERO LEAKS DETECTED');
    process.exit(0);
}

console.error('❌ P0 SECURITY & CONTENT GATE FAILED');
process.exit(1);
