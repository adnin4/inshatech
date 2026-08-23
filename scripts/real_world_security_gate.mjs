#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'index.html',
  'portal.html',
  'admin.html',
  'store.html',
  'marketplace.html',
  'affiliate.html',
  'affiliate-dashboard.html',
  'affiliate-login.html',
  'compare.html',
  'blog.html'
];

const failures = [];
const warnings = [];

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');

  if (/type=["']password["'][^>]*value=["'][^"']{4,}["']/i.test(text)) {
    failures.push(`${rel}: hardcoded password value detected`);
  }
  if (/admin[-_](pass|password|secret)|passcode-input/i.test(text) && /value=["'][^"']{4,}["']/i.test(text)) {
    failures.push(`${rel}: probable hardcoded admin credential`);
  }
  if (/1-click auto unlock|auto unlock|instant access/i.test(text)) {
    failures.push(`${rel}: authentication bypass wording/flow detected`);
  }
  if (/card number|card-num|credit card/i.test(text) && /<input/i.test(text)) {
    warnings.push(`${rel}: card-data UI detected; verify PCI-safe hosted checkout is used and no PAN is collected by the site`);
  }
  if (/100% reliable|100% uptime|99\.9% uptime|99\.98% uptime|99\.8% success|1,500%|1,200%|8,700%/i.test(text)) {
    warnings.push(`${rel}: absolute/high-impact performance or ROI claim requires evidence/qualification`);
  }
  if (/cloudflare.{0,40}(bypass|anti-bot bypass)|bypass.{0,40}cloudflare/i.test(text)) {
    warnings.push(`${rel}: anti-bot/bypass marketing claim requires lawful-use qualification and evidence`);
  }
  if (/HIPAA[- ](ready|compliant)|GDPR[- ]compliant|SOC\s*2/i.test(text)) {
    warnings.push(`${rel}: compliance claim requires documented scope/evidence before public certification language`);
  }
}

if (failures.length) {
  console.error('SECURITY_GATE: FAIL');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('SECURITY_GATE: PASS');
if (warnings.length) {
  console.log(`CLAIM_GATE_WARNINGS: ${warnings.length}`);
  for (const item of warnings) console.log(`- ${item}`);
}
