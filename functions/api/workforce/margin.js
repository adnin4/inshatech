/**
 * Cloudflare Pages Function: /api/workforce/margin
 * Margin Guardian & Deal Profitability Audit API
 */

import { MarginGuardian } from '../../ai_brain/margin_guardian.js';

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
        const guardian = new MarginGuardian();
        const audit = guardian.auditDealProfitability(body);

        return new Response(JSON.stringify({
            status: "SUCCESS",
            audit
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}
