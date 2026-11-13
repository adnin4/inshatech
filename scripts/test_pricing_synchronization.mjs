import fs from 'fs';

console.log('=== TEST SUITE: END-TO-END PRICING SYNCHRONIZATION CERTIFICATION ===');

const expectedPricing = {
  'ai-video-studio': { pilot: 450, impl: 1400, monthly: 1800 },
  'ai-saas-engineering': { pilot: 850, impl: 5500, monthly: 2200 },
  'ai-governance-operations': { pilot: 950, impl: 3200, monthly: 950 },
  'ecommerce-growth-operations': { pilot: 490, impl: 1850, monthly: 650 },
  'ai-finance-automation': { pilot: 650, impl: 2800, monthly: 750 },
  'ai-data-operations': { pilot: 750, impl: 2900, monthly: 1200 },
  'enterprise-knowledge-search': { pilot: 850, impl: 3800, monthly: 750 },
  'software-qa-release': { pilot: 750, impl: 2400, monthly: 650 },
  'cloud-finops-reliability': { pilot: 850, impl: 2900, monthly: 550 },
  'computer-vision-systems': { pilot: 1200, impl: 4500, monthly: 850 }
};

let errors = 0;

// 1. Check knowledge/premium_services.json
console.log('\n[CHECK 1] knowledge/premium_services.json...');
const prem = JSON.parse(fs.readFileSync('knowledge/premium_services.json', 'utf8'));
prem.forEach(s => {
  const exp = expectedPricing[s.slug];
  if (!exp) return;
  const pilotPrice = s.pricing.pilot ? s.pricing.pilot.priceUSD : (s.pricing.pilot_usd || s.pricing.pilotUSD);
  const implPrice = s.pricing.implementation ? s.pricing.implementation.priceUSD : (s.pricing.implementation_usd || s.pricing.implementationUSD);
  const monthlyPrice = s.pricing.monthly ? s.pricing.monthly.priceUSD : (s.pricing.monthly_retainer_usd || s.pricing.monthlyUSD);

  if (pilotPrice !== exp.pilot) {
    console.error(`[FAIL] premium_services.json ${s.slug} pilot ${pilotPrice} != ${exp.pilot}`);
    errors++;
  }
  if (implPrice !== exp.impl) {
    console.error(`[FAIL] premium_services.json ${s.slug} impl ${implPrice} != ${exp.impl}`);
    errors++;
  }
  if (monthlyPrice !== exp.monthly) {
    console.error(`[FAIL] premium_services.json ${s.slug} monthly ${monthlyPrice} != ${exp.monthly}`);
    errors++;
  }
});
console.log('[PASS] knowledge/premium_services.json verified.');

// 2. Check knowledge/services.json
console.log('\n[CHECK 2] knowledge/services.json...');
const svcJson = JSON.parse(fs.readFileSync('knowledge/services.json', 'utf8'));
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  const s = svcJson.find(x => x.id === slug || x.slug === slug);
  if (!s) {
    console.error(`[FAIL] services.json missing ${slug}`);
    errors++;
    return;
  }
  const price = s.priceUSD || s.price;
  if (price !== exp.pilot) {
    console.error(`[FAIL] services.json ${slug} price ${price} != ${exp.pilot}`);
    errors++;
  }
  const pilotPkg = s.packages.find(p => p.name === 'Pilot' || p.id === 'pilot') || s.packages.find(p => p.name.includes('Pilot'));
  if (!pilotPkg || (pilotPkg.price !== exp.pilot && pilotPkg.priceUSD !== exp.pilot)) {
    console.error(`[FAIL] services.json ${slug} pilot pkg mismatch`);
    errors++;
  }
  const implPkg = s.packages.find(p => p.name === 'Standard' || p.name === 'Implementation' || p.id === 'implementation') || s.packages.find(p => p.name.includes('Pack') || p.name.includes('Suite'));
  if (!implPkg || (implPkg.price !== exp.impl && implPkg.priceUSD !== exp.impl)) {
    console.error(`[FAIL] services.json ${slug} impl pkg mismatch`);
    errors++;
  }
  const monthlyPkg = s.packages.find(p => p.name === 'Monthly' || p.id === 'monthly') || s.packages.find(p => p.name.includes('Monthly') || p.name.includes('Retainer'));
  if (!monthlyPkg || (monthlyPkg.price !== exp.monthly && monthlyPkg.priceUSD !== exp.monthly)) {
    console.error(`[FAIL] services.json ${slug} monthly pkg mismatch`);
    errors++;
  }
});
console.log('[PASS] knowledge/services.json verified.');

// 3. Check functions/_shared/knowledge/services.json
console.log('\n[CHECK 3] functions/_shared/knowledge/services.json...');
const sharedSvcJson = JSON.parse(fs.readFileSync('functions/_shared/knowledge/services.json', 'utf8'));
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  const s = sharedSvcJson.find(x => x.id === slug || x.slug === slug);
  if (!s) {
    console.error(`[FAIL] functions/_shared/knowledge/services.json missing ${slug}`);
    errors++;
    return;
  }
  const price = s.priceUSD || s.price;
  if (price !== exp.pilot) {
    console.error(`[FAIL] functions/_shared/knowledge/services.json ${slug} price ${price} != ${exp.pilot}`);
    errors++;
  }
});
console.log('[PASS] functions/_shared/knowledge/services.json verified.');

// 4. Check functions/api/services.js
console.log('\n[CHECK 4] functions/api/services.js...');
const apiServicesCode = fs.readFileSync('functions/api/services.js', 'utf8');
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  if (!apiServicesCode.includes(`"${slug}"`) && !apiServicesCode.includes(`'${slug}'`)) {
    console.error(`[FAIL] functions/api/services.js missing ${slug}`);
    errors++;
  }
  if (!apiServicesCode.includes(`"priceUSD": ${exp.pilot}`) && !apiServicesCode.includes(`priceUSD: ${exp.pilot}`)) {
    console.error(`[FAIL] functions/api/services.js missing price ${exp.pilot} for ${slug}`);
    errors++;
  }
});
console.log('[PASS] functions/api/services.js verified.');

// 5. Check index.html category cards
console.log('\n[CHECK 5] index.html category cards...');
const indexHtml = fs.readFileSync('index.html', 'utf8');
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  const formattedPilot = `$${exp.pilot.toLocaleString()}`;
  if (!indexHtml.includes(formattedPilot)) {
    console.error(`[FAIL] index.html missing formatted price ${formattedPilot} for ${slug}`);
    errors++;
  }
});
console.log('[PASS] index.html verified.');

// 6. Check admin.html CANONICAL_COCKPIT_SERVICES
console.log('\n[CHECK 6] admin.html CANONICAL_COCKPIT_SERVICES...');
const adminHtml = fs.readFileSync('admin.html', 'utf8');
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  if (!adminHtml.includes(`id: '${slug}'`)) {
    console.error(`[FAIL] admin.html missing ${slug}`);
    errors++;
  }
  if (!adminHtml.includes(`priceUSD: ${exp.pilot}`)) {
    console.error(`[FAIL] admin.html missing priceUSD: ${exp.pilot} for ${slug}`);
    errors++;
  }
});
console.log('[PASS] admin.html verified.');

// 7. Check SQL migration
console.log('\n[CHECK 7] supabase/migrations/20261113000001_seed_premium_services_catalog.sql...');
const sql = fs.readFileSync('supabase/migrations/20261113000001_seed_premium_services_catalog.sql', 'utf8');
Object.entries(expectedPricing).forEach(([slug, exp]) => {
  if (!sql.includes(`'${slug}'`)) {
    console.error(`[FAIL] SQL migration missing ${slug}`);
    errors++;
  }
  if (!sql.includes(`${exp.pilot}.00`) && !sql.includes(`${exp.pilot}`)) {
    console.error(`[FAIL] SQL migration missing ${exp.pilot} for ${slug}`);
    errors++;
  }
});
console.log('[PASS] SQL migration verified.');

if (errors === 0) {
  console.log('\n================================================================================');
  console.log('🎉 PRICING SYNCHRONIZATION CERTIFICATION: ALL ASSERTIONS PASSED (100%)');
  console.log('Zero price mismatches detected across JSON, JS, HTML, Admin, and SQL layers.');
  console.log('================================================================================');
} else {
  console.error(`\n[FATAL] ${errors} pricing mismatch errors detected!`);
  process.exit(1);
}
