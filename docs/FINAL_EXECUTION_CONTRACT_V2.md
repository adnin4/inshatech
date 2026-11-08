# IINSHA AI-BOS — FINAL EXECUTION CONTRACT V2

## Purpose

This document is the execution contract for converting IINSHA AI-BOS from a feature-rich/staging-verified system into a production-verifiable, revenue-capable, governed autonomous business operating system.

This document does not add a competing architecture. It governs the existing control plane, payment, agent, CRM, project, QA, deployment, support, affiliate, finance and evidence systems.

## Current truth snapshot

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Latest observed HEAD: `8a18c4126192423bdd64e8a522911bb74bd0ee20`
- The latest commit synchronized canonical repository metadata with `109ecab`.
- `109ecab` adds webhook replay protection and concurrency atomicity tests.
- Previous project checkpoint: READY_FOR_STAGING / STAGING_VERIFIED.
- Not yet certified: PRODUCTION_CANDIDATE, PRODUCTION_VERIFIED, REVENUE_OPERATIONAL, AUTONOMOUS_OPERATIONAL.
- Current GitHub combined commit status for the latest observed HEAD is empty; therefore CI_GREEN is not established by this connector and must not be assumed.
- GitHub still contains overlapping P0 issues. Issue #62 is the consolidation contract and should be treated as the primary remaining execution gate; older issues remain historical evidence until their work is explicitly reconciled/closed.

## Non-negotiable safety contract

1. Never claim production success without runtime evidence.
2. Never weaken a failing test merely to obtain green CI.
3. Never use a browser callback as payment authority.
4. Never trust client-provided amount, currency, service, package, discount, commission or payment status.
5. Never expose Supabase service-role or provider secrets to the browser.
6. Never reset/drop/rebuild production data to simplify implementation.
7. Never remove working UI, routes, tabs, buttons, forms or information architecture merely to pass a backend test.
8. Never give agents unrestricted authority.
9. Never fabricate customers, orders, payments, revenue, testimonials, uptime, provider receipts or deployment proof.
10. Any unavailable provider must be `NOT_CONFIGURED` or `BLOCKED`, not synthetic success.

## Certification state machine

`NOT_READY -> READY_FOR_STAGING -> STAGING_VERIFIED -> PRODUCTION_CANDIDATE -> PRODUCTION_VERIFIED -> REVENUE_OPERATIONAL -> AUTONOMOUS_OPERATIONAL`

Higher states are prohibited unless every lower state is proven with objective evidence.

## Execution gates

### G0 — CI truth and failure observability
- Split payment, security, lifecycle, UI/browser and production-boundary tests into independently observable jobs.
- Store exact failing assertion/file/line and machine-readable results.
- Require newly added payment/FX/idempotency/concurrency tests in CI.
- Reproduce every failure locally or in a deterministic CI reproduction job.
- Make the workflow fail closed.
- Freeze a green baseline only after all mandatory jobs are green.

### G1 — Catalog and money authority
- `ibos_services` is the canonical service registry.
- Resolve published service/package on the server.
- Implement DB-backed coupons with atomic redemption and usage limits.
- Use minor-unit money internally for every monetary operation.
- Centralize currency conversion/rounding policy.
- Reject tampered price, package, service and coupon values.

### G2 — Idempotency and concurrency
- Bind every mutating request to an idempotency key and deterministic request fingerprint.
- Same key + same payload must be replay-safe.
- Same key + different payload must be rejected.
- Prove duplicate checkout, concurrent checkout, worker retry, duplicate webhook and timeout-then-retry behavior.
- Guarantee one authoritative business effect.

### G3 — Payment correctness
- Canonical server-enforced state machine.
- Provider-specific checkout/session creation.
- Provider-specific webhook validation.
- SSLCommerz native validation where enabled.
- Verify transaction identifier, service/order identity, amount and currency.
- Handle risk states safely.
- Maintain immutable webhook/event receipts and replay protection.
- Implement refund lifecycle and provider evidence.
- Reconcile provider truth with internal truth.

### G4 — Finance integrity
- Immutable double-entry ledger.
- Payment settlement entries.
- Fees/FX/refund/commission entries.
- Balance invariants.
- Reconciliation queue.
- No silent financial edits.

### G5 — Security and tenant isolation
- Actor/resource/action authorization matrix.
- Behavioral RLS tests for SELECT/INSERT/UPDATE/DELETE.
- Validate `USING` and `WITH CHECK` semantics.
- Audit SECURITY DEFINER functions, views and grants.
- Audit storage policies.
- Test cross-tenant access and forged identifiers.
- Test stale and forged approval tokens.
- Test prompt injection, tool escalation and secret exfiltration.

### G6 — Runtime/source parity
- Prove the actual Cloudflare production source repository and branch.
- Prove Git SHA -> build SHA -> deploy SHA -> runtime `/api/version` SHA.
- Prove runtime Supabase project identity.
- Generate release metadata from CI.
- Block release on mismatch.

### G7 — Browser/UI certification
- Treat current UI as a protected regression baseline.
- Execute browser tests for all major public and authenticated surfaces.
- Cover routes, navigation, buttons, tabs, forms, modals, chat, marketplace, blueprints, affiliate, portal, admin, calculators and interactive tools.
- Cover loading, error, empty, retry and reconnect states.
- Desktop and mobile.
- Keyboard/focus/accessibility and reduced-motion checks.
- No critical console or network errors.

### G8 — Real customer and sales lifecycle
- Real chat/session identity.
- Context-aware qualification.
- Canonical catalog-based service recommendation.
- Versioned proposal.
- Durable CRM opportunity.
- Explicit customer acceptance state.
- No unauthorized commitment or pricing.

### G9 — Project factory
- Verified/authorized order -> project.
- Requirements -> architecture -> task DAG.
- Sandbox execution.
- Artifact provenance and hashes.
- Independent QA.
- Preview.
- Customer approval/change-request loop.

### G10 — Agentic workforce
Every agent must have:
- identity/version
- role
- skills
- allowed tools
- forbidden tools
- risk class
- budget
- memory scope
- escalation rules
- verification contract

Execution loop:
`observe -> reason -> plan -> delegate -> execute -> verify -> recover -> remember -> learn`

Agents must operate through the canonical mission/tool/policy/evidence spine.

### G11 — Quality and evidence
- Trace IDs across customer/session/mission/task/agent/tool/provider/artifact/QA/delivery.
- Evidence graph for consequential operations.
- Independent verification.
- Evaluation benchmarks for models/prompts/policies.
- Regression gate for critical workflows.
- Cost/quality telemetry.
- Privacy-safe logging.

### G12 — Deployment, SRE and recovery
- Preview -> approval -> deploy.
- Safe migration procedure.
- Health and smoke tests.
- Rollback drill.
- Backup/restore drill.
- Retry/backoff/circuit-breaker.
- Dead-letter handling.
- Incident lifecycle.
- Kill switches.
- Safe autonomous remediation only within bounded blast radius.

### G13 — Support and renewal
- Distinguish bug/incident/change/question.
- Use customer/project context.
- Safe remediation + verification.
- Customer confirmation.
- Evidence-backed renewal/maintenance/expansion suggestions.

### G14 — Affiliate, marketing and growth
- Real attribution from click to conversion.
- Fraud/abuse detection.
- Commission eligibility rules.
- Payout hold and approval.
- Marketing publication only with verified provider credentials and compliance settings.
- Closed-loop measurement from impression -> click -> lead -> sale -> revenue.

### G15 — Golden E2E

Before live payment activation, prove:

`real/safe test customer input -> real agent -> qualification -> proposal -> CRM -> authorized test/manual order -> mission -> real agent work -> sandbox -> independent QA -> preview -> approval -> delivery -> support -> evidence`

No synthetic success.

### G16 — Real pilot
- Allowlisted customer cohort.
- Explicit pilot scope.
- Feature flags.
- Owner alerts.
- Kill switch.
- Full trace/evidence.
- Customer acceptance.
- Pilot review.

### G17 — Revenue operational
Only after:
- real customer
- real payment
- real order
- real project
- real delivery
- real support
- finance reconciliation
- affiliate attribution if used

### G18 — Autonomous operational
Only after Revenue Operational and the full governed operating loop is proven:
- CRM
- sales
- payment orchestration
- project factory
- engineering agents
- QA
- deployment controls
- support
- renewal
- finance
- analytics
- human override
- global kill switch

## Failure drills

Intentionally test:

- model/provider outage
- DB transient failure
- malformed provider response
- duplicate request
- duplicate webhook
- replay
- request timeout
- worker restart
- partial artifact
- stale approval
- tenant breakout attempt
- prompt injection
- malicious tool output
- budget exhaustion
- agent recursion loop
- QA rejection
- deployment failure
- rollback
- notification failure

Every drill must end in safe recovery or explicit escalation with evidence.

## Final reports

Generate and update:

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

## Completion rule

A capability is complete only when implementation, runtime execution, verification, evidence, failure behavior, security checks and regression tests all pass.

Proof > claim.

## UI protection

All backend hardening must preserve the current visual identity and information architecture. Upgrade reliability, backend connectivity, accessibility, loading/error states and performance without unnecessary redesign.
