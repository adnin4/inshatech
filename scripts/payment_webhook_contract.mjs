import fs from 'node:fs';

const source = fs.readFileSync('functions/api/payments/webhook.js', 'utf8');

const required = [
  "if (!env.WEBHOOK_SECRET)",
  "if (!signature)",
  "eventId",
  "duplicateRows",
  "signature_verified: true",
  "provider,",
  "order_code: orderCode || null",
  "DURABLE_EVENT_WRITE_FAILED",
  "ORDER_NOT_UNIQUELY_RESOLVED"
];

for (const marker of required) {
  if (!source.includes(marker)) {
    throw new Error(`Missing payment security contract marker: ${marker}`);
  }
}

console.log('PAYMENT_WEBHOOK_CONTRACT=PASS');
