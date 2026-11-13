# Cloudflare Pages Deployment & Release Authority Audit

**Project:** `inshatech`  
**Production URL:** `https://inshatech.pages.dev`  
**Evaluation Standard:** Single Authoritative Production Pipeline

---

## 1. Single Production Deployment Authority

Cloudflare Pages supports two deployment integration models:
1. **Model A: Cloudflare Git Integration** (Automated build triggered on git push).
2. **Model B: GitHub Actions Wrangler Direct Upload** (`cloudflare/pages-action` or direct CLI).

Running both models simultaneously causes race conditions where GitHub Actions queries a release before Cloudflare Pages has finished building the new SHA.

### Recommended Production Decision
- **Authoritative Deployer:** Cloudflare Git Integration on branch `master`.
- **Preview Deployments:** Automatic preview builds on all Pull Request branches (including `fix/*`).
- **Synchronized Wait Gate (`.github/workflows/deploy.yml`)**:
  - Waits up to 60 polling intervals (10-minute timeout) for `/api/version` to return `deploy_sha == expected_sha`.
  - Prohibits premature exit when a previous build SHA is returned.

---

## 2. Environment Bindings Inventory

| Binding Name | Purpose | Production Value Standard |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Target tier | `"production"` |
| `CANONICAL_SUPABASE_PROJECT_REF` | Database identity lock | `"kitwadizsvjmuxkfewxj"` |
| `SUPABASE_URL` | Supabase API URL | `"https://kitwadizsvjmuxkfewxj.supabase.co"` |
| `SUPABASE_ANON_KEY` | Public client API key | Standard restricted key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server function operations | Strictly scoped to edge functions; forbidden in client source |
