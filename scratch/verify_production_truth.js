import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED = new Set(['.git', 'node_modules', '__pycache__', '.wrangler']);
const TEXT_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.html', '.md', '.json', '.sql', '.yml', '.yaml']);
const POLICY_DEFINITION_FILE = 'ai_brain/production_truth_policy.js';
const REGISTRY_DEFINITION_FILE = 'ai_brain/production_adapter_registry.js';
const TEST_ROOTS = ['scratch/', 'tests/'];

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

function isTestFixture(rel) {
  return TEST_ROOTS.some(prefix => rel.startsWith(prefix)) || rel.includes('/test/') || rel.endsWith('.test.js');
}

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const text = fs.readFileSync(file, 'utf8');
  const isTest = isTestFixture(rel);
  const isTruthDefinition = rel === POLICY_DEFINITION_FILE || rel === REGISTRY_DEFINITION_FILE;
  const isDocs = rel.startsWith('docs/');

  // Test fixtures and the policy/registry definitions are allowed to mention
  // status names because they define or assert the truth model; executable
  // production handlers are not.
  if (!isTest && !isTruthDefinition) {
    for (const re of forbiddenProductionPatterns) {
      if (re.test(text)) violations.push(`${rel}: forbidden production-success pattern ${re}`);
      re.lastIndex = 0;
    }
  }

  // Public/runtime code cannot make unbacked absolute claims. Documentation and
  // test fixtures may discuss the verification taxonomy.
  if (!isTest && !isDocs && !isTruthDefinition) {
    for (const re of deceptiveClaims) {
      if (re.test(text)) violations.push(`${rel}: unverifiable production claim pattern ${re}`);
      re.lastIndex = 0;
    }
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