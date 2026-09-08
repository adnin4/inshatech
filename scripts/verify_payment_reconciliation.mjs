/**
 * IINSHA AI-BOS: Payment Reconciliation & Ledger Verification Suite
 *
 * Validates:
 * 1. PaymentReconciliationEngine triple-audit invariants:
 *    - Reconciled Clean
 *    - Gateway PAID but Local Order Pending (sync required)
 *    - Local Order Paid but Gateway Unknown (critical freeze)
 *    - Amount Mismatch (tampering/partial payment detection)
 *    - Currency Mismatch
 *    - Missing Durable Webhook Audit Row
 * 2. Cloudflare Function /api/finance/reconciliation:
 *    - Reality Boundary: Unconfigured env emits CONFIGURATION_REQUIRED
 *    - Balanced Ledger Verification: Order / Revenue parity check
 *    - Discrepancy Reporting: Detects uncredited paid orders
 *    - POST endpoint transaction auditing
 */

import { PaymentReconciliationEngine } from '../ai_brain/reconciliation_engine.js';
import { onRequestGet, onRequestPost } from '../functions/api/finance/reconciliation.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

async function runReconciliationSuite() {
    console.log('================================================================================');
    console.log('IINSHA AI-BOS: FINANCIAL RECONCILIATION & DOUBLE-ENTRY LEDGER TEST SUITE');
    console.log('================================================================================\n');

    // -------------------------------------------------------------------------
    // SUITE 1: Reconciliation Engine Triple-Audit Invariants
    // -------------------------------------------------------------------------
    console.log('--- SUITE 1: Triple-Source Transaction Audit Scenarios ---');
    const engine = new PaymentReconciliationEngine();

    // 1. Clean Reconciled Transaction
    const cleanCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-CLEAN-01', status: 'PAID', amount: 850, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-CLEAN-01', payment_status: 'paid', amount: 850, currency: 'USD', payment_provider: 'sslcommerz' },
        webhookEvent: { order_code: 'ORD-CLEAN-01', event_type: 'payment.success' }
    });
    assert(cleanCase.status === 'RECONCILED_CLEAN', 'Triple-matched transaction confirms RECONCILED_CLEAN');

    // 2. Gateway Paid but Local Order Pending
    const syncCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-SYNC-02', status: 'PAID', amount: 497, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-SYNC-02', payment_status: 'awaiting_payment', amount: 497, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-SYNC-02', event_type: 'payment.success' }
    });
    assert(
        syncCase.issues?.some(i => i.mismatch_type === 'PAID_BUT_LOCAL_PENDING' && i.action === 'SCHEDULE_STATUS_SYNC'),
        'Detects paid gateway transaction with pending local order and schedules sync'
    );

    // 3. Local Order Marked Paid but Gateway Record Missing / Unpaid (Critical Freeze)
    const fraudCase = engine.reconcileTransaction({
        providerTx: null,
        localOrder: { order_code: 'ORD-FRAUD-03', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: null
    });
    assert(
        fraudCase.issues?.some(i => i.mismatch_type === 'LOCAL_PAID_BUT_PROVIDER_UNKNOWN' && i.severity === 'CRITICAL' && i.action === 'FREEZE_ORDER_AND_ALERT_OWNER'),
        'Detects local paid order with zero gateway record and triggers CRITICAL order freeze'
    );

    // 4. Amount Mismatch (Underpayment / Tampering)
    const amountCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-AMT-04', status: 'PAID', amount: 50, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-AMT-04', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-AMT-04', event_type: 'payment.success' }
    });
    assert(
        amountCase.issues?.some(i => i.mismatch_type === 'AMOUNT_MISMATCH' && i.severity === 'HIGH'),
        'Detects amount mismatch between gateway settled amount and order amount'
    );

    // 5. Currency Mismatch
    const currCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-CURR-05', status: 'PAID', amount: 850, currency: 'BDT', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-CURR-05', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-CURR-05', event_type: 'payment.success' }
    });
    assert(
        currCase.issues?.some(i => i.mismatch_type === 'CURRENCY_MISMATCH' && i.severity === 'HIGH'),
        'Detects currency mismatch between gateway currency and order currency'
    );

    // 6. Missing Durable Webhook Audit Row
    const auditCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-AUDIT-06', status: 'PAID', amount: 850, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-AUDIT-06', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: null
    });
    assert(
        auditCase.issues?.some(i => i.mismatch_type === 'MISSING_DURABLE_AUDIT_LOG' && i.action === 'BACKFILL_AUDIT_FROM_PROVIDER'),
        'Detects missing durable webhook audit log and schedules backfill'
    );

    // -------------------------------------------------------------------------
    // SUITE 2: Cloudflare Function /api/finance/reconciliation Reality Boundary
    // -------------------------------------------------------------------------
    console.log('\n--- SUITE 2: /api/finance/reconciliation Reality Boundary & Ledger Tests ---');

    // 1. Unconfigured Environment: Must report CONFIGURATION_REQUIRED (never fake mock balances)
    const unconfigReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation');
    const unconfigRes = await onRequestGet({ request: unconfigReq, env: {} });
    const unconfigJson = await unconfigRes.json();
    assert(
        unconfigRes.status === 200 &&
        unconfigJson.status === 'CONFIGURATION_REQUIRED' &&
        unconfigJson.audit_invariant_verified === false,
        'Unconfigured environment honestly emits CONFIGURATION_REQUIRED with zero false claims'
    );

    // 2. Configured Environment with Balanced Ledger
    const mockEnv = {
        SUPABASE_URL: 'https://mock.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'mock_service_key'
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url, opts = {}) => {
        const urlStr = String(url);
        if (urlStr.includes('/ibos_orders?payment_status=eq.paid')) {
            return new Response(JSON.stringify([
                { id: 'uuid-1', order_code: 'ORD-101', amount: 850, currency: 'USD', payment_status: 'paid' },
                { id: 'uuid-2', order_code: 'ORD-102', amount: 497, currency: 'USD', payment_status: 'paid' }
            ]), { status: 200 });
        }
        if (urlStr.includes('/ibos_revenue')) {
            return new Response(JSON.stringify([
                { id: 'rev-1', order_id: 'uuid-1', amount: 850, currency: 'USD' },
                { id: 'rev-2', order_id: 'uuid-2', amount: 497, currency: 'USD' }
            ]), { status: 200 });
        }
        if (urlStr.includes('/ibos_commission_ledger')) {
            return new Response(JSON.stringify([
                { id: 'comm-1', amount: 170, status: 'pending' }
            ]), { status: 200 });
        }
        if (urlStr.includes('/ibos_expenses')) {
            return new Response(JSON.stringify([
                { id: 'exp-1', amount: 50, currency: 'USD' }
            ]), { status: 200 });
        }
        return originalFetch(url, opts);
    };

    try {
        const balancedReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation');
        const balancedRes = await onRequestGet({ request: balancedReq, env: mockEnv });
        const balancedJson = await balancedRes.json();
        assert(
            balancedRes.status === 200 &&
            balancedJson.status === 'RECONCILED_BALANCED' &&
            balancedJson.discrepancies === 0 &&
            balancedJson.net_settled_revenue_usd === 1347 &&
            balancedJson.audit_invariant_verified === true,
            'Balanced database ledger verifies parity between settled orders and revenue rows'
        );
    } finally {
        globalThis.fetch = originalFetch;
    }

    // 3. Configured Environment with Discrepancy (Paid order missing revenue row)
    globalThis.fetch = async (url, opts = {}) => {
        const urlStr = String(url);
        if (urlStr.includes('/ibos_orders?payment_status=eq.paid')) {
            return new Response(JSON.stringify([
                { id: 'uuid-1', order_code: 'ORD-101', amount: 850, currency: 'USD', payment_status: 'paid' },
                { id: 'uuid-uncredited', order_code: 'ORD-UNCREDITED', amount: 750, currency: 'USD', payment_status: 'paid' }
            ]), { status: 200 });
        }
        if (urlStr.includes('/ibos_revenue')) {
            // Only uuid-1 is credited! uuid-uncredited is missing!
            return new Response(JSON.stringify([
                { id: 'rev-1', order_id: 'uuid-1', amount: 850, currency: 'USD' }
            ]), { status: 200 });
        }
        if (urlStr.includes('/ibos_commission_ledger')) return new Response(JSON.stringify([]), { status: 200 });
        if (urlStr.includes('/ibos_expenses')) return new Response(JSON.stringify([]), { status: 200 });
        return originalFetch(url, opts);
    };

    try {
        const discReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation');
        const discRes = await onRequestGet({ request: discReq, env: mockEnv });
        const discJson = await discRes.json();
        assert(
            discRes.status === 200 &&
            discJson.status === 'DISCREPANCIES_DETECTED' &&
            discJson.discrepancies === 1 &&
            discJson.discrepancy_details[0].order_id === 'ORD-UNCREDITED' &&
            discJson.audit_invariant_verified === false,
            'Ledger discrepancy detected: uncredited paid order flagged immediately'
        );
    } finally {
        globalThis.fetch = originalFetch;
    }

    // 4. POST Transaction Audit endpoint
    const postReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            provider_tx: { tran_id: 'ORD-POST-99', status: 'PAID', amount: 850, currency: 'USD' },
            local_order: { order_code: 'ORD-POST-99', payment_status: 'paid', amount: 850, currency: 'USD' },
            webhook_event: { order_code: 'ORD-POST-99' }
        })
    });
    const postRes = await onRequestPost({ request: postReq });
    const postJson = await postRes.json();
    assert(
        postRes.status === 200 && postJson.status === 'SUCCESS' && postJson.result?.status === 'RECONCILED_CLEAN',
        'POST /api/finance/reconciliation successfully executes on-demand transaction audit'
    );

    console.log('\n================================================================================');
    console.log(`FINANCIAL RECONCILIATION SUITE SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
    console.log('================================================================================\n');
}

runReconciliationSuite().catch(err => {
    console.error('Fatal error running reconciliation test suite:', err);
    process.exit(1);
});
