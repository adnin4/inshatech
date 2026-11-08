-- ================================================================
-- IINSHA AI-BOS: ACTIONABLE FOREIGN KEY PERFORMANCE INDEXES
-- Migration: 20260823000006_actionable_fk_performance_indexes.sql
-- Optimizes Performance Advisor Warnings on Core Relational Tables
-- ================================================================

-- 1. crm_proposals & crm_orders
CREATE INDEX IF NOT EXISTS idx_crm_proposals_opportunity_id ON public.crm_proposals(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_crm_proposals_lead_id ON public.crm_proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_proposal_id ON public.crm_orders(proposal_id);
CREATE INDEX IF NOT EXISTS idx_crm_orders_opportunity_id ON public.crm_orders(opportunity_id);

-- 2. delivery_projects & delivery_events
CREATE INDEX IF NOT EXISTS idx_delivery_projects_order_id ON public.delivery_projects(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_events_project_id ON public.delivery_events(project_id);

-- 3. qa_evidence
CREATE INDEX IF NOT EXISTS idx_qa_evidence_project_id ON public.qa_evidence(project_id);

-- 4. renewal_opportunities
CREATE INDEX IF NOT EXISTS idx_renewal_opportunities_project_id ON public.renewal_opportunities(project_id);
CREATE INDEX IF NOT EXISTS idx_renewal_opportunities_order_id ON public.renewal_opportunities(order_id);

-- 5. skill_evaluations
CREATE INDEX IF NOT EXISTS idx_skill_evaluations_skill_id ON public.skill_evaluations(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_evaluations_version_id ON public.skill_evaluations(version_id);
