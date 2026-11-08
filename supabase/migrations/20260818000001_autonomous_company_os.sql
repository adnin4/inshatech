-- Migration: Phase 3 - Autonomous Company OS Extended Schema
-- Description: Adds tables for organizations, contacts, projects, tasks, deliverables, support tickets, knowledge base, campaigns, leads, tracking, attributions, conversions, ledger, financials, incidents, deployments, feature flags, and system events.

CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Organizations
CREATE TABLE IF NOT EXISTS ibos_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    industry VARCHAR,
    website VARCHAR,
    employee_count INT,
    tech_stack JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Customer Contacts
CREATE TABLE IF NOT EXISTS ibos_customer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES ibos_organizations(id) ON DELETE SET NULL,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone VARCHAR,
    role VARCHAR,
    preferred_language VARCHAR DEFAULT 'en',
    lifetime_value DECIMAL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Projects
CREATE TABLE IF NOT EXISTS ibos_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID, -- Assuming ibos_orders exists, without strict fk for safety if it doesn't yet
    title VARCHAR NOT NULL,
    description TEXT,
    status VARCHAR DEFAULT 'planning',
    tech_stack JSONB,
    requirements JSONB,
    architecture TEXT,
    estimated_hours INT,
    actual_hours INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 4. Project Tasks
CREATE TABLE IF NOT EXISTS ibos_project_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES ibos_projects(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    assigned_agent VARCHAR,
    status VARCHAR DEFAULT 'todo',
    priority VARCHAR DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. Deliverables
CREATE TABLE IF NOT EXISTS ibos_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES ibos_projects(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    type VARCHAR,
    file_url TEXT,
    status VARCHAR DEFAULT 'draft',
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Support Tickets
CREATE TABLE IF NOT EXISTS ibos_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES ibos_customer_contacts(id) ON DELETE SET NULL,
    project_id UUID REFERENCES ibos_projects(id) ON DELETE SET NULL,
    subject VARCHAR NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR DEFAULT 'medium',
    status VARCHAR DEFAULT 'open',
    assigned_agent VARCHAR,
    resolution TEXT,
    sla_due_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 7. Knowledge Documents
CREATE TABLE IF NOT EXISTS ibos_knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    source_type VARCHAR,
    source_url TEXT,
    content TEXT NOT NULL,
    category VARCHAR,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Knowledge Chunks
CREATE TABLE IF NOT EXISTS ibos_knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES ibos_knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Campaigns
CREATE TABLE IF NOT EXISTS ibos_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    type VARCHAR,
    status VARCHAR DEFAULT 'draft',
    budget DECIMAL,
    spend DECIMAL DEFAULT 0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ
);

-- 10. Leads
CREATE TABLE IF NOT EXISTS ibos_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR,
    phone VARCHAR,
    company VARCHAR,
    industry VARCHAR,
    source VARCHAR,
    campaign_id UUID REFERENCES ibos_campaigns(id) ON DELETE SET NULL,
    score INT DEFAULT 50,
    status VARCHAR DEFAULT 'new',
    qualified_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Lead Events
CREATE TABLE IF NOT EXISTS ibos_lead_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES ibos_leads(id) ON DELETE CASCADE,
    event_type VARCHAR NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Referral Clicks
CREATE TABLE IF NOT EXISTS ibos_referral_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID, -- Assuming ibos_affiliates exists
    campaign_id VARCHAR,
    sub_id VARCHAR,
    landing_page TEXT,
    ip_hash VARCHAR,
    user_agent_hash VARCHAR,
    session_id VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Attributions
CREATE TABLE IF NOT EXISTS ibos_attributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    click_id UUID REFERENCES ibos_referral_clicks(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES ibos_leads(id) ON DELETE SET NULL,
    attribution_model VARCHAR DEFAULT 'last_click',
    window_days INT DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Conversions
CREATE TABLE IF NOT EXISTS ibos_conversions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribution_id UUID REFERENCES ibos_attributions(id) ON DELETE SET NULL,
    order_id UUID,
    amount DECIMAL NOT NULL,
    commission_amount DECIMAL NOT NULL,
    idempotency_key VARCHAR UNIQUE,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Commission Ledger
CREATE TABLE IF NOT EXISTS ibos_commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID,
    conversion_id UUID REFERENCES ibos_conversions(id) ON DELETE SET NULL,
    amount DECIMAL NOT NULL,
    type VARCHAR DEFAULT 'commission',
    status VARCHAR DEFAULT 'pending',
    payout_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Expenses
CREATE TABLE IF NOT EXISTS ibos_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR,
    description TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    vendor VARCHAR,
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Revenue
CREATE TABLE IF NOT EXISTS ibos_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID,
    amount DECIMAL NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    type VARCHAR DEFAULT 'one_time',
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Subscriptions
CREATE TABLE IF NOT EXISTS ibos_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES ibos_customer_contacts(id) ON DELETE CASCADE,
    service_id UUID,
    plan VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'active',
    amount DECIMAL NOT NULL,
    currency VARCHAR DEFAULT 'USD',
    interval VARCHAR DEFAULT 'monthly',
    current_period_start DATE,
    current_period_end DATE,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Incidents
CREATE TABLE IF NOT EXISTS ibos_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    severity VARCHAR DEFAULT 'medium',
    status VARCHAR DEFAULT 'open',
    affected_service VARCHAR,
    description TEXT NOT NULL,
    root_cause TEXT,
    resolution TEXT,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Deployments
CREATE TABLE IF NOT EXISTS ibos_deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR NOT NULL,
    environment VARCHAR DEFAULT 'production',
    status VARCHAR DEFAULT 'pending',
    commit_hash VARCHAR,
    deployed_by VARCHAR,
    rollback_of UUID REFERENCES ibos_deployments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 21. Feature Flags
CREATE TABLE IF NOT EXISTS ibos_feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    conditions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. System Events
CREATE TABLE IF NOT EXISTS ibos_system_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR NOT NULL,
    source VARCHAR,
    severity VARCHAR DEFAULT 'info',
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ibos_customer_contacts_org_id ON ibos_customer_contacts(org_id);
CREATE INDEX IF NOT EXISTS idx_ibos_project_tasks_project_id ON ibos_project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_deliverables_project_id ON ibos_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_customer_id ON ibos_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_project_id ON ibos_support_tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_knowledge_chunks_doc_id ON ibos_knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_ibos_leads_campaign_id ON ibos_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ibos_lead_events_lead_id ON ibos_lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_ibos_referral_clicks_campaign_id ON ibos_referral_clicks(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ibos_attributions_click_id ON ibos_attributions(click_id);
CREATE INDEX IF NOT EXISTS idx_ibos_conversions_attribution_id ON ibos_conversions(attribution_id);
CREATE INDEX IF NOT EXISTS idx_ibos_commission_ledger_conversion_id ON ibos_commission_ledger(conversion_id);
CREATE INDEX IF NOT EXISTS idx_ibos_subscriptions_customer_id ON ibos_subscriptions(customer_id);

-- RLS
ALTER TABLE ibos_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select on organizations for authenticated users" ON ibos_organizations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on customer_contacts for authenticated users" ON ibos_customer_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on projects for authenticated users" ON ibos_projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on project_tasks for authenticated users" ON ibos_project_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on deliverables for authenticated users" ON ibos_deliverables FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on support_tickets for authenticated users" ON ibos_support_tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on knowledge_documents for authenticated users" ON ibos_knowledge_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on knowledge_chunks for authenticated users" ON ibos_knowledge_chunks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on campaigns for authenticated users" ON ibos_campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on leads for authenticated users" ON ibos_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on lead_events for authenticated users" ON ibos_lead_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on referral_clicks for authenticated users" ON ibos_referral_clicks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on attributions for authenticated users" ON ibos_attributions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on conversions for authenticated users" ON ibos_conversions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on commission_ledger for authenticated users" ON ibos_commission_ledger FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on expenses for authenticated users" ON ibos_expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on revenue for authenticated users" ON ibos_revenue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on subscriptions for authenticated users" ON ibos_subscriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on incidents for authenticated users" ON ibos_incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on deployments for authenticated users" ON ibos_deployments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on feature_flags for authenticated users" ON ibos_feature_flags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow select on system_events for authenticated users" ON ibos_system_events FOR SELECT TO authenticated USING (true);
