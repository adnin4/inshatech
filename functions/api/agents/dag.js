/**
 * Cloudflare Pages Function: /api/agents/dag
 * Task DAG Dependency Graph Execution & HITL Approval Endpoint
 */

import { TaskDagOrchestrator } from '../../_shared/ai_brain/task_dag_orchestrator.js';

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
        const { action = 'create_and_run', dag_id, tasks = [], metadata = {} } = body;

        const orchestrator = new TaskDagOrchestrator();
        const activeDagId = dag_id || `dag_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        
        const dag = orchestrator.createDag(activeDagId, metadata);

        // Populate sample tasks if none provided
        const taskList = tasks.length > 0 ? tasks : [
            { id: 'task_01_requirements', agentId: 'requirements', description: 'Extract PRD and user stories', riskTier: 'LOW' },
            { id: 'task_02_architecture', agentId: 'architect', description: 'Design workflow topology blueprint', dependencies: ['task_01_requirements'], riskTier: 'LOW' },
            { id: 'task_03_code_gen', agentId: 'developer', description: 'Generate edge functions & workflows', dependencies: ['task_02_architecture'], riskTier: 'HIGH', requiresHitl: true },
            { id: 'task_04_qa_audit', agentId: 'qa', description: 'Execute comprehensive automated test suite', dependencies: ['task_03_code_gen'], riskTier: 'LOW' },
            { id: 'task_05_deploy', agentId: 'deployment_release', description: 'Promote to production edge', dependencies: ['task_04_qa_audit'], riskTier: 'CRITICAL', requiresHitl: true }
        ];

        for (const t of taskList) {
            orchestrator.addTask(activeDagId, t);
        }

        // Validate DAG (detect cycles, verify dependencies)
        orchestrator.validateDag(activeDagId);

        if (action === 'validate_only') {
            return new Response(JSON.stringify({
                status: 'VALID',
                dag_id: activeDagId,
                total_tasks: taskList.length,
                task_ids: taskList.map(t => t.id)
            }), { status: 200, headers });
        }

        // Execute initial step
        const execSummary = orchestrator.getExecutionSummary(activeDagId);

        return new Response(JSON.stringify({
            status: 'INITIALIZED',
            dag_id: activeDagId,
            summary: execSummary,
            timestamp: new Date().toISOString()
        }), { status: 200, headers });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 400, headers });
    }
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get("Origin") || "*";
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
