/**
 * Cloudflare Pages Function: /api/finance/reconciliation
 * Nightly Financial Reconciliation & Double-Entry Ledger Verification
 *
 * Security boundary:
 * - Finance reconciliation is never a public endpoint.
 * - A dedicated FINANCE_ADMIN_TOKEN is required in Cloudflare Secrets.
 * - SUPABASE_SERVICE_ROLE_KEY is server-side only and is never accepted from clients.
 *
 * Reality boundary:
 * - When database is configured: queries live ibos_orders, ibos_revenue,
 *   ibos_commission_ledger and ibos_expenses.
 * - When database or finance authorization is unconfigured: reports configuration
 *   required and never fabricates financial balances.
 * - Supports POST transaction auditing using PaymentReconciliationEngine.
 */

import { PaymentReconciliationEngine } from '../../_shared/ai_brain/reconciliation_engine.js';

const ORIGINS = new Set([
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com'
]);

function corsHeaders(request) {
    const origin = request.headers.get('Origin') || '';
    return {
        'Access-Control-Allow-Origin': ORIGINS.has(origin) ? origin : 'https://inshatech.pages.dev',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
}

function json(body, status, headers) {
    return new Response(JSON.stringify(body, null, 2), { status, headers });
}

function requireFinanceAuth(request, env) {
    const configuredToken = String(env?.FINANCE_ADMIN_TOKEN || '').trim();
    if (!configuredToken) {
        return {
            ok: false,
            response: json({
                status: 'CONFIGURATION_REQUIRED',
                code: 'FINANCE_AUTH_NOT_CONFIGURED',
                message: 'Finance reconciliation authorization is not configured.'
            }, 503, corsHeaders(request))
        };
    }

    const authorization = request.headers.get('Authorization') || '';
    const prefix = 'Bearer ';
    if (!authorization.startsWith(prefix)) {
        return {
            ok: false,
            response: json({
                status: 'UNAUTHORIZED',
                code: 'FINANCE_AUTH_REQUIRED',
                message: 'Finance administrator authorization is required.'
            }, 401, corsHeaders(request))
        };
    }

    const suppliedToken = authorization.slice(prefix.length).trim();
    if (!suppliedToken || suppliedToken !== configuredToken) {
        return {
            ok: false,
            response: json({
                status: 'FORBIDDEN',
                code: 'FINANCE_AUTH_INVALID',
                message: 'Finance administrator authorization is invalid.'
            }, 403, corsHeaders(request))
        };
    }

    return { ok: true };
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = corsHeaders(request);
    const auth = requireFinanceAuth(request, env);
    if (!auth.ok) return auth.response;

    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        return json({
            reconciliation_id: `REC-${Date.now()}`,
            status: 'CONFIGURATION_REQUIRED',
            data_mode: 'UNCONFIGURED',
            message: 'Supabase server configuration is required for live ledger reconciliation.',
            discrepancies: 0,
            net_settled_revenue_usd: 0,
            gateway_fees_paid_usd: 0,
            affiliate_commissions_locked_usd: 0,
            retained_earnings_usd: 0,
            audit_invariant_verified: false,
            timestamp: new Date().toISOString()
        }, 503, headers);
    }

    try {
        const base = `${env.SUPABASE_URL}/rest/v1`;
        const key = env.SUPABASE_SERVICE_ROLE_KEY;
        const authHeaders = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

        const [ordersRes, revRes, commRes, expRes] = await Promise.all([
            fetch(`${base}/ibos_orders?payment_status=eq.paid&select=id,order_code,amount,currency,payment_status`, { headers: authHeaders }),
            fetch(`${base}/ibos_revenue?select=id,order_id,amount,currency`, { headers: authHeaders }),
            fetch(`${base}/ibos_commission_ledger?select=id,amount,status`, { headers: authHeaders }),
            fetch(`${base}/ibos_expenses?select=id,amount,currency`, { headers: authHeaders })
        ]);

        const responses = [
            ['ibos_orders', ordersRes],
            ['ibos_revenue', revRes],
            ['ibos_commission_ledger', commRes],
            ['ibos_expenses', expRes]
        ];
        const failedSource = responses.find(([, response]) => !response.ok);
        if (failedSource) {
            const [tableName, response] = failedSource;
            return json({
                status: 'DATABASE_ERROR',
                code: 'RECONCILIATION_SOURCE_UNAVAILABLE',
                message: `Unable to read reconciliation source: ${tableName}.`,
                upstream_status: response.status,
                audit_invariant_verified: false,
                timestamp: new Date().toISOString()
            }, 502, headers);
        }

        const paidOrders = await ordersRes.json();
        const revenueRows = await revRes.json();
        const commissionRows = await commRes.json();
        const expenseRows = await expRes.json();

        const totalOrdersUsd = paidOrders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
        const totalRevenueLedgerUsd = revenueRows.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
        const totalCommissionsUsd = commissionRows.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
        const totalExpensesUsd = expenseRows.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

        const discrepancies = [];
        for (const order of paidOrders) {
            const revMatches = revenueRows.filter(r => r.order_id === order.id || r.order_id === order.order_code);
            const creditedAmount = revMatches.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
            if (revMatches.length === 0) {
                discrepancies.push({
                    order_id: order.order_code,
                    issue: 'PAID_ORDER_MISSING_REVENUE_CREDIT',
                    amount: order.amount
                });
            } else if (Math.abs(creditedAmount - (parseFloat(order.amount) || 0)) >= 0.01) {
                discrepancies.push({
                    order_id: order.order_code,
                    issue: 'REVENUE_CREDIT_AMOUNT_MISMATCH',
                    expected: order.amount,
                    actual: creditedAmount
                });
            }
        }

        const url = new URL(request.url);
        const autoResolve = url.searchParams.get('auto_resolve') === 'true';
        let backfilledCount = 0;

        if (autoResolve && discrepancies.length > 0) {
            for (const item of discrepancies) {
                if (item.issue === 'PAID_ORDER_MISSING_REVENUE_CREDIT') {
                    const targetOrder = paidOrders.find(o => o.order_code === item.order_id);
                    if (targetOrder) {
                        const amountNum = parseFloat(targetOrder.amount || '0');
                        if (amountNum > 0) {
                            const nowIso = new Date().toISOString();
                            const backfillRes = await fetch(`${base}/ibos_revenue`, {
                                method: 'POST',
                                headers: authHeaders,
                                body: JSON.stringify({
                                    order_id: targetOrder.id || null,
                                    amount: amountNum,
                                    currency: targetOrder.currency || 'USD',
                                    type: 'one_time',
                                    period_start: nowIso.slice(0, 10),
                                    period_end: nowIso.slice(0, 10),
                                    created_at: nowIso
                                })
                            }).catch(() => null);

                            if (backfillRes && backfillRes.ok) {
                                backfilledCount++;
                                item.reconciliation_action = 'BACKFILLED_REVENUE_RECORD';
                                await fetch(`${base}/ibos_orders?order_code=eq.${encodeURIComponent(targetOrder.order_code)}`, {
                                    method: 'PATCH',
                                    headers: authHeaders,
                                    body: JSON.stringify({
                                        metadata: {
                                            ledger_sync_pending: false,
                                            reconciled_at: nowIso
                                        }
                                    })
                                }).catch(() => null);
                            }
                        }
                    }
                }
            }
        }

        const isBalanced = discrepancies.length === 0 && Math.abs(totalOrdersUsd - totalRevenueLedgerUsd) < 0.01;
        const netSettledRevenue = totalRevenueLedgerUsd;
        const retainedEarnings = netSettledRevenue - totalCommissionsUsd - totalExpensesUsd;

        const responsePayload = {
            reconciliation_id: `REC-${Date.now()}`,
            status: isBalanced ? 'RECONCILED_BALANCED' : 'DISCREPANCIES_DETECTED',
            data_mode: 'LIVE_LEDGER',
            discrepancies: discrepancies.length,
            discrepancy_details: discrepancies,
            auto_resolve_applied: autoResolve,
            backfilled_count: backfilledCount,
            paid_order_total_usd: Math.round(totalOrdersUsd * 100) / 100,
            net_settled_revenue_usd: Math.round(netSettledRevenue * 100) / 100,
            gateway_fees_paid_usd: null,
            affiliate_commissions_locked_usd: Math.round(totalCommissionsUsd * 100) / 100,
            total_expenses_usd: Math.round(totalExpensesUsd * 100) / 100,
            retained_earnings_usd: Math.round(retainedEarnings * 100) / 100,
            audit_invariant_verified: isBalanced,
            timestamp: new Date().toISOString()
        };

        return json(responsePayload, 200, headers);
    } catch (err) {
        return json({
            status: 'ERROR',
            code: 'RECONCILIATION_EXECUTION_FAILED',
            message: err?.message || 'Unexpected reconciliation error.',
            audit_invariant_verified: false,
            timestamp: new Date().toISOString()
        }, 500, headers);
    }
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = corsHeaders(request);
    const auth = requireFinanceAuth(request, env);
    if (!auth.ok) return auth.response;

    try {
        const body = await request.json().catch(() => ({}));
        const { provider_tx, local_order, webhook_event, revenue_record } = body;

        const engine = new PaymentReconciliationEngine();
        const result = engine.reconcileTransaction({
            providerTx: provider_tx,
            localOrder: local_order,
            webhookEvent: webhook_event,
            revenueRecord: revenue_record
        });

        return json({ status: 'SUCCESS', result }, 200, headers);
    } catch (err) {
        return json({
            status: 'ERROR',
            code: 'RECONCILIATION_AUDIT_FAILED',
            error: err.message
        }, 400, headers);
    }
}

export function onRequestOptions({ request }) {
    return new Response(null, { status: 204, headers: corsHeaders(request) });
}
