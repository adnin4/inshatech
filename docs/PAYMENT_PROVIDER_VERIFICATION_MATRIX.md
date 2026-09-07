# Payment Provider Verification Matrix

This matrix is the authority boundary for payment-provider integration. Code may support a provider, but production activation remains blocked until that provider's native verification and a real test transaction are evidenced.

| Provider | Browser return | Server confirmation | Native verification boundary | Production status |
|---|---|---|---|---|
| Stripe | Read-only return/portal | `POST /api/payments/webhook` | `Stripe-Signature` + endpoint signing secret; raw request body verification | NOT_VERIFIED |
| Lemon Squeezy | Read-only checkout redirect | `POST /api/payments/webhook` | `X-Signature` HMAC-SHA256 over raw body using Lemon Squeezy signing secret | NOT_VERIFIED |
| SSLCommerz | Read-only success/fail/cancel return | IPN/validation flow | Provider-side transaction validation; do not treat a browser redirect as proof of payment | NOT_VERIFIED |
| bKash | Checkout callback/return as documented by merchant integration | Server-side payment verification | Authenticated merchant API flow and provider payment verification; do not trust callback status alone | NOT_VERIFIED |

## Activation ladder

1. `NOT_SELECTED`
2. `CONFIGURED`
3. `CONNECTION_TESTED`
4. `SANDBOX_VERIFIED`
5. `LIVE_VERIFIED`

Only one provider may be production-enabled at a time unless an explicit multi-provider authority review exists. Provider enablement must be controlled by server-side configuration, never by an arbitrary browser parameter.

## Evidence required

For the selected provider, retain evidence for:

- credentials/configuration check without exposing secrets;
- provider-side endpoint configuration;
- signed verification test;
- wrong-signature rejection;
- duplicate event behavior;
- replay behavior;
- malformed payload behavior;
- order identity match;
- amount and currency match;
- successful sandbox transaction;
- failed/cancelled transaction;
- delayed/out-of-order event behavior;
- reconciliation;
- refund/void behavior where supported;
- live transaction only after all sandbox gates pass.

The application may report `PRODUCTION_VERIFIED` only when this evidence is attached to the release evidence ledger and independently reproducible.

## Current evidence status

- Provider selected: NO
- Provider credentials verified: NO
- Native webhook signature certified: NO
- Sandbox transaction verified: NO
- Reconciliation verified: NO
- Refund verified: NO
- Live transaction verified: NO
