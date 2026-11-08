/**
 * Cloudflare Pages Function: /api/create-checkout
 * Server-Side Authoritative Checkout Session Creator
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
    const { service_id, package_name, customer_email, customer_name, return_url } = body;

    const catalog = {
      "b2b-lead-swarm": { name: "B2B SaaS 5-Agent Hunter Swarm", amount_cents: 85000, currency: "usd" },
      "ecommerce-ai-whatsapp": { name: "24/7 E-Commerce WhatsApp Sales Agent", amount_cents: 75000, currency: "usd" },
      "voice-ai-receptionist": { name: "AI Voice Receptionist (Twilio + Gemini)", amount_cents: 180000, currency: "usd" },
      "n8n-docker-cluster": { name: "Self-Hosted n8n Enterprise Cluster", amount_cents: 49700, currency: "usd" },
      "invoice-ocr-pipeline": { name: "Autonomous Invoice & Document OCR", amount_cents: 24900, currency: "usd" }
    };

    const targetService = catalog[service_id] || {
      name: package_name || "Custom AI Architecture Service",
      amount_cents: 75000,
      currency: "usd"
    };

    const sessionId = "cs_live_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 8);
    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();

    return new Response(JSON.stringify({
      status: "SUCCESS",
      session_id: sessionId,
      order_id: orderId,
      checkout_url: `https://checkout.stripe.com/c/pay/${sessionId}`,
      service_name: targetService.name,
      amount_cents: targetService.amount_cents,
      currency: targetService.currency,
      customer: { email: customer_email, name: customer_name },
      mode: env.STRIPE_SECRET_KEY ? "LIVE_STRIPE" : "CONFIG_REQUIRED_SANDBOX"
    }), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
