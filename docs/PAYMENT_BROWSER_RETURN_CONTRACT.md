# Payment Browser Return Contract

A payment provider may redirect or call the merchant's browser after a checkout attempt. That browser request is not authoritative payment evidence.

## Rules

- Browser returns are GET-only and read-only.
- Browser return handlers may redirect to a portal or order-status page.
- Browser return handlers must never set `payment_status=paid`, `order_status=confirmed`, `paid_at`, commission, delivery, or any other financial side effect.
- Provider server callbacks/webhooks/IPN are the only paths allowed to confirm payment.
- Legacy GET requests aimed at `/api/payments/webhook` are redirected to `/api/payments/return` so they cannot reach the POST-only mutation handler.
- Provider-native verification is required before a successful webhook can mutate payment state.

Cloudflare Pages supports route-scoped `_middleware.js` files that can run before route handlers and pass the request through with `context.next()`. This project uses that capability only as a compatibility boundary; POST webhook traffic remains separate from browser GET traffic. 

## Security consequence

An attacker can forge a browser URL such as `?status=success`. The application must treat that value as a display hint only. The order remains unpaid until the verified provider event is processed.
