# 08_WEBHOOK_VERIFICATION.md — Webhook Replay & Idempotency

- **Stripe Webhook (`/api/stripe-webhook`):** Signed HMAC-SHA256 timestamped signature verification.
- **bKash AWS SNS IPN (`/api/webhook/bkash-sns-ipn`):** x509 public cert validation & subscription handshake.
- **Duplicate Delivery Test:** Repeated payloads return `200 DUPLICATE_IGNORED` without double-posting revenue.
- **Status:** **LIVE_VERIFIED**
