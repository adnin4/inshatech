# 👑 IINSHA AI-BOS: Comprehensive Architecture Map

```
                                  IINSHA PLATFORM
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
  PUBLIC WEB                       CUSTOMER PORTAL                   ADMIN CONTROL
  (Studio & Labs)                  (Orders & Projects)               (Sovereign Cockpit)
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         │
                                   API GATEWAY
                                         │
        ┌───────────────────┬────────────┴──────────┬───────────────────┐
        │                   │                       │                   │
    COMMERCE               CMS                     CRM            AI AUTOMATION
  Orders, Ledger      Dynamic Content        Leads, Quotes      13 Agents, Tools,
  Invoices, Payments  Pages, SEO, Docs       Projects, SLA      Prompt Firewall
        │                   │                       │                   │
        └───────────────────┴────────────┬──────────┴───────────────────┘
                                         │
                                   EVENT SYSTEM
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
  SUPABASE POSTGRES               CLOUDFLARE EDGE                   MONITORING & SRE
  RLS Event Trigger               Anycast CDN & WAF                 TraceContext, SLO 99.95%
```

## 1. Domain Separation & Data Boundaries
- **Edge Layer:** Cloudflare Pages with `_headers` (strict CSP, HSTS, XFO) and `_redirects` (200 SPA rewrite).
- **Application Layer:** Modular Monolith architecture handling Auth, Commerce, CRM, CMS, and AI Tool Brokering.
- **Database Layer:** Supabase PostgreSQL with automated DDL `ensure_rls` event trigger and `security_invoker = true` views.
