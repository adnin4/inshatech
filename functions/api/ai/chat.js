/**
 * Cloudflare Pages Function: /api/ai/chat
 * Multi-Intent Conversational AI Business Copilot Edge Engine for IINSHA AI-BOS
 */

import { CANONICAL_SERVICES } from '../services.js';

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

    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    if (!globalThis.chatRateLimitMap) globalThis.chatRateLimitMap = new Map();
    const now = Date.now();
    const minute = 60 * 1000;
    const limit = 50;
    
    let record = globalThis.chatRateLimitMap.get(ip) || { count: 0, resetTime: now + minute };
    if (now > record.resetTime) record = { count: 1, resetTime: now + minute };
    else record.count++;
    globalThis.chatRateLimitMap.set(ip, record);
    
    const remaining = Math.max(0, limit - record.count);
    corsHeaders["X-RateLimit-Remaining"] = remaining.toString();

    if (record.count > limit) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429, headers: corsHeaders });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const conversationId = body.conversation_id || ("conv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6));
        const userMessage = (body.message || "").trim();
        const history = Array.isArray(body.history) ? body.history : [];
        const state = body.state || {};

        if (!userMessage || typeof userMessage !== 'string') {
            return new Response(JSON.stringify({
                status: "ERROR",
                error: "Message is required and must be a string"
            }), { headers: corsHeaders, status: 400 });
        }
        
        if (userMessage.length > 2000) {
            return new Response(JSON.stringify({
                status: "ERROR",
                error: "Message exceeds maximum length of 2000 characters"
            }), { headers: corsHeaders, status: 400 });
        }

        const sanitizedMessage = userMessage.replace(/<[^>]*>?/gm, '');

        const geminiApiKey = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;

        if (geminiApiKey) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
                
                const servicesContext = JSON.stringify(CANONICAL_SERVICES.map(s => ({
                    name: s.name,
                    category: s.category,
                    priceUSD: s.priceUSD,
                    priceBDT: Math.round(s.priceUSD * 122.50),
                    badge: s.badge,
                    desc: s.description,
                    deliveryDays: s.deliveryDays
                })));

                const systemInstruction = `You are the Lead Autonomous AI Business Copilot & Senior AI Systems Architect for IINSHA AI-BOS (founded by Lead Engineer Adnin Sadat Mahin, WhatsApp: +8801629286887, Website: https://inshatech.pages.dev/).

CORE CONVERSATIONAL PRINCIPLES:
1. MULTILINGUAL SUPREME CAPABILITY: Respond fluently in the user's language (Banglaবাংলা, Banglish, English, or mixed). Match their exact tone and dialect naturally.
2. NEVER REPEAT TEMPLATES OR CANNED RESPONSES:
   - If user asks a general knowledge question ("What is RAG?", "Explain n8n vs Zapier", "How do APIs work?"), ANSWER THE QUESTION DIRECTLY FIRST with technical clarity. Do NOT force a sales pitch.
   - If user complains about repetition ("why are you repeating same answer?", "ekoi uttoribar bari keno?"), APOLOGIZE IMMEDIATELY, acknowledge the error, and provide a fresh, direct solution.
3. CONVERSATIONAL MEMORY & INTENT DETECTION:
   - Keep track of known user context from prior history: Industry, Channel (WhatsApp/Web), Budget, Urgency, Selected Package.
   - Do NOT ask questions the user already answered.
4. CONSULTATIVE SALES & TRANSPARENT PRICING:
   - Exchange Rate: $1 USD = ৳122.50 BDT.
   - Use verified Canonical Services Catalog below:
     ${servicesContext}
   - When recommending services, explain WHY it fits their specific business need. Never invent prices or fake guarantees.
5. HUMAN & WHATSAPP ESCALATION:
   - If user requests to talk to Adnin or human engineer ("talk to human", "call Adnin", "whatsapp support"), offer human handoff and generate WhatsApp inquiry details.
6. 28-PILLAR AFFILIATE & GROWTH PARTNER PROGRAM:
   - If user asks about affiliate marketing, partner programs, referral links, or creating an account ("affiliate marketing account kivabe create korbo?", "website e affiliate marketing ache naki?", "referral link kivabe pabo"):
   - EXPLICITLY CONFIRM: Yes! IINSHA operates a full 28-Pillar Affiliate & Growth Partner OS.
   - COMMISSIONS: 15% upfront + 20% to 30% lifetime recurring commissions on all client deals ($150 to $3,000+ USD per client).
   - PAYOUTS: bKash, Nagad, Wise Bank Wire, Local Bank, Crypto USDT.
   - REGISTRATION STEPS: 1. Go to affiliate.html, 2. Enter Name, Email & Payout method, 3. Get instant 60-day tracking link (/go/your-code), 4. Track clicks & earnings in real-time on the Partner Dashboard.`;

                const contents = [];
                for (const msg of history.slice(-8)) {
                    contents.push({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content.replace(/<[^>]*>?/gm, '') }]
                    });
                }
                contents.push({
                    role: 'user',
                    parts: [{ text: sanitizedMessage }]
                });

                const geminiResp = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        systemInstruction: { parts: [{ text: systemInstruction }] },
                        generationConfig: {
                            temperature: 0.65,
                            maxOutputTokens: 1000
                        }
                    })
                });

                if (geminiResp.ok) {
                    const geminiData = await geminiResp.json();
                    const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        return new Response(JSON.stringify({
                            status: "SUCCESS",
                            source: "Gemini Generative Edge Engine",
                            conversation_id: conversationId,
                            response: text
                        }), { headers: corsHeaders });
                    }
                }
            } catch (err) {
                console.error("Gemini API invocation error:", err);
            }
        }

        // Fallback response signaling client-side rule engine
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
