# 🤖 IINSHA AI-BOS — 13-Agent Swarm Mesh Architecture (Baseline v1.0)

**Record Date**: 2026-08-19  
**Registry File**: `ai_brain/agents/agent_registry.js`  
**Autonomy Spectrum**: 7-Level Permission Matrix  

---

## 👥 The 13 Digital Employees & Autonomy Roles

| Agent ID | Swarm Role | Autonomy Level | Allowed Tools | Delegation Subordinates |
| :--- | :--- | :---: | :--- | :--- |
| **`CEO_AGENT`** | Strategic Commander | `LEVEL_2_EXECUTE` | `get_analytics`, `get_revenue`, `delegate_task` | Sales, Marketing, DevOps, Finance |
| **`SALES_AGENT`** | Revenue Closer | `LEVEL_2_EXECUTE` | `get_services`, `create_quote`, `send_whatsapp` | SDR Agent, Architect Agent |
| **`SDR_AGENT`** | Lead Prospector | `LEVEL_2_EXECUTE` | `search_web`, `get_leads`, `create_lead` | Sales Agent |
| **`ARCHITECT_AGENT`** | Technical Solution Architect | `LEVEL_1_DRAFT` | `search_knowledge`, `draft_proposal` | Developer Agent |
| **`DEVELOPER_AGENT`**| Swarm Engineering Lead | `LEVEL_3_APPROVAL`| `create_project`, `create_task`, `deploy` | QA Agent |
| **`QA_AGENT`** | Quality Assurance Evaluator | `LEVEL_0_READ` | `run_tests`, `create_incident` | Developer Agent |
| **`DEVOPS_AGENT`** | Infrastructure & SRE | `LEVEL_2_EXECUTE` | `get_health`, `resolve_incident` | Developer Agent |
| **`MARKETING_AGENT`**| Growth & Content Orchestrator | `LEVEL_1_DRAFT` | `draft_content`, `publish_content` | None |
| **`SUCCESS_AGENT`** | Customer Onboarding & Retention| `LEVEL_2_EXECUTE` | `create_ticket`, `get_projects` | DevOps Agent |
| **`AFFILIATE_AGENT`**| Partner Program Manager | `LEVEL_2_EXECUTE` | `create_ref_link`, `calc_commission` | None |
| **`FINANCE_AGENT`** | AI CFO & Ledger Reconciler | `LEVEL_0_READ` | `get_revenue`, `create_invoice` | None |
| **`INTELLIGENCE_AGENT`**| Market & Competitor Scout | `LEVEL_0_READ` | `search_web`, `search_knowledge` | None |
| **`GUARDIAN_AGENT`**| Security & Policy Supervisor | `LEVEL_0_READ` (Supervisor) | `get_audit_logs`, `create_incident` | None |

---

## 🔒 7-Level Autonomy Spectrum Definition
* `LEVEL_0_READ`: Read-only system inspection, telemetry queries, knowledge retrieval.
* `LEVEL_1_DRAFT`: Draft creation (emails, blog posts, architecture proposals).
* `LEVEL_2_EXECUTE`: Policy-bound execution (create lead, dispatch WhatsApp message, generate ref code).
* `LEVEL_3_APPROVAL`: High-risk execution requiring Owner approval (process refund, trigger deployment).
* `LEVEL_4_RESTRICTED`: Forbidden autonomous operations (credential changes, drop database, raw key export).
