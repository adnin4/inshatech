# IINSHA AI-BOS — CURRENT RUNTIME TRUTH MANIFEST

**Audit date:** 2026-09-07

## Repository state

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Current master audit baseline: `4f9b7511a4f7b250cd9da6bf7ad76b78dd3317b9`
- This document records evidence boundaries, not independent proof of the live Cloudflare deployment.

## Verified boundaries

### UI / UX

The current hardening changes are limited to API truth semantics, tests and evidence documentation. No customer-facing UI redesign or page removal is included.

### AI runtime

- `/api/v1/agent/chat` is conversational and explicitly non-executing.
- Model inference is configurable through `GEMINI_MODEL`; the hardening default is `gemini-3.8-flash`.
- Deterministic fallback remains non-side-effecting.
- SHA-256 hashes identify response inputs/outputs; they do not prove a business action occurred.

### Edge runtime

- `/api/version` must read deployment SHA from Cloudflare/Git runtime variables and require explicit expected-release parity before returning `LIVE_VERIFIED`.
- `/api/health` reports edge/configuration facts only; latency, uptime and agent-count metrics require real telemetry.

### Supabase

Connected Supabase control-plane evidence on 2026-09-07:

- Project `kitwadizsvjmuxkfewxj`: `ACTIVE_HEALTHY`
- Security advisor: zero lints
- Public tables audited: 110
- RLS enabled: 110/110

Control-plane health does not prove Cloudflare runtime connectivity; those are separate evidence domains.

### Provider layer

Payment, notification, CRM, deployment and customer-impacting execution must not be labeled production-successful without provider acceptance, durable reconciliation, and suitable verification evidence.

## External evidence still required

1. Cloudflare production branch/deployment and live SHA verification.
2. Resolution of the earlier Cloudflare preview build failure reported on the hardening PR.
3. Browser-level E2E against the deployed site.
4. Provider-specific execution receipts for payments, notifications and any business side effects.
5. Runtime secret/connectivity verification for enabled integrations without exposing secret values.

## Release classification

**READY_FOR_STAGING**

Repository CI and database control-plane checks can support staging confidence; they do not alone establish production certification.
