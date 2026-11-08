-- ====================================================================
-- IINSHA 2.0 — CONTROL PLANE, AUTONOMY SLIDER & SYSTEM STATUS MIGRATION
-- Migration v2026.08.18_07
-- ====================================================================

-- 1. Dynamic Autonomy Settings & Policy Mode
CREATE TABLE IF NOT EXISTS ibos_autonomy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    current_mode VARCHAR(50) DEFAULT 'SEMI_AUTONOMOUS', -- 'MANUAL', 'ASSISTED', 'SEMI_AUTONOMOUS', 'AUTONOMOUS', 'HIGH_AUTONOMY'
    financial_threshold_usd DECIMAL(8,2) DEFAULT 500.00,
    allow_auto_leads BOOLEAN DEFAULT TRUE,
    allow_auto_campaigns BOOLEAN DEFAULT FALSE,
    allow_auto_payouts BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(100) DEFAULT 'admin',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Interactive Showcase Mission Replays (For Public & Demo Mode)
CREATE TABLE IF NOT EXISTS ibos_mission_replays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    replay_slug VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'b2b-lead-generation'
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_duration_sec DECIMAL(5,2) DEFAULT 2.40,
    steps_json JSONB NOT NULL,
    outcomes_summary JSONB DEFAULT '{
        "leads_extracted": 184,
        "qualified": 37,
        "deal_value_usd": 4500,
        "simulated_roi": "932%"
    }'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Actionable Triage Queue (Needs Your Attention Panel)
CREATE TABLE IF NOT EXISTS ibos_attention_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    severity VARCHAR(50) NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    category VARCHAR(100) NOT NULL, -- 'PROPOSAL_APPROVAL', 'PAYOUT_VALIDATION', 'FRAUD_ALERT', 'CAMPAIGN_LAUNCH'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'RESOLVED', 'DISMISSED'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 4. Real-time Live System Status Indicators
CREATE TABLE IF NOT EXISTS ibos_system_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsystem VARCHAR(100) UNIQUE NOT NULL, -- 'ai_workforce', 'mission_engine', 'affiliate_tracking', 'payment_gateways', 'n8n_cluster'
    operational_status VARCHAR(50) DEFAULT 'OPERATIONAL', -- 'OPERATIONAL', 'DEGRADED', 'MAINTENANCE'
    latency_ms INT DEFAULT 45,
    uptime_percent DECIMAL(5,2) DEFAULT 99.98,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_autonomy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_mission_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_attention_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_system_status ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Public read replays" ON ibos_mission_replays FOR SELECT USING (true);
CREATE POLICY "Public read system status" ON ibos_system_status FOR SELECT USING (true);
CREATE POLICY "Admin full access autonomy" ON ibos_autonomy_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access attention" ON ibos_attention_items FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_replays_slug ON ibos_mission_replays(replay_slug);
CREATE INDEX IF NOT EXISTS idx_attention_status ON ibos_attention_items(status);
CREATE INDEX IF NOT EXISTS idx_system_status_subsystem ON ibos_system_status(subsystem);
