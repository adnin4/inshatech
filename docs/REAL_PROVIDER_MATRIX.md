# 🔌 IINSHA AI-BOS: REAL PROVIDER ADAPTER MATRIX

| Capability | Target Provider | Credential Status | Adapter Status | Runtime Status | Action / Instruction |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **AI Inference** | Google Gemini (Flash/Pro) | Configured | Live | 🟢 `LIVE_VERIFIED` | Direct cloud inference active with local RAG fallback |
| **Edge Routing** | Cloudflare Pages Functions | Configured | Live | 🟢 `LIVE_VERIFIED` | Edge CDN and `/api/*` functions active |
| **PostgreSQL CRM**| Supabase Database | Configured | Live | 🟢 `LIVE_VERIFIED` | 22+ tables, RLS policies, UUID PKs |
| **Email Relay** | Resend API | Unset in Edge | Fail-Closed | 🟡 `NOT_CONFIGURED` | Provide `RESEND_API_KEY` to dispatch live emails |
| **Workflow Engine**| n8n Enterprise Cluster | Unset in Edge | Fail-Closed | 🟡 `NOT_CONFIGURED` | Provide `N8N_WEBHOOK_URL` for remote trigger |
| **WhatsApp API** | Meta WhatsApp Cloud API | Unset in Edge | Fail-Closed | 🟡 `NOT_CONFIGURED` | Provide `WHATSAPP_ACCESS_TOKEN` or use Direct WA |
| **Payment Gateway**| Lemon Squeezy Store 458722 | Live Store URL | Fail-Closed | 🟡 `NOT_CONFIGURED` | Perform live $1.00 USD card swipe |
