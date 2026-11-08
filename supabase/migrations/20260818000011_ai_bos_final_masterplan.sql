-- ====================================================================
-- IINSHA AI-BOS — FINAL MASTERPLAN: TRI-PILLAR OS & FULFILLMENT ENGINE
-- Migration v2026.08.18_11
-- ====================================================================

-- 1. Multi-Tenant Workspaces Isolation
CREATE TABLE IF NOT EXISTS ibos_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    workspace_name VARCHAR(150) NOT NULL,
    workspace_slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'ENTERPRISE_CUSTOM',
    allocated_agent_budget_usd DECIMAL(8,2) DEFAULT 20.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Post-Sale Automated Fulfillment Projects
CREATE TABLE IF NOT EXISTS ibos_fulfillment_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ibos_workspaces(id) ON DELETE CASCADE,
    order_id UUID REFERENCES ibos_orders(id) ON DELETE SET NULL,
    project_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'PRJ_ECOM_8291'
    service_id VARCHAR(100) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    current_phase VARCHAR(50) DEFAULT 'REQUIREMENTS', -- 'REQUIREMENTS', 'ARCHITECTURE', 'WORKFLOW_DEV', 'QA_TESTING', 'DEPLOYED', 'MONITORING'
    assigned_architect VARCHAR(50) DEFAULT 'AG-ARCH-003',
    assigned_developer VARCHAR(50) DEFAULT 'AG-DEV-004',
    assigned_qa VARCHAR(50) DEFAULT 'AG-QA-005',
    delivery_progress_percent INT DEFAULT 20,
    qa_check_passed BOOLEAN DEFAULT FALSE,
    client_approved_at TIMESTAMPTZ,
    deployed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI Cost Control Tower & Budget Ledger
CREATE TABLE IF NOT EXISTS ibos_cost_control_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ibos_workspaces(id) ON DELETE CASCADE,
    ledger_date DATE DEFAULT CURRENT_DATE,
    daily_budget_limit_usd DECIMAL(8,2) DEFAULT 20.00,
    current_spend_usd DECIMAL(8,4) DEFAULT 0.0000,
    is_80_percent_warning_sent BOOLEAN DEFAULT FALSE,
    is_100_percent_auto_paused BOOLEAN DEFAULT FALSE,
    paused_agents JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Morning AI Executive Briefings
CREATE TABLE IF NOT EXISTS ibos_daily_briefings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES ibos_workspaces(id) ON DELETE CASCADE,
    brief_date DATE DEFAULT CURRENT_DATE,
    revenue_yesterday_usd DECIMAL(10,2) NOT NULL,
    new_leads_count INT DEFAULT 0,
    deals_closed_count INT DEFAULT 0,
    affiliate_revenue_usd DECIMAL(10,2) DEFAULT 0.00,
    ai_compute_spend_usd DECIMAL(8,4) DEFAULT 0.0000,
    top_win TEXT NOT NULL,
    top_risk TEXT NOT NULL,
    strategic_recommendation TEXT NOT NULL,
    dispatched_channels JSONB DEFAULT '["TELEGRAM", "DASHBOARD"]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_fulfillment_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_cost_control_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_daily_briefings ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Admin full access workspaces" ON ibos_workspaces FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access fulfillment" ON ibos_fulfillment_projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access cost ledger" ON ibos_cost_control_ledger FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access briefings" ON ibos_daily_briefings FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workspace_slug ON ibos_workspaces(workspace_slug);
CREATE INDEX IF NOT EXISTS idx_prj_code ON ibos_fulfillment_projects(project_code);
CREATE INDEX IF NOT EXISTS idx_ledger_date ON ibos_cost_control_ledger(ledger_date);
