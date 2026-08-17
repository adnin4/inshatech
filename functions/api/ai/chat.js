/**
 * Cloudflare Pages Function: /api/ai/chat
 * Stateful multi-turn AI Commander API for IINSHA AI-BOS
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Affiliate-Token, X-Admin-Token",
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const conversationId = body.conversation_id || ("conv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6));
        const userMessage = (body.message || "").trim();
        const history = Array.isArray(body.history) ? body.history : [];
        const state = body.state || {};

        if (!userMessage) {
            return new Response(JSON.stringify({
                status: "ERROR",
                error: "Message is required"
            }), { headers: corsHeaders, status: 400 });
        }

        // If Gemini API Key is present in environment, call Google Gemini 1.5/2.0 Flash
        const geminiApiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
        if (geminiApiKey) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
                
                const systemInstruction = `You are the Lead Autonomous AI Sales, Marketing & Architecture Engineer for IINSHA AI-BOS (founded by Adnin Sadat Mahin).
You are fluent in Bengali (বাংলা), Banglish, and English.
You solve real business bottlenecks using n8n self-hosted workflows ($5.99/mo VPS vs $500/mo Zapier), Playwright stealth scrapers, 24/7 E-commerce WhatsApp bots ($750 / ৳91,875), and B2B SaaS Lead Generation swarms ($850 / ৳104,125).
USD to BDT exchange rate is ৳122.50.
RULES:
1. Never repeat canned messages or give generic non-answers.
2. If user greets ("hi", "amar help lagbe", "ei mia"), greet back warmly and ask specifically what problem they want solved.
3. If user asks "ki ki service available", give a concise categorized list of services.
4. If user complains about repetition, apologize immediately and provide a fresh, direct solution.
5. Keep track of user context across turns (e.g. industry, employee size, target leads).`;

                const contents = [];
                // Add conversation history
                for (const msg of history.slice(-6)) {
                    contents.push({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content.replace(/<[^>]*>?/gm, '') }]
                    });
                }
                contents.push({
                    role: 'user',
                    parts: [{ text: userMessage }]
                });

                const geminiResp = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        systemInstruction: { parts: [{ text: systemInstruction }] },
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 800
                        }
                    })
                });

                if (geminiResp.ok) {
                    const geminiData = await geminiResp.json();
                    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return new Response(JSON.stringify({
                            status: "SUCCESS",
                            source: "Gemini Generative Cloud Edge",
                            conversation_id: conversationId,
                            response: text
                        }), { headers: corsHeaders });
                    }
                }
            } catch (err) {
                console.error("Gemini API invocation error:", err);
            }
        }

        // Return stateful acknowledged response if Gemini key not configured
        return new Response(JSON.stringify({
            status: "SUCCESS",
            source: "IINSHA Edge Engine",
            conversation_id: conversationId,
            fallback_needed: true
        }), { headers: corsHeaders });

    } catch (error) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: error.message
        }), { headers: corsHeaders, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Affiliate-Token, X-Admin-Token"
        },
        status: 204
    });
}
