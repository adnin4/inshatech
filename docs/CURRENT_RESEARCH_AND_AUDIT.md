# InshaTech — current evidence audit and research notes

**Capture date:** 8 November 2026 (Asia/Dhaka context)  
**Repository:** `https://github.com/adnin4/inshatech`  
**Production domains referenced in the repository and handoffs:** `https://inshatech.pages.dev` and `https://inshatech-b6b.pages.dev`  
**Classification vocabulary:** `PASS`, `FAIL`, `BLOCKED_EXTERNAL`, `NOT_VERIFIED`, `EXPECTED_SECURITY_DENIAL`, `DEFERRED`.

> This is an evidence snapshot, not a production certification. GitHub metadata and run logs below were checked directly through the connected GitHub integration. Supabase metadata was checked through its control-plane integration. Cloudflare account settings and live browser rendering were not accessible in this audit. Do not promote any `NOT_VERIFIED` value to `PASS` without fresh evidence.

## 1. Executive summary

The requested website redesign is a real front-end project, but the highest-risk delivery blockers are release authority and external state, not more speculative AI features.

1. The current default branch is `master`, SHA `b3de7650b65e388514ca82674654c92241ea8811`. The `main` branch is still `45ee4c1f90f699686c71912a7f22598cbe3b0a74`. These refs differ.
2. The site-refresh feature branch currently observed is `feat/iinsha-site-refresh-admin-affiliate-guard-20261108` at `76a91ab82fda8c11fe1140353ede28bdbb3c173d`. Its latest dedicated validation workflow is green, but it is not the canonical production branch and is not the v700 design commit claimed in the supplied handoff.
3. The v700 handoff claims commit `c65da50d3046853d2b19ba22b732c20efb371cc4`. GitHub returned `No commit found for SHA` for that commit in the canonical repository. Its deployment and “109/109” assertions therefore remain `NOT_VERIFIED` from the connected repository's point of view.
4. The current canonical production runtime gate fails because the production `/api/version` endpoint returns deploy SHA `45ee4c1...` while the gate expects `b3de765...`. The following production health and SRE checks are skipped after that mismatch.
5. The canonical Supabase project `kitwadizsvjmuxkfewxj` (`inshatech-db`) currently reports `INACTIVE`. Live database listing fails with `Database is possibly not accessible at the moment`. Database health, migrations, RLS, grants, functions and tenant isolation are therefore blocked from live verification.
6. Cloudflare project settings, production branch, last deployment SHA, domain bindings and deployment controls were not available. The repository's `wrangler.toml` says Pages project name `inshatech`; the supplied v700 handoff points at `inshatech-b6b.pages.dev`. Resolve this project/domain identity before deployment.
7. The current repository's homepage still has a dense 28-section structure and 80+ service cards. The current site-refresh branch does not contain the claimed `hero-centered-stage`, `bento-capabilities`, service search, or a hero 3D canvas hookup.

**Current release ceiling:** `READY_FOR_STAGING` / not production sealed.

## 2. GitHub repository, branches and permissions

| Item | Observed value | Status |
|---|---|---|
| Repository visibility | `PUBLIC` | `PASS` (metadata observed) |
| Default branch | `master` | `PASS` (metadata observed) |
| `master` SHA | `b3de7650b65e388514ca82674654c92241ea8811` | `PASS` (ref observed) |
| `main` SHA | `45ee4c1f90f699686c71912a7f22598cbe3b0a74` | `PASS` (ref observed) |
| Latest captured `main` CI group | `34450370226` (also 34450370238 / 34450370206 / 34450370298) at `45ee4c1...` | `FAIL` (all five captured workflow runs failed, updated 2026-09-10) |
| `master` and `main` parity | Different commit SHAs | `FAIL` for a single-ref policy until the owner chooses the canonical ref and reconciles safely |
| Connected GitHub permission | `pull: true`, `push: false`, no admin/maintain permission | `BLOCKED_EXTERNAL` for writing from this session |
| `master` protection | `protected: false`; required status checks empty | `PASS` (absence of protection directly observed) |
| Repository rulesets | Empty array | `PASS` (no rulesets returned) |
| Current production branch | Repository policy says `master`; Cloudflare control plane not inspected | `NOT_VERIFIED` |

Do not force-push, fast-forward or merge branches just to make SHAs match. Inspect commit graph and file-level differences first. `main` and `master` are divergent operational inputs until proven otherwise.

## 3. Site-refresh branch and PR state

### Current site-refresh branch

- Branch: `feat/iinsha-site-refresh-admin-affiliate-guard-20261108`
- Observed head: `76a91ab82fda8c11fe1140353ede28bdbb3c173d`
- Latest dedicated workflow: `IINSHA Site Refresh Validation`
- Latest run: `42502793415` (pull request event), completed `success`
- Matching push run: `42502787935`, completed `success`
- The validation job's syntax, owner-session, fail-closed API, site-safety, build and public-route/local-asset steps were all successful.
- This is **branch validation only**. It is not production deployment evidence.

The compare against current `master` reports `diverged`, `ahead_by: 37`, `behind_by: 3`; 37 commits and changes spanning `index.html`, `style.css`, `app.js`, `admin.html`, affiliate surfaces, API handlers, CI and documentation. Do not merge the entire long-lived branch blind. Reconcile commits and cherry-pick only reviewed changes after the security and functional diffs are understood.

### PR #67

- PR: `https://github.com/adnin4/inshatech/pull/67`
- State: `OPEN`, `UNMERGED`, non-draft, GitHub reports mergeable.
- Head: `ddf90cfe10a6934ff2a949be7cd9a0002a5c09ad`
- Base: `master`, but reported base SHA is `45ee4c1...`, not current `master` `b3de765...`.
- Last updated: `2026-11-08T16:31:19Z`.
- Purpose: fail-closed release identity and DB evidence, separate workflow SHA from PR head/checked-out SHA, conservative runtime claims.
- The PR description explicitly says no DB migration/reset, no payment activation, no UI/UX redesign, and external production parity remains unverified.

**Action:** reconcile PR #67 with the current base; re-run the current canonical checks; do not merge it automatically as part of the visual redesign.

## 4. CI and production-runtime evidence

### Current latest branch validation

| Workflow | Run | SHA | Conclusion | Classification |
|---|---:|---|---|---|
| IINSHA Site Refresh Validation (PR) | `42502793415` | `76a91ab82fda8c11fe1140353ede28bdbb3c173d` | `success` | `PASS` for that branch's dedicated checks |
| IINSHA Site Refresh Validation (push) | `42502787935` | `76a91ab82fda8c11fe1140353ede28bdbb3c173d` | `success` | `PASS` for that branch's dedicated checks |

### Latest observed canonical-master run set

The most recent captured main-branch workflow group is run `34450370226` (`IINSHA AI-BOS Master Production CI`) plus associated runs `34450370238`, `34450370206` and `34450370298`, all on `45ee4c1...` and all concluded `failure` on 10 September 2026. The more recent master group below is on `b3de765...`. There are no newer master run records in the captured Actions query than the 10 September group. The separate site-refresh branch run on 8 November is not a main/master run.

The currently available master checks are from `2026-09-10` and run against `b3de7650...`. They are stale relative to the 8 November branch-validation run.

| Job/check | Result | Status |
|---|---|---|
| Full Spectrum CI & Certification Gate | Success; individual steps all success | `PASS` for that commit/run only |
| Security, Direct DB Scan & Tenant RLS Isolation | Success | `PASS` for that commit/run only; not a live Supabase certification |
| Browser Interaction, Chaos & Surface Integrity | Success | `PASS` for that commit/run only |
| Pricing Authority, Payment Contracts & Reconciliation | Success | `PASS` for that commit/run only; no live payment-provider proof |
| Zero-Trust Security / Content Leak Audit | Success | `PASS` for that commit/run only |
| Syntax, Visual Baseline & Code Contracts | Success | `PASS` for that commit/run only |
| Post-Deploy Production Runtime Evidence Gate | **Failure** | `FAIL` |

The failing workflow is run `34454052445`; the failed job is `102796334059`. Its logs show:

```text
expected = b3de7650b65e388514ca82674654c92241ea8811
actual   = 45ee4c1f90f699686c71912a7f22598cbe3b0a74
Production SHA mismatch
```

The production `/api/version` endpoint returned `45ee4c1...`; the release gate expected current master `b3de765...`. The `Verify production deployment identity` step failed. `Verify production health endpoint`, `Verify production SRE endpoint`, and the production evidence summary were skipped.

**Interpretation:** build/contract checks passed on the tested source revision, but production is serving a different source SHA. This is a real production parity failure, not a cosmetic warning. Do not seal release or claim live health.

## 5. Current website structure and design implementation audit

The current master homepage contains approximately 28 major content sections and a large set of interleaved service, industry, product, engineering, dashboard, pricing, library, affiliate and trust content. The original HTML exposes 80+ granular service cards under one long service area. The homepage hero currently has four competing CTAs, an AI pre-sales input, and a developer profile / telemetry panel.

This density is the primary visual problem. A fresh CSS palette alone cannot fix information architecture.

### Canonical source findings

At the inspected current site-refresh branch head `76a91ab...`:

- `index.html` is about 220 KB.
- The main public HTML still references the legacy stylesheet and current app controllers.
- The 3D source file `hero3d.js` exists in the repository, but the inspected homepage does not include `#hero3d-container` and does not load `hero3d.js`.
- The existing `.hero-network-visual` is a CSS-only orbital placeholder; it is not the actual Three.js/WebGL scene.
- `css/iinsha-design-system.css` exists but is not linked from the inspected homepage.
- The inspected homepage does not contain `hero-centered-stage`, `bento-capabilities`, `service-live-search`, a `<video>` backdrop or a live 3D canvas hookup.
- The inspected branch adds CSS and small UI changes, but its `index.html` changes only 31 additions / 39 deletions; it is not proof that the v700 full redesign was integrated.
- The public page scripts continue to rely on `app.js`, `src/js/ux_interactions.js`, copilot and WhatsApp modules. Preserve them unless a tested migration replaces them.

### Recommended content architecture

1. **S1 — Hero:** centered headline, concise explanation, two actions, one original orbital 3D scene and a short capability strip. Do not add unsupported performance claims or a cluster of status badges.
2. **S2 — Capabilities:** four spacious bento cards: AI agents, workflow automation, document/data intelligence, custom products/integrations.
3. **S3 — Services:** preserve all original service records; group them by outcome/category, show a small curated initial set, provide working search and filters, and keep every original service destination accessible.
4. **S4 — Process:** Discover → Design → Build → Verify → Handover, with scroll-revealed visual progression and an interactive workflow demo that clearly states whether it is simulated or live.
5. **S5 — Solutions/ROI:** keep the current ROI calculator, blueprint/architecture features and their tested logic, but place them in progressive disclosure rather than multiple overlapping walls of cards.
6. **S6 — Conversion:** preserve authoritative pricing, intake/contact form, WhatsApp, FAQ, and a clear final CTA.
7. **Footer:** preserve privacy, terms, customer portal, store, marketplace, blog, partners and owner/admin links without placing them all in the primary navigation.

### Other pages

Use the same design tokens across public pages, but preserve each page's purpose:

- service pages: spacious editorial page, deliverables/process/FAQ/contact;
- compare/blog/legal pages: readable text-first layouts;
- store/marketplace: product discovery, product detail and checkout hierarchy;
- portal/affiliate/admin: dedicated dashboard design, not a marketing landing page; avoid heavy page-wide 3D backgrounds there.

## 6. Supabase current live state

The connected Supabase organization and project listing returned one project:

| Field | Observed value |
|---|---|
| Project ref | `kitwadizsvjmuxkfewxj` |
| Project name | `inshatech-db` |
| Region | `ap-southeast-1` |
| Postgres | `17.6.1.155` / engine 17 |
| Project status | `INACTIVE` |

`get_project` independently confirmed `INACTIVE`. A live `list_tables` attempt returned `Database is possibly not accessible at the moment`. The parallel attempt to obtain migrations, Edge Functions and advisors hit the same connection blocker.

| Supabase evidence item | Status |
|---|---|
| Organization and project identity | `PASS` (project metadata observed) |
| Project active / DB reachable | `FAIL` / `BLOCKED_EXTERNAL` (inactive + DB unavailable) |
| Current migration head | `BLOCKED_EXTERNAL` |
| Schema/table inventory | `BLOCKED_EXTERNAL` |
| RLS flags and policies | `BLOCKED_EXTERNAL` |
| Table/schema grants | `BLOCKED_EXTERNAL` |
| Views and `security_invoker` | `BLOCKED_EXTERNAL` |
| `SECURITY DEFINER`, `EXECUTE`, `search_path` | `BLOCKED_EXTERNAL` |
| Auth, Storage and Edge Function live state | `BLOCKED_EXTERNAL` |
| Tenant A/B positive and negative tests | `BLOCKED_EXTERNAL` |

**Do not** reset, pause, restore, migrate or modify the database in order to make the audit green. A project restore may have billing/compute consequences and is not authorized by this package. The owner must first decide whether the inactive project is expected, review current cost/status, and explicitly authorize any restore or modification.

For the eventual security review, use the current Supabase security guidance: all exposed-schema tables need RLS; grants and RLS must both be checked; `SECURITY DEFINER` requires special scrutiny because it runs with elevated privileges; default `PUBLIC EXECUTE` must be reviewed; views may bypass RLS unless made security-invoker on supported Postgres versions; UPDATE policies need appropriate SELECT/USING/WITH CHECK boundaries. See the Supabase RLS guide: https://supabase.com/docs/guides/database/postgres/row-level-security.

## 7. Cloudflare, production domains and deployment authority

### What is observed

- Repository `wrangler.toml` says `name = "inshatech"` and `pages_build_output_dir = "."`.
- Current `deploy.yml` triggers on both `main` and `master`.
- The post-deploy runtime evidence job runs only on push to `master` and checks `https://inshatech.pages.dev/api/version`, `/api/health` and `/api/sre/health`.
- The inspected `deploy.yml` does not contain a direct `wrangler pages deploy` command.
- The supplied v700 handoff instead claims live host `inshatech-b6b.pages.dev` and preview host `50cc232f.inshatech-b6b.pages.dev`.
- A current Cloudflare dashboard/API credential was not available. Browser fetch of `pages.dev` URLs from this session was unavailable, so no live page response, header, runtime hash or screenshot is certified here.

| Item | Status |
|---|---|
| Cloudflare project name / account | `NOT_VERIFIED` |
| Connected Git repository | `NOT_VERIFIED` |
| Production branch selected in Pages | `NOT_VERIFIED` |
| Automatic production deployment toggle | `NOT_VERIFIED` |
| Preview deployment configuration | `NOT_VERIFIED` |
| Actual latest production deployment ID and SHA | `NOT_VERIFIED` |
| `inshatech.pages.dev` ↔ project identity | `NOT_VERIFIED` |
| `inshatech-b6b.pages.dev` ↔ project identity | `NOT_VERIFIED` |
| Single production writer authority | `BLOCKED_EXTERNAL` |

The domain/project mismatch must be resolved before release. Do not point the domain, change the Pages project, disable Git integration, add a second deploy writer, or deploy to a guessed project. Preserve previews. Pick exactly one production authority only after the account settings are inspected.

Cloudflare's Pages API supports listing projects and deployments, but these operations require account identity and a suitable Pages read token. Pages write access is needed for mutations. Current docs: https://developers.cloudflare.com/api/resources/pages/.

## 8. Release identity and fail-closed code risks

The inspected current-master `functions/api/version.js` has these risky fallback behaviours:

- it can infer the runtime DB reference from `SUPABASE_URL`, then fall back to the canonical reference;
- it defaults missing `SUPABASE_RUNTIME_HEALTH` to the string `HEALTHY`;
- it can mark database identity as `ACTIVE_HEALTHY_DECLARED` when refs match and the health env is declared/defaulted.

This is not an independent DB health probe. With the connected project currently `INACTIVE`, the public release endpoint must not treat static environment values or a self-referential fallback as live DB availability.

The inspected `functions/_shared/release_identity.js` also fills absent `runtime_sha`, `build_sha` and `source_sha` from `deployment_sha`. That can make missing independent identities look like matching SHA parity. Change the release contract so missing independent evidence remains `UNVERIFIED`, and require separately supplied source/build/deployment/runtime identities.

The root `CANONICAL_SYSTEM_STATE.json` currently records `144afdd...` as current runtime/repository tip while actual `master` is `b3de765...`. The PR and earlier handoffs also describe a second docs copy with a different SHA. Canonical current-tip claims must be generated from the real ref at capture time or stored with explicit `captured_at` and `captured_from_sha`; static snapshots must not impersonate current truth.

## 9. Security and governance

- Repository is public. Earlier handoff reports found no obvious secrets in a current-tree search, but this session did not re-run a complete history/deleted-file/artifact scan. Full secret exposure audit remains `NOT_VERIFIED`.
- Scan current tree, full Git history, deleted files, CI artifacts, PR artifacts and deployment logs. If a credential is discovered: rotate/revoke first, remove from future history where feasible, then re-scan. Do not paste any real credential into an Antigravity prompt, report or chat.
- `master` and `main` both currently report `protected: false`; `rulesets` returned `[]`. This is a `PASS` for observing the absence of governance, but it is a serious risk. First stabilize unique canonical CI check names; then have the repository owner configure a required PR/ruleset policy.
- Do not place owner bypass or authentication bypass functionality into public UI. Owner access must remain server-verified and must never be implemented as an unauthenticated “one-click login”.

## 10. Diagram reference research and motion design translation

The Landing Love Diagram showcase identifies a dark SaaS/AI design direction and preserves a full recording plus separate clips for the hero, feature sections and footer. The listing describes the hero and features using scroll animation labels. Landing Love's own description explains that full-page recordings reveal details still images miss: content settling on scroll, hover-revealed elements and 3D scenes reacting to scrolling. This suggests a section-by-section motion system rather than a single animated background.

The original implementation below is intentionally inspired by that broad visual language, not an exact reproduction:

- dark, quiet canvas; highly legible white typography;
- centered editorial hero with original planetary orbit scene;
- spacious bento cards, not dozens of equally-weighted mini-panels;
- 3D scene with slow orbit/scroll parallax that remains behind content;
- section reveals and small staggered entrances;
- restrained hover motion and clear interactive focus states;
- service filter/search rather than deleting catalogue items;
- mobile and `prefers-reduced-motion` fallbacks;
- no copied Diagram video, logos, screenshots, source or proprietary media.

Reference: https://www.landing.love/sites/diagram/  
Reference catalogue: https://www.landing.love/  
Motion accessibility: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion  
GSAP scroll choreography reference (only if the project elects to add GSAP): https://gsap.com/docs/v3/Plugins/ScrollTrigger/.

## 11. Final truth matrix

| Workstream | Status now | Evidence / reason |
|---|---|---|
| GitHub repo and canonical ref metadata | `PASS` | Direct metadata read |
| Master SHA | `PASS` | `b3de7650...` |
| Main SHA | `PASS` | `45ee4c1...` |
| Main/master parity | `FAIL` | SHAs differ |
| GitHub write access in this session | `BLOCKED_EXTERNAL` | `push: false`, admin false |
| Master/main branch protection | `PASS` (absence observed) | both `protected: false`; rulesets `[]` |
| Site-refresh branch validation | `PASS` | run `42502793415`, head `76a91ab...` |
| Master full-spectrum CI | `PASS` for the captured run only | run `34454052445`, audit job success |
| Master post-deploy production SHA parity | `FAIL` | deployed `45ee4c1...`, expected `b3de765...` |
| Master production health/SRE checks in that run | `DEFERRED` | skipped after deploy SHA mismatch |
| v700 commit `c65da50...` in canonical GitHub | `NOT_VERIFIED` | GitHub returned no commit for SHA |
| Current branch contains v700 3D/bento/search integration | `FAIL` | inspected source lacks the described markup/script hookups |
| Current homepage content density | `PASS` (problem observed) | ~28 sections and 80+ service cards |
| Supabase project identity | `PASS` | `kitwadizsvjmuxkfewxj`, `inshatech-db` |
| Supabase project active / DB query access | `FAIL` / `BLOCKED_EXTERNAL` | project `INACTIVE`, DB inaccessible |
| Supabase migration/RLS/grants/functions | `BLOCKED_EXTERNAL` | live database not available |
| Cloudflare project and domain identity | `NOT_VERIFIED` | no Pages control-plane credential |
| Cloudflare single deployment authority | `BLOCKED_EXTERNAL` | account config not accessible |
| Production payments / settlement / revenue | `NOT_VERIFIED` | no live provider/settlement evidence in this audit |
| Autonomous production operation | `NOT_VERIFIED` | no end-to-end live authority/evidence |
| Production certification | `DEFERRED` | keep ceiling at `READY_FOR_STAGING` |

**Do not declare the full production release sealed.** The visual redesign can be built on a feature branch while infrastructure blockers are being resolved, but it must not be presented as production-ready until the relevant release gates pass on the exact deployed SHA.
