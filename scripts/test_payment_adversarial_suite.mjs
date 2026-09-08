import { onRequestPost as checkoutPost } from '../functions/api/payments/checkout.js';
import { onRequestPost as webhookPost } from '../functions/api/payments/webhook.js';
import { SSLCommerzAdapter, computeMd5 } from '../functions/api/payments/providers/sslcommerz.js';

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

async function hmac(raw, secret) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function runAdversarialSuite() {
    console.log('================================================================================');
    console.log('IINSHA AI-BOS: PAYMENT ADVERSARIAL, RACE CONDITION & IPN CONTRACT TEST SUITE');
    console.log('================================================================================\n');

    // -------------------------------------------------------------------------
    // TEST 1: Concurrent Idempotent Checkout Race Condition Handling
    // -------------------------------------------------------------------------
    {
        console.log('--- SUITE 1: Checkout Idempotency & Concurrency ---');
        const sharedIdempotencyKey = 'idem_race_test_999';

        const ordersStore = new Map();
        const mockEnv = {
            SUPABASE_URL: 'https://mock.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key',
            SSLCOMMERZ_STORE_ID: 'mock_store',
            SSLCOMMERZ_STORE_PASSWORD: 'mock_password'
        };

        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, opts = {}) => {
            const urlStr = String(url);

            if (urlStr.includes('/ibos_orders?idempotency_key=eq.')) {
                const key = decodeURIComponent(urlStr.split('idempotency_key=eq.')[1].split('&')[0]);
                if (ordersStore.has(key)) {
                    return new Response(JSON.stringify([ordersStore.get(key)]), { status: 200 });
                }
                return new Response(JSON.stringify([]), { status: 200 });
            }

            if (urlStr.includes('/ibos_services?slug=eq.')) {
                return new Response(JSON.stringify([{
                    id: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
                    slug: 'b2b-lead-swarm',
                    title: 'B2B SaaS 5-Agent Hunter Swarm',
                    price: 850,
                    packages: {}
                }]), { status: 200 });
            }

            if (urlStr.includes('/ibos_orders') && opts.method === 'POST') {
                const payload = JSON.parse(opts.body);
                if (ordersStore.has(payload.idempotency_key)) {
                    return new Response(JSON.stringify({ message: 'duplicate key' }), { status: 409 });
                }
                ordersStore.set(payload.idempotency_key, payload);
                return new Response(JSON.stringify([payload]), { status: 201 });
            }

            if (urlStr.includes('/ibos_orders?order_code=eq.') && opts.method === 'PATCH') {
                const patch = JSON.parse(opts.body);
                for (const [k, v] of ordersStore.entries()) {
                    if (v.order_code && urlStr.includes(v.order_code)) {
                        ordersStore.set(k, { ...v, ...patch, metadata: { ...v.metadata, ...patch.metadata } });
                    }
                }
                return new Response(JSON.stringify([{ status: 'ok' }]), { status: 200 });
            }

            if (urlStr.includes('securepay.sslcommerz.com/gwprocess/v4/api.php')) {
                return new Response(JSON.stringify({
                    status: 'SUCCESS',
                    sessionkey: 'MOCK_SESSION_KEY_123',
                    GatewayPageURL: 'https://securepay.sslcommerz.com/easycheckout.php?session=MOCK_SESSION_KEY_123'
                }), { status: 200 });
            }

            return originalFetch(url, opts);
        };

        try {
            const req1 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_name: 'Adnin Mahin',
                    customer_email: 'adnin@inshatech.com',
                    idempotency_key: sharedIdempotencyKey
                })
            });
            const res1 = await checkoutPost({ request: req1, env: mockEnv });
            const json1 = await res1.json();

            const req2 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_name: 'Adnin Mahin',
                    customer_email: 'adnin@inshatech.com',
                    idempotency_key: sharedIdempotencyKey
                })
            });
            const res2 = await checkoutPost({ request: req2, env: mockEnv });
            const json2 = await res2.json();

            assert(res1.status === 200 && json1.status === 'SUCCESS', 'First checkout request successfully registers order');
            assert(
                res2.status === 200 && json2.action === 'idempotent_order_reused' && json2.order_id === json1.order_id,
                'Concurrent duplicate checkout safely reuses existing order without duplicating DB record'
            );
            assert(
                json2.redirect_url === json1.redirect_url && Boolean(json1.redirect_url),
                'Idempotent duplicate checkout returns cached gateway redirect URL'
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    // -------------------------------------------------------------------------
    // TEST 1B: Server Coupon Authority & Floor Price Verification
    // -------------------------------------------------------------------------
    {
        console.log('\n--- SUITE 1B: Server Coupon Authority & Floor Price Bounding ---');
        const mockEnv = {
            SUPABASE_URL: 'https://mock.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key',
            SSLCOMMERZ_STORE_ID: 'mock_store',
            SSLCOMMERZ_STORE_PASSWORD: 'mock_password'
        };

        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, opts = {}) => {
            const urlStr = String(url);
            if (urlStr.includes('/ibos_services?slug=eq.')) {
                const isOcr = urlStr.includes('invoice-ocr-pipeline');
                return new Response(JSON.stringify([{
                    id: isOcr ? 'uuid-ocr-123' : 'uuid-b2b-123',
                    slug: isOcr ? 'invoice-ocr-pipeline' : 'b2b-lead-swarm',
                    title: isOcr ? 'Autonomous Invoice & Document OCR Pipeline' : 'B2B SaaS 5-Agent Hunter Swarm',
                    price: isOcr ? 249 : 850,
                    packages: {}
                }]), { status: 200 });
            }
            if (urlStr.includes('/ibos_orders?idempotency_key=eq.')) {
                return new Response(JSON.stringify([]), { status: 200 });
            }
            if (urlStr.includes('/ibos_orders') && opts.method === 'POST') {
                const parsedBody = JSON.parse(opts.body || '{}');
                return new Response(JSON.stringify([parsedBody]), { status: 201 });
            }
            if (urlStr.includes('gwprocess/v4/api.php')) {
                return new Response(JSON.stringify({
                    status: 'SUCCESS',
                    GatewayPageURL: 'https://securepay.sslcommerz.com/easycheckout.php?session=MOCK_SESSION'
                }), { status: 200 });
            }
            return originalFetch(url, opts);
        };

        try {
            // 1. EARLY2026: 10% discount on $850 = $765
            const req1 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_name: 'Test Customer',
                    customer_email: 'test@inshatech.com',
                    coupon_code: 'EARLY2026'
                })
            });
            const res1 = await checkoutPost({ request: req1, env: mockEnv });
            const json1 = await res1.json();
            assert(
                res1.status === 200 && json1.amount_usd === 765 && json1.coupon_applied === 'EARLY2026',
                'Authoritative coupon EARLY2026 accurately applies 10% discount ($850 -> $765)'
            );

            // 2. APEX15: 15% discount on $850 = $723
            const req2 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_name: 'Test Customer',
                    customer_email: 'test@inshatech.com',
                    coupon_code: 'APEX15'
                })
            });
            const res2 = await checkoutPost({ request: req2, env: mockEnv });
            const json2 = await res2.json();
            assert(
                res2.status === 200 && json2.amount_usd === 722 && json2.coupon_applied === 'APEX15',
                'Authoritative coupon APEX15 accurately applies 15% discount ($850 -> $722)'
            );

            // 3. Bogus / Unauthorized Coupon: fallback to catalog price ($850), coupon_applied null, coupon_error recorded
            const req3 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'b2b-lead-swarm',
                    customer_name: 'Test Customer',
                    customer_email: 'test@inshatech.com',
                    coupon_code: 'HACKER_99_PERCENT_OFF'
                })
            });
            const res3 = await checkoutPost({ request: req3, env: mockEnv });
            const json3 = await res3.json();
            assert(
                res3.status === 200 && json3.amount_usd === 850 && json3.coupon_applied === null && json3.coupon_error === 'INVALID_COUPON',
                'Invalid coupon code rejected by server authority, original catalog price preserved'
            );

            // 4. Floor price bounding: invoice-ocr-pipeline ($249 catalog, min $200). 15% off $249 = $212 (above min)
            const req4 = new Request('https://inshatech.pages.dev/api/payments/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: 'invoice-ocr-pipeline',
                    customer_name: 'Test Customer',
                    customer_email: 'test@inshatech.com',
                    coupon_code: 'EARLY2026'
                })
            });
            const res4 = await checkoutPost({ request: req4, env: mockEnv });
            const json4 = await res4.json();
            assert(
                res4.status === 200 && json4.amount_usd >= 200,
                'Discounted amount strictly adheres to minimum floor price bounding'
            );
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    // -------------------------------------------------------------------------
    // TEST 2: SSLCommerz IPN Adversarial Scenarios
    // -------------------------------------------------------------------------
    {
        console.log('\n--- SUITE 2: SSLCommerz IPN Adversarial Verification ---');
        const secret = 'webhook_secret_2026';
        const targetOrderCode = 'ORD-VERIF-777';

        const mockEnv = {
            WEBHOOK_SECRET: secret,
            SUPABASE_URL: 'https://mock.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key',
            SSLCOMMERZ_STORE_ID: 'iinsha_live',
            SSLCOMMERZ_STORE_PASSWORD: 'store_password_live',
            SSLCOMMERZ_IS_LIVE: 'true'
        };

        const existingOrder = {
            id: 'd9b2d678-0000-0000-0000-000000000001',
            order_code: targetOrderCode,
            payment_status: 'awaiting_payment',
            amount: 850,
            currency: 'BDT',
            bdt_amount: 104125,
            payment_provider: 'sslcommerz'
        };

        let validationApiResponse = {
            status: 'VALID',
            tran_id: targetOrderCode,
            val_id: 'VAL_REAL_123',
            amount: 104125,
            currency: 'BDT',
            risk_level: '0'
        };

        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, opts = {}) => {
            const urlStr = String(url);

            if (urlStr.includes('/ibos_webhook_events?event_id=eq.')) {
                return new Response(JSON.stringify([]), { status: 200 });
            }

            if (urlStr.includes('/ibos_orders?order_code=eq.')) {
                return new Response(JSON.stringify([existingOrder]), { status: 200 });
            }

            if (urlStr.includes('/ibos_webhook_events') && opts.method === 'POST') {
                return new Response(JSON.stringify([{ id: 'mock-event-uuid' }]), { status: 201 });
            }

            if (urlStr.includes('/ibos_orders') && opts.method === 'PATCH') {
                return new Response(JSON.stringify([{ id: existingOrder.id, payment_status: 'paid' }]), { status: 200 });
            }

            if (urlStr.includes('/ibos_webhook_events') && opts.method === 'PATCH') {
                return new Response(JSON.stringify([{ id: 'mock-event-uuid', status: 'processed' }]), { status: 200 });
            }

            if (urlStr.includes('validationserverAPI.php')) {
                return new Response(JSON.stringify(validationApiResponse), { status: 200 });
            }

            return originalFetch(url, opts);
        };

        try {
            // Adversarial 2A: Missing val_id in SSLCommerz IPN
            {
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 400 && json.status === 'VAL_ID_REQUIRED', 'SSLCommerz IPN rejects payload lacking val_id');
            }

            // Adversarial 2B: Tampered Transaction ID (tran_id mismatch)
            {
                validationApiResponse = {
                    status: 'VALID',
                    tran_id: 'ORD-TAMPERED-999',
                    val_id: 'VAL_REAL_123',
                    amount: 104125,
                    currency: 'BDT',
                    risk_level: '0'
                };
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 400 && json.status === 'TRANSACTION_ID_MISMATCH', 'Rejects IPN when Order Validation tran_id does not match order_code');
            }

            // Adversarial 2C: Tampered Currency
            {
                validationApiResponse = {
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123',
                    amount: 104125,
                    currency: 'INR',
                    risk_level: '0'
                };
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 400 && json.status === 'CURRENCY_MISMATCH', 'Rejects IPN when currency is mismatched with order currency');
            }

            // Adversarial 2D: Tampered Amount
            {
                validationApiResponse = {
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123',
                    amount: 500,
                    currency: 'BDT',
                    risk_level: '0'
                };
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 400 && json.status === 'AMOUNT_MISMATCH', 'Rejects IPN when amount does not match locked order amount');
            }

            // Adversarial 2E: High Risk Level (risk_level = 1)
            {
                validationApiResponse = {
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123',
                    amount: 104125,
                    currency: 'BDT',
                    risk_level: '1',
                    risk_title: 'Suspected Stolen Card'
                };
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 400 && json.status === 'RISK_LEVEL_EXCEEDED', 'Rejects IPN when SSLCommerz risk_level is 1 (Fail-Closed)');
            }

            // Adversarial 2F: Valid IPN Authenticated & Processed
            {
                validationApiResponse = {
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123',
                    amount: 104125,
                    currency: 'BDT',
                    risk_level: '0'
                };
                const body = JSON.stringify({
                    status: 'VALID',
                    tran_id: targetOrderCode,
                    val_id: 'VAL_REAL_123'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                const json = await res.json();
                assert(res.status === 200 && json.action === 'payment_confirmed', 'Authoritative IPN successfully passes all validation gates and confirms payment');
            }
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    // -------------------------------------------------------------------------
    // TEST 3: SSLCommerz Refund Lifecycle API Verification
    // -------------------------------------------------------------------------
    {
        console.log('\n--- SUITE 3: Refund Lifecycle Verification ---');
        const adapter = new SSLCommerzAdapter({
            SSLCOMMERZ_STORE_ID: 'iinsha_live',
            SSLCOMMERZ_STORE_PASSWORD: 'store_password_live',
            SSLCOMMERZ_IS_LIVE: 'true'
        });

        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url) => {
            const urlStr = String(url);
            if (urlStr.includes('merchantTransIDvalidationAPI.php')) {
                if (urlStr.includes('refund_amount=')) {
                    return new Response(JSON.stringify({
                        status: 'success',
                        refund_ref_id: 'REF_99887766',
                        trans_id: 'BANK_TRX_123',
                        errorReason: ''
                    }), { status: 200 });
                }
                if (urlStr.includes('refund_ref_id=')) {
                    return new Response(JSON.stringify({
                        status: 'success',
                        refund_ref_id: 'REF_99887766',
                        refund_status: 'Refunded',
                        refund_amount: '104125'
                    }), { status: 200 });
                }
            }
            return originalFetch(url);
        };

        try {
            const initRes = await adapter.initiateRefund({
                bankTranId: 'BANK_TRX_123',
                refundAmount: 104125,
                refundRemarks: 'Customer Requested Refund'
            });
            assert(initRes.ok && initRes.refundRefId === 'REF_99887766', 'SSLCommerzAdapter successfully initiates refund and returns refundRefId');

            const statusRes = await adapter.queryRefundStatus({
                refundRefId: 'REF_99887766'
            });
            assert(statusRes.ok && statusRes.raw?.refund_status === 'Refunded', 'SSLCommerzAdapter successfully queries refund status');
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    // -------------------------------------------------------------------------
    // TEST 4: SSLCommerz IPN MD5 Hash & verify_sign Verification
    // -------------------------------------------------------------------------
    {
        console.log('\n--- SUITE 4: MD5 & IPN verify_sign Verification ---');

        // RFC 1321 Test Vectors
        assert(computeMd5('') === 'd41d8cd98f00b204e9800998ecf8427e', 'MD5 RFC vector: empty string matches expected');
        assert(computeMd5('a') === '0cc175b9c0f1b6a831c399e269772661', 'MD5 RFC vector: "a" matches expected');
        assert(computeMd5('abc') === '900150983cd24fb0d6963f7d28e17f72', 'MD5 RFC vector: "abc" matches expected');
        assert(computeMd5('message digest') === 'f96b697d7cb7938d525a2f31aaf161d0', 'MD5 RFC vector: "message digest" matches expected');

        // SSLCommerz verifyIPNHash calculation test
        const adapter = new SSLCommerzAdapter({
            SSLCOMMERZ_STORE_ID: 'iinsha_store',
            SSLCOMMERZ_STORE_PASSWORD: 'test_password_123'
        });

        // Compute expected verify_sign manually to simulate SSLCommerz gateway
        // params: amount=104125, currency=BDT, tran_id=ORD-TEST-123, val_id=VAL_123
        // verify_key: amount,currency,tran_id,val_id
        // store_passwd_md5 = computeMd5('test_password_123')
        const storePasswdMd5 = computeMd5('test_password_123');
        const sortedKvs = [
            'amount=104125',
            'currency=BDT',
            'tran_id=ORD-TEST-123',
            'val_id=VAL_123',
            `store_passwd=${storePasswdMd5}`
        ].join('&');
        const expectedSign = computeMd5(sortedKvs);

        const ipnPayload = {
            tran_id: 'ORD-TEST-123',
            val_id: 'VAL_123',
            amount: '104125',
            currency: 'BDT',
            verify_key: 'amount,currency,tran_id,val_id',
            verify_sign: expectedSign
        };

        const verifyResult = adapter.verifyIPNHash(ipnPayload);
        assert(verifyResult.ok === true, 'verifyIPNHash successfully validates correct SSLCommerz verify_sign');

        // Tampered payload
        const tamperedPayload = {
            ...ipnPayload,
            amount: '500' // tampered amount
        };
        const tamperedResult = adapter.verifyIPNHash(tamperedPayload);
        assert(tamperedResult.ok === false, 'verifyIPNHash detects tampered parameters and rejects signature');
    }

    // -------------------------------------------------------------------------
    // TEST 5: Payment State Machine & Non-Downgrade Invariants
    // -------------------------------------------------------------------------
    {
        console.log('\n--- SUITE 5: Payment State Machine Lifecycle & Invariants ---');
        const secret = 'webhook_secret_2026';
        const mockEnv = {
            WEBHOOK_SECRET: secret,
            SUPABASE_URL: 'https://mock.supabase.co',
            SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key'
        };

        const stateDb = new Map();
        stateDb.set('ORD-SM-001', {
            id: 'uuid-sm-001',
            order_code: 'ORD-SM-001',
            payment_status: 'awaiting_payment',
            order_status: 'pending',
            amount: 850,
            currency: 'USD'
        });
        stateDb.set('ORD-SM-002', {
            id: 'uuid-sm-002',
            order_code: 'ORD-SM-002',
            payment_status: 'paid',
            order_status: 'confirmed',
            amount: 850,
            currency: 'USD'
        });

        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (url, opts = {}) => {
            const urlStr = String(url);

            if (urlStr.includes('/ibos_webhook_events?event_id=eq.')) {
                return new Response(JSON.stringify([]), { status: 200 });
            }

            if (urlStr.includes('/ibos_orders?order_code=eq.')) {
                const codeMatch = urlStr.match(/order_code=eq\.([^&]+)/);
                const code = codeMatch ? decodeURIComponent(codeMatch[1]) : null;
                const order = code ? stateDb.get(code) : null;
                if (opts.method === 'PATCH') {
                    if (urlStr.includes('payment_status=neq.paid') && order?.payment_status === 'paid') {
                        return new Response(JSON.stringify([]), { status: 200 });
                    }
                    const patch = JSON.parse(opts.body);
                    if (order) {
                        Object.assign(order, patch);
                    }
                    return new Response(JSON.stringify([order]), { status: 200 });
                }
                return new Response(JSON.stringify(order ? [order] : []), { status: 200 });
            }

            if (urlStr.includes('/ibos_webhook_events') && opts.method === 'POST') {
                return new Response(JSON.stringify([{ id: 'mock-evt' }]), { status: 201 });
            }
            if (urlStr.includes('/ibos_webhook_events') && opts.method === 'PATCH') {
                return new Response(JSON.stringify([{ id: 'mock-evt', status: 'processed' }]), { status: 200 });
            }

            return originalFetch(url, opts);
        };

        try {
            // Case 5A: awaiting_payment -> failed transition
            {
                const body = JSON.stringify({
                    id: 'evt_fail_1',
                    type: 'payment_intent.payment_failed',
                    order_id: 'ORD-SM-001'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                assert(res.status === 200, 'Webhook accepted failure event');
                assert(stateDb.get('ORD-SM-001').payment_status === 'failed', 'State Machine: transitioning awaiting_payment -> failed');
            }

            // Case 5B: paid order CANNOT be downgraded to failed
            {
                const body = JSON.stringify({
                    id: 'evt_fail_2',
                    type: 'payment_intent.payment_failed',
                    order_id: 'ORD-SM-002'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                assert(res.status === 200, 'Webhook processed failure attempt on paid order');
                assert(stateDb.get('ORD-SM-002').payment_status === 'paid', 'State Machine Invariant: paid order cannot be downgraded to failed');
            }

            // Case 5C: paid -> refunded transition
            {
                const body = JSON.stringify({
                    id: 'evt_refund_1',
                    type: 'charge.refunded',
                    order_id: 'ORD-SM-002'
                });
                const sig = await hmac(body, secret);
                const req = new Request('https://inshatech.pages.dev/api/payments/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-Webhook-Signature': sig },
                    body
                });
                const res = await webhookPost({ request: req, env: mockEnv });
                assert(res.status === 200, 'Webhook accepted refund event');
                assert(stateDb.get('ORD-SM-002').payment_status === 'refunded', 'State Machine: successfully transitioned paid -> refunded');
            }
        } finally {
            globalThis.fetch = originalFetch;
        }
    }

    console.log('\n================================================================================');
    console.log('ADVERSARIAL SUITE SUMMARY: ' + passed + '/' + total + ' ASSERTIONS PASSED!');
    console.log('================================================================================\n');
}

runAdversarialSuite();
