# InshaTech — implementation roadmap and remaining work

## What the redesign is meant to achieve

The visible marketing site should become a premium, service-led engineering studio rather than a dense technical catalogue. The main page tells a simple story: what InshaTech builds, which business problems it solves, how delivery works, and how to start a project. Detailed service records, technical details, pricing rules and owner tools remain accessible without crowding the first screen.

## Design system and motion requirements

| Area | Implementation requirement | Acceptance evidence |
|---|---|---|
| Canvas | Deep obsidian background, restrained violet/cyan light, good text contrast | Screenshot at desktop/mobile and contrast audit |
| Hero | Centered copy, one clear promise, two useful CTAs, original 3D orbital canvas | Desktop/mobile screenshots, keyboard CTA test |
| 3D motion | Original WebGL2 orbit scene, perspective, slow rotation and subtle pointer/scroll parallax | WebGL supported + fallback tests, no layout blocking |
| Video | Optional only when the owner supplies/licences a real asset; use poster fallback and lazy-load | Network/performance check; no third-party scraped video |
| Scroll motion | Reveal/stagger per section; never animate long text line by line | Reduced-motion and scroll E2E checks |
| Bento | Four capability cards with distinct visual diagrams and roomy copy | 4-column/2-column/1-column screenshots |
| Services | Preserve every original service, category map, search/filter, no dead links | All legacy service nodes accounted for and filter tests |
| Conversion | Preserve intake/contact, WhatsApp, ROI tool, pricing and FAQs | Form and pricing E2E with existing server API |
| Dashboard pages | Shared tokens but low-motion dedicated dashboard components | Admin/portal/affiliate regression screenshots |
| Accessibility | Semantic structure, keyboard operation, visible focus, reduced motion | Axe/WCAG audit and keyboard-only run |

## Phase 0 — establish a safe base

1. Verify local workspace and repository identity: `git status --short`, `git remote -v`, `git branch --show-current`, `git fetch --all --prune`, `git rev-parse origin/master`, `git rev-parse origin/main`.
2. Record the exact base commit and tree; do not use the stale values in this file as an editing base.
3. Confirm GitHub owner-level write permission in the actual Antigravity environment. The ChatGPT GitHub connector observed here is read-only.
4. Inspect PR #67 and the 37-ahead / 3-behind site-refresh branch. Compare file-by-file before choosing code to retain.
5. Create a separate design branch from the currently verified intended canonical base. Keep the uncommitted user working tree safe.

**Exit:** clean branch, correct repository, exact base SHA recorded, no force push or destructive cleanup.

## Phase 1 — information architecture and component inventory

1. Inventory every route and every public HTML page.
2. Map all existing homepage sections and list which are duplicated, low-value, operational-only or necessary for conversion.
3. Inventory every form, API route, click handler, modal, data source, pricing calculation and navigation destination.
4. Inventory all `.service-item-card` records; capture exact title, description, category, URL and current data source.
5. Produce a route/component preservation matrix and a before screenshot baseline.

**Exit:** every old feature is marked keep / consolidate / move / remove with a reason. No feature is silently dropped.

## Phase 2 — homepage visual rebuild

1. Build the S1-S6 structure from `integration/homepage-redesign-skeleton.html`.
2. Move original functional DOM into the new sections; do not recreate payment, auth, ROI or lead forms with fake local logic.
3. Add `css/iinsha-diagram-design-system.css` to the homepage after legacy CSS, but scope rules to `.iinsha-cinematic-site` to prevent CSS leakage.
4. Add the motion engine script after the canvas and at the end of the page or use `defer` consistently.
5. Add service category metadata and wire `src/js/iinsha-service-discovery.js` to the full retained catalogue.
6. Build a clean mobile nav and keep owner/admin/client access discoverable in footer or a utility menu.
7. Use original diagram illustrations. Do not copy Diagram brand/media or embed their video.

**Exit:** visual review accepted at 1440, 1024, 820, 560, 390 and 360 px; no overflow or overlapping copy.

## Phase 3 — full website visual consistency

| Route/page class | Target |
|---|---|
| Homepage | New cinematic editorial landing page |
| 10 service details | Shared hero, deliverables, delivery process, FAQ, CTA |
| Store and marketplace | Product browsing, detail, trusted pricing and checkout hierarchy |
| Compare/blog/legal | Clean text-first reading layout |
| Customer portal | Clear task/status/dashboard surface |
| Affiliate portal/login | Secure partner dashboard and login; no public demo owner access |
| Admin | Dedicated professional control cockpit; preserve MFA/authorization |

Do not apply a full viewport 3D background to every application page. Use motion only where it improves comprehension and keep dashboard motion restrained.

## Phase 4 — business functionality regression

Test each original workflow after DOM movement:

- AI Solution Finder input/presets/result rendering;
- pre-sales enquiry flow and fallback;
- every service search/category filter and original service link;
- existing terminal/workflow simulator with `SIMULATED` vs `LIVE` distinction;
- ROI calculator calculation and assumption labels;
- architecture builder and blueprint explorer;
- pricing/catalog authority and currency display;
- coupon validation and checkout server response;
- payment initiation, webhook and return-state handling;
- intake/contact form validation, success/error states and WhatsApp fallback;
- FAQs, newsletter, modals, command palette, close/escape handling;
- authentication, MFA, admin role gate, affiliate login, portal session and logout;
- keyboard/touch navigation and back/forward anchor navigation.

A button is not functional because it looks clickable. Each link and control must have a tested outcome.

## Phase 5 — security, database and release truth

1. Fix release identity fallbacks so missing source/build/deploy/runtime SHA values remain `UNVERIFIED`.
2. Remove `SUPABASE_RUNTIME_HEALTH` default-to-healthy behavior; require a real, bounded, read-only DB probe or independent control-plane proof.
3. Reconcile both copies of canonical state and stop storing mutable “current SHA” as an unaudited constant.
4. Resolve main/master authority after graph review. Do not force-sync branches.
5. Inspect Cloudflare project id/name, Git repository, production branch, auto-deploy toggle, preview configuration, exact production deployment and aliases.
6. Choose one production writer. Preserve PR previews. Do not guess or rename project/domain.
7. Resolve Supabase `INACTIVE` state with the owner, confirm cost/impact, then perform read-only schema/migration/advisor/RLS/grants/function review. No reset or blind migration.
8. Establish unique required checks; then owner enables PR/ruleset protection for the chosen canonical branch.

## Phase 6 — launch QA and exact release verification

- Run `npm ci` from a clean checkout.
- Run all existing package scripts from the actual `package.json`; record command, exit code and artifact.
- Run syntax checks for all changed JS and HTML/CSS validators.
- Run browser tests on desktop/mobile and relevant Chromium/Firefox/WebKit if the project supports them.
- Run accessibility and reduced-motion checks.
- Verify no horizontal overflow, text collisions, inaccessible overlays, clipped sticky elements or keyboard traps.
- Verify all local assets, canonical URLs, metadata, sitemap, robots and structured data.
- Verify production `/api/version`, `/api/health`, `/api/sre/health`, browser route and exact source/build/deploy/runtime/API/browser SHA.
- Health/SRE checks skipped after a deployment SHA mismatch must be re-run after parity is restored.
- Capture screenshots and Playwright reports at the same commit SHA being proposed for release.

**Production seal rule:** every required gate must be `PASS` on the same release source/build/deployment/runtime identity. A test count does not prove production state.

## Remaining workstreams (short list)

There are at least **12 distinct workstreams** remaining before the entire platform can honestly be called complete:

1. Git history/base reconciliation and canonical branch decision.
2. Release-evidence false-green hardening and static state synchronization.
3. Cloudflare project/domain/deployment-authority certification.
4. Supabase active state, migrations, schema, RLS, grants and tenant isolation.
5. Homepage information architecture and motion redesign.
6. All service pages and global public-site design consistency.
7. Store/marketplace/customer/affiliate/admin interface consistency and regression.
8. Full browser E2E, accessibility, mobile and performance verification.
9. GitHub CI/ruleset and public-repository secret/history audit.
10. Production payment provider, webhook/replay/concurrency and settlement evidence.
11. Finance ledger, reconciliation, backup/restore and rollback drills.
12. Real customer pilot, support/delivery, revenue proof and bounded agent autonomy.

Some of these are independent tracks and can run in parallel after the repository base is stable. None should be declared done solely because code exists or a unit test passed.
