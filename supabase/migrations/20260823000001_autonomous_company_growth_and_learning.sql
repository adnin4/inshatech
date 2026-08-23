-- IINSHA AI-BOS: Autonomous Company Growth + Learning Foundation
-- Additive only. No destructive operations.
-- RLS is enabled on every new sensitive table. Policies are intentionally NOT
-- auto-created here because the repository's canonical tenant-claim mapping must
-- be reused rather than guessed. Service-side operations remain governed by the
-- existing authorization/tool-broker model.

create table if not exists public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  source_type text not null check (source_type in ('SEARCH','DIRECTORY','CRM_IMPORT','CUSTOMER_PROVIDED','REFERRAL','EXTERNAL')),
  status text not null default 'NOT_CONFIGURED' check (status in ('ACTIVE','DISABLED','NOT_CONFIGURED','DEGRADED')),
  provider_key text,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  source_id uuid references public.lead_sources(id) on delete set null,
  source_type text not null check (source_type in ('REAL','SYNTHETIC_DEMO','MANUAL','REFERRAL','IMPORT')),
  external_ref text,
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  website text,
  industry text,
  country_code text,
  job_title text,
  profile jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  status text not null default 'DISCOVERED' check (status in ('DISCOVERED','ENRICHED','QUALIFIED','OUTREACH_READY','CONTACTED','RESPONDED','ENGAGED','PROPOSAL','WON','LOST','SUPPRESSED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_prospects_source_external
  on public.prospects(source_id, external_ref)
  where external_ref is not null;
create index if not exists idx_prospects_status on public.prospects(status);
create index if not exists idx_prospects_source_type on public.prospects(source_type);
create index if not exists idx_prospects_org on public.prospects(organization_id);

create table if not exists public.prospect_scores (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  icp_score numeric(5,2) not null default 0,
  intent_score numeric(5,2) not null default 0,
  pain_score numeric(5,2) not null default 0,
  budget_score numeric(5,2) not null default 0,
  timing_score numeric(5,2) not null default 0,
  service_fit_score numeric(5,2) not null default 0,
  opportunity_score numeric(5,2) not null default 0,
  explanation jsonb not null default '{}'::jsonb,
  scored_at timestamptz not null default now()
);

create index if not exists idx_prospect_scores_opportunity
  on public.prospect_scores(opportunity_score desc);
create index if not exists idx_prospect_scores_prospect
  on public.prospect_scores(prospect_id);

create table if not exists public.outreach_suppressions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  contact_email text,
  contact_phone text,
  reason text not null,
  source text not null default 'SYSTEM',
  created_at timestamptz not null default now(),
  unique (organization_id, contact_email, contact_phone)
);

create table if not exists public.outreach_events (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects(id) on delete cascade,
  channel text not null check (channel in ('EMAIL','WHATSAPP','OTHER')),
  event_type text not null check (event_type in ('DRAFT','APPROVED','QUEUED','SENT','DELIVERED','OPENED','REPLIED','BOUNCED','OPTED_OUT','STOPPED','FAILED')),
  provider_event_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  unique(channel, provider_event_id)
);

create index if not exists idx_outreach_events_prospect
  on public.outreach_events(prospect_id, occurred_at desc);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  risk_level text not null default 'MEDIUM' check (risk_level in ('LOW','MEDIUM','HIGH','CRITICAL')),
  status text not null default 'DRAFT' check (status in ('DRAFT','TESTING','BENCHMARKED','APPROVAL_REQUIRED','CANARY','ACTIVE','DEPRECATED','ROLLED_BACK')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_versions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  version text not null,
  implementation jsonb not null default '{}'::jsonb,
  benchmark_score numeric(6,3),
  success_rate numeric(6,3),
  failure_rate numeric(6,3),
  cost_estimate numeric(14,4),
  latency_ms integer,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  unique(skill_id, version)
);

create table if not exists public.skill_evaluations (
  id uuid primary key default gen_random_uuid(),
  skill_version_id uuid not null references public.skill_versions(id) on delete cascade,
  evaluation_type text not null check (evaluation_type in ('UNIT','INTEGRATION','BENCHMARK','SECURITY','CANARY','PRODUCTION')),
  passed boolean not null,
  score numeric(6,3),
  evidence jsonb not null default '{}'::jsonb,
  evaluated_at timestamptz not null default now()
);

create table if not exists public.experience_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  project_id uuid,
  agent_id text,
  problem jsonb not null default '{}'::jsonb,
  architecture jsonb not null default '{}'::jsonb,
  tools jsonb not null default '[]'::jsonb,
  implementation jsonb not null default '{}'::jsonb,
  failures jsonb not null default '[]'::jsonb,
  fixes jsonb not null default '[]'::jsonb,
  qa jsonb not null default '{}'::jsonb,
  deployment jsonb not null default '{}'::jsonb,
  customer_outcome jsonb not null default '{}'::jsonb,
  verification_status text not null default 'UNVERIFIED' check (verification_status in ('UNVERIFIED','VERIFIED','REJECTED')),
  created_at timestamptz not null default now()
);

create index if not exists idx_experience_records_org
  on public.experience_records(organization_id, created_at desc);

alter table public.lead_sources enable row level security;
alter table public.prospects enable row level security;
alter table public.prospect_scores enable row level security;
alter table public.outreach_suppressions enable row level security;
alter table public.outreach_events enable row level security;
alter table public.skills enable row level security;
alter table public.skill_versions enable row level security;
alter table public.skill_evaluations enable row level security;
alter table public.experience_records enable row level security;
