-- ====================================================================
-- IINSHA 2.0 — CONTROL PLANE, AUTONOMY SLIDER & SYSTEM STATUS MIGRATION
-- Migration v2026.08.18_07
-- ====================================================================

CREATE TABLE IF NOT EXISTS ibos_autonomy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    current_mode VARCHAR(50) DEFAULT 'SEMI_AUTONOMOUS',
    financial_threshold_usd DECIMAL(8,2) DEFAULT 500.00,
    allow_auto_leads BOOLEAN DEFAULT TRUE,
    allow_auto_campaigns BOOLEAN DEFAULT FALSE,
    allow_auto_payouts BOOLEAN DEFAULT FALSE,
    updated_by VARCHAR(100) DEFAULT 'admin',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ibos_mission_replays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    replay_slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_duration_sec DECIMAL(5,2) DEFAULT 2.40,
    steps_json JSONB NOT NULL,
    outcomes_summary JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ibos_attention_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    severity VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ibos_system_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsystem VARCHAR(100) UNIQUE NOT NULL,
    operational_status VARCHAR(50) DEFAULT 'OPERATIONAL',
    latency_ms INT DEFAULT 45,
    uptime_percent DECIMAL(5,2) DEFAULT 99.98,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ibos_autonomy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_mission_replays ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_attention_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_system_status ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_replays_slug ON ibos_mission_replays(replay_slug);
CREATE INDEX IF NOT EXISTS idx_attention_status ON ibos_attention_items(status);
CREATE INDEX IF NOT EXISTS idx_system_status_subsystem ON ibos_system_status(subsystem);
