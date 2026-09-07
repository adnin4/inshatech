# Payment Security Gate

This document is the release contract for payment activation.

## Required before any live payment

1. Provider is explicitly selected and configured in Cloudflare secrets.
2. The checkout amount is derived from the server-side catalog, not a client-supplied price.
3. A durable order exists before redirecting to the payment provider.
4. Every checkout request has an idempotency key and duplicate requests resolve to the same pending order.
5. Provider callback/webhook verification is fail-closed.
6. Webhook event IDs are checked before any order mutation.
7. Durable webhook evidence includes provider, event ID, event type, order code, signature verification state, payload, and processing timestamps.
8. A payment-success event resolves exactly one known order.
9. Payment state changes are server-side only.
10. Duplicate, replay, malformed, invalid-signature, delayed, and out-of-order webhook cases are tested.
11. Reconciliation and refund paths are verified.
12. Only after sandbox verification may live credentials be activated.

## Current status

- Payment provider: NOT_SELECTED_FOR_PRODUCTION
- Credentials: NOT_VERIFIED
- Sandbox transaction: NOT_VERIFIED
- Live transaction: NOT_VERIFIED
- Production payment activation: BLOCKED

CI green does not satisfy this gate. Real provider, runtime, and transaction evidence is required.
