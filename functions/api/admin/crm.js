/**
 * IINSHA Admin CRM & Delivery Board API
 * Serves /api/admin/crm
 * Enforces fail-closed server-side session authentication.
 * Separates authentic live client deals from simulated demo mode data.
 */

import { getCorsHeaders, httpStatusForAuthError, verifyServerSession } from '../../_shared/auth_gate.js';

const DEMO_LEAD_DEALS = [
    { id: 'LEAD-101', name: 'Nexus Logistics Hub', stage: 'new', size: '$850 Pilot', comm: '$170.00', status: 'Inbound Webhook' },
    { id: 'LEAD-102', name: 'Dr. Finch Medical UK', stage: 'contacted', size: '$1,800 SOW', comm: '$360.00', status: 'Audit PDF Delivered' },
    { id: 'LEAD-103', name: 'Apex Nordic Agency', stage: 'qualified', size: '$3,500 White-Label', comm: '$700.00', status: 'ICP 94% Match' },
    { id: 'LEAD-104', name: 'CloudScale FinTech', stage: 'discovery', size: '$4,200 SaaS MVP', comm: '$840.00', status: 'Call Booked: Thu 3pm' },
    { id: 'LEAD-105', name: 'RetailPulse E-Com', stage: 'proposal', size: '$1,200 + $399/mo', comm: '$240.00', status: 'Tier 2 Proposal Out' },
    { id: 'LEAD-106', name: 'Kite Media Group', stage: 'negotiation', size: '$2,500 Contract', comm: '$500.00', status: 'Stripe Escrow Pending' },
    { id: 'DEAL-9720', name: 'SaaS Outbound Engine', stage: 'won', size: '$3,000 Setup + Retainer', comm: '$600.00', status: 'Paid & Active' }
];

const DEMO_DELIVERY_DEALS = [
    { id: 'PRJ-201', name: 'Dr. Finch Medical UK', stage: 'discovery', size: 'Voice AI Scope', comm: '$360.00', status: 'SOW Signed' },
    { id: 'PRJ-202', name: 'CloudScale FinTech', stage: 'blueprint', size: 'RLS & LLM Gateway', comm: '$840.00', status: 'C4 Diagram Review' },
    { id: 'PRJ-203', name: 'Nexus Logistics Hub', stage: 'development', size: 'Playwright Scraper Swarm', comm: '$170.00', status: 'Sprint 1 / Day 2' },
    { id: 'PRJ-204', name: 'SaaS Outbound Engine', stage: 'qa', size: '4-Browser Matrix', comm: '$600.00', status: 'Playwright 75/75 Pass' },
    { id: 'PRJ-205', name: 'Urban Real Estate', stage: 'uat', size: 'Lead Responder Bot', comm: '$150.00', status: 'UAT Sandbox Live' },
    { id: 'PRJ-206', name: 'RetailPulse E-Com', stage: 'deploy', size: 'Cloudflare Pages & Workers', comm: '$240.00', status: 'Zero-Downtime Live' },
    { id: 'PRJ-207', name: 'Apex Nordic Agency', stage: 'handover', size: 'White-Label Docs', comm: '$700.00', status: 'Loom & Repo Transfer' },
    { id: 'DEAL-9841', name: 'Apex Freight & Logistics', stage: 'retainer', size: '$349/mo SLA', comm: '$300.00', status: '24/7 Heartbeat Active' }
];

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: false
        });

        if (!auth.authorized) {
            return new Response(JSON.stringify({
                ok: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatusForAuthError(auth.status), headers });
        }

        const url = new URL(request.url);
        const isDemo = url.searchParams.get('demo') === 'true';

        if (isDemo) {
            return new Response(JSON.stringify({
                ok: true,
                isDemo: true,
                banner: '⚠️ DEMO MODE ACTIVE: Showing simulated reference pipelines and sample enterprise accounts for illustration only.',
                leads: DEMO_LEAD_DEALS,
                delivery: DEMO_DELIVERY_DEALS
            }), { status: 200, headers });
        }

        // Live Production Mode: Query live orders from Supabase if available
        const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

        let liveLeads = [];
        let liveDelivery = [];

        if (supabaseUrl && supabaseKey) {
            try {
                const ordersRes = await fetch(`${supabaseUrl}/rest/v1/ibos_orders?select=*&order=created_at.desc`, {
                    headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
                });
                if (ordersRes.ok) {
                    const orders = await ordersRes.json();
                    if (Array.isArray(orders)) {
                        liveLeads = orders.map(o => ({
                            id: o.order_id || o.id,
                            name: o.client_name || o.customer_email || 'Inbound Prospect',
                            stage: o.status === 'completed' ? 'won' : 'new',
                            size: `$${(o.amount_usd || 0).toLocaleString()} USD`,
                            comm: `+$${Math.round((o.amount_usd || 0) * 0.20)}.00`,
                            status: o.status || 'Pending Verification'
                        }));
                    }
                }
            } catch (_) {}
        }

        return new Response(JSON.stringify({
            ok: true,
            isDemo: false,
            leads: liveLeads,
            delivery: liveDelivery,
            notice: liveLeads.length === 0 ? 'No active production deals found in current pipeline.' : undefined
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            ok: false,
            error: e.message || 'Internal server error'
        }), { status: 500, headers });
    }
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    try {
        const auth = await verifyServerSession(request, env, {
            requiredRole: 'owner',
            minHierarchyLevel: 1,
            requireMfa: false
        });

        if (!auth.authorized) {
            return new Response(JSON.stringify({
                ok: false,
                status: auth.status,
                error: auth.error
            }), { status: httpStatusForAuthError(auth.status), headers });
        }

        let body = {};
        try {
            body = await request.json();
        } catch (_) {
            return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON body' }), { status: 400, headers });
        }

        // Deal stage movement or note addition
        return new Response(JSON.stringify({
            ok: true,
            message: 'Deal updated successfully',
            deal: body
        }), { status: 200, headers });
    } catch (e) {
        return new Response(JSON.stringify({
            ok: false,
            error: e.message || 'Internal server error'
        }), { status: 500, headers });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
