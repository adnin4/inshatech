# Payment Schema Compatibility Contract

`functions/api/payments/checkout.js` must write only the canonical `public.ibos_orders` columns.

## Canonical mapping

- `service_id` -> UUID of the exactly-one published `ibos_services` row resolved from the request slug.
- `service_title` -> server-resolved service title.
- `package_name` -> server-resolved package name, not a trusted client price label.
- `amount` -> server-calculated authoritative USD amount.
- `currency` -> server-selected currency.
- `bdt_amount` -> server-calculated BDT amount.
- `client_name`, `client_email`, `client_phone` -> validated customer fields.
- `payment_provider` -> normalized supported provider identifier.
- `payment_status` -> server-owned payment lifecycle state.
- `order_status` -> server-owned order lifecycle state.
- `idempotency_key` -> unique request identity.
- `payment_reference` and `paid_at` -> populated only from authoritative provider verification.
- `metadata` -> structured non-authoritative context/evidence.

## Forbidden legacy names

Checkout code must not write `service_name`, `amount_usd`, `amount_bdt`, `customer_name`, `customer_email`, `customer_phone`, or `payment_gateway` to `ibos_orders`.

## Compatibility requirement

Frontend request and response contracts must remain backward compatible unless a separately reviewed migration is required. Backend hardening must not redesign existing pages, styles, navigation, or customer-facing features.
