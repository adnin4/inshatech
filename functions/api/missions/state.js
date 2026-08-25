/**
 * Cloudflare Pages Function: /api/missions/state
 * Checkpointed Mission State Manager & Lifecycle Controller.
 *
 * State changes describe requested/verified lifecycle transitions. No endpoint
 * response is a claim that an external side effect happened without evidence.
 */

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Session-ID",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const action = body.action || 'create_mission';

        if (action === 'create_mission') {
            const missionId = `mis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            const title = body.title || "Custom AI Automation Mission";
            const goal = body.goal || "Scale Business Revenue";
            const contextData = body.context || {};

            const mission = {
                id: missionId,
                title,
                goal,
                status: 'PLANNING',
                state_machine_stage: 'Analysing requirements',
                budget_allocated: Number(body.budget_allocated || 20.00),
                budget_used: 0,
                agents_invoked: [],
                tool_calls_count: 0,
                trace_steps: [
                    { name: 'Understanding goal', status: 'PLANNED', agent: 'COMMANDER', timestamp: new Date().toISOString() },
                    { name: 'Analysing requirements', status: 'PLANNED', agent: 'SALES', timestamp: new Date().toISOString() },
                    { name: 'Selecting architecture', status: 'PLANNED', agent: 'ARCHITECT', timestamp: new Date().toISOString() }
                ],
                context: contextData,
                createdAt: new Date().toISOString(),
                production_claim: false,
                verification: 'PLANNING_ONLY'
            };

            return new Response(JSON.stringify({ status: "OK", mission }), { headers, status: 200 });
        }

        if (action === 'checkpoint_decision') {
            const checkpointId = body.checkpoint_id;
            const decision = body.decision;
            const editedPayload = body.edited_payload || null;

            if (!['APPROVED', 'EDITED', 'REJECTED'].includes(decision)) {
                return new Response(JSON.stringify({ status: 'ERROR', error: 'Invalid checkpoint decision' }), { headers, status: 400 });
            }

            return new Response(JSON.stringify({
                status: "OK",
                checkpoint_id: checkpointId,
                decision,
                edited_payload: editedPayload,
                execution_state: decision === 'REJECTED' ? 'HALTED' : 'APPROVAL_RECORDED',
                production_claim: false,
                message: decision === 'APPROVED'
                    ? 'Approval recorded. A verified executor must still provide an execution receipt.'
                    : decision === 'EDITED'
                        ? 'Edited decision recorded. A verified executor must still provide an execution receipt.'
                        : 'Action rejected. Mission remains safely halted.'
            }), { headers, status: 200 });
        }

        return new Response(JSON.stringify({
            status: "OK",
            message: "Mission state service available",
            production_claim: false
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ status: "ERROR", error: err.message }), { headers, status: 500 });
    }
}
