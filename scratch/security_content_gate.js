#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = ['index.html', 'app.js', 'universal_ai_copilot.js'];
const findings = [];

const rules = [
  {
    id: 'SEC-HTML-001',
    re: /id=["']admin-passcode-input["'][^>]*value=["'][^"']+["']/i,
    msg: 'Hardcoded admin password/default credential in HTML.'
  },
  {
    id: 'SEC-HTML-002',
    re: /1-Click Auto Unlock|sessionStorage\.setItem\(["']iinsha_admin_authenticated["']\s*,\s*["']true/i,
    msg: 'Client-side admin unlock bypass detected.'
  },
  {
    id: 'SEC-HTML-003',
    re: /id=["']pay-card-num["']/i,
    msg: 'Raw card-number collection in custom input. Use hosted/tokenized payment fields only.'
  },
  {
    id: 'TRUST-001',
    re: /100% Reliable Data Stream|100% Reliable|100% data privacy/i,
    msg: 'Absolute reliability/privacy claim requires independently verifiable evidence or qualified wording.'
  },
  {
    id: 'TRUST-002',
    re: /99\.8% Success|99\.9%|99\.98% Uptime|50,000\+|\$14\.2K|1,500%|1,200% ROI|8,700%|4 Days/i,
    msg: 'Unsupported performance/business metric detected; require evidence-backed source or simulation label.'
  },
  {
    id: 'SAFETY-001',
    re: /Cloudflare anti-bot|bypass Cloudflare|bypass anti-bot|anti-bot bypass/i,
    msg: 'Avoid evasion/bypass language; describe only authorized web automation/data collection.'
  },
  {
    id: 'HEALTH-001',
    re: /HIPAA-Compliant/i,
    msg: 'Do not claim HIPAA compliance without formal compliance controls/BAA/evidence. Use HIPAA-ready/architecture only.'
  }
];

for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const rule of rules) {
    if (rule.re.test(text)) findings.push({ file: rel, ...rule });
  }
}

if (findings.length) {
  console.error('SECURITY/CONTENT GATE FAILED');
  for (const f of findings) console.error(`[${f.id}] ${f.file}: ${f.msg}`);
  process.exit(1);
}

console.log('SECURITY/CONTENT GATE PASSED');
