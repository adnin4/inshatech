# 📋 IINSHA_PRODUCTION_CAPABILITY_REGISTRY.md — Canonical Capability Registry

## 📌 1. Scope & Objective
This registry maintains the machine-verifiable capability truth table for IINSHA AI-BOS. Frontend components and dashboards strictly read statuses from this registry to prevent ungrounded or simulated `LIVE` claims.

---

## 🏷️ 2. Capability Status Taxonomy Definitions
- **`NOT_IMPLEMENTED`**: Feature specified but no code written.
- **`CODE_READY`**: Code written and passes syntax/static checks.
- **`UNIT_VERIFIED`**: Unit tests pass with 100% assertion coverage.
- **`INTEGRATION_VERIFIED`**: Cross-module contracts pass with verified interfaces.
- **`SANDBOX_VERIFIED`**: Executed successfully in a controlled local/test sandbox.
- **`LIVE_VERIFIED`**: Executed on live edge infrastructure with real credentials & telemetry.
- **`DEGRADED`**: Operational with high latency or minor error budget breach.
- **`BLOCKED`**: Safety gate tripped or approval withheld.
- **`FAILED`**: Test failure or unhandled exception.

---

## 📊 3. Canonical Capability Truth Matrix

| Capability ID | Domain | Provider | Current Status | Risk Tier |
| :--- | :---: | :--- | :---: | :---: |
| `payment.stripe` | FINANCE | Stripe Elements & Checkout | `SANDBOX_VERIFIED` | HIGH_IMPACT |
| `payment.bkash` | FINANCE | bKash Merchant API | `SANDBOX_VERIFIED` | HIGH_IMPACT |
| `affiliate.attribution` | GROWTH | S2S Click & Double-Entry Ledger | `INTEGRATION_VERIFIED` | MEDIUM |
| `crm.lead_hunter` | GROWTH | LeadSourceAdapter (Inbound/Directory) | `UNIT_VERIFIED` | LOW |
| `outreach.whatsapp` | GROWTH | Meta WhatsApp Cloud API | `NOT_CONFIGURED` | HIGH_IMPACT |
| `outreach.email` | GROWTH | Resend / SMTP API | `NOT_CONFIGURED` | HIGH_IMPACT |
| `project.execution_worker` | DELIVERY | Isolated Workspace DAG Executor | `SANDBOX_VERIFIED` | HIGH_IMPACT |
| `qa.independent_verifier` | CONTROL | IndependentQaVerifier (0.95+ Gate) | `UNIT_VERIFIED` | CRITICAL |
| `delivery.owner_release` | CONTROL | Owner L3 Sign-Off Gateway | `UNIT_VERIFIED` | CRITICAL |
| `learning.skill_registry` | LEARNING | SkillRegistryEngine (Benchmark >= 0.90) | `SANDBOX_VERIFIED` | CRITICAL |

---

## 🏆 4. Final 10/10 Scoring Rubric
- **Implementation:** 25%
- **Real Provider Activation:** 15%
- **Automated Tests:** 15%
- **Browser E2E:** 15%
- **Security & RLS:** 10%
- **Observability:** 5%
- **Failure Recovery & DR:** 5%
- **Production Evidence (Real Pilot Customer):** 10%
- **Total:** **100% (10/10 Authority)**
