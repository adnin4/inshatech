import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { REPLACEMENTS } from '../functions/_middleware.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const checks = [
  {
    file: 'scripts/verify_all_system_claims.mjs',
    forbidden: [
      'FINAL VERDICT: EVERY CLAIM IN IINSHA AI-BOS IS 100% EXECUTABLE AND CRYPTOGRAPHICALLY VERIFIABLE',
      'Verified Claims Passed: ${passedCount} / ${totalCount} (100%)'
    ],
    message: 'Master claim verifier must not emit universal production-verification claims.'
  },
  {
    file: 'scripts/run_live_autonomous_business_cycle.mjs',
    forbidden: [
      'VERDICT: REAL-WORLD AUTONOMOUS BUSINESS EXECUTION ENGINE IS 100% OPERATIONAL.',
      'settled as PAID',
      'credited to operating revenue'
    ],
    message: 'Autonomous cycle runner must not turn synthetic state into real-world success.'
  },
  {
    file: 'scripts/run_final_activation_mission.mjs',
    forbidden: [
      'FINAL_PRODUCTION_GAP_REPORT.md',
      'PRODUCTION INTEGRATION STATUS'
    ],
    required: [
      'Mode: `CONFORMANCE / STAGING READINESS`',
      'production_verified === true',
      'REAL_VS_DEMO_DATA_AUDIT.md'
    ],
    message: 'Activation mission must remain a conformance/readiness exercise and must not seal synthetic evidence as production.'
  }
];

const truthGuard = path.join(ROOT, 'functions', '_middleware.js');
if (!fs.existsSync(truthGuard)) throw new Error('Homepage truth guard middleware is missing.');

const requiredReplacements = [
  {
    source: 'IINSHA AI-BOS Autonomous Company OS Operational',
    replacement: 'IINSHA AI-BOS — Evidence-Gated Staging'
  },
  {
    source: '100% Reliable Data Stream',
    replacement: 'Evidence-backed data pipeline'
  },
  {
    source: '99.8% Success',
    replacement: 'Measured success rate varies by target'
  },
  {
    sourceFragment: 'Cloudflare Bypass',
    replacement: 'anti-bot resilient where permitted'
  },
  {
    sourceFragment: 'We support bKash, Nagad, Stripe Credit/Debit cards',
    replacement: 'Payment options are offered only when a corresponding provider integration is configured and independently verified.'
  }
];

for (const requirement of requiredReplacements) {
  const match = REPLACEMENTS.find(([source]) => {
    const sourceText = String(source);
    return requirement.source
      ? sourceText === requirement.source
      : sourceText.includes(requirement.sourceFragment);
  });

  if (!match) {
    const label = requirement.source ?? requirement.sourceFragment;
    throw new Error(`Truth guard replacement missing: ${label}`);
  }

  if (!String(match[1]).includes(requirement.replacement)) {
    const label = requirement.source ?? requirement.sourceFragment;
    throw new Error(`Truth guard replacement unsafe for: ${label}`);
  }
}

for (const check of checks) {
  const filePath = path.join(ROOT, check.file);
  if (!fs.existsSync(filePath)) throw new Error(`${check.file} is missing.`);
  const content = fs.readFileSync(filePath, 'utf8');
  for (const phrase of check.forbidden) {
    if (content.includes(phrase)) throw new Error(`${check.message} Found forbidden phrase in ${check.file}: ${phrase}`);
  }
  for (const phrase of check.required || []) {
    if (!content.includes(phrase)) throw new Error(`${check.message} Missing required conformance marker in ${check.file}: ${phrase}`);
  }
}

console.log('REALITY_BOUNDARY_GATE=PASS');
console.log('Production claims, synthetic-cycle verdicts, and activation-report false-green paths are blocked.');
