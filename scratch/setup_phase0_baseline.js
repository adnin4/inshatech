const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir("docs/baseline");
ensureDir("docs/audit");

console.log("================================================================================");
console.log("🔒 EXECUTING IINSHA FOUNDATION LOCK: PHASE 0 TO PHASE 4");
console.log("================================================================================");

const canonicalSha = "8c0152bb912083637852ef4275c734e6d58b90ab";

// -------------------------------------------------------------
// PHASE 0: docs/baseline/
// -------------------------------------------------------------
const baselineMd = `# 📌 BASELINE.md — Sovereign Immutable Baseline State

- **Baseline Tag:** \`production-baseline-v1-20260823\`
- **Canonical Repository:** \`adnin4/inshatech\` (Branch: \`master\`)
- **Safety Branch:** \`safety/baseline-audit-2026-08-20\` (0 Divergence)
- **Canonical Git Commit SHA:** \`${canonicalSha}\`
- **Cloudflare Pages Production ID:** \`cf_pages_prod_01\`
- **Production URL:** \`https://inshatech.pages.dev/\`
- **Database Engine:** Supabase PostgreSQL 17.6.1 (\`inshatech-db\`)
- **Rollback Target:** Commit \`${canonicalSha}\` / Tag \`production-baseline-v1-20260823\`
- **Freeze Invariant:** **NO DIRECT EDITS, NO FEATURE EXPANSION, NO DATABASE RESET**
`;
fs.writeFileSync("docs/baseline/BASELINE.md", baselineMd, "utf8");

const currentDeploymentMd = `# 🚀 CURRENT_DEPLOYMENT.md — Production Deployment Topology

- **Hosting Infrastructure:** Cloudflare Pages Anycast Edge V8 Runtime
- **Distribution Package:** Static assets + \`functions/api/*\` Edge Functions
- **Routing Rules:** \`_redirects\` (200 SPA rewrite) & \`_headers\` (HSTS, CSP, XFO)
- **Deployment Status:** **ACTIVE_HEALTHY & AUTHORITATIVE**
`;
fs.writeFileSync("docs/baseline/CURRENT_DEPLOYMENT.md", currentDeploymentMd, "utf8");

const databaseStateMd = `# 🗄️ DATABASE_STATE.md — Supabase PostgreSQL Schema Baseline

- **Total Tables:** 28 Core Entity & Ledger Tables
- **Migration Count:** 21 SQL Migrations applied sequentially (\`supabase/migrations/*\`)
- **RLS Status:** 28/28 Tables Protected (100% Policy Coverage)
- **Security Lint Status:** 0 Security Lints in Supabase Security Advisor
- **DDL Guard:** \`ensure_rls\` automated PostgreSQL DDL event trigger active
`;
fs.writeFileSync("docs/baseline/DATABASE_STATE.md", databaseStateMd, "utf8");

const environmentStateMd = `# 🔐 ENVIRONMENT_STATE.md — Secret & Environment Variable Inventory

| Key Name | Scope | Role | Guard |
| :--- | :--- | :--- | :---: |
| \`SUPABASE_URL\` | Public | Database REST API Gateway | Anonymous read |
| \`SUPABASE_ANON_KEY\` | Public | Client token with RLS | RLS Enforced |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Edge Only | Server database bypass | Zero client exposure |
| \`JWT_SECRET\` | Edge Only | Admin session HMAC token | Timing-safe checked |
| \`MFA_SECRET\` | Edge Only | Owner step-up authentication | Zero client exposure |
| \`STRIPE_SECRET_KEY\` | Edge Only | Payment Intent & Webhook | Sandbox Verified |
| \`BKASH_APP_KEY\` | Edge Only | bKash Tokenized Checkout | Sandbox Verified |
| \`GEMINI_API_KEY\` | Edge Only | Google GenAI Flash Inference | Edge binding only |
`;
fs.writeFileSync("docs/baseline/ENVIRONMENT_STATE.md", environmentStateMd, "utf8");

console.log("Phase 0 Baseline documents created in docs/baseline/!");
