# IINSHA AI-BOS — V1710 EMPIRICAL CI & VERIFICATION EVIDENCE
**Evaluation Timestamp:** 2026-11-13T22:32:00+06:00 (Asia/Dhaka)  
**Host Environment:** Windows x64 | Node.js v22.14.0 | Git 2.47.1  
**Candidate Workspace:** `C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase`  
**Upstream Target:** `https://github.com/adnin4/inshatech` (PR #72)  
**Fork Authority:** `https://github.com/adnansadatmahin5-glitch/inshatech`  

---

## 1. Test Suite Execution Telemetry

### 1.1 Admin Auth & Gate Security Suite (`test_admin_auth_security.mjs`)
```
Command: node scripts/test_admin_auth_security.mjs
Exit Code: 0
Total Checks: 113
Pass Count: 113 (100%)
Fail Count: 0

Key Invariants Verified:
- Missing server secrets fail-closed with HTTP 503 CONFIGURATION_ERROR
- Wrong credentials fail with HTTP 401 INVALID_CREDENTIALS
- Valid credentials + valid TOTP return HTTP 200 AUTHENTICATED
- Browser session response strictly omits session_token from JSON (zero DOM storage exposure)
- Browser session response sets __Host-iinsha_admin_session HttpOnly SameSite=Strict cookie
- Signed session cookie grants HTTP 200 AUTHORIZED on /api/admin/gate
- Tampered token signature rejected with HTTP 401 FORGERY_REJECTED
- Expired token rejected with HTTP 401 TOKEN_EXPIRED
- Non-owner role rejected with HTTP 403 PRIVILEGE_REJECTED
- Session revocation via /api/auth/logout invalidates session and clears cookies
- Broken SECURITY_COORDINATOR fails closed on login/gate/logout with HTTP 503
- RFC 6238 Known-Answer Vectors: SHA-1, SHA-256, SHA-512 (100% cryptographic parity)
- RFC 4648 Base32 decodes seed with zero unused pad bits enforcement
- Accessible dialog semantics (role="dialog", inert, aria-modal="true", aria-hidden="true")
```

### 1.2 Release Identity & Database Probe Suite (`test_release_identity.mjs`)
```
Command: node scripts/test_release_identity.mjs
Exit Code: 0
Pass Count: 12 scenarios (100%)
Fail Count: 0

Key Invariants Verified:
- 40-char SHA-1 and 64-char SHA-256 validation; short 7-char SHAs strictly rejected
- Inherited CF_PAGES_COMMIT_SHA sets parity_status: 'DEPLOYMENT_SHA_MATCHED_ONLY'
- Inherited provenance sets provenance_independent: false
- Unset BUILD_TIMESTAMP truthfully sets captured_at: 'UNSPECIFIED' (no fake dynamic date)
- Full independent release env + verified DB yields FULL_RELEASE_VERIFIED
- Full independent release env + unverified DB yields READY_FOR_STAGING (DEPLOYMENT_VERIFIED)
- Synthetic merge SHA confusion detected and rejected with MISMATCH
- Non-canonical branch rejected with NON_CANONICAL_BRANCH
- Repository mismatch rejected with REPOSITORY_MISMATCH
- Stale evidence timestamp (>24h) rejected with STALE_EVIDENCE_TIMESTAMP
- Database probe returns ACTIVE_HEALTHY on 200, INACTIVE on 503, TIMEOUT on >3000ms
```

### 1.3 3D Visual Manifest Coverage Suite (`test_3d_visual_manifest.mjs`)
```
Command: node scripts/test_3d_visual_manifest.mjs
Exit Code: 0
Checks Executed: 23
Pass Count: 23 (100%)
Fail Count: 0

Key Invariants Verified:
- Manifest coverage: 183 entries covering all 80 microservices by ID and Slug
- 10 commercial service suites mapped with dedicated particle topologies
- 8 category fallback presets fully configured
- 13 distinct procedural canvas topologies verified
- DOM lifecycle hooks verified: IntersectionObserver pause/resume, visibilitychange, prefers-reduced-motion
```

### 1.4 Pricing Synchronization Suite (`test_pricing_synchronization.mjs`)
```
Command: node scripts/test_pricing_synchronization.mjs
Exit Code: 0
Checks Executed: 7
Pass Count: 7 (100%)
Fail Count: 0

Key Invariants Verified:
- Parity across knowledge/services.json and knowledge/premium_services.json
- Parity in functions/_shared/knowledge/services.json
- Parity in functions/api/services.js and functions/api/catalog/services.js
- Parity in landing page HTML service files (10/10)
- Parity in admin.html cockpit registry
- Parity in supabase/migrations/20261113000001_seed_premium_services_catalog.sql
```

### 1.5 Services E2E Route Verification (`test_services_e2e_routes.mjs`)
```
Command: node scripts/test_services_e2e_routes.mjs
Exit Code: 0
Checks Executed: 20
Pass Count: 20 (100%)
Fail Count: 0

Key Invariants Verified:
- All 10 premium services HTML files exist in dist-pages/services/
- Every service page contains authentic titles, price tags, and lead capture forms
- Zero broken assets or unresolved template variables
```

### 1.6 Hero Geometry & DOM Parity Suite (`test_hero_geometry_regression.mjs`)
```
Command: node scripts/test_hero_geometry_regression.mjs
Exit Code: 0
Checks Executed: 10
Pass Count: 10 (100%)
Fail Count: 0

Key Invariants Verified:
- 100% byte-for-byte DOM parity between index.html and live_index.html
- Brand headline: "Your AI Engineering Partner for a Smarter and Automated Future"
- Trust bar: 5 value propositions present
- HUD status chips present
```

### 1.7 Staged Pages Artifact Validator (`verify_deploy_artifact.mjs`)
```
Command: node scripts/verify_deploy_artifact.mjs
Exit Code: 0
Total Clean Publishable Files: 445
Forbidden File Violations: 0
Private Directories: 0
Required Runtime Files: 15/15 PASS
Artifact Manifest: Written cleanly to dist-pages/release-manifest.json
```

---

## 2. Git Provenance & Upstream Synchronization

```
Repository: portfolio-showcase
Current Branch: master
Tracking Remote: origin/master (adnin4/inshatech)
Fork Remote: fork (adnansadatmahin5-glitch/inshatech)
Active Pull Request: https://github.com/adnin4/inshatech/pull/72
Status: OPEN, MERGEABLE: TRUE
Commit Lineage:
- 57438cf feat(core): 100% 3D visual manifest, API-backed admin persistence, isolated demo CRM...
- 52d5479 feat(commercial): deliver 10 premium AI commercial services, 3D procedural visual...
- 6beafa4 fix(version): decouple manifest SHA and enable truthful inheritance...
```

---

## 3. Live Staging Probe Summary

```
Host: https://inshatech-b6b.pages.dev
Protocol: HTTPS (Cloudflare Edge)
Routes Probed:
- /                               -> HTTP 200 OK
- /admin.html                     -> HTTP 200 OK (Auth Dialog active)
- /services/ai-agent-development  -> HTTP 200 OK
- /services/workflow-automation   -> HTTP 200 OK
- /services/saas-architecture     -> HTTP 200 OK
- /services/cloud-infrastructure  -> HTTP 200 OK
- /services/api-integrations      -> HTTP 200 OK
- /services/software-development  -> HTTP 200 OK
- /services/ai-data-operations    -> HTTP 200 OK
- /services/enterprise-knowledge-search -> HTTP 200 OK
- /services/software-qa-release   -> HTTP 200 OK
- /services/cloud-finops-reliability    -> HTTP 200 OK
- /services/computer-vision-systems     -> HTTP 200 OK
- /api/version                    -> HTTP 200 OK (Truthful status: READY_FOR_STAGING)
- /api/sre/health                 -> HTTP 200 OK / DEPENDENCY_UNAVAILABLE (Truthful DB state)
```
