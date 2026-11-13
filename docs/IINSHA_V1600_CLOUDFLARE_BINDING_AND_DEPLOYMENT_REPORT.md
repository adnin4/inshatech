# IINSHA AI-BOS — V1600 CLOUDFLARE BINDING & DEPLOYMENT REPORT
**Generated At:** 2026-11-13T16:06:00+06:00 (Asia/Dhaka)  
**Cloudflare Pages Project:** `inshatech`  
**Staging Host:** `https://inshatech-b6b.pages.dev/`  
**Status:** `STAGING_PARITY_VERIFIED` | `DURABLE_OBJECT_BINDING_PENDING` (Gate G2)

---

## 1. Cloudflare Pages Staging Deployment Telemetry

Querying live staging origin (`https://inshatech-b6b.pages.dev/api/version`):
* **Status:** `READY_FOR_STAGING`
* **Classification:** `DEPLOYMENT_PARITY_VERIFIED`
* **Deploy SHA:** `478b69b3377c7506d932133f308c02a41ef8c2b6`
* **Expected Release SHA:** `478b69b3377c7506d932133f308c02a41ef8c2b6`
* **Deployment Parity:** `true`
* **Edge Node Region:** `DAC` (Dhaka Edge)
* **Environment:** `staging`

---

## 2. Cloudflare Durable Object Binding (Owner Action G2)

The repository provides a dedicated security coordinator worker in `workers/security-coordinator/`:
* Class: `SecurityCoordinator`
* Script: `security-coordinator`
* Storage: Durable Object SQLite storage for strongly-consistent session revocation and anti-replay defense.

### Required Cloudflare Dashboard Configuration Steps:
1. Log in to **Cloudflare Dashboard** -> **Workers & Pages**.
2. Select Pages project **`inshatech`**.
3. Navigate to **Settings** -> **Functions** -> **Bindings**.
4. Click **Add Binding**:
   - **Type:** Durable Object
   - **Variable name:** `SECURITY_COORDINATOR`
   - **Durable Object namespace:** Select `SecurityCoordinator` (bound to script `security-coordinator`).
5. Also configure environment secrets under **Settings** -> **Environment Variables**:
   - `JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `MFA_SECRET` (Base32 format)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Save and Deploy**.
