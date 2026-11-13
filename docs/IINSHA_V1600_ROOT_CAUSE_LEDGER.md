# IINSHA AI-BOS — V1600 ROOT CAUSE REMEDIATION LEDGER
**Baseline Timestamp:** 2026-11-13T16:06:00+06:00 (Asia/Dhaka)  
**Evaluated Candidate:** `478b69b3377c7506d932133f308c02a41ef8c2b6`  
**Classification:** `ROOT_CAUSE_ELIMINATION_VERIFIED`

---

## 1. Exhaustive Defect & Root Cause Registry

### ROOT-CAUSE 01: RFC 4648 Base32 Input Validation & TOTP RFC 6238 Known-Answer Vectors
* **Vulnerability / Flaw:** Google Authenticator and RFC 6238-compliant authenticators generate OTPs using Base32-encoded HMAC keys (RFC 4648). Missing strict padding checks, missing character validation, and implicit UTF-8 fallbacks allowed invalid Base32 secrets to silently fail or produce mismatched OTPs.
* **Root Cause:** `functions/api/auth/session.js` initially decoded arbitrary UTF-8 characters and lacked strict RFC 4648 padding constraints (only padding counts of 1, 3, 4, and 6 '=' characters are permitted in Base32).
* **Fix Applied:**
  - Implemented strict `base32Decode(str)` enforcing Base32 alphabet `[A-Z2-7]`, checking padding validity, and rejecting malformed unpadded blocks (lengths with remainder 1, 3, or 6).
  - Enhanced `verifyTotp(token, secret, options)` to support configurable digits, hash algorithms (`SHA-1`, `SHA-256`, `SHA-512`), step sizes, and fixed timestamps.
  - Added official RFC 6238 Appendix B known-answer test vectors covering timestamps 59, 1111111109, 1111111111, 1234567890, 2000000000, 20000000000 across 8-digit and 6-digit outputs.
* **Verification Outcome:** **PASS** (100% exact match across all 6 RFC 6238 test vectors).

---

### ROOT-CAUSE 02: Consistency Model Mismatch in Session Revocation (Durable Object vs KV)
* **Vulnerability / Flaw:** In `functions/_shared/auth_gate.js`, `checkSessionRevocationState` accepted either `SECURITY_COORDINATOR` (Cloudflare Durable Object) or `REVOCATION_KV`. Cloudflare KV is eventually consistent, introducing a window where a revoked session token could still be authorized across different global edge points.
* **Root Cause:** Both storage mechanisms were treated as equivalent shared authorities.
* **Fix Applied:**
  - Enforced that in staging/production (`env.ENVIRONMENT === 'production' || env.ENVIRONMENT === 'staging'`), the strongly consistent Durable Object (`SECURITY_COORDINATOR`) is mandatory.
  - If `SECURITY_COORDINATOR` is missing, requests strictly fail closed with HTTP 503 `SECURITY_AUTHORITY_UNAVAILABLE`.
  - KV is relegated strictly to an acceleration cache (fast-path rejection if cached revoked), but cannot authorize an unrevoked token without Durable Object confirmation.
* **Verification Outcome:** **PASS** (Test 27 verifies KV cache without DO strictly fails closed with HTTP 503).

---

### ROOT-CAUSE 03: Admin UI Background DOM Inert & Focus Containment
* **Vulnerability / Flaw:** While `admin.html` presented an authentication guardian overlay (`#admin-auth-overlay`), the underlying dashboard HTML remained accessible in the DOM. Screen readers, keyboard tab navigation, or script inspection could interact with background controls before authentication.
* **Root Cause:** Lack of HTML5 `inert` and ARIA modal semantics on the background container.
* **Fix Applied:**
  - Wrapped all cockpit dashboard markup in `<div id="admin-main-content" inert aria-hidden="true">`.
  - Added `role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title"` to `#admin-auth-overlay`.
  - Added `unlockAdminUI()` and `lockAdminUI()` helper functions to dynamically toggle `inert` and `aria-hidden` upon server authentication or session logout.
  - Added focus trapping on the overlay dialog to prevent keyboard navigation from leaving the login card.
  - Added explicit accessible `aria-label` attributes to all authentication input fields.
* **Verification Outcome:** **PASS** (Test 28 verifies inert background, modal dialog semantics, and accessible labels).

---

### ROOT-CAUSE 04: Supabase Database Health False-Green & Deep Schema Verification
* **Vulnerability / Flaw:** Previous implementations probed only `GET /rest/v1/` or checked project ref equality, which could declare a database healthy even if required tables, migrations, or application schema were missing.
* **Root Cause:** Superficial REST root probe without checking table availability.
* **Fix Applied:**
  - Enhanced `functions/_shared/database_probe.js` to probe both the REST root and the core application table (`/rest/v1/services?select=id&limit=1`).
  - Separated diagnostic classifications: `PROJECT_IDENTITY_VERIFIED`, `DATABASE_CONNECTION_VERIFIED`, `APPLICATION_SCHEMA_VERIFIED`, and `DATABASE_READY`.
  - If application tables return 404, the probe returns `PROBE_STATUS.UNAVAILABLE` with status `APPLICATION_SCHEMA_MISSING`.
  - When credentials are dormant or unconfigured, the probe cleanly returns `PROBE_STATUS.UNVERIFIED` with HTTP 503.
* **Verification Outcome:** **PASS** (Verified with 0 false-green claims).

---

### ROOT-CAUSE 05: Independent Release SHA Provenance
* **Vulnerability / Flaw:** `/api/version` used a shared fallback `defaultSha` to populate `source_sha`, `build_sha`, `deployment_sha`, and `runtime_sha`, creating a false impression of independent 4-point verification when environment variables were absent.
* **Root Cause:** Lack of explicit provenance metadata for each SHA field.
* **Fix Applied:**
  - Tracked independent provenance origins for source (`ENV_SOURCE_RELEASE_SHA` vs `CANONICAL_MANIFEST`), build (`ENV_BUILD_RELEASE_SHA` vs `BUILD_MANIFEST`), deployment (`CF_PAGES_COMMIT_SHA`), and runtime (`LIVE_EDGE_RUNTIME`).
  - Stamped `dist-pages/release-manifest.json` with SHA-256 checksums of all 428 staged publishable files.
* **Verification Outcome:** **PASS** (Independent provenance verified).
