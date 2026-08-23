# IINSHA AI-BOS — Final Real-World Activation Playbook

## Purpose

This document is the final operational bridge from implemented/verified platform capability to evidence-backed real-world operation.

The platform must never mark a stage `LIVE_VERIFIED` without the corresponding external evidence.

## A. Provider Activation Matrix

| Integration | Required state before pilot | Evidence |
|---|---|---|
| Lead source | `LIVE_VERIFIED` | real prospect discovery + source trace |
| CRM | `LIVE_VERIFIED` | create/update/read round-trip |
| Email | `LIVE_VERIFIED` | delivered test message + provider event |
| WhatsApp (optional) | `LIVE_VERIFIED` | provider-confirmed test event |
| Stripe/bKash | `LIVE_VERIFIED` | real transaction + verified webhook + reconciliation |
| Project executor | `LIVE_VERIFIED` | isolated build/test job |
| Browser/API QA | `LIVE_VERIFIED` | independent test evidence |
| Deployment | `LIVE_VERIFIED` | preview + production deployment + rollback evidence |
| Notifications | `LIVE_VERIFIED` | delivery evidence |
| Observability | `LIVE_VERIFIED` | alert + trace + incident evidence |

## B. Owner-Controlled Activation Rules

1. Outbound remains disabled until the owner enables the provider and campaign policy.
2. Live payment remains disabled until merchant credentials, webhook verification, and reconciliation tests pass.
3. Production deployment requires owner approval by default.
4. AI learning candidates cannot become trusted skills without benchmark + approval.
5. Provider absence must remain `NOT_CONFIGURED`.
6. Kill switch must stop autonomous external side effects.

## C. Pilot Gate

Before accepting a real customer:

- all P0 security issues = 0
- all P1 release blockers = 0
- Supabase Security Advisor = clean
- CI/regression = green
- backup/restore = verified
- rollback = verified
- live integrations used by the pilot = `LIVE_VERIFIED`
- owner approval enabled

## D. First-Customer End-to-End Evidence

A pilot is considered successful only when all stages below have evidence IDs:

`REAL_LEAD → REAL_SALE → REAL_NEGOTIATION → REAL_PAYMENT → REAL_PROJECT → REAL_BUILD → REAL_QA → REAL_CLIENT_APPROVAL → REAL_DELIVERY → REAL_SUPPORT → REAL_RENEWAL → REAL_LEARNING`

Each stage must record:

- timestamp
- actor/agent
- organization/tenant
- correlation/workflow ID
- external provider reference where applicable
- evidence URI/hash where applicable
- final status

## E. Learning Verification

A production outcome becomes learning only after:

`Outcome → Evaluation → Candidate → Benchmark → Approval → Version → Canary → Measure`

Regression must block skill promotion.

## F. Launch Decision

Global launch is allowed only when:

- one canonical production branch exists
- CI/build/deploy/live SHA parity is proven
- every required integration is `LIVE_VERIFIED`
- pilot lifecycle is successfully evidenced
- rollback is proven
- no P0/P1 blockers remain
- final mission evidence matrix is complete

## G. Final Business Loop

`REAL LEAD → REAL SALE → REAL PAYMENT → REAL PROJECT → REAL BUILD → REAL QA → REAL DELIVERY → REAL SUPPORT → REAL RENEWAL → REAL LEARNING → BETTER AGENT → REAL NEW BUSINESS`
