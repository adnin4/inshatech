# IINSHA AI-BOS — Integration Status

Updated: 2026-09-07

| Integration | Provider / Layer | State | Evidence class |
|---|---|---|---|
| Global payment | Lemon Squeezy | Adapter/code present; live settlement not proven | CONFIGURED_UNVERIFIED |
| Card payments | Stripe | Adapter/code present; credentials/transaction not proven | CONFIGURED_UNVERIFIED |
| Bangladesh payments | bKash / Nagad / manual routes | Routing code may exist; live settlement not proven | CONFIGURED_UNVERIFIED |
| Database | Supabase `kitwadizsvjmuxkfewxj` | Control-plane active and RLS baseline verified | CONTROL-PLANE VERIFIED |
| Edge hosting | Cloudflare Pages | Project/code integration present; current production SHA needs external proof | EXTERNAL_PROOF_REQUIRED |
| Homepage truth guard | Cloudflare Pages Functions middleware | Implemented for `/` | DEPLOYMENT-DEPENDENT |

## Policy

Provider identifiers, checkout URLs, adapter code, or local tests do not prove a real provider transaction. Payment is not `LIVE_VERIFIED` until a controlled real transaction, signed webhook, replay protection, durable event, and reconciliation are independently evidenced.
