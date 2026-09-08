import fs from 'node:fs/promises';

const CHECKOUT = new URL('../functions/api/payments/checkout.js', import.meta.url);
const source = await fs.readFile(CHECKOUT, 'utf8');

const failures = [];

// Service identity must be resolved from the canonical database, not a static catalog.
if (/const\s+CATALOG\s*=/.test(source)) {
  failures.push('static CATALOG must not be an authority in checkout.js');
}
if (!source.includes('ibos_services')) failures.push('missing ibos_services authority lookup');
if (!source.includes("status=eq.published")) failures.push('published service filter missing');
if (!source.includes('service_id') || !source.includes('service_slug')) {
  failures.push('service identity compatibility/canonical fields missing');
}

// Selected package price must be authoritative for the order amount.
if (!source.includes('resolvePackage')) failures.push('package resolver missing');
if (!source.includes('packageSelection.price')) failures.push('package price is not used as authoritative amount');
if (/Math\.max\(Number\(item\[2\]\)/.test(source)) {
  failures.push('static catalog minimum price must not override database/package authority');
}
if (!source.includes('package_name: packageSelection.name')) {
  failures.push('canonical package_name persistence missing');
}

// Fail closed when service/package configuration is invalid.
for (const required of [
  'SERVICE_NOT_AVAILABLE',
  'INVALID_PACKAGE',
  'INVALID_SERVICE_CONFIGURATION',
  'INVALID_FINAL_PRICE'
]) {
  if (!source.includes(required)) failures.push(`missing fail-closed error: ${required}`);
}

// Provider selection must be explicit and bounded before an order is created.
if (!source.includes('SUPPORTED_PROVIDERS')) failures.push('provider allowlist missing');
if (!source.includes('UNSUPPORTED_PAYMENT_PROVIDER')) failures.push('unsupported provider fail-closed path missing');

if (failures.length) {
  console.error('SERVICE_AUTHORITY_AND_PRICING=FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SERVICE_AUTHORITY_AND_PRICING=PASS');
