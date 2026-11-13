# ANTIGRAVITY REPOSITORY GOVERNANCE DIRECTIVE (AGENTS.md)
# adnin4/inshatech — IINSHA AI-BOS Sovereign Permanent Operating Rules

## 1. Core Mandate & Non-Negotiable Engineering Invariants
1. **Zero False-Green / Zero Hallucination Policy:**
   - Never claim a test, build, database connection, or external API is live or healthy without hard deterministic telemetry (exit code 0, HTTP 200 with matching cryptographic hash).
   - If a database or third-party service is unconfigured or inactive in the cloud (such as Supabase project `kitwadizsvjmuxkfewxj`), report `NOT_CONFIGURED` or `UNVERIFIED`. Never mutate schemas blindly or bypass checks.
   - Never claim a health check succeeded merely because an environment variable says `HEALTHY`.
2. **Fail-Closed Release & Security Architecture:**
   - All privileged routes (`/api/admin/*`, `/api/workforce/*`) MUST require signed HMAC-SHA256 session tokens with valid TOTP MFA verification.
   - Client-side bypasses (hardcoded fallback passwords, instant demo logins, length-only checks) are strictly banned.
   - Release identity checks (`functions/_shared/release_identity.js`) MUST verify multi-SHA parity (`commit_sha === build_sha === deployment_sha === runtime_sha`) without backfilling missing values from deployment SHA.
   - Accept only full 40-character SHA-1 or 64-character SHA-256; reject short SHAs and synthetic merge SHA confusion.
3. **Zero Truncation Law:**
   - Absolute prohibition of placeholders like `// TODO`, `/* Implement logic here */`, or partial snippets. All code must be 100% runtime-ready.
4. **Visual Baseline Preservation (Gate 0):**
   - Dark glassmorphism UI tokens, responsive grids, mobile breakpoints (320px–4K), and branding invariants MUST remain 100% intact. Zero Unicode mojibake.
5. **Zero Raw Dialogs UX Standard:**
   - Strictly forbid `window.alert()`, `window.confirm()`, and `window.prompt()`. Always use interactive accessible DOM modals with keyboard trapping and thermal print triggers.

## 2. Permanent Developer & AI Operating Directives
- **Pre-Execution Inspection:** Always inspect the current Git branch, commit SHA, and working tree (`git status --short`) before making changes.
- **Safe Branching:** Always create an isolated integration branch for risky changes; never force-push or reset remote branches.
- **Authorization Verification:** Always test both positive (allowed) and negative (denied) authorization and tenant access cases.
- **Tenant Isolation:** Enforce PostgreSQL Row Level Security (RLS) across all multi-tenant tables.
- **Evidence Integrity:** Verify all external actions with independent evidence; never use circular or self-referential evidence.
- **Standard Classifications:** Always classify verification results using the six official statuses:
  `PASS` | `FAIL` | `BLOCKED_EXTERNAL` | `NOT_VERIFIED` | `EXPECTED_SECURITY_DENIAL` | `DEFERRED`.

## 3. External Owner Action Boundaries (G1–G5)
The following operations belong strictly to the project owner and cannot be bypassed:
- **G1:** GitHub CLI / Personal Access Token authentication (`gh auth login`).
- **G2:** Supabase Cloud Project Restoration (`kitwadizsvjmuxkfewxj` unpause via Supabase Dashboard).
- **G3:** Cloudflare Pages Production Dashboard credentials and custom domain DNS cutover.
- **G4:** Live Payment Gateway API Keys (bKash, SSLCommerz, Stripe Live).
- **G5:** Dedicated GitHub repository creation for independent Enterprise ERP (`adnin4/enterprise-erp`).

## 4. Verification Commands & Telemetry Suite
```bash
node scripts/visual_regression_baseline.mjs     # Visual Baseline Firewall
node scripts/real_world_security_gate.mjs       # Zero P0/P1 Security Defects
node scripts/test_admin_auth_security.mjs       # 11/11 Admin Session Tests
node scripts/test_release_identity.mjs          # 11/11 Parity & DB Probe Tests
node scripts/verify_canonical_manifest_guard.mjs# Single Canonical State Guard
node scripts/test_18_agent_workforce.mjs        # 134/134 Agent Workforce Tests
node scripts/ci_evidence_runner.mjs             # 26/26 Deterministic CI Suites
npm test                                        # 10/10 System Claim Invariants
npm run e2e                                     # 12/12 Public HTML Pages Tested
```
