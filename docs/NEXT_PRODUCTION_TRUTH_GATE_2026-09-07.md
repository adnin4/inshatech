# IINSHA AI-BOS — Next Production Truth Gate

Date: 2026-09-07

## Current verified repository state

- Canonical engineering repository: `adnin4/inshatech`
- Branch: `master`
- Latest observed master: `091332fc19c539f2219c2c2ac4b01335c183430a`
- Wave-4 fail-closed production adapter boundary is already merged into master.
- There are currently no open pull requests returned by the connected GitHub account.

## What is improved

1. `functions/api/version.js` no longer hard-codes a Supabase project ref or `ACTIVE_HEALTHY` runtime state.
2. `/api/version` now reports `UNVERIFIED`, `IDENTITY_VERIFIED_HEALTH_UNVERIFIED`, or `MISMATCH` unless runtime configuration provides enough evidence.
3. `/api/version` only reports `LIVE_VERIFIED` when deployed SHA and expected release SHA actually match.
4. CORS for Pages preview origins is constrained to the `*.inshatech.pages.dev` namespace rather than every `*.pages.dev` origin.

## Current production truth blockers

### P0 — Live deployment source/parity

Must still verify externally:

- Cloudflare Pages project source is `adnin4/inshatech`.
- Production branch is `master`.
- Deployed production SHA equals the intended release SHA.
- `/api/version` from the live environment returns the exact deployed SHA.

No `LIVE_VERIFIED` deployment claim without all four.

### P0 — Supabase runtime identity/health

The connected Supabase project previously discovered by tooling was `inshatech-db` with ref `kitwadizsvjmuxkfewxj`, but it was observed inactive and database inspection timed out. This repository must not infer database health from configuration alone.

Required:

- canonical ref resolved;
- runtime ref resolved;
- runtime connectivity verified;
- schema/migrations verified;
- RLS/policies verified;
- security advisors clean or explicitly triaged.

### P0 — `/api/v1/agent/chat` execution truth

Current code does real Gemini inference when a Gemini credential is present, but the endpoint still creates local session/mission IDs and returns a top-level `SUCCESS` response plus cryptographic hashes without proving a persisted mission/evidence record. The deterministic fallback path is also not a real production execution path.

Required next implementation:

- separate `response_generated` from `mission_executed`;
- do not label model-only responses `LIVE_VERIFIED`;
- persist mission/session/evidence only through the canonical runtime/database path when configured;
- return `NOT_CONFIGURED` / `UNVERIFIED` for missing persistence/runtime capability;
- preserve the existing frontend response fields where possible to avoid UI regression.

### P0 — Public content truth

The live site previously exposed unsupported/high-risk wording including stealth/bypass claims, simulated scraper output, and operational availability statements. The deployable canonical HTML must be rescanned after each release and must not advertise an unverified capability as live.

### P0 — Payment truth

Payment capability remains blocked until one provider has:

- real checkout/session creation;
- provider-specific webhook verification;
- authoritative amount/currency mapping;
- idempotency and replay protection;
- a real low-value transaction;
- failure/refund reconciliation evidence.

## Required verification order

1. Verify Cloudflare source + production branch.
2. Deploy the current release through the canonical pipeline.
3. Probe live `/api/version` and `/api/sre/health`.
4. Resolve Supabase canonical/runtime identity and verify connectivity + RLS.
5. Fix `/api/v1/agent/chat` semantic status/evidence model.
6. Run full public route/interaction/browser regression tests.
7. Run provider/payment verification only after infrastructure truth is green.
8. Run controlled pilot lifecycle without claiming payment until payment evidence exists.
9. Produce final production readiness scorecard from evidence only.

## Release rule

Do not merge this branch into `master` until the CI suite is green and the changed version endpoint has been statically reviewed. Do not mark production ready from source-only evidence.

## Evidence labels

Use only:

- `VERIFIED`
- `IMPLEMENTED`
- `PARTIAL`
- `NOT_CONFIGURED`
- `UNVERIFIED`
- `BLOCKED`
- `FAILED`

Never replace missing external evidence with a generated timestamp, synthetic receipt, hard-coded health state, or successful function return.
