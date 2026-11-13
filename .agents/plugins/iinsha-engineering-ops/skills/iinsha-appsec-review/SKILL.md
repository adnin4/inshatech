---
name: iinsha-appsec-review
description: Use for application security review or changes to IINSHA authentication, admin APIs, tenant access, payments, webhooks, secrets, affiliate accounting, agent permissions, or Cloudflare/Supabase security.
---
# IINSHA Application Security Review

Review trust boundaries and actual server enforcement. Check authentication and session expiry/revocation, password hashing, MFA and recovery, role checks on every privileged API, CSRF, XSS, CORS, rate limiting, secret exposure, SSRF, SQL injection, unsafe redirects, webhook signature verification, replay protection, idempotency, server-authoritative payment amounts, ledger invariants, RLS, tenant isolation, object storage policies, agent tool scopes, and kill-switch enforcement.

Prioritize findings by exploitability and impact. Cite file paths and line numbers. Do not run destructive tests or attack production. Never weaken assertions, disable security checks, or report a simulated control as live. For each confirmed defect, propose a minimal fix and a regression test.
