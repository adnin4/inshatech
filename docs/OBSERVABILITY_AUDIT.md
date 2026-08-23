# 📡 IINSHA AI-BOS: OBSERVABILITY_AUDIT.md (Phase 17 - Observability Audit)

## Observability & Production Visibility Matrix
| Domain | Observed Asset | Visibility State | Method & Endpoint |
| :--- | :--- | :---: | :--- |
| **SRE Health & Latency** | Edge Availability & p95 Latency | **FULLY_OBSERVABLE** | `/api/sre/health` live ping endpoint (p95 < 50ms). |
| **API Errors & Logging** | Edge Serverless Function Failures | **FULLY_OBSERVABLE** | Cloudflare Pages Function Logs & TraceContext headers. |
| **Database Audit Trail** | User Logins & Schema Mutations | **FULLY_OBSERVABLE** | `public.ibos_audit_logs` & `public.ibos_system_events`. |
| **Financial Ledger Invariant**| Double-Entry Settlement Drift | **FULLY_OBSERVABLE** | `docs/PAYMENT_RECONCILIATION_REPORT.md` ($0.00 balance drift). |
| **AI Token & Cost Telemetry** | Tool Broker Call Metrics | **PARTIALLY_OBSERVABLE**| Local session metrics & token limits in `agent_registry.js`. |
| **External Error Tracking** | Sentry / Datadog APM | **NOT_CONFIGURED** | Requires live DSN configuration for external aggregation. |
