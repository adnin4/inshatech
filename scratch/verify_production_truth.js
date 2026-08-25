import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED = new Set(['.git', 'node_modules', '__pycache__', '.wrangler']);
const TEXT_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.html', '.md', '.json', '.sql', '.yml', '.yaml']);

const forbiddenProductionPatterns = [
  /status\s*:\s*['"]EXECUTED['"]/g,
  /status\s*:\s*['"]COMPLETED['"]/g,
  /status\s*:\s*['"]CONNECTOR_READY['"]/g,
  /status\s*:\s*['"]DISPATCH_FORMATTED['"]/g,
  /status\s*:\s*['"]DISPATCH_QUEUED['"]/g,
  /status\s*:\s*['"]QUALIFIED_IN_CRM_PIPELINE['"]/g,
  /status\s*:\s*['"]PIPELINE_EXECUTED['"]/g,
  /execution_mode\s*:\s*['"]POLICY_VERIFIED_INTERNAL['"]/g,
];

const deceptiveClaims = [
  /100%\s+(?:operational|verified|deliverable)/gi,
  /LIVE_VERIFIED/g,
  /verified_status\s*:\s*['"]VERIFIED_DELIVERABLE['"]/g,
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (TEXT_EXT.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const violations = [];

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const text = fs.readFileSync(file, 'utf8');

  // Test fixtures may contain forbidden strings intentionally, but they must be
  // under scratch/tests and never in production/runtime directories.
  const isTest = rel.startsWith('scratch/') || rel.includes('/test/') || rel.endsWith('.test.js');
  if (!isTest) {
    for (const re of forbiddenProductionPatterns) {
      if (re.test(text)) violations.push(`${rel}: forbidden production-success pattern ${re}`);
      re.lastIndex = 0;
    }
  }

  // These claims are only valid when produced from evidence, not hardcoded.
  for (const re of deceptiveClaims) {
    if (re.test(text) && !rel.startsWith('docs/')) {
      violations.push(`${rel}: unverifiable production claim pattern ${re}`);
    }
    re.lastIndex = 0;
  }
}

const runtime = fs.readFileSync(path.join(ROOT, 'ai_brain/agent_runtime.js'), 'utf8');
if (/status:\s*riskEvaluation\.requires_human_approval\s*\?\s*['"]APPROVAL_REQUIRED['"]\s*:\s*['"]EXECUTED['"]/.test(runtime)) {
  violations.push('ai_brain/agent_runtime.js: runtime still labels authorization as EXECUTED without a tool result');
}

if (violations.length) {
  console.error('PRODUCTION_TRUTH_AUDIT: FAIL');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('PRODUCTION_TRUTH_AUDIT: PASS');
console.log(JSON.stringify({ scanned_files: files.length, forbidden_success_claims: 0 }, null, 2));
