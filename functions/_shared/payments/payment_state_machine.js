/**
 * IINSHA AI-BOS — Canonical Payment State Machine
 *
 * One transition policy is shared by checkout, webhooks, reconciliation and
 * refund flows. Unknown or illegal transitions fail closed.
 */

export const PAYMENT_STATES = Object.freeze({
    CREATED: 'created',
    AWAITING_PAYMENT: 'awaiting_payment',
    PROCESSING: 'processing',
    PAID: 'paid',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    REFUND_REQUESTED: 'refund_requested',
    REFUND_PROCESSING: 'refund_processing',
    REFUNDED: 'refunded'
});

const ALLOWED = Object.freeze({
    [PAYMENT_STATES.CREATED]: new Set([
        PAYMENT_STATES.AWAITING_PAYMENT,
        PAYMENT_STATES.CANCELLED,
        PAYMENT_STATES.EXPIRED
    ]),
    [PAYMENT_STATES.AWAITING_PAYMENT]: new Set([
        PAYMENT_STATES.PROCESSING,
        PAYMENT_STATES.PAID,
        PAYMENT_STATES.FAILED,
        PAYMENT_STATES.CANCELLED,
        PAYMENT_STATES.EXPIRED
    ]),
    [PAYMENT_STATES.PROCESSING]: new Set([
        PAYMENT_STATES.PAID,
        PAYMENT_STATES.FAILED,
        PAYMENT_STATES.CANCELLED
    ]),
    [PAYMENT_STATES.PAID]: new Set([
        PAYMENT_STATES.REFUND_REQUESTED
    ]),
    [PAYMENT_STATES.FAILED]: new Set([]),
    [PAYMENT_STATES.CANCELLED]: new Set([]),
    [PAYMENT_STATES.EXPIRED]: new Set([]),
    [PAYMENT_STATES.REFUND_REQUESTED]: new Set([
        PAYMENT_STATES.REFUND_PROCESSING,
        PAYMENT_STATES.CANCELLED
    ]),
    [PAYMENT_STATES.REFUND_PROCESSING]: new Set([
        PAYMENT_STATES.REFUNDED,
        PAYMENT_STATES.FAILED
    ]),
    [PAYMENT_STATES.REFUNDED]: new Set([])
});

export function canTransition(from, to) {
    const source = String(from || '').toLowerCase();
    const target = String(to || '').toLowerCase();
    return Boolean(ALLOWED[source]?.has(target));
}

export function assertTransition(from, to) {
    if (!canTransition(from, to)) {
        const error = new Error(`Illegal payment transition: ${from} -> ${to}`);
        error.code = 'INVALID_PAYMENT_STATE_TRANSITION';
        throw error;
    }
    return { from, to, allowed: true };
}

export function allowedTransitions(from) {
    return [...(ALLOWED[String(from || '').toLowerCase()] || new Set())];
}

export function isTerminalState(state) {
    return allowedTransitions(state).length === 0;
}
