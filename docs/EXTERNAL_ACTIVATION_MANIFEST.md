# IINSHA AI-BOS — External Activation Manifest

This manifest is the final handoff between the implemented platform and external production credentials/accounts.

## Rules
- Never commit secrets, tokens, API keys, PANs, webhook signing secrets, or customer PII.
- Every provider starts as `NOT_CONFIGURED`.
- Only an owner-approved verification can promote a provider to `LIVE_VERIFIED`.
- A provider is not live merely because an environment variable exists.

## Required provider evidence

| Provider | Required evidence before LIVE_VERIFIED |
|---|---|
| Lead source | Real prospect discovery with source trace and lawful acquisition path |
| CRM | Authenticated create/update/read round-trip |
| Email | Delivered test message plus provider event/webhook |
| WhatsApp | Provider-confirmed test message/event, if enabled |
| Stripe | Low-value real transaction, signed webhook, reconciliation, refund test |
| bKash | Low-value real transaction, signed/provider-confirmed webhook, reconciliation, refund/failure test where supported |
| Project executor | Isolated real build/test job with artifact and logs |
| AI sandbox | Sandboxed agent task with tool/permission audit |
| QA runner | Independent browser/API/security execution with stored evidence |
| Deployment | Preview, production deploy, smoke test, rollback evidence |
| Notifications | Delivered notification plus provider confirmation |
| Observability | Alert delivery plus trace/incident evidence |

## Pilot entry gate

All of the following must be true before a real customer is accepted:

- P0 = 0
- P1 release blockers = 0
- CI green on the exact release commit
- production SHA parity verified
- Supabase RLS/tenant isolation verified
- backup/restore verified
- rollback verified
- all providers used by the pilot = `LIVE_VERIFIED`
- owner approval policy enabled
- kill switch tested

## First-customer evidence package

The pilot evidence must contain one correlation/workflow ID spanning:

`LEAD → SALES → NEGOTIATION → PAYMENT → PROJECT → BUILD → QA → CLIENT_APPROVAL → DELIVERY → SUPPORT → RENEWAL → LEARNING`

Each stage must include timestamp, actor/agent, tenant, provider reference when applicable, status, and evidence reference/hash.

## Learning promotion

`Outcome → Evaluation → Candidate → Benchmark → Security Review → Owner Approval → Version → Canary → Measure → Promote/Rollback`

No production skill promotion without regression evidence.

## Final certification

`100 sectors × 10/10` is awarded only when every sector is:

`Implemented + Tested + Security Verified + Configured + Deployed + Live Exercised + Evidence Verified`

and at least one real customer completes the full lifecycle with production evidence.
