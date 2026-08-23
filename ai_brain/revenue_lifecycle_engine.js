/**
 * IINSHA AI-BOS — REVENUE LIFECYCLE ENGINE
 * Governed Revenue Cycle:
 * Real Lead -> Qualification -> Margin Proposal -> Acceptance -> Unverified Payment Block ->
 * Verified Payment -> Project Creation -> Planning Stage.
 */

const { NegotiationMarginEngine } = require('./negotiation_margin_engine.js');

class RevenueLifecycleEngine {
    constructor() {
        this.marginEngine = new NegotiationMarginEngine();
        this.leads = new Map();
        this.proposals = new Map();
        this.orders = new Map();
        this.projects = new Map();
        this.events = [];
    }

    createLead(leadData) {
        if (leadData.classification === 'SYNTHETIC_DEMO') {
            return {
                status: 'BLOCKED',
                reason: 'SYNTHETIC_DEMO leads are strictly quarantined and cannot enter revenue lifecycle.',
                lead_id: null
            };
        }

        const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const record = {
            id: leadId,
            name: leadData.name,
            email: leadData.email,
            company: leadData.company,
            classification: leadData.classification || 'REAL_PROSPECT',
            serviceId: leadData.serviceId || 'b2b-lead-swarm',
            budgetUSD: leadData.budgetUSD || 850,
            status: 'QUALIFIED',
            created_at: new Date().toISOString()
        };

        this.leads.set(leadId, record);
        this.recordEvent('lead.qualified', { leadId, classification: record.classification });

        return {
            status: 'QUALIFIED',
            lead: record
        };
    }

    generateMarginGatedProposal(leadId, offeredPriceUSD) {
        const lead = this.leads.get(leadId);
        if (!lead) return { status: 'ERROR', message: 'Lead not found' };

        const marginEvaluation = this.marginEngine.evaluateNegotiationOffer(lead.serviceId, offeredPriceUSD);
        if (marginEvaluation.decision === 'REJECT_UNPROFITABLE_OFFER') {
            return {
                status: 'PROPOSAL_REJECTED',
                reason: 'Offered price violates minimum safe margin floor.',
                evaluation: marginEvaluation
            };
        }

        const proposalId = `PROP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const proposal = {
            id: proposalId,
            leadId,
            serviceId: lead.serviceId,
            priceUSD: offeredPriceUSD,
            requiresL3Approval: marginEvaluation.decision === 'REQUIRES_L3_OWNER_APPROVAL',
            status: 'PENDING_ACCEPTANCE',
            created_at: new Date().toISOString()
        };

        this.proposals.set(proposalId, proposal);
        this.recordEvent('proposal.created', { proposalId, priceUSD: offeredPriceUSD });

        return {
            status: 'PROPOSAL_GENERATED',
            proposal
        };
    }

    acceptProposal(proposalId, ownerApproved = false) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal) return { status: 'ERROR', message: 'Proposal not found' };

        if (proposal.requiresL3Approval && !ownerApproved) {
            return {
                status: 'BLOCKED_L3_APPROVAL_REQUIRED',
                message: 'This discounted proposal strictly requires Owner L3 sign-off before acceptance.'
            };
        }

        proposal.status = 'ACCEPTED';
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const order = {
            id: orderId,
            proposalId,
            amountUSD: proposal.priceUSD,
            paymentStatus: 'PENDING',
            created_at: new Date().toISOString()
        };

        this.orders.set(orderId, order);
        this.recordEvent('proposal.accepted', { proposalId, orderId });

        return {
            status: 'ACCEPTED',
            orderId,
            order
        };
    }

    processPayment(orderId, verificationProof = {}) {
        const order = this.orders.get(orderId);
        if (!order) return { status: 'ERROR', message: 'Order not found' };

        if (!verificationProof.isVerifiedGatewayPayload) {
            order.paymentStatus = 'UNVERIFIED';
            return {
                status: 'PAYMENT_UNVERIFIED_BLOCKED',
                message: 'Payment verification failed or missing authentic gateway HMAC. Project creation blocked.',
                paymentStatus: 'UNVERIFIED'
            };
        }

        order.paymentStatus = 'PAID';
        order.transactionRef = verificationProof.transactionRef || `TXN-${Date.now()}`;
        this.recordEvent('payment.completed', { orderId, amount: order.amountUSD, ref: order.transactionRef });

        // Initialize Project DAG only upon verified payment
        const projectId = `PROJ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const project = {
            id: projectId,
            orderId,
            status: 'PLANNING',
            milestones: [
                { id: 'M1', title: 'Architecture & Swarm Setup', status: 'IN_PROGRESS' },
                { id: 'M2', title: 'Engineering & Code Sandbox', status: 'TODO' },
                { id: 'M3', title: 'Independent QA Verification', status: 'TODO' },
                { id: 'M4', title: 'Client Review & Delivery', status: 'TODO' }
            ],
            created_at: new Date().toISOString()
        };

        this.projects.set(projectId, project);
        this.recordEvent('project.created', { projectId, orderId, status: 'PLANNING' });

        return {
            status: 'PAID',
            paymentStatus: 'PAID',
            project
        };
    }

    recordEvent(eventType, payload) {
        this.events.push({
            event_id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            eventType,
            payload,
            timestamp: new Date().toISOString()
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RevenueLifecycleEngine };
}
