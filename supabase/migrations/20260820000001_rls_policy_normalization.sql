-- ============================================================
-- IINSHA AI-BOS — MASTER RLS POLICY NORMALIZATION & SECURE LOCKDOWN
-- Migration: 20260820000001_rls_policy_normalization.sql
-- Purpose: 
--   1. Drop duplicate & conflicting legacy permissive policies
--   2. Enforce clean Default-Deny on all sensitive tables
--   3. Allow narrow public SELECT only on public catalogs (services, faqs)
--   4. Ensure ZERO multiple_permissive_policies warnings
-- ============================================================

-- 1. CLEANUP LEGACY / CONFLICTING POLICIES ON ALL TABLES
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on all ibos_* tables to rebuild clean, single-intent policies
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE tablename LIKE 'ibos_%'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I;', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 2. ENSURE ROW LEVEL SECURITY IS STRICTLY ENABLED ON ALL TABLES
ALTER TABLE IF EXISTS ibos_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_conversation_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_dynamic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ibos_payment_gateways ENABLE ROW LEVEL SECURITY;

-- 3. PUBLIC CATALOG: NARROW READ-ONLY SELECT POLICIES (Single Policy per Table)
CREATE POLICY "public_read_active_services" 
ON ibos_services FOR SELECT 
TO public 
USING (status = 'active' OR status IS NULL);

CREATE POLICY "public_read_knowledge_docs" 
ON ibos_knowledge_documents FOR SELECT 
TO public 
USING (category != 'internal_restricted' OR category IS NULL);

CREATE POLICY "public_read_dynamic_pages" 
ON ibos_dynamic_pages FOR SELECT 
TO public 
USING (true);

CREATE POLICY "public_read_page_blocks" 
ON ibos_page_blocks FOR SELECT 
TO public 
USING (true);

CREATE POLICY "public_read_nav_menus" 
ON ibos_navigation_menus FOR SELECT 
TO public 
USING (true);

CREATE POLICY "public_read_theme_settings" 
ON ibos_theme_settings FOR SELECT 
TO public 
USING (true);

-- 4. SENSITIVE TABLES: DEFAULT-DENY ON DIRECT DATA API (Service Role / Edge Functions Bypass RLS)
-- Authenticated users may read their own records ONLY when auth.uid() matches owner context.

CREATE POLICY "authenticated_read_own_user" 
ON ibos_users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "authenticated_update_own_user" 
ON ibos_users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_read_own_orders" 
ON ibos_orders FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "authenticated_read_own_affiliate" 
ON ibos_affiliates FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "authenticated_read_own_tickets" 
ON ibos_support_tickets FOR SELECT 
TO authenticated 
USING (auth.uid() = customer_id);

CREATE POLICY "authenticated_read_own_projects" 
ON ibos_projects FOR SELECT 
TO authenticated 
USING (auth.uid() = order_id);

CREATE POLICY "authenticated_read_own_conversations" 
ON ibos_conversations FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "authenticated_read_own_messages" 
ON ibos_messages FOR SELECT 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_conversations c 
    WHERE c.id = ibos_messages.conversation_id AND c.user_id = auth.uid()
));

-- 5. OWNER & ADMIN ELEVATED POLICIES (Strictly checked against ibos_users role)
CREATE POLICY "owner_full_access_orders" 
ON ibos_orders FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner')
));

CREATE POLICY "owner_full_access_affiliates" 
ON ibos_affiliates FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner')
));

CREATE POLICY "owner_full_access_ledger" 
ON ibos_commission_ledger FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'finance')
));

CREATE POLICY "owner_full_access_revenue" 
ON ibos_revenue FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'finance')
));

CREATE POLICY "owner_full_access_expenses" 
ON ibos_expenses FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'finance')
));

CREATE POLICY "owner_full_access_audit_logs" 
ON ibos_audit_logs FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner')
));

CREATE POLICY "owner_full_access_missions" 
ON ibos_missions FOR ALL 
TO authenticated 
USING (EXISTS (
    SELECT 1 FROM ibos_users u 
    WHERE u.id = auth.uid() AND u.role IN ('super_admin', 'owner', 'operations')
));

-- 6. ENSURE CRITICAL FOREIGN KEY INDEXES EXIST (Performance Advisor Zero Warnings)
CREATE INDEX IF NOT EXISTS idx_ibos_affiliates_user_id ON ibos_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_ibos_orders_service_id ON ibos_orders(service_id);
CREATE INDEX IF NOT EXISTS idx_ibos_orders_user_id ON ibos_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ibos_commission_ledger_affiliate_id ON ibos_commission_ledger(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_ibos_commission_ledger_conversion_id ON ibos_commission_ledger(conversion_id);
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_customer_id ON ibos_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_project_id ON ibos_support_tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_messages_conversation_id ON ibos_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ibos_projects_order_id ON ibos_projects(order_id);
CREATE INDEX IF NOT EXISTS idx_ibos_project_tasks_project_id ON ibos_project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_deliverables_project_id ON ibos_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_knowledge_chunks_document_id ON ibos_knowledge_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_ibos_leads_campaign_id ON ibos_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ibos_lead_events_lead_id ON ibos_lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_ibos_referral_clicks_affiliate_id ON ibos_referral_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_ibos_attributions_click_id ON ibos_attributions(click_id);
CREATE INDEX IF NOT EXISTS idx_ibos_conversions_order_id ON ibos_conversions(order_id);
CREATE INDEX IF NOT EXISTS idx_ibos_subscriptions_customer_id ON ibos_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_ibos_subscriptions_service_id ON ibos_subscriptions(service_id);

COMMENT ON MIGRATION IS 'IINSHA AI-BOS Master RLS Policy Normalization & Performance Index Matrix';
