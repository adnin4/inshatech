import fs from 'node:fs/promises';
import { onRequestPost as checkoutPost } from '../functions/api/payments/checkout.js';

const CHECKOUT = new URL('../functions/api/payments/checkout.js', import.meta.url);
const source = await fs.readFile(CHECKOUT, 'utf8');

const failures = [];

// =============================================================================
// SUITE 1: Static Architecture & Code Parity Invariants
// =============================================================================

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
  console.error('SERVICE_AUTHORITY_AND_PRICING=FAIL (STATIC)');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

// =============================================================================
// SUITE 2 & 3: Runtime Contract Execution & Adversarial Verification
// =============================================================================

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passedAssertions++;
  } else {
    console.error(`  [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

const mockEnv = {
  SUPABASE_URL: 'https://mock.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key',
  SSLCOMMERZ_STORE_ID: 'mock_store',
  SSLCOMMERZ_STORE_PASSWORD: 'mock_password'
};

const CANONICAL_SERVICE_UUID = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
const CANONICAL_SERVICE_TITLE = 'B2B SaaS 5-Agent Hunter Swarm';

async function runRuntimeSuite() {
  console.log('\n--- SUITE 2: Step 02 Service UUID Authority Runtime Gates ---');

  const originalFetch = globalThis.fetch;
  try {
    let capturedOrderPayload = null;

    globalThis.fetch = async (url, opts = {}) => {
      const urlStr = String(url);

      // 1. Service lookup router
      if (urlStr.includes('/ibos_services?')) {
        if (urlStr.includes('slug=eq.b2b-lead-swarm') && urlStr.includes('status=eq.published')) {
          return new Response(JSON.stringify([{
            id: CANONICAL_SERVICE_UUID,
            slug: 'b2b-lead-swarm',
            title: CANONICAL_SERVICE_TITLE,
            price: 850,
            packages: [
              { name: 'Standard', price: 850, delivery_days: 3 },
              { name: 'Enterprise', price: 1500, delivery_days: 7 }
            ]
          }]), { status: 200 });
        }

        if (urlStr.includes('slug=eq.duplicate-service')) {
          // Returns 2 services to test fail-closed duplicate guard
          return new Response(JSON.stringify([
            { id: 'uuid-1', slug: 'duplicate-service', title: 'Dup 1', price: 100, packages: [] },
            { id: 'uuid-2', slug: 'duplicate-service', title: 'Dup 2', price: 100, packages: [] }
          ]), { status: 200 });
        }

        // Default: service not found or unpublished
        return new Response(JSON.stringify([]), { status: 200 });
      }

      // 2. Idempotency check
      if (urlStr.includes('/ibos_orders?idempotency_key=eq.')) {
        return new Response(JSON.stringify([]), { status: 200 });
      }

      // 3. Order insertion
      if (urlStr.includes('/ibos_orders') && opts.method === 'POST') {
        capturedOrderPayload = JSON.parse(opts.body);
        return new Response(JSON.stringify([capturedOrderPayload]), { status: 201 });
      }

      // 4. SSLCommerz initiation mock
      if (urlStr.includes('gwprocess/v4/api.php')) {
        return new Response(JSON.stringify({
          status: 'SUCCESS',
          GatewayPageURL: 'https://securepay.sslcommerz.com/easycheckout.php?session=MOCK_SESSION'
        }), { status: 200 });
      }

      return originalFetch(url, opts);
    };

    // Test 2.1: Valid published slug resolves canonical UUID
    {
      capturedOrderPayload = null;
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 200 &&
        capturedOrderPayload?.service_id === CANONICAL_SERVICE_UUID &&
        capturedOrderPayload?.service_title === CANONICAL_SERVICE_TITLE,
        'Step 02: Valid service slug resolves canonical DB UUID and authoritative service title'
      );
    }

    // Test 2.2: Unknown slug rejected
    {
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'unknown-fake-service',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        (res.status === 400 || res.status === 409) && (json.code === 'INVALID_SERVICE_ID' || json.code === 'SERVICE_NOT_AVAILABLE'),
        'Step 02: Unknown service slug rejected by server authority'
      );
    }

    // Test 2.3: Unpublished slug rejected (DB returns empty for status=published)
    {
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          service_slug: 'draft-unpublished-service',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 409 && json.code === 'SERVICE_NOT_AVAILABLE',
        'Step 02: Unpublished service rejected with 409 SERVICE_NOT_AVAILABLE'
      );
    }

    // Test 2.4: Duplicate slug collision fails closed
    {
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          service_slug: 'duplicate-service',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 409 && json.code === 'SERVICE_NOT_AVAILABLE',
        'Step 02: Duplicate service slug collision strictly fails closed with 409'
      );
    }

    // Test 2.5: Client-provided title and price are untrusted and overridden
    {
      capturedOrderPayload = null;
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          service_title: 'HACKED_FAKE_TITLE',
          amount: 1,
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      assert(
        res.status === 200 &&
        capturedOrderPayload?.service_title === CANONICAL_SERVICE_TITLE &&
        capturedOrderPayload?.amount === 850,
        'Step 02: Client-provided service_title and amount are untrusted and overridden by DB authority'
      );
    }

    console.log('\n--- SUITE 3: Step 03 Package & Price Authority Runtime Gates ---');

    // Test 3.1: Client tampering with $1 price
    {
      capturedOrderPayload = null;
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          amount: 1.00,
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 200 && json.amount_usd === 850 && capturedOrderPayload?.amount === 850,
        'Step 03: Client amount $1.00 ignored; DB authoritative price ($850) enforced'
      );
    }

    // Test 3.2: Client tampering with negative price
    {
      capturedOrderPayload = null;
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          amount: -500.00,
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 200 && json.amount_usd === 850 && capturedOrderPayload?.amount === 850,
        'Step 03: Client negative amount ignored; DB authoritative price ($850) enforced'
      );
    }

    // Test 3.3: Requesting invalid package name rejected with 409
    {
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          package_name: 'NonExistentPackageTier',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 409 && json.code === 'INVALID_PACKAGE',
        'Step 03: Requesting unavailable package tier rejected with 409 INVALID_PACKAGE'
      );
    }

    // Test 3.4: Legitimate package tier selection (Enterprise) priced authoritatively
    {
      capturedOrderPayload = null;
      const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: 'b2b-lead-swarm',
          package_name: 'Enterprise',
          customer_name: 'Test Client',
          customer_email: 'client@example.com'
        })
      });
      const res = await checkoutPost({ request: req, env: mockEnv });
      const json = await res.json();
      assert(
        res.status === 200 &&
        json.amount_usd === 1500 &&
        capturedOrderPayload?.amount === 1500 &&
        capturedOrderPayload?.package_name === 'Enterprise',
        'Step 03: Selected Enterprise package resolves authoritative tier price ($1500)'
      );
    }

  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log(`\nSERVICE AUTHORITY & PRICING SUMMARY: ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED!`);
  if (passedAssertions !== totalAssertions) {
    process.exit(1);
  }
}

await runRuntimeSuite();
console.log('SERVICE_AUTHORITY_AND_PRICING=PASS');
