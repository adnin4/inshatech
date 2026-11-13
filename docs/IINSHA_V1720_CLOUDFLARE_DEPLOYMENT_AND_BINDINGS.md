# IINSHA AI-BOS — V1720 Cloudflare Deployment, Bindings & SRE Ledger
**Audit Date:** 2026-11-14T02:46:00+06:00 (Asia/Dhaka)  
**Primary Edge Platform:** Cloudflare Pages (Direct Upload / Wrangler)  
**Staging Host:** `https://inshatech-b6b.pages.dev/`  
**Production Host:** `https://inshatech.pages.dev/`  
**Release Candidate:** V1720 (`portfolio-showcase`)  

---

## 1. Cloudflare Workers & Durable Objects Architecture

In accordance with Cloudflare Pages Functions specifications, Durable Object bindings cannot be declared purely in-tree inside Pages Functions without reference to an external Worker that implements and exports the Durable Object class.

### 1.1 External Worker Implementations
The repository provides external worker definitions:
- **Staging Worker:** `iinsha-security-coordinator-staging`
- **Production Worker:** `iinsha-security-coordinator-production`
- **Source Module:** `workers/security-coordinator/src/index.js`

### 1.2 `wrangler.toml` External Bindings Configuration
```toml
# Cloudflare Pages Specification for IINSHA AI-BOS
name = "inshatech"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist-pages"

[env.staging.durable_objects]
bindings = [
  { name = "SECURITY_COORDINATOR", class_name = "SecurityCoordinator", script_name = "iinsha-security-coordinator-staging" }
]

[env.production.durable_objects]
bindings = [
  { name = "SECURITY_COORDINATOR", class_name = "SecurityCoordinator", script_name = "iinsha-security-coordinator-production" }
]
```

---

## 2. CI/CD Workflow Harmonization & Fork Protection

In candidate `e2d047a` / `2e33ec2`, 3 CI workflows failed on forks due to missing secrets, rigid string assertions, and long polling loops:

1. **Quality Guard Workflow (`.github/workflows/quality_guard.yml`):**
   - *Problem:* A hardcoded Python script checked `pages_build_output_dir = "."` instead of `pages_build_output_dir = "dist-pages"`.
   - *Fix:* Replaced inline shell check with `scripts/validate_wrangler_config.py` using Python `tomllib` to parse structured TOML, allow `dist-pages` or `.`, and enforce absence of Worker-specific keys.
2. **Release Direct Upload Workflow (`.github/workflows/release-direct-upload.yml`):**
   - *Problem:* `deploy-staging` attempted to deploy to Cloudflare Pages on fork branches where `CLOUDFLARE_API_TOKEN` is unavailable.
   - *Fix:* Added `if: github.repository == 'adnin4/inshatech'` to `deploy-staging`. On forks, `verify-and-stage-artifact` executes full artifact verification while deployment is cleanly skipped.
3. **Deploy Workflow Edge Polling (`.github/workflows/deploy.yml`):**
   - *Problem:* The `runtime-evidence` job ran on fork push events and polled staging for 10 minutes (60 attempts) waiting for the fork's commit SHA, causing workflow failure.
   - *Fix:* Restricted `runtime-evidence` to `github.repository == 'adnin4/inshatech' && github.event_name == 'push' && (github.ref == 'refs/heads/master' || github.ref == 'refs/heads/main')`.

---

## 3. Cookie-Only Admin Session Security & Edge Isolation

1. **HttpOnly Cookie Enforcement:**
   - Server-issued cookie: `__Host-iinsha_admin_session` (`HttpOnly; Secure; SameSite=Strict; Path=/`).
   - Browser requests (`Sec-Fetch-Mode`, `Sec-Fetch-Dest`, `Sec-Fetch-Site`, `cookie_only`, or browser `User-Agent`) **NEVER** receive `session_token` in JSON under any circumstance.
   - Attack vector closed: Browser JavaScript spoofing `X-Client-Type: cli` is strictly denied JSON tokens.
2. **Strict RFC 4648 Base32 Enforcement in `computeTotp()`:**
   - Fallback to arbitrary UTF-8 strings is forbidden in production/staging (`allowLegacyUtf8 === false`).
   - Unused padding bits (Section 3.5) and non-alphabet characters are rejected with `INVALID_BASE32_SECRET`.
3. **Fail-Closed Gatekeeper:**
   - If the external `SECURITY_COORDINATOR` Durable Object is unavailable in staging/production, auth endpoints return HTTP 503 `SECURITY_AUTHORITY_UNAVAILABLE` rather than degrading to insecure memory.

---

## 4. Staging Verification Telemetry

| Endpoint / Target | Measured Result | HTTP Status | Evidence |
|---|---|---|---|
| `GET /api/version` | SHA, Branch, Environment, Truthful Provenance | 200 OK | `DEPLOYMENT_SHA_MATCHED_ONLY` |
| `GET /api/sre/health` | SRE Telemetry, System Health | 200 OK | SRE Checks Passing |
| `GET /admin.html` | Clean zero-trust login dialog, 0 fake partners | 200 OK | Truthful empty state |
| `POST /api/auth/session` | Browser flow receives HttpOnly cookie, 0 JSON token | 200 OK | Cookie-only verified |
| `GET /services/*` | 10 commercial service routes | 200 OK | 10/10 verified |
