# Release Truth Matrix & Cryptographic Parity Contract

**Standard Version:** 2026.11.03  
**Governing Modules:** `functions/_shared/release_identity.js`, `functions/_shared/database_probe.js`, `functions/api/version.js`

---

## 1. Release Identity Classifications

| Classification | Verification Trigger | Required Invariants | Failure Fallback |
| :--- | :--- | :--- | :--- |
| **`SOURCE_VERIFIED`** | Source code checked out in CI | Full 40-char SHA-1 / 64-char SHA-256 matching repository HEAD. Not a synthetic merge commit. | `UNVERIFIED` if missing; `MISMATCH` if malformed or synthetic merge confusion. |
| **`BUILD_VERIFIED`** | Static asset build completed | Immutable build manifest SHA matching source SHA exactly ($\text{build\_sha} == \text{source\_sha}$). | `UNVERIFIED` if build manifest missing; `MISMATCH` on SHA divergence. |
| **`DEPLOYMENT_VERIFIED`** | Cloudflare Pages deployment completed | Real deployment metadata containing valid `deployment_id` and $\text{deployment\_sha} == \text{build\_sha}$. | `UNVERIFIED` if metadata missing; `MISMATCH` on SHA divergence. |
| **`RUNTIME_VERIFIED`** | Endpoint `/api/version` queried on live edge | Runtime manifest SHA matches deployed SHA ($\text{runtime\_sha} == \text{deployment\_sha}$) on canonical branch (`master`/`main`). | `UNVERIFIED` if endpoint unreachable; `MISMATCH` on branch or SHA divergence. |
| **`DATABASE_VERIFIED`** | Live server-side probe executed | Active authenticated query returns HTTP 200 within 3000ms; project ref matches canonical `kitwadizsvjmuxkfewxj`. | `UNVERIFIED` if credentials missing; `INACTIVE` / `TIMEOUT` / `AUTHENTICATION_FAILED`. |
| **`FULL_RELEASE_VERIFIED`** | Complete end-to-end alignment | $\text{SOURCE} \land \text{BUILD} \land \text{DEPLOYMENT} \land \text{RUNTIME} \land \text{DATABASE}$ all verified simultaneously. | `UNVERIFIED` (Never defaults to verified). |
| **`MISMATCH`** | Parity check failure | Any inequality between observed SHAs, non-canonical branch, repository mismatch, or PR synthetic merge confusion. | Flagged in security logs with explicit diff. |
| **`UNVERIFIED`** | Missing or incomplete telemetry | Any required identity component omitted, unreached network probe, or stale timestamp (>24h). | Default state. Fails closed. |

---

## 2. Database Health Probe Classifications

| Classification | Trigger Condition | Edge Behavior |
| :--- | :--- | :--- |
| **`ACTIVE_HEALTHY`** | Authenticated query to `${SUPABASE_URL}/rest/v1/` returns HTTP 200 within 3000ms with valid project ref. | System marks database verified; permits `FULL_RELEASE_VERIFIED` when release identity also passes. |
| **`INACTIVE`** | Supabase responds with HTTP 503, 521, or "project paused" payload. | Endpoint returns `status: UNVERIFIED`, `database_identity.status: INACTIVE`. Prevents false traffic routing. |
| **`UNAVAILABLE`** | Network connection refused (`ECONNREFUSED`), host not found (`ENOTFOUND`), or HTTP 500/502/504. | Endpoint returns `status: UNVERIFIED`, `database_identity.status: UNAVAILABLE`. |
| **`TIMEOUT`** | Database query fails to respond within 3000ms strict timeout. | Edge function aborts request gracefully; returns `status: UNVERIFIED`, `database_identity.status: TIMEOUT`. |
| **`AUTHENTICATION_FAILED`** | Supabase responds with HTTP 401 or 403 (invalid anon key or revoked service role). | Returns `status: UNVERIFIED`, `database_identity.status: AUTHENTICATION_FAILED`. Alert logged. |
| **`IDENTITY_MISMATCH`** | Runtime URL or ref points to a different Supabase project than canonical `kitwadizsvjmuxkfewxj`. | Critical security block: returns `status: UNVERIFIED`, `database_identity.status: IDENTITY_MISMATCH`. |
| **`UNVERIFIED`** | Runtime environment lacks `SUPABASE_URL` or `SUPABASE_ANON_KEY`. | Default state. Fails closed. Never reports success. |
