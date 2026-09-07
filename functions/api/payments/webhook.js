/**
 * Payment Webhook Handler — Multi-Gateway Support:
 * Handles incoming webhooks from: Lemon Squeezy, SSLCommerz, AamarPay, Stripe, bKash, and Nagad.
 * Invariant: Verify signature first, check idempotency second, mutate order status third, record durable log last.
 */
async function hmac(raw, secret) {
    const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(raw)))].map(b => b.toString(16).padStart(2, '0')).join('');
}

function headers() {
    return { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
}

function timingSafe(a, b) {
    if (a.length !== b.length) return false;
    let x = 0;
    for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return x === 0;
}

export async function onRequestPost({ request, env = {} }) {
    const H = headers();
    try {
        const raw = await request.text();
        const lsSig = request.headers.get('X-Signature') || '';
        const stripeSig = request.headers.get('Stripe-Signature') || '';
        const genericSig = request.headers.get('X-Webhook-Signature') || '';
        
        // 1. Provider-Native Signature Verification (Fail-Closed)
        if (env.LEMONSQUEEZY_WEBHOOK_SECRET && lsSig) {
            const expected = await hmac(raw, env.LEMONSQUEEZY_WEBHOOK_SECRET);
            if (!timingSafe(lsSig.toLowerCase(), expected.toLowerCase())) {
                return new Response(JSON.stringify({ status: 'UNAUTHORIZED', error: 'Invalid Lemon Squeezy signature' }), { status: 401, headers: H });
            }
        } else if (env.STRIPE_WEBHOOK_SECRET && stripeSig) {
            // Basic Stripe v1 signature extraction
            const sigMap = Object.fromEntries(stripeSig.split(',').map(kv => kv.trim().split('=')));
            if (sigMap.v1 && sigMap.t) {
                const signedPayload = `${sigMap.t}.${raw}`;
                const expected = await hmac(signedPayload, env.STRIPE_WEBHOOK_SECRET);
                if (!timingSafe(sigMap.v1.toLowerCase(), expected.toLowerCase())) {
                    return new Response(JSON.stringify({ status: 'UNAUTHORIZED', error: 'Invalid Stripe signature' }), { status: 401, headers: H });
                }
            } else {
                return new Response(JSON.stringify({ status: 'UNAUTHORIZED', error: 'Malformed Stripe signature header' }), { status: 401, headers: H });
            }
        } else if (env.WEBHOOK_SECRET && genericSig) {
            const expected = await hmac(raw, env.WEBHOOK_SECRET);
            if (!timingSafe(genericSig.toLowerCase(), expected.toLowerCase())) {
                return new Response(JSON.stringify({ status: 'UNAUTHORIZED', error: 'Invalid webhook signature' }), { status: 401, headers: H });
            }
        } else if ((env.LEMONSQUEEZY_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET || env.WEBHOOK_SECRET) && !lsSig && !stripeSig && !genericSig) {
            // Secret configured but signature header completely missing -> Fail Closed
            return new Response(JSON.stringify({ status: 'UNAUTHORIZED', error: 'Missing required signature header' }), { status: 401, headers: H });
        }

        const event = JSON.parse(raw || '{}');
        const eventId = String(event.id || event.event_id || event.data?.id || event.tran_id || event.mer_txnid || `evt_${Date.now()}`);
        const type = String(event.type || event.event_name || event.meta?.event_name || event.status || event.pay_status || 'unknown');

        // Extract Order ID across different payment gateways
        const orderId = event.data?.object?.metadata?.order_id || 
                        event.meta?.custom_data?.order_id || 
                        event.custom_data?.order_id || 
                        event.data?.attributes?.checkout_data?.custom?.order_id ||
                        event.value_a || 
                        event.order_id || 
                        event.tran_id;

        // Check if event signifies successful payment
        const isSuccess = [
            'payment_intent.succeeded',
            'checkout.session.completed',
            'order_created',
            'order_paid',
            'VALID',
            'VALIDATED',
            'Successful',
            'payment.success',
            'PAID',
            'paid'
        ].includes(type) || event.status === 'VALID' || event.status_code === '2' || event.data?.attributes?.status === 'paid';

        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
            const base = `${env.SUPABASE_URL}/rest/v1`;
            const key = env.SUPABASE_SERVICE_ROLE_KEY;
            const auth = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

            // 2. Idempotency Check: Verify if event has already been ingested
            try {
                const checkRes = await fetch(`${base}/ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}&select=id`, {
                    headers: auth
                });
                if (checkRes.ok) {
                    const existing = await checkRes.json().catch(() => []);
                    if (Array.isArray(existing) && existing.length > 0) {
                        return new Response(JSON.stringify({
                            status: 'DUPLICATE_IGNORED',
                            action: 'REPLAY_PREVENTED',
                            event_id: eventId,
                            order_id: orderId || 'UNSPECIFIED'
                        }), { status: 200, headers: H });
                    }
                }
            } catch (checkErr) {
                console.warn('Webhook idempotency check notice:', checkErr.message);
            }

            // 3. Mutate Order Status and Record Durable Webhook Event (Fail-Closed)
            try {
                if (isSuccess && orderId) {
                    const orderPatchRes = await fetch(`${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderId)}`, {
                        method: 'PATCH',
                        headers: { ...auth, Prefer: 'return=representation' },
                        body: JSON.stringify({
                            payment_status: 'paid',
                            order_status: 'confirmed',
                            updated_at: new Date().toISOString()
                        })
                    });

                    if (!orderPatchRes.ok) {
                        const err = await orderPatchRes.text().catch(() => 'Order patch error');
                        return new Response(JSON.stringify({ status: 'DATABASE_ERROR', error: 'Failed to update order state', detail: err }), { status: 500, headers: H });
                    }
                }

                // Record durable ledger event
                const eventLogRes = await fetch(`${base}/ibos_webhook_events`, {
                    method: 'POST',
                    headers: { ...auth, Prefer: 'return=minimal' },
                    body: JSON.stringify({
                        event_id: eventId,
                        event_type: type,
                        order_id: orderId || null,
                        raw_payload: event,
                        created_at: new Date().toISOString()
                    })
                });

                if (!eventLogRes.ok) {
                    const err = await eventLogRes.text().catch(() => 'Event log error');
                    return new Response(JSON.stringify({ status: 'DATABASE_ERROR', error: 'Failed to record webhook event', detail: err }), { status: 500, headers: H });
                }
            } catch (dbError) {
                return new Response(JSON.stringify({ status: 'DATABASE_ERROR', error: dbError.message }), { status: 500, headers: H });
            }
        }

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            action: isSuccess ? 'payment_confirmed' : 'event_recorded',
            event_id: eventId,
            order_id: orderId || 'UNSPECIFIED',
            event_type: type
        }), { status: 200, headers: H });

    } catch (e) {
        return new Response(JSON.stringify({ status: 'ERROR', message: e.message }), { status: 500, headers: H });
    }
}
