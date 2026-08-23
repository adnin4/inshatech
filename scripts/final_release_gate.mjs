#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const gateFile = path.join(root, 'docs/FINAL_RELEASE_GATES.yaml');
if (!fs.existsSync(gateFile)) {
  console.error('FINAL_RELEASE_GATE: FAIL - gate specification missing');
  process.exit(1);
}

// External evidence is intentionally supplied by CI/owner configuration.
// Never infer live production truth from code presence alone.
const required = [
  'P0_SECURITY',
  'CI',
  'STAGING',
  'RLS',
  'SHA_PARITY',
  'BACKUP_RESTORE',
  'ROLLBACK',
  'PROVIDERS',
  'PAYMENT_E2E',
  'PROJECT_EXECUTION',
  'QA',
  'DELIVERY',
  'CUSTOMER_ACCEPTANCE',
  'SUPPORT',
  'RENEWAL',
  'LEARNING',
  'PILOT',
  'SECTOR_MATRIX'
];

const missing = required.filter((key) => {
  const value = process.env[`IINSHA_GATE_${key}`];
  return value !== 'PASS';
});

if (missing.length) {
  console.error('FINAL_RELEASE_GATE: BLOCKED');
  console.error('Missing passing external evidence:');
  for (const item of missing) console.error(`- ${item}`);
  console.error('No LIVE/10-10 certification is issued.');
  process.exit(1);
}

console.log('FINAL_RELEASE_GATE: PASS');
console.log('All required external evidence gates supplied as PASS.');
