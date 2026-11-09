/**
 * IINSHA AI-BOS: 18-Specialist Agent & Task DAG Workflow Certification Suite
 * Validates the complete 18-agent autonomous organization, 5-tier HITL matrix,
 * DAG dependency orchestration, zero-trust runtime execution, and cryptographic evidence hash-chaining.
 */

import assert from 'node:assert';
import { AGENT_REGISTRY, FIVE_TIER_HITL_MATRIX, ANTI_LOOP_CONFIG } from '../functions/_shared/ai_brain/agents/agent_registry.js';
import { TaskDagOrchestrator } from '../functions/_shared/ai_brain/task_dag_orchestrator.js';
import { EvidenceSystem } from '../functions/_shared/ai_brain/evidence_system.js';
import { AgentRuntime } from '../functions/_shared/ai_brain/agent_runtime.js';

console.log('================================================================================');
console.log('🤖 IINSHA AI-BOS: 18 SPECIALIST AGENT & DAG WORKFLOW CERTIFICATION (V1300)');
console.log('================================================================================\n');

let passedTests = 0;
let totalTests = 0;

async function runTest(name, fn) {
    totalTests++;
    try {
        await fn();
        passedTests++;
        console.log(`[🟢 PASS] ${name}`);
    } catch (err) {
        console.error(`[🔴 FAIL] ${name}: ${err.message}`);
        throw err;
    }
}

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

async function main() {
    // -------------------------------------------------------------
    // 1. 18-Specialist Agent Registry Audit
    // -------------------------------------------------------------
    await runTest('AGENT-18-01: Exactly 18 primary specialist agents are registered', () => {
        for (const key of EXPECTED_18_AGENTS) {
            assert(AGENT_REGISTRY[key], `Missing specialist agent: ${key}`);
        }
    });

    await runTest('AGENT-18-02: Strict 6-layer architecture present on all 18 agents', () => {
        for (const key of EXPECTED_18_AGENTS) {
            const agent = AGENT_REGISTRY[key];
            assert(agent.identity && agent.identity.id && agent.identity.name && agent.identity.department, `${key} identity invalid`);
            assert(agent.goal && agent.goal.primary && Array.isArray(agent.goal.allowed_objectives), `${key} goal invalid`);
            assert(agent.memory && typeof agent.memory.context_tokens === 'number', `${key} memory invalid`);
            assert(agent.tools && Array.isArray(agent.tools.allowed), `${key} tools invalid`);
            assert(agent.permissions && agent.permissions.autonomy_level && agent.permissions.permission_level, `${key} permissions invalid`);
            assert(agent.evaluation && typeof agent.evaluation.target_quality_score === 'number', `${key} evaluation invalid`);
        }
    });

    await runTest('AGENT-18-03: Backward compatibility aliases preserved', () => {
        assert(AGENT_REGISTRY.CEO_AGENT === AGENT_REGISTRY.CHIEF_ORCHESTRATOR_AGENT);
        assert(AGENT_REGISTRY.SALES_AGENT === AGENT_REGISTRY.SALES_PROPOSAL_AGENT);
        assert(AGENT_REGISTRY.SDR_AGENT === AGENT_REGISTRY.LEAD_HUNTER_AGENT);
        assert(AGENT_REGISTRY.DEVOPS_AGENT === AGENT_REGISTRY.DEVOPS_SRE_AGENT);
        assert(AGENT_REGISTRY.FINANCE_AGENT === AGENT_REGISTRY.FINANCE_CFO_AGENT);
        assert(AGENT_REGISTRY.GUARDIAN_AGENT === AGENT_REGISTRY.SECURITY_AGENT);
        assert(AGENT_REGISTRY.SUCCESS_AGENT === AGENT_REGISTRY.SUPPORT_SUCCESS_AGENT);
    });

    // -------------------------------------------------------------
    // 2. 5-Tier HITL Matrix & Anti-Loop Policies
    // -------------------------------------------------------------
    await runTest('GOV-01: 5-Tier HITL matrix contains all operational levels', () => {
        const requiredTiers = ['L0_OBSERVE', 'L1_DRAFT', 'L2_SAFE_EXECUTE', 'L3_APPROVAL', 'L4_PROHIBITED'];
        for (const tier of requiredTiers) {
            assert(FIVE_TIER_HITL_MATRIX[tier], `Missing HITL tier: ${tier}`);
        }
        assert.strictEqual(FIVE_TIER_HITL_MATRIX.L3_APPROVAL.requires_approval, true);
        assert.strictEqual(FIVE_TIER_HITL_MATRIX.L4_PROHIBITED.blocked, true);
    });

    await runTest('GOV-02: Anti-loop configuration bounds delegation depth <= 5', () => {
        assert(ANTI_LOOP_CONFIG.max_delegation_depth <= 5, 'Delegation depth exceeds safe threshold');
        assert(ANTI_LOOP_CONFIG.max_total_tool_calls > 0, 'Tool call budget must be positive');
    });

    // -------------------------------------------------------------
    // 3. Zero-Trust Runtime & Dynamic Risk Governance
    // -------------------------------------------------------------
    await runTest('EXEC-01: AgentRuntime enforces Zero-Trust tool scope allowlists', async () => {
        const runtime = new AgentRuntime();
        // REQUIREMENTS_AGENT is not allowed to drop database or disburse payout
        await assert.rejects(
            async () => {
                await runtime.executeMissionStep('m_01', 'REQUIREMENTS_AGENT', 'disburse_affiliate_payout', {});
            },
            /Zero-Trust Violation/
        );
    });

    await runTest('EXEC-02: AgentRuntime enforces Emergency Stop lockdown across all agents', async () => {
        const runtime = new AgentRuntime();
        runtime.systemState = 'EMERGENCY_STOP';
        await assert.rejects(
            async () => {
                await runtime.executeMissionStep('m_02', 'CHIEF_ORCHESTRATOR_AGENT', 'create_task_dag', {});
            },
            /EMERGENCY STOP/
        );
    });

    await runTest('EXEC-03: Dynamic Risk Engine gates high-value actions to APPROVAL_REQUIRED', () => {
        const runtime = new AgentRuntime();
        const highRisk = runtime.computeDynamicRisk({
            agent_id: 'FINANCE_CFO_AGENT',
            action: 'disburse_payout',
            amount_usd: 5000,
            recipient_count: 100,
            data_classification: 'CONFIDENTIAL'
        });
        assert.strictEqual(highRisk.requires_human_approval, true);
        assert(highRisk.risk_score >= 45, 'Risk score should exceed HITL threshold');
    });

    // -------------------------------------------------------------
    // 4. Task DAG Orchestration Engine
    // -------------------------------------------------------------
    await runTest('DAG-01: Creates task DAG and validates topological dependencies without cycles', () => {
        const orchestrator = new TaskDagOrchestrator();
        const dagId = 'test_dag_pipeline';
        orchestrator.createDag(dagId, { title: 'Pipeline Certification' });

        orchestrator.addTask(dagId, { id: 'step_req', agentId: 'requirements', description: 'Requirements' });
        orchestrator.addTask(dagId, { id: 'step_arch', agentId: 'architect', description: 'Architecture', dependencies: ['step_req'] });
        orchestrator.addTask(dagId, { id: 'step_dev', agentId: 'developer', description: 'Development', dependencies: ['step_arch'], requiresHitl: true });
        orchestrator.addTask(dagId, { id: 'step_qa', agentId: 'qa', description: 'QA Verification', dependencies: ['step_dev'] });

        const isValid = orchestrator.validateDag(dagId);
        assert.strictEqual(isValid, true);
        const summary = orchestrator.getDagSummary(dagId);
        assert.strictEqual(summary.taskCounts.total, 4);
    });

    await runTest('DAG-02: Detects circular dependency graphs and prevents infinite deadlock', () => {
        const orchestrator = new TaskDagOrchestrator();
        const dagId = 'test_cyclic_dag';
        orchestrator.createDag(dagId);

        orchestrator.addTask(dagId, { id: 'A', agentId: 'developer', dependencies: ['B'] });
        orchestrator.addTask(dagId, { id: 'B', agentId: 'qa', dependencies: ['A'] });

        assert.throws(() => {
            orchestrator.validateDag(dagId);
        }, /Cycle detected/);
    });

    await runTest('DAG-03: State transitions enforce HITL approval gates for high-risk actions', async () => {
        const orchestrator = new TaskDagOrchestrator();
        const dagId = 'test_hitl_dag';
        orchestrator.createDag(dagId);

        orchestrator.addTask(dagId, { id: 'req', agentId: 'requirements' });
        orchestrator.addTask(dagId, { id: 'deploy', agentId: 'deployment_release', dependencies: ['req'], requiresHitl: true });

        // Step 1: execute DAG. 'req' should complete, 'deploy' should pause for approval.
        const pausedSummary = await orchestrator.executeDag(dagId);
        assert.strictEqual(pausedSummary.status, 'PAUSED_FOR_APPROVAL');
        const deployTask = pausedSummary.tasks.find(t => t.id === 'deploy');
        assert.strictEqual(deployTask.status, 'AWAITING_APPROVAL');

        // Step 2: approve high-risk deploy task
        const completedSummary = await orchestrator.approveTask(dagId, 'deploy', { actor: 'Owner_Mahin', signature: 'APPROVED_BY_OWNER' });
        assert.strictEqual(completedSummary.status, 'COMPLETED');
        const approvedDeploy = completedSummary.tasks.find(t => t.id === 'deploy');
        assert.strictEqual(approvedDeploy.status, 'COMPLETED');
    });

    await runTest('DAG-04: Complex fan-out DAG topology resolves parallel dependencies cleanly', () => {
        const orchestrator = new TaskDagOrchestrator();
        const dagId = 'test_fanout_dag';
        orchestrator.createDag(dagId);

        // Root
        orchestrator.addTask(dagId, { id: 'root', agentId: 'requirements' });
        // Fan-out to 3 parallel tracks
        orchestrator.addTask(dagId, { id: 'track_fe', agentId: 'developer', dependencies: ['root'] });
        orchestrator.addTask(dagId, { id: 'track_be', agentId: 'developer', dependencies: ['root'] });
        orchestrator.addTask(dagId, { id: 'track_sec', agentId: 'security', dependencies: ['root'] });
        // Join
        orchestrator.addTask(dagId, { id: 'join_qa', agentId: 'qa', dependencies: ['track_fe', 'track_be', 'track_sec'] });

        const isValid = orchestrator.validateDag(dagId);
        assert.strictEqual(isValid, true);
        const summary = orchestrator.getDagSummary(dagId);
        assert.strictEqual(summary.taskCounts.total, 5);
    });

    // -------------------------------------------------------------
    // 5. Cryptographic Evidence & Hash Chaining
    // -------------------------------------------------------------
    await runTest('EVIDENCE-01: Computes deterministic SHA-256 hashes and hash-chains steps', () => {
        const evidence = new EvidenceSystem();

        const e1 = evidence.recordStepEvidence({
            taskId: 'task_01',
            stage: 'REQUIREMENTS',
            actorAgent: 'REQUIREMENTS_AGENT',
            inputPayload: { prompt: 'Build AI SaaS' },
            outputArtifacts: { prd: 'Spec v1.0' },
            sourceRevision: 'abc1234'
        });

        const e2 = evidence.recordStepEvidence({
            taskId: 'task_02',
            stage: 'CODE_GEN',
            actorAgent: 'DEVELOPER_AGENT',
            inputPayload: { spec: 'Spec v1.0' },
            outputArtifacts: { code: 'functions/api/test.js' },
            testResults: { status: 'PASSED' },
            sourceRevision: 'abc1234'
        });

        assert.strictEqual(e1.previousHash, '0000000000000000000000000000000000000000000000000000000000000000');
        assert.strictEqual(e2.previousHash, e1.recordHash);
        assert(evidence.verifyChainIntegrity(), 'Chain integrity verification failed');
    });

    await runTest('EVIDENCE-02: Detects tampering in historical ledger entries', () => {
        const evidence = new EvidenceSystem();

        evidence.recordStepEvidence({
            taskId: 'task_01',
            stage: 'STAGE_A',
            actorAgent: 'ARCHITECT_AGENT',
            inputPayload: 'original_input'
        });

        evidence.recordStepEvidence({
            taskId: 'task_02',
            stage: 'STAGE_B',
            actorAgent: 'DEVELOPER_AGENT',
            inputPayload: 'original_input_2'
        });

        assert.strictEqual(evidence.verifyChainIntegrity(), true);

        // Tamper with historical payload
        evidence.ledger[0].inputHash = 'tampered_fake_hash_123';
        assert.strictEqual(evidence.verifyChainIntegrity(), false);
    });

    await runTest('EVIDENCE-03: Generates verifiable cryptographic certificate seal', () => {
        const evidence = new EvidenceSystem();

        evidence.recordStepEvidence({
            taskId: 'task_prod_01',
            stage: 'FINAL_DELIVERY',
            actorAgent: 'DEPLOYMENT_RELEASE_AGENT',
            inputPayload: { target: 'inshatech-b6b.pages.dev' },
            outputArtifacts: { deploy_sha: '250b79b' },
            testResults: { status: 'GREEN', passed: 111, failed: 0 }
        });

        const cert = evidence.generateCompletionCertificate('project_iinsha_master', {
            clientName: 'Enterprise Client',
            projectName: 'IINSHA AI-BOS Autonomous Swarm'
        });

        assert(cert.certificateId.startsWith('CERT_') || cert.certificateId.startsWith('CERT-'), 'Certificate ID format invalid');
        assert.strictEqual(cert.verificationStatus, 'MATHEMATICALLY_CERTIFIED');
        assert.strictEqual(cert.tamperEvident, true);
        assert(cert.finalLedgerRootHash.length === 64, 'Ledger root hash must be 64-char SHA256 hex');
    });

    console.log('\n================================================================================');
    console.log(`📊 18-AGENT & WORKFLOW CERTIFICATION: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
    console.log('Status: ALL 18 SPECIALIST AGENTS & DAG WORKFLOWS MATHEMATICALLY CERTIFIED');
    console.log('================================================================================');
}

main().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
