# IINSHA AI-BOS — CURRENT RUNTIME TRUTH MANIFEST

**Audit date:** 2026-09-07

## Repository state

- Canonical repository: `adnin4/inshatech`
- Canonical branch: `master`
- Current master audit baseline: `2d2f134b0d4e171ded75fc34e5925c70bbbb5a8b`
- Main branch lockstep parity: `2d2f134b0d4e171ded75fc34e5925c70bbbb5a8b`
- This document records evidence boundaries, not independent proof of the live Cloudflare production deployment.

## Verified boundaries

### UI / UX (Protected Freeze)

The current hardening changes are strictly limited to API truth semantics, functions import fixes, Node.js runtime compatibility, test automation, and evidence documentation. No customer-facing UI redesign, styling change, or page removal is included. All 22 content sections, 3D Hero canvas, dark glassmorphism, and modal structures remain 100% intact.

### AI runtime

- `/api/v1/agent/chat` is conversational and explicitly non-executing (`RESPONSE_ONLY`, `NOT_EXECUTED`).
- Model inference is configurable through `GEMINI_MODEL`; the authoritative default is `gemini-3.8-flash`.
- Deterministic fallback remains non-side-effecting.
- SHA-256 hashes identify response inputs/outputs; they do not prove a business action occurred.

### Edge runtime & Cloudflare Build

- Cloudflare Pages Functions bundler import paths and `nodejs_compat` configuration verified working via PR #48 preview deployment (`dfef0d5` -> `Deploy successful`).
- `/api/version` reads deployment SHA from Cloudflare/Git runtime variables and requires explicit expected-release parity before returning `LIVE_VERIFIED`.
- `/api/health` reports edge/configuration facts only; latency, uptime and agent-count metrics require real measured telemetry.

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

1. Cloudflare production deployment SHA verification on canonical domain `inshatech.pages.dev` (Issue #49 target: `2d2f134`).
2. Live `/api/version` and `/api/health` parity check against `2d2f134b0d4e171ded75fc34e5925c70bbbb5a8b`.
3. Browser-level E2E against the deployed site.
4. Provider-specific execution receipts for payments, notifications and any business side effects.
5. Runtime secret/connectivity verification for enabled integrations without exposing secret values in source code.

## Release classification

**READY_FOR_STAGING**

Repository CI and database control-plane checks support staging confidence; they do not alone establish production certification until live edge SHA parity is verified.
