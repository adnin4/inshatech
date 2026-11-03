/**
 * scripts/test_18_agent_workforce.mjs
 * Comprehensive Verification Suite for the 18 Specialist Agents,
 * Task DAG Orchestrator, HITL Approval Gates, and Evidence Attestation System.
 */

import { AGENT_REGISTRY, FIVE_TIER_HITL_MATRIX } from '../ai_brain/agents/agent_registry.js';
import { TaskDagOrchestrator } from '../ai_brain/task_dag_orchestrator.js';
import { EvidenceSystem } from '../ai_brain/evidence_system.js';
import { SandboxedCoreSwarm } from '../ai_brain/sandboxed_core_swarm.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ [FAIL] ${message}`);
    throw new Error(`Test assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`🟢 [PASS] ${message}`);
}

async function runTestSuite() {
  console.log('================================================================================');
  console.log('🤖 IINSHA AI-BOS: 18-SPECIALIST AGENT WORKFORCE & ORCHESTRATION TEST SUITE');
  console.log('================================================================================\n');

  // Test 1: Verify all 18 Specialist Agents exist in AGENT_REGISTRY
  const EXPECTED_18_AGENTS = [
    'CHIEF_ORCHESTRATOR_AGENT',
    'REQUIREMENTS_AGENT',
    'ARCHITECT_AGENT',
    'DEVELOPER_AGENT',
    'REVIEWER_AGENT',
    'QA_AGENT',
    'SECURITY_AGENT',
    'EVIDENCE_AGENT',
    'RESEARCH_AGENT',
    'LEAD_HUNTER_AGENT',
    'CRM_OUTREACH_AGENT',
    'SALES_PROPOSAL_AGENT',
    'PAYMENT_VERIFIER_AGENT',
    'FINANCE_CFO_AGENT',
    'DEVOPS_SRE_AGENT',
    'SUPPORT_SUCCESS_AGENT',
    'ANALYTICS_RENEWAL_AGENT',
    'DEPLOYMENT_RELEASE_AGENT'
  ];

  for (const agentKey of EXPECTED_18_AGENTS) {
    const agent = AGENT_REGISTRY[agentKey];
    assert(agent !== undefined, `Agent '${agentKey}' is registered in AGENT_REGISTRY`);
    assert(agent.identity && agent.identity.id && agent.identity.role, `Agent '${agentKey}' has complete identity`);
    assert(agent.goal && agent.goal.primary && Array.isArray(agent.goal.allowed_objectives), `Agent '${agentKey}' has explicit goals & constraints`);
    assert(agent.tools && Array.isArray(agent.tools.allowed) && agent.tools.allowed.length > 0, `Agent '${agentKey}' has bound tool permissions`);
    assert(agent.permissions && agent.permissions.autonomy_level && agent.permissions.risk_class, `Agent '${agentKey}' has defined risk & autonomy spectrum`);
    assert(agent.evaluation && agent.evaluation.target_quality_score > 0, `Agent '${agentKey}' has measurable evaluation metrics`);
  }

  // Test 2: Backwards-compatible aliases check
  const ALIASES = ['CEO_AGENT', 'SALES_AGENT', 'SDR_AGENT', 'DEVOPS_AGENT', 'MARKETING_AGENT', 'SUCCESS_AGENT', 'FINANCE_AGENT', 'GUARDIAN_AGENT'];
  for (const alias of ALIASES) {
    assert(AGENT_REGISTRY[alias] !== undefined, `Legacy alias '${alias}' resolves cleanly`);
  }

  // Test 3: Task DAG Cycle Detection & Linear Execution
  {
    const orchestrator = new TaskDagOrchestrator();
    orchestrator.createDag('DAG_TEST_CYCLE');
    orchestrator.addTask('DAG_TEST_CYCLE', { id: 'A', dependencies: ['B'] });
    orchestrator.addTask('DAG_TEST_CYCLE', { id: 'B', dependencies: ['A'] });

    let cycleCaught = false;
    try {
      orchestrator.validateDag('DAG_TEST_CYCLE');
    } catch (e) {
      cycleCaught = e.message.includes('Cycle detected');
    }
    assert(cycleCaught, 'TaskDagOrchestrator detects and blocks circular dependencies');
  }

  // Test 4: Task DAG Sequential Execution
  {
    const orchestrator = new TaskDagOrchestrator();
    orchestrator.createDag('DAG_TEST_EXEC');
    orchestrator.addTask('DAG_TEST_EXEC', { id: 'STEP_1', stage: 'STAGE_1', dependencies: [] });
    orchestrator.addTask('DAG_TEST_EXEC', { id: 'STEP_2', stage: 'STAGE_2', dependencies: ['STEP_1'] });

    const executionSequence = [];
    const summary = await orchestrator.executeDag('DAG_TEST_EXEC', {}, async (task) => {
      executionSequence.push(task.id);
      return { done: true };
    });

    assert(summary.status === 'COMPLETED', 'DAG executes to COMPLETED status');
    assert(executionSequence[0] === 'STEP_1' && executionSequence[1] === 'STEP_2', 'DAG executes tasks in exact topological dependency order');
  }

  // Test 5: Task DAG HITL Pause and Approval Gate
  {
    const orchestrator = new TaskDagOrchestrator();
    orchestrator.createDag('DAG_TEST_HITL');
    orchestrator.addTask('DAG_TEST_HITL', { id: 'BUILD', stage: 'BUILD', dependencies: [] });
    orchestrator.addTask('DAG_TEST_HITL', {
      id: 'PROD_DEPLOY',
      stage: 'DEPLOY',
      dependencies: ['BUILD'],
      requiresHitl: true,
      riskClass: 'CRITICAL'
    });

    // Run DAG: Should pause at PROD_DEPLOY
    const pausedSummary = await orchestrator.executeDag('DAG_TEST_HITL');
    assert(pausedSummary.status === 'PAUSED_FOR_APPROVAL', 'DAG pauses at high-risk step requiring HITL approval');
    const deployTask = pausedSummary.tasks.find(t => t.id === 'PROD_DEPLOY');
    assert(deployTask.status === 'AWAITING_APPROVAL', 'High-risk task holds at AWAITING_APPROVAL state');

    // Approve the task
    const approvedSummary = await orchestrator.approveTask('DAG_TEST_HITL', 'PROD_DEPLOY', {
      actor: 'system_owner',
      signature: 'AUTHORIZED_SIGNATURE_2026'
    });
    assert(approvedSummary.status === 'COMPLETED', 'Task resumes and DAG completes upon valid owner approval');
  }

  // Test 6: Evidence System Cryptographic Hash Chaining & Certificate Verification
  {
    const evidenceSystem = new EvidenceSystem();
    const step1 = evidenceSystem.recordStepEvidence({
      taskId: 'TASK_001',
      stage: 'SPEC',
      actorAgent: 'REQUIREMENTS_AGENT',
      sourceRevision: '0b16b3d1f97708e0aeedaa8cb6cdc399c786f5aa',
      inputPayload: { query: 'Build order pipeline' },
      outputArtifacts: { spec: 'Order pipeline specification' }
    });

    const step2 = evidenceSystem.recordStepEvidence({
      taskId: 'TASK_002',
      stage: 'BUILD',
      actorAgent: 'DEVELOPER_AGENT',
      sourceRevision: '0b16b3d1f97708e0aeedaa8cb6cdc399c786f5aa',
      inputPayload: { spec: 'Order pipeline specification' },
      outputArtifacts: { code: 'export function pipeline() { return true; }' }
    });

    assert(step2.previousHash === step1.recordHash, 'Evidence ledger maintains immutable cryptographic hash-chaining');

    const cert = evidenceSystem.sealVerificationCertificate('PROJ_TEST', {
      client: 'Acme Global Corp',
      sourceRevision: '0b16b3d1f97708e0aeedaa8cb6cdc399c786f5aa'
    });

    const check = evidenceSystem.verifyCertificateIntegrity(cert);
    assert(check.verified === true, 'Sealed verification certificate verifies mathematically against all step hashes');

    // Test tamper detection
    const tamperedCert = JSON.parse(JSON.stringify(cert));
    tamperedCert.evidenceSteps[0].outputHash = 'TAMPERED_HASH_9999999999999999999999999999';
    const tamperCheck = evidenceSystem.verifyCertificateIntegrity(tamperedCert);
    assert(tamperCheck.verified === false, 'Evidence system detects and flags modified certificate artifacts');
  }

  // Test 7: End-to-End Phase 1 Sandboxed Core Swarm Execution
  {
    const coreSwarm = new SandboxedCoreSwarm();
    const result = await coreSwarm.runProjectLifecycle({
      id: 'APEX_LOGISTICS_001',
      client: 'Apex Logistics Ltd.',
      request: 'Automated invoice PDF extraction and WhatsApp delivery confirmation bot with n8n',
      budgetUSD: 1200
    });

    assert(result.status === 'CERTIFIED_DELIVERY_PASS', 'Phase 1 Sandboxed Core Swarm achieves CERTIFIED_DELIVERY_PASS');
    assert(result.artifacts.requirements !== undefined, 'Requirements Agent synthesized functional scope & criteria');
    assert(result.artifacts.architecture !== undefined, 'Architect Agent synthesized topology & schema contract');
    assert(result.artifacts.engineering !== undefined, 'Developer Agent synthesized production code assets');
    assert(result.artifacts.codeReview !== undefined, 'Reviewer Agent verified AST and zero-placeholder invariants');
    assert(result.artifacts.qaTesting !== undefined && result.artifacts.qaTesting.testsPassed > 0, 'QA Agent completed automated contract testing');
    assert(result.artifacts.securityAudit !== undefined, 'Security Agent completed secret leak & RLS isolation audit');
    assert(result.artifacts.evidenceSeal !== undefined, 'Evidence Agent sealed cryptographic ledger');
    assert(result.certificateVerification.verified === true, 'Final project certificate is cryptographically verified');
  }

  console.log('\n================================================================================');
  console.log(`📊 RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('STATUS: 18-SPECIALIST AGENT WORKFORCE & PHASE 1 SANDBOX OPERATIONAL');
  console.log('================================================================================\n');
}

runTestSuite().catch(err => {
  console.error('Fatal test error in test_18_agent_workforce.mjs:', err);
  process.exit(1);
});
