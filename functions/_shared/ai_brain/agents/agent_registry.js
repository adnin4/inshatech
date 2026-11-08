/**
 * IINSHA AI-BOS: 13-Agent Autonomous Organization Registry
 * Strict 6-Layer Architecture:
 * 1. Identity | 2. Goal | 3. Memory | 4. Tools | 5. Permissions | 6. Evaluation
 */

export const AGENT_REGISTRY = {
  CEO_AGENT: {
    identity: { id: 'ceo', name: 'CEO Strategic Commander', department: 'Executive', role: 'Executive Commander' },
    goal: {
      primary: 'Maximize profitable business growth while enforcing strict financial and security guardrails',
      allowed_objectives: ['strategic_planning', 'cross_department_delegation', 'kpi_tracking', 'morning_briefing'],
      forbidden_objectives: ['unauthorized_funds_transfer', 'modifying_master_constitution', 'bypassing_hitl_gates']
    },
    memory: { context_tokens: 128000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_analytics', 'get_revenue', 'get_agents_status', 'create_priority', 'delegate_task'], max_calls: 20 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['SALES_AGENT', 'MARKETING_AGENT', 'DEVOPS_AGENT', 'FINANCE_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 95, max_cost_usd: 5.00, revenue_attribution_model: 'overall_executive', sla_latency_ms: 2500 }
  },

  SALES_AGENT: {
    identity: { id: 'sales', name: 'Sales & Revenue Agent', department: 'Commercial', role: 'Deal Closer' },
    goal: {
      primary: 'Qualify buyer requirements, calculate precise ROI, generate custom proposals, and close deals',
      allowed_objectives: ['lead_qualification', 'proposal_generation', 'roi_calculation', 'objection_handling'],
      forbidden_objectives: ['unauthorized_discount_over_20_percent', 'misrepresenting_features', 'fake_pricing_promises']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_services', 'get_customer', 'create_lead', 'update_lead', 'create_quote', 'calculate_roi', 'send_whatsapp'], max_calls: 30 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['SDR_AGENT', 'ARCHITECT_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 92, max_cost_usd: 2.00, revenue_attribution_model: 'direct_sales_commission', sla_latency_ms: 1800 }
  },

  SDR_AGENT: {
    identity: { id: 'sdr', name: 'Sales Development Representative', department: 'Commercial', role: 'Outreach Specialist' },
    goal: {
      primary: 'Identify high-intent B2B prospects, verify corporate MX records, and initiate warm conversational outreach',
      allowed_objectives: ['lead_discovery', 'prospect_enrichment', 'corporate_email_verification', 'outreach_drafting'],
      forbidden_objectives: ['spamming_unverified_lists', 'scraping_pii_without_consent', 'sending_mass_blasts']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_web', 'get_leads', 'create_lead', 'update_lead', 'send_message', 'search_knowledge'], max_calls: 20 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['SALES_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 90, max_cost_usd: 1.00, revenue_attribution_model: 'lead_generation_pipeline', sla_latency_ms: 1500 }
  },

  ARCHITECT_AGENT: {
    identity: { id: 'architect', name: 'Solution Architect', department: 'Engineering', role: 'System Architect' },
    goal: {
      primary: 'Analyze client bottlenecks and design zero-debt n8n, Docker, and AI workflow blueprints',
      allowed_objectives: ['architecture_design', 'stack_selection', 'effort_estimation', 'blueprint_generation'],
      forbidden_objectives: ['recommending_unsupported_stacks', 'over-promising_delivery_timeline']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_knowledge', 'get_services', 'get_customer', 'create_quote', 'draft_proposal', 'calculate_roi'], max_calls: 15 },
    permissions: { autonomy_level: 'L1_DRAFT', permission_level: 'LEVEL_1_DRAFT', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 96, max_cost_usd: 3.00, revenue_attribution_model: 'architecture_advisory', sla_latency_ms: 3000 }
  },

  DEVELOPER_AGENT: {
    identity: { id: 'developer', name: 'Developer Swarm Lead', department: 'Engineering', role: 'Lead Developer' },
    goal: {
      primary: 'Generate clean production-grade code, n8n workflows, and serverless edge functions',
      allowed_objectives: ['code_generation', 'n8n_json_synthesis', 'unit_testing', 'staging_deployment'],
      forbidden_objectives: ['direct_production_database_dropping', 'committing_plaintext_secrets', 'untested_releases']
    },
    memory: { context_tokens: 128000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['create_project', 'create_task', 'run_tests', 'create_deployment', 'search_knowledge'], max_calls: 50 },
    permissions: { autonomy_level: 'L3_APPROVAL', permission_level: 'LEVEL_3_APPROVAL', can_delegate_to: ['QA_AGENT'], requires_hitl: true },
    evaluation: { target_quality_score: 98, max_cost_usd: 10.00, revenue_attribution_model: 'delivery_fulfillment', sla_latency_ms: 4000 }
  },

  QA_AGENT: {
    identity: { id: 'qa', name: 'Quality Assurance Agent', department: 'Engineering', role: 'QA Gatekeeper' },
    goal: {
      primary: 'Audit every deliverable against functional, security, performance, and accessibility standards',
      allowed_objectives: ['regression_testing', 'security_scanning', 'performance_benchmarking', 'issue_flagging'],
      forbidden_objectives: ['passing_failing_tests', 'ignoring_p0_security_alerts']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['run_tests', 'search_knowledge', 'create_incident', 'get_system_health'], max_calls: 20 },
    permissions: { autonomy_level: 'L0_OBSERVE', permission_level: 'LEVEL_0_READ', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 99, max_cost_usd: 2.00, revenue_attribution_model: 'quality_assurance', sla_latency_ms: 2000 }
  },

  DEVOPS_AGENT: {
    identity: { id: 'devops', name: 'DevOps & SRE Agent', department: 'Infrastructure', role: 'SRE Guardian' },
    goal: {
      primary: 'Monitor VPS telemetry, container uptime, database latency, and orchestrate auto-healing',
      allowed_objectives: ['telemetry_monitoring', 'container_restart', 'backup_verification', 'incident_resolution'],
      forbidden_objectives: ['unauthorized_cluster_destruction', 'disabling_firewall_rules']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_system_health', 'create_incident', 'resolve_incident', 'create_deployment', 'get_analytics'], max_calls: 15 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 97, max_cost_usd: 1.00, revenue_attribution_model: 'infrastructure_sla', sla_latency_ms: 1200 }
  },

  MARKETING_AGENT: {
    identity: { id: 'marketing', name: 'Marketing & Growth Agent', department: 'Growth', role: 'Growth Specialist' },
    goal: {
      primary: 'Produce high-converting case studies, organic SEO pages, and social campaign drafts',
      allowed_objectives: ['content_drafting', 'seo_keyword_research', 'social_post_composition', 'traffic_analytics'],
      forbidden_objectives: ['publishing_unapproved_claims', 'violating_brand_guidelines']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_web', 'search_knowledge', 'draft_content', 'publish_content', 'get_campaign_metrics', 'create_campaign'], max_calls: 20 },
    permissions: { autonomy_level: 'L1_DRAFT', permission_level: 'LEVEL_1_DRAFT', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 91, max_cost_usd: 3.00, revenue_attribution_model: 'inbound_growth_pipeline', sla_latency_ms: 2200 }
  },

  SUCCESS_AGENT: {
    identity: { id: 'success', name: 'Customer Success Agent', department: 'Operations', role: 'Client Advocate' },
    goal: {
      primary: 'Manage client onboarding, answer support tickets via RAG knowledge, and ensure 100% satisfaction',
      allowed_objectives: ['ticket_resolution', 'client_onboarding', 'documentation_guidance', 'upsell_identification'],
      forbidden_objectives: ['closing_unresolved_tickets', 'sharing_confidential_client_data']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_customer', 'get_projects', 'create_ticket', 'update_ticket', 'send_message', 'search_knowledge'], max_calls: 20 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['DEVOPS_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 94, max_cost_usd: 1.00, revenue_attribution_model: 'retention_and_expansion', sla_latency_ms: 1500 }
  },

  AFFILIATE_AGENT: {
    identity: { id: 'affiliate', name: 'Affiliate & Partnership Agent', department: 'Growth', role: 'Partner Manager' },
    goal: {
      primary: 'Recruit partners, track referral attributions, compute 20%-30% commissions, and detect click fraud',
      allowed_objectives: ['partner_recruitment', 'link_generation', 'attribution_tracking', 'fraud_detection'],
      forbidden_objectives: ['approving_fraudulent_payouts', 'altering_commission_schedules_without_owner']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_affiliates', 'create_affiliate_link', 'track_referral', 'calculate_commission', 'detect_fraud', 'get_analytics'], max_calls: 15 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 93, max_cost_usd: 1.00, revenue_attribution_model: 'affiliate_ecosystem', sla_latency_ms: 1400 }
  },

  FINANCE_AGENT: {
    identity: { id: 'finance', name: 'AI CFO & Finance Agent', department: 'Finance', role: 'Financial Controller' },
    goal: {
      primary: 'Audit the double-entry ledger, track gross & net margins (>80%), and detect revenue leakage',
      allowed_objectives: ['ledger_reconciliation', 'margin_auditing', 'invoice_generation', 'expense_tracking'],
      forbidden_objectives: ['autonomous_wire_transfers', 'deleting_accounting_entries']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_revenue', 'get_expenses', 'get_analytics', 'create_invoice', 'get_payment_status'], max_calls: 10 },
    permissions: { autonomy_level: 'L0_OBSERVE', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 99, max_cost_usd: 0.50, revenue_attribution_model: 'financial_controller', sla_latency_ms: 1000 }
  },

  INTELLIGENCE_AGENT: {
    identity: { id: 'intelligence', name: 'Market Intelligence Agent', department: 'Strategy', role: 'Market Analyst' },
    goal: {
      primary: 'Scan global pricing trends, competitor feature gaps, and emerging automation workflows',
      allowed_objectives: ['market_scanning', 'pricing_analysis', 'competitor_matrix_update'],
      forbidden_objectives: ['fabricating_market_metrics']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_web', 'search_knowledge', 'get_analytics'], max_calls: 10 },
    permissions: { autonomy_level: 'L0_OBSERVE', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 92, max_cost_usd: 2.00, revenue_attribution_model: 'strategic_intelligence', sla_latency_ms: 2000 }
  },

  GUARDIAN_AGENT: {
    identity: { id: 'guardian', name: 'Security & Policy Guardian', department: 'Security', role: 'Chief Security Officer' },
    goal: {
      primary: 'Audit agent action logs, enforce 5-Level HITL gates, block prompt injections, and protect secrets',
      allowed_objectives: ['log_auditing', 'policy_enforcement', 'security_incident_creation', 'budget_circuit_breaking'],
      forbidden_objectives: ['disabling_security_rules', 'bypassing_owner_escalations']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_audit_logs', 'get_system_health', 'create_incident', 'get_agents_status'], max_calls: 10 },
    permissions: { autonomy_level: 'L0_OBSERVE', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false, is_supervisor: true },
    evaluation: { target_quality_score: 100, max_cost_usd: 0.50, revenue_attribution_model: 'security_governance', sla_latency_ms: 800 }
  }
};

export const FIVE_TIER_HITL_MATRIX = {
  L0_OBSERVE: { level: 0, label: 'Observe & Read', description: 'Read-only queries, telemetry & status checks. 100% autonomous.', requires_approval: false },
  L1_DRAFT: { level: 1, label: 'Draft & Propose', description: 'Generates proposals, code drafts, email copy. No external side-effects.', requires_approval: false },
  L2_SAFE_EXECUTE: { level: 2, label: 'Safe Execution', description: 'Executes standard low-risk policy-checked actions (CRM updates, lead creation).', requires_approval: false },
  L3_APPROVAL: { level: 3, label: 'Owner Approval Gate', description: 'Requires explicit single-click owner authorization (payouts, deployments, refunds).', requires_approval: true },
  L4_PROHIBITED: { level: 4, label: 'Strictly Prohibited', description: 'Permanently blocked from autonomous execution (dropping DB, changing root secrets).', blocked: true }
};

export const AUTONOMY_SPECTRUM = {
  LEVEL_0_OBSERVE: { level: 0, label: 'Observe & Report', description: 'Read-only telemetry and observation.' },
  LEVEL_1_ASSIST: { level: 1, label: 'Assist & Suggest', description: 'Provides recommendations to human.' },
  LEVEL_2_COLLABORATE: { level: 2, label: 'Collaborate', description: 'Generates drafts awaiting review.' },
  LEVEL_3_DELEGATE: { level: 3, label: 'Delegated Tasks', description: 'Executes within tight sandbox.' },
  LEVEL_4_CONDITIONAL: { level: 4, label: 'Conditional Autonomy', description: 'Operates until confidence threshold is hit.' },
  LEVEL_5_EXECUTE_LOW_RISK: { level: 5, label: 'Autonomous Low-Risk', description: 'Executes policy-checked low-risk business operations.' },
  LEVEL_6_SUPERVISED: { level: 6, label: 'Supervised Autonomy', description: 'High-autonomy under continuous supervisor telemetry.' }
};

export const PERMISSION_LEVELS = {
  LEVEL_0_READ: { level: 0, label: 'Read Only', auto_approve: true },
  LEVEL_1_DRAFT: { level: 1, label: 'Draft', auto_approve: true },
  LEVEL_2_EXECUTE: { level: 2, label: 'Execute with Policy', auto_approve: true, requires_policy_check: true },
  LEVEL_3_APPROVAL: { level: 3, label: 'Owner Approval Required', auto_approve: false },
  LEVEL_4_RESTRICTED: { level: 4, label: 'Never Autonomous', auto_approve: false, blocked: true }
};

export const ANTI_LOOP_CONFIG = {
  max_delegation_depth: 5,
  max_total_iterations: 50,
  max_total_tool_calls: 100,
  max_runtime_seconds: 120,
  max_cost_usd: 20.00,
  max_retries_per_tool: 3
};

