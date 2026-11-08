# IINSHA TECH — DEPLOYMENT & ROLLBACK RUNBOOK (V1000)
**System:** IINSHA AI-BOS & Cloudflare Pages  
**Target Environment:** Staging / Production  
**Authority:** Cloudflare Wrangler Direct Upload (`inshatech` project)  
**Status:** `READY_FOR_STAGING`

---

## 1. Cloudflare Pages Configuration

- **Pages Project Name:** `inshatech`
- **Canonical Brand Domain (Source Contract):** `https://inshatech.pages.dev/`
- **Active Edge Subdomain:** `https://inshatech-b6b.pages.dev/`
- **Root Directory:** Repository root (`.`)
- **Functions Path:** `functions/`
- **Static Assets:** HTML, CSS, JS, Assets, JSON data

---

## 2. Deployment Procedure

To deploy an updated release candidate directly to Cloudflare Pages:

```bash
# 1. Run full test suite & hero geometry verification
npm test
node scripts/test_hero_geometry_regression.mjs
node scripts/ci_evidence_runner.mjs

# 2. Synchronize cache busters across all 13 HTML files
node scripts/cache_bust_all_pages.mjs

# 3. Direct deploy via Wrangler CLI
npx wrangler pages deploy . --project-name inshatech --branch master
```

---

## 3. Post-Deployment Verification Checklist

Immediately upon receiving the deployment URL, verify the edge response:

```bash
node scripts/verify_live_edge.mjs
```

Verify that the output confirms:
- `Live Deploy SHA`: Matches local commit HEAD.
- `Has v900 cache buster`: `true`
- `Has WebGL2 Diagram Scene Canvas`: `true`
- `Has Centered Hero Stage`: `true`
- `Has Bento Capabilities Section`: `true`
- `Admin has bypass logic`: `false`

---

## 4. Rollback Procedure

If a critical regression is detected on Cloudflare Pages:

1. **Instant Cloudflare Edge Rollback:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **inshatech**.
   - Navigate to the **Deployments** tab.
   - Locate the prior known-good deployment:
     * Known-Good Target: `88f142ccffdde7cbc6f1ef1a6e722bc9c60c2bdf` or `3741d4af96eeb023141b851d327e144624e6e71b`.
   - Click the three dots `...` next to that deployment and select **"Rollback to this deployment"**.
   - Edge rollback completes globally in < 5 seconds.

2. **Git Local Tree Rollback (if necessary):**
   ```bash
   git revert HEAD
   npx wrangler pages deploy . --project-name inshatech --branch master
   ```
