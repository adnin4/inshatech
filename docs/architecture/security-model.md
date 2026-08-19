# 🛡️ IINSHA AI-BOS — Security & Governance Model (Baseline v1.0)

**Record Date**: 2026-08-19  
**Compliance Standard**: OWASP GenAI & Agentic Security Framework  

---

## 🔐 Multi-Tier Security Boundaries

```text
┌────────────────────────────────────────────────────────┐
│ 1. EDGE FIREWALL & INPUT SANITIZER                     │
│    (/api/ai/firewall -> Prompt Injection & PII Scrub)  │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 2. ROLE-BASED ACCESS CONTROL & SESSION GATE            │
│    (/api/auth/rbac -> 14-Role Hierarchy + MFA)         │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 3. ZERO-TRUST SECRET BROKER                            │
│    (Raw keys never exposed to LLM context windows)     │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 4. TOOL PERMISSION VALIDATOR & SANDBOX                 │
│    (/api/tools/execute -> 7-Level Autonomy Gate)       │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌────────────────────────────────────────────────────────┐
│ 5. DATABASE ROW-LEVEL SECURITY (RLS)                   │
│    (Tenant-scoped SELECT/INSERT/UPDATE/DELETE)         │
└────────────────────────────────────────────────────────┘
```

---

## 🚨 Anti-Loop & Risk Containment Constants
* `max_delegation_depth`: 5
* `max_total_iterations`: 50
* `max_total_tool_calls`: 100
* `max_runtime_seconds`: 120
* `max_cost_usd`: $20.00
* `max_retries_per_tool`: 3
