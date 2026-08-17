-- ====================================================================
-- IINSHA AI OS — NEXT-GEN RUNTIME, OBSERVABILITY & MULTI-TENANT MIGRATION
-- Migration v2026.08.18_05
-- ====================================================================

-- 1. Multi-Tenant Organizations & Data Isolation
CREATE TABLE IF NOT EXISTS ibos_tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'starter', -- 'starter', 'pro', 'enterprise', 'reseller'
    custom_domain VARCHAR(255),
    allocated_budget_usd DECIMAL(10,2) DEFAULT 100.00,
    used_budget_usd DECIMAL(10,4) DEFAULT 0.0000,
    config JSONB DEFAULT '{
        "allowed_models": ["gemini-1.5-flash", "gemini-1.5-pro"],
        "max_concurrent_agents": 10,
        "data_retention_days": 90
    }'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent Version Control & Canary Deployments
CREATE TABLE IF NOT EXISTS ibos_agent_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL, -- e.g. 'v2.1.0'
    system_prompt TEXT NOT NULL,
    skills_allowed JSONB DEFAULT '[]'::jsonb,
    traffic_allocation_percent INT DEFAULT 100, -- for canary: 10, 50, 100
    performance_score DECIMAL(5,2) DEFAULT 95.00,
    is_current_active BOOLEAN DEFAULT TRUE,
    deployed_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Agent Evaluation Benchmarks & Test Runs
CREATE TABLE IF NOT EXISTS ibos_eval_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id VARCHAR(100) NOT NULL,
    test_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'prompt_injection', 'pricing_objection', 'tool_correctness', 'dialect_check'
    input_prompt TEXT NOT NULL,
    expected_output_pattern TEXT NOT NULL,
    last_score DECIMAL(5,2) DEFAULT 100.00,
    status VARCHAR(50) DEFAULT 'PASSED', -- 'PASSED', 'FAILED', 'WARNING'
    last_run_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 3-Layer Memory Architecture & Data Governance
CREATE TABLE IF NOT EXISTS ibos_memory_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    layer_type VARCHAR(50) NOT NULL, -- 'session', 'customer', 'organization'
    entity_key VARCHAR(255) NOT NULL, -- e.g. 'cust_4821', 'brand_voice'
    memory_content JSONB NOT NULL,
    privacy_level VARCHAR(50) DEFAULT 'internal', -- 'public', 'internal', 'restricted'
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Self-Healing Mission Recovery Events
CREATE TABLE IF NOT EXISTS ibos_recovery_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE CASCADE,
    failed_tool VARCHAR(100) NOT NULL,
    failure_reason TEXT NOT NULL,
    retry_attempt INT DEFAULT 1,
    fallback_applied VARCHAR(100),
    recovery_status VARCHAR(50) DEFAULT 'RECOVERED', -- 'RECOVERED', 'ESCALATED_TO_HUMAN'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_agent_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_eval_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_memory_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_recovery_events ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Admin full access tenants" ON ibos_tenants FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access agent versions" ON ibos_agent_versions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access eval benchmarks" ON ibos_eval_benchmarks FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access memory layers" ON ibos_memory_layers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access recovery events" ON ibos_recovery_events FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON ibos_tenants(tenant_slug);
CREATE INDEX IF NOT EXISTS idx_agent_versions_agent ON ibos_agent_versions(agent_id);
CREATE INDEX IF NOT EXISTS idx_eval_benchmarks_agent ON ibos_eval_benchmarks(agent_id);
CREATE INDEX IF NOT EXISTS idx_memory_layers_key ON ibos_memory_layers(entity_key);
