/**
 * Cloudflare Pages Function: /api/vault/broker
 * Secure Secret Broker Proxy API
 */

import { SecretBroker } from '../../_shared/ai_brain/secret_broker.js';

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const broker = new SecretBroker();
        const result = broker.executeThroughBroker(body.broker_token || "TOKEN_GEMINI_EMBED", body);

        return new Response(JSON.stringify(result), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

