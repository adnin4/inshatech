# IINSHA AI-BOS — PROVIDER CAPABILITY & REAL-WORLD EVIDENCE MATRIX

**Audit date:** 2026-09-07
**Standard:** Real execution proof only | fail-closed by default

| Provider | Capability | Evidence available now | Production status |
| :--- | :--- | :--- | :---: |
| **Gemini AI** | Model inference | Configurable `GEMINI_MODEL`; hardening default `gemini-3.8-flash`. No independent production receipt captured in this audit. | 🟡 SOURCE_READY |
| **Supabase** | CRM / mission persistence | `ACTIVE_HEALTHY` control-plane status; security advisor zero lints; 110/110 public tables RLS-enabled. Cloudflare runtime connectivity remains unverified. | 🟡 CONTROL_PLANE_VERIFIED |
| **Lemon Squeezy** | Hosted checkout | Adapter exists; no independently reconciled checkout/transaction receipt captured. | 🟡 ADAPTER_PRESENT |
| **Stripe** | Card payments | Configuration-dependent adapter; no signed webhook/reconciliation receipt captured. | 🟡 FAIL_CLOSED_READY |
| **bKash / Nagad** | Bangladesh mobile payment | Repository routing references exist; no independently verified merchant settlement receipt captured. | 🟡 ADAPTER_PRESENT |
| **Telegram Bot** | Lead alerts | Configuration-dependent adapter; no live provider receipt captured. | 🟡 FAIL_CLOSED_READY |
| **Resend** | Transactional email | Configuration-dependent adapter; no live provider receipt captured. | 🟡 FAIL_CLOSED_READY |
| **Cloudflare Pages** | Edge static + Functions | Git integration supports branch-driven builds; current live deployment SHA/build state is not independently verified. Earlier hardening preview reported `Build failed`. | 🔴 LIVE_UNVERIFIED |

## Evidence rule

A source-level adapter, generated identifier, mocked response, or successful static test is not sufficient to label an external provider `LIVE_VERIFIED`. Production certification requires an independently verifiable provider/runtime receipt and durable reconciliation where applicable.