/**
 * Cloudflare Pages Function: /api/solution-finder
 * Live Gemini AI Architecture Solution Engine
 */

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };

  try {
    const body = await context.request.json().catch(() => ({}));
    const problemDescription = body.problemDescription || body.problem || "Automate customer support and sales lead capture";
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return honest offline/unconfigured response if API key is not configured in Cloudflare env
      return new Response(JSON.stringify({
        status: "CONFIG_REQUIRED",
        pipeline: "Autonomous Enterprise Lead & Support Pipeline",
        nodes: [
          "1. Playwright Stealth Ingestion & Webhook Trigger",
          "2. Gemini 2.0 Flash Intent Classification & Vector Routing",
          "3. Supabase RLS CRM Record Creation",
          "4. Multi-Channel WhatsApp & Email Dispatch"
        ],
        estimatedCost: "$750 USD (৳91,875 BDT)",
        timeSavedWeekly: "25+ Hours/Week",
        recommendedStack: "n8n + Gemini 2.0 Flash + Supabase + PostgreSQL 17 + Cloudflare Edge",
        note: "Add GEMINI_API_KEY to Cloudflare Pages Environment Variables for live bespoke generation."
      }), { headers: corsHeaders });
    }

    const prompt = `Act as an enterprise AI architect. Analyze this business problem: "${problemDescription}". 
    Return strictly JSON in this schema:
    {
      "pipeline": "Name of automation",
      "nodes": ["Step 1", "Step 2", "Step 3"],
      "estimatedCost": "$XXX",
      "timeSavedWeekly": "XX Hours",
      "recommendedStack": "Tech stack details"
    }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    return new Response(resultText, {
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
