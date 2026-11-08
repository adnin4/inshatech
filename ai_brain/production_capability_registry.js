/**
 * IINSHA AI-BOS — PRODUCTION CAPABILITY REGISTRY
 * Provides canonical, machine-verifiable capability tracking with truthful status taxonomy:
 * - NOT_IMPLEMENTED
 * - CODE_READY
 * - UNIT_VERIFIED
 * - INTEGRATION_VERIFIED
 * - SANDBOX_VERIFIED
 * - LIVE_VERIFIED
 * - DEGRADED
 * - BLOCKED
 * - FAILED
 * 
 * Invariant: Never display 'LIVE' on frontend unless LIVE_VERIFIED evidence exists.
 */

class ProductionCapabilityRegistry {
    constructor() {
        this.capabilities = new Map([
            ['payment.stripe', {
                capability_id: 'payment.stripe',
                name: 'Stripe Payment Gateway',
                owner_domain: 'FINANCE',
                status: 'SANDBOX_VERIFIED',
                environment: 'SANDBOX',
                provider: 'Stripe Elements & Checkout',
                version: '2026.08',
                verification_type: 'HMAC_WEBHOOK_SIMULATION',
                risk: 'HIGH_IMPACT'
            }],
            ['payment.bkash', {
                capability_id: 'payment.bkash',
                name: 'bKash Merchant Gateway',
                owner_domain: 'FINANCE',
                status: 'SANDBOX_VERIFIED',
                environment: 'SANDBOX',
                provider: 'bKash Merchant API',
                version: '2026.08',
                verification_type: 'MERCHANT_CHECKOUT_SIMULATION',
                risk: 'HIGH_IMPACT'
            }],
            ['affiliate.attribution', {
                capability_id: 'affiliate.attribution',
                name: 'S2S Affiliate Attribution & Fraud Radar',
                owner_domain: 'GROWTH',
                status: 'INTEGRATION_VERIFIED',
                environment: 'LOCAL_SANDBOX',
                provider: 'Internal S2S Click Engine',
                version: '2026.08',
                verification_type: 'DOUBLE_ENTRY_LEDGER_ASSERTION',
                risk: 'MEDIUM'
            }],
            ['crm.lead_hunter', {
                capability_id: 'crm.lead_hunter',
                name: 'Lead Discovery & Quarantine Engine',
                owner_domain: 'GROWTH',
                status: 'UNIT_VERIFIED',
                environment: 'SANDBOX',
                provider: 'LeadSourceAdapter (Inbound/Directory)',
                version: '2026.08',
                verification_type: 'ICP_OPPORTUNITY_SCORING',
                risk: 'LOW'
            }],
            ['outreach.whatsapp', {
                capability_id: 'outreach.whatsapp',
                name: 'WhatsApp Cloud API Outbound',
                owner_domain: 'GROWTH',
                status: 'NOT_CONFIGURED',
                environment: 'UNINITIALIZED',
                provider: 'Meta WhatsApp Cloud API',
                version: '2026.08',
                verification_type: 'PENDING_CREDENTIALS',
                risk: 'HIGH_IMPACT'
            }],
            ['outreach.email', {
                capability_id: 'outreach.email',
                name: 'Resend / SMTP Outbound Email',
                owner_domain: 'GROWTH',
                status: 'NOT_CONFIGURED',
                environment: 'UNINITIALIZED',
                provider: 'Resend API',
                version: '2026.08',
                verification_type: 'PENDING_CREDENTIALS',
                risk: 'HIGH_IMPACT'
            }],
            ['project.execution_worker', {
                capability_id: 'project.execution_worker',
                name: 'Sandboxed Engineering Project Worker',
                owner_domain: 'DELIVERY',
                status: 'SANDBOX_VERIFIED',
                environment: 'SANDBOX',
                provider: 'Isolated Workspace DAG Executor',
                version: '2026.08',
                verification_type: 'MILESTONE_DAG_EXECUTION',
                risk: 'HIGH_IMPACT'
            }],
            ['qa.independent_verifier', {
                capability_id: 'qa.independent_verifier',
                name: 'Dual-Agent Independent QA Gate',
                owner_domain: 'CONTROL',
                status: 'UNIT_VERIFIED',
                environment: 'LOCAL_SANDBOX',
                provider: 'IndependentQaVerifier (0.95+ Gate)',
                version: '2026.08',
                verification_type: 'CONFIDENCE_THRESHOLD_EVALUATION',
                risk: 'CRITICAL'
            }],
            ['delivery.owner_release', {
                capability_id: 'delivery.owner_release',
                name: 'Owner-Controlled Production Release Gate',
                owner_domain: 'CONTROL',
                status: 'UNIT_VERIFIED',
                environment: 'LOCAL_SANDBOX',
                provider: 'Owner L3 Sign-Off Gateway',
                version: '2026.08',
                verification_type: 'L3_AUTHORIZATION_ASSERTION',
                risk: 'CRITICAL'
            }],
            ['learning.skill_registry', {
                capability_id: 'learning.skill_registry',
                name: 'Governed Skill Evolution & Benchmark Pipeline',
                owner_domain: 'LEARNING',
                status: 'SANDBOX_VERIFIED',
                environment: 'SANDBOX',
                provider: 'SkillRegistryEngine (Benchmark >= 0.90)',
                version: '2026.08',
                verification_type: 'BENCHMARK_AND_APPROVAL_GATE',
                risk: 'CRITICAL'
            }]
        ]);
    }

    getCapability(capabilityId) {
        return this.capabilities.get(capabilityId) || {
            capability_id: capabilityId,
            status: 'NOT_IMPLEMENTED',
            environment: 'UNKNOWN',
            risk: 'UNKNOWN'
        };
    }

    getAllCapabilities() {
        return Array.from(this.capabilities.values());
    }

    getPublicStatusSummary() {
        const summary = {};
        for (const [id, cap] of this.capabilities.entries()) {
            summary[id] = {
                name: cap.name,
                status: cap.status,
                domain: cap.owner_domain,
                isLiveVerified: cap.status === 'LIVE_VERIFIED'
            };
        }
        return summary;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductionCapabilityRegistry };
}
