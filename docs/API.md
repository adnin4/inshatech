# IINSHATECH API GATEWAY SPECIFICATION

## 1. Public Read APIs
- `GET /api/content/words` — Returns dynamic key-value content dictionary.
- `GET /api/services` — Returns published service catalog, tier pricing, and BDT exchange rate.
- `GET /api/payment-gateways` — Returns active payment gateways and account details.
- `GET /api/theme` — Returns dynamic design tokens and glassmorphism styling parameters.

---

## 2. Authenticated Admin APIs
- `GET /api/admin` — Verifies RBAC admin session status.
- `POST /api/services` — Create or update service item in database.
- `POST /api/affiliate/payout` — Process affiliate payout transaction.
