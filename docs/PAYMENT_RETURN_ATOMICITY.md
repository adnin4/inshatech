# Payment Return & Webhook Atomicity Contract

## Browser return boundary

A browser redirect is untrusted input. The browser-return route:

- accepts GET only;
- validates a bounded order-code format;
- optionally carries provider/status as display context;
- redirects to the customer portal;
- never writes payment state;
- never marks an order paid;
- never treats a redirect as proof of settlement.

Canonical route:

`GET /api/payments/return`

Legacy gateway GET compatibility on `/api/payments/webhook` is redirect-only and must never execute webhook mutation logic.

## Server webhook boundary

Authoritative payment mutation is reserved for verified provider events. The current generic contract is fail-closed on missing/invalid configured signatures and stores a durable event before payment mutation.

Before live provider activation, provider-native signature/verification semantics must be implemented and tested for the selected provider. A generic shared HMAC secret is not sufficient evidence of native provider certification.

## Event ordering

```text
authenticate
  -> resolve event/order
  -> durable event registration (unique event_id gate)
  -> validate payment facts
  -> mutate order state
  -> finalize event
```

The event row is created before the payment mutation so a crash cannot create a paid order whose authenticated event was never durably recorded.

## Required adversarial tests

1. missing signature
2. invalid signature
3. malformed payload
4. missing event ID
5. duplicate event ID
6. concurrent duplicate event ID
7. unknown order
8. non-unique order resolution
9. wrong provider
10. wrong amount
11. wrong currency
12. replayed event
13. delayed event
14. out-of-order event
15. payment mutation failure
16. event-finalization failure

## Production gate

Payment is not `LIVE_VERIFIED` until all of the following have evidence:

- selected provider credentials configured server-side;
- provider-native signature validation verified;
- sandbox checkout completed;
- successful sandbox payment observed;
- duplicate/replay behavior verified;
- amount/provider/currency checks verified;
- reconciliation verified;
- refund verified;
- production browser return remains read-only;
- production webhook evidence is durable and auditable.
