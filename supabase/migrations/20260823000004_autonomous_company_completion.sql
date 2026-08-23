-- IINSHA AI-BOS — governed autonomous company completion schema
-- Additive only. Sensitive tables are RLS-enabled; service-side policy mapping
-- must use the repository's canonical tenant/role claims rather than guesses.

CREATE TABLE IF NOT EXISTS public.crm_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  prospect_id uuid REFERENCES public.prospects(id) ON DELETE SET NULL,
  owner_user_id uuid,
  service_id uuid,
  status text NOT NULL DEFAULT 'QUALIFIED',
  customer_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  service_id uuid,
  status text NOT NULL DEFAULT 'DRAFT',
  terms jsonb NOT NULL DEFAULT '{}'::jsonb,
  margin_audit jsonb NOT NULL DEFAULT '{}'::jsonb,
  accepted_by uuid,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.crm_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.crm_proposals(id) ON DELETE RESTRICT,
  provider_order_ref text,
  payment_status text NOT NULL DEFAULT 'PENDING',
  order_status text NOT NULL DEFAULT 'OPEN',
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  idempotency_key text NOT NULL UNIQUE,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_id text,
  idempotency_key text NOT NULL,
  order_id uuid REFERENCES public.crm_orders(id) ON DELETE SET NULL,
  status text NOT NULL,
  raw_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  verified boolean NOT NULL DEFAULT false,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(provider, idempotency_key)
);

CREATE TABLE IF NOT EXISTS public.delivery_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.crm_orders(id) ON DELETE RESTRICT,
  proposal_id uuid REFERENCES public.crm_proposals(id) ON DELETE SET NULL,
  organization_id uuid,
  title text NOT NULL,
  state text NOT NULL DEFAULT 'PAID',
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  assigned_agents jsonb NOT NULL DEFAULT '[]'::jsonb,
  qa_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  client_acceptance jsonb NOT NULL DEFAULT '{}'::jsonb,
  release jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.delivery_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.delivery_projects(id) ON DELETE CASCADE,
  task_key text NOT NULL,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'TODO',
  assigned_agent text,
  dependency_keys jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, task_key)
);

CREATE TABLE IF NOT EXISTS public.delivery_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.delivery_projects(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  actor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.support_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.delivery_projects(id) ON DELETE SET NULL,
  organization_id uuid,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'OPEN',
  subject text NOT NULL,
  description text,
  assigned_agent text,
  sla_due_at timestamptz,
  resolution jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.renewal_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.delivery_projects(id) ON DELETE SET NULL,
  organization_id uuid,
  due_at timestamptz,
  offer_id uuid,
  status text NOT NULL DEFAULT 'SCHEDULED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.learning_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  project_id uuid,
  agent_id text,
  skill_name text NOT NULL,
  status text NOT NULL DEFAULT 'UNVERIFIED',
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  success_metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  failure_modes jsonb NOT NULL DEFAULT '[]'::jsonb,
  benchmark jsonb NOT NULL DEFAULT '{}'::jsonb,
  approved_by uuid,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.autonomous_business_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  source text NOT NULL,
  organization_id uuid,
  entity_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_opportunities_status ON public.crm_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_prospect ON public.crm_opportunities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_crm_proposals_status ON public.crm_proposals(status);
CREATE INDEX IF NOT EXISTS idx_crm_orders_payment_status ON public.crm_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_payment_events_order ON public.payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_projects_state ON public.delivery_projects(state);
CREATE INDEX IF NOT EXISTS idx_delivery_tasks_project ON public.delivery_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_support_cases_project ON public.support_cases(project_id);
CREATE INDEX IF NOT EXISTS idx_renewal_opportunities_due ON public.renewal_opportunities(due_at);
CREATE INDEX IF NOT EXISTS idx_learning_candidates_status ON public.learning_candidates(status);
CREATE INDEX IF NOT EXISTS idx_business_events_type_time ON public.autonomous_business_events(event_type, occurred_at DESC);

ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.renewal_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.autonomous_business_events ENABLE ROW LEVEL SECURITY;
