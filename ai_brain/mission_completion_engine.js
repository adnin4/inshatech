/**
 * IINSHA AI-BOS — Mission Completion Engine
 *
 * Orchestrates the final autonomous-company lifecycle using explicit adapters.
 * It never performs an external side effect unless the corresponding adapter is
 * verified and the action policy allows it.
 */

const FINAL_STATES = new Set(['DELIVERED', 'CANCELLED']);

export const MISSION_STATUS = Object.freeze({
  NOT_CONFIGURED: 'NOT_CONFIGURED',
  READY: 'READY',
  RUNNING: 'RUNNING',
  APPROVAL_REQUIRED: 'APPROVAL_REQUIRED',
  FAILED: 'FAILED',
  COMPLETED: 'COMPLETED'
});

export class MissionCompletionEngine {
  constructor({ registry, now = () => new Date(), policy = {} } = {}) {
    if (!registry) throw new Error('ProductionAdapterRegistry is required');
    this.registry = registry;
    this.now = now;
    this.policy = {
      minQaConfidence: Number.isFinite(policy.minQaConfidence) ? policy.minQaConfidence : 0.95,
      productionDeliveryNeedsOwner: policy.productionDeliveryNeedsOwner !== false,
      learningApprovalNeedsOwner: policy.learningApprovalNeedsOwner !== false,
      ...policy
    };
  }

  status(type, provider) {
    return this.registry.status(type, provider);
  }

  async createCheckout({ provider, order, ownerApproved = false } = {}) {
    const adapter = this.registry.assertVerified('PAYMENT', provider);
    if (this.policy.paymentNeedsOwner && !ownerApproved) {
      return { status: MISSION_STATUS.APPROVAL_REQUIRED, reason: 'OWNER_APPROVAL_REQUIRED' };
    }
    const result = await adapter.createCheckout(order);
    return { status: result?.status || 'CHECKOUT_CREATED', provider, result };
  }

  async verifyAndReconcilePayment({ provider, event, previousEventIds = [] } = {}) {
    if (!event?.idempotencyKey) throw new Error('idempotencyKey is required');
    if (previousEventIds.includes(event.idempotencyKey)) {
      return { status: 'DUPLICATE_IGNORED', idempotencyKey: event.idempotencyKey };
    }
    const adapter = this.registry.assertVerified('PAYMENT', provider);
    const verification = await adapter.verifyWebhook(event);
    if (!verification?.verified) return { status: 'WEBHOOK_REJECTED', verification };
    const reconciliation = await adapter.reconcile(event);
    return {
      status: reconciliation?.status === 'PAID' ? 'SETTLED' : 'NOT_SETTLED',
      verification,
      reconciliation
    };
  }

  async createWorkspace({ provider, project } = {}) {
    const adapter = this.registry.assertVerified('PROJECT', provider);
    return adapter.createWorkspace(project);
  }

  async runProjectTask({ provider, task, ownerApproved = false } = {}) {
    const adapter = this.registry.assertVerified('PROJECT', provider);
    if (task?.production && !ownerApproved) {
      return { status: MISSION_STATUS.APPROVAL_REQUIRED, reason: 'OWNER_APPROVAL_REQUIRED' };
    }
    return adapter.runTask(task);
  }

  async runQa({ provider, project, suite } = {}) {
    const adapter = this.registry.assertVerified('QA', provider);
    const result = await adapter.runSuite({ project, suite });
    const confidence = Number(result?.confidence ?? 0);
    const passed = result?.passed === true && confidence >= this.policy.minQaConfidence;
    return { ...result, passed, status: passed ? 'QA_PASSED' : 'QA_BLOCKED' };
  }

  async deliver({ provider, release, ownerApproved = false } = {}) {
    const adapter = this.registry.assertVerified('DELIVERY', provider);
    if (release?.production && this.policy.productionDeliveryNeedsOwner && !ownerApproved) {
      return { status: MISSION_STATUS.APPROVAL_REQUIRED, reason: 'OWNER_APPROVAL_REQUIRED' };
    }
    return adapter.deploy(release);
  }

  async rollback({ provider, release } = {}) {
    const adapter = this.registry.assertVerified('DELIVERY', provider);
    return adapter.rollback(release);
  }

  async notify({ provider, notification } = {}) {
    const adapter = this.registry.assertVerified('NOTIFICATION', provider);
    return adapter.send(notification);
  }

  async openSupport({ provider, supportCase } = {}) {
    const adapter = this.registry.assertVerified('SUPPORT', provider);
    return adapter.createCase(supportCase);
  }

  async supportNotify({ provider, message } = {}) {
    const adapter = this.registry.assertVerified('SUPPORT', provider);
    return adapter.notify(message);
  }

  async saveOpportunity({ provider, opportunity } = {}) {
    const adapter = this.registry.assertVerified('CRM', provider);
    return adapter.upsertOpportunity(opportunity);
  }

  async saveProposal({ provider, proposal } = {}) {
    const adapter = this.registry.assertVerified('CRM', provider);
    return adapter.saveProposal(proposal);
  }

  createLearningCandidate({ outcome, skill }) {
    if (!outcome?.verified) {
      return { status: 'UNVERIFIED', reason: 'Verified outcome evidence is required' };
    }
    return {
      status: 'CANDIDATE',
      skill: skill || {},
      evidence: outcome.evidence || [],
      metrics: outcome.metrics || {},
      createdAt: this.now().toISOString()
    };
  }

  benchmarkSkill(candidate, benchmark) {
    if (candidate?.status !== 'CANDIDATE') throw new Error('Only CANDIDATE skills can be benchmarked');
    const passed = benchmark?.passed === true;
    return {
      ...candidate,
      status: passed ? 'BENCHMARKED' : 'UNVERIFIED',
      benchmark: benchmark || null
    };
  }

  approveSkill(candidate, { ownerApproved = false, ownerId = null } = {}) {
    if (candidate?.status !== 'BENCHMARKED') throw new Error('Only BENCHMARKED skills can be approved');
    if (this.policy.learningApprovalNeedsOwner && !ownerApproved) {
      return { ...candidate, status: 'APPROVAL_REQUIRED' };
    }
    return {
      ...candidate,
      status: 'APPROVED',
      approvedBy: ownerId,
      approvedAt: this.now().toISOString()
    };
  }

  classifyFinalState(state) {
    return FINAL_STATES.has(state) ? 'TERMINAL' : 'ACTIVE';
  }
}
