/**
 * Cloudflare Pages Function: /api/capabilities/status
 * Returns the machine-verifiable capability registry status for frontend components.
 */

export async function onRequestGet(context) {
    const capabilities = [
        { id: 'payment.stripe', name: 'Stripe Gateway', status: 'SANDBOX_VERIFIED', domain: 'FINANCE', isLive: false },
        { id: 'payment.bkash', name: 'bKash Gateway', status: 'SANDBOX_VERIFIED', domain: 'FINANCE', isLive: false },
        { id: 'affiliate.attribution', name: 'S2S Affiliate Attribution', status: 'INTEGRATION_VERIFIED', domain: 'GROWTH', isLive: false },
        { id: 'crm.lead_hunter', name: 'Lead Discovery & Quarantine', status: 'UNIT_VERIFIED', domain: 'GROWTH', isLive: false },
        { id: 'outreach.whatsapp', name: 'WhatsApp Outbound', status: 'NOT_CONFIGURED', domain: 'GROWTH', isLive: false },
        { id: 'outreach.email', name: 'Email Outbound', status: 'NOT_CONFIGURED', domain: 'GROWTH', isLive: false },
        { id: 'project.execution_worker', name: 'Sandboxed Project Worker', status: 'SANDBOX_VERIFIED', domain: 'DELIVERY', isLive: false },
        { id: 'qa.independent_verifier', name: 'Dual-Agent QA Gate (0.95+)', status: 'UNIT_VERIFIED', domain: 'CONTROL', isLive: false },
        { id: 'delivery.owner_release', name: 'Owner L3 Release Gate', status: 'UNIT_VERIFIED', domain: 'CONTROL', isLive: false },
        { id: 'learning.skill_registry', name: 'Governed Skill Pipeline', status: 'SANDBOX_VERIFIED', domain: 'LEARNING', isLive: false }
    ];

    return new Response(JSON.stringify({
        status: 'SUCCESS',
        capabilities,
        timestamp: new Date().toISOString()
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}
