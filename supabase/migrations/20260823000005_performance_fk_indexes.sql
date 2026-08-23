-- ================================================================
-- IINSHA AI-BOS: COVERING FOREIGN KEY INDEXES (20260823000005)
-- Optimizes Query-Plan Performance on All Core Relational Tables
-- ================================================================

-- 1. Orders & Deliveries
CREATE INDEX IF NOT EXISTS idx_ibos_orders_user_id ON public.ibos_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_ibos_orders_service_id ON public.ibos_orders(service_id);
CREATE INDEX IF NOT EXISTS idx_ibos_projects_order_id ON public.ibos_projects(order_id);
CREATE INDEX IF NOT EXISTS idx_ibos_project_tasks_project_id ON public.ibos_project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_deliverables_project_id ON public.ibos_deliverables(project_id);

-- 2. CRM, Leads & Attributions
CREATE INDEX IF NOT EXISTS idx_ibos_leads_campaign_id ON public.ibos_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ibos_lead_events_lead_id ON public.ibos_lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_ibos_referral_clicks_affiliate_id ON public.ibos_referral_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_ibos_attributions_click_id ON public.ibos_attributions(click_id);
CREATE INDEX IF NOT EXISTS idx_ibos_attributions_lead_id ON public.ibos_attributions(lead_id);
CREATE INDEX IF NOT EXISTS idx_ibos_conversions_order_id ON public.ibos_conversions(order_id);
CREATE INDEX IF NOT EXISTS idx_ibos_commission_ledger_affiliate_id ON public.ibos_commission_ledger(affiliate_id);

-- 3. Support & Knowledge
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_customer_id ON public.ibos_support_tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_ibos_support_tickets_project_id ON public.ibos_support_tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_ibos_knowledge_chunks_document_id ON public.ibos_knowledge_chunks(document_id);

-- 4. Swarm Runs & Agent Execution
CREATE INDEX IF NOT EXISTS idx_ibos_agent_runs_mission_id ON public.ibos_agent_runs(mission_id);
CREATE INDEX IF NOT EXISTS idx_ibos_tool_calls_run_id ON public.ibos_tool_calls(run_id);
CREATE INDEX IF NOT EXISTS idx_ibos_evaluations_run_id ON public.ibos_evaluations(run_id);
CREATE INDEX IF NOT EXISTS idx_ibos_execution_tasks_workspace_id ON public.ibos_execution_tasks(workspace_id);
