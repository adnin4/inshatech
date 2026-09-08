# IINSHA AI-BOS — Production Readiness Master Index

## Current truth

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Latest observed repository HEAD: `8a18c4126192423bdd64e8a522911bb74bd0ee20`
- Latest observed commits include webhook replay/concurrency test coverage (`109ecab...`) followed by canonical-state synchronization (`8a18c412...`).
- The project checkpoint supplied for this review still classifies the system as READY_FOR_STAGING / STAGING_VERIFIED, not production-certified.
- GitHub issue #62 is the primary consolidation contract for remaining pre-pilot work.
- GitHub issue #54 remains a strong runtime evidence checklist.
- Older P0 issues remain useful evidence/history until the work they represent is explicitly reconciled.
- Latest connector read of combined commit status for `8a18c412...` returned no statuses; therefore CI_GREEN is not independently established by that response.

## Verified strengths from project handoff

- service/package authority foundation
- coupon policy engine and discount cap
- authoritative FX policy
- FX metadata captured with orders
- canonical payment state machine
- webhook state integration
- provider redirect reuse
- browser return hardening
- finance reconciliation boundary
- security gate evidence architecture
- Supabase security advisor previously reported zero lints
- 10 published services previously verified
- broad AI-BOS control-plane foundation for CRM, projects, agents, QA, deployment, support, observability and learning

## Remaining certification blockers

### Release/CI
- exact CI failure evidence
- all mandatory jobs green
- branch/release protection
- immutable release metadata

### Commercial/payment
- atomic DB-backed coupon redemption
- request fingerprint + idempotency semantics
- concurrency certification
- payment provider-specific validation
- webhook replay/event ledger
- refund lifecycle
- reconciliation
- double-entry finance

### Security
- behavioral RLS tests
- grants and policy matrix
- SECURITY DEFINER audit
- views/function privileges
- storage policy audit
- secret isolation
- agent/tool authorization and replay testing

### Deployment/runtime
- prove Cloudflare production source and branch
- Git SHA == build SHA == deploy SHA == runtime SHA
- runtime Supabase identity
- production browser proof
- rollback proof

### Business operation
- CRM lifecycle
- governed sales/proposal
- project factory
- sandboxed engineering
- independent QA
- deployment controls
- support/renewal
- affiliate/growth
- customer pilot
- live payment and real revenue evidence

## Final certification ladder

`NOT_READY`
→ `READY_FOR_STAGING`
→ `STAGING_VERIFIED`
→ `PRODUCTION_CANDIDATE`
→ `PRODUCTION_VERIFIED`
→ `REVENUE_OPERATIONAL`
→ `AUTONOMOUS_OPERATIONAL`

No status may skip a predecessor.

## Permanent UI safety rule

The current website is a protected surface. Backend hardening must preserve existing routes, pages, navigation, cards, tabs, forms, buttons, visual identity and information architecture. Add only truthful runtime states, accessibility, loading/error/retry handling, performance improvements and real backend connectivity.

## Permanent truth rule

`PROOF > CLAIM`.

Production claims require real provider/runtime evidence. Missing providers are `NOT_CONFIGURED` or `BLOCKED`, never synthetic success.

## Next execution order

1. CI root-cause closure and green baseline.
2. Catalog/pricing/coupon final certification.
3. Minor-unit money and idempotency/concurrency.
4. Payment provider verification, replay protection, refunds and reconciliation.
5. Double-entry finance.
6. Behavioral RLS/auth/security certification.
7. Cloudflare source/deploy/runtime parity.
8. Production browser/UI certification.
9. CRM and governed sales.
10. Project factory + engineering sandbox + independent QA.
11. Agent governance, evaluation and evidence.
12. Deployment/rollback/DR/SRE.
13. Support/renewal + affiliate/marketing.
14. Payment-independent golden E2E.
15. Real pilot.
16. Live payment and revenue certification.
17. Governed autonomous operation.

## Do not do

- do not add feature families merely for feature count
- do not create competing workflow engines
- do not bypass CI
- do not weaken security tests
- do not rebuild/drop production DB
- do not expose privileged keys
- do not grant unrestricted agent authority
- do not claim live payment/revenue without real evidence
- do not redesign the entire UI while fixing backend issues
