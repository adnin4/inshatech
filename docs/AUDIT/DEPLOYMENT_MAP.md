# 10_DEPLOYMENT_MAP.md — Deployment Architecture Map

```text
[GitHub: adnin4/inshatech (master)]
                │
        (Git Integration)
                │
                ▼
  [Cloudflare Pages Build Pipeline]
                │
                ├── _headers (CSP Strict, HSTS, X-Frame-Options DENY)
                ├── _redirects (Clean SPA 200 Rewrite)
                └── functions/api/* (Edge Functions)
                │
                ▼
 [Live Production: https://inshatech.pages.dev/]
```
