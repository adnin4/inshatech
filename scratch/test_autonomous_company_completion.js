import assert from 'node:assert/strict';
import { AutonomousCompanyOrchestrator } from '../ai_brain/autonomous_company_completion.js';

const fixedNow = () => new Date('2026-08-23T00:00:00.000Z');
const engine = new AutonomousCompanyOrchestrator({
  now: fixedNow,
  policy: { minimumQAConfidence: 0.95, ownerApprovalRequiredForProductionDelivery: true }
});

const opportunity = engine.createOpportunity({
  leadId: 'lead-real-1',
  ownerUserId: 'owner-1',
  serviceId: 'service-ai-automation'
});
assert.equal(opportunity.status, 'QUALIFIED');

const proposal = engine.generateProposal({
  opportunity,
  proposal: { terms: { price: 1000, currency: 'USD' } },
  marginAudit: { policy_check: { is_margin_safe: true, status: 'APPROVED_AUTONOMOUS' } }
});
assert.equal(proposal.status, 'READY_TO_SEND');

const accepted = engine.acceptProposal({ proposal, actor: { userId: 'customer-1' } });
assert.equal(accepted.status, 'ACCEPTED');

const payment = engine.recordPaymentEvent({
  provider: 'SANDBOX',
  idempotencyKey: 'pay-001',
  orderId: 'order-1',
  status: 'PAID'
});

const settlement = engine.reconcilePayment({ previousEventIds: [], event: payment });
assert.equal(settlement.status, 'SETTLED');

const duplicate = engine.reconcilePayment({ previousEventIds: ['pay-001'], event: payment });
assert.equal(duplicate.status, 'DUPLICATE_IGNORED');

const project = engine.createProjectFromSettlement({
  settlement,
  proposal: accepted,
  project: { title: 'AI Automation Delivery', requirements: { source: 'verified' } }
});
assert.equal(project.state, 'PAID');

const planned = engine.startPlanning(project, {
  plan: { milestones: ['build', 'qa', 'delivery'] },
  milestones: ['build', 'qa', 'delivery'],
  assignedAgents: ['AG-ARCH', 'AG-DEV', 'AG-QA']
});
assert.equal(planned.state, 'PLANNING');

const executing = engine.startExecution(planned);
assert.equal(executing.state, 'IN_PROGRESS');

const qaPending = engine.recordQA(executing, { passed: true, confidence: 0.91, evidence: ['qa-run-1'] });
assert.equal(qaPending.state, 'QA');

const qaPassed = engine.recordQA(executing, { passed: true, confidence: 0.99, evidence: ['qa-run-2'] });
assert.equal(qaPassed.state, 'CLIENT_REVIEW');

const acceptedProject = engine.recordClientAcceptance(qaPassed, {
  approved: true,
  actorId: 'customer-1',
  notes: 'Approved'
});
assert.equal(acceptedProject.state, 'APPROVED');

const blockedDelivery = engine.authorizeDelivery(acceptedProject, { production: true, ownerApproved: false });
assert.equal(blockedDelivery.status, 'APPROVAL_REQUIRED');

const deliveryAuth = engine.authorizeDelivery(acceptedProject, { production: true, ownerApproved: true });
assert.equal(deliveryAuth.status, 'AUTHORIZED');

const delivered = engine.recordDelivery(acceptedProject, {
  authorization: deliveryAuth,
  release: { version: '2026.08.23.1', commitSha: 'sandbox-sha', url: 'https://preview.example.test', evidence: ['deploy-1'] }
});
assert.equal(delivered.state, 'DELIVERED');

const support = engine.openSupportCase(delivered, { subject: 'Post-delivery support' });
assert.equal(support.status, 'OPEN');

const renewal = engine.scheduleRenewal(delivered, { offerId: 'offer-1', dueAt: '2026-09-23T00:00:00.000Z' });
assert.equal(renewal.status, 'SCHEDULED');

const learningCandidate = engine.createLearningCandidate({
  outcome: { verified: true, evidence: ['customer-accepted'], successMetrics: { qa: 1 }, failureModes: [] },
  skill: { name: 'AI Automation Delivery' }
});
assert.equal(learningCandidate.status, 'CANDIDATE');

const benchmarked = engine.benchmarkLearningCandidate(learningCandidate, { passed: true, evidence: { benchmark: 0.98 } });
assert.equal(benchmarked.status, 'BENCHMARKED');

const approvedSkill = engine.approveSkill(benchmarked, { userId: 'owner-1' });
assert.equal(approvedSkill.status, 'APPROVED');

const event = engine.emitEvent('delivery.completed', { projectId: delivered.id });
assert.equal(event.eventType, 'delivery.completed');

console.log('AUTONOMOUS_COMPANY_COMPLETION: PASS');
console.log(JSON.stringify({
  opportunity: opportunity.status,
  proposal: accepted.status,
  payment: settlement.status,
  project: delivered.state,
  support: support.status,
  renewal: renewal.status,
  learning: approvedSkill.status
}, null, 2));
