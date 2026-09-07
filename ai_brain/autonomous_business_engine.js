/**
 * IINSHA AI-BOS — AUTONOMOUS BUSINESS ENGINE
 * Governed cycle with explicit external-evidence gates.
 */

const { NegotiationMarginEngine } = require('./negotiation_margin_engine.js');
const { IndependentQaVerifier } = require('./independent_qa_verifier.js');

class AutonomousBusinessEngine {
    constructor(store = null, options = {}) {
        this.marginEngine = new NegotiationMarginEngine();
        this.qaVerifier = new IndependentQaVerifier();
        this.store = store;
        this.paymentProvidersConfigured = options.paymentProvidersConfigured === true;
        this.webhookVerifier = options.webhookVerifier || null;
        this.checkoutProvider = options.checkoutProvider || null;
    }

    createOpportunity(leadData = {}) {
        const oppId = `OPP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const opportunity = {
            id: oppId,
            leadName: leadData.name,
            company: leadData.company,
            serviceId: leadData.serviceId || 'b2b-lead-swarm',
            status: 'PROPOSAL',
            createdAt: new Date().toISOString()
        };
        if (this.store) this.store.saveOpportunity(opportunity);
        return opportunity;
    }

    createProposal(oppId, priceUSD = 850) {
        const propId = `PROP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const marginCheck = this.marginEngine.evaluateNegotiationOffer('b2b-lead-swarm', priceUSD);
        const proposal = {
            id: propId,
            opportunityId: oppId,
            priceUSD,
            marginDecision: marginCheck.decision,
            status: 'PENDING_ACCEPTANCE',
            createdAt: new Date().toISOString()
        };
        if (this.store) this.store.saveProposal(proposal);
        return proposal;
    }

    acceptProposal(propId, options = {}) {
        const orderId = options.orderId || `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const amount = Number.isFinite(options.amount) ? options.amount : null;
        const order = {
            id: orderId,
            proposalId: propId,
            amount,
            currency: options.currency || null,
            paymentStatus: 'PENDING',
            createdAt: new Date().toISOString()
        };
        if (this.store) this.store.saveOrder(order);
        return order;
    }

    async initiateCheckout(orderId, provider = 'stripe', context = {}) {
        if (!this.paymentProvidersConfigured || !this.checkoutProvider || typeof this.checkoutProvider.createCheckout !== 'function') {
            return {
                status: 'NOT_CONFIGURED',
                production_verified: false,
                blocked_from_success_claim: true,
                message: `Payment provider '${provider}' is not backed by a configured live adapter. Checkout halted safely.`
            };
        }

        const result = await this.checkoutProvider.createCheckout({ orderId, provider, ...context });
        if (!result || result.status !== 'CHECKOUT_INITIALIZED' || !result.checkoutUrl) {
            return {
                status: 'PROVIDER_ERROR',
                production_verified: false,
                blocked_from_success_claim: true
            };
        }
        return {
            ...result,
            status: 'CHECKOUT_INITIALIZED',
            production_verified: result.production_verified === true
        };
    }

    async processWebhook(eventPayload = {}, idempotencyKey = null, signature = null) {
        if (!idempotencyKey) {
            return {
                status: 'BLOCKED_MISSING_IDEMPOTENCY_KEY',
                production_verified: false,
                blocked_from_success_claim: true
            };
        }

        if (!this.webhookVerifier || typeof this.webhookVerifier.verify !== 'function') {
            return {
                status: 'NOT_CONFIGURED',
                production_verified: false,
                blocked_from_success_claim: true,
                message: 'Webhook signature verification adapter is not configured. Payment state transition halted safely.'
            };
        }

        let verified;
        try {
            verified = await this.webhookVerifier.verify({ eventPayload, signature, idempotencyKey });
        } catch (error) {
            return {
                status: 'WEBHOOK_VERIFICATION_ERROR',
                production_verified: false,
                blocked_from_success_claim: true,
                error: error instanceof Error ? error.message : 'Webhook verification failed'
            };
        }

        if (verified !== true) {
            return {
                status: 'WEBHOOK_SIGNATURE_INVALID',
                production_verified: false,
                blocked_from_success_claim: true
            };
        }

        if (this.store && !this.store.recordWebhook(idempotencyKey)) {
            return {
                status: 'DUPLICATE_IGNORED',
                production_verified: true,
                blocked_from_success_claim: false,
                message: 'Webhook event was already processed; replay prevented.'
            };
        }

        if (!eventPayload.orderId || !Number.isFinite(Number(eventPayload.amount)) || !eventPayload.currency) {
            return {
                status: 'BLOCKED_INVALID_PAYMENT_EVIDENCE',
                production_verified: true,
                blocked_from_success_claim: true
            };
        }

        const order = {
            id: eventPayload.orderId,
            amount: Number(eventPayload.amount),
            currency: eventPayload.currency,
            paymentStatus: 'PAID',
            verifiedHmac: true,
            providerReference: eventPayload.providerReference || null,
            paidAt: new Date().toISOString()
        };

        if (this.store) this.store.saveOrder(order);
        return {
            status: 'PAYMENT_VERIFIED_SUCCESS',
            production_verified: true,
            blocked_from_success_claim: false,
            order
        };
    }

    createAndExecuteProject(orderId, options = {}) {
        if (!options.paymentVerified) {
            return {
                status: 'BLOCKED_PAYMENT_NOT_VERIFIED',
                blocked_from_success_claim: true,
                production_verified: false
            };
        }

        const qaResult = this.qaVerifier.verifyDeliverable({
            builderAgentId: options.builderAgentId || 'DEVELOPER_SWARM_LEAD',
            deliverableType: options.deliverableType || 'FULL_STACK_AUTOMATION',
            targetUrl: options.targetUrl,
            evidence: options.qaEvidence
        });

        if (!qaResult || qaResult.verdict !== 'PASS_CERTIFIED') {
            return {
                status: 'BLOCKED_QA',
                blocked_from_success_claim: true,
                production_verified: false,
                qaResult
            };
        }

        if (options.clientApproval !== true || !options.clientApprovalEvidenceRef) {
            return {
                status: 'BLOCKED_CLIENT_APPROVAL_REQUIRED',
                blocked_from_success_claim: true,
                production_verified: false,
                qaResult
            };
        }

        const projId = `PROJ-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const project = {
            id: projId,
            orderId,
            status: 'DELIVERED',
            clientApprovalEvidenceRef: options.clientApprovalEvidenceRef,
            milestones: [
                { id: 'M1', title: 'Architecture & Swarm Setup', status: 'COMPLETE' },
                { id: 'M2', title: 'Engineering & Code Sandbox', status: 'COMPLETE' },
                { id: 'M3', title: 'Independent QA Verification', status: 'COMPLETE' },
                { id: 'M4', title: 'Client Review & Delivery', status: 'COMPLETE' }
            ],
            createdAt: new Date().toISOString(),
            deliveredAt: new Date().toISOString()
        };

        const supportTicket = {
            id: `TICKET-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            projectId: projId,
            subject: 'Post-Delivery Onboarding & API Integration Support',
            status: 'OPEN',
            createdAt: new Date().toISOString()
        };
        const renewal = {
            id: `REN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            projectId: projId,
            scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'SCHEDULED'
        };
        const learningRecord = {
            id: `LRN-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            projectId: projId,
            pattern: options.learningPattern || 'UNSPECIFIED',
            verificationStatus: 'UNVERIFIED',
            createdAt: new Date().toISOString()
        };

        if (this.store) {
            this.store.saveProject(project);
            this.store.saveSupportTicket(supportTicket);
            this.store.saveRenewal(renewal);
            this.store.saveLearning(learningRecord);
        }

        return {
            status: 'PROJECT_DELIVERED_SUCCESS',
            production_verified: true,
            blocked_from_success_claim: false,
            project,
            qaResult,
            supportTicket,
            renewal,
            learningRecord
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutonomousBusinessEngine };
}
