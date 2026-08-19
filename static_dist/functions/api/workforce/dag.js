/**
 * Cloudflare Pages Function: /api/workforce/dag
 * Mission DAG (Directed Acyclic Graph) Execution Topology Controller
 */

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    const sampleDAG = {
        dag_code: "dag_b2b_sales_loop",
        title: "B2B SaaS Revenue Generation Loop",
        total_nodes: 6,
        nodes: [
            { id: "node_1", agent: "PLANNER_AGENT", action: "Goal Decomposition", status: "COMPLETED", duration_ms: 110 },
            { id: "node_2", agent: "RESEARCH_AGENT", action: "ICP Lead Discovery", status: "COMPLETED", duration_ms: 280 },
            { id: "node_3", agent: "SALES_AGENT", action: "Proposal Generation", status: "COMPLETED", duration_ms: 190 },
            { id: "node_4", agent: "FINANCE_AGENT", action: "Margin Guardian Check", status: "COMPLETED", duration_ms: 80 },
            { id: "node_5", agent: "GUARDIAN_AGENT", action: "Policy & Risk Audit", status: "COMPLETED", duration_ms: 60 },
            { id: "node_6", agent: "OWNER", action: "Human Approval Gate", status: "WAITING_APPROVAL", duration_ms: 0 }
        ],
        estimated_margin_percent: 54.2,
        created_at: new Date().toISOString()
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        dag: sampleDAG
    }), { headers, status: 200 });
}
