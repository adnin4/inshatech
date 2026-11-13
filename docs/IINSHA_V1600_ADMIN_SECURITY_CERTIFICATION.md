# IINSHA AI-BOS — V1600 ADMIN SECURITY CERTIFICATION
**Generated At:** 2026-11-13T16:06:00+06:00 (Asia/Dhaka)  
**Evaluated Target:** Admin Cockpit (`admin.html`), Gate (`/api/admin/gate`), Session (`/api/auth/session`), Logout (`/api/auth/logout`)  
**Status:** `SECURITY_HARDENED` | `LOCAL_TESTS_PASS` (72/72) | `OWNER_MFA_ENROLLMENT_PENDING` (Gate G5)

---

## 1. Authentication & Session Architecture

```
User Browser (admin.html)
     │
     ├─ 1. POST /api/auth/session (email, password)
     │        └─ Server validates PBKDF2 hash (600,000 iterations, constant-time)
     │        └─ Returns 401 MFA_REQUIRED
     │
     ├─ 2. POST /api/auth/session (email, password, mfa_token)
     │        └─ Server decodes RFC 4648 Base32 MFA_SECRET
     │        └─ Validates TOTP using RFC 6238 HMAC-SHA1
     │        └─ Replay check against Cloudflare Durable Object (SECURITY_COORDINATOR)
     │        └─ Issues signed JWT session token (HttpOnly cookie + JSON bearer)
     │
     ├─ 3. GET /api/admin/gate
     │        └─ Validates JWT signature, expiry (exp), and role ('owner')
     │        └─ Authoritative check against SECURITY_COORDINATOR (is_revoked)
     │        └─ In production/staging, missing DO strictly fails closed with HTTP 503
     │
     └─ 4. POST /api/auth/logout
              └─ Authoritative write to SECURITY_COORDINATOR (revoke jti)
              └─ Updates secondary REVOCATION_KV cache
              └─ Clears HttpOnly cookie & returns 200 LOGGED_OUT
```

---

## 2. Admin UI & Accessibility Semantics

1. **Inert Background DOM Isolation:**
   - All protected admin controls are wrapped in `<div id="admin-main-content" inert aria-hidden="true">`.
   - Before successful server authentication, screen readers, keyboard navigation, and mouse events cannot interact with or access background dashboard controls.
   - Upon successful 2-step verification, `unlockAdminUI()` dynamically removes `inert` and `aria-hidden`.
   - Upon logout or session timeout, `lockAdminUI()` restores `inert` and `aria-hidden="true"`.

2. **Accessible Dialog Semantics:**
   - `#admin-auth-overlay` enforces `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="admin-dialog-title"`.
   - Focus trapping is bound to the overlay, preventing Tab key navigation from escaping to hidden or inert elements.
   - Form inputs (`#admin-email`, `#admin-password`, `#admin-otp-code`) feature explicit `aria-label` attributes.

3. **Sample Data Notice:**
   - All financial and revenue charts in `admin.html` are explicitly labeled as illustrative demonstration figures to eliminate false representations of production revenue.

---

## 3. Test Verification (72/72 Assertions Passing)

The security suite `scripts/test_admin_auth_security.mjs` verifies:
* Missing secrets fail closed with HTTP 503 `CONFIGURATION_ERROR`.
* Wrong credentials fail closed with HTTP 401 `INVALID_CREDENTIALS`.
* Salted PBKDF2 with 600,000 iterations verifies correctly; legacy unsalted SHA-256 is strictly rejected.
* Session tampering, token expiry, and non-owner roles are rejected.
* Unauthenticated workforce killswitches fail closed with HTTP 401.
* Anti-replay coordinator rejects immediate reuse of the same TOTP token.
* Missing coordinator in staging/production strictly fails closed with HTTP 503.
* Authoritative Durable Object revocation cannot be bypassed by KV cache alone.
* Official RFC 6238 Appendix B test vectors pass 100% across all 6 standard timestamps.
