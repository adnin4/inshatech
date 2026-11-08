# 🔌 IINSHA AI-BOS: API CONTRACT MATRIX

| Endpoint | Method | Auth / Policy | Validation Schema | Fail-Closed Fallback | Status |
| :--- | :---: | :---: | :--- | :--- | :---: |
| `/api/ai/chat` | POST | Level 0 Read | String <= 2000 chars, XSS Sanitized | Gemini API ➔ Local RAG Fallback | 🟢 `PASS` |
| `/api/tools/execute` | POST | Level 0–4 Gateway | Agent Scope & Token Verification | `status: NOT_CONFIGURED` | 🟢 `PASS` |
| `/api/payments/checkout` | POST | Level 2 Execute | Price, Currency, Service ID | Multi-Rail Routing | 🟢 `PASS` |
| `/api/payments/webhook` | POST | HMAC-SHA256 | Lemon / Stripe Signed Webhook | Timing-Safe Cryptographic Reject | 🟢 `PASS` |
| `/api/version` | GET | Public Read | Exact Git SHA parity | Returns `git_commit_sha` | 🟢 `PASS` |
