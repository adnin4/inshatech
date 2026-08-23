import assert from 'node:assert/strict';
import test from 'node:test';
import { AutonomousCompanyOrchestrator } from '../ai_brain/autonomous_company_completion.js';

test('real-world lifecycle is fail-closed and ordered', () => {
  const now = () => new Date('2026-08-23T00:00:00.000Z');
  const os = new AutonomousCompanyOrchestrator({ now, policy: { minimumQAConfidence: 0.95 } });

  const opportunity = os.createOpportunity({ leadId: 'lead_real_1', serviceId: 'svc_1', ownerUserId: 'owner_1' });
  const proposal = os.generateProposal({
    opportunity,
    proposal: { terms: { priceUSD: 1000 } },
    marginAudit: { policy_check: { is_margin_safe: true, status: 'SAFE' } }
  });
  assert.equal(proposal.status, 'READY_TO_SEND');

  const accepted = os.acceptProposal({ proposal, actor: { userId: 'customer_1' } });
  const payment = os.recordPaymentEvent({ idempotencyKey: 'pay_1', status: 'PAID', orderId: 'order_1' });
  const settlement = os.reconcilePayment({ previousEventIds: [], event: payment });
  assert.equal(settlement.status, 'SETTLED');

  const project = os.createProjectFromSettlement({ settlement, proposal });
  const planned = os.startPlanning(project, { plan: ['build', 'test'], assignedAgents: ['architect', 'engineer'] });
  const running = os.startExecution(planned);
  const qa = os.recordQA(running, { passed: true, confidence: 0.99, evidence: ['qa-evidence-1'] });
  assert.equal(qa.state, 'CLIENT_REVIEW');

  const approved = os.recordClientAcceptance(qa, { approved: true, actorId: 'customer_1' });
  const blocked = os.authorizeDelivery(approved, { production: true, ownerApproved: false });
  assert.equal(blocked.status, 'APPROVAL_REQUIRED');

  const authorized = os.authorizeDelivery(approved, { production: true, ownerApproved: true });
  const delivered = os.recordDelivery(approved, {
    authorization: authorized,
    release: { version: 'v1.0.0', commitSha: 'abc123', url: 'https://example.invalid', evidence: ['deploy-evidence-1'] }
  });
  assert.equal(delivered.state, 'DELIVERED');

  const learning = os.createLearningCandidate({
    outcome: { verified: true, evidence: ['outcome-1'], successMetrics: { qaPassRate: 1 }, failureModes: [] },
    skill: { name: 'verified-delivery-workflow' }
  });
  const benchmarked = os.benchmarkLearningCandidate(learning, { passed: true, evidence: { suite: 'golden-1' } });
  const approvedSkill = os.approveSkill(benchmarked, { userId: 'owner_1' });
  assert.equal(approvedSkill.status, 'APPROVED');
});

test('failed QA cannot advance to client review', () => {
  const os = new AutonomousCompanyOrchestrator();
  const opportunity = os.createOpportunity({ leadId: 'lead_real_2' });
  const proposal = os.generateProposal({ opportunity, marginAudit: { policy_check: { is_margin_safe: true } } });
  const accepted = os.acceptProposal({ proposal, actor: { userId: 'customer_2' } });
  const payment = os.recordPaymentEvent({ idempotencyKey: 'pay_2', status: 'PAID' });
  const project = os.createProjectFromSettlement({ settlement: os.reconcilePayment({ event: payment }), proposal: accepted });
  const running = os.startExecution(os.startPlanning(project));
  const qa = os.recordQA(running, { passed: false, confidence: 0.50 });
  assert.equal(qa.state, 'QA');
});
