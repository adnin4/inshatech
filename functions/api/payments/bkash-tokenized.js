/**
 * Cloudflare Pages Function: /api/payments/bkash-tokenized
 * Dual-Rail Payment Gateway: bKash Tokenized Checkout (Sandbox & Production)
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  try {
    const body = await request.json().catch(() => ({}));
    const { action, orderId, amount, callbackUrl, paymentId } = body;
    const isSandbox = env.BKASH_IS_SANDBOX !== "false";
    const baseUrl = isSandbox
      ? "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout"
      : "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout";

    if (!env.BKASH_APP_KEY || !env.BKASH_APP_SECRET) {
      // In development / standby unconfigured mode
      return new Response(JSON.stringify({
        status: "STANDBY_UNCONFIGURED",
        paymentID: "TRX-BKASH-SANDBOX-" + Date.now(),
        bkashURL: `https://checkout.sandbox.bka.sh/payment/mock?order=${orderId || 'ORD-001'}`,
        note: "Set BKASH_APP_KEY and BKASH_APP_SECRET in Cloudflare Pages Secrets for live tokenized execution."
      }), { headers: corsHeaders });
    }

    if (action === "create") {
      // 1. Grant Token
      const tokenRes = await fetch(`${baseUrl}/token/grant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "username": env.BKASH_USERNAME,
          "password": env.BKASH_PASSWORD
        },
        body: JSON.stringify({
          app_key: env.BKASH_APP_KEY,
          app_secret: env.BKASH_APP_SECRET
        })
      });
      const tokenData = await tokenRes.json();
      const idToken = tokenData.id_token;

      // 2. Create Payment
      const createRes = await fetch(`${baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": idToken,
          "X-APP-Key": env.BKASH_APP_KEY
        },
        body: JSON.stringify({
          mode: "0011",
          payerReference: "CustomerReference",
          callbackURL: callbackUrl || "https://inshatech.pages.dev/api/payments/bkash-callback",
          amount: Number(amount || 850).toFixed(2),
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: `INV-${orderId || Date.now()}`
        })
      });
      const createData = await createRes.json();
      return new Response(JSON.stringify(createData), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: "READY", mode: isSandbox ? "SANDBOX" : "PRODUCTION" }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
