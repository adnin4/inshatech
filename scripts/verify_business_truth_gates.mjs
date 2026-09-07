import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const engine = await readFile(new URL('../ai_brain/autonomous_business_engine.js', import.meta.url), 'utf8');
const verifier = await readFile(new URL('../ai_brain/independent_qa_verifier.js', import.meta.url), 'utf8');

// Consequential payment success must require an injected verifier and idempotency key.
assert.match(engine, /!idempotencyKey/);
assert.match(engine, /!this\.webhookVerifier/);
assert.match(engine, /WEBHOOK_SIGNATURE_INVALID/);
assert.match(engine, /BLOCKED_INVALID_PAYMENT_EVIDENCE/);
assert.doesNotMatch(engine, /verifiedHmac:\s*true[\s\S]*?saveOrder/);

// Checkout must use a real adapter, never a sample checkout URL.
assert.match(engine, /!this\.checkoutProvider/);
assert.match(engine, /checkoutProvider\.createCheckout/);
assert.doesNotMatch(engine, /checkout\.stripe\.com\/pay\/sample/);

// Project delivery must not bypass payment, QA evidence, or explicit client approval.
assert.match(engine, /BLOCKED_PAYMENT_NOT_VERIFIED/);
assert.match(engine, /BLOCKED_QA/);
assert.match(engine, /BLOCKED_CLIENT_APPROVAL_REQUIRED/);
assert.match(engine, /clientApprovalEvidenceRef/);

// QA must reject missing evidence and must not hard-code verification checks to true.
assert.match(verifier, /BLOCKED_INSUFFICIENT_EVIDENCE/);
assert.match(verifier, /missingEvidence/);
assert.doesNotMatch(verifier, /functionalCorrectness:\s*true/);
assert.doesNotMatch(verifier, /priceTamperProtected:\s*true/);
assert.doesNotMatch(verifier, /accessibilityWcagPass:\s*true/);

console.log('Business truth gates: PASS');
