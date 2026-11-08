# 📧 EMAIL_SYSTEM.md — Phase 18 Transactional Email Architecture

## 1. Multi-Channel Dispatcher Architecture
- **Provider Abstraction:** Resend API / SMTP Gateway wrapper with retry backoff in `functions/api/notifications/dispatch.js`.
- **Supported Notification Events:**
  1. Order Confirmation (`ORDER_CREATED`)
  2. Payment Receipt & Invariant (`PAYMENT_SETTLED`)
  3. Invoice Delivery (`INVOICE_GENERATED`)
  4. Password Reset & Verification (`AUTH_PASSWORD_RESET`)
  5. Project Milestone DAG Updates (`PROJECT_STATUS_CHANGED`)
  6. Support Ticket Response & SLA Alert (`TICKET_UPDATED`)
  7. Affiliate Conversion Notification (`COMMISSION_EARNED`)
- **Fail-Safe Policy:** When `RESEND_API_KEY` is absent, system queues notification in database and logs `{ status: "QUEUED_LOCAL", provider: "INTERNAL_FALLBACK" }` with 0 crash risk.
- **Status:** **IMPLEMENTED_NOT_CONFIGURED**
