# Payment Schema / Code Parity — Execution Gate

## Scope
This gate aligns the payment checkout persistence contract with the live `public.ibos_orders` schema without adding compatibility columns or rebuilding the database.

## Verified database contract
`public.ibos_orders` currently contains:

- `id`
- `order_code`
- `service_id`
- `service_title`
- `package_name`
- `amount`
- `currency`
- `bdt_amount`
- `client_name`
- `client_email`
- `client_phone`
- `affiliate_ref_code`
- `affiliate_commission`
- `payment_status`
- `order_status`
- `created_at`
- `service_slug`
- `idempotency_key`
- `payment_provider`
- `payment_reference`
- `paid_at`
- `metadata`

`metadata` is NOT NULL and therefore must always be supplied by checkout persistence.

## Changes made
`functions/api/payments/checkout.js` now:

1. Reads existing orders using `payment_provider`, not the removed/non-canonical `payment_gateway` field.
2. Persists `service_id`, `service_slug`, `service_title`, `package_name`, `amount`, `currency`, and `bdt_amount` using the canonical names.
3. Persists `client_name`, `client_email`, and `client_phone` using canonical names.
4. Persists `payment_provider`, `payment_status`, `order_status`, and `idempotency_key` using canonical names.
5. Always supplies non-null `metadata` for newly created orders.
6. Fails closed when the Supabase server configuration is absent instead of continuing toward a gateway request without durable order persistence.
7. Resolves the selected service from the published `ibos_services` record and stores its UUID/title/price as the server-side authority foundation for the next gates.
8. Preserves the existing checkout response fields used by the public UI (`order_id`, `provider`, `amount_usd`, `amount_bdt`, `redirect_url`, `gateway_data`).
9. Retains the existing provider branches for SSLCommerz, Lemon Squeezy, bKash, and Stripe.

## Regression guard
`scripts/verify_payment_schema_parity.mjs` checks the checkout source for forbidden legacy persistence references and required canonical fields.

## Not yet certified
This gate is **IMPLEMENTED / VERIFICATION PENDING** until the repository CI executes the parity script and the payment endpoint is smoke-tested against the deployed runtime. Production payment activation remains blocked.

## Next dependent gates
1. Make service UUID authority fully database-driven and remove remaining static service identity authority.
2. Make package-specific server price authoritative from `ibos_services.packages`/pricing policy instead of retaining static compatibility metadata.
3. Replace the coupon hard-coding with a server-side coupon policy/eligibility engine.
4. Complete race-safe idempotency and payment state-machine enforcement.
