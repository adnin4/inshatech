/**
 * Cloudflare Pages Function: /api/contracts/dispatch
 * Inter-Agent Structured Contract Protocol & Task Dispatcher
 */

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
        const taskId = "tsk_" + Date.now().toString().slice(-6);

        const contract = {
            task_id: taskId,
            from_agent: body.from_agent || "PLANNER_AGENT",
            to_agent: body.to_agent || "SALES_AGENT",
            objective: body.objective || "Qualify customer business requirements",
            inputs: body.inputs || {},
            constraints: {
                max_budget_usd: body.max_budget_usd || 2.00,
                timeout_ms: body.timeout_ms || 4000
            },
            status: "ACCEPTED",
            created_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: "SUCCESS",
            contract
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

