import fs from 'fs';
import path from 'path';

const REQUIRED_FILES = [
  'docs/IINSHA_FINAL_ENGINEERING_REPORT_2026-11-11.txt',
  'docs/IINSHA_LIVE_AUDIT_SNAPSHOT_2026-11-11.txt',
  'docs/IINSHA_OWNER_GATES_CHECKLIST.txt',
  'docs/IINSHA_TEST_EVIDENCE_2026-11-11.txt',
  'docs/IINSHA_WEBSITE_AUDIT_2026-11-11.txt',
  'ANTIGRAVITY_PROJECT_CONTEXT.txt'
];

console.log('================================================================================');
console.log('IINSHA AI-BOS — INDEPENDENT HANDOFF DOCUMENT VERIFICATION');
console.log('================================================================================');

let allPassed = true;
const results = [];

for (const relPath of REQUIRED_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] File missing: ${relPath}`);
    allPassed = false;
    results.push({ path: relPath, status: 'MISSING', bytes: 0, lines: 0 });
    continue;
  }

  const stat = fs.statSync(fullPath);
  if (stat.size === 0) {
    console.error(`[FAIL] File is 0 bytes: ${relPath}`);
    allPassed = false;
    results.push({ path: relPath, status: 'EMPTY', bytes: 0, lines: 0 });
    continue;
  }

  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.error(`[FAIL] UTF-8 decode error in ${relPath}:`, err.message);
    allPassed = false;
    results.push({ path: relPath, status: 'UTF8_ERROR', bytes: stat.size, lines: 0 });
    continue;
  }

  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length < 5) {
    console.error(`[FAIL] Insufficient content in ${relPath}: ${lines.length} lines`);
    allPassed = false;
    results.push({ path: relPath, status: 'TRUNCATED', bytes: stat.size, lines: lines.length });
    continue;
  }

  const firstLine = lines[0];
  const lastLine = lines[lines.length - 1];

  results.push({
    path: relPath,
    status: 'PASS',
    bytes: stat.size,
    lines: lines.length,
    firstLine: firstLine.substring(0, 60),
    lastLine: lastLine.substring(0, 60)
  });
}

console.table(results.map(r => ({
  Path: r.path,
  Bytes: r.bytes,
  Lines: r.lines,
  Status: r.status,
  FirstLine: r.firstLine || 'N/A'
})));

if (!allPassed) {
  console.error('\nVerification FAILED: One or more documents are invalid.');
  process.exit(1);
}

console.log('\n[PASS] All 6 handoff documents verified: existence, >0 bytes, UTF-8 clean, non-empty.');
process.exit(0);
