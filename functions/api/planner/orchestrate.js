/**
 * Cloudflare Pages Function: /api/planner/orchestrate
 * Planner Agent & Dynamic Agent Graph Synthesizer
 */

import { PlannerEngine } from '../../_shared/ai_brain/planner_engine.js';

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
        const goal = body.goal || "Scale B2B Inbound Customer Acquisition";
        const contextData = body.context || {};

        const engine = new PlannerEngine();
        const plan = engine.synthesizePlan(goal, contextData);

        return new Response(JSON.stringify({
            status: "SUCCESS",
            plan
        }), { headers, status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

