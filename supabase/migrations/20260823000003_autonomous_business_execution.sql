-- ================================================================
-- IINSHA AI-BOS: AUTONOMOUS BUSINESS EXECUTION (20260823000003)
-- Governed Post-Sale Operating Layer & Unverified Learning Records
-- ================================================================

CREATE TABLE IF NOT EXISTS public.ibos_business_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_name TEXT NOT NULL,
    company TEXT NOT NULL,
    service_id TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PROPOSAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_client_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    client_email TEXT NOT NULL,
    approval_status VARCHAR(50) DEFAULT 'APPROVED',
    approved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_unverified_learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL,
    learned_pattern TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'UNVERIFIED',
    reviewed_by_human BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable 100% RLS Coverage
ALTER TABLE public.ibos_business_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_client_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_unverified_learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for business opportunities"
    ON public.ibos_business_opportunities FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for client approvals"
    ON public.ibos_client_approvals FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for unverified learnings"
    ON public.ibos_unverified_learnings FOR SELECT
    TO authenticated USING (true);
