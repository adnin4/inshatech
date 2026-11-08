/**
 * Order transition policy only. No persistent order repository is configured.
 * This endpoint deliberately does not claim that a state transition was saved.
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
  return (VALID_ORDER_TRANSITIONS[currentState] || []).includes(nextState);
}

export async function onRequestPost({ request }) {
  const body = await request.json().catch(() => ({}));
  if (!body.order_id || !body.current_state || !body.target_state) {
    return new Response(JSON.stringify({ status: 'ERROR', error: 'Missing order_id, current_state, or target_state' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  }
  if (!canTransitionOrder(body.current_state, body.target_state)) {
    return new Response(JSON.stringify({
      status: 'ILLEGAL_TRANSITION_REJECTED',
      current_state: body.current_state,
      target_state: body.target_state
    }), { status: 422, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
  return new Response(JSON.stringify({
    status: 'NOT_CONFIGURED',
    code: 'PERSISTENT_ORDER_STORE_NOT_CONFIGURED',
    order_id: body.order_id,
    message: 'The transition is allowed by policy, but no durable order repository is connected. No order state was changed.'
  }), { status: 503, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
