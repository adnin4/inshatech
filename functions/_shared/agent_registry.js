/**
 * Shared Internal Agent Registry for Cloudflare Pages Functions
 * 6-Layer Agent Architecture & 5-Tier HITL Safety Matrix
 */

export const INTERNAL_AGENT_ROSTER = {
  ceo: { name: 'CEO Strategic Commander', role: 'Executive', level: 'L2_SAFE_EXECUTE', costCapUsd: 5.00 },
  sales: { name: 'Sales & Revenue Agent', role: 'Commercial', level: 'L2_SAFE_EXECUTE', costCapUsd: 2.00 },
  sdr: { name: 'SDR Outreach Specialist', role: 'Commercial', level: 'L2_SAFE_EXECUTE', costCapUsd: 1.00 },
  architect: { name: 'Solution Architect', role: 'Engineering', level: 'L1_DRAFT', costCapUsd: 3.00 },
  developer: { name: 'Developer Swarm Lead', role: 'Engineering', level: 'L3_APPROVAL', costCapUsd: 10.00 },
  qa: { name: 'Quality Assurance Agent', role: 'Engineering', level: 'L0_OBSERVE', costCapUsd: 2.00 },
  devops: { name: 'DevOps & SRE Agent', role: 'Infrastructure', level: 'L2_SAFE_EXECUTE', costCapUsd: 1.00 },
  marketing: { name: 'Marketing & Growth Agent', role: 'Growth', level: 'L1_DRAFT', costCapUsd: 3.00 },
  success: { name: 'Customer Success Agent', role: 'Operations', level: 'L2_SAFE_EXECUTE', costCapUsd: 1.00 },
  affiliate: { name: 'Affiliate Partner Lead', role: 'Growth', level: 'L2_SAFE_EXECUTE', costCapUsd: 1.00 },
  finance: { name: 'AI CFO & Finance Agent', role: 'Finance', level: 'L0_OBSERVE', costCapUsd: 0.50 },
  intelligence: { name: 'Market Intelligence Agent', role: 'Strategy', level: 'L0_OBSERVE', costCapUsd: 2.00 },
  guardian: { name: 'Security & Policy Guardian', role: 'Security', level: 'L0_OBSERVE', costCapUsd: 0.50 }
};

export const FIVE_TIER_HITL_LEVELS = {
  L0_OBSERVE: { level: 0, autoApprove: true, label: 'Observe' },
  L1_DRAFT: { level: 1, autoApprove: true, label: 'Draft' },
  L2_SAFE_EXECUTE: { level: 2, autoApprove: true, label: 'Safe Execute' },
  L3_APPROVAL: { level: 3, autoApprove: false, label: 'Owner Approval Required' },
  L4_PROHIBITED: { level: 4, autoApprove: false, label: 'Prohibited', blocked: true }
};

