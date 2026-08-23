/**
 * Cloudflare Pages Function: /api/orders/state_machine
 * Sovereign Order State Machine: Rejects Arbitrary or Invalid Status Mutations
 */

export const VALID_ORDER_TRANSITIONS = {
    'DRAFT': ['PENDING_PAYMENT', 'CANCELLED'],
    'PENDING_PAYMENT': ['PAID', 'FAILED', 'CANCELLED'],
    'PAID': ['PROCESSING', 'REFUNDED'],
    'PROCESSING': ['FULFILLING', 'FAILED', 'REFUNDED'],
    'FULFILLING': ['DELIVERED', 'FAILED'],
    'DELIVERED': ['COMPLETED', 'DISPUTED'],
    'COMPLETED': ['REFUNDED', 'DISPUTED'],
    'FAILED': ['PENDING_PAYMENT', 'CANCELLED'],
    'CANCELLED': [],
    'REFUNDED': [],
    'DISPUTED': ['REFUNDED', 'COMPLETED']
};

export function canTransitionOrder(currentState, nextState) {
    if (!currentState || !nextState) return false;
    if (currentState === nextState) return true;
    const allowedNext = VALID_ORDER_TRANSITIONS[currentState] || [];
    return allowedNext.includes(nextState);
}

export async function onRequestPost(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await context.request.json().catch(() => ({}));
        const { order_id, current_state, target_state, actor = 'SYSTEM' } = body;

        if (!order_id || !current_state || !target_state) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing order_id, current_state, or target_state'
            }), { headers, status: 400 });
        }

        const isValid = canTransitionOrder(current_state, target_state);

        if (!isValid) {
            return new Response(JSON.stringify({
                status: 'ILLEGAL_TRANSITION_REJECTED',
                error: `Cannot mutate order from '${current_state}' directly to '${target_state}'. Allowed: ${(VALID_ORDER_TRANSITIONS[current_state] || []).join(', ')}`,
                current_state,
                target_state
            }), { headers, status: 422 });
        }

        return new Response(JSON.stringify({
            status: 'TRANSITION_ACCEPTED',
            order_id,
            previous_state: current_state,
            current_state: target_state,
            transitioned_by: actor,
            timestamp: new Date().toISOString()
        }), { headers, status: 200 });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { headers, status: 500 });
    }
}

