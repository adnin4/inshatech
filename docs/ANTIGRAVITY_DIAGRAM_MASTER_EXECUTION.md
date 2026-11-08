# IINSHA TECH — Diagram-inspired Design & Antigravity Master Execution Brief

**Purpose:** finish and validate the new IINSHA service-agency website experience without copying Diagram's proprietary assets, breaking existing business flows, or falsely certifying production.

**Primary repository:** `adnin4/inshatech`  
**Default branch:** `master`  
**Current design branch:** `feat/iinsha-site-refresh-admin-affiliate-guard-20261108`  
**Current base PR:** #67, release identity hardening (open)  
**Design/security PR:** #71, stacked on PR #67 (draft/open; not merged)  
**Production change policy:** do not merge, deploy, migrate or change live secrets without explicit owner approval.

---

## 1. Current verified state — read this before editing

### Git and deployment evidence

- GitHub repository metadata identifies `master` as the default branch. At the time of this audit, `master` was `b3de7650b65e388514ca82674654c92241ea8811`.
- There is a separate, older `main` branch at `45ee4c1f90f699686c71912a7f22598cbe3b0a74`. Do not treat `main` as the production source unless Cloudflare proves it is the configured production branch.
- The Antigravity v700 report claims production commit `c65da50d3046853d2b19ba22b732c20efb371cc4`. GitHub returned “No commit found” for that SHA. Treat that deployment claim as **NOT_VERIFIED**, not as source truth.
- The previous report also states “Admin has bypass logic: true”. Do not accept the earlier “109/109” report as a production security certificate.
- PR #67 and PR #71 are open. PR #71 is stacked on PR #67, and neither has been merged or deployed by this task.
- A CI pass applies only to the exact SHA reported by its run. Before every merge/release decision, query the current branch head, latest workflow run for that exact SHA, each job/step result, and skipped jobs. Never re-use an older green run to certify a newer commit.

### Supabase

- Project: `inshatech-db`
- Project ref: `kitwadizsvjmuxkfewxj`
- Region: `ap-southeast-1`
- Last checked status: `INACTIVE`.
- Migration listing timed out, and table listing reported that the database may not be accessible. No migration, schema change or data write was performed.
- Empty advisor lint arrays do not certify an inactive database or prove RLS correctness.

**Owner prerequisite:** the project owner must inspect and resume the project in Supabase Studio. After recovery, take a backup, list applied migrations, inspect schemas and constraints, review RLS policies, and run cross-user/tenant negative tests before allowing customer or affiliate flows to write production data.

### Cloudflare

- Repository Pages config has `pages_build_output_dir = "."`; the root `index.html` is the website entry point.
- The earlier report's `inshatech-b6b.pages.dev` URL and its claimed v700 deployment could not be independently verified from the connected repository/runtime evidence. Do not infer current production SHA, version, migration parity or authenticated health from the report.
- Do not deploy this branch straight to production. First inspect the Cloudflare Pages project's actual production branch, current deployment SHA, build output, environment bindings and rollback target in the owner's Cloudflare dashboard.

---

## 2. Diagram reference: what to learn from it

Reference: https://www.landing.love/sites/diagram/

The reference presents a dark, minimalist design-tool landing page with a quiet planetary/constellation hero, strong centered typography, generous negative space, a clear CTA hierarchy and restrained lighting. The showcase metadata lists AI, minimal, dark-mode and WebGL/Three.js-oriented design traits.

**Implementation boundary:** this project uses those broad design principles, not a pixel-for-pixel copy. Do not copy Diagram's logo, artwork, proprietary video, screenshots, text, code, or branding. The current research did not expose Diagram's source code or a reliable recording of every original s1–s6 interaction; do not claim exact animation parity.

### IINSHA's own design direction

- Obsidian/navy base, controlled violet/cyan/mint light, readable silver-white type.
- One centered headline and one clear value proposition; 2–3 primary actions, not a wall of CTAs.
- A procedural orbital 3D hero unique to IINSHA.
- A 4-card capability bento immediately after the hero.
- Search-first service discovery, followed by category navigation and the retained detailed catalogue.
- Editorial section spacing, short explanatory copy, quiet 1px borders and consistent responsive rules.
- Motion should explain a process or add depth. Never animate every component.

---

## 3. Work already implemented in the design branch

### Design system
- `css/iinsha-diagram-design.css`: design tokens, centered hero, responsive bento, card surfaces, mobile layout, service discovery styling and reduced-motion rules.
- Linked on the core public pages and the 10 service detail pages. The current pass includes 23 HTML pages: both homepage entry files, the main public/account pages and all listed service pages.
- `body.iinsha-diagram-redesign` scopes the new design to avoid unintentionally restyling unrelated third-party/embedded content.

### Real 3D motion — not a fake video
- `src/js/iinsha-diagram-motion.js` uses WebGL 1 to draw original orbital rings, planets, connection geometry and stars procedurally.
- Mouse/pointer parallax, a bounded animation loop, resize handling, offscreen pause, hidden-tab pause and a WebGL fallback are included.
- `prefers-reduced-motion` stops continuous animation.
- It deliberately avoids a remote Three.js CDN and does not require a hosted movie to render the hero.
- A licensed background video has **not** been added. Do not fetch random stock videos or use Diagram's footage. Only add an owner-supplied/licensed asset after verifying its rights, format, bitrate, mobile fallback, and reduced-motion poster behaviour.

### Content architecture
- `#bento-capabilities`: four original service capability cards for agent engineering, workflow automation, document intelligence and enterprise infrastructure.
- `#service-live-search`: instant client-side filtering across the existing 80 detailed service cards.
- Existing category tabs remain available when search is cleared.
- Existing solution finder, architecture builder, ROI calculator, package/checkout actions, forms, chat/coplay features, footer and modals must remain intact.
- The homepage hero no longer uses the old decorative CSS-only orbital block; it uses the new canvas. Both `index.html` and `live_index.html` carry the design hooks. Verify the configured Pages root still serves `index.html`.

### Automated source tests
- `scripts/test_diagram_design.mjs` checks both homepage entry files, shared design links across 23 public/service pages, the WebGL hook, bento, all 80 service cards, search, reduced motion and core module anchors.
- `scripts/verify_site_safety.mjs` guards known authentication/affiliate/database false-success patterns.
- The PR workflow runs syntax checks, admin-session tests, API fail-closed tests, Diagram design tests, the site safety guard, the Pages build/UI invariants and the existing public-page/asset surface audit.

---

## 4. Antigravity execution prompt — use the whole section below

You are the implementation agent for the IINSHA TECH website. Work in the existing repository and current design branch; do not create a second competing redesign branch.

### Mission

Finish the Diagram-inspired, service-first IINSHA redesign from top to bottom. Keep the business positioning as an AI automation and software-services studio. Reduce visual noise, improve hierarchy and readability, and make motion feel premium, purposeful and smooth.

### Non-negotiable rules

1. First run `git status`, `git branch --show-current`, `git log -8 --oneline --decorate`, `git remote -v`, and inspect the current branch's actual remote head. Do not assume a local workspace contains the newest commits.
2. Work only on `feat/iinsha-site-refresh-admin-affiliate-guard-20261108` or a clearly named child branch from it. Never commit directly to `master` or a Cloudflare production branch.
3. Pull/rebase only after confirming the base SHA. Never reset, force-push, rewrite history, or delete user files to make the build green.
4. Do not run database migrations, write production data, resume/pause infrastructure, rotate secrets, alter payment configuration, or trigger production deployment without explicit owner authorisation.
5. Never hard-code passwords, tokens, API keys, database credentials or sample payment success. Do not expose secrets in logs, screenshots, reports or generated source.
6. Never remove a working user-facing feature just to make the layout easier. Move, simplify or progressively disclose it. Keep every original package key, form name, id, data attribute, API contract and button action unless you have traced all callers and replaced them compatibly.
7. No fake metrics, fake reviews, fake clients, fake leaderboard, fake uptime, false “sent” messages or fabricated live system status.
8. Do not clone Diagram's site exactly or reuse its copyrighted visual assets. Build an original IINSHA visual system with similar high-level qualities.
9. No arbitrary external CDN dependency for the hero. The procedural WebGL fallback must work without a remote video or 3D library.
10. If a test fails, reproduce it, find the root cause, fix it, rerun the exact failing test and then rerun the full required suite. Never skip a failed job or describe an unrun test as PASS.

### Design requirements from top to bottom

**Header**
- One compact sticky header; avoid the old telemetry/status strip.
- Desktop nav must remain readable and not wrap into multiple rows.
- Mobile nav must be a usable horizontal pill row or a real accessible menu, with visible focus states and 44px targets.
- Do not place an owner/admin shortcut among customer conversion CTAs.

**Hero**
- Centered, editorial composition.
- One short statement of the service value proposition.
- Procedural IINSHA orbital canvas behind/around the headline, but never reducing headline contrast.
- Limit primary actions to the most useful actions: describe an automation need, explore services, and contact the studio. Move secondary readiness/audit tools lower on the page.
- Keep the founder/trust information compact and secondary.
- Do not claim “live”, “autonomous”, “enterprise-certified”, percentage savings or client results without independently verifiable evidence.

**Capability bento**
- Four large, distinct cards with clear labels and one concise sentence each.
- Show an original micro-graphic in each card: multi-agent hand-off, workflow routing, document-to-data extraction, and edge/app/database architecture.
- Motion must be subtle, low-frequency and non-distracting.

**Service catalogue**
- Put service search before the detailed category list so visitors can use it immediately.
- Search must filter the existing 80 service records, not a newly hard-coded sample list.
- Keep category tabs, clear/reset behaviour, empty results state and package modal buttons functioning.
- Ensure keyboard use, screen-reader count announcement and mobile horizontal scroll.
- Do not duplicate all service names in another giant text wall.

**Process/architecture section**
- Keep the existing Architecture Builder functional.
- Make its nodes and connections legible and visually consistent with the bento graphics.
- Explain the flow in a few steps; no fake terminal logs or fake execution success.

**ROI calculator**
- Keep the existing calculation formula, currency handling, inputs, validation and output IDs.
- Improve layout and explanation, but do not change arithmetic or saved results without dedicated tests.

**Packages, contact, FAQ and footer**
- Present service offers in clear tiers; retain original package IDs, data attributes and checkout wiring.
- Use honest, concise copy. Do not promise payment methods, payout times, warranties or service-level guarantees unless configured and evidenced.
- Keep a clear final contact CTA and a compact footer.

### Motion and performance requirements

- Use `requestAnimationFrame` only while the hero is visible, the tab is active and reduced motion is not requested.
- Respect WebGL failure, context loss, resize, page hide and mobile memory limits. Provide a static/gradient fallback.
- Clamp device pixel ratio and particle count on mobile; do not use multiple full-screen canvases.
- Keep decorative animation pointer-events disabled and behind content.
- Prefer CSS transforms/opacity and avoid layout thrashing.
- Avoid loading video until an owner-licensed asset is supplied. If later supplied, use a compressed WebM/MP4, poster image, muted/playsinline, lazy start, pause offscreen, and a static reduced-motion alternative.

### Accessibility / responsive acceptance

Test at 1440×900, 1280×800, 1024×768, 768×1024, 390×844 and 360×800:
- no horizontal page overflow;
- no cropped hero heading, buttons or service cards;
- no sticky CTA covering form buttons or footer controls;
- all controls keyboard reachable with visible focus;
- correct contrast and readable body text;
- reduced-motion preference disables non-essential animation;
- screen reader receives useful labels and updated search result counts;
- touch targets are at least 44×44 CSS pixels where practical.

### Code preservation and integration

- Inspect current event bindings before changing any element ID, class, data attribute or DOM nesting.
- Preserve the existing Solution Finder, pre-sales form, Architecture Builder, ROI Calculator, package/category modals, checkout, WhatsApp contact, Copilot and all current navigation routes.
- Confirm both `index.html` and `live_index.html` remain valid. Confirm which one Cloudflare Pages actually serves; root is configured to serve `index.html` unless Cloudflare routing says otherwise.
- Confirm all local stylesheet/script/image/font references resolve, including nested `services/*.html` relative paths.
- Do not add an external library or package without documenting the need and updating the lock file.

### Required execution commands

Run these from the repository root after installing with the lock file:

```bash
npm ci
node --check app.js
node --check src/js/auth.js
node --check src/js/ux_interactions.js
node --check src/js/iinsha-diagram-motion.js
node --check scripts/test_diagram_design.mjs
npm run test:admin-session
npm run test:api-fail-closed
npm run test:diagram-design
npm run test:site-safety
npm run build
node scripts/public_site_e2e.mjs
```

Then use the existing project workflows for commerce, payment, tenant/RLS security, AI/Copilot, workforce, form contracts and production-truth boundaries. Run only workflows relevant to the changed paths, but record every skipped/blocked job by name and reason. Never treat a green static test as live provider or deployment verification.

### Browser verification (required before saying visual implementation is complete)

- Use a real Chromium-based browser (and Firefox/WebKit when available) against the branch preview.
- Capture screenshots at the six viewports above for the full page and critical sections.
- Test the actual WebGL context and confirm the animation visibly renders; capture the fallback path by forcing WebGL unavailable.
- Test keyboard/mouse/touch service search, tabs, clear, no-results state, solution finder, Architecture Builder, ROI calculator, package modal, checkout validation, WhatsApp links and sticky CTA dismissal.
- Inspect console errors, failed network requests, layout overflow and long tasks.
- Record screenshots/artifacts and commit SHA. If no browser preview exists, mark the browser evidence NOT_VERIFIED.

### Security, database and production boundary

- Supabase was last observed INACTIVE. Do not attempt SQL/migrations until owner recovery and backups are confirmed.
- After recovery: inspect applied migrations, tables, constraints, indexes, triggers, RLS policies, grants, storage policies and edge functions. Test cross-tenant reads/writes using two different authenticated users; any cross-tenant access is a release blocker.
- Admin session review remains required: move from browser-held bearer token to secure HttpOnly/Secure/SameSite cookies, add server-side revocation, rate limiting, MFA recovery, password KDF migration and authorization checks at every privileged mutation.
- Affiliate signup, click attribution, commission ledger and payout remain unavailable until durable database-backed records, RLS, reconciliation and fraud controls are implemented.
- Real payments, refunds, invoices and provider integrations need sandbox evidence, signature verification and idempotency. Secret presence is not a connection test.
- Kill-switch must not be reported active until durable state is shared across all relevant workers and every governed execution path checks it.

### Release and evidence requirements

Before production release, independently verify:
1. latest GitHub default branch and the exact commit being released;
2. the latest successful CI run tied to that same commit;
3. all mandatory jobs/steps and explicit skipped jobs;
4. the Cloudflare Pages production deployment commit SHA and build result;
5. live `/api/version` payload: source/build/deployment/runtime SHA parity and branch;
6. authenticated owner health UI result, classification and evidence;
7. database project status, schema/migration parity and RLS tests;
8. real browser E2E screenshots and console/network results;
9. backup, rollback target and post-deploy smoke test.

Use only these classifications: **PASS**, **FAIL**, **BLOCKED_EXTERNAL**, **NOT_VERIFIED**, **EXPECTED_SECURITY_DENIAL**, **DEFERRED**. Do not call the platform production-ready or sealed while any required item is blocked, deferred or unverified.

### Final delivery format Antigravity must produce

1. Files changed and purpose.
2. Before/after screenshots for desktop and mobile.
3. Exact current default-branch SHA, design-branch SHA, PR number/base/head.
4. Latest CI run ID, SHA, conclusion and every mandatory job result.
5. Cloudflare production deploy SHA/version and `/api/version` parity result—or NOT_VERIFIED.
6. Supabase current status, schema/migration result and RLS evidence—or BLOCKED_EXTERNAL.
7. Browser checks and screenshots—or NOT_VERIFIED.
8. PASS/FAIL/BLOCKED_EXTERNAL/NOT_VERIFIED/EXPECTED_SECURITY_DENIAL/DEFERRED matrix.
9. Remaining owner actions, rollback plan and known limitations.
10. Never claim 100% completion merely because build/tests passed.

**Start by re-reading this brief and fetching live GitHub/Cloudflare/Supabase state. Do not assume the v700 Antigravity report is the current deployed source.**
