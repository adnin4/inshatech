# 07-rls-map.md — RLS Policy & Boundary Map

- **Orders Isolation:** Tenant A cannot SELECT/UPDATE/DELETE Tenant B orders.
- **Leads Isolation:** Cross-tenant CRM lead mutation strictly denied (403).
- **RAG Chunks Isolation:** Vector search strictly scoped by `WHERE tenant_id = current_tenant`.
- **Admin Isolation:** Customer token rejected on all Admin tools (401).
