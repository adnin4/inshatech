import assert from 'node:assert/strict';
import { ProductionAdapterRegistry } from '../ai_brain/production_adapter_registry.js';
import { MissionCompletionEngine } from '../ai_brain/mission_completion_engine.js';
import { GenericJsonPaymentAdapter, GenericProjectWorkerAdapter, GenericQaAdapter, GenericDeliveryAdapter, GenericSupportAdapter, GenericNotificationAdapter } from '../ai_brain/mission_provider_adapters.js';

const registry = new ProductionAdapterRegistry();
const engine = new MissionCompletionEngine({ registry, policy: { productionDeliveryNeedsOwner: true, learningApprovalNeedsOwner: true } });

assert.equal(engine.status('PAYMENT', 'stripe').status, 'NOT_CONFIGURED');

const payment = new GenericJsonPaymentAdapter({ checkoutUrl: 'https://example.invalid', webhookSecret: 'sandbox-secret' });
const project = new GenericProjectWorkerAdapter({ endpoint: 'https://example.invalid', token: 'sandbox' });
const qa = new GenericQaAdapter({ endpoint: 'https://example.invalid', token: 'sandbox' });
const delivery = new GenericDeliveryAdapter({ endpoint: 'https://example.invalid', token: 'sandbox' });
const support = new GenericSupportAdapter({ endpoint: 'https://example.invalid', token: 'sandbox' });
const notify = new GenericNotificationAdapter({ endpoint: 'https://example.invalid', token: 'sandbox' });

registry.register('PAYMENT', 'sandbox', payment, { verified: true });
registry.register('PROJECT', 'sandbox', project, { verified: true });
registry.register('QA', 'sandbox', qa, { verified: true });
registry.register('DELIVERY', 'sandbox', delivery, { verified: true });
registry.register('SUPPORT', 'sandbox', support, { verified: true });
registry.register('NOTIFICATION', 'sandbox', notify, { verified: true });

assert.equal(engine.status('PAYMENT', 'sandbox').status, 'LIVE_VERIFIED');
assert.equal((await engine.createCheckout({ provider: 'sandbox', order: { id: 'o1' }, ownerApproved: true })).status, 'CONFIGURED_NOT_VERIFIED');

const denied = await engine.runProjectTask({ provider: 'sandbox', task: { id: 't1', production: true }, ownerApproved: false });
assert.equal(denied.status, 'APPROVAL_REQUIRED');

const qaBlocked = await engine.runQa({ provider: 'sandbox', project: { id: 'p1' }, suite: 'full' });
assert.equal(qaBlocked.status, 'QA_BLOCKED');

const deliveryDenied = await engine.deliver({ provider: 'sandbox', release: { production: true }, ownerApproved: false });
assert.equal(deliveryDenied.status, 'APPROVAL_REQUIRED');

const learning = engine.createLearningCandidate({ verified: true, evidence: ['sandbox-evidence'] }, { name: 'sandbox-skill' });
assert.equal(learning.status, 'CANDIDATE');
const benchmarked = engine.benchmarkSkill(learning, { passed: true, score: 0.99 });
assert.equal(benchmarked.status, 'BENCHMARKED');
assert.equal(engine.approveSkill(benchmarked, { ownerApproved: false }).status, 'APPROVAL_REQUIRED');
assert.equal(engine.approveSkill(benchmarked, { ownerApproved: true, ownerId: 'owner-1' }).status, 'APPROVED');

console.log('FINAL_MISSION_COMPLETION_GATE: PASS');
console.log(JSON.stringify({
  payment: engine.status('PAYMENT', 'sandbox').status,
  projectApprovalGate: denied.status,
  qa: qaBlocked.status,
  deliveryApprovalGate: deliveryDenied.status,
  learning: 'APPROVED_WITH_OWNER'
}, null, 2));
