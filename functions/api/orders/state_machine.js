/**
 * Cloudflare Pages Function: /api/orders/state_machine
 * Sovereign Order State Machine: Rejects Arbitrary or Invalid Status Mutations
 * Protected by server session authorization and enforces idempotency.
 */

import { getCorsHeaders, verifyServerSession } from '../../_shared/auth_gate.js';

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

const PROCESSED_IDEMPOTENCY_KEYS = new Map();

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    // Verify session authorization if JWT_SECRET is configured
    if (env.JWT_SECRET) {
        const auth = await verifyServerSession(request, env, {
            requiredRole: null, // Allow any valid authorized role (owner, manager, agent, system)
            minHierarchyLevel: 3,
            requireMfa: false
        });

        if (!auth.authorized) {
            const httpStatus = auth.status === 'CONFIGURATION_ERROR' ? 503 : 401;
            return new Response(JSON.stringify({
                status: auth.status,
                error: auth.error || 'Authorization required for order state mutation'
            }), { status: httpStatus, headers });
        }
    }

    try {
        const body = await request.json().catch(() => ({}));
        const { order_id, current_state, target_state, actor = 'SYSTEM' } = body;
        const idempotencyKey = request.headers.get('Idempotency-Key') || body.idempotency_key || null;

        if (!order_id || !current_state || !target_state) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing order_id, current_state, or target_state'
            }), { status: 400, headers });
        }

        // Idempotency check
        if (idempotencyKey && PROCESSED_IDEMPOTENCY_KEYS.has(idempotencyKey)) {
            const cached = PROCESSED_IDEMPOTENCY_KEYS.get(idempotencyKey);
            return new Response(JSON.stringify({
                ...cached,
                replayed: true,
                idempotency_key: idempotencyKey
            }), { status: 200, headers });
        }

        const isValid = canTransitionOrder(current_state, target_state);

        if (!isValid) {
            return new Response(JSON.stringify({
                status: 'ILLEGAL_TRANSITION_REJECTED',
                error: `Cannot mutate order from '${current_state}' directly to '${target_state}'. Allowed: ${(VALID_ORDER_TRANSITIONS[current_state] || []).join(', ')}`,
                current_state,
                target_state
            }), { status: 422, headers });
        }

        const eventRecord = {
            status: 'TRANSITION_ACCEPTED',
            event_id: 'evt_' + crypto.randomUUID(),
            order_id,
            previous_state: current_state,
            current_state: target_state,
            transitioned_by: actor,
            idempotency_key: idempotencyKey,
            timestamp: new Date().toISOString()
        };

        if (idempotencyKey) {
            PROCESSED_IDEMPOTENCY_KEYS.set(idempotencyKey, eventRecord);
        }

        return new Response(JSON.stringify(eventRecord), { status: 200, headers });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { status: 500, headers });
    }
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
