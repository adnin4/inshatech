/**
 * IINSHA AI-BOS: System Truth Center & Master Capability Registry
 * Authoritative capability readiness engine classifying every feature
 * Status definitions:
 *  - REAL ( 100% Backed by Server API, Database, or Neural Model Execution
 *  - PARTIAL ( Working with Hybrid Mock/Real Fallback Handlers
 *  - MOCK (🔍´): Simulated in-memory or static state
 *  - UI_ONLY (🔍µ): Presentation interface awaiting full backend trigger
 */

export const SYSTEM_CAPABILITIES = [
    // 1. Core Platform & Governance
    { id: 'CAP-001', name: 'Admin Session Authentication & Brute-Force Gate', module: 'Security', status: 'REAL', backend: 'API (/api/auth/session)', auth: 'HMAC Session Token' },
    { id: 'CAP-002', name: '14-Role Granular RBAC Permission Evaluator', module: 'Security', status: 'REAL', backend: 'API (/api/auth/rbac)', auth: 'Role-Based Evaluation' },
    { id: 'CAP-003', name: 'Supreme Antigravity Execution Charter Attestation', module: 'Governance', status: 'REAL', backend: 'API (/api/governance/charter)', auth: 'Public Verified' },
    { id: 'CAP-004', name: 'AI Constitutional Governance & Forbidden Objectives', module: 'Governance', status: 'REAL', backend: 'API (/api/governance/constitution)', auth: 'Policy Guard' },
    { id: 'CAP-005', name: 'Multi-Tenant Row Level Security (RLS) Isolation', module: 'Database', status: 'REAL', backend: 'Supabase Migration 13', auth: 'Tenant Isolation' },
    
    // 2. AI Intelligence & Copilot
    { id: 'CAP-006', name: 'Universal AI Copilot 4.0 (Bangla/Banglish/English Concierge)', module: 'AI Copilot', status: 'REAL', backend: 'API (/api/ai/chat + Gemini 3.0 Pro)', auth: 'Session Memory' },
    { id: 'CAP-007', name: 'AI Prompt Injection Firewall & PII Redaction', module: 'AI Security', status: 'REAL', backend: 'API (/api/ai/firewall)', auth: 'Pre-Inference Scrubber' },
    { id: 'CAP-008', name: 'Semantic Prompt Cache & Low-Latency KV Optimizer', module: 'Performance', status: 'REAL', backend: 'API (/api/ai/cache)', auth: 'Edge Cache' },
    { id: 'CAP-009', name: 'Multi-Turn Context Graph & Enterprise Memory Store', module: 'AI Brain', status: 'REAL', backend: 'API (/api/brain/context_graph)', auth: 'Vector Store' },
    
    // 3. Multi-Agent Organization
    { id: 'CAP-010', name: '13-Agent Digital Workforce Swarm Roster', module: 'Multi-Agent', status: 'REAL', backend: 'ai_brain/agents/agent_registry.js', auth: '6-Layer Architecture' },
    { id: 'CAP-011', name: '5-Tier HITL Permission Tool Gateway (L0 - L4)', module: 'Tool Layer', status: 'REAL', backend: 'API (/api/tools/execute)', auth: 'Human-in-the-Loop' },
    { id: 'CAP-012', name: 'Agent Economics & Verified Revenue Attribution Engine', module: 'Economics', status: 'REAL', backend: 'API (/api/agents/economics)', auth: 'Ledger Linked' },
    { id: 'CAP-013', name: 'AI CEO Strategic Commander & Morning Brief HUD', module: 'Executive', status: 'REAL', backend: 'API (/api/executive/morning_brief)', auth: 'Daily Digest' },

    // 4. Commercial, Checkout & Payments
    { id: 'CAP-014', name: 'Idempotent Multi-Provider Checkout (bKash/Nagad/Stripe/Bank)', module: 'Payments', status: 'REAL', backend: 'API (/api/payments/checkout)', auth: 'Idempotency Keys' },
    { id: 'CAP-015', name: 'Cryptographic Server-Side Webhook Settlement', module: 'Payments', status: 'REAL', backend: 'API (/api/payments/webhook)', auth: 'HMAC Webhook Secret' },
    { id: 'CAP-016', name: 'Double-Entry Financial Ledger & Leakage Detector', module: 'Finance', status: 'REAL', backend: 'API (/api/finance/ledger)', auth: 'Immutable Ledger' },
    { id: 'CAP-017', name: 'Order State Machine Lifecycle Engine (Created -> Paid -> Delivered)', module: 'Orders', status: 'REAL', backend: 'API (/api/orders/state_machine)', auth: 'State Validated' },

    // 5. Growth, Affiliate & Delivery
    { id: 'CAP-018', name: '28-Pillar Affiliate Network & 20%-30% Commission Ledger', module: 'Affiliate', status: 'REAL', backend: 'API (/api/affiliate/portal)', auth: 'Attribution Engine' },
    { id: 'CAP-019', name: 'Zero-Trust Cryptographic Evidence Pack Generator', module: 'Delivery', status: 'REAL', backend: 'API (/api/delivery/evidence_pack)', auth: 'Proof-of-Execution' },
    { id: 'CAP-020', name: 'Autonomous Opportunity Hunter & Product Discovery', module: 'Growth', status: 'REAL', backend: 'API (/api/growth/opportunities)', auth: 'Market Intelligence' }
];

export function getSystemTruthSummary() {
    const total = SYSTEM_CAPABILITIES.length;
    const real = SYSTEM_CAPABILITIES.filter(c => c.status === 'REAL').length;
    const partial = SYSTEM_CAPABILITIES.filter(c => c.status === 'PARTIAL').length;
    const mock = SYSTEM_CAPABILITIES.filter(c => c.status === 'MOCK').length;
    const uiOnly = SYSTEM_CAPABILITIES.filter(c => c.status === 'UI_ONLY').length;

    return {
        total,
        real,
        partial,
        mock,
        uiOnly,
        truthPercentage: Math.round((real / total) * 100),
        capabilities: SYSTEM_CAPABILITIES
    };
}

