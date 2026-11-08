# 🛑 IDOR_TEST_REPORT.md — Direct Object Reference Adversarial Audit

| Attack Vector | Target Table / Path | User Context | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Fetch Foreign Order** | `public.ibos_orders` | User A -> User B | 🛑 403 Forbidden | 403 Forbidden | **PASS** |
| **Mutate Foreign Project**| `public.projects` | Org A -> Org B | 🛑 403 Forbidden | 403 Forbidden | **PASS** |
| **Read Foreign Ticket** | `public.support_tickets`| Customer A -> Cust B | 🛑 403 Forbidden | 403 Forbidden | **PASS** |
| **Tamper Ledger Entry** | `public.ibos_ledger` | SuperAdmin Direct Insert| 🛑 403 Forbidden | Stored Proc Only | **PASS** |
