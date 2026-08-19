# 📡 IINSHA AI-BOS — API Contract & Edge Function Map (Baseline v1.0)

**Record Date**: 2026-08-19  
**Runtime**: Cloudflare Pages Functions Global Edge Runtime  
**Total Endpoints**: 50+ Specialized Handlers  

---

## 🛰️ Edge API Endpoint Inventory

| Endpoint Route | Method | Target Domain | Auth / Permission | Edge Function File |
| :--- | :---: | :--- | :--- | :--- |
| `/api/auth/session` | `POST` | Identity | Public (Rate Limited) | `functions/api/auth/session.js` |
| `/api/auth/rbac` | `POST` | Identity | Session Auth | `functions/api/auth/rbac.js` |
| `/api/auth/mfa` | `POST` | Identity | Session Auth | `functions/api/auth/mfa.js` |
| `/api/admin/gate` | `GET` | Security | Admin Super_Admin | `functions/api/admin/gate.js` |
| `/api/ai/chat` | `POST` | AI Copilot | Public / Token Checked | `functions/api/ai/chat.js` |
| `/api/ai/firewall` | `POST` | AI Security | Public Sanitizer | `functions/api/ai/firewall.js` |
| `/api/tools/execute` | `POST` | Tool Gateway | Role Autonomy Level | `functions/api/tools/execute.js` |
| `/api/payments/checkout` | `POST` | Billing | Public / Idempotent | `functions/api/payments/checkout.js` |
| `/api/payments/webhook` | `POST` | Billing | Signed Webhook Auth | `functions/api/payments/webhook.js` |
| `/api/finance/ledger` | `GET/POST` | Ledger | Super_Admin / CFO | `functions/api/finance/ledger.js` |
| `/api/orders/state_machine` | `POST` | Orders | Internal Execution | `functions/api/orders/state_machine.js` |
| `/api/affiliate/portal` | `GET/POST` | Affiliate | Partner Session Auth | `functions/api/affiliate/portal.js` |
| `/api/executive/morning_brief` | `GET` | Executive | Admin Super_Admin | `functions/api/executive/morning_brief.js` |
| `/api/executive/meta_orchestrator`| `POST` | Executive | CEO Agent / Owner | `functions/api/executive/meta_orchestrator.js` |
| `/api/performance/observatory` | `GET` | Observability | Super_Admin | `functions/api/performance/observatory.js` |
| `/api/system/status_public` | `GET` | System | Public | `functions/api/system/status_public.js` |
| `/api/governance/charter` | `GET` | Governance | Public / Audited | `functions/api/governance/charter.js` |
| `/api/governance/constitution` | `GET` | Governance | Public / Audited | `functions/api/governance/constitution.js` |

---

## 🔒 API Contract Standard
1. **CORS Isolation**: Explicit allowed origins, strict headers.
2. **Idempotency Key**: Enforced on all mutating endpoints (`/payments/checkout`, `/orders/state_machine`).
3. **Input Sanitization**: Zero raw HTML or SQL injection vectors.
4. **Structured JSON Output**: `{ status: 'SUCCESS' | 'ERROR', result: { ... }, timestamp: '...' }`.
