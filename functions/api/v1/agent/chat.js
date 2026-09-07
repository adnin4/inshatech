// IINSHA AI-BOS authoritative conversational entrypoint.
// Model responses are conversational output; they are not proof of business execution.

const ALLOWED_ORIGINS = [
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8080',
    'http://localhost:8788',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8788'
];

function isOriginAllowed(origin) {
    if (!origin) return false;
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    return /^https:\/\/[a-z0-9-]+\.inshatech\.pages\.dev$/i.test(origin);
}

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';
    return {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID, X-Idempotency-Key',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
}

async function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json().catch(() => ({}));
        const { message, session_id, mode = 'general', history = [], state = {} } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Message is required and must be a non-empty string'
            }), { headers: corsHeaders, status: 400 });
        }

        const rawMessage = message.slice(0, 2000).trim();
        const cleanMessage = rawMessage
            .replace(/<[^>]*>?/gm, '')
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

        const sessionId = session_id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const missionId = `mis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        const lowerMsg = cleanMessage.toLowerCase();

        let detectedAgent = 'SALES_AGENT';
        let agentRole = 'Sales & Growth Strategist';
        let intent = 'consultation';
        let confidence = 0.95;

        if (lowerMsg.includes('architect') || lowerMsg.includes('tech') || lowerMsg.includes('stack') || lowerMsg.includes('docker') || lowerMsg.includes('python') || lowerMsg.includes('database')) {
            detectedAgent = 'ARCHITECT_AGENT';
            agentRole = 'Solution Architect Lead';
            intent = 'technical_design';
        } else if (lowerMsg.includes('support') || lowerMsg.includes('help') || lowerMsg.includes('issue') || lowerMsg.includes('error') || lowerMsg.includes('broken')) {
            detectedAgent = 'SUPPORT_AGENT';
            agentRole = 'Customer Support & SRE';
            intent = 'technical_support';
        } else if (lowerMsg.includes('affiliate') || lowerMsg.includes('partner') || lowerMsg.includes('commission') || lowerMsg.includes('payout')) {
            detectedAgent = 'AFFILIATE_AGENT';
            agentRole = 'Affiliate & Partnership Lead';
            intent = 'partner_inquiry';
        } else if (lowerMsg.includes('pricing') || lowerMsg.includes('cost') || lowerMsg.includes('price') || lowerMsg.includes('package') || lowerMsg.includes('roi')) {
            detectedAgent = 'SALES_AGENT';
            agentRole = 'Sales & Revenue Strategist';
            intent = 'pricing_discovery';
        } else if (lowerMsg.includes('dev') || lowerMsg.includes('build') || lowerMsg.includes('code') || lowerMsg.includes('developer')) {
            detectedAgent = 'DEVELOPER_AGENT';
            agentRole = 'Sandbox Developer Swarm Lead';
            intent = 'code_development';
        }

        const geminiApiKey = env.GEMINI_API_KEY || env.GOOGLE_AI_API_KEY;
        const configuredModel = env.GEMINI_MODEL || 'gemini-3.7-flash';
        let reply = '';
        let modelUsed = 'deterministic_agentic_brain';
        let runtimeState = 'DETERMINISTIC_RESPONSE';
        let providerResponseId = null;
        let providerModelVersion = null;

        if (geminiApiKey) {
            try {
                const systemPrompt = `You are the IINSHA AI-BOS ${agentRole} (${detectedAgent}).
You represent Insha Tech.
Authoritative service catalog:
- B2B SaaS 5-Agent Hunter Swarm: $850 (৳104,125 BDT)
- 24/7 E-Commerce WhatsApp & Messenger Sales Agent: $750 (৳91,875 BDT)
- AI Voice Receptionist: $1800 (৳220,500 BDT)
- Self-Hosted n8n Enterprise Cluster Deployment: $497 (৳60,882 BDT)
- Autonomous Invoice & Document OCR Pipeline: $249 (৳30,502 BDT)

Rules:
- Respond in the user's language.
- Be precise and truthful.
- Never claim a payment, deployment, CRM mutation, external message, customer result, or tool execution unless the corresponding backend/provider evidence exists.
- A conversational response is not proof that a business mission executed.`;

                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(configuredModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
                const historyContext = Array.isArray(history)
                    ? history.slice(-6).map(h => ({
                        role: h?.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: String(h?.text || h?.message || '').slice(0, 4000) }]
                    })).filter(h => h.parts[0].text)
                    : [];

                const contents = [
                    ...historyContext,
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${cleanMessage}` }] }
                ];

                const geminiResp = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
                    })
                });

                if (geminiResp.ok) {
                    const geminiData = await geminiResp.json();
                    const text = geminiData.candidates?.[0]?.content?.parts?.map(p => p?.text || '').join('').trim();
                    if (text) {
                        reply = text;
                        modelUsed = configuredModel;
                        runtimeState = 'MODEL_RESPONSE';
                        providerResponseId = geminiData.responseId || null;
                        providerModelVersion = geminiData.modelVersion || null;
                    }
                }
            } catch (_) {
                // Fall through to deterministic, non-side-effecting catalog response.
            }
        }

        if (!reply) {
            if (intent === 'pricing_discovery') {
                reply = 'IINSHA AI-BOS turnkey automation packages start from $249 (৳30,502 BDT). Pricing and scope can be refined from the authoritative service catalog.';
            } else if (intent === 'technical_design') {
                reply = 'I can help design the architecture using the available IINSHA service catalog. Any external deployment or provider action requires a configured backend adapter and verification evidence.';
            } else if (intent === 'partner_inquiry') {
                reply = 'I can explain the current partner program and route you to the partner surface. Payout execution remains provider-dependent and must be verified separately.';
            } else if (intent === 'code_development') {
                reply = 'I can help scope a development workflow. Actual sandbox execution requires a configured isolated worker and independent verification.';
            } else if (intent === 'technical_support') {
                reply = 'Please describe the symptom, affected endpoint, and relevant project context. I can help triage the issue without claiming a fix was applied unless the backend provides evidence.';
            } else {
                reply = 'Hello! I am the IINSHA AI Copilot. I can help with automation architecture, service selection, pricing discovery, and next-step planning.';
            }
        }

        const inputHash = await sha256(cleanMessage);
        const outputHash = await sha256(reply);
        const evidenceSignature = await sha256(`${sessionId}:${missionId}:${inputHash}:${outputHash}`);

        const suggestedActions = [
            { label: 'AI Solution Finder', action: 'OPEN_FINDER' },
            { label: 'Turnkey Packages', action: 'OPEN_STORE' },
            { label: 'Direct Founder Consultation', action: 'OPEN_WHATSAPP' }
        ];

        const responsePayload = {
            // Backward-compatible response success means the assistant generated a reply.
            // It does NOT mean that a business side effect was executed.
            status: 'SUCCESS',
            success_type: 'RESPONSE_ONLY',
            execution_status: 'NOT_EXECUTED',
            session_id: sessionId,
            mission_id: missionId,
            agent: {
                id: detectedAgent,
                role: agentRole,
                mode,
                intent,
                confidence
            },
            model_info: {
                model: modelUsed,
                configured_model: configuredModel,
                provider_response_id: providerResponseId,
                provider_model_version: providerModelVersion,
                runtime_state: runtimeState
            },
            reply,
            suggested_actions: suggestedActions,
            evidence: {
                execution_id: `exec_${Date.now().toString(36)}`,
                input_sha256: inputHash,
                output_sha256: outputHash,
                evidence_signature: evidenceSignature,
                policy_verdict: 'NOT_EXECUTED',
                risk_level: 'LOW',
                persisted: false,
                timestamp: new Date().toISOString()
            },
            client_state: state
        };

        return new Response(JSON.stringify(responsePayload, null, 2), { headers: corsHeaders });
    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message || 'Internal server error in Agent Execution Pipeline'
        }), { headers: corsHeaders, status: 500 });
    }
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID, X-Idempotency-Key'
        },
        status: 204
    });
}
