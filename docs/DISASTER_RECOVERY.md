# IINSHATECH DISASTER RECOVERY & BACKUP STRATEGY

## 1. Disaster Recovery Procedures

### Scenario A: Database Schema Corruption or Data Loss
1. Restore schema using `/supabase/migrations/20260809000000_init_iinsha_os.sql`.
2. Re-import initial dynamic data dictionary via `worker.js` seed route (`/api/content/words`).

### Scenario B: Deployment Build Failure on Cloudflare
1. Verify `wrangler.toml` exclude rules: `exclude = ["*.zip", "*.py", "*.png", "*.log"]`.
2. Run `python purge_heavy_files.py` locally to untrack any heavy temporary files.
3. Push to `master` and trigger GitHub Actions (`.github/workflows/deploy.yml`).

---

## 2. Secret Rotation Procedure
1. Rotate `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Supabase Project Settings.
2. Update Cloudflare Workers Environment Variables via `npx wrangler secret put SUPABASE_URL`.
