/**
 * IINSHA AI-BOS: Autonomous Payment Reconciliation Engine
 *
 * Reconciles 3 data sources:
 * 1. Gateway Provider Records (SSLCommerz, Stripe, Lemon Squeezy)
 * 2. Database Orders (ibos_orders)
 * 3. Durable Ingested Webhooks (ibos_webhook_events)
 */

export class PaymentReconciliationEngine {
    constructor() {
        this.reconciliationCases = [];
    }

    /**
     * Audit single transaction triple
     */
    reconcileTransaction({ providerTx, localOrder, webhookEvent }) {
        const issues = [];
        const orderId = localOrder?.order_code || providerTx?.tran_id || webhookEvent?.order_code || 'UNKNOWN';

        // 1. Paid at Gateway but Local Order is Pending
        if (providerTx?.status === 'PAID' && localOrder?.payment_status !== 'paid') {
            issues.push({
                mismatch_type: 'PAID_BUT_LOCAL_PENDING',
                severity: 'CRITICAL',
                expected: 'paid',
                actual: localOrder?.payment_status || 'missing_order',
                action: 'SCHEDULE_STATUS_SYNC'
            });
        }

        // 2. Local Order marked Paid but Provider has no matching record
        if (localOrder?.payment_status === 'paid' && (!providerTx || providerTx.status !== 'PAID')) {
            issues.push({
                mismatch_type: 'LOCAL_PAID_BUT_PROVIDER_UNKNOWN',
                severity: 'CRITICAL',
                expected: 'PAID',
                actual: providerTx?.status || 'NO_GATEWAY_RECORD',
                action: 'FREEZE_ORDER_AND_ALERT_OWNER'
            });
        }

        // 3. Amount Mismatch
        if (providerTx && localOrder && parseFloat(providerTx.amount) !== parseFloat(localOrder.amount)) {
            issues.push({
                mismatch_type: 'AMOUNT_MISMATCH',
                severity: 'HIGH',
                expected: localOrder.amount,
                actual: providerTx.amount,
                action: 'FLAG_FOR_MANUAL_REVIEW'
            });
        }

        // 4. Currency Mismatch
        if (providerTx && localOrder && String(providerTx.currency).toUpperCase() !== String(localOrder.currency).toUpperCase()) {
            issues.push({
                mismatch_type: 'CURRENCY_MISMATCH',
                severity: 'HIGH',
                expected: localOrder.currency,
                actual: providerTx.currency,
                action: 'FLAG_FOR_MANUAL_REVIEW'
            });
        }

        // 5. Missing durable webhook event for a paid order
        if (localOrder?.payment_status === 'paid' && !webhookEvent) {
            issues.push({
                mismatch_type: 'MISSING_DURABLE_AUDIT_LOG',
                severity: 'MEDIUM',
                expected: 'DURABLE_EVENT_ROW',
                actual: 'NULL',
                action: 'BACKFILL_AUDIT_FROM_PROVIDER'
            });
        }

        if (issues.length > 0) {
            const caseItem = {
                case_id: `REC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                order_id: orderId,
                provider: providerTx?.provider || localOrder?.payment_provider || 'unknown',
                issues,
                status: 'OPEN',
                created_at: new Date().toISOString()
            };
            this.reconciliationCases.push(caseItem);
            return caseItem;
        }

        return { order_id: orderId, status: 'RECONCILED_CLEAN' };
    }

    getCases() {
        return this.reconciliationCases;
    }
}
