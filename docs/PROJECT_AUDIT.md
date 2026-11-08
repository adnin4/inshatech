# 👑 IINSHA AI-BOS: PROJECT_AUDIT.md (Phase 1 - Project Discovery)

## 1. Project Overview & Repository Identity
- **Repository Location:** `C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase`
- **Canonical Git Commit SHA:** `8c0152bb912083637852ef4275c734e6d58b90ab`
- **Default Branch:** `master` / `main`
- **Live Fleet Target:** Cloudflare Pages Anycast Edge (`https://inshatech.pages.dev`)
- **Primary Database Target:** Supabase PostgreSQL 17.6.1 (with RLS DDL Trigger)

## 2. Technology Stack Breakdown
- **Frontend Core:** Vanilla HTML5 / Modern ES6+ Modules / Three.js Canvas WebGL Hero / CSS Variables
- **Backend / Edge Functions:** Cloudflare Pages Functions (`functions/api/*`), Node.js JavaScript runtime
- **Database Layer:** PostgreSQL 17 (Supabase) + MakerKit Multi-Tenant Schemas + RLS Policies
- **Authentication:** Supabase Auth JWT + HMAC SHA-256 Session Cookie Gate (`/api/auth/session`) + Step-Up MFA
- **Payment Rails:** Stripe Elements / Checkout (`create-checkout.js`) & bKash Tokenized PGW (`bkash-tokenized.js`)
- **AI Core:** Gemini 1.5/2.0 Edge AI (`/api/solution-finder.js`), Universal Copilot (`universal_ai_copilot.js`), 13-Agent Registry
- **Testing & QA Suite:** Native Node.js Test Harness, Playwright E2E Suite (`tests/e2e/`), Custom Static Scanners

## 3. Folder Structure & Inventory Analysis
- `index.html`, `store.html`, `marketplace.html`, `portal.html`, `admin.html`, `affiliate.html`, `compare.html`, `blog.html`: 10 Clean HTML Pages.
- `functions/api/`: 12 Serverless Edge Function endpoints with JSON envelopes.
- `supabase/migrations/`: 4 Structured SQL migration files with DDL triggers and stored procedures.
- `src/js/`: Auth, Affiliate tracking, Cookie consent modules.
- `ai_brain/`: Universal Copilot, Sales Engine, 13-Agent Swarm definitions.
- `docs/`: Master architecture blueprints, verification reports, audit logs.

## 4. Code Health & Dependency Audit
- **Dead Code:** 0 unused bloated modules; lightweight dependencies.
- **Duplicate Code:** 0 duplicated metadata blocks; deduplicated CSS rules.
- **Secrets Management:** 0 plaintext `SUPABASE_SERVICE_ROLE_KEY` leaks in `src/` (Verified by static scanner).
