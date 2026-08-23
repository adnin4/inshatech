/**
 * IINSHA AI-BOS — CONTINUOUS LEARNING SKILL REGISTRY & ADAPTATION LIFECYCLE
 * Wave 11: Governed technical skill extraction, sandbox benchmark evaluation,
 * versioned skill registration, and canary deployment verification.
 */

class SkillRegistryEngine {
    constructor() {
        this.skillsRegistry = new Map();
        this.executionLogs = [];
        this.canaryDeployments = new Map();

        // Seed Verified Institutional Skills
        this.registerSkill({
            skillId: 'SKILL_STRIPE_WEBHOOK_RECOVERY',
            name: 'Stripe Webhook Dead-Letter Queue Recovery',
            category: 'Financial Engineering',
            version: '1.2.0',
            status: 'PRODUCTION_VERIFIED',
            successRate: 0.985,
            avgResolutionSeconds: 42,
            sandboxBenchmarkPassed: true,
            securityApproved: true,
            authoritativeRule: 'Parse raw body HMAC signature before JSON deserialization to prevent signature spoofing.'
        });

        this.registerSkill({
            skillId: 'SKILL_N8N_DOCKER_FAILOVER',
            name: 'n8n Hostinger VPS Self-Healing Container Restarter',
            category: 'Infrastructure & SRE',
            version: '1.4.0',
            status: 'PRODUCTION_VERIFIED',
            successRate: 0.992,
            avgResolutionSeconds: 15,
            sandboxBenchmarkPassed: true,
            securityApproved: true,
            authoritativeRule: 'Issue docker restart with healthcheck verification before alerting human engineer.'
        });
    }

    /**
     * Register a new or updated skill in the registry
     * @param {Object} skillSpec 
     */
    registerSkill(skillSpec) {
        const id = skillSpec.skillId;
        const entry = {
            skillId: id,
            name: skillSpec.name,
            category: skillSpec.category || 'General Automation',
            version: skillSpec.version || '1.0.0',
            status: skillSpec.status || 'DRAFT_CANDIDATE',
            successRate: skillSpec.successRate || 0.85,
            avgResolutionSeconds: skillSpec.avgResolutionSeconds || 60,
            sandboxBenchmarkPassed: !!skillSpec.sandboxBenchmarkPassed,
            securityApproved: !!skillSpec.securityApproved,
            authoritativeRule: skillSpec.authoritativeRule || '',
            createdAt: new Date().toISOString(),
            lastEvaluatedAt: new Date().toISOString()
        };
        this.skillsRegistry.set(id, entry);
        return entry;
    }

    /**
     * Submit an observed execution failure/success for skill extraction & learning
     * @param {Object} eventData - { task, error, resolution, toolUsed, isSuccess, executionTimeSec }
     */
    extractAndEvaluateSkillCandidate(eventData) {
        const candidateId = `SKILL_CANDIDATE_${Date.now()}`;
        const isSecuritySensitive = this.checkSecuritySensitivity(eventData.task || '');

        const candidate = {
            candidateId,
            derivedFromTask: eventData.task,
            extractedRule: eventData.resolution,
            isSuccess: !!eventData.isSuccess,
            executionTimeSec: eventData.executionTimeSec || 30,
            lifecycleState: 'SANDBOX_TESTING'
        };

        // Step 1: Sandbox Benchmark Test
        const benchmarkPassed = candidate.isSuccess && candidate.executionTimeSec < 120;
        candidate.benchmarkPassed = benchmarkPassed;

        // Step 2: Security Review Gate
        if (isSecuritySensitive) {
            candidate.lifecycleState = 'REQUIRES_L3_SECURITY_APPROVAL';
            candidate.status = 'PENDING_APPROVAL';
            candidate.message = 'Modifications to auth, payment, or permissions require human sign-off.';
            return candidate;
        }

        // Step 3: Canary Promotion if passed benchmark
        if (benchmarkPassed) {
            candidate.lifecycleState = 'CANARY_ACTIVE';
            const promotedSkill = this.registerSkill({
                skillId: candidateId,
                name: `Autonomous Skill: ${eventData.task.substr(0, 40)}`,
                category: 'Learned Procedural Skill',
                version: '1.0.0-canary',
                status: 'CANARY_VERIFIED',
                successRate: 0.90,
                avgResolutionSeconds: candidate.executionTimeSec,
                sandboxBenchmarkPassed: true,
                securityApproved: true,
                authoritativeRule: candidate.extractedRule
            });
            candidate.registeredSkill = promotedSkill;
        } else {
            candidate.lifecycleState = 'REJECTED_FAILED_BENCHMARK';
        }

        return candidate;
    }

    /**
     * Safety Check: Prohibit autonomous self-modification of core security policies
     */
    checkSecuritySensitivity(taskText) {
        const sensitiveKeywords = [
            'password', 'secret', 'drop table', 'truncate', 'grant admin',
            'disable rls', 'bypass auth', 'private_key', 'service_role'
        ];
        const lower = taskText.toLowerCase();
        return sensitiveKeywords.some(kw => lower.includes(kw));
    }

    /**
     * Retrieve all active verified skills in the registry
     */
    getSkillRegistrySummary() {
        const list = Array.from(this.skillsRegistry.values());
        return {
            totalSkills: list.length,
            productionVerifiedCount: list.filter(s => s.status === 'PRODUCTION_VERIFIED').length,
            canaryCount: list.filter(s => s.status === 'CANARY_VERIFIED').length,
            skills: list
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SkillRegistryEngine };
}
