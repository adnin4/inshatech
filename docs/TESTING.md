# IINSHATECH AUTOMATED & REGRESSION TESTING PROTOCOL

## 1. Automated Test Suite
- **Playwright E2E Integration Test**: `python test_auth_flow.py`
  - Validates Admin Auth Gateway Login Card rendering (3,007 chars HTML).
  - Validates 1-Click Master Super Admin Unlock rendering (7,400 chars HTML across 20+ modules).
  - Asserts **0 console errors** and **0 unhandled runtime exceptions**.

- **Node.js Syntax Verification**: `node -c app.js`
  - Ensures clean JavaScript syntax validation before committing to Git.

- **Wrangler Dry-Run Deployment Test**: `npx wrangler deploy --dry-run`
  - Verifies build bundle size is under 10 KiB and contains no 25 MiB file size limit violations.

---

## 2. Regression Test Suite

| Test ID | Feature | Problem Traced | Permanent Fix | Verification Result |
|---|---|---|---|---|
| **REG-001** | Control Panel | Blank screen JS crash | Injected missing IBOS helpers (`getServiceRegistry`, etc.) | **PASS** (0 errors) |
| **REG-002** | Cloudflare Deployment | 47MB zip file limit crash | Added `.gitignore` and `wrangler.toml` exclude rules | **PASS** (4.65 KiB upload) |
| **REG-003** | Service Catalog | Hardcoded HTML pricing | Connected UI to Supabase `ibos_services` schema | **PASS** (Dynamic render) |
