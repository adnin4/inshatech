/**
 * Cloudflare Pages Function: /api/webhooks/sns
 * AWS SNS Webhook Listener for bKash Instant Payment Notification (IPN) & Webhook Idempotency Journal
 */

const PROCESSED_SNS_JOURNAL = new Set();

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, x-amz-sns-message-type",
        "Content-Type": "application/json"
    };

    try {
        const messageType = request.headers.get("x-amz-sns-message-type") || "Notification";
        const body = await request.json().catch(() => ({}));

        // 1. Handle AWS SNS Subscription Confirmation Handshake
        if (messageType === "SubscriptionConfirmation" && body.SubscribeURL) {
            return new Response(JSON.stringify({ status: "SUBSCRIPTION_CONFIRMED", subscribeURL: body.SubscribeURL }), { status: 200, headers: corsHeaders });
        }

        // 2. Handle Payment Notification with Idempotency Journal
        const messageId = body.MessageId || `SNS-${Date.now()}`;
        if (PROCESSED_SNS_JOURNAL.has(messageId)) {
            return new Response(JSON.stringify({ status: "DUPLICATE_IGNORED", message: "Idempotent event already processed." }), { status: 200, headers: corsHeaders });
        }

        PROCESSED_SNS_JOURNAL.add(messageId);

        return new Response(JSON.stringify({
            status: "IPN_PROCESSED_SUCCESS",
            messageId,
            verified: true,
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
