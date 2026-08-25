/**
 * Lemon Squeezy Official Webhook Handler
 * Verifies X-Signature HMAC-SHA256 and updates database orders
 */

async function verifyLemonSignature(rawPayload, signature, secret) {
    if (!signature || !secret) return false;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signed = await crypto.subtle.sign('HMAC', key, encoder.encode(rawPayload));
    const computedHex = Array.from(new Uint8Array(signed)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    if (signature.length !== computedHex.length) return false;
    let diff = 0;
    for (let i = 0; i < signature.length; i++) {
        diff |= signature.charCodeAt(i) ^ computedHex.charCodeAt(i);
    }
    return diff === 0;
}

export async function onRequestPost({ request, env = {} }) {
    try {
        const secret = env.LEMONSQUEEZY_WEBHOOK_SECRET;
        const raw = await request.text();
        const sig = request.headers.get('X-Signature') || '';

        if (secret) {
            const isValid = await verifyLemonSignature(raw, sig, secret);
            if (!isValid) {
                return new Response(JSON.stringify({ status: 'UNAUTHORIZED_SIGNATURE' }), { status: 401 });
            }
        }

        const event = JSON.parse(raw || '{}');
        const eventName = event.meta?.event_name || 'unknown';
        const orderId = event.meta?.custom_data?.order_id;
        const eventId = String(event.data?.id || `ls_${Date.now()}`);

        if (['order_created', 'subscription_created', 'order_paid'].includes(eventName) && orderId) {
            if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
                const base = `${env.SUPABASE_URL}/rest/v1`;
                const key = env.SUPABASE_SERVICE_ROLE_KEY;
                const auth = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

                await fetch(`${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderId)}`, {
                    method: 'PATCH',
                    headers: { ...auth, Prefer: 'return=representation' },
                    body: JSON.stringify({
                        payment_status: 'paid',
                        order_status: 'confirmed',
                        payment_gateway: 'lemonsqueezy',
                        updated_at: new Date().toISOString()
                    })
                });

                await fetch(`${base}/ibos_webhook_events`, {
                    method: 'POST',
                    headers: { ...auth, Prefer: 'return=minimal' },
                    body: JSON.stringify({
                        event_id: eventId,
                        event_type: `LEMONSQUEEZY_${eventName.toUpperCase()}`,
                        order_id: orderId,
                        raw_payload: event,
                        created_at: new Date().toISOString()
                    })
                });
            }
        }

        return new Response(JSON.stringify({ status: 'SUCCESS', received: true, event: eventName, order_id: orderId }), { status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ status: 'WEBHOOK_ERROR', message: err.message }), { status: 500 });
    }
}
