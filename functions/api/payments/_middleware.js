/**
 * Legacy browser-return compatibility boundary.
 *
 * Older checkout sessions may still redirect a browser GET to
 * /api/payments/webhook. Never let that GET reach the POST-only webhook.
 * We redirect the browser to the read-only return endpoint. POST requests
 * continue to the real webhook handler.
 */

export async function onRequest({ request, next }) {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/payments/webhook') {
        const destination = new URL('/api/payments/return', url.origin);
        for (const key of ['order_id', 'provider', 'status']) {
            const value = url.searchParams.get(key);
            if (value) destination.searchParams.set(key, value);
        }
        return Response.redirect(destination.toString(), 303);
    }

    return next();
}
