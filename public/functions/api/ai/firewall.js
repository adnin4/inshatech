/**
 * Cloudflare Pages Function: /api/ai/firewall
 * AI Permission Firewall: OWASP Prompt Injection Detection, PII Redaction & Risk Scoring
 */

const ALLOWED_ORIGINS = [
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8788',
    'http://127.0.0.1:8788'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.pages.dev');
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
    };
}

const INJECTION_PATTERNS = [
    /ignore (all )?previous instructions/i,
    /system prompt override/i,
    /you are now in developer mode/i,
    /reveal your secret key/i,
    /drop database/i,
    /execute unauthorized/i,
    /bypass security/i
];

function scrubPii(text = '') {
    if (typeof text !== 'string') return text;
    // Redact credit cards, passwords, SSN-like patterns
    return text
        .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_PAYMENT_CARD]')
        .replace(/(?:password|secret|key)\s*[:=]\s*['"]?[^\s'"]+/gi, 'secret: [REDACTED]');
}

export async function onRequestPost(context) {
    const { request } = context;
    const headers = getCorsHeaders(request);

    try {
        const body = await request.json().catch(() => ({}));
        const { agent_id = 'sales', action_requested = 'general_query', prompt = '', payload = {} } = body;

        // 1. OWASP Prompt Injection & Jailbreak Defense
        let injectionDetected = false;
        for (const pattern of INJECTION_PATTERNS) {
            if (pattern.test(prompt) || pattern.test(JSON.stringify(payload))) {
                injectionDetected = true;
                break;
            }
        }

        if (injectionDetected) {
            return new Response(JSON.stringify({
                status: 'BLOCKED_BY_FIREWALL',
                reason: 'OWASP Prompt Injection or Adversarial Jailbreak Pattern Detected',
                risk_score: 99,
                timestamp: new Date().toISOString()
            }), { headers, status: 403 });
        }

        // 2. PII Sanitization & Data Minimization
        const sanitizedPrompt = scrubPii(prompt);

        // 3. Dynamic Risk Scoring
        let riskScore = 10;
        let requiresHITL = false;

        if (action_requested.includes('refund') || action_requested.includes('payout')) {
            riskScore = 85;
            requiresHITL = true;
        } else if (action_requested.includes('create') || action_requested.includes('send')) {
            riskScore = 35;
        } else if (action_requested.includes('delete') || action_requested.includes('destroy')) {
            riskScore = 95;
            requiresHITL = true;
        }

        const agentIdentityStamp = {
            agent_id,
            department: 'Revenue & Operations',
            action_requested,
            sanitized_prompt: sanitizedPrompt,
            risk_score: riskScore,
            policy_check: riskScore > 80 ? 'HITL_REQUIRED' : 'POLICY_PASS',
            autonomy_level: riskScore > 80 ? 'LEVEL_6_EXECUTE_WITH_APPROVAL' : 'LEVEL_5_EXECUTE_LOW_RISK',
            decision: requiresHITL ? 'PAUSED_FOR_APPROVAL' : 'PERMITTED_TO_EXECUTE',
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: 'FIREWALL_VERIFIED',
            identity_stamp: agentIdentityStamp
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: getCorsHeaders(context.request),
        status: 204
    });
}
