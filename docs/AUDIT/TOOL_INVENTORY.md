# 13_TOOL_INVENTORY.md — 5-Tier Bounded Tool PDP Inventory

- **L0 (Read Only):** `search_knowledge`, `get_services`, `get_customer`, `get_analytics`.
- **L1 (Drafting):** `create_quote`, `draft_email`, `draft_proposal`, `draft_content`.
- **L2 (Safe Mutation):** `create_lead`, `update_lead`, `send_message`, `create_affiliate_link`.
- **L3 (Human Approval Required):** `create_order`, `process_refund`, `approve_payout`.
- **L4 (Strictly Forbidden):** `delete_production_database`, `bypass_security_policy`.
