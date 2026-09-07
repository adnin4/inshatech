# Payment Authority Contract

Production payment activation remains blocked until checkout satisfies this contract.

## Server authority
- `service_id` must resolve to a known server-side catalog entry.
- Client-supplied `amount` is never authoritative.
- The server derives USD and BDT amounts from the catalog and approved coupon rules.
- Unknown services/providers are rejected.
- A durable `ibos_orders` row is created before an upstream gateway call.
- `idempotency_key` is required for a checkout attempt and is unique in `ibos_orders`.

## State integrity
- Checkout creation must not mark an order paid.
- Only verified provider events may transition payment state.
- Gateway/API failure must not return payment success.
- Duplicate checkout requests with the same idempotency key must not create another order.
- Provider, payment reference, and timestamps are retained for reconciliation.

## Production gate
This contract does not mean a provider is configured or live. Real provider credentials, provider-native signature verification, sandbox testing, reconciliation, refund testing, and live verification remain mandatory before `PRODUCTION_VERIFIED`.
