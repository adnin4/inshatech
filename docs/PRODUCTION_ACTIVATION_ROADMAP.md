# IINSHA AI-BOS — Production Activation Roadmap

Status: `READY_FOR_STAGING` / `STAGING_VERIFIED` / `PRODUCTION_VERIFIED = FALSE`

Canonical repository: `adnin4/inshatech`
Canonical branch: `master`
Canonical Supabase project ref: `kitwadizsvjmuxkfewxj`

## 0. Non-negotiable operating rules

1. Preserve the existing architecture, pages, UI/UX, database, and agent foundation unless a tested defect requires a minimal change.
2. Never treat CI green as production proof.
3. Never fabricate uptime, latency, customer, payment, revenue, review, certification, provider, or deployment status.
4. Never expose Supabase service-role credentials to browser/customer code.
5. Never make the frontend authoritative for payment amounts or payment states.
6. Never allow unrestricted agent self-modification or unrestricted external side effects.
7. Every production claim must have reproducible evidence tied to a release SHA.
8. Prefer fail-closed behavior over optimistic operational status.
9. Every external side effect must be idempotent or have an explicit recovery path.
10. Expansion happens only after the core business loop is proven.

## 1. Release and deployment identity

### Objective
Prove that the code reviewed in GitHub is exactly the code serving production.

### Required evidence
- Reviewed Git SHA.
- Cloudflare production deployment SHA.
- Runtime `/api/version` SHA.
- Runtime `/api/sre/health` SHA.
- Production branch is `master`.
- Canonical repository is `https://github.com/adnin4/inshatech.git`.
- Version endpoint reports `LIVE_VERIFIED` only when release parity is proven.

### Execution
- Review and merge PR #52 only after its release policy is satisfied.
- Deploy through the configured Cloudflare Pages production path.
- Run the PR #53 post-deploy evidence gate.
- Keep production evidence red until all identity checks pass.

### Exit gate
`RELEASE_SHA == CLOUDFLARE_SHA == RUNTIME_SHA`

## 2. Runtime health and edge verification

### Endpoints
- `/api/version`
- `/api/health`
- `/api/sre/health`

### Required behavior
- `/api/version.status = LIVE_VERIFIED` only when deployment SHA and expected release SHA match and DB identity parity is verified.
- `/api/health.status = EDGE_HEALTHY`.
- `/api/sre/health.status = SRE_HEALTHY`.
- Health responses must distinguish configuration from verification.
- No hard-coded uptime or latency may be presented as measured telemetry.

### Failure states
- Endpoint unreachable.
- Incorrect SHA.
- Incorrect branch.
- Incorrect repository.
- Missing runtime DB identity.
- DB identity mismatch.
- Runtime health unverified.

Any of these keeps `PRODUCTION_VERIFIED = FALSE`.

## 3. Supabase runtime identity

### Objective
Prove the production runtime is actually connected to canonical project `kitwadizsvjmuxkfewxj`.

### Required evidence
- Runtime project ref equals canonical project ref.
- Runtime database health is independently verified.
- Runtime can execute its required database read/write operations.
- No service-role secret appears in client-delivered assets.

### Database baseline already observed
- PostgreSQL 17.6.
- Public-schema tables: 110.
- RLS enabled: 110/110.
- RLS disabled: 0.

### Remaining work
- Runtime DB identity probe.
- Runtime DB health probe.
- Connection failure/retry behavior.
- Authorization tests against actual authenticated identities.

## 4. Database authorization and tenant isolation

### Audit surface
- Tables.
- Views.
- Functions.
- SECURITY DEFINER functions.
- Function EXECUTE privileges.
- Sequences.
- Storage policies.
- Grants for `anon`, `authenticated`, and service-side roles.

### Required tests
1. Anonymous user cannot access private tenant data.
2. User A cannot read user B private records.
3. Tenant A cannot read tenant B records.
4. User A cannot update/delete tenant B data.
5. Customer cannot access admin-only data.
6. Affiliate cannot access customer/private business data.
7. Agent cannot invoke forbidden tools.
8. Service role is never exposed to the browser.
9. Storage objects follow the same tenant boundary.
10. Views do not unintentionally bypass RLS.
11. UPDATE policies have both intended `USING` and `WITH CHECK` semantics.

### Performance
- Index columns referenced by common RLS policies.
- Prefer cached statement-level auth helpers where safe.
- Avoid unnecessary joins inside policies.
- Add explicit role targets to policies.
- Measure before and after changes.

No blanket grant or policy rewrite should be applied without evidence.

## 5. Authentication and authorization certification

### Personas
- Anonymous.
- Authenticated customer.
- Affiliate.
- Business/admin.
- Agent.
- Service-side execution context.

### Test matrix
For each protected surface:
- Access allowed when authorized.
- Access rejected when unauthorized.
- Session expiry is handled.
- Deep links do not bypass guards.
- Direct API calls cannot bypass UI authorization.
- Tenant selection is server-authoritative.
- Role changes take effect safely.

### Security result
Produce an evidence record for every tested persona/route/action combination.

## 6. Public truth and content integrity

### Remove or qualify unsupported claims
- Operational status claims without runtime proof.
- Exact uptime percentages without telemetry.
- Exact success percentages without measured source.
- “Cloudflare bypass” wording.
- “Stealth scraping” wording that implies evasion.
- Fake/illustrative client testimonials presented as real.
- Fake revenue, customer, delivery, certification, or review claims.
- Outdated model/version/vendor claims.

### Preferred positioning
Use evidence-based language such as:
- Evidence-Gated AI Engineering Studio.
- Resilient, policy-compliant browser automation.
- Evidence-backed data pipeline.
- Measured success rate varies by target and conditions.

## 7. Telemetry provenance

Every live metric shown to users must have:
- metric name.
- measured value.
- measurement timestamp.
- source/system.
- environment.
- release/runtime identity where applicable.
- aggregation window.

Synthetic defaults must never be rendered as live measurements.

## 8. Payment activation

Activate exactly one provider first.

### Provider state machine
`NOT_CONFIGURED`
→ `CONFIGURED`
→ `CONNECTION_TESTED`
→ `SANDBOX_VERIFIED`
→ `LIVE_VERIFIED`

### Required payment flow
1. Customer selects product/service.
2. Server determines authoritative amount.
3. Checkout session is created.
4. Provider processes payment.
5. Signed webhook is verified.
6. Webhook is deduplicated/idempotent.
7. Durable payment event is recorded.
8. Order/payment state is reconciled.
9. Customer sees the server-confirmed state.
10. Refund path is available and tested.

### Adversarial webhook tests
- Duplicate event.
- Invalid signature.
- Replay attack.
- Delayed event.
- Out-of-order event.
- Malformed payload.
- Provider timeout.
- Partial internal failure.

No live payment activation before sandbox proof.

## 9. CRM and sales lifecycle

Canonical lifecycle:

`Lead`
→ `Qualified`
→ `Opportunity`
→ `Proposal`
→ `Negotiation`
→ `Won`
→ `Order`

Required evidence:
- lead identity.
- attribution/source.
- qualification event.
- proposal version.
- commercial terms.
- order creation.
- payment linkage.

## 10. Customer project factory

After a paid order:

`Paid Order`
→ `Requirements`
→ `Architecture`
→ `Task DAG`
→ `Agent Assignment`
→ `Sandbox`
→ `Development`
→ `Automated QA`
→ `Independent QA`
→ `Preview`
→ `Client Review`
→ `Approval / Changes Requested`
→ `Revision`
→ `Deployment`
→ `Delivery Receipt`

Every stage must be durable, traceable, retry-safe, and attributable to an actor/system.

## 11. Client acceptance

States:
- `PREVIEW`
- `REVIEW`
- `APPROVED`
- `CHANGES_REQUESTED`

Required controls:
- immutable approval evidence.
- revision linkage.
- preview artifact identity.
- approver identity.
- timestamp.
- release/project linkage.

## 12. Support and renewal

Implement measurable service lifecycle:
- support request.
- priority/severity.
- SLA target.
- assignment.
- investigation.
- resolution.
- customer communication.
- closure.
- renewal opportunity.

No SLA claim should be published until measured.

## 13. Affiliate system

Canonical lifecycle:

`Referral Click`
→ `Attribution`
→ `Lead`
→ `Sale`
→ `Paid Order`
→ `Commission`
→ `Fraud Check`
→ `Payout`

Required controls:
- attribution window.
- duplicate referral detection.
- self-referral prevention.
- commission status state machine.
- payout hold/release rules.
- audit trail.

## 14. Agent OS governance

### Permission model
Every agent/tool combination must have:
- allowed tools.
- forbidden tools.
- resource budget.
- environment boundary.
- data boundary.
- approval requirement.
- side-effect policy.

### Side-effect classes
- Read-only.
- Internal write.
- External communication.
- Financial operation.
- Deployment.
- Irreversible/high-impact action.

Higher-risk classes require stronger evidence and approval.

## 15. Budget and cost governance

Budgets should exist at:
- request.
- agent.
- project.
- customer.
- daily.
- monthly.

Actions:
- warning.
- throttle.
- pause.
- manual review.

Track model/provider/tool cost with provenance.

## 16. Kill switches

Test independently:
- system pause.
- sales pause.
- marketing pause.
- payouts pause.
- external-tool pause.
- agent execution pause.
- deployment pause.

When paused, prohibited side effects must actually fail closed.

## 17. AI learning and model promotion

Never allow unrestricted self-modification.

Controlled loop:

`Experience`
→ `Learning Candidate`
→ `Benchmark`
→ `Regression Test`
→ `Approval`
→ `Canary`
→ `Production Promotion`

Every promotion stores:
- candidate identity.
- benchmark result.
- regression result.
- approver.
- canary result.
- rollback target.

## 18. Observability

Trace the business chain:

`Customer`
→ `Session`
→ `Mission`
→ `Task`
→ `Agent`
→ `Tool`
→ `Provider`
→ `Artifact`
→ `QA`
→ `Delivery`

Required measurements:
- latency.
- errors.
- retries.
- provider failures.
- queue time.
- cost.
- task outcomes.

No synthetic telemetry in the live dashboard.

## 19. Reliability engineering

Test:
- timeout.
- retry.
- exponential backoff.
- circuit breaker.
- dead-letter handling.
- manual recovery.
- idempotent side effects.
- duplicate request handling.
- partial provider failure.
- database connection failure.

Every failure mode must have an observable terminal state.

## 20. Backup and disaster recovery

Process:

`Backup`
→ `Restore`
→ `Integrity Check`
→ `Reconnect`
→ `Application Smoke Test`

Record:
- backup timestamp.
- restore timestamp.
- RPO.
- RTO.
- data integrity result.
- application reconnect result.

Storage objects must be included in the disaster-recovery plan where applicable; database backup alone is not sufficient for object storage recovery.

## 21. Rollback certification

Procedure:
1. Identify known-good release.
2. Capture current evidence.
3. Perform controlled failure in non-production/staging.
4. Roll back.
5. Verify runtime SHA.
6. Verify API health.
7. Verify browser smoke.
8. Verify database compatibility.
9. Record recovery time.

Rollback must be rehearsed before declaring production-ready.

## 22. Browser and UI/UX certification

Preserve current visual baseline.

Test:
- desktop.
- mobile.
- keyboard navigation.
- focus order.
- modals.
- forms.
- buttons.
- deep links.
- auth redirects.
- loading states.
- empty states.
- error states.
- offline/timeout behavior.
- console errors.
- network errors.

Classify every interaction:
- A = navigation.
- B = client-only interaction.
- C = backend interaction.
- D = external side effect.

Each D interaction requires explicit side-effect evidence.

## 23. API contract certification

For each critical endpoint capture:
- method.
- route.
- auth requirement.
- request schema.
- response schema.
- expected statuses.
- retry semantics.
- idempotency behavior.
- audit evidence.

Test both valid and invalid payloads.

## 24. Deployment governance

Recommended repository controls:
- `master` protected.
- PR required.
- required status checks.
- review required.
- force-push disabled.
- production deployment restricted to reviewed commits.
- deployment identity recorded.

PRs must be small, reversible, and evidence-backed.

## 25. Evidence ledger

Create one release evidence record containing:
- release_id.
- reviewed_git_sha.
- Cloudflare deployment SHA.
- runtime SHA.
- production URL.
- runtime DB project ref.
- canonical DB project ref.
- DB parity result.
- API version result.
- API health result.
- SRE result.
- browser certification.
- auth certification.
- RLS certification.
- payment certification.
- webhook certification.
- customer/order certification.
- project-delivery certification.
- affiliate certification where active.
- backup/restore certification.
- rollback certification.
- production verification decision.

## 26. Certification ladder

`NOT_READY`
→ `READY_FOR_STAGING`
→ `STAGING_VERIFIED`
→ `PRODUCTION_CANDIDATE`
→ `PRODUCTION_VERIFIED`

Promotion requires evidence, not intention.

## 27. Activation order

### Gate A — Release truth
- PR #52 reviewed.
- All release-truth gates green.

### Gate B — Production runtime
- production deploy exists.
- exact SHA parity.
- `/api/version` verified.
- `/api/health` verified.
- `/api/sre/health` verified.

### Gate C — Database/security
- runtime DB identity.
- RLS/grants audit.
- auth/persona tests.
- tenant isolation.

### Gate D — Payment
- one provider.
- sandbox transaction.
- signed webhook.
- reconciliation.
- refund.

### Gate E — One real business loop
- real lead.
- real opportunity.
- real proposal.
- real order.
- real payment.
- real project.
- real QA.
- real preview.
- real approval.
- real delivery.

### Gate F — Reliability
- observability.
- budgets.
- kill switches.
- retry/recovery.
- backup/restore.
- rollback.

### Gate G — Expansion
Only after A–F:
- affiliate growth.
- marketing automation.
- controlled AI learning.
- canary promotion.
- broader autonomous operations.

## 28. Current blockers

The repository is not yet allowed to claim `PRODUCTION_VERIFIED` because external production evidence is incomplete.

Primary blockers:
1. Actual Cloudflare production runtime identity.
2. Live `/api/version`, `/api/health`, `/api/sre/health` evidence.
3. Runtime Supabase project identity and health proof.
4. Real authenticated tenant-isolation testing.
5. Payment-provider configuration and transaction proof.
6. Real customer/order/project/delivery evidence.
7. Backup/restore proof.
8. Rollback proof.

These blockers cannot honestly be fabricated or inferred from repository code alone.

## 29. Definition of done

The platform is considered production-verified only when:

- reviewed code SHA equals production runtime SHA;
- production APIs are reachable and healthy;
- runtime database identity matches canonical database;
- authorization and tenant isolation are proven;
- payment flow is verified end-to-end;
- at least one real customer business loop completes;
- delivery and approval evidence exists;
- reliability controls are tested;
- backup and restore are tested;
- rollback is tested;
- evidence is reproducible;
- no unsupported public claims remain;
- `PRODUCTION_VERIFIED = TRUE` is justified by the evidence ledger.

## 30. Execution principle

**Proof before expansion.**

Do not add more surface area while an earlier layer is unverified. Fix the smallest root cause, rerun the same proof, record the evidence, and only then promote the system to the next certification state.
