# 03_CLOUDFLARE_HARDENING.md — Cloudflare Production Hardening

- **SSL/TLS Mode:** Full (Strict) with HSTS `max-age=31536000; includeSubDomains; preload`.
- **WAF & Security Headers:** `_headers` active (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, CSP strict).
- **SPA Routing Invariant:** `_redirects` active for clean single-page rewrite (200 OK).
- **Status:** **LIVE_VERIFIED**
