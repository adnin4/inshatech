import fs from 'node:fs/promises';

const CHECKOUT = new URL('../functions/api/payments/checkout.js', import.meta.url);
const source = await fs.readFile(CHECKOUT, 'utf8');

const forbidden = [
  'payment_gateway',
  'service_name',
  'amount_usd',
  'amount_bdt',
  'customer_name',
  'customer_email',
  'customer_phone',
];

const canonical = [
  'service_id',
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

const failures = [];
for (const field of forbidden) {
  if (source.includes(field)) failures.push(`forbidden legacy field reference: ${field}`);
}
for (const field of canonical) {
  if (!source.includes(field)) failures.push(`missing canonical field reference: ${field}`);
}

if (failures.length) {
  console.error('PAYMENT_SCHEMA_CODE_PARITY=FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PAYMENT_SCHEMA_CODE_PARITY=PASS');
