# 🛡️ AGENT_TOOL_AUTHORIZATION_POLICY.md — 5-Tier Bounded Tool PDP

## Tiered Permission & Risk Boundaries
- **L0 (Read Only):** `search_knowledge`, `get_services`, `get_customer`, `get_analytics` $\longrightarrow$ Auto-approved.
- **L1 (Draft / Suggestion):** `create_quote`, `draft_email`, `draft_proposal`, `draft_content` $\longrightarrow$ Auto-approved.
- **L2 (Safe Mutation):** `create_lead`, `update_lead`, `send_message`, `create_affiliate_link` $\longrightarrow$ Policy-checked.
- **L3 (Human Approval Required):** `create_order`, `process_refund`, `create_deployment`, `approve_payout` $\longrightarrow$ **LOCKED until Owner approves**.
- **L4 (Forbidden / Restricted):** `delete_production_database`, `change_security_policy`, `unrestricted_fund_transfer` $\longrightarrow$ **STRICTLY BLOCKED**.
