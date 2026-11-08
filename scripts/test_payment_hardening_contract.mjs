import { onRequestPost as checkoutPost } from '../functions/api/payments/checkout.js';
import { onRequestPost as webhookPost } from '../functions/api/payments/webhook.js';
import { onRequestGet as returnGet, onRequestPost as returnPost } from '../functions/api/payments/return.js';
import { onRequest as paymentMiddleware } from '../functions/api/payments/_middleware.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log('  [PASS] ' + message);
        passed++;
    } else {
        console.error('  [FAIL] ' + message);
        process.exitCode = 1;
    }
}

async function runTests() {
    console.log('================================================================================');
    console.log('IINSHA AI-BOS: PAYMENT LAYER HARDENING & BROWSER RETURN CONTRACT TEST');
    console.log('================================================================================\n');

    // TEST 1: Rejection of unknown service_id before any external dependency.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: '',
                customer_email: 'client@example.com',
                amount: 10
            })
        });
        const res = await checkoutPost({ request: req, env: {} });
        const json = await res.json();
        assert(res.status === 400 && json.code === 'INVALID_SERVICE_ID', 'Rejects missing service_id with HTTP 400');
    }

    // TEST 2: Rejection of invalid customer email.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: 'b2b-lead-swarm',
                customer_email: 'invalid-email-no-at',
                amount: 850
            })
        });
        const res = await checkoutPost({ request: req, env: {} });
        const json = await res.json();
        assert(res.status === 400 && json.code === 'INVALID_CUSTOMER_EMAIL', 'Rejects malformed customer email with HTTP 400');
    }

    // TEST 3: Server catalog authority overrides client-side amount.
    // The catalog lookup and order insert are mocked so CI never needs live Supabase.
    {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, options = {}) => {
            const urlStr = String(url);
            if (urlStr.includes('/ibos_orders?idempotency_key=')) {
                return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (urlStr.includes('/ibos_services?')) {
                return new Response(JSON.stringify([{
                    id: '11111111-1111-4111-8111-111111111111',
                    slug: 'b2b-lead-swarm',
                    title: 'B2B Lead Swarm',
                    price: 850,
                    packages: [{ name: 'Standard', price: 850, delivery_days: 7 }]
                }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (urlStr.endsWith('/ibos_orders')) {
                return new Response(JSON.stringify([{
                    order_code: 'ORD-TEST-AUTH-001',
                    service_id: '11111111-1111-4111-8111-111111111111',
                    service_slug: 'b2b-lead-swarm',
                    service_title: 'B2B Lead Swarm',
                    package_name: 'Standard',
                    amount: 850,
                    currency: 'USD',
                    bdt_amount: Math.round(850 * 122.5),
                    payment_provider: 'sslcommerz',
                    payment_status: 'awaiting_payment',
                    order_status: 'pending',
                    metadata: {}
                }]), { status: 201, headers: { 'Content-Type': 'application/json' } });
            }
            return originalFetch(url, options);
        };

        try {
            const req = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_email: 'client@example.com',
                    amount: 1,
                    idempotency_key: 'ci-authority-test-001'
                })
            });
            const res = await checkoutPost({
                request: req,
                env: {
                    SUPABASE_URL: 'https://mock.supabase.co',
                    SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key'
                }
            });
            const json = await res.json();
            assert(
                (json.amount_bdt === Math.round(850 * 122.5) || json.amount_usd === 850) && json.amount_usd !== 1,
                'Server catalog strictly enforces authoritative price and ignores client-side amount tampering'
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    // TEST 4: Webhook rejects missing signature when secret is configured.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'order_created',
                data: { id: 'evt_test_123', attributes: { status: 'paid' } }
            })
        });
        const res = await webhookPost({
            request: req,
            env: { LEMONSQUEEZY_WEBHOOK_SECRET: 'ls_secret_2026' }
        });
        assert(res.status === 401, 'Rejects webhook when secret is configured but signature header is missing');
    }

    // TEST 5: Webhook rejects invalid signature.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': 'invalid_bad_signature_hex'
            },
            body: JSON.stringify({
                type: 'order_created',
                data: { id: 'evt_test_123', attributes: { status: 'paid' } }
            })
        });
        const res = await webhookPost({
            request: req,
            env: { LEMONSQUEEZY_WEBHOOK_SECRET: 'ls_secret_2026' }
        });
        assert(res.status === 401, 'Rejects webhook when signature is invalid (Fail-Closed)');
    }

    // TEST 6: Read-Only Browser Return Endpoint (GET).
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/return?order_id=ORD-TEST-101&status=success', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const res = await returnGet({ request: req, env: {} });
        const json = await res.json();
        assert(
            res.status === 200 && json.status === 'BROWSER_RETURN_RECORDED' && json.order_id === 'ORD-TEST-101',
            'Browser return endpoint handles GET and returns read-only portal redirect payload'
        );
    }

    // TEST 7: Read-Only Browser Return Endpoint rejects POST.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: 'ORD-TEST-102' })
        });
        const res = await returnPost({ request: req, env: {} });
        assert(res.status === 405, 'Browser return endpoint rejects POST requests with HTTP 405 Method Not Allowed');
    }

    // TEST 8: Scoped middleware intercepts browser GET on the webhook path.
    {
        const req = new Request('https://inshatech.pages.dev/api/payments/webhook?order_id=ORD-TEST-103&status=success', {
            method: 'GET'
        });
        const res = await paymentMiddleware({
            request: req,
            next: () => new Response('UNEXPECTED_NEXT')
        });
        assert(
            res.status === 302 && res.headers.get('Location') === 'https://inshatech.pages.dev/api/payments/return?order_id=ORD-TEST-103&status=success',
            'Scoped middleware intercepts browser GET on webhook and redirects to /api/payments/return'
        );
    }

    console.log('\n================================================================================');
    console.log('PAYMENT HARDENING CONTRACT SUMMARY: ' + passed + '/' + total + ' ASSERTIONS PASSED!');
    console.log('================================================================================\n');
}

runTests();
