# 🗺️ IINSHA AI-BOS — ROUTE MAP & ACCESS CONTROL AUDIT

| Route | File Path | Classification | Access Control | Protection Mechanism |
| :--- | :--- | :---: | :--- | :--- |
| `/` | `index.html` | **REAL** | Public | Static Edge Delivery + CSP Headers |
| `/marketplace.html` | `marketplace.html` | **REAL** | Public | Dynamic Filter Engine + JSON Catalog |
| `/store.html` | `store.html` | **REAL** | Public | Interactive Multi-Provider Checkout Modal |
| `/portal.html` | `portal.html` | **PARTIAL** | Authenticated Client | `functions/portal/_middleware.js` Route Guard |
| `/admin.html` | `admin.html` | **REAL** | Owner / Super Admin | ASVS 5.0 HMAC JWT Gate (`/api/auth/session`) |
| `/affiliate.html` | `affiliate.html` | **REAL** | Public / Partner | 30-day `iinsha_ref` Cookie Persistence |
| `/compare.html` | `compare.html` | **REAL** | Public | Static SEO Comparison Table |
| `/blog.html` | `blog.html` | **REAL** | Public | Case Studies & Educational Content |
