# Payment Schema Audit

Status: AUDIT_ONLY

The production payment path must write the existing `ibos_orders` contract: `service_id` is UUID/FK to `ibos_services.id`; authoritative fields are `service_title`, `amount`, `currency`, `bdt_amount`, `client_name`, `client_email`, `client_phone`, `payment_provider`, `idempotency_key`, `payment_status`, and `order_status`.

The checkout implementation must resolve a service slug to its UUID before inserting an order and must never write client-controlled price or unsupported column names.

SSLCOMMERZ production activation remains blocked until credentials, sandbox evidence, provider-native validation, webhook adversarial tests, reconciliation, and refund evidence are present.