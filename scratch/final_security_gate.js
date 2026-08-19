const fs = require('fs');
const path = require('path');
let failures = 0;
const fail = (m) => { console.error(`FAIL: ${m}`); failures++; };
const read = (p) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

const auth = read('functions/api/auth/session.js');
const gate = read('functions/api/admin/gate.js');
const checkout = read('functions/api/payments/checkout.js');
const webhook = read('functions/api/payments/webhook.js');
const version = read('functions/api/system/version.js');

// Production code must never contain credential/JWT fallback secrets.
for (const [name, src] of [['auth', auth], ['gate', gate], ['checkout', checkout], ['version', version]]) {
  if (/iinsha_enterprise_master_jwt_secret_2026|iinsha_order_token_signing_secret_2026/.test(src)) fail(`${name}: hardcoded secret fallback detected`);
}
if (/refresh_token\s*\)/.test(auth) && /ROTATED/.test(auth)) fail('auth: refresh token can mint a new session without durable validation');
if (!/MFA_SECRET/.test(auth)) fail('auth: MFA configuration gate missing');
if (!/env\.JWT_SECRET/.test(auth)) fail('auth: JWT_SECRET is not explicitly required');
if (/origin\.endsWith\('\.pages\.dev'\)/.test(auth) || /origin\.endsWith\('\.pages\.dev'\)/.test(gate)) fail('CORS: arbitrary pages.dev origin accepted');

// Admin gate must fail closed if JWT secret is absent.
if (/\|\|\s*'iinsha_enterprise_master_jwt_secret_2026'/.test(gate)) fail('admin gate: JWT secret fallback detected');
if (!/exp/.test(gate)) fail('admin gate: expiration validation missing');

// Payment path must not claim persistence when storage is unavailable.
if (/STORAGE_CONTRACT_READY/.test(checkout)) fail('checkout: non-persisted orders can be reported as successful');
if (!/idempotency_key/.test(checkout)) fail('checkout: idempotency key missing');
if (!/CANONICAL_CATALOG/.test(checkout)) fail('checkout: server catalog missing');

// Webhook must reject missing secret and validate signature before processing.
if (!/if \(!secretKey\)/.test(webhook)) fail('webhook: missing-secret fail-closed gate absent');
if (!/Invalid or forged cryptographic webhook signature/.test(webhook)) fail('webhook: signature rejection path missing');

// Version endpoint must not invent a SHA when deployment metadata is absent.
if (/62a8e545b2972d1af8f0181ee440985cfde2d01d/.test(version)) fail('version: hardcoded fallback SHA detected');
if (/response_time_ms:\s*18/.test(version)) fail('version: fabricated fixed latency metric detected');

if (failures) { console.error(`Security gate failed with ${failures} issue(s).`); process.exit(1); }
console.log('FINAL SECURITY GATE: PASS');
