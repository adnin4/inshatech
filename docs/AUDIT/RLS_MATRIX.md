# 08_RLS_MATRIX.md — Row Level Security & Cross-Tenant Defense

- **Adversarial Test 1 (Cross-User Orders):** Blocked with 403 Forbidden / Empty Result.
- **Adversarial Test 2 (Cross-Tenant Account):** Blocked with 403 Forbidden via MakerKit `public.accounts`.
- **Adversarial Test 3 (Customer -> Admin):** Blocked with 401 Unauthorized.
- **Adversarial Test 4 (Anonymous Write):** Blocked with 401 Unauthorized.
- **DDL Trigger Defense:** `ensure_rls` automatically prevents unauthenticated table creation.
