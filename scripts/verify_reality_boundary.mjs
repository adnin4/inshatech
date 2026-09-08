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

// Keep the verifier Node-runtime safe: read the Cloudflare middleware source instead
// of importing an edge-runtime module into Node. This avoids accidental execution of
// request handlers during CI while still checking the same public-truth replacements.
const truthGuardFile = path.join(ROOT, 'functions', '_middleware.js');
if (!fs.existsSync(truthGuardFile)) throw new Error('Homepage truth guard middleware is missing.');
const truthGuardSource = fs.readFileSync(truthGuardFile, 'utf8');

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
    sourceFragment: 'Cloudflare',
    replacement: 'anti-bot resilient where permitted'
  },
  {
    sourceFragment: 'Bypass',
    replacement: 'anti-bot resilient where permitted'
  },
  {
    sourceFragment: 'We support bKash, Nagad, Stripe Credit/Debit cards',
    replacement: 'Payment options are offered only when a corresponding provider integration is configured and independently verified.'
  }
];

for (const requirement of requiredReplacements) {
  const sourceFound = requirement.source
    ? truthGuardSource.includes(requirement.source)
    : truthGuardSource.includes(requirement.sourceFragment);
  if (!sourceFound) {
    const label = requirement.source ?? requirement.sourceFragment;
    throw new Error(`Truth guard source marker missing: ${label}`);
  }

  if (!truthGuardSource.includes(requirement.replacement)) {
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
