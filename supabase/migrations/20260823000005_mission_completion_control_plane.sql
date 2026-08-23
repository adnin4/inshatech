-- IINSHA AI-BOS — Mission Completion Control Plane
-- Additive only. No destructive operations.
-- Sensitive tables are RLS-enabled; canonical tenant policy is intentionally
-- delegated to the existing tenant-claim model rather than guessed here.

create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  integration_type text not null,
  provider text not null,
  status text not null default 'NOT_CONFIGURED'
    check (status in ('NOT_CONFIGURED','CONFIGURED_NOT_VERIFIED','SANDBOX_VERIFIED','LIVE_VERIFIED','DEGRADED','DISABLED')),
  configuration_meta jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, integration_type, provider)
);

create table if not exists public.execution_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  project_id uuid,
  provider text,
  status text not null default 'REQUESTED'
    check (status in ('REQUESTED','READY','RUNNING','BLOCKED','COMPLETED','FAILED','DESTROYED')),
  environment text not null default 'SANDBOX'
    check (environment in ('SANDBOX','PREVIEW','PRODUCTION')),
  repository_ref text,
  release_sha text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.execution_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.execution_workspaces(id) on delete cascade,
  task_type text not null,
  status text not null default 'QUEUED'
    check (status in ('QUEUED','RUNNING','PASSED','FAILED','BLOCKED','CANCELLED')),
  risk_level text not null default 'LOW'
    check (risk_level in ('LOW','MEDIUM','HIGH','CRITICAL')),
  input_meta jsonb not null default '{}'::jsonb,
  output_meta jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.qa_evidence (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  execution_task_id uuid references public.execution_tasks(id) on delete set null,
  suite_name text not null,
  passed boolean not null default false,
  confidence numeric(6,3) not null default 0,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.client_acceptances (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  customer_user_id uuid,
  decision text not null check (decision in ('APPROVED','CHANGES_REQUESTED','REJECTED')),
  version text,
  commit_sha text,
  notes text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.delivery_releases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  environment text not null check (environment in ('PREVIEW','PRODUCTION')),
  status text not null default 'PENDING'
    check (status in ('PENDING','AUTHORIZED','DEPLOYED','ROLLED_BACK','FAILED')),
  version text,
  commit_sha text,
  release_url text,
  owner_approved boolean not null default false,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.renewal_opportunities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid,
  customer_user_id uuid,
  due_at timestamptz,
  status text not null default 'SCHEDULED'
    check (status in ('SCHEDULED','DUE','CONTACTED','RENEWED','LOST','CANCELLED')),
  offer_meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mission_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  mission_name text not null,
  stage text not null,
  status text not null
    check (status in ('CODE_READY','TEST_VERIFIED','SANDBOX_VERIFIED','LIVE_VERIFIED','NOT_CONFIGURED','FAILED')),
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_integration_connections_org on public.integration_connections(organization_id);
create index if not exists idx_execution_workspaces_project on public.execution_workspaces(project_id);
create index if not exists idx_execution_tasks_workspace on public.execution_tasks(workspace_id, created_at desc);
create index if not exists idx_qa_evidence_project on public.qa_evidence(project_id, created_at desc);
create index if not exists idx_client_acceptances_project on public.client_acceptances(project_id, created_at desc);
create index if not exists idx_delivery_releases_project on public.delivery_releases(project_id, created_at desc);
create index if not exists idx_renewal_opportunities_customer on public.renewal_opportunities(customer_user_id, due_at);
create index if not exists idx_mission_evidence_stage on public.mission_evidence(mission_name, stage, created_at desc);

alter table public.integration_connections enable row level security;
alter table public.execution_workspaces enable row level security;
alter table public.execution_tasks enable row level security;
alter table public.qa_evidence enable row level security;
alter table public.client_acceptances enable row level security;
alter table public.delivery_releases enable row level security;
alter table public.renewal_opportunities enable row level security;
alter table public.mission_evidence enable row level security;

comment on table public.integration_connections is 'Owner-controlled external integration lifecycle; secrets are never stored here.';
comment on table public.execution_workspaces is 'Isolated sandbox/preview/production workspace metadata; execution is adapter-controlled.';
comment on table public.mission_evidence is 'Evidence-backed status for autonomous-company mission stages.';
