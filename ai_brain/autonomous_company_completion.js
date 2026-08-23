/**
 * IINSHA AI-BOS — Autonomous Company Completion Orchestrator
 *
 * Governs the post-acquisition lifecycle without directly performing external
 * side effects. Adapters must be injected for CRM, payments, project workers,
 * QA, delivery, support and learning. All high-impact actions return an
 * approval requirement instead of silently executing.
 */

const TERMINAL_PROJECT_STATES = new Set(['DELIVERED', 'CANCELLED']);
const PROJECT_STATES = [
    'PAID',
    'PLANNING',
    'IN_PROGRESS',
    'QA',
    'CLIENT_REVIEW',
    'APPROVED',
    'DELIVERED',
    'MAINTENANCE',
    'CANCELLED'
];

const LEARNING_STATUSES = ['UNVERIFIED', 'CANDIDATE', 'BENCHMARKED', 'APPROVED', 'ROLLED_BACK'];

export class AutonomousCompanyOrchestrator {
    constructor({ adapters = {}, policy = {}, now = () => new Date() } = {}) {
        this.adapters = adapters;
        this.policy = {
            ownerApprovalRequiredForPayment: policy.ownerApprovalRequiredForPayment !== false,
            ownerApprovalRequiredForProductionDelivery: policy.ownerApprovalRequiredForProductionDelivery !== false,
            minimumQAConfidence: Number.isFinite(policy.minimumQAConfidence) ? policy.minimumQAConfidence : 0.95,
            ...policy
        };
        this.now = now;
    }

    createOpportunity(input = {}) {
        if (!input.leadId) throw new Error('leadId is required');
        return {
            id: input.opportunityId || `opp_${Date.now()}`,
            leadId: input.leadId,
            ownerUserId: input.ownerUserId || null,
            status: 'QUALIFIED',
            serviceId: input.serviceId || null,
            customerContext: input.customerContext || {},
            createdAt: this.now().toISOString()
        };
    }

    generateProposal({ opportunity, proposal, marginAudit }) {
        if (!opportunity || opportunity.status !== 'QUALIFIED') {
            throw new Error('Opportunity must be QUALIFIED before proposal generation');
        }
        if (!marginAudit?.policy_check) throw new Error('Margin audit is required');
        const approvedForProposal = marginAudit.policy_check.is_margin_safe || marginAudit.policy_check.status === 'BLOCKED_REQUIRES_APPROVAL';
        if (!approvedForProposal) throw new Error('Margin policy did not produce a decision');
        return {
            id: proposal?.id || `prop_${Date.now()}`,
            opportunityId: opportunity.id,
            serviceId: opportunity.serviceId,
            terms: proposal?.terms || {},
            marginAudit,
            status: marginAudit.policy_check.is_margin_safe ? 'READY_TO_SEND' : 'APPROVAL_REQUIRED',
            createdAt: this.now().toISOString()
        };
    }

    acceptProposal({ proposal, actor }) {
        if (!proposal || !['READY_TO_SEND', 'ACCEPTED'].includes(proposal.status)) {
            throw new Error('Proposal is not accept-ready');
        }
        if (!actor?.userId) throw new Error('actor.userId is required');
        return { ...proposal, status: 'ACCEPTED', acceptedBy: actor.userId, acceptedAt: this.now().toISOString() };
    }

    recordPaymentEvent(event = {}) {
        if (!event.idempotencyKey) throw new Error('idempotencyKey is required');
        const valid = new Set(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED', 'DISPUTED']);
        if (!valid.has(event.status)) throw new Error(`Unsupported payment status: ${event.status}`);
        return {
            ...event,
            normalized: true,
            recordedAt: this.now().toISOString()
        };
    }

    reconcilePayment({ previousEventIds = [], event }) {
        const duplicate = previousEventIds.includes(event.idempotencyKey);
        if (duplicate) return { status: 'DUPLICATE_IGNORED', event };
        if (event.status !== 'PAID') return { status: 'NOT_SETTLED', event };
        return { status: 'SETTLED', event, nextAction: 'CREATE_PROJECT' };
    }

    createProjectFromSettlement({ settlement, proposal, project }) {
        if (settlement?.status !== 'SETTLED') throw new Error('Verified settlement is required');
        if (proposal?.status !== 'ACCEPTED') throw new Error('Accepted proposal is required');
        return {
            id: project?.id || `prj_${Date.now()}`,
            orderId: settlement.event.orderId || null,
            proposalId: proposal.id,
            title: project?.title || `Delivery for ${proposal.serviceId || 'service'}`,
            state: 'PAID',
            requirements: project?.requirements || {},
            createdAt: this.now().toISOString()
        };
    }

    startPlanning(project, planner = {}) {
        if (project.state !== 'PAID') throw new Error('Project must be PAID before planning');
        return {
            ...project,
            state: 'PLANNING',
            plan: planner.plan || null,
            milestones: planner.milestones || [],
            assignedAgents: planner.assignedAgents || [],
            plannedAt: this.now().toISOString()
        };
    }

    startExecution(project) {
        if (project.state !== 'PLANNING') throw new Error('Project must be PLANNING before execution');
        return { ...project, state: 'IN_PROGRESS', executionStartedAt: this.now().toISOString() };
    }

    recordQA(project, qa = {}) {
        if (project.state !== 'IN_PROGRESS') throw new Error('Project must be IN_PROGRESS before QA');
        const passed = qa.passed === true && Number(qa.confidence ?? 0) >= this.policy.minimumQAConfidence;
        return {
            ...project,
            state: passed ? 'CLIENT_REVIEW' : 'QA',
            qa: {
                passed,
                confidence: Number(qa.confidence ?? 0),
                evidence: qa.evidence || []
            },
            qaAt: this.now().toISOString()
        };
    }

    recordClientAcceptance(project, { approved, actorId, notes = '' } = {}) {
        if (project.state !== 'CLIENT_REVIEW') throw new Error('Project must be in CLIENT_REVIEW');
        if (!actorId) throw new Error('actorId is required');
        if (!approved) return { ...project, state: 'IN_PROGRESS', clientFeedback: notes, clientApprovedAt: null };
        return { ...project, state: 'APPROVED', clientApproval: { actorId, notes, at: this.now().toISOString() } };
    }

    authorizeDelivery(project, { production = true, ownerApproved = false } = {}) {
        if (project.state !== 'APPROVED') throw new Error('Project must be APPROVED before delivery');
        if (production && this.policy.ownerApprovalRequiredForProductionDelivery && !ownerApproved) {
            return { status: 'APPROVAL_REQUIRED', projectId: project.id };
        }
        return { status: 'AUTHORIZED', projectId: project.id };
    }

    recordDelivery(project, { authorization, release = {} } = {}) {
        if (authorization?.status !== 'AUTHORIZED') throw new Error('Delivery authorization is required');
        return {
            ...project,
            state: 'DELIVERED',
            release: {
                version: release.version || null,
                commitSha: release.commitSha || null,
                url: release.url || null,
                evidence: release.evidence || []
            },
            deliveredAt: this.now().toISOString()
        };
    }

    openSupportCase(project, caseInput = {}) {
        if (!['DELIVERED', 'MAINTENANCE'].includes(project.state)) throw new Error('Support is available after delivery');
        return {
            id: caseInput.id || `sup_${Date.now()}`,
            projectId: project.id,
            priority: caseInput.priority || 'medium',
            status: 'OPEN',
            subject: caseInput.subject || 'Customer support request',
            createdAt: this.now().toISOString()
        };
    }

    scheduleRenewal(project, renewal = {}) {
        if (!['DELIVERED', 'MAINTENANCE'].includes(project.state)) throw new Error('Renewal requires a delivered project');
        return {
            projectId: project.id,
            status: 'SCHEDULED',
            dueAt: renewal.dueAt || null,
            offerId: renewal.offerId || null,
            createdAt: this.now().toISOString()
        };
    }

    createLearningCandidate({ outcome, skill }) {
        if (!outcome?.verified) {
            return { status: 'UNVERIFIED', reason: 'Outcome has not been independently verified' };
        }
        return {
            status: 'CANDIDATE',
            skill: {
                name: skill?.name || 'Unnamed skill',
                evidence: outcome.evidence || [],
                successMetrics: outcome.successMetrics || {},
                failureModes: outcome.failureModes || []
            },
            createdAt: this.now().toISOString()
        };
    }

    benchmarkLearningCandidate(candidate, benchmark = {}) {
        if (candidate?.status !== 'CANDIDATE') throw new Error('Learning candidate must be CANDIDATE');
        const passed = benchmark.passed === true;
        return { ...candidate, status: passed ? 'BENCHMARKED' : 'UNVERIFIED', benchmark: benchmark.evidence || {} };
    }

    approveSkill(candidate, actor = {}) {
        if (candidate?.status !== 'BENCHMARKED') throw new Error('Only benchmarked skills can be approved');
        if (!actor.userId) throw new Error('actor.userId is required');
        return { ...candidate, status: 'APPROVED', approvedBy: actor.userId, approvedAt: this.now().toISOString() };
    }

    emitEvent(eventType, payload = {}) {
        return {
            eventId: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            eventType,
            payload,
            occurredAt: this.now().toISOString()
        };
    }
}

export const AUTONOMOUS_PROJECT_STATES = Object.freeze(PROJECT_STATES);
export const LEARNING_PIPELINE_STATUSES = Object.freeze(LEARNING_STATUSES);
