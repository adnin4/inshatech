# 01-system-map.md — Comprehensive Architecture System Map

```text
[CLIENT BROWSER: Customer / Affiliate / Admin]
                      │
                      ▼
[CLOUDFLARE ANYCAST EDGE: Functions API + Assets]
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Auth / Gate    Checkout/Pay   Universal AI
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
[POSTGRESQL 17: Supabase inshatech-db (28 Tables, RLS)]
```
