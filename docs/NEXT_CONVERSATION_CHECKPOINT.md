# IINSHA AI-BOS — Next Conversation Checkpoint

## Identity

PROJECT: IINSHA AI-BOS
CANONICAL REPO: adnin4/inshatech
CANONICAL BRANCH: master
LATEST OBSERVED HEAD AT CHECKPOINT CREATION: 8a18c4126192423bdd64e8a522911bb74bd0ee20

## Current maturity

READY_FOR_STAGING: YES (from supplied project handoff)
STAGING_VERIFIED: YES (from supplied project handoff)
PRODUCTION_CANDIDATE: NO
PRODUCTION_VERIFIED: NO
REVENUE_OPERATIONAL: NO
AUTONOMOUS_OPERATIONAL: NO

## Recent work observed

- authoritative service/package/pricing foundations
- coupon policy + discount cap
- authoritative FX policy + order metadata
- payment state machine
- webhook state integration
- provider redirect reuse
- browser return hardening
- finance reconciliation boundary
- security evidence architecture
- webhook replay/concurrency test coverage
- canonical system-state synchronization
- Supabase Security Advisor previously reported zero lints

## Current top blockers

1. CI evidence and fully green mandatory CI baseline.
2. Atomic coupon DB redemption and monetary minor-unit model.
3. Idempotency request fingerprint + concurrency proof.
4. SSLCommerz/provider-native validation and sandbox evidence.
5. Webhook replay/event ledger + refund lifecycle + reconciliation.
6. Double-entry finance certification.
7. Behavioral RLS, grants, SECURITY DEFINER, view and storage audits.
8. Cloudflare source/deploy/runtime SHA parity.
9. Production browser E2E and UI regression proof.
10. CRM/sales/proposal production workflow.
11. Project Factory + sandbox developer + independent QA.
12. Agent governance/evaluation/evidence and safe autonomy.
13. Deployment/rollback/DR/SRE.
14. Real customer pilot.
15. Live payment and real revenue proof.

## Immediate command

Do not create another architecture layer.

Execute:

CI failure evidence
→ root-cause fix
→ green baseline
→ freeze
→ catalog/pricing/coupon
→ idempotency/concurrency
→ payment validation
→ finance
→ security
→ Cloudflare/runtime parity
→ browser certification
→ CRM/sales
→ Project Factory
→ governed agent workforce
→ QA/deployment/support
→ golden E2E
→ real pilot
→ live payment
→ revenue certification
→ governed autonomy

## Truth rules

- proof > claim
- no fake payment
- no fake revenue
- no fake customer
- no fake evidence
- no browser-authoritative payment
- no client-authoritative amount/coupon/commission
- no unrestricted AI permissions
- no destructive DB rebuild
- no CI bypass
- no unnecessary UI redesign

## UI safety

Preserve existing visual identity, routes, pages, buttons, tabs, forms, cards and navigation. Any change must pass desktop and mobile smoke plus backend/API compatibility tests.

## Certification model

NOT_READY
→ READY_FOR_STAGING
→ STAGING_VERIFIED
→ PRODUCTION_CANDIDATE
→ PRODUCTION_VERIFIED
→ REVENUE_OPERATIONAL
→ AUTONOMOUS_OPERATIONAL

Never promote status without evidence for every prerequisite.
