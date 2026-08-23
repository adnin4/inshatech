/**
 * Cloudflare Pages Function: /api/recorder/flight
 * Agent Black Box Mission Flight Recorder API
 */

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
        const flightTraceId = "flt_" + Date.now().toString().slice(-6);

        const flightLog = {
            flight_trace_id: flightTraceId,
            mission_id: body.mission_id || "mis_general",
            requesting_agent: body.agent || "AG-SALES-002",
            model_used: body.model || "gemini-1.5-flash",
            decision_summary: body.decision_summary || "Lead qualified based on budget > $1,000",
            policy_reference: body.policy_reference || "SALES_QUAL_V3",
            evidence: body.evidence || { source: "CRM_INTERACTION", confidence: 94.2 },
            total_tokens: body.tokens || 342,
            compute_cost_usd: body.cost_usd || 0.00034,
            recorded_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            flight_log: flightLog
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

