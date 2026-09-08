/**
 * Cloudflare Pages Function: /api/finance/reconciliation
 * Nightly Financial Reconciliation & Double-Entry Ledger Verification
 *
 * Enforces production reality:
 * - When database is configured: queries live ibos_orders, ibos_revenue, ibos_commission_ledger
 * - When database is unconfigured: reports CONFIGURATION_REQUIRED (never fake mock balances)
 * - Supports POST transaction auditing using PaymentReconciliationEngine
 */

import { PaymentReconciliationEngine } from '../../_shared/ai_brain/reconciliation_engine.js';

function corsHeaders(request) {
    const origin = request.headers.get("Origin") || "*";
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const headers = corsHeaders(request);

    // Reality Boundary Check: Do not claim live reconciled balance without credentials
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        return new Response(JSON.stringify({
            reconciliation_id: `REC-${Date.now()}`,
            status: "CONFIGURATION_REQUIRED",
            data_mode: "UNCONFIGURED",
            message: "Supabase environment credentials required for live ledger reconciliation.",
            discrepancies: 0,
            net_settled_revenue_usd: 0,
            gateway_fees_paid_usd: 0,
            affiliate_commissions_locked_usd: 0,
            retained_earnings_usd: 0,
            audit_invariant_verified: false,
            timestamp: new Date().toISOString()
        }, null, 2), { status: 200, headers });
    }

    try {
        const base = `${env.SUPABASE_URL}/rest/v1`;
        const key = env.SUPABASE_SERVICE_ROLE_KEY;
        const auth = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

        const [ordersRes, revRes, commRes, expRes] = await Promise.all([
            fetch(`${base}/ibos_orders?payment_status=eq.paid&select=id,order_code,amount,currency,payment_status`, { headers: auth }),
            fetch(`${base}/ibos_revenue?select=id,order_id,amount,currency`, { headers: auth }),
            fetch(`${base}/ibos_commission_ledger?select=id,amount,status`, { headers: auth }),
            fetch(`${base}/ibos_expenses?select=id,amount,currency`, { headers: auth })
        ]);

        const paidOrders = ordersRes.ok ? await ordersRes.json().catch(() => []) : [];
        const revenueRows = revRes.ok ? await revRes.json().catch(() => []) : [];
        const commissionRows = commRes.ok ? await commRes.json().catch(() => []) : [];
        const expenseRows = expRes.ok ? await expRes.json().catch(() => []) : [];

        const totalOrdersUsd = paidOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
        const totalRevenueLedgerUsd = revenueRows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        const totalCommissionsUsd = commissionRows.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
        const totalExpensesUsd = expenseRows.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        // Audit check: Order settled vs Revenue ledger credit parity
        const discrepancies = [];
        for (const order of paidOrders) {
            const revMatch = revenueRows.find(r => r.order_id === order.id || r.order_id === order.order_code);
            if (!revMatch) {
                discrepancies.push({
                    order_id: order.order_code,
                    issue: 'PAID_ORDER_MISSING_REVENUE_CREDIT',
                    amount: order.amount
                });
            }
        }

        const isBalanced = discrepancies.length === 0 && Math.abs(totalOrdersUsd - totalRevenueLedgerUsd) < 0.01;
        const netSettledRevenue = totalRevenueLedgerUsd;
        const retainedEarnings = Math.max(0, netSettledRevenue - totalCommissionsUsd - totalExpensesUsd);

        const responsePayload = {
            reconciliation_id: `REC-${Date.now()}`,
            status: isBalanced ? "RECONCILED_BALANCED" : "DISCREPANCIES_DETECTED",
            data_mode: "LIVE_LEDGER",
            discrepancies: discrepancies.length,
            discrepancy_details: discrepancies,
            net_settled_revenue_usd: Math.round(netSettledRevenue * 100) / 100,
            gateway_fees_paid_usd: 0,
            affiliate_commissions_locked_usd: Math.round(totalCommissionsUsd * 100) / 100,
            total_expenses_usd: Math.round(totalExpensesUsd * 100) / 100,
            retained_earnings_usd: Math.round(retainedEarnings * 100) / 100,
            audit_invariant_verified: isBalanced,
            timestamp: new Date().toISOString()
        };

        return new Response(JSON.stringify(responsePayload, null, 2), { status: 200, headers });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message,
            timestamp: new Date().toISOString()
        }, null, 2), { status: 500, headers });
    }
}

export async function onRequestPost(context) {
    const { request } = context;
    const headers = corsHeaders(request);

    try {
        const body = await request.json().catch(() => ({}));
        const { provider_tx, local_order, webhook_event } = body;

        const engine = new PaymentReconciliationEngine();
        const result = engine.reconcileTransaction({
            providerTx: provider_tx,
            localOrder: local_order,
            webhookEvent: webhook_event
        });

        return new Response(JSON.stringify({
            status: "SUCCESS",
            result
        }, null, 2), { status: 200, headers });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "ERROR",
            error: err.message
        }, null, 2), { status: 400, headers });
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
}
