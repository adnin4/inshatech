import fs from 'node:fs/promises';

const CHECKOUT = new URL('../functions/api/payments/checkout.js', import.meta.url);
const WEBHOOK = new URL('../functions/api/payments/webhook.js', import.meta.url);
const RETURN = new URL('../functions/api/payments/return.js', import.meta.url);
const SSL_VALIDATE = new URL('../functions/api/payments/sslcommerz/validate.js', import.meta.url);
const LEMON_WEBHOOK = new URL('../functions/api/payments/lemonsqueezy/webhook.js', import.meta.url);

const checkoutSource = await fs.readFile(CHECKOUT, 'utf8');
const webhookSource = await fs.readFile(WEBHOOK, 'utf8');
const returnSource = await fs.readFile(RETURN, 'utf8');
const sslValidateSource = await fs.readFile(SSL_VALIDATE, 'utf8');
const lemonWebhookSource = await fs.readFile(LEMON_WEBHOOK, 'utf8');

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
  if (pattern.test(checkoutSource)) failures.push(`checkout.js: forbidden DB contract reference: ${pattern}`);
}

// Ensure webhook, return and adapters do not query or mutate forbidden DB columns
if (/ibos_orders[^\n]*payment_gateway/.test(webhookSource)) {
  failures.push('webhook.js: forbidden DB contract reference: ibos_orders...payment_gateway');
}
if (/ibos_orders[^\n]*service_name/.test(returnSource)) {
  failures.push('return.js: forbidden DB contract reference: ibos_orders...service_name');
}
if (/\bpayment_gateway\s*:/.test(sslValidateSource)) {
  failures.push('sslcommerz/validate.js: forbidden DB contract reference: payment_gateway:');
}
if (/\bpayment_gateway\s*:/.test(lemonWebhookSource)) {
  failures.push('lemonsqueezy/webhook.js: forbidden DB contract reference: payment_gateway:');
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
  if (!checkoutSource.includes(field)) failures.push(`checkout.js: missing canonical field reference: ${field}`);
}

if (failures.length) {
  console.error('PAYMENT_SCHEMA_CODE_PARITY=FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PAYMENT_SCHEMA_CODE_PARITY=PASS');
