# IINSHA AI-BOS — Deep Current-State Audit & Final Execution Roadmap

**Audit date:** 2026-09-08
**Canonical repository:** `adnin4/inshatech`
**Canonical branch:** `master`
**Canonical Supabase:** `kitwadizsvjmuxkfewxj`
**Public site observed:** `https://inshatech.pages.dev/`

## Executive decision

IINSHA has a substantial AI-BOS/control-plane foundation and a much stronger payment/security architecture than earlier checkpoints. It is **not yet PRODUCTION_VERIFIED**. The dominant remaining gap is not feature breadth; it is proof that the implemented control plane is the system actually running in production, and proof that consequential business effects are atomic, externally verified, independently verified, observable, and recoverable.

## Present evidence snapshot

- GitHub repository exists and is active; `master` is the default branch.
- Recent payment hardening work includes minor-unit money handling, true concurrency/idempotency tests, credential preflight, and refund ledger reversal logic.
- Current payment CI workflow contains schema, service authority, coupon, FX, state-machine, webhook, adversarial, replay/concurrency, reconciliation and tenant-RLS checks.
- Current observable GitHub status for the newest commit did not return workflow/status records through the available connector; therefore CI is **NOT PROVEN GREEN**.
- Supabase project `inshatech-db` is `ACTIVE_HEALTHY`, PostgreSQL 17.x, region `ap-southeast-1`.
- Current public tables observed through Supabase all have RLS enabled; 110 policies were observed.
- Supabase Security Advisor currently returns zero lints.
- Supabase Performance Advisor currently reports 117 `unused_index` INFO observations; do not mass-delete these without production workload evidence.
- Supabase Edge Functions list is empty; do not create a second competing application runtime merely to fill this gap.
- Cloudflare public site is reachable and contains the existing visual/product surface, but exact production deployment/runtime SHA parity is not independently verified.
- The current conversational entrypoint can call Gemini when configured, but it still contains keyword-based agent selection, hard-coded service/catalog facts, locally generated mission/execution identifiers, and an explicit `persisted: false` evidence state. It is therefore not yet the canonical durable agent-mission runtime.
- Current payment webhook code has substantially improved verification and replay protection, including provider identification, signature verification, duplicate event checks, SSLCommerz validation paths, state transition guards and refund accounting additions. This is still code evidence, not real-provider transaction certification.

## Certification state

`READY_FOR_STAGING` and `STAGING_VERIFIED` remain the appropriate maturity description from the available evidence.

The following remain blocked until objective evidence is attached:

- `PRODUCTION_CANDIDATE`
- `PRODUCTION_VERIFIED`
- `REVENUE_OPERATIONAL`
- `AUTONOMOUS_OPERATIONAL`

## Hard blockers

### 1. CI truth
Obtain exact workflow/run/job/assertion evidence for current `master`, fix root cause, rerun, and freeze a green baseline. Never infer green from the absence of returned status data.

### 2. Money and commercial authority
Keep `ibos_services` authoritative. Server resolves service/package/price. Finish DB-backed coupon validity/scope/limits/atomic redemption and request-fingerprint semantics. Ensure same idempotency key with a materially different payload is rejected.

### 3. Payment atomicity and provider truth
Keep the legal payment state machine. Finish provider-specific adapter certification, SSLCommerz native validation, transaction/amount/currency/order binding, replay-safe webhook ledger, duplicate/concurrent webhook handling, refund lifecycle and provider reconciliation. Unconfigured providers must remain `NOT_CONFIGURED`.

### 4. Finance atomicity
Payment success, revenue, fees, commission and refund/reversal accounting must be transactionally consistent or recoverable through a durable outbox/reconciliation model. Avoid silently swallowed accounting failures after a payment mutation.

### 5. Supabase security behavior
RLS being enabled and Security Advisor being clean are not sufficient. Audit grants + policies together; run behavioral tenant A/B negative tests for SELECT/INSERT/UPDATE/DELETE; audit views and every SECURITY DEFINER function for search_path, caller checks and execute grants. Keep service-role access server-side.

### 6. Runtime/source parity
Prove `Git SHA = Build SHA = Deploy SHA = Runtime SHA = browser artifact identity`, and prove the runtime is connected to the canonical Supabase project ref.

### 7. Browser production proof
Certify the existing UI without redesign. Every consequential interaction must be tested as click → request → auth → authorization → execution → result → UI state → failure state. Cover desktop/mobile, reconnect, retry, accessibility and console/network health.

### 8. Real agent runtime
Replace the current conversational shortcut path with one authoritative pipeline: identity/session → context/memory → real model → structured intent/plan → mission kernel → policy → tool gateway → provider execution → independent verification → evidence persistence → truthful response.

## Locked architecture

`Customer/UI → API Gateway → Session/Identity → Context/Memory → Planner/Router → Mission Kernel → Policy/Authority → Tool Gateway → Provider Adapter → Execution → Independent Verification → Evidence Graph → Event/Outbox → Next Action`

Use one authoritative runtime. Supabase remains the business data/authorization control plane. Cloudflare remains the edge/application runtime unless a future measured requirement justifies a controlled migration to Workers. n8n can remain an integration/automation adapter, not a second business-lifecycle authority.

## Agent workforce

Do not add more agents merely for count. The existing role model is sufficient: CEO/orchestrator, sales, CRM, research, architect, developer, QA, deployment, support/SRE, marketing, affiliate, finance/analytics, guardian/security. Every agent requires explicit identity, role, tool permissions, forbidden actions, authority, budget, memory scope, SLA/KPI and escalation policy.

Authority hierarchy:

`policy > human approval > role permission > tool permission > agent intent`

High-impact financial, destructive and production-critical actions remain policy/approval controlled. Safe low-risk actions can become automated only through an already-approved policy.

## Memory and learning

Memory layers: session → user → customer → organization → project → task → agent → institutional/operational/learned.

Durable memory must carry provenance, confidence, privacy class, retention/expiry and evidence reference.

Learning promotion: `OBSERVED → CANDIDATE → BENCHMARKED → SECURITY_REVIEW → SHADOW → CANARY → APPROVED → ACTIVE → ROLLBACK`.

No generated prompt, policy, skill or knowledge item can self-promote into production authority.

## Final dependency order

### Gate 0 — CI root-cause closure
1. Re-fetch latest `master` head.
2. Obtain exact workflow/job/run evidence.
3. Identify first failing assertion/root cause.
4. Apply the smallest additive fix.
5. Rerun affected and full mandatory gates.
6. Record machine-readable and Markdown evidence.
7. Freeze the green baseline.

### Gate 1 — Catalog / pricing / coupon
1. Server-side service/package lookup.
2. Server-calculated price.
3. Minor-unit money authority.
4. Coupon validity/scope/usage enforcement.
5. Atomic redemption.
6. Idempotency request fingerprint.
7. 10/50/100-way race tests.

### Gate 2 — Payment
1. Provider credential preflight.
2. Provider-specific checkout adapter.
3. Native signature/hash verification.
4. SSLCommerz Order Validation API where enabled.
5. `tran_id`, amount, currency and order binding.
6. Risk handling.
7. Durable webhook event ledger.
8. Replay/concurrency safety.
9. Refund lifecycle and provider evidence.
10. Sandbox end-to-end certification.
11. Provider-vs-internal reconciliation.

### Gate 3 — Finance
1. Immutable ledger.
2. Double-entry invariant checks.
3. Payment fees/FX/tax adjustments where configured.
4. Commission eligibility and lock-at-sale semantics.
5. Refund reversals.
6. Durable reconciliation and exception workflow.

### Gate 4 — Security / authorization
1. Actor × resource × action matrix.
2. RLS behavioral tests, including cross-tenant deny paths.
3. Grants review.
4. SECURITY DEFINER review.
5. View exposure review.
6. Storage policy review.
7. Secret/service-role isolation.
8. Replay/forged ID/stale approval/privilege escalation tests.
9. Prompt-injection, tool-poisoning and memory-poisoning tests.

### Gate 5 — Source / Cloudflare / runtime parity
1. Prove production source repository and branch.
2. Remove any competing production source ambiguity.
3. Generate release metadata in CI.
4. Prove Git/build/deploy/runtime/browser parity.
5. Prove runtime Supabase project identity.
6. Block on mismatch.

### Gate 6 — Browser/UI certification
Preserve the current visual baseline. Inventory routes and interactive elements. Test successful, loading, empty, retry, error, reconnect and unauthorized states. Test desktop, mobile, keyboard/focus and reduced-motion behavior.

### Gate 7 — CRM / sales
Customer identity → qualification → opportunity → proposal versioning → authorized acceptance → order. Pricing and commitments remain server-authoritative.

### Gate 8 — Project Factory
Verified/authorized order → requirements → architecture → task DAG → isolated workspace → artifact → independent QA → preview → client approval/change request → delivery.

### Gate 9 — Agent workforce
Typed contracts, durable missions, budgets, delegation limits, real tool execution, recovery, escalation and model routing.

### Gate 10 — Evidence / evaluation
Unified trace IDs, evidence graph, reproducible model/prompt/policy versions, offline benchmarks, adversarial evaluation, cost/quality scorecards, regression blocks and privacy-safe telemetry.

### Gate 11 — SRE / deployment
Preview → approval → production, migration safety checks, backup, smoke checks, rollback drill, SLOs, error budgets, dead-letter/recovery paths, incidents, kill switches and bounded self-healing.

### Gate 12 — Support / renewal
Classify issues, retrieve verified context, remediate safely, verify, close only with evidence, and derive renewal/expansion/referral actions from actual customer/project state.

### Gate 13 — Growth / affiliate
Real acquisition telemetry; provider-backed marketing; affiliate click → attribution → conversion → commission → fraud/eligibility → payout approval. No fabricated metrics.

### Gate 14 — Golden E2E without live payment
Run a real payment-independent journey end-to-end through configured infrastructure. Payment remains `NOT_CONFIGURED` until genuine provider credentials and transaction evidence exist.

### Gate 15 — Real pilot
Allowlisted customer cohort, owner alerts, feature flags, strict blast radius, kill switch, complete evidence and explicit acceptance.

### Gate 16 — Revenue operational
Require real customer + real payment + real order + real project + real delivery + real support + reconciled ledger + verified attribution.

### Gate 17 — Autonomous operational
Only after revenue operation is proven plus governed CRM, governed sales, payment orchestration, project factory, engineering agents, independent QA, deployment controls, support, renewal, finance, analytics, human override and global kill switch.

## Final acceptance criteria

`PRODUCTION_VERIFIED` requires objective proof of green CI, security pass, verified payment rail, reconciled finance, behavioral RLS, exact runtime SHA parity, browser E2E, rollback proof and complete evidence.

`REVENUE_OPERATIONAL` adds real customer, payment, order, project, delivery, support and attribution/ledger evidence.

`AUTONOMOUS_OPERATIONAL` adds the governed closed-loop workforce and owner override/kill-switch controls.

## Public trust rule

Any public capability without runtime evidence must be labeled `DEMO`, `SIMULATION`, `ESTIMATED`, `NOT_CONFIGURED`, `UNVERIFIED` or removed. Never publish unsupported performance percentages, fake social proof, fake customer activity or simulated execution as production performance.

## Performance rule

Do not mass-delete indexes or redesign the UI based on static observations. Measure traffic, query plans, API/DB latency, frontend payload and Core Web Vitals; then apply selective optimizations and regression-test them.

## Non-negotiables

- No DB reset/rebuild/drop.
- No CI bypass.
- No weakening assertions to obtain green.
- No fake customers/payments/revenue/testimonials/provider evidence.
- No browser-authoritative payment.
- No client-authoritative pricing/coupon/commission/payment status.
- No unrestricted agent authority.
- No second competing workflow kernel/runtime without a measured architectural reason.
- Preserve existing UI/UX.

## Next conversation checkpoint

Start with:

`IINSHA MASTER CHECKPOINT থেকে continue করো.`

Then execute, in order:

1. Verify current `master` HEAD.
2. Obtain exact CI run/job/log evidence.
3. Fix the first actual CI root cause.
4. Rerun and freeze green baseline.
5. Proceed to money/coupon/idempotency, then payment, finance, security and runtime parity.
6. Update this report and the master checkpoint only from observed evidence.
7. Do not declare any higher certification state until every prerequisite has objective evidence.
