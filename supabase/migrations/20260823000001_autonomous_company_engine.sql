-- ==============================================================================
-- IINSHA AI-BOS: AUTONOMOUS COMPANY & CONTINUOUS LEARNING SCHEMA EXTENSION
-- Migration: 20260823000001_autonomous_company_engine.sql
-- Invariants: 100% RLS Enabled, Explicit Foreign Keys, Non-Destructive
-- ==============================================================================

-- 1. Lead Sources Registry
CREATE TABLE IF NOT EXISTS public.ibos_lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'INTERNAL',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Qualified Lead Prospects (Separating REAL_PROSPECT from SYNTHETIC_DEMO)
CREATE TABLE IF NOT EXISTS public.ibos_lead_prospects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(64),
    company VARCHAR(128) NOT NULL,
    company_domain VARCHAR(128),
    industry VARCHAR(128) NOT NULL,
    target_role VARCHAR(128),
    source_id VARCHAR(64) REFERENCES public.ibos_lead_sources(source_code) ON DELETE SET NULL,
    classification VARCHAR(32) NOT NULL DEFAULT 'MANUAL', -- REAL_PROSPECT, SYNTHETIC_DEMO, MANUAL, REFERRAL, IMPORTED
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    icp_score INT NOT NULL DEFAULT 50,
    intent_score INT NOT NULL DEFAULT 50,
    qualification_score INT NOT NULL DEFAULT 50,
    status VARCHAR(64) NOT NULL DEFAULT 'NURTURE_STAGE',
    recommended_service VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Opt-Out & Suppression Registry
CREATE TABLE IF NOT EXISTS public.ibos_opt_outs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) UNIQUE NOT NULL, -- Email, Domain, or Phone
    reason TEXT DEFAULT 'Unsubscribed by recipient',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Governed Institutional Skills Registry
CREATE TABLE IF NOT EXISTS public.ibos_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_code VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'Automation',
    version VARCHAR(32) NOT NULL DEFAULT '1.0.0',
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT_CANDIDATE', -- DRAFT_CANDIDATE, SANDBOX_TESTED, CANARY_VERIFIED, PRODUCTION_VERIFIED
    success_rate DECIMAL(5,4) NOT NULL DEFAULT 0.8500,
    avg_resolution_seconds INT NOT NULL DEFAULT 60,
    authoritative_rule TEXT NOT NULL,
    sandbox_benchmark_passed BOOLEAN NOT NULL DEFAULT false,
    security_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Technical Experience Graph Nodes
CREATE TABLE IF NOT EXISTS public.ibos_experience_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_code VARCHAR(64) UNIQUE NOT NULL,
    client_industry VARCHAR(128) NOT NULL,
    problem_statement TEXT NOT NULL,
    recommended_architecture TEXT NOT NULL,
    tools_employed JSONB NOT NULL DEFAULT '[]'::jsonb,
    encountered_failures JSONB NOT NULL DEFAULT '[]'::jsonb,
    applied_fixes JSONB NOT NULL DEFAULT '[]'::jsonb,
    verified_outcome TEXT NOT NULL,
    customer_satisfaction_rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. AI CEO Daily Executive Briefings
CREATE TABLE IF NOT EXISTS public.ibos_ceo_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    briefing_code VARCHAR(64) UNIQUE NOT NULL,
    executive_summary TEXT NOT NULL,
    financial_pacing JSONB NOT NULL DEFAULT '{}'::jsonb,
    growth_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_radar JSONB NOT NULL DEFAULT '[]'::jsonb,
    actionable_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(32) NOT NULL DEFAULT 'READY_FOR_OWNER_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.ibos_lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_lead_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_opt_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_experience_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_ceo_briefings ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated staff
CREATE POLICY p_read_lead_sources ON public.ibos_lead_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY p_read_lead_prospects ON public.ibos_lead_prospects FOR SELECT TO authenticated USING (true);
CREATE POLICY p_read_opt_outs ON public.ibos_opt_outs FOR SELECT TO authenticated USING (true);
CREATE POLICY p_read_skills ON public.ibos_skills FOR SELECT TO authenticated USING (true);
CREATE POLICY p_read_experience_nodes ON public.ibos_experience_nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY p_read_ceo_briefings ON public.ibos_ceo_briefings FOR SELECT TO authenticated USING (true);
