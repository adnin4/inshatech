import fs from 'node:fs/promises';

const CHECKOUT = new URL('../functions/api/payments/checkout.js', import.meta.url);
const source = await fs.readFile(CHECKOUT, 'utf8');

const failures = [];

// Only persistence/query references are forbidden. Public API request/response fields
// such as customer_email and amount_usd remain intentionally compatible.
const forbiddenDbPatterns = [
  /ibos_orders[^\n]*payment_gateway/,
  /\bpayment_gateway\s*:/,
  /\bservice_name\s*:/,
  /\bcustomer_name\s*:/,
  /\bcustomer_email\s*:/,
  /\bcustomer_phone\s*:/,
];

for (const pattern of forbiddenDbPatterns) {
  if (pattern.test(source)) failures.push(`forbidden DB contract reference: ${pattern}`);
}

const canonicalDbFields = [
  'service_id',
  'service_slug',
  'service_title',
  'package_name',
  'amount',
  'currency',
  'bdt_amount',
  'client_name',
  'client_email',
  'client_phone',
  'payment_provider',
  'payment_status',
  'order_status',
  'idempotency_key',
  'metadata',
];

for (const field of canonicalDbFields) {
  if (!source.includes(field)) failures.push(`missing canonical field reference: ${field}`);
}

if (failures.length) {
  console.error('PAYMENT_SCHEMA_CODE_PARITY=FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PAYMENT_SCHEMA_CODE_PARITY=PASS');
