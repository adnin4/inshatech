# IINSHA AI-BOS — MASTER PRODUCTION TRUTH

**Verification date:** 2026-09-07

## Repository

- Canonical engineering repository: `adnin4/inshatech`
- Canonical branch: `master`
- Current master release head: `2d2f134b0d4e171ded75fc34e5925c70bbbb5a8b`
- This document is evidence-based and must not be treated as proof of live infrastructure by itself.

## Release lineage

- `99344cf` sealed the evidence-gated claims report.
- `eee895fe` refreshed the runtime truth and blocker register.
- `2d2f134` merged CI hardening that removes false-green secret-scan and dependency-install fallbacks.

## Important correction

Historical automated reports in this repository used words such as `100%`, `LIVE_VERIFIED`, `ACTIVE_HEALTHY`, `PAID`, and `PRODUCTION_READY` based partly on source-level or simulated execution. Those labels are not accepted as live-production evidence unless an external provider/runtime receipt or independently verifiable production record exists.

## Verified engineering improvements

- Wave-4 fail-closed adapter boundary is present in `master`.
- CRM side effects are routed through an explicit Supabase adapter rather than an in-memory production-only store.
- Production tool adapters distinguish missing configuration, provider errors, approval requirements and blocked actions.
- UI/UX regression guardians and existing static verification suites are present.
- `/api/version` and `/api/health` are hardened so missing runtime evidence cannot be converted into fabricated deployment or database claims.
- The customer-facing chat endpoint uses a current Gemini model configuration and distinguishes conversational response generation from business-side-effect execution.
- CI release gates no longer tolerate TruffleHog failure and no longer fall back from `npm ci` to `npm install`.

## External verification still required

### Cloudflare

Must independently verify:

- Pages project is connected to `adnin4/inshatech`.
- Production branch is `master`.
- Production deployment corresponds to the intended current Git commit.
- Live `/api/version` reports the actual deployed SHA.
- Live `/api/health` reports runtime facts rather than synthetic metrics.
- Live `/api/sre/health` is reachable and truthful.

Cloudflare preview deployment success is not production deployment proof.

### Supabase

Runtime project currently expected:

`kitwadizsvjmuxkfewxj`

Control-plane security baseline:

- 110 public tables
- 110/110 RLS enabled
- 0 public tables without RLS
- Security Advisor: 0 findings

Runtime database identity and live connectivity still require independent evidence.

Required before production certification:

- runtime connection
- schema/migration state
- RLS
- grants
- policies
- tenant isolation
- privileged functions
- security advisors
- auth integration

### AI runtime

A model response proves that a model generated text. It does not prove that a business mission executed.

Conversational response status and side-effect execution status must remain separate.

### Payments

No gateway is `LIVE_VERIFIED` until provider-specific checkout creation, signed webhook verification, replay/idempotency controls, reconciliation and a real controlled transaction are evidenced.

### Notifications / CRM / automation

A function call or generated identifier is not enough. Require provider acceptance, durable persistence, or an independently verifiable execution receipt.

## Current readiness classification

`READY_FOR_STAGING`

Not yet `READY_FOR_PILOT` and not yet `PRODUCTION_READY`.

## Release rule

A production release may proceed only after the changed code passes CI, the production deployment SHA is independently verified, live runtime endpoints are verified, runtime database identity is verified, and every production-facing capability label matches actual evidence.

See also:

`docs/RELEASE_CERTIFICATION_RULES.md`

`docs/PRODUCTION_RELEASE_EVIDENCE_CHECKLIST.md`
