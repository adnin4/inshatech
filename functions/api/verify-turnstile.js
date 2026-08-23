/**
 * Cloudflare Pages Function: /api/verify-turnstile
 * Cloudflare Turnstile Bot & Spam Verification Filter
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const { token } = await request.json().catch(() => ({}));
    const secretKey = env.TURNSTILE_SECRET_KEY;

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "Missing Turnstile token" }), { status: 400, headers: corsHeaders });
    }

    if (!secretKey) {
      // In development mode without active secret key
      return new Response(JSON.stringify({
        success: true,
        status: "PASSED_DEV_BYPASS",
        note: "Set TURNSTILE_SECRET_KEY in production."
      }), { headers: corsHeaders });
    }

    const ip = request.headers.get("CF-Connecting-IP") || "";
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", ip);

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      body: formData,
      method: "POST"
    });

    const outcome = await result.json();
    return new Response(JSON.stringify(outcome), { headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500, headers: corsHeaders });
  }
}
