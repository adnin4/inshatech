// IINSHA AI-BOS authoritative conversational entrypoint.
// Model responses are conversational output; they are not proof of business execution.

import { AUTHORITATIVE_SERVICES, resolveAuthoritativeCatalog } from '../../../_shared/knowledge/services_catalog.js';
import { INTERNAL_AGENT_ROSTER, FIVE_TIER_HITL_LEVELS } from '../../../_shared/agent_registry.js';
import { SalesEngine } from '../../../_shared/ai_brain/sales_engine.js';
import { ToolExecutionGateway } from '../../../_shared/ai_brain/tool_execution_gateway.js';

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
    return Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const corsHeaders = getCorsHeaders(request);

    try {
        const body = await request.json().catch(() => ({}));
        const { message, session_id, mode = 'general', history = [], state = {} } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return new Response(JSON.stringify({ status: 'ERROR', error: 'Message is required and must be a non-empty string' }), { headers: corsHeaders, status: 400 });
        }

        const rawMessage = message.slice(0, 2000).trim();
        const cleanMessage = rawMessage
            .replace(/<[^>]*>?/gm, '')
            .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
        const sessionId = session_id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const missionId = `mis_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
        const lowerMsg = cleanMessage.toLowerCase();

        let detectedAgentKey = 'sales';
        let detectedAgent = 'SALES_AGENT';
        let agentRole = 'Sales & Revenue Agent';
        let intent = 'consultation';
        const confidence = 0.95;
        let requestedSideEffect = false;
        let invokedTool = null;
        let toolReceipt = null;

        if (lowerMsg.includes('architect') || lowerMsg.includes('tech') || lowerMsg.includes('stack') || lowerMsg.includes('docker') || lowerMsg.includes('python') || lowerMsg.includes('database')) {
            detectedAgentKey = 'architect';
            detectedAgent = 'ARCHITECT_AGENT';
            agentRole = INTERNAL_AGENT_ROSTER.architect.name;
            intent = 'technical_design';
        } else if (lowerMsg.includes('support') || lowerMsg.includes('help') || lowerMsg.includes('issue') || lowerMsg.includes('error') || lowerMsg.includes('broken')) {
            detectedAgentKey = 'success';
            detectedAgent = 'SUPPORT_AGENT';
            agentRole = INTERNAL_AGENT_ROSTER.success.name;
            intent = 'technical_support';
        } else if (lowerMsg.includes('affiliate') || lowerMsg.includes('partner') || lowerMsg.includes('commission') || lowerMsg.includes('payout')) {
            detectedAgentKey = 'affiliate';
            detectedAgent = 'AFFILIATE_AGENT';
            agentRole = INTERNAL_AGENT_ROSTER.affiliate.name;
            intent = 'partner_inquiry';
        } else if (lowerMsg.includes('pricing') || lowerMsg.includes('cost') || lowerMsg.includes('price') || lowerMsg.includes('package') || lowerMsg.includes('roi')) {
            detectedAgentKey = 'sales';
            detectedAgent = 'SALES_AGENT';
            agentRole = INTERNAL_AGENT_ROSTER.sales.name;
            intent = 'pricing_discovery';
        } else if (lowerMsg.includes('dev') || lowerMsg.includes('build') || lowerMsg.includes('code') || lowerMsg.includes('deploy') || lowerMsg.includes('execute') || lowerMsg.includes('developer')) {
            detectedAgentKey = 'developer';
            detectedAgent = 'DEVELOPER_AGENT';
            agentRole = INTERNAL_AGENT_ROSTER.developer.name;
            intent = 'code_development';
            requestedSideEffect = true;
        }

        const agentMetadata = INTERNAL_AGENT_ROSTER[detectedAgentKey] || INTERNAL_AGENT_ROSTER.sales;
        const hitlLevel = FIVE_TIER_HITL_LEVELS[agentMetadata.level] || FIVE_TIER_HITL_LEVELS.L2_SAFE_EXECUTE;

        // Tool Execution Spine: If pricing, catalog, or ROI query, invoke tool gateway
        const gateway = new ToolExecutionGateway();
        if (intent === 'pricing_discovery' || lowerMsg.includes('catalog') || lowerMsg.includes('service')) {
            invokedTool = 'service_catalog_lookup';
            toolReceipt = await gateway.execute({
                agent_id: detectedAgent,
                tool_id: 'service_catalog_lookup',
                arguments_payload: { query: cleanMessage }
            });
        }

        const geminiApiKey = env.GEMINI_API_KEY || env.GOOGLE_AI_API_KEY;
        const configuredModel = env.GEMINI_MODEL || 'gemini-3.8-flash';
        let reply = '';
        let modelUsed = 'deterministic_agentic_brain';
        let modelStatus = 'DETERMINISTIC_FALLBACK';
        let runtimeState = 'DETERMINISTIC_RESPONSE';
        let providerResponseId = null;
        let providerModelVersion = null;

        // Authoritative catalog resolved dynamically from DB with verified fallback projection
        const resolvedCatalogData = await resolveAuthoritativeCatalog(env);
        const resolvedServices = resolvedCatalogData.services;
        const catalogSummary = resolvedServices.map(s => `- ${s.name} (${s.id}): $${s.priceUSD} USD / ৳${Number(s.priceBDT || 0).toLocaleString()} BDT (${s.category}, Delivery: ${s.deliveryDays} business days)`).join('\n');

        if (geminiApiKey) {
            try {
                const systemPrompt = `You are the IINSHA AI-BOS ${agentRole} (${detectedAgent}).
You represent Insha Tech (Adnin Sadat Mahin).
Authoritative service catalog:
${catalogSummary}

Rules:
- Respond in the user's language (English or Bengali).
- Be precise, professional and truthful.
- Never claim a payment, deployment, CRM mutation, external message, customer result, or tool execution unless corresponding backend/provider evidence exists.
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
                    { role: 'user', parts: [{ text: `${systemPrompt}\n\nClient User Query: ${cleanMessage}` }] }
                ];

                const geminiRes = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, maxOutputTokens: 800 } })
                });

                if (geminiRes.ok) {
                    const geminiData = await geminiRes.json();
                    const text = geminiData.candidates?.[0]?.content?.parts?.map(p => p?.text || '').join('').trim();
                    if (text) {
                        reply = text;
                        modelUsed = configuredModel;
                        modelStatus = 'LIVE_MODEL_INFERENCE';
                        runtimeState = 'MODEL_RESPONSE';
                        providerResponseId = geminiData.responseId || null;
                        providerModelVersion = geminiData.modelVersion || null;
                    }
                }
            } catch (modelErr) {
                console.warn('Gemini edge fallback engaged:', modelErr?.message || 'provider error');
            }
        }

        if (!reply) {
            if (intent === 'pricing_discovery') {
                reply = 'IINSHA AI-BOS turnkey automation packages start from $249 USD (৳30,502 BDT). Authoritative solutions include Document OCR ($249), n8n Enterprise Cluster ($497), WhatsApp Bot ($750), Lead Swarm ($850), and AI Voice Receptionist ($1,800).';
            } else if (intent === 'technical_design') {
                reply = 'I can help design the architecture using the authoritative IINSHA catalog. External deployment or provider action requires a configured backend adapter and verification evidence.';
            } else if (intent === 'partner_inquiry') {
                reply = 'I can explain the partner program and 20% commission structure. Payout execution remains provider-dependent and must be verified separately.';
            } else if (intent === 'code_development') {
                reply = 'I can help scope a development workflow. Actual sandbox execution requires a configured isolated worker and independent verification.';
            } else if (intent === 'technical_support') {
                reply = 'Please describe the symptom, affected endpoint, and relevant project context. I can help triage without claiming a fix was applied unless backend evidence exists.';
            } else {
                reply = 'Hello! I am the IINSHA AI Copilot. I can help with automation architecture, service selection, pricing discovery, and next-step planning.';
            }
        }

        const inputHash = await sha256(cleanMessage);
        const outputHash = await sha256(reply);
        const evidenceSignature = await sha256(`${sessionId}:${missionId}:${inputHash}:${outputHash}`);

        // Persistence to Supabase when service role key is present
        let persisted = false;
        let persistenceStatus = 'CONFIGURATION_REQUIRED';
        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const dbRes = await fetch(`${env.SUPABASE_URL}/rest/v1/ibos_messages`, {
                    method: 'POST',
                    headers: {
                        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
                        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
                        'Content-Type': 'application/json',
                        Prefer: 'return=minimal'
                    },
                    body: JSON.stringify({
                        session_id: sessionId,
                        role: 'user',
                        content: cleanMessage,
                        metadata: { agent: detectedAgent, intent, mission_id: missionId }
                    })
                });
                if (dbRes.ok) {
                    persisted = true;
                    persistenceStatus = 'PERSISTED_TO_SUPABASE';
                } else {
                    persistenceStatus = 'DATABASE_WRITE_REJECTED';
                }
            } catch {
                persistenceStatus = 'DATABASE_NETWORK_ERROR';
            }
        }

        const suggestedActions = [
            { label: 'AI Solution Finder', action: 'OPEN_FINDER' },
            { label: 'Turnkey Packages', action: 'OPEN_STORE' },
            { label: 'Direct Founder Consultation', action: 'OPEN_WHATSAPP' }
        ];

        const responsePayload = {
            status: 'SUCCESS',
            success_type: 'RESPONSE_ONLY',
            response_state: 'RESPONSE_GENERATED',
            execution_status: 'NOT_EXECUTED',
            execution_state: 'NOT_EXECUTED',
            session_id: sessionId,
            mission_id: missionId,
            agent: {
                id: detectedAgent,
                role: agentRole,
                level: agentMetadata.level,
                cost_cap_usd: agentMetadata.costCapUsd,
                mode,
                intent,
                confidence
            },
            model_info: {
                model: modelUsed,
                status: modelStatus,
                configured_model: configuredModel,
                provider_response_id: providerResponseId,
                provider_model_version: providerModelVersion,
                runtime_state: runtimeState,
                temperature: 0.7
            },
            reply,
            tool_receipt: toolReceipt,
            suggested_actions: suggestedActions,
            evidence: {
                execution_id: `exec_${Date.now().toString(36)}`,
                input_sha256: inputHash,
                output_sha256: outputHash,
                evidence_signature: evidenceSignature,
                policy_verdict: 'NOT_EXECUTED',
                hitl_policy_verdict: hitlLevel.blocked ? 'BLOCKED_BY_POLICY' : (hitlLevel.autoApprove ? 'AUTO_APPROVED' : 'APPROVAL_REQUIRED'),
                risk_level: requestedSideEffect ? 'PENDING_EXECUTION_REVIEW' : 'LOW',
                requested_side_effect: requestedSideEffect,
                catalog_source: resolvedCatalogData.source,
                persisted,
                persistence_status: persistenceStatus,
                timestamp: new Date().toISOString()
            },
            client_state: state
        };

        return new Response(JSON.stringify(responsePayload, null, 2), { headers: corsHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ status: 'ERROR', response_state: 'ERROR', execution_state: 'EXECUTION_FAILED', error: err.message || 'Internal server error in Agent Execution Pipeline' }), { headers: corsHeaders, status: 500 });
    }
}

export async function onRequestOptions(context) {
    const origin = context.request?.headers?.get('Origin') || '';
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
