# 09-tool-map.md — 5-Tier Bounded Tool PDP Map

- **L0 (Read Only):** `search_knowledge`, `get_services`, `get_customer` $\rightarrow$ Auto
- **L1 (Drafting):** `create_quote`, `draft_proposal`, `draft_email` $\rightarrow$ Auto
- **L2 (Safe Mutation):** `create_lead`, `update_lead`, `send_message` $\rightarrow$ Policy Checked
- **L3 (Human Approval):** `create_order`, `process_refund`, `approve_payout` $\rightarrow$ **Locked**
- **L4 (Forbidden):** `delete_database`, `bypass_security` $\rightarrow$ **Permanently Blocked**
