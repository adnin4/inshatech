# IINSHA AI-BOS — Owner / Priority / Exit-Criteria Master Roadmap

**Repository:** adnin4/inshatech  
**Primary branch:** master  
**Canonical Supabase project:** kitwadizsvjmuxkfewxj  
**Production domain:** https://inshatech.pages.dev/  

---

## Priority Legend
* P0: Production/revenue/security blocker — must complete first
* P1: Required for production launch
* P2: Required for revenue/automation scale-up
* P3: Optimization / maturity

## Owner Legend
* REL: Release / DevOps
* BE: Backend / API
* FE: Frontend
* DB: Supabase / Database
* SEC: Security / Auth
* PAY: Payment & Finance
* QA: QA / Browser E2E
* CRM: CRM / Sales
* PF: Project Factory
* AI: AI / Agent Orchestration
* SRE: Reliability / Observability
* AFF: Affiliate
* FIN: Finance / Reconciliation
* GOV: Governance / Evidence
* OPS: Business Operations

---

## Phase 0 — Governance Freeze
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| GOV-01 | Master roadmap freeze | GOV | P0 | Single approved execution roadmap exists |
| GOV-02 | Truth-policy freeze | GOV+SEC | P0 | No fake production/revenue/customer claims |
| GOV-03 | Production verification policy | GOV+REL | P0 | Certification rules enforced |
| GOV-04 | Evidence-ledger contract | GOV | P1 | Every claim has evidence schema |
| GOV-05 | Role ownership map | OPS | P1 | Exactly one owner per task |

## Phase 1 — Release Baseline / PR #52
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| REL-01 | PR #52 review | REL | P0 | Required checks satisfied |
| REL-02 | Reality boundary CI | SEC+REL | P0 | Truth-boundary green |
| REL-03 | Node/runtime baseline | REL | P0 | Node 22 LTS verified |
| REL-04 | Canonical SHA metadata | REL | P0 | Master SHA parity |
| REL-05 | Staging deployment | REL | P0 | Preview deployment successful |
| REL-06 | PR #52 merge | REL | P0 | Merged without gate bypass |

## Phase 2 — Production Deployment Identity
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| DEP-01 | Production deployment | REL | P0 | Deployment exists on Cloudflare |
| DEP-02 | Cloudflare SHA verification | REL | P0 | Deployed SHA recorded |
| DEP-03 | Runtime SHA verification | REL+BE | P0 | /api/version reports exact SHA |
| DEP-04 | Branch verification | REL | P0 | Runtime branch = master |
| DEP-05 | Repo verification | REL | P0 | Canonical GitHub repo verified |
| DEP-06 | SHA parity | REL | P0 | GitHub = Cloudflare = runtime SHA |
| DEP-07 | DB identity parity | DB+REL | P0 | Runtime DB = kitwadizsvjmuxkfewxj |

## Phase 3 — Runtime Health
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| SRE-01 | /api/version | BE | P0 | LIVE_VERIFIED |
| SRE-02 | /api/health | BE | P0 | EDGE_HEALTHY |
| SRE-03 | /api/sre/health | SRE | P0 | SRE_HEALTHY |
| SRE-04 | Runtime error audit | SRE | P0 | Zero critical errors |
| SRE-05 | Telemetry truth audit | SRE | P0 | No demo metrics as telemetry |

## Phase 4 — Browser Production Certification
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| QA-01 | Public pages | FE+QA | P0 | 12/12 public pages verified |
| QA-02 | Service discovery | FE+QA | P0 | Service browsing verified |
| QA-03 | CTA interactions | FE+QA | P1 | CTAs resolve correctly |
| QA-04 | Customer portal | FE+QA | P0 | Portal operations verified |
| QA-05 | Admin portal | FE+QA | P0 | Admin gated auth verified |
| QA-06 | Mobile/desktop | QA | P1 | Zero visual regression |
| QA-07 | E2E Suite | QA | P0 | Repeatable suite passes |

## Phase 5 — Authentication & Authorization
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| SEC-01 | Anonymous access matrix | SEC | P0 | Protected endpoints denied |
| SEC-02 | Customer auth | SEC | P0 | Customer session isolated |
| SEC-03 | Affiliate auth | SEC | P1 | Affiliate isolated |
| SEC-04 | Admin auth | SEC | P0 | Admin authorization verified |
| SEC-05 | Agent auth | AI+SEC | P0 | Agent tool limits verified |
| SEC-06 | Service-role isolation | SEC | P0 | Service key never sent to client |

## Phase 6 — Supabase / Tenant Security
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| DB-01 | Runtime DB identity | DB | P0 | kitwadizsvjmuxkfewxj verified |
| DB-02 | RLS policy audit | DB+SEC | P0 | 110/110 tables verified |
| DB-03 | Cross-user isolation | DB+QA | P0 | Unauthorized CRUD fails |
| DB-04 | SECURITY DEFINER audit | DB+SEC | P0 | search_path & execute locked |

## Phase 7-10 — Payment Architecture & Hardening
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| PAY-01 | Server catalog authority | PAY+BE | P0 | Authoritative price enforced |
| PAY-02 | Unknown service rejection | BE | P0 | Rejects with HTTP 400 |
| PAY-03 | Pre-gateway durable order | DB+PAY | P0 | Order created before checkout |
| PAY-04 | Read-only browser return | BE+PAY | P0 | GET only, POST returns 405 |
| PAY-05 | Scoped webhook middleware | BE | P0 | Intercepts GET to /return |
| PAY-06 | Native webhook signature | PAY+SEC | P0 | Verified with provider HMAC |
| PAY-07 | Webhook idempotency | PAY | P0 | Duplicate returns 200 DUPLICATE |
| PAY-08 | Sandbox payment & refund | FIN+PAY | P0 | Sandbox charge & refund recorded |

## Phase 11-13 — CRM, Project Factory & Client Acceptance
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| PF-01 | Paid -> project DAG | PF | P0 | Paid order creates DAG |
| PF-02 | Dual-agent QA gate | QA+SEC | P0 | Confidence >= 0.95 |
| PF-03 | Client approval & delivery | OPS+PF | P0 | Delivery receipt stored |

## Phase 16-23 — AI Governance, SRE, Backup & Rollback
| ID | Workstream | Owner | Priority | Exit Criteria |
| --- | --- | --- | --- | --- |
| AI-01 | Tool execution gateway | AI+SEC | P0 | Permission levels 0-4 enforced |
| KILL-01 | Subsystem kill switches | OPS+SEC | P0 | System, sales, deploy halts work |
| DR-01 | Backup & restore drill | DB+SRE | P0 | Measured RPO/RTO verified |
| RB-01 | Rollback drill | REL+QA | P0 | Demonstrated rollback passes |
| EVD-01 | Central evidence ledger | GOV | P0 | Complete cryptographic audit trail |