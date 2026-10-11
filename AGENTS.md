# ANTIGRAVITY REPOSITORY GOVERNANCE DIRECTIVE (AGENTS.md)
# adnin4/inshatech — IINSHA AI-BOS Sovereign Operating Directive

## 1. Core Mandate & Non-Negotiable Engineering Invariants
1. **Zero Fake Green / Zero Hallucination Policy:**
   - Never claim a test, build, database connection, or external API is live or healthy without hard deterministic telemetry (exit code 0, HTTP 200 with matching cryptographic hash).
   - If a database or third-party service is unconfigured or inactive in the cloud (such as Supabase project `kitwadizsvjmuxkfewxj`), report `NOT_CONFIGURED` or `UNVERIFIED`. Never mutate schemas blindly or bypass checks.
2. **Fail-Closed Security Architecture:**
   - All privileged routes (`/api/admin/*`, `/api/workforce/*`) MUST require signed HMAC-SHA256 session tokens with valid TOTP MFA verification.
   - Client-side bypasses (hardcoded fallback passwords, instant demo logins, length-only checks) are strictly banned.
   - Release identity checks (`functions/_shared/release_identity.js`) MUST verify multi-SHA parity (`commit_sha === deployment_sha === runtime_sha`) without backfilling missing values.
3. **Zero Truncation Law:**
   - Absolute prohibition of placeholders like `// TODO`, `/* Implement logic here */`, or partial snippets. All code must be 100% production-ready.
4. **Visual Baseline Preservation (Gate 0):**
   - Dark glassmorphism UI tokens, responsive grids, mobile breakpoints (320px–4K), and branding invariants MUST remain 100% intact. Zero Unicode mojibake.

## 2. External Owner Boundaries (G1–G16)
The following tasks belong strictly to the system owner and must not be simulated or bypassed:
- **G1:** Cloudflare Pages Production API Token (`CLOUDFLARE_API_TOKEN`) & Live DNS Cutover.
- **G2:** Supabase Cloud Project Activation (`kitwadizsvjmuxkfewxj` project resume via Supabase Dashboard).
- **G3:** Production Secrets Injection in Cloudflare Pages Dashboard (`JWT_SECRET`, `ADMIN_PASSWORD_HASH`, `MFA_SECRET`, `ADMIN_EMAIL`).
- **G4:** Live Payment Gateway Credentials (bKash, SSLCommerz, Stripe Live Keys).
- **G5:** Clinical / Business UAT Sign-off from Lead Engineer & Founder (Adnin Sadat Mahin).

## 3. Verification Commands
Always run local deterministic telemetry to verify system invariants:
```bash
node scripts/visual_regression_baseline.mjs     # 8/8 Locked (100%)
node scripts/real_world_security_gate.mjs       # Zero P0/P1 defects
node scripts/test_admin_auth_security.mjs       # 11/11 tests pass
node scripts/test_release_identity.mjs          # 100% pass
node scripts/public_site_e2e.mjs                # 12/12 pages clean
node scripts/ci_evidence_runner.mjs             # 25/25 suites pass
```
