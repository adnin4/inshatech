# IINSHATECH CLOUDFLARE PAGES & WORKERS DEPLOYMENT GUIDE

## 1. Cloudflare Pages Setup (`inshatech.pages.dev`)
1. Connect Cloudflare Pages to GitHub Repository `adnin4/inshatech`.
2. Build Settings:
   - **Framework Preset**: None
   - **Build Command**: `None` (leave BLANK)
   - **Build Output Directory**: `./` (or leave BLANK)

---

## 2. Cloudflare Workers Setup (`worker.js`)
1. Run `npx wrangler deploy` to publish the serverless Edge API Gateway.
2. Bind environment variables (`ENVIRONMENT`, `BDT_EXCHANGE_RATE`, `SUPABASE_URL`).
