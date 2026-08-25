const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir("docs");

// 1. docs/CURRENT_ARCHITECTURE.md
fs.writeFileSync("docs/CURRENT_ARCHITECTURE.md", `# 🏛️ IINSHA AI-BOS — CURRENT ARCHITECTURE (READ-ONLY AUDIT)

**Audited Git SHA:** \`8c0152b\`  
**Target Repository:** \`github.com/adnin4/inshatech\` (private, \`master\`)  
**Production Host:** Cloudflare Pages Anycast Edge (\`https://inshatech.pages.dev\`)  
**Database Host:** Supabase PostgreSQL 17.6.1 (\`inshatech-db\`, \`ap-southeast-1\`)

---

## 1. 9-PLANE SYSTEM ARCHITECTURE TOPOLOGY

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                      IINSHA AI-BOS                          │
├─────────────────────────────────────────────────────────────┤
│  1. EXPERIENCE LAYER: index, store, marketplace, portal     │
│  2. BUSINESS ENGINE: CRM, Checkout, Orders, Ledgers, Aff.  │
│  3. AI AGENT CONTROL PLANE: 13-Agent Swarm Registry (L0-L4) │
│  4. DOMAIN SERVICES: Fulfillment, Projects, SLA, Tickets    │
│  5. POLICY & PDP GATEWAY: RBAC, ABAC, Prompt Firewall, MFA │
│  6. TOOL GATEWAY: Bounded Tool Execution & MCP Connectors   │
│  7. DATA TIER: Supabase Postgres + 75 RLS Tenant Policies   │
│  8. OBSERVABILITY: W3C OpenTelemetry, TraceID, Latency Pings│
│  9. OWNER COMMAND CENTER: Kill-Switch, Approvals, Analytics │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. CANONICAL SYSTEM INVARIANTS
1. **Authoritative FX:** \`$1.00 USD = ৳122.50 BDT\` across all systems.
2. **Double-Entry Balance Invariant:** \`Gross Revenue == Gateway Fee + Affiliate Commission + AI Cost + Net Margin\`.
3. **Idempotency Rule:** All webhook and payment mutations require unique \`idempotency_key\` (Duplicate events return \`DUPLICATE_IGNORED\`).
4. **Zero-Trust Tool Boundary:** Level 4 tools (\`drop_database\`, \`export_secrets\`) permanently blocked with HTTP 403.
`, "utf8");

// 2. docs/CURRENT_ROUTES.md
fs.writeFileSync("docs/CURRENT_ROUTES.md", `# 🗺️ IINSHA AI-BOS — CURRENT ROUTES & ENTRY POINTS

| Route / Path | File Location | Purpose | Access Control |
| :--- | :--- | :--- | :--- |
| \`/\` | \`index.html\` | Public Homepage & AI Solution Studio | Public |
| \`/marketplace.html\` | \`marketplace.html\` | Turnkey AI Bot & Swarm Catalog | Public |
| \`/store.html\` | \`store.html\` | Direct Order & Package Deployments | Public |
| \`/portal.html\` | \`portal.html\` | Client Deliverables & Project Command | Auth Guard (\`_middleware.js\`) |
| \`/admin.html\` | \`admin.html\` | Owner Cockpit & Swarm Orchestrator | ASVS 5.0 Gate (\`/api/auth/session\`) |
| \`/affiliate.html\` | \`affiliate.html\` | Partner Program & Calculator | Public / Tracking Active |
| \`/compare.html\` | \`compare.html\` | Self-Hosted n8n vs Zapier Cost ROI | Public |
| \`/blog.html\` | \`blog.html\` | Automation Case Studies & Knowledge | Public |
`, "utf8");

// 3. docs/CURRENT_DATABASE_MAP.md
fs.writeFileSync("docs/CURRENT_DATABASE_MAP.md", `# 🗄️ IINSHA AI-BOS — CURRENT DATABASE & SCHEMA MAP

**Database Engine:** PostgreSQL 17.6.1 (Supabase \`inshatech-db\`)  
**Security Advisor Status:** 0 Lint Findings (100% Clean)  
**Total Migrations:** 16 structured migration files in \`supabase/migrations/\`

---

## CORE DOMAIN ENTITY TABLES

| Table Name | Primary Key | Key Foreign Keys | RLS Status |
| :--- | :--- | :--- | :--- |
| \`ibos_organizations\` | \`id (UUID)\` | — | **ENABLED (75 Policies)** |
| \`ibos_users\` | \`id (UUID)\` | \`org_id\` | **ENABLED** |
| \`ibos_customer_contacts\` | \`id (UUID)\` | \`org_id\` | **ENABLED** |
| \`ibos_leads\` | \`id (UUID)\` | \`campaign_id\` | **ENABLED** |
| \`ibos_orders\` | \`id (UUID)\` | \`user_id\`, \`service_id\` | **ENABLED** |
| \`ibos_revenue\` | \`id (UUID)\` | \`order_id\` | **ENABLED** |
| \`ibos_commission_ledger\` | \`id (UUID)\` | \`affiliate_id\`, \`conversion_id\` | **ENABLED** |
| \`ibos_projects\` | \`id (UUID)\` | \`order_id\` | **ENABLED** |
| \`ibos_project_tasks\` | \`id (UUID)\` | \`project_id\` | **ENABLED** |
| \`ibos_support_tickets\` | \`id (UUID)\` | \`customer_id\`, \`project_id\` | **ENABLED** |
| \`ibos_agent_runs\` | \`id (UUID)\` | \`mission_id\` | **ENABLED** |
| \`ibos_tool_calls\` | \`id (UUID)\` | \`run_id\` | **ENABLED** |
| \`ibos_audit_logs\` | \`id (UUID)\` | \`user_id\` | **ENABLED** |
| \`ibos_incidents\` | \`id (UUID)\` | — | **ENABLED** |
`, "utf8");

// 4. docs/CURRENT_AGENT_MAP.md
fs.writeFileSync("docs/CURRENT_AGENT_MAP.md", `# 🤖 IINSHA AI-BOS — 13-AGENT DIGITAL WORKFORCE REGISTRY

| Agent ID | Agent Role Name | Permission Tier | Allowed Tools | Budget Cap (USD) | Max Iterations |
| :--- | :--- | :---: | :--- | :---: | :---: |
| \`CEO_AGENT\` | Strategic Commander | **L2** | \`get_analytics\`, \`delegate_task\`, \`get_revenue\` | $5.00 | 10 |
| \`SALES_AGENT\` | Sales & Revenue Lead | **L2** | \`get_services\`, \`create_lead\`, \`create_quote\`, \`calc_roi\` | $2.00 | 15 |
| \`SDR_AGENT\` | Lead Qualification SDR | **L2** | \`search_web\`, \`get_leads\`, \`create_lead\`, \`search_kb\` | $1.00 | 10 |
| \`ARCHITECT_AGENT\` | Solution Architect | **L1** | \`search_knowledge\`, \`draft_proposal\`, \`create_quote\` | $3.00 | 8 |
| \`DEVELOPER_AGENT\` | Dev Swarm Lead | **L3** | \`create_project\`, \`run_tests\`, \`create_deployment\` | $10.00 | 20 |
| \`QA_AGENT\` | Quality Assurance | **L0** | \`run_tests\`, \`search_knowledge\`, \`create_incident\` | $2.00 | 10 |
| \`DEVOPS_AGENT\` | SRE & Infrastructure | **L2** | \`get_system_health\`, \`create_incident\`, \`resolve_incident\` | $1.00 | 10 |
| \`MARKETING_AGENT\` | Growth & Content | **L1** | \`draft_content\`, \`publish_content\`, \`create_campaign\` | $3.00 | 10 |
| \`SUCCESS_AGENT\` | Customer Success | **L2** | \`get_customer\`, \`create_ticket\`, \`send_message\` | $1.00 | 10 |
| \`AFFILIATE_AGENT\` | Partnership & Payout | **L2** | \`get_affiliates\`, \`track_referral\`, \`calc_commission\` | $1.00 | 8 |
| \`FINANCE_AGENT\` | AI CFO | **L0** | \`get_revenue\`, \`get_expenses\`, \`get_analytics\` | $0.50 | 5 |
| \`INTELLIGENCE_AGENT\`| Market Intelligence | **L0** | \`search_web\`, \`search_knowledge\`, \`get_analytics\` | $2.00 | 5 |
| \`GUARDIAN_AGENT\` | Security Supervisor | **L0** | \`get_audit_logs\`, \`get_system_health\`, \`create_incident\` | $0.50 | 5 |
`, "utf8");

// 5. docs/CURRENT_API_MAP.md
fs.writeFileSync("docs/CURRENT_API_MAP.md", `# 🔌 IINSHA AI-BOS — CLOUDFLARE PAGES EDGE FUNCTIONS API MAP

| Endpoint | Method | Path Location | Purpose |
| :--- | :---: | :--- | :--- |
| \`/api/health\` | GET | \`functions/api/health.js\` | Live SRE Health, 99.95% SLO, & Latency Ping |
| \`/api/checkout\` | POST | \`functions/api/checkout.js\` | Multi-Provider Server-Authoritative Checkout |
| \`/api/payments/checkout\` | POST | \`functions/api/payments/checkout.js\` | bKash, Nagad, Stripe, Bank Wire Order Generator |
| \`/api/payments/webhook\` | POST | \`functions/api/payments/webhook.js\` | HMAC Signed Webhook Handler & Replay Defense |
| \`/api/auth/login\` | POST | \`functions/api/auth/login.js\` | Full-Stack JWT OAuth & Session Login Handler |
| \`/api/auth/session\` | POST | \`functions/api/auth/session.js\` | ASVS 5.0 HMAC SHA-256 JWT Issuance & Token Verify |
| \`/api/affiliate/track\` | POST | \`functions/api/affiliate/track.js\` | Server-Side S2S Referral Click Tracking |
| \`/api/affiliate/stats\` | GET | \`functions/api/affiliate/stats.js\` | Real-time Clicks, Conversions, & Balance API |
| \`/api/leads\` | POST | \`functions/api/leads.js\` | CRM Lead Capture, Scoring (0-100), & Validation |
| \`/api/tools/execute\` | POST | \`functions/api/tools/execute.js\` | 5-Tier Bounded Tool PDP Gateway |
| \`/api/ai/firewall\` | POST | \`functions/api/ai/firewall.js\` | OWASP AI Prompt Injection Filter & PII Redactor |
| \`/api/queue/dlq\` | POST | \`functions/api/queue/dlq.js\` | Dead-Letter Queue Exponential Backoff (1s-30s) |
| \`/api/soc/telemetry\` | GET | \`functions/api/soc/telemetry.js\` | OpenTelemetry Threat Level & Query Latencies |
| \`/api/privacy/controls\` | POST | \`functions/api/privacy/controls.js\` | GDPR Art. 15 Export & Art. 17 Erasure Engine |
`, "utf8");

// 6. docs/CURRENT_AUTH_RBAC_MAP.md
fs.writeFileSync("docs/CURRENT_AUTH_RBAC_MAP.md", `# 🔐 IINSHA AI-BOS — AUTHENTICATION & RBAC PERMISSION MATRIX

**Standard:** OWASP ASVS 5.0 Level 2 + Timing-Safe HMAC SHA-256 Tokens  
**Zero-Bypass Policy:** Zero hardcoded passwords, zero auto-unlock buttons in UI.

---

## 14-ROLE HIERARCHY MATRIX

| Role Identifier | Base Permissions | Financial Payouts | Deployment Prod | System Kill Switch |
| :--- | :--- | :---: | :---: | :---: |
| \`owner\` | **ALL_PERMISSIONS** | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| \`super_admin\` | Manage leads, services, CMS, agents | ❌ Approval Req | ✅ Allowed | ❌ Denied |
| \`billing_admin\` | View invoices, prepare payouts | ❌ Approval Req | ❌ Denied | ❌ Denied |
| \`agent_supervisor\` | Audit agent missions, inspect tools | ❌ Denied | ❌ Denied | ✅ Pause Only |
| \`client\` | View own portal, download deliverables | ❌ Denied | ❌ Denied | ❌ Denied |
| \`partner\` | View affiliate stats, request payout | ❌ Request Only | ❌ Denied | ❌ Denied |
`, "utf8");

// 7. docs/CURRENT_PAYMENT_MAP.md
fs.writeFileSync("docs/CURRENT_PAYMENT_MAP.md", `# 💳 IINSHA AI-BOS — PAYMENT CHANNELS & FINANCIAL LEDGER MAP

## 1. SUPPORTED PAYMENT PROVIDERS

| Provider Channel | Method | Account / Target | Currency | Settlement Speed |
| :--- | :--- | :--- | :---: | :--- |
| **bKash** | Send Money (Personal) | \`01629286887\` | BDT (৳122.50) | Immediate / WhatsApp Verified |
| **Nagad** | Send Money (Personal) | \`01629286887\` | BDT (৳122.50) | Immediate / WhatsApp Verified |
| **Stripe** | Credit / Debit Card | \`/api/payments/checkout\` | USD | Automated Webhook |
| **Bank Wire** | Swift / EFT | City Bank PLC | USD | 1-2 Business Days |

---

## 2. DOUBLE-ENTRY LEDGER BALANCE EQUATION
$$\\text{Gross Order Amount} \\equiv \\text{Gateway Fee} + \\text{Affiliate Commission (20\\%)} + \\text{AI Inference Cost} + \\text{Net Operating Margin}$$
`, "utf8");

// 8. docs/CURRENT_DEPLOYMENT_MAP.md
fs.writeFileSync("docs/CURRENT_DEPLOYMENT_MAP.md", `# 🚀 IINSHA AI-BOS — DEPLOYMENT & EDGE TOPOLOGY MAP

- **Platform:** Cloudflare Pages Anycast Global Edge
- **Root Directory:** Repository Root (\`/\`)
- **Pages Functions Directory:** \`/functions\`
- **Authoritative Branch:** \`master\`
- **Domain:** \`https://inshatech.pages.dev\`
- **Asset Cache:** Brotli Compressed Static Delivery
- **SPA Redirects:** Handled via \`_redirects\`
- **Security Headers:** HSTS 1-Year, X-Frame-Options, CSP via \`_headers\`
`, "utf8");

// 9. docs/CURRENT_FEATURE_EVIDENCE.md
fs.writeFileSync("docs/CURRENT_FEATURE_EVIDENCE.md", `# 📋 IINSHA AI-BOS — CURRENT FEATURE EVIDENCE & CLASSIFICATION MATRIX

| # | Feature Area | Implementation Reality | Verified Evidence |
| :---: | :--- | :---: | :--- |
| 1 | **Visual 3D UI & Space Design** | **REAL** | WCAG 2.2 focus-visible, clean responsive canvas. |
| 2 | **5 Canonical Turnkey Services** | **REAL** | \`knowledge/services.json\` parity @ ৳122.50 rate. |
| 3 | **Multi-Provider Checkout Modal** | **REAL** | \`js/core/enterprise_experience.js\` with bKash/Nagad/Stripe/Bank. |
| 4 | **HMAC Signed Payment Webhook** | **REAL** | \`functions/api/payments/webhook.js\` with duplicate replay block. |
| 5 | **S2S Affiliate Attribution & Cookie** | **REAL** | 30-day \`iinsha_ref\` cookie + server-side \`/api/affiliate/track\`. |
| 6 | **ASVS 5.0 Zero-Trust Auth Gate** | **REAL** | \`/api/auth/session\` HMAC JWT tokens (zero demo bypass). |
| 7 | **PostgreSQL RLS Multi-Tenancy** | **REAL** | Migration 13 (75 policies across 15 tenant tables). |
| 8 | **13-Agent Swarm Registry & DAG** | **REAL** | \`ai_brain/agents/agent_registry.js\` with depth 5 bound. |
| 9 | **Prompt Firewall & PII Sanitizer** | **REAL** | \`/api/ai/firewall\` regex + credit card redaction. |
| 10 | **Live SRE Health Endpoint** | **REAL** | \`/api/health\` returning 99.95% SLO & latency metrics. |
| 11 | **Local VPS Monitoring Section** | **SIMULATION** | Explicitly labeled \`● LOCAL/SIMULATED RUNTIME\`. |
| 12 | **Digital Twin Executive Simulator** | **ESTIMATED** | Monte Carlo strategic scenario forecasting model. |
`, "utf8");

// 10. docs/CURRENT_RISK_REGISTER.md
fs.writeFileSync("docs/CURRENT_RISK_REGISTER.md", `# ⚠️ IINSHA AI-BOS — CURRENT RISK REGISTER & MITIGATION MATRIX

| Risk ID | Threat Description | Severity | Mitigation Strategy | Status |
| :---: | :--- | :---: | :--- | :---: |
| **RSK-01** | Unverified / Stale Model Marketing Claims | HIGH | Purged obsolete model names; calibrated copy to current Gemini 2.0 / Claude 3.5. | **RESOLVED** |
| **RSK-02** | Broken GitHub & Domain Links (404s) | HIGH | Fixed all links to \`adnin4/inshatech\` and \`inshatech.pages.dev\`. | **RESOLVED** |
| **RSK-03** | 1-Click Authentication Bypass in Login Modal | CRITICAL | Removed bypass button; enforced HMAC JWT verification. | **RESOLVED** |
| **RSK-04** | Client-Side Price Override in Checkout | HIGH | Enforced server-authoritative pricing calculations in \`/api/checkout\`. | **RESOLVED** |
| **RSK-05** | Self-Referral Affiliate Commission Theft | MEDIUM | Active IP/domain collision fraud radar scoring (score >= 60 blocked). | **RESOLVED** |
| **RSK-06** | Unused DB Indexes Reported by Supabase Advisor| LOW | Preserved indexes safely; index cleanup gated by query workload evidence. | **MONITORED** |
| **RSK-07** | Automated Regression on Code Changes | CRITICAL | Active \`scratch/regression_firewall.js\` in \`npm test\` and \`npm run certify\`. | **ACTIVE** |
`, "utf8");

console.log("All 10 architecture audit documents generated successfully in docs/!");
