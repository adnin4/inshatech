# 👑 InshaTech Platform Roadmap Guide: Enterprise Production Readiness

## Architectural Execution Blueprint & Release Governance

### 1. Cryptographic Release Provenance
- **Trunk-Based Promotion:** `feature/*` $\rightarrow$ `develop` $\rightarrow$ `main` (Git tag `v*.*.*`).
- **Immutable Build Manifest:** `build-info.json` emitted on every CI run containing commit SHA, timestamp, and environment hashes.

### 2. Deterministic Database Engine Security
- **DDL Event Trigger (`ensure_rls`):** Automatically runs `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on every newly created table.
- **Subquery Auth Caching:** `(SELECT auth.uid()) = id` reduces row evaluation overhead from $O(N)$ to cached execution.
- **Invoker Views:** All analytical summaries use `WITH (security_invoker = true)` under PostgreSQL 15+.

### 3. Edge Perimeter & Content Security Policy
- **Strict Headers:** HSTS (31536000; includeSubDomains; preload), X-Frame-Options (DENY), X-Content-Type-Options (nosniff).
- **CSP Directives:** Whitelists `*.supabase.co`, `api.stripe.com`, `tokenized.sandbox.bka.sh`, `tokenized.pay.bka.sh`, and Cloudflare Turnstile.

### 4. Dual-Rail Payment Architecture
- **Global Rail:** Stripe Checkout + HMAC signature verification (`stripe-signature`).
- **Domestic MFS Rail:** bKash Tokenized Checkout (`mode: "0011"`) + AWS SNS IPN Webhook Listener.

### 5. Domain Authentication & DNS Standard
- **SPF:** `v=spf1 include:amazonses.com include:_spf.resend.com ~all`
- **DKIM:** 2048-bit RSA key CNAME records.
- **DMARC:** `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-reports@inshatech.com`
