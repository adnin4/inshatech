# IINSHA AI-BOS — MASTER NEXT-CONVERSATION EXECUTION CHECKPOINT

## Purpose
This is the durable engineering handoff. Do not restart architecture discovery. Start from the current observed GitHub/Supabase/site evidence, distinguish live/runtime proof from source or historical claims, and continue implementation in dependency order.

## OBSERVED ON 2026-09-08

### GitHub
- Repository: `adnin4/inshatech`
- Canonical branch: `master`
- Repository visibility: private
- Latest observed commit: `eb409a51e82a9bacbf41fec249219aaf3e324321`
- Latest observed commit message: `feat(payments): record reversing ledger expense on refund webhook for double-entry integrity`
- Immediately preceding payment hardening commits observed: `84fee3b4` (credential preflight), `b718193d` (minor-unit money + concurrent idempotency race suite), `e7d9dd04` (replay/concurrency readiness docs), `8898640f` (payment CI suites).
- `eb409a51` adds refund-related expense recording in `functions/api/payments/webhook.js`.
- Exact commit workflow-run query returned no workflow runs, and combined commit status returned no status records in the current connector response. Therefore CI is NOT proven green.
- Existing umbrella blocker: Issue #62 `P0 FINAL: Pre-Pilot Certification, Production Parity, Commercial Readiness & Autonomous Operation Gate`.
- Important open blockers/issues remain around runtime parity, real agent execution, payment/finance integrity, security behavior, browser certification and real pilot evidence.

### Source/runtime truth
- `CANONICAL_SYSTEM_STATE.json` is stale relative to the newly observed GitHub tip: it still records `current_repository_tip=8898640f...` and `runtime_identity=UNVERIFIED_EXTERNAL_RUNTIME`.
- It records `canonical_runtime_code_head=e0f59020...`, while the observed repository tip is now `eb409a51...`.
- Therefore Git SHA -> build SHA -> deploy SHA -> runtime SHA parity remains UNVERIFIED.
- `wrangler.toml` points at the canonical Supabase URL `https://kitwadizsvjmuxkfewxj.supabase.co`, but configuration is not runtime proof.

### Current agent chat implementation
`functions/api/v1/agent/chat.js` now supports real Gemini inference when `GEMINI_API_KEY`/`GOOGLE_AI_API_KEY` exists, but it is still NOT the complete production mission/evidence runtime:
- intent/agent routing remains keyword-based;
- service catalog facts in the prompt are hard-coded rather than resolved from the authoritative DB;
- it creates session/mission/execution IDs locally;
- response evidence is hashes/signatures only and explicitly says `persisted: false`;
- it does not persist mission/checkpoint/tool-receipt/evidence records in this path;
- it does not delegate through the canonical mission/policy/tool gateway;
- failure to reach Gemini falls back to deterministic canned responses.
Therefore `/api/v1/agent/chat` must remain below `LIVE_VERIFIED` until the real runtime/evidence contract is implemented and runtime-tested.

### Payment/webhook source truth
The current webhook code is substantially hardened: provider identification, HMAC/signature checks, event IDs, duplicate protection, durable webhook-event registration before order mutation, SSLCommerz validation path, transaction/currency/amount checks, risk checks and legal payment-state transitions are present.
However, the current code still needs transaction-level finance integrity verification. Several downstream ledger writes use independent REST calls and some failures are swallowed (`catch(() => null)`), so payment success must not be certified until revenue/commission/refund ledger invariants and reconciliation are proven under partial failure/concurrency.

### Supabase — LIVE control-plane observations
- Project: `inshatech-db`
- Ref: `kitwadizsvjmuxkfewxj`
- Region: `ap-southeast-1`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: 17.6.1.155 / engine 17
- Public schema contains the existing AI-BOS/control-plane tables; no reset/rebuild is permitted.
- All observed public tables have RLS enabled.
- `pg_policies` currently reports 110 public policies.
- Security Advisor currently reports 0 lints.
- There is 1 `SECURITY DEFINER` function in public: `rls_auto_enable()`, configured with `search_path=pg_catalog`.
- Supabase Edge Functions list is empty: `[]`. This is important: do not assume Supabase Edge Functions are the application runtime; Cloudflare Pages/Workers is the intended edge runtime unless deployment evidence proves otherwise.
- Performance Advisor currently reports 117 INFO `unused_index` findings. Do NOT mass-delete them. First measure actual query plans/usage/write overhead after the real workload is running; remove only demonstrably redundant indexes through reviewed additive migrations.
- Current migration history includes the payment/idempotency authority migration `20260907213737_payment_idempotency_and_authority_guards` plus the earlier autonomous-company/control-plane migrations.
- RLS enabled + 0 Security Advisor lints is NOT a complete application security certification. Required next work includes grants, policies, views, functions, storage, SECURITY DEFINER behavior and authenticated tenant A/B negative tests.

### Public Cloudflare site observation
Public site: `https://inshatech.pages.dev/`
The accessible site snapshot still contains public claims/phrasing that must be reviewed before production certification, including:
- `VERIFIED STUDIO`
- `100% Verifiable Codebase`
- `99.8% Success`
- `100% Reliable Data Stream`
- `Cloudflare Bypass`
- `OpenClaw stealth` / anti-bot bypass language
- simulated execution text such as `simulate OpenClaw Playwright scraper output` and `simulate live execution pulse`
- public marketplace download/review counts and other operational-looking metrics whose production provenance must be established.
These must be removed, softened, or explicitly labeled `DEMO`, `SIMULATION`, `ESTIMATED`, or `NOT_CONFIGURED` unless evidence exists. Preserve the visual/UI structure; this is a truth-hardening/content change, not a redesign.

The current environment cannot directly prove the Cloudflare production project configuration or live `/api/version`, `/api/health`, `/api/sre/health` SHA identity through an authenticated Cloudflare control-plane connector. A normal public site render is not enough to prove deployment/source/runtime parity.

## CURRENT CERTIFICATION STATUS
`PRODUCTION_VERIFIED` = NO.
`REVENUE_OPERATIONAL` = NO.
`AUTONOMOUS_OPERATIONAL` = NO.

Best-supported maturity classification: `PRODUCTION_CANDIDATE` architecture / staging-grade control plane, with critical external-runtime and real-world execution evidence still missing. Do not promote the status ladder without objective evidence:
`NOT_READY -> READY_FOR_STAGING -> STAGING_VERIFIED -> PRODUCTION_CANDIDATE -> PRODUCTION_VERIFIED -> REVENUE_OPERATIONAL -> AUTONOMOUS_OPERATIONAL`.

## NON-NEGOTIABLES
1. Preserve existing UI/UX, routes, tabs, buttons, information architecture and working behavior.
2. No DB reset, rebuild, drop, destructive rewrite or unreviewed data deletion.
3. No CI bypass, weakened assertion or fake green status.
4. No fake customer, order, payment, revenue, testimonial, uptime, QA, deployment or provider evidence.
5. Browser is never payment authority.
6. Client never determines authoritative price, coupon, commission, payment state or privileged action.
7. Agents never receive unrestricted authority.
8. Financial/destructive/production-critical actions remain policy/approval controlled unless an already-approved low-risk policy explicitly permits automation.
9. Unavailable provider => `NOT_CONFIGURED`, `BLOCKED`, `FAILED`, or `UNVERIFIED`; never synthetic success.
10. Every consequential status claim requires independent evidence.
11. One authoritative runtime and one workflow/lifecycle truth. Do not create competing runtimes.

## EXECUTION ALGORITHM
`Inspect -> Reproduce -> Root cause -> Minimal additive fix -> Static/build checks -> Unit/contract tests -> Security tests -> DB integrity -> Browser regression -> Runtime observation -> Evidence -> Recheck -> Certify`

## FINAL DEPENDENCY ORDER

### GATE 0 — CI TRUTH
- Inspect exact latest master SHA and all relevant workflow files.
- Obtain real workflow run/job/log evidence; if unavailable, do not call CI green.
- Split monolithic jobs only if needed for observability; do not weaken gates.
- Make payment, FX, coupon, replay, concurrency, reconciliation and RLS contract tests mandatory.
- Fix first real failure only; rerun; freeze a green baseline.

### GATE 1 — MONEY / CATALOG / COUPON AUTHORITY
- `ibos_services` is canonical service/package registry.
- Server resolves published price/package; never trust browser price.
- Minor-unit financial representation.
- Coupon status/scope/validity/usage limits and atomic redemption.
- Request fingerprint/idempotency; same key + different payload must reject.
- Concurrency tests at realistic fan-out (10/50/100).

### GATE 2 — PAYMENT CORRECTNESS
- Legal state transitions only.
- Real provider adapter; no sample checkout URL.
- Provider credential preflight.
- SSLCommerz-native validation/signature/IPN if SSLCommerz is the enabled rail.
- Exact transaction/order/amount/currency binding.
- Risk handling.
- Replay-safe event ledger and atomic duplicate webhook behavior.
- Refund lifecycle with provider evidence.
- Sandbox full-cycle test.
- Provider-vs-internal reconciliation.

### GATE 3 — FINANCE
- Immutable double-entry ledger.
- Payment fees, FX, taxes/adjustments where configured.
- Commission only after qualifying order/payment/fraud rules.
- Refunds create reversing entries; never overwrite history.
- Do not swallow critical ledger-write failures. Use transactional DB functions/outbox/reconciliation so partial payment success cannot silently create incomplete finance state.
- Automated invariants: debits=credits, unique business events, one revenue event per qualifying payment, one reversal per qualifying refund, reconciliation completeness.

### GATE 4 — SECURITY / AUTHORIZATION
- Actor/resource/action matrix.
- RLS behavioral tests for SELECT/INSERT/UPDATE/DELETE with `USING` and `WITH CHECK`.
- Tenant A/B negative tests.
- Audit all SECURITY DEFINER functions, views, grants, exposed schemas and storage policies.
- Keep service-role/provider secrets server-side.
- Test replay, forged IDs, stale approvals, privilege escalation, prompt injection, tool authorization, memory poisoning and cross-tenant trace access.

### GATE 5 — SOURCE / CLOUDFLARE / RUNTIME PARITY
Required equality:
`Git SHA = Build SHA = Deploy SHA = Runtime SHA = browser artifact identity`.
- Prove Cloudflare project/source/branch.
- One canonical production source.
- CI-generated release metadata.
- Prove runtime Supabase ref = `kitwadizsvjmuxkfewxj`.
- Any mismatch = `UNVERIFIED` and release blocked.

### GATE 6 — BROWSER / UI CERTIFICATION
- Real browser tests against deployed build.
- Inventory routes and every major interaction.
- Verify click -> request -> auth -> authorization -> execution -> result -> UI state -> failure state.
- Desktop/mobile, keyboard/focus, accessibility, reduced motion, refresh/back/forward/reconnect.
- No critical console/network errors.
- Preserve visual baseline.

### GATE 7 — CRM / SALES
- Canonical customer identity.
- Real lead capture and deterministic qualification.
- Catalog-backed recommendation and proposal.
- Customer acceptance state machine.
- No unauthorized discounts/promises.
- Every commercial transition auditable.

### GATE 8 — PROJECT FACTORY
- Authorized order/test-order -> project.
- Requirements -> architecture -> task DAG -> sandbox execution.
- Artifact provenance/hash.
- Independent QA.
- Preview deployment.
- Explicit client acceptance/change request.
- Delivery only after verified acceptance.

### GATE 9 — AGENT WORKFORCE
- Agent registry/versioning.
- Tool/skill permissions.
- Per-agent/mission time, token, tool, spend, recursion and concurrency budgets.
- Typed delegation contracts.
- Durable resumable missions.
- Loop: `Understand -> Plan -> Delegate -> Execute -> Observe -> Verify -> Recover -> Record -> Learn -> Escalate`.
- Model/provider routing by quality, latency, cost, availability and data sensitivity.
- LLM output never equals execution evidence.

### GATE 10 — EVIDENCE / EVALUATION / OBSERVABILITY
- Unified trace IDs across customer/session/mission/task/agent/tool/provider/artifact/QA/deployment/delivery/support/ledger.
- Evidence graph and immutable receipts.
- Offline benchmark + adversarial evaluation before model/prompt/policy promotion.
- Sampled online evaluation after launch.
- Cost/quality scorecards and regression gates.
- Secret/PII-safe telemetry.

### GATE 11 — DEPLOYMENT / SRE
- Preview -> approval -> production.
- Backup before risky migration.
- Health/smoke checks.
- Real rollback drill.
- SLO/SLI/error budgets.
- Dead-letter/manual recovery.
- Incident lifecycle.
- Global/domain kill switches.
- Bounded self-healing only.

### GATE 12 — SUPPORT / RENEWAL
- Bug/incident/feature/question classification.
- Verified customer/project context.
- Safe remediation and independent verification.
- Customer confirmation.
- Renewal/maintenance/expansion/referral based on evidence.

### GATE 13 — GROWTH / AFFILIATE
- Real acquisition instrumentation.
- Provider-backed marketing only.
- Affiliate: click -> attribution -> lead -> conversion -> commission -> fraud/eligibility -> payout approval -> evidence.
- Lock qualifying commission economics at sale time.
- No fabricated campaign/affiliate/revenue metrics.

### GATE 14 — GOLDEN E2E WITHOUT LIVE PAYMENT
`Customer -> Chat -> Qualification -> Proposal -> CRM -> authorized test/manual order -> Mission -> real agent work -> Sandbox -> QA -> Preview -> Approval -> Delivery -> Support -> Evidence`.
Payment remains `NOT_CONFIGURED` until genuine provider transaction testing is possible.

### GATE 15 — REAL PILOT
- Allowlisted customer.
- Feature flags and blast-radius limits.
- Owner alerts and kill switch.
- Full trace/evidence.
- Explicit customer acceptance.
- Post-pilot review.

### GATE 16 — REVENUE OPERATIONAL
Requires real customer + real payment + real order + real project + real delivery + real support + reconciled ledger + verified attribution.

### GATE 17 — AUTONOMOUS OPERATIONAL
Only after Revenue Operational plus governed CRM/sales/payment/project factory/engineering agents/independent QA/deployment/support/renewal/finance/analytics/human override/global kill switch.

## LOCKED TARGET ARCHITECTURE
`Customer/UI -> API Gateway -> Session/Identity -> Context/Memory -> Planner/Router -> Mission Kernel -> Policy/Authority -> Tool Gateway -> Provider Adapter -> Execution -> Verification -> Evidence Graph -> Event/Outbox -> Next Action`.

One authoritative server-side runtime. Supabase is the authoritative business database/control plane. Cloudflare Pages/Workers is the edge delivery/runtime only if exact deployment parity is proven. n8n is an integration/automation adapter, not a competing business lifecycle kernel.

Cloudflare's current documentation states Pages Functions execute server-side on Workers, and Cloudflare now positions Workers as the broader full-stack platform for new applications. Do not migrate merely for novelty: first prove the existing Pages deployment. If later migration to Workers materially improves Durable Objects/Cron/Observability/runtime control, do it as a measured, separate release after production parity—not during the current certification gate.

## MEMORY
`Session -> User -> Customer -> Organization -> Project -> Task -> Agent -> Institutional/Operational/Learned`.
Every durable memory item requires provenance, confidence, privacy class, retention/expiry and evidence reference. Never treat model-generated memory as authoritative without validation.

## LEARNING
`Observed -> Candidate -> Benchmarked -> Security Review -> Shadow -> Canary -> Approved -> Active -> Rollback`.
No generated prompt/policy/skill/knowledge may self-promote into production authority.

## RESILIENCE
`Detect -> Diagnose -> Classify -> Policy -> Remediate -> Verify -> Rollback/Compensate -> Incident -> Learn`.
Bound retry count, duration, concurrency, spend, delegation depth and blast radius.

## BUSINESS CONTROL TOWER TRUTH
Revenue/cash, margin, leads/conversion, active projects/SLA risk, agent quality/cost, infrastructure spend, incidents/error budget, customer health/support, affiliate performance, approvals, risks/opportunities; every KPI has source and freshness timestamp.

## PUBLIC TRUST
Unsupported claims must be removed or labeled `DEMO`, `SIMULATION`, `ESTIMATED`, or `NOT_CONFIGURED`. In particular, review bypass/stealth language, guaranteed success percentages, operational download/review counts, and simulated execution UI.

## PERFORMANCE
Do not mass-delete the current 117 unused-index findings. Measure query plans and production workload first. Then selectively remove redundant indexes and add only evidence-backed indexes. Prioritize actual user-path latency: chat startup/TTFB, API/DB latency, mission polling/streaming, heavy JS, image/font loading, and mobile main-thread work.

## SECURITY RESEARCH BASELINE
- Supabase current guidance: exposed tables/views need RLS plus appropriate grants; RLS does not secure functions, so EXECUTE grants and SECURITY DEFINER review are required. SECURITY DEFINER functions should pin `search_path` and schema-qualify references.
- NIST's 2026 AI Agent Standards Initiative emphasizes trusted autonomous action, interoperability, agent identity and authorization.
- OWASP's 2026 Top 10 for Agentic Applications is the security baseline for autonomous planning/tool-use systems.

## REQUIRED FINAL REPORTS
Keep these regenerated from actual evidence:
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

## NEXT CONVERSATION — FIRST ACTIONS
1. Re-fetch exact latest `master` HEAD.
2. Inspect all GitHub Actions workflows and obtain the first real failing job/log; no status record is not green.
3. Run/review payment contract suites and reproduce the first failure.
4. Fix only the root cause; rerun all affected suites.
5. Inspect the new money/idempotency/concurrency/refund code for atomicity and partial-failure behavior.
6. Run live Supabase behavioral security queries/tests: policies, grants, views, SECURITY DEFINER, tenant isolation.
7. Refresh `CANONICAL_SYSTEM_STATE.json` from observed facts only; do not hand-maintain fake runtime SHAs.
8. Verify Cloudflare source/branch/deploy/runtime identity through direct control-plane evidence when available.
9. Convert public unsupported claims/simulation-success wording to truthful states without redesigning UI.
10. Replace the chat endpoint's hard-coded catalog/mission IDs and non-persisted evidence with the canonical catalog -> mission -> policy -> tool -> evidence path.
11. Certify the payment-independent Golden E2E before activating any live payment rail.
12. Only after production parity + browser + security + Golden E2E pass, run the allowlisted real pilot.

## DO NOT
- Do not create another roadmap/architecture issue unless a genuinely new blocker is discovered outside Issue #62.
- Do not mark production/revenue/autonomous status from source inspection alone.
- Do not claim Cloudflare runtime/payment/customer evidence without direct observation.
- Do not redesign the UI to solve backend gaps.
- Do not mass-delete indexes because the advisor labels them unused before real workload measurement.

## DEFINITION OF DONE
A capability is complete only when it is implemented, independently tested, runtime exercised where applicable, evidence recorded, failure modes handled, security verified, and its public status exactly matches the evidence.
