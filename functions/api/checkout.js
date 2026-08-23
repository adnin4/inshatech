/**
 * Cloudflare Pages Function: /api/checkout
 * Automated Multi-Provider Checkout Gateway ($249, $499, $850 packages)
 */
import { onRequestPost as handleCheckoutPost } from "./payments/checkout.js";

export async function onRequestPost(context) {
    return handleCheckoutPost(context);
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
