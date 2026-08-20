# 💳 Payment Reconciliation & Financial Invariant Report

```text
INVARIANT FORMULA:
Gross Revenue ($850.00) = Gateway Fee ($24.65) + Affiliate ($170.00) + Net Margin ($655.35)
```

- **Server-Authoritative Pricing**: Client-side amount manipulation is 100% ignored.
- **Durable Webhook Deduplication**: `ibos_webhook_events` ensures each transaction is booked exactly once.
