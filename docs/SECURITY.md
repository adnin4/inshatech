# IINSHATECH SECURITY & COMPLIANCE ARCHITECTURE

## 1. Security Overview
IINSHATECH implements defense-in-depth security across the application, API edge gateway, and database layer.

---

## 2. Row Level Security (RLS) Policies
PostgreSQL RLS is enabled on all tables:
- `ibos_content_words`: Public SELECT enabled; UPDATE/INSERT restricted to `super_admin`.
- `ibos_services`: Public SELECT restricted to `status = 'published'`.
- `ibos_orders`: Users can only read their own orders matching `client_email`.
- `ibos_users`: Restricted to authenticated super admin operations.

---

## 3. HTTP Security Headers
Configured in `_headers` for Cloudflare CDN:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Cache-Control: no-cache, no-store, must-revalidate`

---

## 4. Credential Protection & Secret Management
- Passwords are never stored in plaintext (hashed using `pgcrypto` bcrypt).
- Secrets are passed exclusively via Cloudflare Environment Variables / Supabase Vault.
