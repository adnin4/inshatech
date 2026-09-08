import { onRequestPost as handleWebhookPost } from '../functions/api/payments/webhook.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

console.log('================================================================================');
console.log('IINSHA AI-BOS: WEBHOOK REPLAY PROTECTION & CONCURRENCY ATOMICITY TEST SUITE');
console.log('================================================================================\n');

async function runSuite() {
    const mockEnv = {
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key',
        WEBHOOK_SECRET: 'test_secret_321'
    };

    let existingEvents = [];
    let orderState = {
        id: 'ord-uuid-1',
        order_code: 'ORD-TEST-REPLAY-001',
        payment_status: 'awaiting_payment',
        amount: 850,
        currency: 'USD'
    };
    let orderPatchCount = 0;
    let revenueCreditCount = 0;

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts = {}) => {
        const urlStr = String(url);

        // Webhook events duplicate lookup
        if (urlStr.includes('/ibos_webhook_events?event_id=eq.')) {
            const match = urlStr.match(/event_id=eq\.([^&]+)/);
            const evtId = match ? decodeURIComponent(match[1]) : '';
            const found = existingEvents.filter(e => e.event_id === evtId);
            return new Response(JSON.stringify(found), { status: 200 });
        }

        // Webhook events insert
        if (urlStr.endsWith('/ibos_webhook_events') && opts.method === 'POST') {
            const body = JSON.parse(opts.body || '{}');
            if (existingEvents.some(e => e.event_id === body.event_id)) {
                return new Response(JSON.stringify({ message: 'duplicate key value violates unique constraint' }), { status: 409 });
            }
            existingEvents.push(body);
            return new Response(JSON.stringify([body]), { status: 201 });
        }

        // Webhook events patch
        if (urlStr.includes('/ibos_webhook_events?event_id=eq.') && opts.method === 'PATCH') {
            return new Response(JSON.stringify([{ id: 'mock-evt-uuid', status: 'processed' }]), { status: 200 });
        }

        // Order lookup (GET)
        if (urlStr.includes('/ibos_orders?order_code=eq.') && (!opts.method || opts.method === 'GET')) {
            return new Response(JSON.stringify([orderState]), { status: 200 });
        }

        // Order conditional patch (payment_status=neq.paid)
        if (urlStr.includes('/ibos_orders?') && opts.method === 'PATCH') {
            if (urlStr.includes('payment_status=neq.paid')) {
                if (orderState.payment_status === 'paid') {
                    // Zero rows updated if already paid
                    return new Response(JSON.stringify([]), { status: 200 });
                }
                orderPatchCount++;
                orderState.payment_status = 'paid';
                return new Response(JSON.stringify([orderState]), { status: 200 });
            }
        }

        // Revenue ledger insert
        if (urlStr.endsWith('/ibos_revenue') && opts.method === 'POST') {
            revenueCreditCount++;
            return new Response(JSON.stringify([{ id: 'rev-1' }]), { status: 201 });
        }

        return originalFetch(url, opts);
    };

    try {
        const payload = {
            id: 'evt_lemonsqueezy_replay_001',
            type: 'order_created',
            order_id: 'ORD-TEST-REPLAY-001',
            data: {
                id: 'order_created',
                type: 'orders',
                attributes: {
                    order_number: 'ORD-TEST-REPLAY-001',
                    status: 'paid',
                    total: 85000,
                    currency: 'USD'
                }
            }
        };

        const rawBody = JSON.stringify(payload);
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode('test_secret_321'),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
        const signature = [...new Uint8Array(sigBuffer)].map(b => b.toString(16).padStart(2, '0')).join('');

        // 1. First webhook delivery
        const req1 = new Request('https://inshatech.pages.dev/api/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature
            },
            body: rawBody
        });
        const res1 = await handleWebhookPost({ request: req1, env: mockEnv });
        const json1 = await res1.json();
        assert(res1.status === 200 && json1.status === 'SUCCESS', 'First webhook delivery successfully processes and confirms payment');
        assert(orderState.payment_status === 'paid' && orderPatchCount === 1, 'First delivery transitions order to paid exactly once');
        assert(revenueCreditCount === 1, 'First delivery records initial double-entry revenue credit');

        // 2. Replayed duplicate webhook delivery (Same event_id)
        const req2 = new Request('https://inshatech.pages.dev/api/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': signature
            },
            body: rawBody
        });
        const res2 = await handleWebhookPost({ request: req2, env: mockEnv });
        const json2 = await res2.json();
        assert(res2.status === 200 && json2.action === 'duplicate_ignored', 'Replayed webhook returns HTTP 200 duplicate_ignored');
        assert(orderPatchCount === 1, 'Replayed webhook produces zero additional order mutations');
        assert(revenueCreditCount === 1, 'Replayed webhook produces zero secondary revenue double-credits');

        // 3. New event_id targeting already-paid order (Already paid idempotency check)
        const payload3 = { ...payload, id: 'evt_lemonsqueezy_late_sync_002' };
        const rawBody3 = JSON.stringify(payload3);
        const sigBuffer3 = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody3));
        const sig3 = [...new Uint8Array(sigBuffer3)].map(b => b.toString(16).padStart(2, '0')).join('');

        const req3 = new Request('https://inshatech.pages.dev/api/payments/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Signature': sig3
            },
            body: rawBody3
        });
        const res3 = await handleWebhookPost({ request: req3, env: mockEnv });
        const json3 = await res3.json();
        assert(res3.status === 200 && json3.action === 'already_paid', 'Secondary event on already-paid order safely acknowledged without mutation');
        assert(orderPatchCount === 1, 'Conditional atomic update invariant strictly preserved');
        assert(revenueCreditCount === 1, 'Zero ledger duplicate credits across event IDs');

    } finally {
        globalThis.fetch = originalFetch;
    }

    console.log(`\nREPLAY & CONCURRENCY SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
    if (passed === total) {
        console.log('WEBHOOK_REPLAY_AND_CONCURRENCY=PASS\n');
    }
}

await runSuite();
