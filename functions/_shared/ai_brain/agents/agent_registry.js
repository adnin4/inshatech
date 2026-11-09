/**
 * IINSHA AI-BOS: 18-Specialist Agent Autonomous Business Organization Registry
 * Strict 6-Layer Architecture:
 * 1. Identity | 2. Goal | 3. Memory | 4. Tools | 5. Permissions | 6. Evaluation
 */

export const AGENT_REGISTRY = {
  CHIEF_ORCHESTRATOR_AGENT: {
    identity: { id: 'orchestrator', name: 'Chief Workforce Orchestrator', department: 'Executive', role: 'Executive Commander' },
    goal: {
      primary: 'Schedule task DAGs, supervise cross-agent delegation, and enforce strict SLA/governance policies',
      allowed_objectives: ['task_scheduling', 'cross_agent_delegation', 'sla_enforcement', 'system_oversight'],
      forbidden_objectives: ['unauthorized_funds_transfer', 'modifying_master_constitution', 'bypassing_hitl_gates']
    },
    memory: { context_tokens: 128000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['create_task_dag', 'delegate_task', 'evaluate_sla', 'get_analytics'], max_calls: 30 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'MEDIUM', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['REQUIREMENTS_AGENT', 'ARCHITECT_AGENT', 'DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 95, max_cost_usd: 5.00, revenue_attribution_model: 'overall_executive', sla_latency_ms: 2000 }
  },

  REQUIREMENTS_AGENT: {
    identity: { id: 'requirements', name: 'Requirements & PRD Specialist', department: 'Engineering', role: 'Requirements Specialist' },
    goal: {
      primary: 'Deconstruct client project requests into unambiguous PRDs and Gherkin acceptance criteria',
      allowed_objectives: ['requirements_extraction', 'acceptance_criteria_synthesis', 'scope_bounding'],
      forbidden_objectives: ['accepting_out_of_scope_features', 'omitting_acceptance_criteria']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['extract_user_stories', 'validate_spec', 'generate_acceptance_criteria'], max_calls: 20 },
    permissions: { autonomy_level: 'L1_DRAFT', risk_class: 'LOW', permission_level: 'LEVEL_1_DRAFT', can_delegate_to: ['ARCHITECT_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 94, max_cost_usd: 2.00, revenue_attribution_model: 'requirements_clarity', sla_latency_ms: 1800 }
  },

  ARCHITECT_AGENT: {
    identity: { id: 'architect', name: 'Solution & Technical Architect', department: 'Engineering', role: 'System Architect' },
    goal: {
      primary: 'Analyze bottlenecks and design zero-debt n8n, Docker, and AI workflow topology blueprints',
      allowed_objectives: ['architecture_design', 'stack_selection', 'effort_estimation', 'blueprint_generation'],
      forbidden_objectives: ['recommending_unsupported_stacks', 'over-promising_delivery_timeline']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['design_topology', 'validate_schema_contract', 'create_quote', 'draft_proposal'], max_calls: 20 },
    permissions: { autonomy_level: 'L1_DRAFT', risk_class: 'LOW', permission_level: 'LEVEL_1_DRAFT', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 96, max_cost_usd: 3.00, revenue_attribution_model: 'architecture_advisory', sla_latency_ms: 2500 }
  },

  DEVELOPER_AGENT: {
    identity: { id: 'developer', name: 'Full-Stack Engineering Lead', department: 'Engineering', role: 'Lead Developer' },
    goal: {
      primary: 'Synthesize clean production-grade code, serverless edge functions, and n8n workflows',
      allowed_objectives: ['code_generation', 'n8n_json_synthesis', 'unit_testing', 'staging_deployment'],
      forbidden_objectives: ['direct_production_database_dropping', 'committing_plaintext_secrets', 'untested_releases']
    },
    memory: { context_tokens: 128000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['synthesize_code', 'generate_n8n_workflow', 'run_tests', 'create_project'], max_calls: 50 },
    permissions: { autonomy_level: 'L3_APPROVAL', risk_class: 'HIGH', permission_level: 'LEVEL_3_APPROVAL', can_delegate_to: ['REVIEWER_AGENT', 'QA_AGENT'], requires_hitl: true },
    evaluation: { target_quality_score: 98, max_cost_usd: 10.00, revenue_attribution_model: 'delivery_fulfillment', sla_latency_ms: 3500 }
  },

  REVIEWER_AGENT: {
    identity: { id: 'reviewer', name: 'Independent Code Reviewer', department: 'Quality', role: 'Code Reviewer' },
    goal: {
      primary: 'Perform AST-level static review, enforce zero placeholders, zero TODOs, and DRY/SOLID principles',
      allowed_objectives: ['ast_code_review', 'anti_pattern_detection', 'complexity_profiling'],
      forbidden_objectives: ['approving_placeholders', 'ignoring_cyclomatic_complexity']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['ast_analyze', 'lint_scan', 'complexity_profile', 'audit_dependencies'], max_calls: 20 },
    permissions: { autonomy_level: 'L0_OBSERVE', risk_class: 'LOW', permission_level: 'LEVEL_0_READ', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 99, max_cost_usd: 2.00, revenue_attribution_model: 'code_quality_gate', sla_latency_ms: 1800 }
  },

  QA_AGENT: {
    identity: { id: 'qa', name: 'QA Automation Lead', department: 'Quality', role: 'QA Lead' },
    goal: {
      primary: 'Execute comprehensive automated unit, integration, and E2E regression test suites',
      allowed_objectives: ['regression_testing', 'edge_case_probing', 'mutation_testing'],
      forbidden_objectives: ['passing_failing_tests', 'skipping_asserts']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['run_tests', 'run_browser_e2e', 'mutation_test', 'record_test_evidence'], max_calls: 30 },
    permissions: { autonomy_level: 'L0_OBSERVE', risk_class: 'LOW', permission_level: 'LEVEL_0_READ', can_delegate_to: ['DEVELOPER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 99, max_cost_usd: 3.00, revenue_attribution_model: 'qa_gatekeeper', sla_latency_ms: 2200 }
  },

  SECURITY_AGENT: {
    identity: { id: 'security', name: 'Cybersecurity Guardian', department: 'Security', role: 'Chief Security Officer' },
    goal: {
      primary: 'Enforce zero-trust architecture, OWASP mitigations, multi-tenant RLS isolation, and secret protection',
      allowed_objectives: ['vulnerability_scanning', 'secret_leak_detection', 'rls_policy_audit'],
      forbidden_objectives: ['ignoring_secrets', 'bypassing_auth_gates']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['scan_vulnerabilities', 'verify_rls_isolation', 'trip_killswitch'], max_calls: 20 },
    permissions: { autonomy_level: 'L0_OBSERVE', risk_class: 'CRITICAL', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 100, max_cost_usd: 1.00, revenue_attribution_model: 'zero_trust_defense', sla_latency_ms: 1000 }
  },

  EVIDENCE_AGENT: {
    identity: { id: 'evidence', name: 'Cryptographic Evidence Attester', department: 'Quality', role: 'Evidence Attester' },
    goal: {
      primary: 'Maintain immutable SHA-256 hash chains of all task inputs and outputs and seal verification certificates',
      allowed_objectives: ['hash_chaining', 'artifact_hashing', 'certificate_sealing'],
      forbidden_objectives: ['tampering_with_hashes', 'modifying_historical_ledger']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['hash_artifacts', 'verify_sha_parity', 'sign_evidence_block', 'seal_certificate'], max_calls: 25 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'LOW', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 100, max_cost_usd: 0.50, revenue_attribution_model: 'truth_attestation', sla_latency_ms: 800 }
  },

  RESEARCH_AGENT: {
    identity: { id: 'research', name: 'Market Intelligence Specialist', department: 'Strategy', role: 'Market Analyst' },
    goal: {
      primary: 'Analyze global automation workflows, competitor matrices, and emerging AI agent architectures',
      allowed_objectives: ['market_scanning', 'workflow_benchmarking', 'pricing_intelligence'],
      forbidden_objectives: ['fabricating_market_metrics']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_web', 'search_knowledge', 'extract_pricing_matrix', 'benchmark_workflow'], max_calls: 20 },
    permissions: { autonomy_level: 'L0_OBSERVE', risk_class: 'LOW', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 92, max_cost_usd: 1.50, revenue_attribution_model: 'market_intelligence', sla_latency_ms: 1800 }
  },

  LEAD_HUNTER_AGENT: {
    identity: { id: 'lead_hunter', name: 'Lead Generation Hunter', department: 'Commercial', role: 'Lead Hunter' },
    goal: {
      primary: 'Identify high-intent enterprise prospects, verify corporate MX records, and enrich buyer profiles',
      allowed_objectives: ['prospect_discovery', 'mx_verification', 'profile_enrichment'],
      forbidden_objectives: ['scraping_pii_unlawfully', 'spamming_unverified_lists']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_web', 'get_leads', 'verify_corporate_mx', 'enrich_company_profile'], max_calls: 25 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'MEDIUM', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['CRM_OUTREACH_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 91, max_cost_usd: 2.00, revenue_attribution_model: 'lead_pipeline', sla_latency_ms: 1500 }
  },

  CRM_OUTREACH_AGENT: {
    identity: { id: 'crm_outreach', name: 'CRM & Outreach Specialist', department: 'Commercial', role: 'CRM Specialist' },
    goal: {
      primary: 'Orchestrate tailored multi-touch email sequences and track deal velocity through CRM pipeline stages',
      allowed_objectives: ['crm_pipeline_tracking', 'personalized_outreach_drafting', 'follow_up_sequencing'],
      forbidden_objectives: ['sending_mass_unsegmented_blasts']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['update_crm_stage', 'schedule_touchpoint', 'draft_email', 'send_message'], max_calls: 25 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'LOW', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['SALES_PROPOSAL_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 93, max_cost_usd: 1.00, revenue_attribution_model: 'pipeline_engagement', sla_latency_ms: 1400 }
  },

  SALES_PROPOSAL_AGENT: {
    identity: { id: 'sales_proposal', name: 'Sales & Proposal Closer', department: 'Commercial', role: 'Deal Closer' },
    goal: {
      primary: 'Synthesize custom proposals, model 30-day ROI, protect 80%+ margin floors, and close enterprise deals',
      allowed_objectives: ['roi_calculation', 'proposal_generation', 'pricing_optimization', 'margin_defense'],
      forbidden_objectives: ['violating_margin_floor', 'misrepresenting_deliverables']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['calculate_roi', 'evaluate_margin_floor', 'generate_proposal', 'create_quote'], max_calls: 30 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'MEDIUM', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['PAYMENT_VERIFIER_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 95, max_cost_usd: 3.00, revenue_attribution_model: 'sales_closing', sla_latency_ms: 1800 }
  },

  PAYMENT_VERIFIER_AGENT: {
    identity: { id: 'payment_verifier', name: 'Payment Verification Sentinel', department: 'Finance', role: 'Payment Sentinel' },
    goal: {
      primary: 'Validate native server-side HMAC signatures, enforce idempotency, and confirm customer order settlements',
      allowed_objectives: ['webhook_hmac_verification', 'idempotency_validation', 'settlement_confirmation'],
      forbidden_objectives: ['approving_unverified_payments', 'accepting_client_only_proof']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['verify_webhook_hmac', 'validate_idempotency', 'check_fx_peg', 'confirm_order'], max_calls: 20 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'HIGH', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['FINANCE_CFO_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 100, max_cost_usd: 0.50, revenue_attribution_model: 'payment_security', sla_latency_ms: 800 }
  },

  FINANCE_CFO_AGENT: {
    identity: { id: 'finance_cfo', name: 'AI CFO & Finance Controller', department: 'Finance', role: 'CFO' },
    goal: {
      primary: 'Audit double-entry general ledger, verify 80%+ gross margins, and monitor accounts receivables/payables',
      allowed_objectives: ['ledger_reconciliation', 'margin_auditing', 'cash_flow_tracking'],
      forbidden_objectives: ['autonomous_wire_transfers', 'deleting_accounting_entries']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_revenue', 'get_expenses', 'record_ledger_entry', 'reconcile_payouts'], max_calls: 15 },
    permissions: { autonomy_level: 'L0_OBSERVE', risk_class: 'HIGH', permission_level: 'LEVEL_0_READ', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 99, max_cost_usd: 1.00, revenue_attribution_model: 'financial_controller', sla_latency_ms: 1000 }
  },

  DEVOPS_SRE_AGENT: {
    identity: { id: 'devops_sre', name: 'DevOps & SRE Guardian', department: 'Infrastructure', role: 'SRE Guardian' },
    goal: {
      primary: 'Monitor multi-region edge telemetry, container health, fail-closed probes, and enforce 99.95% SLO',
      allowed_objectives: ['telemetry_monitoring', 'incident_triaging', 'backup_verification'],
      forbidden_objectives: ['unauthorized_cluster_destruction', 'disabling_firewall']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['get_system_health', 'create_incident', 'verify_backup_integrity', 'restart_container'], max_calls: 20 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'MEDIUM', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 98, max_cost_usd: 1.50, revenue_attribution_model: 'infrastructure_sla', sla_latency_ms: 1200 }
  },

  SUPPORT_SUCCESS_AGENT: {
    identity: { id: 'support_success', name: 'Customer Support Concierge', department: 'Operations', role: 'Client Concierge' },
    goal: {
      primary: 'Provide 24/7 bilingual client support, resolve inquiries via RAG knowledge base, and ensure 100% NPS',
      allowed_objectives: ['ticket_resolution', 'client_guidance', 'nps_evaluation'],
      forbidden_objectives: ['sharing_confidential_client_data']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['search_knowledge', 'create_ticket', 'update_ticket', 'evaluate_nps'], max_calls: 25 },
    permissions: { autonomy_level: 'L2_SAFE_EXECUTE', risk_class: 'LOW', permission_level: 'LEVEL_2_EXECUTE', can_delegate_to: ['ANALYTICS_RENEWAL_AGENT'], requires_hitl: false },
    evaluation: { target_quality_score: 95, max_cost_usd: 1.00, revenue_attribution_model: 'customer_satisfaction', sla_latency_ms: 1200 }
  },

  ANALYTICS_RENEWAL_AGENT: {
    identity: { id: 'analytics_renewal', name: 'Analytics & Renewal Specialist', department: 'Growth', role: 'Renewal Specialist' },
    goal: {
      primary: 'Model churn risk from telemetry, track contract renewals, and schedule quarterly business reviews',
      allowed_objectives: ['churn_risk_modeling', 'usage_analytics', 'renewal_scheduling'],
      forbidden_objectives: ['ignoring_at_risk_clients']
    },
    memory: { context_tokens: 32000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['calculate_churn_risk', 'get_usage_metrics', 'schedule_renewal_review'], max_calls: 15 },
    permissions: { autonomy_level: 'L1_DRAFT', risk_class: 'LOW', permission_level: 'LEVEL_1_DRAFT', can_delegate_to: [], requires_hitl: false },
    evaluation: { target_quality_score: 94, max_cost_usd: 1.50, revenue_attribution_model: 'retention_and_expansion', sla_latency_ms: 1500 }
  },

  DEPLOYMENT_RELEASE_AGENT: {
    identity: { id: 'deployment_release', name: 'Deployment & Release Director', department: 'Infrastructure', role: 'Release Director' },
    goal: {
      primary: 'Orchestrate staging smoke verification, enforce release gates, and manage zero-downtime rollbacks',
      allowed_objectives: ['staging_smoke_testing', 'production_promotion_gating', 'rollback_execution'],
      forbidden_objectives: ['unauthorized_production_push_without_hitl', 'ignoring_failed_smoke_tests']
    },
    memory: { context_tokens: 64000, persist_state: true, memory_store: 'ibos_memories' },
    tools: { allowed: ['promote_to_staging', 'promote_to_production', 'trigger_smoke_test', 'rollback_release'], max_calls: 15 },
    permissions: { autonomy_level: 'L3_APPROVAL', risk_class: 'CRITICAL', permission_level: 'LEVEL_3_APPROVAL', can_delegate_to: [], requires_hitl: true },
    evaluation: { target_quality_score: 100, max_cost_usd: 2.00, revenue_attribution_model: 'release_gate_governance', sla_latency_ms: 2000 }
  }
};

// Backwards-compatible aliases
AGENT_REGISTRY.CEO_AGENT = AGENT_REGISTRY.CHIEF_ORCHESTRATOR_AGENT;
AGENT_REGISTRY.SALES_AGENT = AGENT_REGISTRY.SALES_PROPOSAL_AGENT;
AGENT_REGISTRY.SDR_AGENT = AGENT_REGISTRY.LEAD_HUNTER_AGENT;
AGENT_REGISTRY.DEVOPS_AGENT = AGENT_REGISTRY.DEVOPS_SRE_AGENT;
AGENT_REGISTRY.MARKETING_AGENT = AGENT_REGISTRY.CRM_OUTREACH_AGENT;
AGENT_REGISTRY.SUCCESS_AGENT = AGENT_REGISTRY.SUPPORT_SUCCESS_AGENT;
AGENT_REGISTRY.FINANCE_AGENT = AGENT_REGISTRY.FINANCE_CFO_AGENT;
AGENT_REGISTRY.GUARDIAN_AGENT = AGENT_REGISTRY.SECURITY_AGENT;

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
