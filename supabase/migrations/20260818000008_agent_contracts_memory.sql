-- ====================================================================
-- IINSHA — AGENT CONTRACTS, 8-LAYER MEMORY & AGENT ECONOMY MIGRATION
-- Migration v2026.08.18_08
-- ====================================================================

-- 1. Structured Inter-Agent Task Contracts
CREATE TABLE IF NOT EXISTS ibos_agent_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'tsk_8291'
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE CASCADE,
    from_agent VARCHAR(100) NOT NULL, -- e.g. 'PLANNER_AGENT'
    to_agent VARCHAR(100) NOT NULL, -- e.g. 'SALES_AGENT'
    objective TEXT NOT NULL,
    inputs JSONB DEFAULT '{}'::jsonb,
    constraints JSONB DEFAULT '{
        "max_budget_usd": 3.00,
        "timeout_ms": 5000
    }'::jsonb,
    expected_output_schema JSONB DEFAULT '{}'::jsonb,
    actual_output JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'EXECUTED', 'REJECTED'
    execution_duration_ms INT DEFAULT 0,
    compute_cost_usd DECIMAL(8,6) DEFAULT 0.000000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. 8-Layer Long-Term Business Memory (L0 to L7)
CREATE TABLE IF NOT EXISTS ibos_memory_8layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    layer_code VARCHAR(10) NOT NULL, -- 'L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'
    layer_name VARCHAR(100) NOT NULL, -- 'Current Message', 'Conversation', 'Customer Profile', 'Business Memory', 'Transaction History', 'Execution History', 'Org Knowledge', 'Learned Preferences'
    entity_id VARCHAR(150) NOT NULL, -- e.g. 'cust_fashion_bd', 'brand_voice'
    memory_key VARCHAR(200) NOT NULL,
    memory_value JSONB NOT NULL,
    confidence_score DECIMAL(5,2) DEFAULT 95.00,
    source_attribution VARCHAR(100) DEFAULT 'ai_inference',
    privacy_retention_days INT DEFAULT 365,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Economy & Revenue ROI Attribution
CREATE TABLE IF NOT EXISTS ibos_agent_economy_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) REFERENCES ibos_employees(employee_code) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_compute_cost_usd DECIMAL(10,4) DEFAULT 0.0000,
    total_revenue_influenced_usd DECIMAL(10,2) DEFAULT 0.00,
    economic_roi_multiplier DECIMAL(8,2) DEFAULT 0.00, -- e.g. 261.00 (261x)
    tasks_completed INT DEFAULT 0,
    avg_latency_ms INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Shadow-Mode Evaluation & Parallel Benchmarking
CREATE TABLE IF NOT EXISTS ibos_shadow_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_trigger VARCHAR(150) NOT NULL,
    active_version VARCHAR(50) NOT NULL,
    shadow_version VARCHAR(50) NOT NULL,
    input_payload JSONB NOT NULL,
    active_output JSONB NOT NULL,
    shadow_output JSONB NOT NULL,
    accuracy_comparison_score DECIMAL(5,2) DEFAULT 98.00,
    is_promoted_to_canary BOOLEAN DEFAULT FALSE,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_agent_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_memory_8layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_agent_economy_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_shadow_evaluations ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Admin access contracts" ON ibos_agent_contracts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access 8layer memory" ON ibos_memory_8layers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access agent economy" ON ibos_agent_economy_metrics FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access shadow evals" ON ibos_shadow_evaluations FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_task ON ibos_agent_contracts(task_id);
CREATE INDEX IF NOT EXISTS idx_memory_8layers_layer ON ibos_memory_8layers(layer_code, entity_id);
CREATE INDEX IF NOT EXISTS idx_economy_employee ON ibos_agent_economy_metrics(employee_code);
