/**
 * Cloudflare Pages Function: /api/fulfillment/pipeline
 * Post-Sale Fulfillment Pipeline & Project Delivery Controller
 */

import { FulfillmentEngine } from '../../_shared/ai_brain/fulfillment_engine.js';

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const engine = new FulfillmentEngine();
        const project = engine.initiateFulfillment(body);

        return new Response(JSON.stringify({
            status: "SUCCESS",
            fulfillment_project: project
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

