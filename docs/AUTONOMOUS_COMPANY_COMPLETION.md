# IINSHA AI-BOS — Autonomous Company Completion Milestone

## Scope

This milestone adds a governed, persistent post-acquisition lifecycle:

`Qualified Opportunity → Proposal → Acceptance → Verified Payment → Project → Planning → Execution → Independent QA → Client Review → Owner-Governed Delivery → Support → Renewal → Verified Learning Candidate → Approved Skill`

## Implemented

- Persistent CRM opportunity and proposal records.
- Idempotent payment event records and duplicate-event handling.
- Project/task/delivery persistence.
- Client acceptance state.
- Owner approval gate for production delivery.
- Support and renewal records.
- Learning candidate → benchmark → approval lifecycle.
- Canonical autonomous business event records.
- RLS enabled on new sensitive tables; tenant/role policies are intentionally left to the repository's canonical authorization mapping rather than guessed in a migration.

## Safety Model

Payment must be verified before a project is created.

Production delivery requires explicit owner approval when configured.

Learning outcomes remain unverified until independently evidenced, benchmarked, and approved.

The orchestration layer performs governance decisions; external side effects must be provided through explicitly configured adapters.

## Verification

`node scratch/test_autonomous_company_completion.js` verifies:

- qualified opportunity
- proposal generation
- proposal acceptance
- paid settlement
- duplicate webhook protection
- project creation
- planning/execution
- QA confidence gate
- client approval
- production delivery approval gate
- delivery
- support
- renewal
- learning candidate
- benchmark
- skill approval
- event emission

## Production Gates Remaining

This milestone is not a claim of live payment or live customer completion.

Required external evidence before production activation:

1. Provider-specific payment webhook signature verification.
2. Real/sandbox payment transaction evidence mapped to an order.
3. Canonical Supabase tenant policies applied and adversarial isolation tests passed.
4. Project execution worker adapters connected to an isolated sandbox.
5. Real QA runner evidence.
6. Real deployment adapter with rollback evidence.
7. Customer-portal acceptance wired to the persistent delivery project state.
8. Real support/renewal notification providers configured.
9. Learning benchmark evidence from verified project outcomes.

## Status

- CODE_READY: yes
- SANDBOX_VERIFIABLE: yes
- LIVE_VERIFIED: no — external provider and production evidence required
