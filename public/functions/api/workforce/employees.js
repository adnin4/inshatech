/**
 * Cloudflare Pages Function: /api/workforce/employees
 * Digital Employee Registry & Departmental Role Governance API
 */

export const DIGITAL_EMPLOYEES = [
    {
        employee_code: 'AG-CEO-001',
        name: 'CEO Strategic Commander',
        department: 'Governance & Strategy',
        role: 'Chief AI Executive',
        permission_level: 'LEVEL_2_EXECUTE',
        daily_budget: 15.00,
        daily_spend: 0.82,
        reliability_score: 99.1,
        status: 'ACTIVE'
    },
    {
        employee_code: 'AG-SALES-002',
        name: 'AI Sales Executive',
        department: 'Revenue',
        role: 'B2B Inbound Sales Rep',
        permission_level: 'LEVEL_2_EXECUTE',
        daily_budget: 10.00,
        daily_spend: 1.24,
        reliability_score: 98.7,
        status: 'ACTIVE'
    },
    {
        employee_code: 'AG-ARCH-003',
        name: 'Solution Architect Lead',
        department: 'Engineering',
        role: 'Enterprise Systems Architect',
        permission_level: 'LEVEL_1_DRAFT',
        daily_budget: 12.00,
        daily_spend: 0.65,
        reliability_score: 99.4,
        status: 'ACTIVE'
    },
    {
        employee_code: 'AG-FIN-004',
        name: 'AI CFO & Ledger Guardian',
        department: 'Finance',
        role: 'Financial Analyst & Payout Validator',
        permission_level: 'LEVEL_0_READ',
        daily_budget: 5.00,
        daily_spend: 0.12,
        reliability_score: 100.0,
        status: 'ACTIVE'
    },
    {
        employee_code: 'AG-GUARD-005',
        name: 'Security & Policy Guardian',
        department: 'Governance',
        role: 'Policy Auditor & Threat Firewall',
        permission_level: 'LEVEL_0_READ',
        daily_budget: 5.00,
        daily_spend: 0.38,
        reliability_score: 100.0,
        status: 'ACTIVE'
    }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        total_employees: DIGITAL_EMPLOYEES.length,
        workforce_health: "100% ONLINE",
        employees: DIGITAL_EMPLOYEES
    }), { headers, status: 200 });
}
