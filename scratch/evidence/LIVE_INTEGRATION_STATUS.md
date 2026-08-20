# 🌐 Live Integration Status & Secrets Checklist

| Connector Service | Environment Variable | Current Runtime State | Action Required |
| :--- | :--- | :---: | :--- |
| **Supabase DB** | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | 🟢 **ACTIVE_HEALTHY** | Active in production |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | 🟡 **NOT_CONFIGURED** | Add Stripe Live/Test Secret |
| **bKash** | `BKASH_APP_KEY`, `BKASH_APP_SECRET` | 🟡 **NOT_CONFIGURED** | Add bKash Merchant API Key |
| **WhatsApp API** | `WHATSAPP_ACCESS_TOKEN`, `PHONE_ID` | 🟡 **NOT_CONFIGURED** | Add Meta Graph Access Token |
| **n8n Cluster** | `N8N_WEBHOOK_URL`, `N8N_API_KEY` | 🟡 **NOT_CONFIGURED** | Add VPS n8n Webhook URL |
| **Resend Email** | `RESEND_API_KEY` | 🟡 **NOT_CONFIGURED** | Add Resend API Token |
| **Cloudflare Pages** | `CLOUDFLARE_API_TOKEN` | 🟡 **NOT_CONFIGURED** | Add GitHub Actions Deployment Secret |
