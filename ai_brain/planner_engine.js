/**
 * IINSHA Planner & Dynamic Agent Graph Engine
 * Decomposes high-level business goals into lean, specialized agent sub-graphs.
 * Planning is not execution; task states remain explicit until a real tool receipt exists.
 */

export class PlannerEngine {
    constructor() {
        this.specialistAgents = {
            LEAD_GEN: ['PLANNER_AGENT', 'RESEARCH_AGENT', 'SALES_AGENT', 'GUARDIAN_AGENT'],
            WORKFLOW_DEV: ['PLANNER_AGENT', 'ARCHITECT_AGENT', 'DEV_AGENT', 'DEVOPS_AGENT', 'GUARDIAN_AGENT'],
            MARKETING_LAUNCH: ['PLANNER_AGENT', 'MARKETING_AGENT', 'AFFILIATE_AGENT', 'FINANCE_AGENT'],
            SUPPORT_AUTOMATION: ['PLANNER_AGENT', 'SALES_AGENT', 'DEV_AGENT', 'GUARDIAN_AGENT']
        };
    }

    synthesizePlan(goalText, contextData = {}) {
        const goal = String(goalText || '').toLowerCase();
        let selectedGraphKey = 'LEAD_GEN';

        if (goal.includes('workflow') || goal.includes('n8n') || goal.includes('cluster') || goal.includes('developer')) selectedGraphKey = 'WORKFLOW_DEV';
        else if (goal.includes('marketing') || goal.includes('affiliate') || goal.includes('campaign') || goal.includes('seo')) selectedGraphKey = 'MARKETING_LAUNCH';
        else if (goal.includes('support') || goal.includes('whatsapp') || goal.includes('bot') || goal.includes('receptionist')) selectedGraphKey = 'SUPPORT_AUTOMATION';

        const requiredAgents = this.specialistAgents[selectedGraphKey];
        const missionId = 'mis_' + Date.now().toString().slice(-6);
        const now = new Date().toISOString();

        const subTasks = [
            {
                step: 1,
                task_id: `tsk_${missionId}_01`,
                assigned_agent: requiredAgents[0],
                objective: 'Deconstruct goal constraints, verify business memory & catalog',
                status: 'PLANNED',
                estimated_cost_usd: 0.002,
                duration_ms: 120
            },
            {
                step: 2,
                task_id: `tsk_${missionId}_02`,
                assigned_agent: requiredAgents[1],
                objective: 'Perform target ICP discovery & technical requirements matching',
                status: 'PLANNED',
                estimated_cost_usd: 0.005,
                duration_ms: 240
            },
            {
                step: 3,
                task_id: `tsk_${missionId}_03`,
                assigned_agent: requiredAgents[2],
                objective: 'Synthesize turnkey solution package with ROI and proposal draft',
                status: 'PLANNED',
                estimated_cost_usd: 0.008,
                duration_ms: 310
            },
            {
                step: 4,
                task_id: `tsk_${missionId}_04`,
                assigned_agent: requiredAgents[requiredAgents.length - 1],
                objective: 'Execute 5-level security check & trigger HITL checkpoint if needed',
                status: 'PLANNED',
                estimated_cost_usd: 0.001,
                duration_ms: 80
            }
        ];

        const totalCostEstimate = subTasks.reduce((acc, t) => acc + t.estimated_cost_usd, 0);

        return {
            mission_id: missionId,
            goal_title: goalText,
            selected_category: selectedGraphKey,
            dynamic_agent_graph: requiredAgents,
            active_agent_count: requiredAgents.length,
            savings_vs_full_swarm_percent: `${Math.round(((13 - requiredAgents.length) / 13) * 100)}%`,
            sub_tasks: subTasks,
            total_estimated_compute_cost_usd: Number(totalCostEstimate.toFixed(4)),
            context: contextData,
            created_at: now,
            production_claim: false,
            verification: 'PLANNING_ONLY'
        };
    }
}
