# 🛠️ IINSHA AI-BOS: TOOL EXECUTION GATEWAY MATRIX (LEVEL 0 TO LEVEL 6)

```text
================================================================================
          🌐 IINSHA AI-BOS: BOUNDED TOOL SPECTRUM & PERMISSION MATRIX
================================================================================
```

## 📋 7-Level Tool Spectrum & Execution Policies

| Tool Name | Permission Level | Risk Class | Timeout (ms) | Cost ($USD) | Real Provider / Handler | Fail-Closed Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `search_knowledge` | `LEVEL_0_READ` | LOW | 3,000ms | $0.001 | Knowledge Base JSON / Embeddings | Local fallback |
| `get_services` | `LEVEL_0_READ` | LOW | 2,000ms | $0.0005| `knowledge/services.json` | Catalog cache |
| `get_customer` | `LEVEL_0_READ` | LOW | 3,000ms | $0.001 | Supabase `ibos_customers` | Standby response |
| `calculate_roi` | `LEVEL_0_READ` | LOW | 1,000ms | $0.0001| `ai_brain/sales_engine.js` | Local calculation |
| `create_quote` | `LEVEL_1_DRAFT`| LOW | 3,000ms | $0.002 | `functions/api/orders/quote.js` | Draft proposal |
| `draft_proposal` | `LEVEL_1_DRAFT`| LOW | 5,000ms | $0.005 | `ai_brain/sales_engine.js` | Markdown proposal |
| `create_lead` | `LEVEL_2_EXECUTE`| MEDIUM | 5,000ms | $0.010 | Supabase `ibos_leads` / CRM | Lead queued |
| `send_whatsapp` | `LEVEL_2_EXECUTE`| MEDIUM | 8,000ms | $0.020 | Meta WhatsApp Cloud API | `NOT_CONFIGURED` |
| `send_email` | `LEVEL_2_EXECUTE`| MEDIUM | 5,000ms | $0.005 | Resend / SendGrid API | `NOT_CONFIGURED` |
| `execute_browser_automation`| `LEVEL_2_EXECUTE`| MEDIUM | 15,000ms | $0.050 | Headless Playwright Worker | `NOT_CONFIGURED` |
| `execute_n8n_workflow` | `LEVEL_2_EXECUTE`| MEDIUM | 10,000ms | $0.030 | Self-Hosted n8n Cluster | `NOT_CONFIGURED` |
| `create_order` | `LEVEL_3_APPROVAL`| HIGH | 10,000ms | $0.050 | Owner Confirmation Gateway | `APPROVAL_REQUIRED`|
| `process_payout` | `LEVEL_3_APPROVAL`| HIGH | 10,000ms | $0.100 | Owner Financial Sign-Off | `APPROVAL_REQUIRED`|
| `delete_production_data` | `LEVEL_4_RESTRICTED`| CRITICAL | N/A | $0.000 | Never Autonomous | `RESTRICTED_BLOCKED`|
| `unrestricted_transfer` | `LEVEL_4_RESTRICTED`| CRITICAL | N/A | $0.000 | Never Autonomous | `RESTRICTED_BLOCKED`|

---

## 🔒 Policy Invariants
1. **Zero Fake Success**: When an external provider endpoint or token is missing, the tool gateway returns `NOT_CONFIGURED` with structured blocker metadata.
2. **Deterministic Sandboxing**: Client-side interactive tools operate strictly within local memory and never emit unauthenticated network side-effects.
