/**
 * SSLCommerz Browser Return Redirect Handler
 *
 * Invariant:
 * Browser returns from SSLCommerz are strictly read-only and redirected
 * to the canonical /api/payments/return endpoint. State mutation is ONLY
 * permitted via verified server-to-server IPN at /api/payments/webhook.
 */

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const returnUrl = new URL('https://inshatech.pages.dev/api/payments/return');

    for (const [k, v] of url.searchParams.entries()) {
        returnUrl.searchParams.set(k, v);
    }

    if (request.method === 'POST') {
        try {
            const formData = await request.formData().catch(() => new FormData());
            for (const [k, v] of formData.entries()) {
                if (typeof v === 'string') {
                    returnUrl.searchParams.set(k, v);
                }
            }
        } catch {
            // Ignore formData parse error
        }
    }

    if (!returnUrl.searchParams.get('provider')) {
        returnUrl.searchParams.set('provider', 'sslcommerz');
    }

    return Response.redirect(returnUrl.toString(), 302);
}
