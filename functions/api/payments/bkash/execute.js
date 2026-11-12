import { createDirectBypassDisabledHandlers } from '../../../_shared/payments/legacy_route_guard.js';

const handlers = createDirectBypassDisabledHandlers('bKash Execute');

export async function onRequestPost(context) {
    return handlers.onRequestPost(context);
}

export async function onRequestOptions(context) {
    return handlers.onRequestOptions(context);
}
