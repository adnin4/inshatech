# 🔒 IINSHA AI-BOS: ENTERPRISE SECURITY & OWASP MODEL

* **Zero-Leak Invariant:** `.env` permanently excluded from release packages; only safe `.env.example` distributed.
* **Database Security:** Supabase Postgres tables protected by Row-Level Security (RLS) policies and restricted grants. Service role key never exposed to client bundles.
* **5-Level Tool Action Policy:**
  - **Level 0 (Read-Only):** Knowledge search, health metrics (Auto-Approved).
  - **Level 1 (Draft):** Proposals, content copy (Auto-Approved).
  - **Level 2 (Safe Execute):** CRM lead capture, click logging (Policy-Checked).
  - **Level 3 (Owner Approval Required):** Financial refunds, production deployments, affiliate payouts.
  - **Level 4 (Permanently Blocked):** Database drop table, credential dump (OWASP LLM08).
