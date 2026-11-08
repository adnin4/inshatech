-- ====================================================================
-- IINSHA AI OS 2.0 — SECRET BROKER VAULT, BLACK BOX & INSTITUTIONAL MEMORY
-- Migration v2026.08.18_12
-- ====================================================================

-- 1. Secret Broker Vault (Zero-Trust Token Proxies for Agents)
CREATE TABLE IF NOT EXISTS ibos_secret_vault_brokers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_token_name VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'TOKEN_STRIPE_PAYOUT_GATEWAY', 'TOKEN_GEMINI_EMBED'
    target_service VARCHAR(100) NOT NULL,
    allowed_tools JSONB DEFAULT '["create_order", "process_payout"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agent Black Box Mission Flight Recorder Logs
CREATE TABLE IF NOT EXISTS ibos_black_box_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_trace_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'flt_83921_trace'
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE CASCADE,
    requesting_agent VARCHAR(50) NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    input_prompt_hash VARCHAR(128) NOT NULL,
    decision_summary TEXT NOT NULL,
    policy_reference VARCHAR(100) NOT NULL,
    evidence_payload JSONB DEFAULT '{}'::jsonb,
    total_tokens_consumed INT DEFAULT 0,
    compute_cost_usd DECIMAL(8,6) DEFAULT 0.000000,
    duration_ms INT DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Institutional Business Memory & Winning Patterns
CREATE TABLE IF NOT EXISTS ibos_institutional_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- 'WINNING_SALES_HOOKS', 'PRICING_EXPERIMENTS', 'OBJECTION_RESPONSES', 'DELIVERY_BLUEPRINTS'
    topic VARCHAR(200) NOT NULL,
    learned_pattern JSONB NOT NULL,
    effectiveness_score DECIMAL(5,2) DEFAULT 94.50,
    times_leveraged INT DEFAULT 1,
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_secret_vault_brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_black_box_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_institutional_memory ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Admin full access secret vault" ON ibos_secret_vault_brokers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access flight traces" ON ibos_black_box_traces FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access institutional memory" ON ibos_institutional_memory FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_broker_token ON ibos_secret_vault_brokers(broker_token_name);
CREATE INDEX IF NOT EXISTS idx_flight_trace ON ibos_black_box_traces(flight_trace_id);
CREATE INDEX IF NOT EXISTS idx_inst_category ON ibos_institutional_memory(category);
