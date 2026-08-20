-- Production payment/catalog contract.
-- The payment callback layer must never report success without durable persistence.

alter table public.ibos_orders add column if not exists service_slug varchar(128);
alter table public.ibos_orders add column if not exists idempotency_key varchar(128);
alter table public.ibos_orders add column if not exists payment_provider varchar(64);
alter table public.ibos_orders add column if not exists payment_reference varchar(255);
alter table public.ibos_orders add column if not exists paid_at timestamptz;
alter table public.ibos_orders add column if not exists metadata jsonb not null default '{}'::jsonb;
create unique index if not exists uq_ibos_orders_idempotency_key on public.ibos_orders(idempotency_key) where idempotency_key is not null;
create index if not exists idx_ibos_orders_service_slug on public.ibos_orders(service_slug);
create index if not exists idx_ibos_orders_payment_reference on public.ibos_orders(payment_reference);

create table if not exists public.ibos_webhook_events (
  id uuid primary key default uuid_generate_v4(),
  event_id varchar(255) not null unique,
  provider varchar(64) not null,
  event_type varchar(128) not null,
  order_code varchar(64),
  order_id uuid references public.ibos_orders(id),
  status varchar(32) not null default 'received',
  signature_verified boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error_message text
);
alter table public.ibos_webhook_events enable row level security;
create policy deny_public_ibos_webhook_events on public.ibos_webhook_events for all to anon,authenticated using(false) with check(false);
create index if not exists idx_ibos_webhook_events_order_code on public.ibos_webhook_events(order_code);
create index if not exists idx_ibos_webhook_events_order_id on public.ibos_webhook_events(order_id);
create unique index if not exists uq_ibos_revenue_one_time_order on public.ibos_revenue(order_id) where type='one_time' and order_id is not null;

insert into public.ibos_services (slug,title,category,price,commission_rate,packages,features,status)
values
('b2b-lead-swarm','B2B SaaS 5-Agent Hunter Swarm','AI Automation',850,20,'[{"name":"Standard","price":850,"delivery_days":3}]','["Lead discovery","Qualification","CRM routing"]','published'),
('ecommerce-ai-whatsapp','24/7 E-Commerce WhatsApp & Messenger Sales Agent','AI Sales',750,20,'[{"name":"Standard","price":750,"delivery_days":2}]','["WhatsApp","Messenger","Lead follow-up"]','published'),
('voice-ai-receptionist','AI Voice Receptionist (Twilio + Gemini WebRTC)','Voice AI',1800,20,'[{"name":"Standard","price":1800,"delivery_days":5}]','["Voice routing","Qualification","Calendar"]','published'),
('n8n-docker-cluster','Self-Hosted n8n Enterprise Cluster Deployment','Infrastructure',497,20,'[{"name":"Standard","price":497,"delivery_days":1}]','["Docker","n8n","Deployment"]','published'),
('invoice-ocr-pipeline','Autonomous Invoice & Document OCR Pipeline','AI Automation',249,20,'[{"name":"Standard","price":249,"delivery_days":1}]','["OCR","Extraction","Workflow"]','published'),
('ai-saas-mvp','Full-Stack Autonomous AI SaaS MVP','Development',2500,20,'[{"name":"Standard","price":2500,"delivery_days":7}]','["Frontend","Backend","AI integration"]','published'),
('custom-agent-swarm','Custom Multi-Agent Department Mesh','AI Automation',1200,20,'[{"name":"Standard","price":1200,"delivery_days":4}]','["Agent orchestration","Policies","Tool routing"]','published'),
('playwright-scraping-farm','Authorized Web Data Pipeline','Data',75,20,'[{"name":"Standard","price":75,"delivery_days":1}]','["Playwright","Data extraction"]','published'),
('stripe-churn-recovery','Stripe Churn Recovery n8n Engine','Revenue',50,20,'[{"name":"Standard","price":50,"delivery_days":1}]','["Stripe","Churn recovery"]','published'),
('apollo-enrichment-leadgen','Apollo MX Verifier & Enrichment Swarm','Lead Generation',60,20,'[{"name":"Standard","price":60,"delivery_days":1}]','["Enrichment","Verification","Leadgen"]','published')
on conflict (slug) do update set title=excluded.title,category=excluded.category,price=excluded.price,commission_rate=excluded.commission_rate,packages=excluded.packages,features=excluded.features,status='published',updated_at=now();
