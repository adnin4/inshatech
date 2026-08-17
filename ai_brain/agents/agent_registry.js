export const AGENT_REGISTRY = {
  CEO_AGENT: {
    id: 'ceo',
    name: 'CEO Strategic Commander',
    department: 'Executive Office',
    description: 'Business strategy, revenue KPIs, priorities, cross-department coordination',
    allowed_tools: ['get_analytics', 'get_revenue', 'get_agents_status', 'create_priority', 'delegate_task'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SALES_AGENT', 'MARKETING_AGENT', 'DEVOPS_AGENT', 'FINANCE_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 5.00
  },
  SALES_AGENT: {
    id: 'sales',
    name: 'Sales & Revenue Agent',
    department: 'Revenue Department',
    description: 'Sales qualification, deal management, conversion, upsell',
    allowed_tools: ['get_services', 'get_customer', 'create_lead', 'update_lead', 'create_quote', 'calculate_roi', 'send_whatsapp'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SDR_AGENT', 'ARCHITECT_AGENT'],
    max_iterations: 15,
    max_tool_calls: 30,
    budget_limit_usd: 2.00
  },
  SDR_AGENT: {
    id: 'sdr',
    name: 'Sales Development Representative',
    department: 'Revenue Department',
    description: 'Lead discovery, qualification, outreach, follow-up',
    allowed_tools: ['search_web', 'get_leads', 'create_lead', 'update_lead', 'send_message', 'search_knowledge'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['SALES_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 1.00
  },
  ARCHITECT_AGENT: {
    id: 'architect',
    name: 'Solution Architect',
    department: 'Engineering Department',
    description: 'Technical discovery, architecture design, proposal generation, effort estimation',
    allowed_tools: ['search_knowledge', 'get_services', 'get_customer', 'create_quote', 'draft_proposal', 'calculate_roi'],
    autonomy_level: 'LEVEL_3_DRAFT',
    permission_level: 'LEVEL_1_DRAFT',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 8,
    max_tool_calls: 15,
    budget_limit_usd: 3.00
  },
  DEVELOPER_AGENT: {
    id: 'developer',
    name: 'Developer Swarm Lead',
    department: 'Engineering Department',
    description: 'Code generation, testing, security scanning, deployment',
    allowed_tools: ['create_project', 'create_task', 'run_tests', 'create_deployment', 'search_knowledge'],
    autonomy_level: 'LEVEL_6_EXECUTE_WITH_APPROVAL',
    permission_level: 'LEVEL_3_APPROVAL',
    can_delegate_to: ['QA_AGENT'],
    max_iterations: 20,
    max_tool_calls: 50,
    budget_limit_usd: 10.00
  },
  QA_AGENT: {
    id: 'qa',
    name: 'Quality Assurance Agent',
    department: 'Engineering Department',
    description: 'Testing, regression, security audits, performance checks',
    allowed_tools: ['run_tests', 'search_knowledge', 'create_incident', 'get_system_health'],
    autonomy_level: 'LEVEL_1_READ',
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 2.00
  },
  DEVOPS_AGENT: {
    id: 'devops',
    name: 'DevOps & SRE Agent',
    department: 'Operations Department',
    description: 'Monitoring, incident detection, recovery, backup, deployment verification',
    allowed_tools: ['get_system_health', 'create_incident', 'resolve_incident', 'create_deployment', 'get_analytics'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['DEVELOPER_AGENT'],
    max_iterations: 10,
    max_tool_calls: 15,
    budget_limit_usd: 1.00
  },
  MARKETING_AGENT: {
    id: 'marketing',
    name: 'Marketing & Growth Agent',
    department: 'Growth Department',
    description: 'SEO, content creation, social media, campaigns, analytics',
    allowed_tools: ['search_web', 'search_knowledge', 'draft_content', 'publish_content', 'get_campaign_metrics', 'create_campaign'],
    autonomy_level: 'LEVEL_3_DRAFT',
    permission_level: 'LEVEL_1_DRAFT',
    can_delegate_to: [],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 3.00
  },
  SUCCESS_AGENT: {
    id: 'success',
    name: 'Customer Success Agent',
    department: 'Support Department',
    description: 'Onboarding, support tickets, renewal, upsell opportunities',
    allowed_tools: ['get_customer', 'get_projects', 'create_ticket', 'update_ticket', 'send_message', 'search_knowledge'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: ['DEVOPS_AGENT'],
    max_iterations: 10,
    max_tool_calls: 20,
    budget_limit_usd: 1.00
  },
  AFFILIATE_AGENT: {
    id: 'affiliate',
    name: 'Affiliate & Partnership Agent',
    department: 'Partnerships Department',
    description: 'Partner recruitment, tracking, commission calculation, fraud detection, payout preparation',
    allowed_tools: ['get_affiliates', 'create_affiliate_link', 'track_referral', 'calculate_commission', 'detect_fraud', 'get_analytics'],
    autonomy_level: 'LEVEL_5_EXECUTE_LOW_RISK',
    permission_level: 'LEVEL_2_EXECUTE',
    can_delegate_to: [],
    max_iterations: 8,
    max_tool_calls: 15,
    budget_limit_usd: 1.00
  },
  FINANCE_AGENT: {
    id: 'finance',
    name: 'AI CFO & Finance Agent',
    department: 'Finance Department',
    description: 'Revenue tracking, expense management, profit analysis, commission ledger, payout reconciliation',
    allowed_tools: ['get_revenue', 'get_expenses', 'get_analytics', 'create_invoice', 'get_payment_status'],
    autonomy_level: 'LEVEL_1_READ',
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 0.50
  },
  INTELLIGENCE_AGENT: {
    id: 'intelligence',
    name: 'Market Intelligence Agent',
    department: 'Executive Office',
    description: 'Competitor analysis, market research, pricing opportunities, new segments',
    allowed_tools: ['search_web', 'search_knowledge', 'get_analytics'],
    autonomy_level: 'LEVEL_2_ANALYZE',
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 2.00
  },
  GUARDIAN_AGENT: {
    id: 'guardian',
    name: 'Security & Policy Guardian',
    department: 'Security Office',
    description: 'Security policy enforcement, permission auditing, risk assessment, compliance',
    allowed_tools: ['get_audit_logs', 'get_system_health', 'create_incident', 'get_agents_status'],
    autonomy_level: 'LEVEL_1_READ',
    permission_level: 'LEVEL_0_READ',
    can_delegate_to: [],
    max_iterations: 5,
    max_tool_calls: 10,
    budget_limit_usd: 0.50,
    is_supervisor: true
  }
};

// 7-Level Granular Autonomy Matrix
export const AUTONOMY_SPECTRUM = {
  LEVEL_1_READ: { rank: 1, label: 'Read Only', auto_approve: true, description: 'Inspection and read operations' },
  LEVEL_2_ANALYZE: { rank: 2, label: 'Analyze', auto_approve: true, description: 'Processing and computation without state mutation' },
  LEVEL_3_DRAFT: { rank: 3, label: 'Draft Mode', auto_approve: true, description: 'Generates drafts and proposals without publishing' },
  LEVEL_4_RECOMMEND: { rank: 4, label: 'Recommend', auto_approve: true, description: 'Proposes actions for user confirmation' },
  LEVEL_5_EXECUTE_LOW_RISK: { rank: 5, label: 'Execute Low Risk', auto_approve: true, requires_policy_check: true, description: 'Non-destructive execution within policy bounds' },
  LEVEL_6_EXECUTE_WITH_APPROVAL: { rank: 6, label: 'Execute with Approval', auto_approve: false, requires_human_approval: true, description: 'High-impact mutations requiring Owner approval' },
  LEVEL_7_FORBIDDEN: { rank: 7, label: 'Forbidden', auto_approve: false, blocked: true, description: 'Never permissible autonomously' }
};

// Legacy backwards-compatibility alias map
export const PERMISSION_LEVELS = {
  LEVEL_0_READ: AUTONOMY_SPECTRUM.LEVEL_1_READ,
  LEVEL_1_DRAFT: AUTONOMY_SPECTRUM.LEVEL_3_DRAFT,
  LEVEL_2_EXECUTE: AUTONOMY_SPECTRUM.LEVEL_5_EXECUTE_LOW_RISK,
  LEVEL_3_APPROVAL: AUTONOMY_SPECTRUM.LEVEL_6_EXECUTE_WITH_APPROVAL,
  LEVEL_4_RESTRICTED: AUTONOMY_SPECTRUM.LEVEL_7_FORBIDDEN
};

export const ANTI_LOOP_CONFIG = {
  max_delegation_depth: 5,
  max_total_iterations: 50,
  max_total_tool_calls: 100,
  max_runtime_seconds: 120,
  max_cost_usd: 20.00,
  max_retries_per_tool: 3
};
