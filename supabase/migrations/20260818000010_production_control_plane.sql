-- ====================================================================
-- IINSHA — PRODUCTION CONTROL PLANE, TOOL REGISTRY & DURABLE HITL
-- Migration v2026.08.18_10
-- ====================================================================

-- 1. Central Tool Registry with Strict Schemas & Risk Classifications
CREATE TABLE IF NOT EXISTS ibos_tool_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'read_customer', 'create_order', 'process_refund'
    risk_level VARCHAR(50) NOT NULL, -- 'LEVEL_0_READ', 'LEVEL_1_DRAFT', 'LEVEL_2_EXECUTE', 'LEVEL_3_APPROVAL', 'LEVEL_4_RESTRICTED'
    description TEXT NOT NULL,
    input_schema JSONB NOT NULL,
    output_schema JSONB NOT NULL,
    allowed_departments JSONB DEFAULT '["DEPT_REV", "DEPT_DELV"]'::jsonb,
    rate_limit_per_minute INT DEFAULT 60,
    cost_per_call_usd DECIMAL(8,6) DEFAULT 0.000100,
    requires_human_approval BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Durable HITL Checkpoint States for Pause & Resume
CREATE TABLE IF NOT EXISTS ibos_durable_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'appr_payout_8291'
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE CASCADE,
    requesting_agent VARCHAR(50) NOT NULL, -- e.g. 'AG-FIN-006'
    action_type VARCHAR(100) NOT NULL, -- e.g. 'PAYOUT_DISBURSEMENT', 'DISCOUNT_OVERRIDE'
    risk_level VARCHAR(50) NOT NULL,
    serialized_context_state JSONB NOT NULL, -- Exact execution payload serialized to resume seamlessly
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'ESCALATED'
    approved_by VARCHAR(100),
    approval_channel VARCHAR(50) DEFAULT 'CPANEL', -- 'CPANEL', 'TELEGRAM', 'EMAIL'
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 HOURS',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 3. AI Golden Test Cases Benchmark Suite
CREATE TABLE IF NOT EXISTS ibos_golden_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'TC_INJECTION_01', 'TC_BANGLA_PRICE_02'
    category VARCHAR(100) NOT NULL, -- 'SECURITY', 'SALES', 'SUPPORT', 'AFFILIATE', 'MULTILINGUAL'
    prompt_input TEXT NOT NULL,
    expected_intent VARCHAR(100) NOT NULL,
    expected_permission_level VARCHAR(50) NOT NULL,
    expected_guardrail_action VARCHAR(50) NOT NULL, -- 'ALLOW', 'BLOCK_INJECTION', 'REDACT_PII', 'TRIGGER_APPROVAL'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Emergency Action & Kill Switch Audit Log
CREATE TABLE IF NOT EXISTS ibos_emergency_actions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(100) NOT NULL, -- 'PAUSE_ALL_AGENTS', 'PAUSE_PAYOUTS', 'PAUSE_SALES'
    scope VARCHAR(100) NOT NULL, -- 'GLOBAL', 'DEPARTMENT:DEPT_REV', 'AGENT:AG-SALES-002'
    triggered_by VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    affected_missions_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_tool_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_durable_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_golden_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_emergency_actions_log ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Public read tool registry" ON ibos_tool_registry FOR SELECT USING (true);
CREATE POLICY "Admin full access approvals" ON ibos_durable_approvals FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access golden tests" ON ibos_golden_test_cases FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access emergency log" ON ibos_emergency_actions_log FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tool_name ON ibos_tool_registry(tool_name);
CREATE INDEX IF NOT EXISTS idx_approval_code ON ibos_durable_approvals(approval_code);
CREATE INDEX IF NOT EXISTS idx_golden_case ON ibos_golden_test_cases(case_code);
