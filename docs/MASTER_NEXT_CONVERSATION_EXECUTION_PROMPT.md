# IINSHA AI-BOS — MASTER NEXT-CONVERSATION EXECUTION CHECKPOINT

## Purpose
This document is the durable handoff for the next engineering conversation. Do not restart architecture discovery. Start from current repository/runtime evidence, verify every claim, and continue implementation in dependency order.

## Canonical identity
- Repository: `adnin4/inshatech`
- Canonical branch: `master`
- Latest observed repository tip commit: `8a18c4126192423bdd64e8a522911bb74bd0ee20`
- Latest code-changing payment test commit: `109ecab9329ec4999412716395be90d8d230f11f`
- Canonical runtime-code head recorded in system state: `e0f59020eb1919cfae6d275a98bca0c03872b6f0`
- Current runtime identity recorded: `UNVERIFIED_EXTERNAL_RUNTIME`
- Supabase project: `kitwadizsvjmuxkfewxj`
- Public site: `https://inshatech.pages.dev/`

## Current truth
Do not declare production certified. The current evidence supports a mature staging-ready architecture with important certification blockers still open.

Required status ladder:
`NOT_READY -> READY_FOR_STAGING -> STAGING_VERIFIED -> PRODUCTION_CANDIDATE -> PRODUCTION_VERIFIED -> REVENUE_OPERATIONAL -> AUTONOMOUS_OPERATIONAL`

A higher status is forbidden until all lower gates have objective evidence.

## Confirmed recent work
- Authoritative FX policy and reconciliation metadata were added.
- Webhook replay protection/concurrency atomicity test suite was added in commit `109ecab...`.
- Canonical system state was synchronized in commit `8a18c412...`.
- Supabase live SQL access is currently working from this environment.
- Current Supabase public tables inspected in this checkpoint show `tables_without_rls = 0`.

## Critical current uncertainty
The repository metadata explicitly records `runtime_identity = UNVERIFIED_EXTERNAL_RUNTIME`, and `canonical_runtime_code_head` differs from the repository tip. Therefore source/runtime parity is not certified. GitHub combined status for the observed latest commit returned no status records in the current tool response; do not infer CI green.

## Non-negotiables
1. Preserve all existing UI/UX, routes, tabs, buttons, information architecture and working behavior.
2. No DB reset, rebuild, drop, destructive rewrite or unreviewed data deletion.
3. No CI bypass, disabled gate, weakened assertion or fake green status.
4. No fake customer, order, payment, revenue, testimonials, uptime, QA, deployment or provider evidence.
5. Browser is never payment authority.
6. Client never determines authoritative price, coupon result, commission, payment state or privileged action.
7. Agents never receive unrestricted authority.
8. Financial, destructive and production-critical actions require policy and/or explicit scoped approval unless an already-approved low-risk policy permits automation.
9. Unavailable provider => `NOT_CONFIGURED`, `BLOCKED`, or `UNVERIFIED`; never synthetic success.
10. Every consequential state claim must have independent evidence.

## Execution algorithm for every change
`Inspect -> Reproduce -> Root cause -> Minimal additive fix -> Static/build checks -> Unit/contract tests -> Security tests -> DB integrity -> Browser regression -> Runtime observation -> Evidence -> Recheck -> Certify`

## FINAL DEPENDENCY ORDER

### Gate 0 — CI truth
- Split payment/master/security CI into independently observable jobs if still monolithic.
- Capture exact failing workflow/job/test/file/assertion in machine-readable and human-readable artifacts.
- Wire every new monetary/FX/replay/concurrency contract test into mandatory CI.
- Fix, rerun and freeze a green baseline.
- No downstream production activation before this gate is green.

### Gate 1 — Money and catalog authority
- `ibos_services` remains the canonical service registry.
- Server resolves published service/package/price.
- Minor-unit representation for financial authority.
- DB coupon authority with validity, scope, usage limits and atomic redemption.
- Request fingerprint/idempotency rules, including same key + different payload rejection.
- Concurrent checkout tests at realistic fan-out.

### Gate 2 — Payment correctness
- Legal payment state machine only.
- Provider attempt/recovery state.
- Real provider adapter; no sample checkout URL.
- SSLCommerz native IPN/signature/hash validation if SSLCommerz is the enabled rail.
- Order Validation API check.
- Verify `tran_id`, amount, currency, order binding and risk state.
- Replay-safe webhook/event ledger.
- Atomic duplicate webhook handling.
- Refund lifecycle with provider evidence.
- Sandbox full-cycle certification.
- Reconciliation against provider truth.
- Keep all unconfigured providers explicitly non-live.

### Gate 3 — Finance
- Immutable double-entry ledger.
- Payment fees, FX, taxes/adjustments where configured.
- Commission only after qualifying order/payment/fraud rules.
- Refund reversals, not destructive overwrites.
- Ledger invariants and reconciliation checks.
- No revenue operational claim until real transaction evidence exists.

### Gate 4 — Security and authorization
- Actor/resource/action matrix.
- Behavioral RLS tests for SELECT/INSERT/UPDATE/DELETE and `USING`/`WITH CHECK` semantics.
- Tenant A/B negative tests.
- Audit every `SECURITY DEFINER` function for search_path, schema qualification, caller validation and grants.
- Review views, functions, storage policies and exposed schemas.
- Verify service-role/provider secret isolation.
- Test replay, forged IDs, stale approvals, privilege escalation, prompt injection, tool authorization, memory poisoning and cross-tenant trace access.

### Gate 5 — Source / Cloudflare / runtime parity
- Prove the repo/branch that actually deploys the public site.
- One canonical production source only.
- CI-generated release metadata.
- Required equality:
  `Git SHA = Build SHA = Deploy SHA = Runtime SHA = browser artifact identity`
- Runtime must prove canonical Supabase project ref.
- Any mismatch => `UNVERIFIED` and release blocked.

### Gate 6 — Browser/UI certification
- Real browser tests against deployed build.
- Inventory every route and interactive surface.
- Verify click -> request -> auth -> authorization -> execution -> result -> UI state -> failure state.
- Desktop/mobile, keyboard, focus, accessibility, reduced motion, refresh/back/forward/reconnect.
- No critical console/network failures.
- Preserve visual baseline; only add minimal truthful status/loading/error affordances.

### Gate 7 — CRM / Sales
- Canonical customer identity.
- Lead capture and deterministic qualification.
- Catalog-based recommendations.
- Proposal versioning.
- Customer acceptance state machine.
- No unauthorized discount or promise.
- Commercial transitions audited.

### Gate 8 — Project Factory
- Verified/authorized order -> project.
- Requirements -> architecture -> task DAG -> sandbox execution.
- Artifact provenance and hashes.
- Independent QA.
- Preview deployment.
- Explicit client approval/change-request loop.
- Delivery only after verified acceptance.

### Gate 9 — Agent Workforce
- Agent registry/versioning.
- Tool/skill permissions.
- Per-agent and per-mission budgets.
- Typed agent delegation contracts.
- Durable resumable missions.
- Agent loop:
  `Understand -> Plan -> Delegate -> Execute -> Observe -> Verify -> Recover -> Record -> Learn -> Escalate`
- Model/provider routing by quality, latency, cost, availability and data sensitivity.
- LLM output is never execution evidence by itself.

### Gate 10 — Evidence / evaluation / observability
- Unified correlation/trace IDs.
- Evidence graph across customer, conversation, lead, proposal, order, mission, task, agent, tool, provider, artifact, QA, deployment, delivery, support and ledger.
- Independent verification.
- Offline benchmark + adversarial evaluation before promotion.
- Production sampled evaluation once live.
- Cost/quality scorecards.
- Regression gates.
- Secret/PII-safe telemetry.

### Gate 11 — Deployment / SRE
- Preview -> approval -> production.
- Migration safety and backup before risky changes.
- Smoke/health checks.
- Real rollback drill.
- SLO/SLI/error-budget model.
- Dead-letter/manual recovery path.
- Incident lifecycle.
- Global and domain kill switches.
- Bounded self-healing only.

### Gate 12 — Support / renewal
- Classify bug/incident/feature/question.
- Retrieve verified customer/project context.
- Safe remediation.
- Verify before closure.
- Customer confirmation.
- Renewal/maintenance/expansion/referral only from evidence.

### Gate 13 — Growth / affiliate
- Real acquisition instrumentation.
- Provider-backed marketing publication only.
- Affiliate: click -> attribution -> lead -> conversion -> commission -> fraud/eligibility -> payout approval -> evidence.
- Lock qualifying commission economics at sale time.
- No fabricated campaign/affiliate/revenue metrics.

### Gate 14 — Golden E2E without live payment
Run an actual payment-independent customer journey through configured infrastructure:
`Customer -> Chat -> Qualification -> Proposal -> CRM -> authorized test/manual order -> Mission -> Agent work -> Sandbox -> QA -> Preview -> Approval -> Delivery -> Support -> Evidence`

Payment remains `NOT_CONFIGURED` until genuine transaction testing is possible.

### Gate 15 — Real pilot
- Allowlisted customer cohort.
- Feature flags.
- Owner alerts.
- Kill switch.
- Full trace/evidence.
- Explicit customer acceptance.
- Post-pilot review and remediation.

### Gate 16 — Revenue operational
Only when all are proven:
- real customer
- real payment
- real order
- real project
- real delivery
- real support
- reconciled ledger
- verified attribution

### Gate 17 — Autonomous operational
Only after Revenue Operational plus:
- governed CRM
- governed sales
- payment orchestration
- project factory
- engineering agents
- independent QA
- deployment controls
- support
- renewal
- finance
- analytics
- human override
- global kill switch

## Advanced architecture that is now locked
Customer/UI -> API Gateway -> Session/Identity -> Context/Memory -> Planner/Router -> Mission Kernel -> Policy/Authority -> Tool Gateway -> Provider Adapter -> Execution -> Verification -> Evidence Graph -> Event/Outbox -> Next Action.

Use one authoritative runtime. Do not create competing agent runtimes, duplicate workflow kernels or duplicate lifecycle truths.

## Memory model
Session -> User -> Customer -> Organization -> Project -> Task -> Agent -> Institutional/Operational/Learned.
Every durable memory item requires provenance, confidence, privacy classification, retention/expiry and evidence reference.

## Learning model
`Observed -> Candidate -> Benchmarked -> Security Review -> Shadow -> Canary -> Approved -> Active -> Rollback`
Generated prompts/policies/skills/knowledge cannot directly self-promote into production authority.

## Resilience model
Detect -> Diagnose -> Classify -> Policy -> Remediate -> Verify -> Rollback/Compensate -> Incident -> Learn.
Bound retry count, duration, concurrency, spend, delegation depth and blast radius.

## Business Control Tower minimum truth
- Revenue and cash collected from ledger/provider evidence.
- Contribution margin.
- Qualified leads and conversion.
- Active projects and SLA risk.
- Agent health, quality and cost.
- AI/tool/infrastructure spend.
- Incidents and error-budget burn.
- Customer health and support load.
- Affiliate performance.
- Pending approvals.
- Top risks and recommended next actions.
- Freshness timestamps for every KPI.

## Public trust rules
Every public operational claim must map to evidence. Unsupported claims become:
- removed; or
- `DEMO`; or
- `SIMULATION`; or
- `ESTIMATED`; or
- `NOT_CONFIGURED`.
Never present synthetic data as real operational performance.

## Final certification reports
Maintain and regenerate as evidence changes:
- `docs/PRODUCTION_READINESS_SCORECARD.md`
- `docs/CI_FAILURE_EVIDENCE.md`
- `docs/PAYMENT_CERTIFICATION.md`
- `docs/FINANCE_CERTIFICATION.md`
- `docs/SECURITY_CERTIFICATION.md`
- `docs/RUNTIME_PARITY_REPORT.md`
- `docs/BROWSER_E2E_REPORT.md`
- `docs/AGENT_WORKFORCE_CERTIFICATION.md`
- `docs/GOLDEN_E2E_REPORT.md`
- `docs/REAL_PILOT_REPORT.md`
- `docs/REVENUE_OPERATIONAL_CERTIFICATION.md`
- `docs/AUTONOMOUS_OPERATIONAL_CERTIFICATION.md`

## Next action in the next conversation
1. Re-fetch latest `master` HEAD.
2. Fetch combined CI/workflow runs for that exact SHA and obtain exact failing job/log evidence.
3. Inspect the current payment CI workflow and the new replay/concurrency tests.
4. Reproduce the first real failing gate and fix only its root cause.
5. Re-run all affected gates.
6. Update the certification/evidence files from observed results.
7. Continue to the next dependency only after the current gate is actually green.

## Do not do
- Do not create more roadmap/architecture issues unless a genuinely new blocker is discovered outside this contract.
- Do not mark `PRODUCTION_VERIFIED`, `REVENUE_OPERATIONAL`, or `AUTONOMOUS_OPERATIONAL` from source inspection alone.
- Do not pretend external Cloudflare production runtime, payment providers, or real customer evidence exists unless directly observed.
- Do not redesign the UI as part of backend hardening.

## Definition of done
A capability is complete only when implemented, independently tested, runtime exercised where applicable, evidence recorded, failure modes handled, security verified, and its public status accurately reflects that evidence.