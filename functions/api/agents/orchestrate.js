/**
 * Cloudflare Pages Function: /api/agents/orchestrate
 * Multi-Agent Swarm Orchestrator, Anti-Loop Recursion Bounding & Tool Sandbox Gateway
 */

const AGENT_CATALOG = {
    'ceo': { id: 'ceo', role: 'Executive Commander', permission: 'L2_SAFE_EXECUTE' },
    'sales': { id: 'sales', role: 'Deal Closer', permission: 'L2_SAFE_EXECUTE' },
    'architect': { id: 'architect', role: 'Solution Architect', permission: 'L1_DRAFT' },
    'developer': { id: 'developer', role: 'Developer Swarm Lead', permission: 'L3_APPROVAL' },
    'qa': { id: 'qa', role: 'Quality Assurance Verifier', permission: 'L0_OBSERVE' },
    'whatsapp': { id: 'whatsapp', role: 'Bilingual Conversational Specialist', permission: 'L2_SAFE_EXECUTE' }
};

export async function onRequestPost(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const { agent_id = 'sales', prompt = '', delegation_depth = 1 } = body;

        // Anti-Loop Recursion Guard
        if (delegation_depth > 5) {
            return new Response(JSON.stringify({
                status: 'RECURSION_LIMIT_EXCEEDED',
                error: 'Anti-loop policy strictly halts agent delegation depth > 5.'
            }), { status: 400, headers: corsHeaders });
        }

        const targetAgent = AGENT_CATALOG[agent_id] || AGENT_CATALOG['sales'];

        return new Response(JSON.stringify({
            status: 'ORCHESTRATION_SUCCESS',
            agent: targetAgent,
            delegation_depth,
            decision: 'DELEGATE_SAFE_SANDBOX',
            timestamp: new Date().toISOString()
        }), { status: 200, headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
