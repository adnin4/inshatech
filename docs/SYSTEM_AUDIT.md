# IINSHATECH SYSTEM FORENSIC AUDIT REPORT
**Document ID**: SYSTEM_AUDIT-2026-v1000  
**Status**: Completed  
**Author**: Principal Software Architect & Engineering Lead  
**Target Platform**: Cloudflare Pages + Cloudflare Workers + Supabase PostgreSQL  

---

## A. CURRENT ARCHITECTURE
The current IINSHATECH application is a hybrid system transitioning from a legacy static Netlify site to a modern Cloudflare Pages static web platform paired with Cloudflare Workers API backend and a Supabase PostgreSQL database.

```
[ Client Browser ]
       │
       ├──> Static Assets & Web UI (Cloudflare Pages: index.html, app.js, style.css)
       │
       ├──> Headless API Edge Gateway (Cloudflare Workers: worker.js)
       │
       └──> Database & Auth (Supabase PostgreSQL / RLS / Supabase Auth)
```

---

## B. CURRENT TECHNOLOGY STACK
- **Frontend Core**: Vanilla HTML5, JavaScript (ES6+), Vanilla CSS3 (Glassmorphism design system).
- **Edge Deployment**: Cloudflare Pages (Frontend UI) + Cloudflare Workers (Backend API Gateway).
- **Database Layer**: Supabase PostgreSQL with `pgvector` extension for AI memory, Row Level Security (RLS), and `uuid-ossp`.
- **Authentication**: SessionStorage transient auth fallback + Supabase Auth integration.
- **Automation / Orchestration**: Oracle Cloud Always Free VPS running Docker & n8n workflow automation.
- **Version Control & CI/CD**: GitHub (`adnin4/inshatech`), GitHub Actions (`.github/workflows/deploy.yml`), Cloudflare Pages CI/CD.

---

## C. FRONTEND ARCHITECTURE
- **Primary Layout**: Single-page application hybrid with dedicated sub-pages (`index.html`, `affiliate.html`, `portal.html`, `store.html`, `blog.html`, `compare.html`, `marketplace.html`, `services/*.html`).
- **State Management**: Local in-memory JS state object paired with `localStorage` and `sessionStorage` fallbacks.
- **UI Components**: Interactive Modals (Admin Control Panel Studio, Build Your Custom AI System Wizard, Voice Assistant, Checkout Modal, ROI Calculator, Playground).

---

## D. BACKEND ARCHITECTURE
- **Edge Worker**: `worker.js` acting as a serverless CORS-enabled API Gateway on Cloudflare Workers.
- **Endpoints**:
  - `/api/content/words` — Universal content words key-value dictionary.
  - `/api/payment-gateways` — Dynamic payment gateway configuration.
  - `/api/theme` — Dynamic CSS theme tokens and glassmorphism settings.
  - `/api/services` — Central service registry and BDT/USD conversion rules.
  - `/api/affiliate` — PartnerStack-grade affiliate attribution and commission rates.
  - `/api/ai` — Hermes AI Swarm Agent vector memory interface.
  - `/api/admin` — Master admin authentication and RBAC status.

---

## E. DATABASE ARCHITECTURE
- **Tables Defined in `supabase_schema.sql`**:
  1. `ibos_content_words` (Universal key-value dictionary for dynamic text content).
  2. `ibos_dynamic_pages` & `ibos_page_blocks` (CMS Page & Elementor-style Block Builder).
  3. `ibos_navigation_menus` (Dynamic Navbar, Footer, and Sidebar navigation).
  4. `ibos_theme_settings` (Dynamic design tokens, colors, fonts).
  5. `ibos_payment_gateways` (Stripe, bKash, Nagad, Bank parameters).
  6. `ibos_services` (Central Service Catalog, Unlimited Package Tiers, Features, SEO).
  7. `ibos_affiliates` & `ibos_affiliate_payouts` (PartnerStack-grade affiliate tracking & payout ledger).
  8. `ibos_orders` (Order lifecycle, clients, affiliate attribution, payment statuses).
  9. `ibos_users` (RBAC Users & password hashes using `pgcrypto`).
  10. `ibos_version_history` & `ibos_audit_logs` (Immutable audit logging & CMS rollbacks).

---

## F. AUTHENTICATION ARCHITECTURE
- **Current Flow**: SessionStorage transient key `iinsha_admin_authenticated` + Admin Login Gateway Card (`admin-login-card`) with Email/Password inputs and 1-Click Master Super Admin Unlock.
- **Production Target**: Full Supabase Auth JWT token-based authentication with bcrypt/pgcrypto password hashing and Row Level Security (RLS) enforcement at the PostgreSQL database level.

---

## G. ADMIN ARCHITECTURE
- **Interface**: `index-admin-cms-root` modal container rendering 20+ interactive business management modules.
- **Modules Implemented**: Executive BI Dashboard, Dynamic Service Catalog Builder, Universal Content Dictionary, Payment Gateway Switcher, PartnerStack Affiliate Manager, Order Management & Ledger, AI Swarm Control Room, System Diagnostics.

---

## H. MARKETPLACE ARCHITECTURE
- **Products & Services**: Dynamic card grid filtered by search query, category chips, and currency toggler ($ USD / ৳ BDT @ 120 rate).
- **Data Pipeline**: Consumes central `ibos_services` schema with fallback to local service registry.

---

## I. AFFILIATE ARCHITECTURE
- **Attribution Model**: Last-Click 30-Day Attribution window with unique referral codes (e.g. `AFF10025`).
- **Dashboard**: Commission stats (Total Earnings, Pending, Withdrawn), link generator, referral click counters, payout request triggers.

---

## J. PAYMENT & ORDER ARCHITECTURE
- **Lifecycle States**: `draft` -> `pending` -> `awaiting_payment` -> `paid` -> `processing` -> `completed`.
- **Supported Gateways**: bKash (Merchant/Send Money), Nagad, Stripe Credit/Debit Cards, Bank Wire Transfer.

---

## K. CMS ARCHITECTURE
- **Granular Control**: Key-value pairs (`word_key`, `word_value`) for header, subhead, CTA buttons, WhatsApp number, and navigation items.
- **Version Control**: `ibos_version_history` tracks `entity_type`, `previous_value`, `new_value`, and `changed_by`.

---

## L. SECURITY ARCHITECTURE
- **Headers (`_headers`)**: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Cache-Control: no-cache, no-store, must-revalidate`.
- **Database**: PostgreSQL Row Level Security (RLS) policies protecting `ibos_users`, `ibos_orders`, and `ibos_affiliates`.

---

## M. PERFORMANCE ARCHITECTURE
- **Caching**: HTTP `Cache-Control` header rules + versioned asset query tags (`app.js?v=1000.1`, `style.css?v=1000.1`).
- **Hardware Acceleration**: CSS GPU acceleration (`transform: translateZ(0)`, `content-visibility: auto`).

---

## N. DEPLOYMENT ARCHITECTURE
- **Frontend Hosting**: Cloudflare Pages (`inshatech.pages.dev`).
- **Backend API**: Cloudflare Workers (`worker.js`).
- **CI/CD Pipeline**: GitHub Actions (`.github/workflows/deploy.yml`) on commit to `master` / `gh-pages`.

---

# COMPLETE FORENSIC PROBLEM MATRIX

| ID | Problem | Severity | Affected File | Affected Component | Root Cause | Why Previous Fixes Failed | Business Impact | Security Impact | Performance Impact | Permanent Solution | Regression Test |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **P0-01** | Cloudflare Workers vs Pages Build Command Conflict | **P0** | `wrangler.toml` / Dashboard Settings | Cloudflare CI/CD Pipeline | `npx wrangler deploy` was being executed inside Cloudflare Workers CI/CD instead of Cloudflare Pages static builder | Previous attempts retried the Worker build instead of clearing the build command for Pages | Site on `inshatech.pages.dev` remained stuck on legacy v4.5 version | Low | High (serves obsolete code) | Configured `pages_build_output_dir = "./"` and removed build command from Cloudflare Pages settings | Deploy commit and verify HTTP 200 with new version tag `v1000.1` |
| **P0-02** | 47MB Zip File Blocking Cloudflare Deployments | **P0** | `.gitignore`, `wrangler.toml` | Git Repository & Worker Upload | Uncompressed `.zip` file `site_deploy_package.zip` (47 MB) was committed into Git, exceeding Workers KV 25MB limit | Files were created in working directory without `.gitignore` protection | All Cloudflare deployments crashed with `File too big` error | Low | High (failed deployments) | Purged heavy files from Git tracking, added strict `.gitignore` and `.ignore`, updated `wrangler.toml` exclude rules | Run `wrangler deploy --dry-run` and verify total bundle size is under 10 KiB |
| **P1-01** | `getServiceRegistry` ReferenceError JS Crash | **P1** | `app.js` | Control Panel Rendering Engine | `getIBOSData()` called undefined helper functions before rendering container innerHTML | Previous fixes patched UI text without injecting fallback helper functions | Clicking Control Panel resulted in a blank/black screen modal | Low | High (JS execution halted) | Injected all missing IBOS helper functions (`getServiceRegistry`, `getSiteWords`, `getAdminUsers`, etc.) into `app.js` | Run Playwright test calling `openProtectedAdminPanel()` and assert 0 console errors |
| **P1-02** | Frontend Hardcoded Service & Pricing Definitions | **P1** | `index.html`, `app.js` | Service Catalog & Pricing Section | Service prices and features were duplicated across `index.html` markup and JS objects | Fixes added cards manually to HTML without linking to central database API | Price changes required editing raw HTML files across multiple pages | Low | Low | Migrate all service rendering to fetch from `ibos_services` Supabase table / `/api/services` API | Change price in database and verify homepage updates automatically |
| **P2-01** | Browser & CDN Aggressive Asset Caching | **P2** | `index.html`, `_headers` | HTTP Cache Engine | Cloudflare CDN and browsers cached `app.js` without version query parameters | Fixes relied on browser refresh without updating HTTP headers | Users saw old cached versions after site updates | Low | Medium (delayed updates) | Added `Cache-Control: no-cache, no-store, must-revalidate` in `_headers` and appended `?v=1000.1` asset version tags | Inspect network response headers for `no-cache` directive |
| **P2-02** | Missing DOM Element Event Listener Null Guards | **P2** | `app.js` | Partner Portal & Marketplace Handlers | Code called `.onclick` directly on elements before verifying non-null existence | Fixes assumed elements existed on all sub-pages | Caused null dereference exceptions on sub-pages without those specific element IDs | Low | Low | Added explicit null checks `if (el) el.onclick = ...` across all event initializers | Open `affiliate.html`, `marketplace.html`, `compare.html` and check console for zero errors |
