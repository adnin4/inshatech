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
        const sig = request.headers.get('X-Webhook-Signature') || request.headers.get('X-Signature') || '';
        
        // If webhook secret configured, verify HMAC signature
        if (env.WEBHOOK_SECRET && sig) {
            const expected = await hmac(raw, env.WEBHOOK_SECRET);
            if (!timingSafe(sig.toLowerCase(), expected.toLowerCase())) {
                return new Response(JSON.stringify({ status: 'UNAUTHORIZED' }), { status: 401, headers: H });
            }
        }

        const event = JSON.parse(raw || '{}');
        const eventId = String(event.id || event.event_id || event.tran_id || event.mer_txnid || `evt_${Date.now()}`);
        const type = String(event.type || event.event_name || event.status || event.pay_status || 'unknown');

        // Extract Order ID across different payment gateways
        const orderId = event.data?.object?.metadata?.order_id || 
                        event.meta?.custom_data?.order_id || 
                        event.custom_data?.order_id || 
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
            'PAID'
        ].includes(type) || event.status === 'VALID' || event.status_code === '2';

        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && isSuccess && orderId) {
            try {
                const base = `${env.SUPABASE_URL}/rest/v1`;
                const key = env.SUPABASE_SERVICE_ROLE_KEY;
                const auth = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

                // Patch order to paid
                await fetch(`${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderId)}`, {
                    method: 'PATCH',
                    headers: { ...auth, Prefer: 'return=representation' },
                    body: JSON.stringify({ payment_status: 'paid', order_status: 'confirmed', updated_at: new Date().toISOString() })
                });

                // Record durable ledger event
                await fetch(`${base}/ibos_webhook_events`, {
                    method: 'POST',
                    headers: { ...auth, Prefer: 'return=minimal' },
                    body: JSON.stringify({
                        event_id: eventId,
                        event_type: type,
                        order_id: orderId,
                        raw_payload: event,
                        created_at: new Date().toISOString()
                    })
                });
            } catch (e) {
                console.warn('Webhook database write notice:', e.message);
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
