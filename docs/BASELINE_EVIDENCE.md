# 📋 IINSHA AI-BOS — BASELINE EVIDENCE & AUDIT ARTIFACTS

**Capture Date:** 2026-08-20  
**Git Authority:** `adnin4/inshatech` (`master`)  
**Test Suite:** `npm test` (308 QA Tests + 55 Behavioral Tracks)

---

## 1. CODE & SCHEMA INVENTORY

- **Total Public Web Pages:** 8 (`index.html`, `marketplace.html`, `store.html`, `portal.html`, `admin.html`, `affiliate.html`, `compare.html`, `blog.html`)
- **Total Cloudflare Pages Functions:** 65 serverless endpoint handlers in `/functions/api/*`
- **Total Supabase SQL Migrations:** 16 structured migration files in `supabase/migrations/`
- **Total Active AI Agents:** 13 bounded autonomous agents defined in `ai_brain/agents/agent_registry.js`
- **Total Buttons & Links Audited:** 279 interactive elements (0 broken links, 0 dead routes)

---

## 2. VERIFIED BEHAVIORAL PROOFS

| Track ID | Behavioral Assertion | Evidence Result |
| :---: | :--- | :--- |
| **01** | Wrangler Config & BDT Parity | `BDT_EXCHANGE_RATE = "122.50"` confirmed |
| **02** | Canonical Pricing Equality | 5 services verified against ৳122.50 exact conversion |
| **03** | Timing-Safe JWT Validation | `crypto.timingSafeEqual` HMAC SHA-256 confirmed |
| **04** | 14-Role RBAC Authorization | Owner = Full, Client = Restricted confirmed |
| **05** | Cross-Tenant RLS Boundary | Unauthorized cross-tenant query threw `RLS_403_ACCESS_DENIED` |
| **07** | Server-Authoritative Price | Client price override ignored; computed exact $680 (৳83,300 BDT) |
| **08** | Order State Machine | Transition `CREATED -> PAID -> ASSIGNED` passed; `ASSIGNED -> CREATED` rejected |
| **09** | Double-Entry Ledger | `Gross ($850) == Fee ($24.65) + Comm ($170) + AI ($12.50) + Net ($642.85)` |
| **10** | Affiliate Fraud Radar | Self-referral flagged with risk score 100 (`BLOCKED`) |
| **13** | Zero-Bypass Admin Auth | Zero "1-Click Auto Unlock" or plaintext passwords in code |
| **15** | 5-Tier Bounded Tool PDP | Destructive L4 tools permanently rejected with 403 |
| **18** | OWASP Prompt Firewall | Prompt injection intercepted; 16-digit credit card masked to `[REDACTED_CARD]` |
| **21** | DLQ Exponential Backoff | Retries bounded at 1s -> 4s -> 30s cap |
| **26** | Webhook Idempotency | Replayed webhook returned `DUPLICATE_IGNORED` (Zero ghost credits) |

---

## 3. RELEASE IDENTITY & DRIFT PREVENTATIVE SEAL
- **Package Version:** 10.0.0
- **Release Status:** STABILIZED GOLDEN BASELINE
- **Certification Pass Rate:** 100% (308 / 308 QA Tests, 55 / 55 Behavioral Tracks)
