-- ====================================================================
-- IINSHA AI WORKFORCE OS — CONTROL PLANE & OPENTELEMETRY MIGRATION
-- Migration v2026.08.18_06
-- ====================================================================

-- 1. Digital Employee Registry & Role Governance
CREATE TABLE IF NOT EXISTS ibos_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'AG-SALES-001'
    agent_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL, -- 'Revenue', 'Engineering', 'Marketing', 'Finance', 'Operations', 'Governance'
    role_title VARCHAR(150) NOT NULL,
    permission_level VARCHAR(50) DEFAULT 'LEVEL_2_EXECUTE', -- 'LEVEL_0_READ', 'LEVEL_1_DRAFT', 'LEVEL_2_EXECUTE', 'LEVEL_3_APPROVAL', 'LEVEL_4_RESTRICTED'
    allowed_actions JSONB DEFAULT '[]'::jsonb,
    approval_required_actions JSONB DEFAULT '[]'::jsonb,
    forbidden_actions JSONB DEFAULT '[]'::jsonb,
    daily_budget_usd DECIMAL(8,2) DEFAULT 10.00,
    daily_spend_usd DECIMAL(8,4) DEFAULT 0.0000,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'PAUSED_BY_KILLSWITCH', 'RESTRICTED'
    reliability_score DECIMAL(5,2) DEFAULT 98.50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OpenTelemetry GenAI Traces & Observability Spans
CREATE TABLE IF NOT EXISTS ibos_otel_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trace_id VARCHAR(100) NOT NULL,
    span_id VARCHAR(100) NOT NULL,
    parent_span_id VARCHAR(100),
    employee_code VARCHAR(50) REFERENCES ibos_employees(employee_code) ON DELETE SET NULL,
    gen_ai_model VARCHAR(100) NOT NULL, -- e.g. 'gemini-1.5-pro', 'gemini-1.5-flash'
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    cost_usd DECIMAL(8,6) DEFAULT 0.000000,
    tool_calls JSONB DEFAULT '[]'::jsonb,
    explain_why JSONB DEFAULT '{
        "reason": "Routine client inquiry",
        "evidence": "Customer question",
        "policy_decision": "PASS",
        "confidence": 95,
        "risk_score": 10
    }'::jsonb,
    status VARCHAR(50) DEFAULT 'OK', -- 'OK', 'ERROR', 'BLOCKED'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Multi-Touch Revenue Lineage & Attribution
CREATE TABLE IF NOT EXISTS ibos_revenue_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES ibos_orders(id) ON DELETE CASCADE,
    traffic_source VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(150),
    affiliate_code VARCHAR(100),
    responsible_employee VARCHAR(50) REFERENCES ibos_employees(employee_code) ON DELETE SET NULL,
    landing_page VARCHAR(255),
    gross_revenue_usd DECIMAL(10,2) NOT NULL,
    affiliate_commission_usd DECIMAL(10,2) DEFAULT 0.00,
    ai_compute_cost_usd DECIMAL(8,4) DEFAULT 0.0000,
    net_gross_profit_usd DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Global & Departmental Emergency Kill Switches
CREATE TABLE IF NOT EXISTS ibos_kill_switch_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_paused BOOLEAN DEFAULT FALSE,
    sales_paused BOOLEAN DEFAULT FALSE,
    marketing_paused BOOLEAN DEFAULT FALSE,
    payouts_paused BOOLEAN DEFAULT FALSE,
    external_tools_paused BOOLEAN DEFAULT FALSE,
    last_triggered_by VARCHAR(100) DEFAULT 'admin',
    last_triggered_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);

-- Enable Row-Level Security
ALTER TABLE ibos_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_otel_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_revenue_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_kill_switch_state ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Public read active employees" ON ibos_employees FOR SELECT USING (true);
CREATE POLICY "Admin full access employees" ON ibos_employees FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access otel traces" ON ibos_otel_traces FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access revenue attributions" ON ibos_revenue_attributions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access kill switch" ON ibos_kill_switch_state FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_code ON ibos_employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_otel_trace_id ON ibos_otel_traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_otel_employee ON ibos_otel_traces(employee_code);
CREATE INDEX IF NOT EXISTS idx_rev_attribution_order ON ibos_revenue_attributions(order_id);
