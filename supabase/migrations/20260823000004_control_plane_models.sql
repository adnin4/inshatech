-- ================================================================
-- IINSHA AI-BOS: CONTROL PLANE & MISSION EVIDENCE (20260823000004)
-- Persistent Control-Plane Model with 100% RLS Coverage
-- ================================================================

CREATE TABLE IF NOT EXISTS public.ibos_integration_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adapter_type VARCHAR(50) NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    is_configured BOOLEAN DEFAULT FALSE,
    configuration_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_execution_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    workspace_path TEXT NOT NULL,
    git_branch VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'INITIALIZED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_execution_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.ibos_execution_workspaces(id),
    task_name TEXT NOT NULL,
    assigned_agent VARCHAR(50) NOT NULL,
    requires_owner_approval BOOLEAN DEFAULT FALSE,
    owner_authorized BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'TODO',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_qa_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    verifier_agent_id VARCHAR(50) NOT NULL,
    confidence_score DECIMAL NOT NULL,
    verdict VARCHAR(50) NOT NULL,
    test_run_summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_client_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    client_identity TEXT NOT NULL,
    acceptance_status VARCHAR(50) DEFAULT 'PENDING',
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_delivery_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    release_version VARCHAR(50) NOT NULL,
    commit_sha VARCHAR(100) NOT NULL,
    deployment_url TEXT NOT NULL,
    owner_authorized BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_renewal_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    target_plan VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_mission_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stage VARCHAR(50) NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    evidence_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable 100% RLS Coverage
ALTER TABLE public.ibos_integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_execution_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_qa_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_client_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_delivery_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_renewal_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_mission_evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for integration connections"
    ON public.ibos_integration_connections FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for execution workspaces"
    ON public.ibos_execution_workspaces FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for execution tasks"
    ON public.ibos_execution_tasks FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for qa evidence"
    ON public.ibos_qa_evidence FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for client acceptances"
    ON public.ibos_client_acceptances FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for delivery releases"
    ON public.ibos_delivery_releases FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for renewal opportunities"
    ON public.ibos_renewal_opportunities FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for mission evidence"
    ON public.ibos_mission_evidence FOR SELECT
    TO authenticated USING (true);
