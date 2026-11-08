# IINSHATECH ENTERPRISE SYSTEM ARCHITECTURE
**Document Version**: 1000.1  
**Status**: Production-Grade Approved  

---

## 1. Executive Architecture Overview
IINSHATECH is engineered as a zero-hardcoding, data-driven Business Platform. The frontend is hosted on Cloudflare Pages for ultra-fast static asset delivery, backed by a serverless Cloudflare Workers API Edge Gateway, and powered by a Supabase PostgreSQL database acting as the Single Source of Truth.

```
+-----------------------------------------------------------------------+
|                            USER BROWSER                               |
|   (index.html, app.js, style.css, dynamic modals, responsive UI)      |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                     CLOUDFLARE PAGES CDN                              |
|   (Edge Static Hosting, Cache-Busting Headers, 0-ms Cold Starts)      |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                    CLOUDFLARE WORKERS API                             |
|   (Serverless Edge Gateway: /api/services, /api/content, /api/admin)   |
+-----------------------------------+-----------------------------------+
                                    |
                                    v
+-----------------------------------+-----------------------------------+
|                    SUPABASE POSTGRESQL DB                             |
|   (Single Source of Truth, Row Level Security, Audit Logging)        |
+-----------------------------------------------------------------------+
```

---

## 2. Core Architectural Principles
1. **Single Source of Truth**: All business data (services, prices, features, affiliate commissions, content dictionary, payment methods) originates from Supabase PostgreSQL.
2. **Zero Hardcoded Data**: Frontend files render dynamically via API contracts.
3. **50-Module Universal Control Studio**: Complete administrative control over content, services, pricing, orders, affiliates, and feature flags.
4. **Deterministic Attribution**: Last-click 30-day affiliate tracking window locked by server-side rules.
5. **Production Security**: Row Level Security (RLS), security headers, sanitized HTML, and hashed passwords.
