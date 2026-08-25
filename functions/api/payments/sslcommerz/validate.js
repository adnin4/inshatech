/**
 * SSLCommerz Official Server-to-Server Order Validation API
 * Upstream API: https://securepay.sslcommerz.com/validator/api/validationserverAPI.php
 */

export async function onRequestPost({ request, env = {} }) {
    try {
        const storeId = env.SSLCOMMERZ_STORE_ID;
        const storePass = env.SSLCOMMERZ_STORE_PASSWORD;
        const isLive = env.SSLCOMMERZ_IS_LIVE !== 'false';

        const formData = await request.formData().catch(() => new FormData());
        const valId = formData.get('val_id');
        const tranId = formData.get('tran_id');
        const amount = formData.get('amount');
        const currency = formData.get('currency');

        if (!valId || !storeId || !storePass) {
            return new Response('SSLCommerz Validation Parameters Missing', { status: 400 });
        }

        const validatorEndpoint = isLive
            ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePass}&format=json`
            : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePass}&format=json`;

        const valRes = await fetch(validatorEndpoint);
        const valData = await valRes.json().catch(() => ({}));

        if (valData.status === 'VALID' || valData.status === 'VALIDATED') {
            // Update Supabase Database
            if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
                const key = env.SUPABASE_SERVICE_ROLE_KEY;
                const auth = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

                await fetch(`${env.SUPABASE_URL}/rest/v1/ibos_orders?order_code=eq.${encodeURIComponent(tranId)}`, {
                    method: 'PATCH',
                    headers: { ...auth, Prefer: 'return=representation' },
                    body: JSON.stringify({
                        payment_status: 'paid',
                        order_status: 'confirmed',
                        payment_gateway: 'sslcommerz',
                        updated_at: new Date().toISOString()
                    })
                });

                await fetch(`${env.SUPABASE_URL}/rest/v1/ibos_webhook_events`, {
                    method: 'POST',
                    headers: { ...auth, Prefer: 'return=minimal' },
                    body: JSON.stringify({
                        event_id: `sslcommerz_${valId}`,
                        event_type: 'SSLCOMMERZ_PAYMENT_VALIDATED',
                        order_id: tranId,
                        raw_payload: valData,
                        created_at: new Date().toISOString()
                    })
                });
            }

            // Redirect customer to portal
            return Response.redirect(`https://inshatech.pages.dev/portal.html?payment=success&order_id=${tranId}`, 302);
        } else {
            return Response.redirect(`https://inshatech.pages.dev/store.html?payment=failed&order_id=${tranId}`, 302);
        }

    } catch (err) {
        return new Response(`Validation Error: ${err.message}`, { status: 500 });
    }
}
