-- ====================================================================
-- IINSHA AI OS 4.0 — AGENT MISSIONS, CHECKPOINTS & HITL 2.0 MIGRATION
-- Migration v2026.08.18_04
-- ====================================================================

-- 1. Persistent Agent Missions & State Machine
CREATE TABLE IF NOT EXISTS ibos_agent_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    goal TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PLANNING', -- 'DRAFT', 'PLANNING', 'QUEUED', 'RUNNING', 'WAITING_APPROVAL', 'EXECUTING', 'VERIFYING', 'COMPLETED', 'FAILED'
    current_stage VARCHAR(100) DEFAULT 'Analysing requirements',
    budget_allocated DECIMAL(8,2) DEFAULT 20.00,
    budget_used DECIMAL(8,4) DEFAULT 0.0000,
    agents_invoked JSONB DEFAULT '[]'::jsonb,
    tool_calls_count INT DEFAULT 0,
    trace_steps JSONB DEFAULT '[]'::jsonb,
    context_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Persistent Checkpoints for HITL 2.0 (Approve / Edit / Reject)
CREATE TABLE IF NOT EXISTS ibos_mission_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE CASCADE,
    step_name VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    risk_level VARCHAR(50) DEFAULT 'HIGH', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    estimated_cost DECIMAL(8,4) DEFAULT 0.0000,
    approval_status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'EDITED', 'REJECTED'
    edited_payload JSONB,
    decision_reason TEXT,
    decided_by VARCHAR(100),
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Tool Policies & Risk Governor
CREATE TABLE IF NOT EXISTS ibos_agent_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_name VARCHAR(100) UNIQUE NOT NULL,
    risk_level VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    requires_approval BOOLEAN DEFAULT FALSE,
    daily_limit INT DEFAULT 500,
    max_cost_per_call DECIMAL(8,4) DEFAULT 0.0500,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tool Execution Receipts for Observability
CREATE TABLE IF NOT EXISTS ibos_tool_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES ibos_agent_missions(id) ON DELETE SET NULL,
    agent_id VARCHAR(100) NOT NULL,
    tool_name VARCHAR(100) NOT NULL,
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_summary TEXT,
    risk_level VARCHAR(50) NOT NULL,
    duration_ms INT DEFAULT 0,
    cost_usd DECIMAL(8,4) DEFAULT 0.0000,
    status VARCHAR(50) DEFAULT 'SUCCESS', -- 'SUCCESS', 'FAILED', 'RECOVERED'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_agent_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_mission_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_agent_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_tool_receipts ENABLE ROW LEVEL SECURITY;

-- Read / Admin Policies
CREATE POLICY "Public read own missions" ON ibos_agent_missions FOR SELECT USING (true);
CREATE POLICY "Admin full access missions" ON ibos_agent_missions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access checkpoints" ON ibos_mission_checkpoints FOR ALL TO authenticated USING (true);
CREATE POLICY "Public read policies" ON ibos_agent_policies FOR SELECT USING (true);
CREATE POLICY "Admin access receipts" ON ibos_tool_receipts FOR ALL TO authenticated USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_missions_session ON ibos_agent_missions(session_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON ibos_agent_missions(status);
CREATE INDEX IF NOT EXISTS idx_checkpoints_mission ON ibos_mission_checkpoints(mission_id);
CREATE INDEX IF NOT EXISTS idx_receipts_mission ON ibos_tool_receipts(mission_id);
CREATE INDEX IF NOT EXISTS idx_receipts_agent ON ibos_tool_receipts(agent_id);
