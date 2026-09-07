# Production Payment Runbook

## Gate 0 — Disabled by default

Keep production payment activation blocked while provider selection, credentials, native callback verification, sandbox evidence, reconciliation, and refund evidence are incomplete.

## Gate 1 — Select one provider

Record the selected provider and exact production credential set in the release evidence ledger. Never expose secret material in code, browser responses, logs, or Git history.

## Gate 2 — Configure

Configure the provider-specific server secrets and callback URL. Confirm the webhook endpoint is HTTPS and the browser return URL is separate and read-only.

## Gate 3 — Connection test

Create a non-financial connection test where supported. Confirm credentials are accepted and the application can reach the provider without marking any order paid.

## Gate 4 — Sandbox

Run a complete sandbox transaction using a dedicated test order. Verify:

- server-side catalog amount;
- durable order before gateway call;
- idempotency replay returns the same order;
- browser success/fail/cancel remains read-only;
- native provider verification rejects forged callbacks;
- successful provider event confirms exactly one order;
- duplicate event does not duplicate state changes;
- amount/currency/order identity mismatch is rejected;
- failed/cancelled transaction does not become paid;
- reconciliation agrees with provider state.

## Gate 5 — Refund / reversal

Exercise the provider's refund/void path where supported and verify the application's financial state remains consistent with the provider record.

## Gate 6 — Live

Only after all prior evidence is attached to the release evidence ledger may live credentials be enabled. First live transaction should be a controlled, traceable order with post-transaction reconciliation.

## Rollback

On any unexplained payment-state divergence, disable provider checkout at the configuration boundary, preserve webhook evidence, stop new financial side effects, reconcile existing orders, and roll back to the last known-good release if the defect is code-related.
