# 05_AUTHORIZATION_VERIFICATION.md — Authorization & Tenant Isolation

| Adversarial Scenario | Target Resource | Actor Context | Result | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Cross-User Order Fetch** | `public.ibos_orders` | User A -> User B | 🛑 403 Forbidden | **LIVE_VERIFIED** |
| **Cross-Tenant Account Access**| `public.accounts` | Tenant A -> Tenant B | 🛑 403 Forbidden | **LIVE_VERIFIED** |
| **Customer -> Admin Escalation** | `/api/admin/gate` | Customer Session | 🛑 401 Unauthorized | **LIVE_VERIFIED** |
| **Anonymous Database Write** | Orders Table | Unauthenticated Post | 🛑 401 Unauthorized | **LIVE_VERIFIED** |
