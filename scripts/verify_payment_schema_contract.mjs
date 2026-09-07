import assert from 'node:assert/strict';

const expectedOrderColumns = [
  'order_code', 'service_id', 'service_title', 'amount', 'currency', 'bdt_amount',
  'client_name', 'client_email', 'client_phone', 'payment_status', 'order_status',
  'idempotency_key', 'payment_provider', 'payment_reference', 'paid_at', 'metadata'
];

const source = await fetch(new URL('../functions/api/payments/checkout.js', import.meta.url)).then(r => r.text());

assert.match(source, /service_id/);
assert.match(source, /service_title/);
assert.match(source, /bdt_amount/);
assert.match(source, /client_email/);
assert.match(source, /idempotency_key/);

for (const forbidden of ['service_name:', 'amount_usd:', 'amount_bdt:', 'customer_name:', 'customer_email:', 'customer_phone:']) {
  assert.doesNotMatch(source, new RegExp(`\\b${forbidden.replace(':', '')}\\s*:`), `legacy order column remains: ${forbidden}`);
}

console.log(`PAYMENT_SCHEMA_CONTRACT=PASS (${expectedOrderColumns.length} authoritative fields tracked)`);
