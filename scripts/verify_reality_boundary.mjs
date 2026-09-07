import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const checks = [
  {
    file: 'scripts/verify_all_system_claims.mjs',
    forbidden: [
      'FINAL VERDICT: EVERY CLAIM IN IINSHA AI-BOS IS 100% EXECUTABLE AND CRYPTOGRAPHICALLY VERIFIABLE',
      'Verified Claims Passed: ${passedCount} / ${totalCount} (100%)',
      '100% of all claims verified'
    ],
    message: 'Master claim verifier must not emit universal production-verification claims.'
  },
  {
    file: 'scripts/run_live_autonomous_business_cycle.mjs',
    forbidden: [
      'VERDICT: REAL-WORLD AUTONOMOUS BUSINESS EXECUTION ENGINE IS 100% OPERATIONAL.',
      'REAL-WORLD AUTONOMOUS BUSINESS EXECUTION ENGINE IS 100% OPERATIONAL',
      'settled as PAID',
      'credited to operating revenue',
      'delivered to live customer',
      '100% customer delivery completed',
      'real customer transaction verified'
    ],
    message: 'Autonomous cycle runner must not turn synthetic/simulation state into real-world success.'
  },
  {
    file: 'scripts/run_final_activation_mission.mjs',
    forbidden: [
      'FINAL_PRODUCTION_GAP_REPORT.md',
      'PRODUCTION INTEGRATION STATUS: 100% OPERATIONAL',
      'LIVE_VERIFIED',
      'settled as PAID',
      'credited to operating revenue'
    ],
    required: [
      'production_verified: result?.production_verified === true',
      'REAL_VS_DEMO_DATA_AUDIT.md',
      'FINAL_READINESS_CONFORMANCE=PASS'
    ],
    message: 'Activation mission must remain a conformance/readiness exercise and must not seal synthetic evidence as production.'
  },
  {
    file: 'ai_brain/tool_execution_gateway.js',
    forbidden: [
      'production_verified: true, // simulated',
      'fake provider receipt',
      'PRODUCTION DEPLOYMENT PROVED'
    ],
    message: 'Tool execution gateway must not manufacture fake provider receipts.'
  }
];

const truthGuard = path.join(ROOT, 'functions', '_middleware.js');
if (!fs.existsSync(truthGuard)) throw new Error('Homepage truth guard middleware is missing.');
const guard = fs.readFileSync(truthGuard, 'utf8');

const forbiddenTruthClaims = [
  'IINSHA AI-BOS Autonomous Company OS Operational',
  '99.8% Success',
  '100% Reliable Data Stream',
  'Cloudflare Bypass',
  'We support bKash, Nagad, Stripe Credit/Debit cards, City Bank PLC Wire Transfers, and direct WhatsApp verification with dual-currency support ($ USD & ৳ BDT).'
];

const requiredSafeTruthClaims = [
  'IINSHA AI-BOS — Evidence-Gated Staging',
  'Measured success rate varies by target',
  'Evidence-backed data pipeline',
  'anti-bot resilient where permitted',
  'Payment options are offered only when a corresponding provider integration is configured and independently verified.'
];

for (const phrase of forbiddenTruthClaims) {
  if (guard.includes(phrase)) throw new Error(`Truth guard did not neutralize: ${phrase}`);
}

for (const phrase of requiredSafeTruthClaims) {
  if (!guard.includes(phrase)) throw new Error(`Truth guard safe replacement missing: ${phrase}`);
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
