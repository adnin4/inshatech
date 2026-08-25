/**
 * Cloudflare Pages Function: /api/workforce/dag
 * Mission DAG topology controller.
 * The response describes a proposed topology only; no node is marked complete
 * until a real executor receipt is available.
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
            { id: "node_1", agent: "PLANNER_AGENT", action: "Goal Decomposition", state: "PLANNED" },
            { id: "node_2", agent: "RESEARCH_AGENT", action: "ICP Lead Discovery", state: "PLANNED" },
            { id: "node_3", agent: "SALES_AGENT", action: "Proposal Generation", state: "PLANNED" },
            { id: "node_4", agent: "FINANCE_AGENT", action: "Margin Guardian Check", state: "PLANNED" },
            { id: "node_5", agent: "GUARDIAN_AGENT", action: "Policy & Risk Audit", state: "PLANNED" },
            { id: "node_6", agent: "OWNER", action: "Human Approval Gate", state: "WAITING_APPROVAL" }
        ],
        estimated_margin_percent: null,
        verification: "TOPOLOGY_ONLY",
        production_claim: false,
        created_at: new Date().toISOString()
    };

    return new Response(JSON.stringify({
        status: "OK",
        dag: sampleDAG
    }), { headers, status: 200 });
}
