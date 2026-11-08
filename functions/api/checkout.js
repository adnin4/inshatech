/**
 * Cloudflare Pages Function: /api/checkout
 * Compatibility wrapper around the canonical payment checkout handler.
 *
 * Legacy clients may submit a human-readable service title in `service_id`.
 * This wrapper normalizes that legacy identifier against the published DB
 * catalog only; the canonical payment handler still decides UUID, package,
 * price, currency and payment state.
 */
import {
    onRequestPost as handleCheckoutPost,
    onRequestOptions as handleCheckoutOptions
} from "./payments/checkout.js";

export async function onRequestPost(context) {
    const { request, env = {} } = context;

    try {
        const body = await request.clone().json();
        const identity = String(body?.service_id || '').trim();

        if (
            identity &&
            env.SUPABASE_URL &&
            env.SUPABASE_SERVICE_ROLE_KEY &&
            !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identity)
        ) {
            const base = `${env.SUPABASE_URL}/rest/v1`;
            const key = env.SUPABASE_SERVICE_ROLE_KEY;
            const headers = {
                apikey: key,
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json'
            };

            const titleLookup = await fetch(
                `${base}/ibos_services?title=eq.${encodeURIComponent(identity)}&status=eq.published&select=slug&limit=2`,
                { method: 'GET', headers }
            );

            if (titleLookup.ok) {
                const rows = await titleLookup.json().catch(() => []);
                if (Array.isArray(rows) && rows.length === 1 && rows[0]?.slug) {
                    body.service_id = rows[0].slug;
                    const normalizedRequest = new Request(request.url, {
                        method: request.method,
                        headers: request.headers,
                        body: JSON.stringify(body)
                    });
                    return handleCheckoutPost({ ...context, request: normalizedRequest });
                }
            }
        }
    } catch {
        // Leave malformed/legacy requests untouched so the canonical handler
        // can return its normal fail-closed validation response.
    }

    return handleCheckoutPost(context);
}

export async function onRequestOptions(context) {
    return handleCheckoutOptions(context);
}
