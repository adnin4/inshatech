# IINSHA AI-BOS: ELITE AUTONOMOUS ARCHITECTURE & EXECUTION BLUEPRINT
**Version**: 2026.1.0-PRODUCTION-CORE  
**Classification**: CANONICAL SYSTEM ARCHITECTURE & AUTONOMOUS AGENT DIRECTIVE  
**Lead Architect & Solution Authority**: Adnin Sadat Mahin / IINSHA Studio  
**Governance Standard**: NIST 2026 AI Agent Standards & OWASP Agentic Control Standard  

---

## EXECUTIVE SUMMARY & AUDIT DISCLOSURE
This blueprint provides the definitive, non-simulated architectural specification for the **IINSHA AI-BOS (Autonomous Company Operating System & Frontier Ecosystem Platform)**. Every database relation, REST/RPC contract, frontend state machine, and CI/CD verification gate is codified for direct ingestion by Autonomous AI Engineering Agents.

---

# PHASE 1: ARCHITECTURE & TECH STACK DECISION

### 1. Architectural Topology
```
[ Global Edge CDN: Cloudflare Pages / Anycast DNS ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Static Core UI (12 Pages) ]   [ Edge Functions Layer (V8 Workers) ]
(Glassmorphism / Semantic DOM)   ├── /api/version (Release Identity Fail-Closed)
                                ├── /api/payments/* (Server-Side Pricing FSM)
                                ├── /api/affiliate/* (Anti-Fraud Click/Lead Engine)
                                └── /api/solution-finder (AI Multi-Agent Gateway)
                                            │
                                            ▼
                              [ Supabase Enterprise (PostgreSQL 16) ]
                                ├── Hardened RLS (159 declarations)
                                ├── search_path = '' SECURITY DEFINER Functions
                                ├── Strict Multi-Tenant Schema Partitioning
                                └── Realtime WAL & Vector Embeddings (pgvector)
```

### 2. Precise Tech Stack Justification
| Layer | Chosen Technology | Architectural Rationale |
| :--- | :--- | :--- |
| **Edge Hosting & CDN** | Cloudflare Pages + Functions | Sub-50ms global TTFB, built-in DDoS mitigation, zero cold-start V8 isolates, and git-integrated atomic previews. |
| **Frontend Foundation** | Semantic HTML5 + Vanilla ES2024 + CSS Custom Properties | Zero hydration penalty, 100/100 Lighthouse Performance potential, immune to client framework churn, locked 8/8 visual design tokens. |
| **Database & Auth** | Supabase Enterprise (PostgreSQL 16 + Row-Level Security) | Native multi-tenant isolation, cryptographic JWT verification, ACID-compliant ledger transactions, and automated pgvector indexing. |
| **Edge Middleware** | Cloudflare Pages Middleware (`functions/_middleware.js`) | Public truth boundary enforcement, anti-tamper response sanitization, and strict CORS/CSP headers. |
| **Verification Engine** | Node.js 22 LTS Deterministic CI Runner (Gate 0A-0H) | 24 registered verification suites, zero workstation leakage, isolated PR head cryptographic lineage tracking. |

---

# PHASE 2: COMPREHENSIVE FEATURE BREAKDOWN

### 1. Gate 0: UI/UX Baseline & Non-Destructive Design Firewall
- **Frontend Specification**:
  - Enforce locked CSS design tokens: `--accent-cyan: #06b6d4`, `--accent-gold: #f59e0b`, `--accent-emerald: #10b981`, `--bg-dark: #0f172a`.
  - Maintain 3-column responsive grids (`.packages-grid`, `.blueprint-grid`, `.marketplace-grid`) with adaptive break-points at `768px` and `480px`.
  - Modals default to `display: none` fail-safe state; zero Unicode mojibake across cards, hero, and tables.
- **Backend / Edge Specification**:
  - Edge middleware verifies that incoming request routes map deterministically to pre-rendered HTML templates.

### 2. Core Service Authority & Financial Pricing Matrix
- **Frontend Specification**:
  - Client forms submit package selections, currency preferences (USD/BDT), and optional promo codes.
  - **Zero Price Authority Rule**: Frontend calculations are treated strictly as advisory UI previews; the client cannot supply or mutate transaction prices.
- **Backend / Edge Specification**:
  - Edge function loads canonical pricing catalog from verified JSON (`knowledge/services.json`).
  - Evaluates static FX peg (`1 USD = 122.50 BDT`) and authoritative coupon policy engine (`IINSHA20` = 20% discount).
  - Emits signed, immutable quotes with cryptographic expiration timestamps.

### 3. Payment FSM & Secure Webhook Settlement
- **Frontend Specification**:
  - Renders checkout state machine UI: `QUOTE_RECEIVED` ➔ `PAYMENT_PENDING` ➔ `PROVIDER_CONFIRMED` ➔ `SETTLED`.
  - Polling or SSE listener for async settlement notifications; zero optimistic balance increases.
- **Backend / Edge Specification**:
  - Endpoint: `/api/payments/checkout`. Creates draft order in database with status `PAYMENT_PENDING`.
  - Endpoint: `/api/payments/webhook`. Strict HMAC-SHA256 signature verification. Idempotent execution using `idempotency_key` with replay concurrency guards.

### 4. Multi-Tenant Cross-Organization Isolation
- **Frontend Specification**:
  - Portal interface dynamically renders active tenant organization context from authenticated session token.
- **Backend / Edge Specification**:
  - Every PostgreSQL query executes under strict Row-Level Security (`auth.uid() = user_id AND organization_id = current_setting('app.current_org_id')`).
  - Direct administrative client mutations blocked by AST scanner.

---

# PHASE 3: DATABASE SCHEMA & API CONTRACTS

### 1. PostgreSQL Relational Schema & Security Hardening
```sql
-- Core Tenants Partition
CREATE TABLE IF NOT EXISTS ibos_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'growth', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users & Identity
CREATE TABLE IF NOT EXISTS ibos_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES ibos_organizations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Financial Orders & FSM
CREATE TABLE IF NOT EXISTS ibos_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES ibos_organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES ibos_users(id),
    package_id TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    currency TEXT DEFAULT 'USD' CHECK (currency IN ('USD', 'BDT')),
    status TEXT DEFAULT 'PAYMENT_PENDING' CHECK (status IN ('QUOTE', 'PAYMENT_PENDING', 'PROVIDER_CONFIRMED', 'SETTLED', 'FAILED', 'REFUNDED')),
    idempotency_key TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    settled_at TIMESTAMPTZ
);

-- Immutable Double-Entry Ledger
CREATE TABLE IF NOT EXISTS ibos_ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES ibos_orders(id),
    account_type TEXT NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    debit_cents BIGINT NOT NULL DEFAULT 0,
    credit_cents BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Enforcement
ALTER TABLE ibos_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Secure SECURITY DEFINER pattern with empty search_path
CREATE OR REPLACE FUNCTION redeem_coupon_atomic(
    p_coupon_code TEXT,
    p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_discount NUMERIC;
BEGIN
    IF UPPER(p_coupon_code) = 'IINSHA20' THEN
        v_discount := 0.20;
        RETURN jsonb_build_object('success', true, 'discount_pct', 20);
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'INVALID_COUPON');
    END IF;
END;
$$;
```

### 2. Strict API Endpoint Contracts

#### A. Release Identity Verification
- **Endpoint**: `GET /api/version`
- **Headers**: `Accept: application/json`
- **Response (200 OK)**:
```json
{
  "status": "LIVE_VERIFIED",
  "platform": "IINSHA AI-BOS",
  "deploy_sha": "b3de7650b65e388514ca82674654c92241ea8811",
  "branch": "master",
  "parity": true,
  "release_identity": {
    "verified": true,
    "parity_status": "FULL_PARITY_VERIFIED",
    "missing_fields": []
  },
  "database_identity": {
    "canonical_db": "kitwadizsvjmuxkfewxj",
    "runtime_db": "kitwadizsvjmuxkfewxj",
    "db_parity": true,
    "status": "LIVE_VERIFIED"
  }
}
```

#### B. Authoritative Quote & Checkout Intent
- **Endpoint**: `POST /api/payments/checkout`
- **Request Payload**:
```json
{
  "package_id": "PKG-ENTERPRISE-01",
  "currency": "USD",
  "coupon_code": "IINSHA20",
  "idempotency_key": "idem_8f9a2c4e6b1d"
}
```
- **Response (201 Created)**:
```json
{
  "order_id": "c7a8b9e0-1234-5678-9abc-def012345678",
  "package_id": "PKG-ENTERPRISE-01",
  "base_amount_cents": 250000,
  "discount_cents": 50000,
  "final_amount_cents": 200000,
  "currency": "USD",
  "status": "PAYMENT_PENDING",
  "expires_at": "2026-09-18T04:00:00Z"
}
```

---

# PHASE 4: FLAWLESS EXECUTION PROMPT FOR THE AI AGENT

```markdown
You are Antigravity-Core, operating as the Lead Autonomous Software Engineer for IINSHA AI-BOS.
Your objective is to maintain and execute codebase mutations with zero regression and absolute cryptographic proof.

### CORE OPERATIONAL INVARIANTS:
1. TRUTH BOUNDARY: Never simulate, fake, or invent production metrics, revenue figures, or uptime statistics. Unverified claims must fail-closed as UNVERIFIED or SIMULATED.
2. GATE 0 VISUAL INTEGRITY: Run `node scripts/visual_regression_baseline.mjs` before and after modifying any HTML/CSS. Ensure all 8/8 visual invariants remain 100% locked.
3. FAIL-CLOSED IDENTITY: /api/version must strictly verify source_sha, build_sha, deployment_sha, and runtime_sha against canonical_branches ['master', 'main']. Any discrepancy returns UNVERIFIED.
4. ZERO PRICE AUTHORITY: The browser is never allowed to supply or calculate authoritative financial numbers. All prices, discounts, and currency conversions must derive from server-side catalogs.
5. SECURITY DEFENSE: All SECURITY DEFINER PostgreSQL functions must declare `SET search_path = ''` and schema-qualify all table calls.

### EXECUTION WORKFLOW:
1. Validate working tree clean state.
2. Execute `node scripts/ci_evidence_runner.mjs` across all 24 suites. Ensure 100% deterministic green pass.
3. Format and commit changes with conventional commit syntax.
4. Re-run evidence freeze and generate updated `docs/CI_FAILURE_EVIDENCE.json`.
```

---

# PHASE 5: DEPLOYMENT, CI/CD, AND ZERO-DOWNTIME STRATEGY

### 1. Canonical Deployment Authority (Issue #68 Resolution)
- **Primary Deployment Authority**: Cloudflare Pages Git Integration connected directly to `adnin4/inshatech`.
- **Branch Enforcement**: Automatic production builds trigger exclusively on merges to `master`.
- **Preview Deployments**: Branch and PR pushes generate isolated preview URLs (`https://<hash>.inshatech.pages.dev`).
- **Post-Deploy Poller**: GitHub Actions `.github/workflows/deploy.yml` functions strictly as a post-deployment verification monitor, querying `/api/version` until parity is confirmed.

### 2. Zero-Downtime Rollback Mechanism
- If `/api/version` detects release SHA discrepancy or degraded database health, the deployment remains `UNVERIFIED` fail-closed.
- Cloudflare Pages Instant Rollback targets the last verified production deployment artifact without database mutation or downtime.
