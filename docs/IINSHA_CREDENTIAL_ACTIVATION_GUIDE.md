# 🔐 IINSHA_CREDENTIAL_ACTIVATION_GUIDE.md — Official Credential & Provider Activation Guide

## 📌 Non-Negotiable Security Directive
$$\mathbf{NEVER\text{ }PASTE\text{ }RAW\text{ }SECRETS\text{ }IN\text{ }CHAT\text{ }OR\text{ }COMMIT\text{ }THEM\text{ }TO\text{ }GIT}$$
All secret keys must be configured exclusively in **Cloudflare Pages Environment Variables / Supabase Vault**. The platform automatically consumes them server-side without exposing plaintext to clients or browsers.

---

## 🏛️ Priority 0 (P0): Core Payment, Email & Outreach Integrations

### 1. 🇧🇩 bKash Online Business / Merchant Gateway
- **Signup URL:** [bKash Online Business Signup](https://www.bkash.com/business)
- **Requirements:** NID, Trade License, Bank Account details, Business website URL (`https://inshatech.pages.dev`).
- **Cloudflare Pages Environment Variables:**
  - `BKASH_APP_KEY`: Your bKash merchant App Key
  - `BKASH_APP_SECRET`: Your bKash merchant App Secret
  - `BKASH_USERNAME`: Merchant API Username
  - `BKASH_PASSWORD`: Merchant API Password
  - `BKASH_WEBHOOK_SECRET`: Signing secret for instant payment notifications

---

### 2. 💳 Stripe International Payment Gateway
- **Signup URL:** [Stripe Dashboard](https://dashboard.stripe.com)
- **Requirements:** Company registration, bank account, business details.
- **Cloudflare Pages Environment Variables:**
  - `STRIPE_PUBLISHABLE_KEY`: `pk_live_...` (or `pk_test_...` for sandbox)
  - `STRIPE_SECRET_KEY`: `sk_live_...` (or `sk_test_...` for sandbox)
  - `STRIPE_WEBHOOK_SECRET`: `whsec_...` (from Stripe Webhooks Dashboard)

---

### 3. 📧 Resend Transactional Email API
- **Signup URL:** [Resend API](https://resend.com)
- **Requirements:** Verified custom domain with DNS records (SPF, DKIM).
- **Cloudflare Pages Environment Variables:**
  - `RESEND_API_KEY`: `re_...`
  - `RESEND_FROM_DOMAIN`: `notifications@inshatech.com` (or verified domain)

---

### 4. 💬 Meta WhatsApp Cloud API Gateway
- **Signup URL:** [Meta for Developers WhatsApp](https://developers.facebook.com)
- **Requirements:** Meta Business Account, Verified Business Phone Number.
- **Cloudflare Pages Environment Variables:**
  - `WHATSAPP_TOKEN`: Permanent System User Access Token
  - `WHATSAPP_PHONE_ID`: Registered WhatsApp Phone Number ID
  - `WHATSAPP_BUSINESS_ACCOUNT_ID`: WhatsApp Business Account ID

---

## 🏛️ Priority 1 (P1): Owner Alerts, CRM & Lead Discovery

### 5. 🤖 Telegram Owner Emergency Alert Bot
- **Setup:** Talk to `@BotFather` on Telegram -> Create bot -> Copy Bot Token. Get Chat ID via `@userinfobot`.
- **Cloudflare Pages Environment Variables:**
  - `TELEGRAM_BOT_TOKEN`: `123456789:ABCdef...`
  - `TELEGRAM_OWNER_CHAT_ID`: Your numerical Telegram user ID

---

### 6. 📊 HubSpot / Private CRM Integration
- **Setup:** HubSpot Settings -> Integrations -> Private Apps -> Create App with `crm.objects.contacts.read/write` scopes.
- **Cloudflare Pages Environment Variables:**
  - `HUBSPOT_ACCESS_TOKEN`: `pat-na1-...`

---

### 7. 🎯 Apollo / Approved B2B Lead Enrichment Provider
- **Setup:** Apollo.io -> Settings -> Integrations -> API Keys.
- **Cloudflare Pages Environment Variables:**
  - `APOLLO_API_KEY`: `api_key_...`

---

## 🔄 Exact Step-by-Step Activation Protocol

```text
1. Go to your Cloudflare Dashboard (https://dash.cloudflare.com)
2. Select Pages -> Project: 'inshatech' -> Settings -> Environment Variables
3. Add the required variables for Production and Preview environments
4. Save and Redeploy
5. Go to https://inshatech.pages.dev/admin.html -> System Truth Center
6. Run Connection Test -> Status automatically upgrades to LIVE_VERIFIED
```
