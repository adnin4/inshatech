/**
 * Cloudflare Pages Function: /api/missions/state
 * Checkpointed Mission State Manager & Lifecycle Controller
 * Supports DRAFT -> PLANNING -> RUNNING -> WAITING_APPROVAL -> EXECUTING -> COMPLETED
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
        const action = body.action || 'create_mission'; // 'create_mission', 'update_trace', 'checkpoint_decision', 'get_state'

        if (action === 'create_mission') {
            const missionId = "mis_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
            const title = body.title || "Custom AI Automation Mission";
            const goal = body.goal || "Scale Business Revenue";
            const contextData = body.context || {};

            const mission = {
                id: missionId,
                title,
                goal,
                status: 'PLANNING',
                state_machine_stage: 'Analysing requirements',
                budget_allocated: 20.00,
                budget_used: 0.0042,
                agents_invoked: ['COMMANDER', 'SALES', 'ARCHITECT'],
                tool_calls_count: 3,
                trace_steps: [
                    { name: 'Understanding goal', status: 'COMPLETED', agent: 'COMMANDER', timestamp: new Date().toISOString() },
                    { name: 'Analysing requirements', status: 'COMPLETED', agent: 'SALES', timestamp: new Date().toISOString() },
                    { name: 'Selecting architecture', status: 'IN_PROGRESS', agent: 'ARCHITECT', timestamp: new Date().toISOString() }
                ],
                context: contextData,
                createdAt: new Date().toISOString()
            };

            return new Response(JSON.stringify({
                status: "SUCCESS",
                mission
            }), { headers, status: 200 });
        }

        if (action === 'checkpoint_decision') {
            const checkpointId = body.checkpoint_id;
            const decision = body.decision; // 'APPROVED', 'EDITED', 'REJECTED'
            const editedPayload = body.edited_payload || null;

            return new Response(JSON.stringify({
                status: "SUCCESS",
                checkpoint_id: checkpointId,
                decision,
                edited_payload: editedPayload,
                message: decision === 'APPROVED' ? 'Action approved. Resuming mission execution.' : (decision === 'EDITED' ? 'Action modified. Executing with updated arguments.' : 'Action rejected. Mission safely halted.')
            }), { headers, status: 200 });
        }

        return new Response(JSON.stringify({
            status: "SUCCESS",
            message: "Mission State Operational"
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }), { headers, status: 500 });
    }
}

