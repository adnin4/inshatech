-- ====================================================================
-- IINSHA — DIGITAL WORKFORCE HIERARCHY, MISSION DAG & MARGIN GUARDIAN
-- Migration v2026.08.18_09
-- ====================================================================

-- 1. Departmental Workforce Hierarchy
CREATE TABLE IF NOT EXISTS ibos_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'DEPT_REV', 'DEPT_MKTG', 'DEPT_DELV', 'DEPT_PARTNER', 'DEPT_FIN'
    department_name VARCHAR(150) NOT NULL,
    supervisor_employee VARCHAR(50) REFERENCES ibos_employees(employee_code) ON DELETE SET NULL,
    allocated_daily_budget_usd DECIMAL(8,2) DEFAULT 25.00,
    active_employees_count INT DEFAULT 4,
    kpi_focus VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mission DAG (Directed Acyclic Graph) Execution Topologies
CREATE TABLE IF NOT EXISTS ibos_mission_dags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dag_code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'dag_b2b_saas_inbound'
    mission_title VARCHAR(255) NOT NULL,
    target_department VARCHAR(50) REFERENCES ibos_departments(department_code) ON DELETE SET NULL,
    node_graph JSONB NOT NULL, -- Nodes: [{ id, agent, action, dependencies: [], status }]
    estimated_duration_sec DECIMAL(6,2) DEFAULT 120.00,
    estimated_gross_margin_percent DECIMAL(5,2) DEFAULT 55.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Margin Guardian & Deal Profitability Guardrails
CREATE TABLE IF NOT EXISTS ibos_margin_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(100) NOT NULL,
    min_acceptable_margin_percent DECIMAL(5,2) DEFAULT 50.00, -- Hard stop rule: deals < 50% require owner approval
    delivery_cost_formula JSONB DEFAULT '{ "base_cost_percent": 24, "fixed_buffer_usd": 50 }'::jsonb,
    ai_compute_reserve_usd DECIMAL(6,2) DEFAULT 15.00,
    support_reserve_usd DECIMAL(6,2) DEFAULT 30.00,
    affiliate_commission_percent DECIMAL(5,2) DEFAULT 20.00,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. IINSHA Alert Fabric Routing Rules
CREATE TABLE IF NOT EXISTS ibos_alert_fabric_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_category VARCHAR(100) NOT NULL, -- 'HIGH_VALUE_SALE', 'SECURITY_EVENT', 'PAYOUT_ANOMALY', 'AGENT_DEGRADATION'
    severity VARCHAR(50) NOT NULL, -- 'CRITICAL', 'IMPORTANT', 'INFO', 'ROUTINE'
    target_channels JSONB DEFAULT '["TELEGRAM", "EMAIL", "WHATSAPP"]'::jsonb,
    threshold_value_usd DECIMAL(10,2) DEFAULT 500.00,
    requires_acknowledgement BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_mission_dags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_margin_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_alert_fabric_rules ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Public read departments" ON ibos_departments FOR SELECT USING (true);
CREATE POLICY "Public read mission dags" ON ibos_mission_dags FOR SELECT USING (true);
CREATE POLICY "Admin full access margin rules" ON ibos_margin_rules FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access alert fabric" ON ibos_alert_fabric_rules FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dept_code ON ibos_departments(department_code);
CREATE INDEX IF NOT EXISTS idx_dag_code ON ibos_mission_dags(dag_code);
CREATE INDEX IF NOT EXISTS idx_margin_service ON ibos_margin_rules(service_id);
