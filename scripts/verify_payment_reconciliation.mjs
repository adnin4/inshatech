/**
 * IINSHA AI-BOS: Payment Reconciliation & Ledger Verification Suite
 *
 * Validates the reconciliation engine and protected finance endpoint
 * without inserting synthetic financial rows into the real database.
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

    console.log('--- SUITE 1: Triple-Source Transaction Audit Scenarios ---');
    const engine = new PaymentReconciliationEngine();

    const cleanCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-CLEAN-01', status: 'PAID', amount: 850, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-CLEAN-01', payment_status: 'paid', amount: 850, currency: 'USD', payment_provider: 'sslcommerz' },
        webhookEvent: { order_code: 'ORD-CLEAN-01', event_type: 'payment.success' }
    });
    assert(cleanCase.status === 'RECONCILED_CLEAN', 'Triple-matched transaction confirms RECONCILED_CLEAN');

    const syncCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-SYNC-02', status: 'PAID', amount: 497, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-SYNC-02', payment_status: 'awaiting_payment', amount: 497, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-SYNC-02', event_type: 'payment.success' }
    });
    assert(
        syncCase.issues?.some(i => i.mismatch_type === 'PAID_BUT_LOCAL_PENDING' && i.action === 'SCHEDULE_STATUS_SYNC'),
        'Detects paid gateway transaction with pending local order and schedules sync'
    );

    const fraudCase = engine.reconcileTransaction({
        providerTx: null,
        localOrder: { order_code: 'ORD-FRAUD-03', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: null
    });
    assert(
        fraudCase.issues?.some(i => i.mismatch_type === 'LOCAL_PAID_BUT_PROVIDER_UNKNOWN' && i.severity === 'CRITICAL' && i.action === 'FREEZE_ORDER_AND_ALERT_OWNER'),
        'Detects local paid order with zero gateway record and triggers CRITICAL order freeze'
    );

    const amountCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-AMT-04', status: 'PAID', amount: 50, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-AMT-04', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-AMT-04', event_type: 'payment.success' }
    });
    assert(
        amountCase.issues?.some(i => i.mismatch_type === 'AMOUNT_MISMATCH' && i.severity === 'HIGH'),
        'Detects amount mismatch between gateway settled amount and order amount'
    );

    const currCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-CURR-05', status: 'PAID', amount: 850, currency: 'BDT', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-CURR-05', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-CURR-05', event_type: 'payment.success' }
    });
    assert(
        currCase.issues?.some(i => i.mismatch_type === 'CURRENCY_MISMATCH' && i.severity === 'HIGH'),
        'Detects currency mismatch between gateway currency and order currency'
    );

    const auditCase = engine.reconcileTransaction({
        providerTx: { tran_id: 'ORD-AUDIT-06', status: 'PAID', amount: 850, currency: 'USD', provider: 'sslcommerz' },
        localOrder: { order_code: 'ORD-AUDIT-06', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: null
    });
    assert(
        auditCase.issues?.some(i => i.mismatch_type === 'MISSING_DURABLE_AUDIT_LOG' && i.action === 'BACKFILL_AUDIT_FROM_PROVIDER'),
        'Detects missing durable webhook audit log and schedules backfill'
    );

    console.log('\n--- SUITE 2: Finance Endpoint Access Boundary ---');

    const unconfiguredReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation');
    const unconfiguredRes = await onRequestGet({ request: unconfiguredReq, env: {} });
    const unconfiguredJson = await unconfiguredRes.json();
    assert(
        unconfiguredRes.status === 503 && unconfiguredJson.code === 'FINANCE_AUTH_NOT_CONFIGURED',
        'Finance GET fails closed when finance authorization is not configured'
    );

    const invalidTokenReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation', {
        headers: { Authorization: 'Bearer wrong-token' }
    });
    const invalidTokenRes = await onRequestGet({
        request: invalidTokenReq,
        env: { FINANCE_ADMIN_TOKEN: 'test-finance-token' }
    });
    assert(invalidTokenRes.status === 403, 'Finance GET rejects an invalid administrator token');

    const validNoDbReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation', {
        headers: { Authorization: 'Bearer test-finance-token' }
    });
    const validNoDbRes = await onRequestGet({
        request: validNoDbReq,
        env: { FINANCE_ADMIN_TOKEN: 'test-finance-token' }
    });
    const validNoDbJson = await validNoDbRes.json();
    assert(
        validNoDbRes.status === 503 && validNoDbJson.status === 'CONFIGURATION_REQUIRED' && validNoDbJson.audit_invariant_verified === false,
        'Authorized finance caller gets CONFIGURATION_REQUIRED rather than fabricated ledger data when DB is unavailable'
    );

    const invalidPostReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation', {
        method: 'POST',
        headers: { Authorization: 'Bearer wrong-token', 'Content-Type': 'application/json' },
        body: '{}'
    });
    const invalidPostRes = await onRequestPost({
        request: invalidPostReq,
        env: { FINANCE_ADMIN_TOKEN: 'test-finance-token' }
    });
    assert(invalidPostRes.status === 403, 'Finance POST rejects an invalid administrator token');

    const validPostReq = new Request('https://inshatech.pages.dev/api/finance/reconciliation', {
        method: 'POST',
        headers: { Authorization: 'Bearer test-finance-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            provider_tx: { tran_id: 'ORD-POST-99', status: 'PAID', amount: 850, currency: 'USD' },
            local_order: { order_code: 'ORD-POST-99', payment_status: 'paid', amount: 850, currency: 'USD' },
            webhook_event: { order_code: 'ORD-POST-99' }
        })
    });
    const validPostRes = await onRequestPost({
        request: validPostReq,
        env: { FINANCE_ADMIN_TOKEN: 'test-finance-token' }
    });
    const validPostJson = await validPostRes.json();
    assert(
        validPostRes.status === 200 && validPostJson.status === 'SUCCESS' && validPostJson.result?.status === 'RECONCILED_CLEAN',
        'Authorized finance POST can run an on-demand transaction audit'
    );

    console.log('\n================================================================================');
    console.log(`FINANCIAL RECONCILIATION SUITE SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
    console.log('================================================================================\n');
}

runReconciliationSuite().catch(err => {
    console.error('Fatal error running reconciliation test suite:', err);
    process.exit(1);
});
