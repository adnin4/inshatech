# IINSHA AI-BOS

## Complete Production Activation, Security, Revenue & Autonomous Operations Roadmap

**Repository:** adnin4/inshatech
**Primary branch:** master
**Canonical Supabase project:** kitwadizsvjmuxkfewxj
**Production domain:** https://inshatech.pages.dev/

---

# 0. NON-NEGOTIABLE OPERATING RULES

1. No fake customer, fake order, fake revenue, fake testimonial, fake uptime, fake transaction or fake production claim.
2. Frontend is never the authority for payment amount or payment success.
3. Payment success arrives only through verified provider-side event / server verification.
4. service_role must never be exposed browser/client-side.
5. PRODUCTION_VERIFIED=true is forbidden without external production verification evidence.
6. Agents cannot autonomously alter permissions, budgets, security boundaries or production code.
7. Existing UI/UX/page/functionality must not be needlessly rebuilt.
8. Existing database must not be destroyed or wiped.
9. Security/quality CI gates must never be bypassed.
10. External side effects require prior authorization + validation + idempotency + audit trail.
11. Payout, deployment, production mutation, customer communication, and destructive actions require explicit policy gates.
12. Demo and simulation data must always be truthfully labeled.

---

# 1. MASTER CERTIFICATION LADDER

`	ext
NOT_READY
    ↓
READY_FOR_STAGING          ✅
    ↓
STAGING_VERIFIED           ✅
    ↓
PRODUCTION_CANDIDATE       ⏳
    ↓
PRODUCTION_VERIFIED        ❌
    ↓
REVENUE_OPERATIONAL        ❌
    ↓
AUTONOMOUS_OPERATIONAL     ❌
`

---

# 2. 80-PHASE MASTER EXECUTION TRACKS

* Phase A: Release Baseline Freeze (PR #52 review, CI green, SHA lock)
* Phase B: Production Deployment Identity (Git SHA = Cloudflare SHA = /api/version SHA)
* Phase C: Cloudflare Production Evidence Package (Deployment proofs, runtime headers)
* Phase D: Browser Production E2E (12/12 public pages, responsive layouts, 0 defects)
* Phase E: Authentication & RBAC Authorization (Customer, Affiliate, Admin, Agent isolation)
* Phase F: Supabase Security Certification (kitwadizsvjmuxkfewxj, 110/110 RLS, tenant isolation)
* Phase G-H: Data Truth, Telemetry & Content Neutralization (No fake 99.99% or unverified claims)
* Phase I-P: Payment Architecture, Server Authority, Browser Return & Webhook Security:
  - Server catalog & pricing authority (client amounts rejected, unknown services rejected)
  - Read-only browser return endpoint (/api/payments/return GET-only, POST rejected with 405)
  - Scoped route-level interception middleware on /api/payments/webhook
  - Provider-native webhook signature verification (Lemon Squeezy, Stripe, SSLCommerz, bKash)
  - Webhook idempotency, replay defense, and fail-closed persistence
  - Scheduled reconciliation and refund lifecycle
* Phase Q-AF: CRM, AI Sales Assistant, Quotation, Project Factory, DAG, and Independent Dual-Agent QA
* Phase AG-AK: Support, SLA Triage, Renewal, Affiliate 60-day Tracking, Anti-Fraud, and Payouts
* Phase AL-AU: AI Governance, Kill Switches, Cost Interlocks, Observability, Dead Letter, and Backups
* Phase AV-AW: Measured Disaster Recovery Restore Drill & Controlled Rollback
* Phase AX-BD: Database Change Control, GitHub Master Branch Rules, Secrets Management, and Legal Layer
* Phase BE-BU: Business Metrics, Unit Economics, Real Customer Flow, Evidence Ledger, and Final Certification