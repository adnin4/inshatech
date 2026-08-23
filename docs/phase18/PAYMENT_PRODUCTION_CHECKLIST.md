# 💳 PAYMENT_PRODUCTION_CHECKLIST.md — Payment Rails Production Readiness

## 1. Payment Rail Status Summary
- **Stripe:** **SANDBOX_READY** (Test publishable & secret keys verified; Live production key required for public launch).
- **bKash:** **SANDBOX_READY** (Sandbox OAuth grant & `mode: "0011"` tokenized checkout tested; Live merchant credentials required).

## 2. Hardened Security Guards
- [x] **Zero Environment Mixing:** Sandbox mode cannot accidentally mix with Live mode.
- [x] **Server-Authoritative Pricing:** Client-tampered amounts are strictly overwritten by server catalog.
- [x] **Webhook HMAC & Idempotency:** Duplicate delivery replay returns `200 DUPLICATE_IGNORED`.
- [x] **Double-Entry Invariant:** Settlement stored procedure validates $$850.00 = $24.65 + $170.00 + $655.35$ with $$0.00$ drift.
