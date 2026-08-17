export const AGENT_REGISTRY = {
  CEO_AGENT: {
    id: 'ceo',
    name: 'CEO Strategic Commander',
    description: 'Business strategy, revenue KPIs, priorities, cross-department coordination',
    allowed_tools: ['get_analytics', 'get_revenue', 'get_agents_status', 'create_priority', 'delegate_task'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SALES_AGENT', 'MARKETING_AGENT', 'DEVOPS_AGENT', 'FINANCE_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 5.00
  },
  SALES_AGENT: {
    id: 'sales',
    name: 'Sales & Revenue Agent',
    description: 'Sales qualification, deal management, conversion, upsell',
    allowed_tools: ['get_services', 'get_customer', 'create_lead', 'update_lead', 'create_quote', 'calculate_roi', 'send_whatsapp'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SDR_AGENT', 'ARCHITECT_AGENT'],
    max_iterations: 15,
    max_tool_calls: 30,
    budget_limit_usd: 2.00
  },
  SDR_AGENT: {
    id: 'sdr',
    name: 'Sales Development Representative',
    description: 'Lead discovery, qualification, outreach, follow-up',
    allowed_tools: ['search_web', 'get_leads', 'create_lead', 'update_lead', 'send_message', 'search_knowledge'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SALES_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 1.00
  },
  ARCHITECT_AGENT: {
    id: 'architect',
    name: 'Solution Architect',
    description: 'Technical discovery, architecture design, proposal generation, effort estimation',
    allowed_tools: ['search_knowledge', 'get_services', 'get_customer', 'create_quote', 'draft_proposal', 'calculate_roi'],
    permission_level: 'LEVEL_1_DRAFT',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 8,
    max_tool_calls: 15,
    budget_limit_usd: 3.00
  },
  DEVELOPER_AGENT: {
    id: 'developer',
    name: 'Developer Swarm Lead',
    description: 'Code generation, testing, security scanning, deployment',
    allowed_tools: ['create_project', 'create_task', 'run_tests', 'create_deployment', 'search_knowledge'],
    permission_level: 'LEVEL_3_APPROVAL',
    can_delegate_to: ['QA_AGENT'],
    max_iterations: 20,
    max_tool_calls: 50,
    budget_limit_usd: 10.00
  },
  QA_AGENT: {
    id: 'qa',
    name: 'Quality Assurance Agent',
    description: 'Testing, regression, security audits, performance checks',
    allowed_tools: ['run_tests', 'search_knowledge', 'create_incident', 'get_system_health'],
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 2.00
  },
  DEVOPS_AGENT: {
    id: 'devops',
    name: 'DevOps & SRE Agent',
    description: 'Monitoring, incident detection, recovery, backup, deployment verification',
    allowed_tools: ['get_system_health', 'create_incident', 'resolve_incident', 'create_deployment', 'get_analytics'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 10,
    max_tool_calls: 15,
    budget_limit_usd: 1.00
  },
  MARKETING_AGENT: {
    id: 'marketing',
    name: 'Marketing & Growth Agent',
    description: 'SEO, content creation, social media, campaigns, analytics',
    allowed_tools: ['search_web', 'search_knowledge', 'draft_content', 'publish_content', 'get_campaign_metrics', 'create_campaign'],
    permission_level: 'LEVEL_1_DRAFT',
    can_delegate_to: [],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 3.00
  },
  SUCCESS_AGENT: {
    id: 'success',
    name: 'Customer Success Agent',
    description: 'Onboarding, support tickets, renewal, upsell opportunities',
    allowed_tools: ['get_customer', 'get_projects', 'create_ticket', 'update_ticket', 'send_message', 'search_knowledge'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['DEVOPS_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 1.00
  },
  AFFILIATE_AGENT: {
    id: 'affiliate',
    name: 'Affiliate & Partnership Agent',
    description: 'Partner recruitment, tracking, commission calculation, fraud detection, payout preparation',
    allowed_tools: ['get_affiliates', 'create_affiliate_link', 'track_referral', 'calculate_commission', 'detect_fraud', 'get_analytics'],
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: [],
    max_iterations: 8,
    max_tool_calls: 15,
    budget_limit_usd: 1.00
  },
  FINANCE_AGENT: {
    id: 'finance',
    name: 'AI CFO & Finance Agent',
    description: 'Revenue tracking, expense management, profit analysis, commission ledger, payout reconciliation',
    allowed_tools: ['get_revenue', 'get_expenses', 'get_analytics', 'create_invoice', 'get_payment_status'],
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 0.50
  },
  INTELLIGENCE_AGENT: {
    id: 'intelligence',
    name: 'Market Intelligence Agent',
    description: 'Competitor analysis, market research, pricing opportunities, new segments',
    allowed_tools: ['search_web', 'search_knowledge', 'get_analytics'],
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 2.00
  },
  GUARDIAN_AGENT: {
    id: 'guardian',
    name: 'Security & Policy Guardian',
    description: 'Security policy enforcement, permission auditing, risk assessment, compliance',
    allowed_tools: ['get_audit_logs', 'get_system_health', 'create_incident', 'get_agents_status'],
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 0.50,
    is_supervisor: true
  }
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
