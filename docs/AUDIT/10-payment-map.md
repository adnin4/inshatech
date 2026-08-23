# 10-payment-map.md — Payment & Financial Ledger Map

- **Server-Authoritative Pricing:** Client price overrides rejected in favor of server catalog.
- **Signed Webhooks:** HMAC signature validation before payment state transition.
- **Idempotency Journal:** Prevents duplicate transaction replay.
- **Double-Entry Balance Invariant:** $\sum \text{Gross} = \text{Fee} + \text{Affiliate} + \text{Margin}$ ($$0.00$ drift).
