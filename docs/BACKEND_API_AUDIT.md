# ⚙️ IINSHA AI-BOS: BACKEND_API_AUDIT.md (Phase 4 - Backend & API Audit)

## 1. Endpoint Classification & Audit Matrix
| Endpoint Path | HTTP Method | Auth Required | Classification | Verification Detail |
| :--- | :---: | :---: | :---: | :--- |
| `/api/solution-finder` | POST | No | **VERIFIED** | Gemini Edge API proposal generator. |
| `/api/create-checkout` | POST | No | **VERIFIED** | Server-authoritative catalog price enforcement. |
| `/api/stripe-webhook` | POST | HMAC | **VERIFIED** | Timing-safe signature check & deduplication journal. |
| `/api/payments/bkash-tokenized` | POST | No | **VERIFIED** | Token grant, create `mode: "0011"`, and execute. |
| `/api/webhook/bkash-sns-ipn` | POST | x509 / HMAC | **VERIFIED** | AWS SNS handshake & atomic settlement caller. |
| `/api/auth/session` | POST | No | **VERIFIED** | Rate-limited HMAC admin session token issuer. |
| `/api/admin/gate` | GET | Session Token | **VERIFIED** | Zero-bypass admin verification middleware. |
| `/api/ai/tool-broker` | POST | Capability Token| **VERIFIED** | 5-tier PDP tool gateway & emergency kill-switch. |
| `/api/sre/health` | GET | No | **VERIFIED** | Live SLO 99.95% and latency telemetry stream. |
| `/api/knowledge/search` | GET | No | **VERIFIED** | Keyword & semantic chunk retrieval engine. |
