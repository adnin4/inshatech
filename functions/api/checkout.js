/**
 * Cloudflare Pages Function: /api/checkout
 * Compatibility wrapper around the canonical payment checkout handler.
 */
import {
    onRequestPost as handleCheckoutPost,
    onRequestOptions as handleCheckoutOptions
} from "./payments/checkout.js";

export async function onRequestPost(context) {
    return handleCheckoutPost(context);
}

export async function onRequestOptions(context) {
    return handleCheckoutOptions(context);
}
