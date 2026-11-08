/**
 * IINSHA TECH OS v1000 - Enterprise TypeScript Contracts & Type Definitions
 */

export type ServiceCategory = 
  | 'AI Agents & Swarms'
  | 'Web Scraping & Data Pipelines'
  | 'Workflow Automation & n8n'
  | 'Custom RAG & Vector DB'
  | 'Enterprise SaaS'
  | 'DevOps & Failover Infrastructure';

export interface ServicePackage {
  name: string;
  price: number;
  delivery: string;
  features: string[];
}

export interface ServiceRegistryItem {
  slug: string;
  title: string;
  category: ServiceCategory;
  price: number;
  commission_rate: number;
  packages: ServicePackage[];
  features: string[];
  media_url?: string;
  status: 'published' | 'draft' | 'archived';
  proof_badge?: 'LIVE DATA' | 'VERIFIED CASE STUDY' | 'SIMULATED ESTIMATE';
}

export interface AISwarmNode {
  id: string;
  name: string;
  domain: string;
  model: string;
  status: 'ACTIVE' | 'TRAINING' | 'STANDBY';
  latency_ms: number;
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalSpent: number;
  status: 'Active VIP' | 'Lead' | 'Churned';
}

export interface ProjectTask {
  id: string;
  title: string;
  client: string;
  phase: string;
  progress: number;
  price: number;
  status: 'On Track' | 'Delayed' | 'Completed';
}

export interface SystemBuilderConfig {
  industry: string;
  problem: string;
  automationType: string;
  aiModel: string;
  database: string;
  integrations: string[];
  estimatedCostUSD: number;
  estimatedROI: number;
  timelineDays: number;
}

export interface ExecutiveBriefing {
  date: string;
  mrrUSD: number;
  activeClients: number;
  systemUptime: number;
  activeSwarms: number;
  aiAgentThroughputTasksPerMin: number;
}
