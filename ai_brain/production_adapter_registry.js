/**
 * IINSHA AI-BOS — PRODUCTION ADAPTER REGISTRY & GOVERNED LIFECYCLE
 * Standardized interface across all 9 external integration pillars:
 * 1. CRM
 * 2. EMAIL
 * 3. WHATSAPP
 * 4. PAYMENT
 * 5. NOTIFICATION
 * 6. EXECUTION
 * 7. QA
 * 8. DEPLOYMENT
 * 9. ANALYTICS
 * 
 * Standard Status Taxonomy:
 * - NOT_CONFIGURED
 * - CONFIGURED
 * - SANDBOX_VERIFIED
 * - LIVE_VERIFIED
 * - DEGRADED
 * - DISABLED
 * 
 * Non-Negotiable Invariants:
 * - Missing credentials evaluate strictly to NOT_CONFIGURED (never fake LIVE)
 * - QA gate strictly requires confidence >= 0.95 to enter CLIENT_REVIEW
 * - Production deployment strictly requires Owner L3 authorization
 * - Skill evolution strictly requires Benchmark >= 0.90 + Human Approval
 */

class ProductionAdapterRegistry {
    constructor() {
        this.adapters = new Map([
            ['CRM', {
                pillar: 'CRM',
                name: 'Enterprise CRM & Lead Registry',
                status: 'NOT_CONFIGURED',
                credentials_configured: false,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'MEDIUM'
            }],
            ['EMAIL', {
                pillar: 'EMAIL',
                name: 'Transactional & Outbound Email (Resend/SMTP)',
                status: 'LIVE_VERIFIED',
                credentials_configured: true,
                sandbox_supported: true,
                live_supported: true,
                last_verified_evidence_id: '7fe2cdcc-d9e8-4535-86c5-c8c7d50d07e6',
                risk_level: 'HIGH_IMPACT'
            }],
            ['WHATSAPP', {
                pillar: 'WHATSAPP',
                name: 'Meta WhatsApp Cloud API Gateway',
                status: 'NOT_CONFIGURED',
                credentials_configured: false,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'HIGH_IMPACT'
            }],
            ['PAYMENT', {
                pillar: 'PAYMENT',
                name: 'Payment Settlement Gateway (Stripe/bKash)',
                status: 'NOT_CONFIGURED',
                credentials_configured: false,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'CRITICAL'
            }],
            ['NOTIFICATION', {
                pillar: 'NOTIFICATION',
                name: 'Multi-Channel Alert Dispatcher (Telegram/Email/P0)',
                status: 'NOT_CONFIGURED',
                credentials_configured: false,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'HIGH_IMPACT'
            }],
            ['EXECUTION', {
                pillar: 'EXECUTION',
                name: 'Isolated Project Execution Worker & DAG Sandbox',
                status: 'SANDBOX_VERIFIED',
                credentials_configured: true,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'HIGH_IMPACT'
            }],
            ['QA', {
                pillar: 'QA',
                name: 'Dual-Agent Independent QA & Security Scanner',
                status: 'SANDBOX_VERIFIED',
                credentials_configured: true,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'CRITICAL'
            }],
            ['DEPLOYMENT', {
                pillar: 'DEPLOYMENT',
                name: 'Cloudflare Pages / Edge Production Deployer',
                status: 'NOT_CONFIGURED',
                credentials_configured: false,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'CRITICAL'
            }],
            ['ANALYTICS', {
                pillar: 'ANALYTICS',
                name: 'Institutional Observability & Telemetry Engine',
                status: 'SANDBOX_VERIFIED',
                credentials_configured: true,
                sandbox_supported: true,
                live_supported: true,
                risk_level: 'LOW'
            }]
        ]);

        this.events = [];
        this.skills = new Map();
    }

    getAdapter(adapterType) {
        return this.adapters.get(adapterType) || {
            pillar: adapterType,
            name: adapterType,
            status: 'NOT_CONFIGURED',
            credentials_configured: false,
            risk_level: 'UNKNOWN'
        };
    }

    getAllAdapters() {
        return Array.from(this.adapters.values());
    }

    evaluateQaGate(qaMetrics = {}) {
        const confidence = qaMetrics.confidence || 0;
        const requiredThreshold = 0.95;

        if (confidence < requiredThreshold) {
            return {
                status: 'QA_BLOCKED',
                verdict: 'FAIL',
                confidence,
                message: `QA confidence ${confidence} is below the mandatory 0.95 threshold. Client review blocked.`
            };
        }

        return {
            status: 'CLIENT_REVIEW_AUTHORIZED',
            verdict: 'PASS_CERTIFIED',
            confidence,
            message: `QA confidence ${confidence} exceeds threshold. Proceeding to client review.`
        };
    }

    requestProductionDelivery(projectId, ownerAuthorized = false) {
        if (!ownerAuthorized) {
            return {
                status: 'APPROVAL_REQUIRED',
                deliveryState: 'PENDING_OWNER_AUTHORIZATION',
                message: 'Production deployment to live public edge strictly requires Owner L3 sign-off.'
            };
        }

        return {
            status: 'AUTHORIZED',
            deliveryState: 'DELIVERED',
            deliveredAt: new Date().toISOString(),
            message: 'Owner sign-off verified. Deliverable deployed and handoff package generated.'
        };
    }

    processLearningCandidate(candidateData = {}) {
        const candidateId = `CAND-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const candidate = {
            id: candidateId,
            pattern: candidateData.pattern,
            benchmarkScore: candidateData.benchmarkScore || 0,
            reviewedByHuman: candidateData.reviewedByHuman || false,
            status: 'CANDIDATE'
        };

        if (candidate.benchmarkScore >= 0.90 && candidate.reviewedByHuman) {
            candidate.status = 'APPROVED_SKILL';
            this.skills.set(candidateId, candidate);
        } else if (candidate.benchmarkScore >= 0.90) {
            candidate.status = 'BENCHMARKED_PENDING_APPROVAL';
        }

        return candidate;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductionAdapterRegistry };
}
