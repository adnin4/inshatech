# 🧠 IINSHA AI-BOS: LAYERED MEMORY ARCHITECTURE & INTEGRITY PROVENANCE

```text
================================================================================
          🌐 IINSHA AI-BOS: 8-LAYER MEMORY SPECTRUM & PROVENANCE CONTROL
================================================================================
```

## 📋 Layered Memory Structure & Confidence Tiers

| Layer | Memory Type | Persistence Target | Confidence Threshold | Provenance Tag |
| :--- | :--- | :--- | :--- | :--- |
| **L0** | Session Memory | `sessionStorage` (`iinsha_copilot_memory`) | 1.00 (Active Turn) | `SESSION_VOLATILE` |
| **L1** | User Context | Client Session State | 0.90 (Current User) | `USER_DISCLOSED` |
| **L2** | Customer Record | Supabase `ibos_customer_contacts` | 1.00 (Verified) | `CUSTOMER_CONFIRMED` |
| **L3** | Organization Context| Supabase `ibos_organizations` | 0.85 (Enriched) | `SYSTEM_OBSERVED` |
| **L4** | Project Context | Supabase `ibos_projects` | 1.00 (Contractual) | `PROJECT_LOCKED` |
| **L5** | Task State | Supabase `ibos_project_tasks` | 0.95 (Active DAG) | `EXECUTION_TASK` |
| **L6** | Agent Memory | Supabase `ibos_memories` | 0.70 (Inferred) | `AI_INFERRED` |
| **L7** | Institutional Knowledge| Knowledge Base JSON / RAG | 1.00 (Authoritative)| `INSTITUTIONAL_DOC` |

---

## 🔒 Memory Governance Invariant
Inferred facts (`AI_INFERRED`) are explicitly tagged with confidence scores (<0.80) and never promoted to verified commercial or contractual commitments without explicit `CUSTOMER_CONFIRMED` validation.
