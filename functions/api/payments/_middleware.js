/**
 * Scoped middleware for /api/payments/*
 *
 * Invariant:
 * If a browser GET request targets /api/payments/webhook, intercept and redirect it
 * to the read-only /api/payments/return endpoint so it never touches the mutation webhook.
 */

import { resolveTrustedBaseUrl } from '../../_shared/origin_policy.js';

export async function onRequest(context) {
    const url = new URL(context.request.url);

    if (context.request.method === 'GET' && url.pathname.endsWith('/api/payments/webhook')) {
        const trustedBase = resolveTrustedBaseUrl(context.request, context.env);
        const returnUrl = new URL('/api/payments/return', trustedBase);
        returnUrl.search = url.search;
        return Response.redirect(returnUrl.toString(), 302);
    }

    return context.next();
}