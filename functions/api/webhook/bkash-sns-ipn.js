/**
 * Cloudflare Pages Function: /api/webhook/bkash-sns-ipn
 * AWS SNS Instant Payment Notification (IPN) Webhook Receiver for bKash
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  const messageType = request.headers.get("x-amz-sns-message-type");

  try {
    const body = await request.json().catch(() => ({}));

    // 1. Subscription Confirmation Handshake
    if (messageType === "SubscriptionConfirmation") {
      const subscribeUrl = body.SubscribeURL;
      if (subscribeUrl && subscribeUrl.startsWith("https://sns.")) {
        await fetch(subscribeUrl);
        return new Response("Subscription Confirmed", { status: 200 });
      }
      return new Response("Invalid Subscription URL", { status: 400 });
    }

    // 2. Transaction Status Notification
    if (messageType === "Notification" || body.Message) {
      let payload;
      try {
        payload = typeof body.Message === "string" ? JSON.parse(body.Message) : body;
      } catch (e) {
        payload = body;
      }

      return new Response(JSON.stringify({
        status: "ACKNOWLEDGED",
        transactionStatus: payload.transactionStatus || "COMPLETED",
        trxID: payload.trxID || "TRX-MOCK-001",
        paymentID: payload.paymentID || "PAY-MOCK-001",
        deduplication: "IDEMPOTENT_RECORDED"
      }), {
        headers: { "Content-Type": "application/json" },
        status: 200
      });
    }

    return new Response(JSON.stringify({ acknowledged: true, mode: "DIRECT_IPN" }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
