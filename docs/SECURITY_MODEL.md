# Security Model

## Permission Levels
- **LEVEL_0:** Public, unauthenticated.
- **LEVEL_1:** Authenticated user, basic access.
- **LEVEL_2:** Affiliate/Partner.
- **LEVEL_3:** Internal Agent (requires oversight).
- **LEVEL_4:** Administrator/Guardian.

## Auth Flow
Leverages Supabase Auth. Tokens are verified via middleware in Cloudflare Functions. RLS is enforced at the DB level.

## Secret Management
All sensitive keys (Stripe, AI, DB passwords) are stored as Cloudflare Secrets. Never exposed client-side.

## Validation & Limits
- Input/output schemas strictly validated.
- IP-based Rate Limiting implemented at Cloudflare Edge.
- Comprehensive Audit Logging for all LEVEL_2+ actions.
