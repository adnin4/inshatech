import {
    PAYMENT_STATES,
    canTransition,
    assertTransition,
    allowedTransitions,
    isTerminalState
} from '../functions/_shared/payments/payment_state_machine.js';

const checks = [];
function assert(condition, message) {
    checks.push([condition, message]);
    if (condition) console.log(`[PASS] ${message}`);
    else {
        console.error(`[FAIL] ${message}`);
        process.exitCode = 1;
    }
}

assert(canTransition(PAYMENT_STATES.CREATED, PAYMENT_STATES.AWAITING_PAYMENT), 'CREATED -> AWAITING_PAYMENT allowed');
assert(canTransition(PAYMENT_STATES.AWAITING_PAYMENT, PAYMENT_STATES.PROCESSING), 'AWAITING_PAYMENT -> PROCESSING allowed');
assert(canTransition(PAYMENT_STATES.PROCESSING, PAYMENT_STATES.PAID), 'PROCESSING -> PAID allowed');
assert(canTransition(PAYMENT_STATES.PAID, PAYMENT_STATES.REFUND_REQUESTED), 'PAID -> REFUND_REQUESTED allowed');
assert(canTransition(PAYMENT_STATES.REFUND_REQUESTED, PAYMENT_STATES.REFUND_PROCESSING), 'REFUND_REQUESTED -> REFUND_PROCESSING allowed');
assert(canTransition(PAYMENT_STATES.REFUND_PROCESSING, PAYMENT_STATES.REFUNDED), 'REFUND_PROCESSING -> REFUNDED allowed');

assert(!canTransition(PAYMENT_STATES.PAID, PAYMENT_STATES.AWAITING_PAYMENT), 'PAID -> AWAITING_PAYMENT blocked');
assert(!canTransition(PAYMENT_STATES.REFUNDED, PAYMENT_STATES.PAID), 'REFUNDED -> PAID blocked');
assert(!canTransition(PAYMENT_STATES.FAILED, PAYMENT_STATES.PAID), 'FAILED -> PAID blocked');
assert(!canTransition(PAYMENT_STATES.CANCELLED, PAYMENT_STATES.PROCESSING), 'CANCELLED -> PROCESSING blocked');

try {
    assertTransition(PAYMENT_STATES.PAID, PAYMENT_STATES.AWAITING_PAYMENT);
    assert(false, 'Illegal transition throws');
} catch (error) {
    assert(error.code === 'INVALID_PAYMENT_STATE_TRANSITION', 'Illegal transition returns canonical error code');
}

assert(allowedTransitions(PAYMENT_STATES.PAID).length === 1, 'PAID exposes only refund request as next transition');
assert(isTerminalState(PAYMENT_STATES.REFUNDED), 'REFUNDED is terminal');
assert(isTerminalState(PAYMENT_STATES.FAILED), 'FAILED is terminal');

const passed = checks.filter(([ok]) => ok).length;
console.log(`PAYMENT_STATE_MACHINE=${passed}/${checks.length} PASS`);
if (passed !== checks.length) process.exit(1);
