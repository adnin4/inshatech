-- ==============================================================================
-- IINSHA AI-BOS 2.0 — ENTERPRISE MULTI-TENANCY, 14-ROLE RBAC & AUDIT RLS
-- Migration: 20260818000013_enterprise_multi_tenancy_rls.sql
-- ==============================================================================

-- 1. Organizations & Workspaces
CREATE TABLE IF NOT EXISTS ibos_tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan_tier VARCHAR(50) DEFAULT 'enterprise',
    max_workspaces INT DEFAULT 10,
    max_agents INT DEFAULT 50,
    monthly_budget_usd DECIMAL(12, 2) DEFAULT 500.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ibos_tenant_workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES ibos_tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    environment VARCHAR(50) DEFAULT 'production', -- production, staging, sandbox
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, slug)
);

-- 2. Enterprise 14-Role RBAC & Granular Permissions
CREATE TABLE IF NOT EXISTS ibos_enterprise_roles (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INT NOT NULL, -- 1 (Owner) to 14 (Read Only)
    is_system_role BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ibos_enterprise_roles (id, title, description, hierarchy_level) VALUES
('owner', 'Owner & Founder', 'Full unrestricted authority over all operations, finances, and kill switches', 1),
('super_admin', 'Super Admin', 'Platform-wide administrator with full system and user management', 2),
('admin', 'Administrator', 'Day-to-day administrative authority over projects and workforce', 3),
('ops_manager', 'Operations Manager', 'Oversees missions, task delegation, and fulfillment pipelines', 4),
('finance_manager', 'Finance Manager', 'Controls budgets, invoices, refunds, and affiliate payout ledgers', 5),
('sales_manager', 'Sales Manager', 'Manages leads, deals, proposals, and customer communications', 6),
('marketing_manager', 'Marketing Manager', 'Campaigns, SEO, content publishing, and analytics', 7),
('support_manager', 'Support Manager', 'Customer tickets, onboarding, and SLA resolution', 8),
('ai_ops_manager', 'AI Operations Manager', 'Agent swarm orchestration, model routing, and autonomy sliders', 9),
('security_manager', 'Security Manager', 'Secret Broker, prompt injection defense, and access audit logs', 10),
('developer', 'Developer / Engineer', 'API integrations, custom agent development, and code tasks', 11),
('analyst', 'Data & Market Analyst', 'Read analytics, digital twin simulations, and performance reports', 12),
('content_editor', 'Content Editor', 'Drafts and edits blog posts, service copy, and marketing assets', 13),
('read_only', 'Read Only Observer', 'Restricted view-only access across allowed workspaces', 14)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS ibos_permissions_catalog (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ibos_role_permissions (
    role_id VARCHAR(50) NOT NULL REFERENCES ibos_enterprise_roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) NOT NULL REFERENCES ibos_permissions_catalog(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- Seed Granular Permissions Catalog
INSERT INTO ibos_permissions_catalog (id, category, description) VALUES
('service.create', 'Services', 'Create new services and packages'),
('service.edit', 'Services', 'Edit service catalog and specifications'),
('service.delete', 'Services', 'Delete or archive services'),
('service.publish', 'Services', 'Publish or unpublish services on marketplace'),
('order.view', 'Orders', 'View customer orders and fulfillment status'),
('order.refund', 'Orders', 'Issue and process customer refunds'),
('payment.view', 'Payments', 'View payment transactions and invoices'),
('payment.manage', 'Payments', 'Configure gateways and payment options'),
('agent.execute', 'Agents', 'Dispatch missions and invoke agent swarms'),
('agent.pause', 'Agents', 'Pause running agents and mission DAGs'),
('agent.kill', 'Agents', 'Execute emergency killswitch on active agents'),
('tool.execute', 'Tools', 'Execute integrated tools through the gateway'),
('secret.access', 'Secrets', 'Access and rotate secret broker credentials'),
('secret.freeze', 'Secrets', '1-Click emergency freeze on secret broker'),
('affiliate.approve', 'Affiliates', 'Approve affiliate partner applications'),
('affiliate.payout', 'Affiliates', 'Approve and release affiliate commission payouts'),
('autonomy.set', 'Autonomy', 'Modify global and per-agent autonomy sliders'),
('budget.override', 'Finance', 'Override daily $20 cost tower budget limits'),
('memory.purge', 'Memory', 'Purge institutional or user memory records')
ON CONFLICT (id) DO NOTHING;

-- Assign All Permissions to Owner and Super Admin
INSERT INTO ibos_role_permissions (role_id, permission_id)
SELECT 'owner', id FROM ibos_permissions_catalog
ON CONFLICT DO NOTHING;

INSERT INTO ibos_role_permissions (role_id, permission_id)
SELECT 'super_admin', id FROM ibos_permissions_catalog
ON CONFLICT DO NOTHING;

-- 3. MFA & Passkey Credential Storage
CREATE TABLE IF NOT EXISTS ibos_user_mfa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES ibos_users(id) ON DELETE CASCADE,
    mfa_type VARCHAR(50) DEFAULT 'totp', -- totp, webauthn, sms
    secret_encrypted TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    backup_codes JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, mfa_type)
);

CREATE TABLE IF NOT EXISTS ibos_webauthn_credentials (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES ibos_users(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    counter BIGINT DEFAULT 0,
    device_name VARCHAR(100),
    transports JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Session Security & Refresh-Token Rotation
CREATE TABLE IF NOT EXISTS ibos_active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES ibos_users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES ibos_tenants(id),
    refresh_token_hash VARCHAR(255) NOT NULL UNIQUE,
    device_fingerprint VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 8-Layer Memory Hierarchy
CREATE TABLE IF NOT EXISTS ibos_memory_hierarchy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id),
    workspace_id UUID REFERENCES ibos_tenant_workspaces(id),
    layer_id VARCHAR(20) NOT NULL, -- L1_CONTEXT, L2_CONVERSATION, L3_USER, L4_PROJECT, L5_AGENT, L6_ORG, L7_INSTITUTIONAL, L8_STRATEGIC
    entity_key VARCHAR(255) NOT NULL,
    memory_content JSONB NOT NULL,
    confidence_score DECIMAL(3, 2) DEFAULT 1.00,
    source_event VARCHAR(100),
    is_sensitive BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memory_layer ON ibos_memory_hierarchy(layer_id, entity_key);
CREATE INDEX IF NOT EXISTS idx_memory_tenant ON ibos_memory_hierarchy(tenant_id, workspace_id);

-- 6. Observability Flight Recorder Traces
CREATE TABLE IF NOT EXISTS ibos_flight_traces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES ibos_tenants(id),
    trace_id VARCHAR(100) NOT NULL,
    span_id VARCHAR(100) NOT NULL,
    parent_span_id VARCHAR(100),
    agent_id VARCHAR(50),
    mission_id UUID REFERENCES ibos_missions(id),
    tool_name VARCHAR(100),
    event_name VARCHAR(100) NOT NULL,
    input_payload JSONB,
    output_payload JSONB,
    cost_usd DECIMAL(8, 5) DEFAULT 0.00000,
    duration_ms INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'success', -- success, error, throttled, blocked_by_policy
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flight_trace_id ON ibos_flight_traces(trace_id);
CREATE INDEX IF NOT EXISTS idx_flight_mission ON ibos_flight_traces(mission_id);

-- 7. RLS Tenant Isolation Policies
ALTER TABLE ibos_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_tenant_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_memory_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_flight_traces ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_tenants ON ibos_tenants
    FOR ALL
    TO authenticated
    USING (id = auth.uid() OR EXISTS (SELECT 1 FROM ibos_users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'super_admin')));

CREATE POLICY tenant_isolation_workspaces ON ibos_tenant_workspaces
    FOR ALL
    TO authenticated
    USING (tenant_id IN (SELECT id FROM ibos_tenants WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM ibos_users u WHERE u.id = auth.uid() AND u.role IN ('owner', 'super_admin')));
