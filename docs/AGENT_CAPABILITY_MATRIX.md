# 🤖 IINSHA AI-BOS: 13-AGENT WORKFORCE CAPABILITY & CONTROL MATRIX

```text
================================================================================
          🌐 IINSHA AI-BOS: AUTONOMOUS AGENT WORKFORCE CONTRACT
================================================================================
```

| Agent ID | Agent Title | Primary Objective | Allowed Tools | Risk Level | Supervisor | Execution State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `CEO_AGENT` | Strategic Commander | Strategy & Coordination | `get_analytics, get_revenue, delegate_task` | LEVEL_2 | Owner | **ACTIVE** |
| `SALES_AGENT` | Revenue & Growth Agent | Discovery & Qualification | `get_services, create_lead, calculate_roi` | LEVEL_2 | CEO_AGENT | **ACTIVE** |
| `SDR_AGENT` | Sales Development Rep | Prospecting & Outreach | `search_knowledge, get_leads, create_lead` | LEVEL_2 | SALES_AGENT | **ACTIVE** |
| `ARCHITECT_AGENT` | Solution Architect | Technical Discovery | `search_knowledge, create_quote, draft_proposal` | LEVEL_1 | CEO_AGENT | **ACTIVE** |
| `DEVELOPER_AGENT`| Sandbox Engineer Lead | Code Generation & Build | `create_project, create_task, run_tests` | LEVEL_3 | QA_AGENT | **ACTIVE** |
| `QA_AGENT` | Quality Assurance Lead | Independent Verification | `run_tests, search_knowledge, get_health` | LEVEL_0 | GUARDIAN | **ACTIVE** |
| `DEVOPS_AGENT` | SRE & Cloud Engineer | Monitoring & Incident Recovery | `get_health, create_incident, create_deployment` | LEVEL_2 | GUARDIAN | **ACTIVE** |
| `MARKETING_AGENT`| Growth & SEO Agent | Content & Campaigns | `search_knowledge, draft_content, get_metrics` | LEVEL_1 | CEO_AGENT | **ACTIVE** |
| `SUCCESS_AGENT` | Customer Success Agent | Support & Health Triage | `get_customer, get_projects, create_ticket` | LEVEL_2 | SUPPORT | **ACTIVE** |
| `AFFILIATE_AGENT`| Partner Program Agent | Attribution & Commission | `get_affiliates, track_referral, calculate_comm` | LEVEL_2 | FINANCE | **ACTIVE** |
| `FINANCE_AGENT` | AI CFO & Ledger Agent | Accounting & Cost Audit | `get_revenue, get_expenses, get_analytics` | LEVEL_0 | Owner | **ACTIVE** |
| `INTEL_AGENT` | Market Intelligence | Research & Benchmarks | `search_knowledge, get_analytics` | LEVEL_0 | CEO_AGENT | **ACTIVE** |
| `GUARDIAN_AGENT`| Security & Policy Guard | ASVS & OWASP Audit | `get_audit_logs, get_health, create_incident` | LEVEL_0 | Owner | **ACTIVE** |

---

## 🔒 Policy Boundary Invariants
1. **Autonomy != Authority**: No agent may execute Level 3+ financial transactions, destroy production data, or modify production policies autonomously.
2. **Independent QA Constraint**: `DEVELOPER_AGENT` output is never approved by the developer itself; `QA_AGENT` must independently verify test and runtime evidence.
3. **Fail-Closed Tool Execution**: All tool invocations pass through the Tool Execution Gateway with strict budget caps and input sanitization.
