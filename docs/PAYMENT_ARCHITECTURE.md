# Payment Architecture

## Providers
- Stripe (Global Cards)
- bKash (Bangladesh MFS)
- Nagad (Bangladesh MFS)
- Manual Bank Transfer

## Flow
1. Client requests checkout (`/api/payments/checkout`).
2. Server generates intent and idempotency key.
3. Provider handles payment.
4. Webhook (`/api/payments/webhook`) validates and records state.
5. Affiliate logic triggered post-success.

## Integrity
- All requests use an `idempotency_key` to avoid double billing.
- Webhooks verify cryptographic signatures.
