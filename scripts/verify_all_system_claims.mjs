/**
 * IINSHA AI-BOS: SYSTEM CLAIM CLASSIFICATION SUITE
 *
 * Verifies repository/static invariants only. It does not certify production.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyUiUxInvariants } from './verify_ui_ux_invariants.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
function check(id, name, fn, classification = 'VERIFIED_STATIC') {
  try {
    const detail = fn();
    results.push({ id, name, status: classification, detail });
    console.log(`[CLAIM ${id}] PASS — ${name} — ${classification}`);
  } catch (error) {
    results.push({ id, name, status: 'FAILED', detail: error.message });
    console.error(`[CLAIM ${id}] FAIL — ${name}: ${error.message}`);
  }
}

check(1, 'Zero-leak distribution invariant', () => {
  const file = path.join(ROOT, '.env.example');
  if (!fs.existsSync(file)) throw new Error('.env.example missing');
  const content = fs.readFileSync(file, 'utf8');
  if (/eyJh|sk-[A-Za-z0-9]|re_[A-Za-z0-9]{10,}|AIzaSy[A-Za-z0-9_-]{20,}/.test(content)) throw new Error('token-like value detected');
  return '.env.example present; no detected live-token pattern.';
});
check(2, 'Canonical service catalog structure', () => {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge', 'services.json'), 'utf8'));
  if (!Array.isArray(data) || data.length < 5) throw new Error('canonical service catalog is incomplete');
  return `${data.length} catalog entries parsed.`;
});
check(3, 'Agent registry structure', () => {
  const content = fs.readFileSync(path.join(ROOT, 'ai_brain', 'agents', 'agent_registry.js'), 'utf8');
  const count = (content.match(/[A-Z0-9_]+_AGENT\s*:/g) || []).length;
  if (count < 10) throw new Error(`only ${count} agent definitions detected`);
  return `${count} agent definitions detected.`;
});
check(4, 'Copilot memory structure', () => {
  const content = fs.readFileSync(path.join(ROOT, 'universal_ai_copilot.js'), 'utf8');
  if (!content.includes('loadMemory') || !content.includes('saveMemory')) throw new Error('memory functions missing');
  return 'loadMemory/saveMemory detected.';
});
check(5, 'Sales scoring structure', () => {
  const content = fs.readFileSync(path.join(ROOT, 'ai_brain', 'sales_engine.js'), 'utf8');
  if (!content.includes('calculateLeadScore') || !content.includes('calculateROI')) throw new Error('sales calculators missing');
  return 'lead scoring and ROI calculators detected.';
});
check(6, 'Affiliate tracking structure', () => {
  const file = path.join(ROOT, 'functions', 'api', 'affiliate', 'track.js');
  if (!fs.existsSync(file)) throw new Error('affiliate tracker missing');
  return 'affiliate tracking function exists.';
});
check(7, 'Payment adapter boundary', () => {
  const content = fs.readFileSync(path.join(ROOT, 'functions', 'api', 'payments', 'checkout.js'), 'utf8');
  if (!/stripe|bkash|lemon/i.test(content)) throw new Error('payment routing references missing');
  return 'payment code exists; provider activation is not certified here.';
}, 'CONFIGURED_UNVERIFIED');
check(8, 'Webhook verification boundary', () => {
  const content = fs.readFileSync(path.join(ROOT, 'ai_brain', 'autonomous_business_engine.js'), 'utf8');
  if (!content.includes('webhookVerifier') || !content.includes('idempotencyKey')) throw new Error('verification/idempotency boundary missing');
  return 'webhook verifier and idempotency requirements detected.';
}, 'STRUCTURAL_ONLY');
check(9, 'Autonomous cycle conformance runner', () => {
  const file = path.join(ROOT, 'scripts', 'run_live_autonomous_business_cycle.mjs');
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('SIMULATION')) throw new Error('runner must declare SIMULATION mode');
  if (/settled as PAID|credited to operating revenue|REAL-WORLD.*100% OPERATIONAL/i.test(content)) throw new Error('synthetic production-success language detected');
  return 'cycle runner is explicitly simulation/conformance only.';
}, 'SIMULATION');
check(10, 'UI/UX structural invariants', () => verifyUiUxInvariants(), 'VERIFIED_STATIC');

const failed = results.filter((r) => r.status === 'FAILED');
const report = `# IINSHA AI-BOS — System Claim Classification Report\n\nGenerated: ${new Date().toISOString()}\n\nThis report certifies static/structural invariants only. It is not production-runtime evidence.\n\n| # | Claim | Classification | Detail |\n|---:|---|---|---|\n${results.map((r) => `| ${r.id} | ${r.name} | ${r.status} | ${r.detail.replace(/\n/g, ' ')} |`).join('\n')}\n\n## Evidence boundary\n\nNo row in this report proves a real customer transaction, external provider settlement, provider delivery, production deployment, or live runtime health.\n\nOverall gate: ${failed.length === 0 ? 'PASS' : 'FAIL'}\n`;
fs.writeFileSync(path.join(ROOT, 'docs', 'UNIFIED_MASTER_SYSTEM_CLAIMS_VERIFICATION_REPORT.md'), report, 'utf8');
if (failed.length) process.exit(1);
console.log(`SYSTEM_CLAIM_CLASSIFICATION=PASS (${results.length}/${results.length})`);
