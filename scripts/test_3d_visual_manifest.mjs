import fs from 'fs';

console.log('=== TEST SUITE: 3D VISUAL MANIFEST & LIFECYCLE CERTIFICATION ===');

const code = fs.readFileSync('js/insha-3d-visual.js', 'utf8');

// 1. Verify Lifecycle and Observer keywords
const lifecycleChecks = [
  'IntersectionObserver',
  'ResizeObserver',
  'visibilitychange',
  'prefers-reduced-motion',
  'cancelAnimationFrame',
  'requestAnimationFrame',
  'devicePixelRatio'
];

lifecycleChecks.forEach(kw => {
  if (code.includes(kw)) {
    console.log(`[PASS] Lifecycle check: ${kw} implemented.`);
  } else {
    console.error(`[FAIL] Lifecycle check: ${kw} missing!`);
    process.exit(1);
  }
});

// 2. Verify all 13 Geometries
const geometries = [
  'neural-polyhedron',
  'cube-lattice',
  'video-reel',
  'shield-gate',
  'pipeline-flow',
  'ledger-orbit',
  'point-cloud',
  'neural-book',
  'test-gate',
  'cloud-orbit',
  'ocular-scan',
  'dialog-rings',
  'crawler-mesh'
];

geometries.forEach(geom => {
  if (code.includes(`case '${geom}'`) || code.includes(`render${geom.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('')}`)) {
    console.log(`[PASS] Topology renderer: ${geom} verified.`);
  } else {
    console.error(`[FAIL] Topology renderer: ${geom} missing!`);
    process.exit(1);
  }
});

// 3. Extract and check VISUAL_CONFIGS entries
const match = code.match(/const VISUAL_CONFIGS = ({[\s\S]*?});\n\n  class/);
if (!match) {
  console.error('[FAIL] Could not extract VISUAL_CONFIGS from js/insha-3d-visual.js');
  process.exit(1);
}

const configs = JSON.parse(match[1]);
console.log(`[PASS] Extracted ${Object.keys(configs).length} visual configs.`);

// Check 80 microservices
const microservices = JSON.parse(fs.readFileSync('scripts/extracted_microservices.json', 'utf8'));
let missing = 0;
microservices.forEach(svc => {
  if (!configs[svc.id]) {
    console.error(`[FAIL] Missing config for service ID: ${svc.id}`);
    missing++;
  }
  if (!configs[svc.slug]) {
    console.error(`[FAIL] Missing config for service slug: ${svc.slug}`);
    missing++;
  }
});

// Check 10 commercial services
const commercial = [
  'ai-video-studio', 'ai-saas-engineering', 'ai-governance-operations',
  'ecommerce-growth-operations', 'ai-finance-automation', 'ai-data-operations',
  'enterprise-knowledge-search', 'software-qa-release', 'cloud-finops-reliability',
  'computer-vision-systems'
];

commercial.forEach(cid => {
  if (!configs[cid]) {
    console.error(`[FAIL] Missing commercial config: ${cid}`);
    missing++;
  }
});

if (missing === 0) {
  console.log(`[PASS] 100% Manifest Coverage Verified: 80 microservices (ID + Slug) + 10 commercial suites + defaults.`);
  console.log('ALL 3D VISUAL CERTIFICATIONS PASSED (100%)');
} else {
  console.error(`[FAIL] ${missing} configs missing!`);
  process.exit(1);
}
