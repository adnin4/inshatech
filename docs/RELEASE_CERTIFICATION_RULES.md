# IINSHA AI-BOS — Release Certification Rules

Production certification is evidence-gated.

## State model

`NOT_READY` → `READY_FOR_STAGING` → `READY_FOR_PILOT` → `PRODUCTION_READY`

## Required production evidence

A release may be called `PRODUCTION_READY` only when all required domains are independently verified:

1. GitHub release SHA identified and reviewed.
2. Cloudflare successful deployment for the same SHA.
3. Live `/api/version` reports the actual deployed SHA.
4. Expected release SHA is explicitly configured and matches the deployed SHA.
5. Supabase canonical and runtime project identities match.
6. Supabase RLS, grants, policies and privileged functions are reviewed.
7. Critical browser journeys pass against the deployed build.
8. AI model responses remain distinct from business execution.
9. Any consequential side effect has durable mission/execution evidence.
10. Payment is not marked successful without provider-side transaction and reconciliation evidence.
11. Notification delivery is not marked successful without provider/provider-acceptance evidence.
12. Rollback procedure and recovery evidence are documented.

## Non-evidence

The following are never sufficient by themselves:

- a source file existing
- a local script passing
- a static DOM test
- a generated ID
- a timestamp
- a hash
- HTTP 200
- an internal order row
- a mock provider response
- a simulated webhook
- a checkout URL

## Release rule

When evidence is missing, keep the capability fail-closed and classify the release at the highest state actually supported by evidence.

Do not modify UI/UX merely to satisfy certification wording.
