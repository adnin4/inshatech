import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_EXTENSIONS = ['.html', '.js', '.mjs', '.json', '.sql'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'Implementation_Reports_Markdown', 'scratch', 'scripts'];

const FORBIDDEN_RULES = [
    { name: 'Hardcoded Default DB Password', regex: /@@@mahin12/i, severity: 'P0_CRITICAL' },
    { name: 'Client-Side Admin Bypass', regex: /1-Click Instant Demo Login|quickLoginAs\(|quickDemoLogin\(/i, severity: 'P0_CRITICAL' },
    { name: 'Raw Credit Card Input Field', regex: /name=["']card_number["']|id=["']card-number["']|name=["']cvc["']|name=["']card_exp["']/i, severity: 'P0_CRITICAL' },
    { name: 'Unsafe Cloudflare Bypass Wording', regex: /Cloudflare bypass|anti-bot bypass/i, severity: 'P0_CRITICAL' },
    { name: 'OpenClaw Stealth Wording', regex: /OpenClaw stealth/i, severity: 'P0_CRITICAL' },
    { name: '100% Reliable Claim', regex: /100% Reliable Data Stream/i, severity: 'P1_WARNING' },
    { name: 'Old Version Claim', regex: /IINSHA AI Lab v4\.5/i, severity: 'P1_WARNING' }
];

console.log("================================================================================");
console.log("🔍 DEEP AUDIT: SCANNING REPOSITORY FOR FORBIDDEN PATTERNS");
console.log("================================================================================");

let violations = 0;
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

            for (const rule of FORBIDDEN_RULES) {
                if (rule.regex.test(content)) {
                    console.error(`❌ [${rule.severity}] ${rule.name} found in: ${relPath}`);
                    violations++;
                }
            }
        }
    }
}

scanDir(ROOT_DIR);

console.log(`\nAudited ${filesScanned} files. Violations: ${violations}`);

if (violations === 0) {
    console.log("✅ DEEP AUDIT CLEAN: 0 FORBIDDEN PATTERNS DETECTED!");
    process.exit(0);
} else {
    console.error("❌ DEEP AUDIT FAILED: VIOLATIONS FOUND");
    process.exit(1);
}
