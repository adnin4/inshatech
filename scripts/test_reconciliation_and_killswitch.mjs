import assert from 'node:assert';
import { PaymentReconciliationEngine } from '../ai_brain/reconciliation_engine.js';
import { KillSwitchRegistry } from '../ai_brain/kill_switch_registry.js';

function runTests() {
    console.log("================================================================================");
    console.log("RECONCILIATION ENGINE & KILL SWITCH REGISTRY VERIFICATION");
    console.log("================================================================================\n");

    // 1. Reconciliation Engine Tests
    const rec = new PaymentReconciliationEngine();

    // Clean match
    const cleanRes = rec.reconcileTransaction({
        providerTx: { tran_id: 'ORD-1', status: 'PAID', amount: 850, currency: 'USD', provider: 'stripe' },
        localOrder: { order_code: 'ORD-1', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-1' }
    });
    assert.strictEqual(cleanRes.status, 'RECONCILED_CLEAN');
    console.log("  [PASS] Clean matching transaction returns RECONCILED_CLEAN");

    // Amount mismatch detection
    const amountMismatch = rec.reconcileTransaction({
        providerTx: { tran_id: 'ORD-2', status: 'PAID', amount: 10, currency: 'USD', provider: 'stripe' },
        localOrder: { order_code: 'ORD-2', payment_status: 'paid', amount: 850, currency: 'USD' },
        webhookEvent: { order_code: 'ORD-2' }
    });
    assert.strictEqual(amountMismatch.status, 'OPEN');
    assert(amountMismatch.issues.some(i => i.mismatch_type === 'AMOUNT_MISMATCH'));
    console.log("  [PASS] Flags AMOUNT_MISMATCH when gateway amount deviates from DB order");

    // 2. Kill Switch Tests
    const ks = new KillSwitchRegistry();
    assert.strictEqual(ks.isBlocked('PAYMENT_KILL'), false);

    ks.activate('PAYMENT_KILL', 'SECURITY_OFFICER', 'Detected gateway anomaly');
    assert.strictEqual(ks.isBlocked('PAYMENT_KILL'), true);
    assert.strictEqual(ks.isBlocked('DEPLOYMENT_KILL'), false);

    // Test assertNotBlocked throws
    assert.throws(() => {
        ks.assertNotBlocked('PAYMENT_KILL', 'Process Checkout');
    }, /kill switch is active/);
    console.log("  [PASS] Granular PAYMENT_KILL blocks payment processing with fail-closed error");

    // Test SYSTEM_KILL overrides all
    ks.deactivate('PAYMENT_KILL');
    ks.activate('SYSTEM_KILL', 'OWNER', 'Global circuit breaker test');
    assert.strictEqual(ks.isBlocked('PAYMENT_KILL'), true);
    assert.strictEqual(ks.isBlocked('DEPLOYMENT_KILL'), true);
    console.log("  [PASS] Global SYSTEM_KILL immediately blocks all subsystems");

    console.log("\n================================================================================");
    console.log("RECONCILIATION & KILL SWITCH SUITE: 100% PASS!");
    console.log("================================================================================\n");
}

runTests();
