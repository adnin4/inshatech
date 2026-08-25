# 🪝 IINSHA AI-BOS: WEBHOOK_VERIFICATION_REPORT.md (Phase 20)

## Webhook Architecture & Defense Report
- **Stripe Webhook (`/api/stripe-webhook`):** Signed HMAC-SHA256 signature verification with event deduplication in `ibos_webhook_events`.
- **bKash AWS SNS IPN Webhook (`/api/webhook/bkash-sns-ipn`):** x509 public key URL whitelisting, signature verification, and atomic settlement caller.
- **Idempotency Protection:** Duplicate delivery attempts return `200 { status: "DUPLICATE_IGNORED" }` without mutating balances.
