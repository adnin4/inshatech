/**
 * Cloudflare Pages Function: Payment Webhook Signature Verifier
 */
import { onRequestPost as handleWebhookPost } from "./payments/webhook.js";

export async function onRequestPost(context) {
    return handleWebhookPost(context);
}
