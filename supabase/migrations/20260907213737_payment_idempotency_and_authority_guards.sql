-- Payment authority and idempotency hardening.
-- Applied to canonical Supabase project before repository synchronization.

create unique index if not exists ibos_orders_idempotency_key_uidx
    on public.ibos_orders (idempotency_key)
    where idempotency_key is not null and btrim(idempotency_key) <> '';

create index if not exists ibos_orders_payment_provider_status_idx
    on public.ibos_orders (payment_provider, payment_status);

create index if not exists ibos_orders_order_status_created_idx
    on public.ibos_orders (order_status, created_at desc);

create index if not exists ibos_webhook_events_provider_received_idx
    on public.ibos_webhook_events (provider, received_at desc);
