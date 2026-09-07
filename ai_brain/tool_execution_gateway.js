/**
 * IINSHA AI-BOS: CENTRALIZED TOOL EXECUTION GATEWAY
 *
 * Production invariants:
 * - authorization is separate from execution
 * - no hardcoded credentials or approval tokens
 * - no synthetic side-effect success in production
 * - provider-backed tools must return a provider receipt or a truthful state
 * - rate limits are per minute and actually expire
 */

import crypto from 'crypto';
import { CrmAdapter } from './adapters/crm_adapter.js';

export const TOOL_REGISTRY = {
    knowledge_search: { permission_level: 0, agent_allowlist: ['CEO_AGENT', 'SDR_AGENT', 'SALES_AGENT', 'ARCHITECT_AGENT', 'SUCCESS_AGENT', 'INTELLIGENCE_AGENT'], rate_limit_per_min: 60 },
    service_catalog_lookup: { permission_level: 0, agent_allowlist: ['CEO_AGENT', 'SALES_AGENT', 'ARCHITECT_AGENT', 'FINANCE_AGENT'], rate_limit_per_min: 60 },
    generate_proposal_draft: { permission_level: 1, agent_allowlist: ['SALES_AGENT', 'ARCHITECT_AGENT'], rate_limit_per_min: 20 },
    create_crm_lead: { permission_level: 2, agent_allowlist: ['SDR_AGENT', 'SALES_AGENT', 'MARKETING_AGENT'], rate_limit_per_min: 30 },
    create_checkout_session: { permission_level: 2, agent_allowlist: ['SALES_AGENT', 'CEO_AGENT'], rate_limit_per_min: 15 },
    execute_docker_sandbox_task: { permission_level: 2, agent_allowlist: ['DEVELOPER_AGENT', 'DEVOPS_AGENT'], rate_limit_per_min: 10 },
    run_qa_test_suite: { permission_level: 0, agent_allowlist: ['QA_AGENT', 'GUARDIAN_AGENT'], rate_limit_per_min: 20 },
    deploy_production_release: { permission_level: 3, agent_allowlist: ['DEVOPS_AGENT', 'CEO_AGENT'], rate_limit_per_min: 3, requires_approval: true },
    process_refund_request: { permission_level: 3, agent_allowlist: ['FINANCE_AGENT', 'CEO_AGENT'], rate_limit_per_min: 5, requires_approval: true },
    disburse_affiliate_payout: { permission_level: 3, agent_allowlist: ['FINANCE_AGENT', 'AFFILIATE_AGENT'], rate_limit_per_min: 5, requires_approval: true },
    drop_database_table: { permission_level: 4, agent_allowlist: [], rate_limit_per_min: 0, is_blocked: true },
    expose_service_role_secret: { permission_level: 4, agent_allowlist: [], rate_limit_per_min: 0, is_blocked: true }
};

const BLOCKED_STATUSES = new Set(['NOT_CONFIGURED', 'PROVIDER_ERROR', 'PROVIDER_UNREACHABLE', 'BLOCKED', 'DENIED', 'REJECTED', 'THROTTLED', 'APPROVAL_REQUIRED']);

export class ToolExecutionGateway {
    constructor({ auditLogger = null, crmAdapter = null } = {}) {
        this.auditLog = [];
        this.customAuditLogger = auditLogger;
        this.rateLimitBuckets = new Map();
        this.crmAdapter = crmAdapter || new CrmAdapter();
    }

    _recordAudit(entry) {
        this.auditLog.push(entry);
        if (typeof this.customAuditLogger === 'function') this.customAuditLogger(entry);
    }

    _isRateLimited(agentId, toolId, limit) {
        if (!limit) return true;
        const now = Date.now();
        const key = `${agentId}:${toolId}`;
        const bucket = this.rateLimitBuckets.get(key) || [];
        const active = bucket.filter(ts => now - ts < 60_000);
        if (active.length >= limit) {
            this.rateLimitBuckets.set(key, active);
            return true;
        }
        active.push(now);
        this.rateLimitBuckets.set(key, active);
        return false;
    }

    _notConfigured(toolId, missingEnv = [], note = 'Production provider is not configured.') {
        return {
            status: 'NOT_CONFIGURED',
            tool_id: toolId,
            production_verified: false,
            missing_env: missingEnv,
            note
        };
    }

    async _executeTool(toolId, args) {
        switch (toolId) {
            case 'knowledge_search':
                return { status: 'SUCCESS', production_verified: true, result: { query: args.query || '', source: 'IINSHA_KNOWLEDGE_BASE' } };
            case 'service_catalog_lookup':
                return { status: 'SUCCESS', production_verified: true, result: { source: 'IINSHA_SERVICE_CATALOG' } };
            case 'generate_proposal_draft':
                return { status: 'SUCCESS', production_verified: true, result: { proposal_id: `PROP-${crypto.randomUUID()}`, client: args.client_name || null, price_usd: Number(args.price_usd) || null } };
            case 'create_crm_lead':
                return await this.crmAdapter.syncLead(args);
            case 'create_checkout_session':
                return this._notConfigured('create_checkout_session', ['LEMON_SQUEEZY_API_KEY'], 'No live payment session will be claimed until a provider adapter is explicitly configured and tested.');
            case 'execute_docker_sandbox_task':
                return this._notConfigured('execute_docker_sandbox_task', ['IINSHA_SANDBOX_EXECUTOR_URL'], 'Sandbox execution requires a configured isolated worker; no fake build result is returned.');
            case 'run_qa_test_suite':
                return this._notConfigured('run_qa_test_suite', ['IINSHA_QA_RUNNER_URL'], 'QA runner is not configured for remote execution.');
            case 'deploy_production_release':
                return this._notConfigured('deploy_production_release', ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_PAGES_PROJECT'], 'Production deployment requires a configured Cloudflare deployment adapter; no deployment is claimed locally.');
            case 'process_refund_request':
                return this._notConfigured('process_refund_request', ['PAYMENT_PROVIDER_REFUND_ADAPTER'], 'Refund execution is disabled until a provider-specific refund adapter is configured.');
            case 'disburse_affiliate_payout':
                return this._notConfigured('disburse_affiliate_payout', ['AFFILIATE_PAYOUT_ADAPTER'], 'Affiliate payout execution is disabled until a provider-specific settlement adapter is configured.');
            default:
                return { status: 'REJECTED', production_verified: false, error: `Tool ${toolId} has no execution adapter.` };
        }
    }

    async execute({ agent_id, tool_id, arguments_payload = {}, owner_token = null, environment = process.env.NODE_ENV || 'production' }) {
        const timestamp = new Date().toISOString();
        const callId = `CALL-${crypto.randomUUID()}`;
        const inputHash = crypto.createHash('sha256').update(JSON.stringify(arguments_payload)).digest('hex').slice(0, 16);
        const tool = TOOL_REGISTRY[tool_id];

        if (!tool) {
            const entry = { callId, agent_id, tool_id, status: 'REJECTED', reason: 'TOOL_NOT_FOUND', timestamp, environment };
            this._recordAudit(entry);
            return { status: 'REJECTED', call_id: callId, error: 'TOOL_NOT_FOUND' };
        }

        if (tool.is_blocked || tool.permission_level === 4) {
            const entry = { callId, agent_id, tool_id, status: 'BLOCKED', reason: 'LEVEL_4_RESTRICTED_ACTION', timestamp, environment };
            this._recordAudit(entry);
            return { status: 'BLOCKED', call_id: callId, error: 'LEVEL_4_RESTRICTED_ACTION' };
        }

        if (!tool.agent_allowlist.includes(agent_id)) {
            const entry = { callId, agent_id, tool_id, status: 'DENIED', reason: 'AGENT_NOT_IN_ALLOWLIST', timestamp, environment };
            this._recordAudit(entry);
            return { status: 'DENIED', call_id: callId, error: 'AGENT_NOT_IN_ALLOWLIST' };
        }

        if (tool.permission_level >= 3 || tool.requires_approval) {
            const expected = process.env.IINSHA_OWNER_APPROVAL_TOKEN;
            if (!expected || !owner_token || !crypto.timingSafeEqual(Buffer.from(String(owner_token)), Buffer.from(String(expected)))) {
                const entry = { callId, agent_id, tool_id, status: 'APPROVAL_REQUIRED', reason: 'OWNER_APPROVAL_REQUIRED', timestamp, environment };
                this._recordAudit(entry);
                return { status: 'APPROVAL_REQUIRED', call_id: callId, error: 'OWNER_APPROVAL_REQUIRED' };
            }
        }

        if (this._isRateLimited(agent_id, tool_id, tool.rate_limit_per_min)) {
            const entry = { callId, agent_id, tool_id, status: 'THROTTLED', reason: 'RATE_LIMIT_EXCEEDED', timestamp, environment };
            this._recordAudit(entry);
            return { status: 'THROTTLED', call_id: callId, error: 'RATE_LIMIT_EXCEEDED' };
        }

        try {
            const execution = await this._executeTool(tool_id, arguments_payload);
            const executionStatus = execution?.status || 'UNKNOWN';
            const outputPayload = execution?.result ?? execution?.provider_receipt ?? execution;
            const outputHash = crypto.createHash('sha256').update(JSON.stringify(outputPayload)).digest('hex').slice(0, 16);
            const auditEntry = {
                callId,
                agent_id,
                tool_id,
                status: executionStatus,
                inputHash,
                outputHash,
                production_verified: execution?.production_verified === true,
                timestamp,
                environment
            };
            this._recordAudit(auditEntry);

            return {
                ...execution,
                call_id: callId,
                execution_id: `EXEC-${callId.slice(5)}`,
                timestamp,
                blocked_from_success_claim: BLOCKED_STATUSES.has(executionStatus)
            };
        } catch (error) {
            this._recordAudit({ callId, agent_id, tool_id, status: 'EXECUTION_FAILED', error: error.message, timestamp, environment });
            return { status: 'EXECUTION_FAILED', call_id: callId, production_verified: false, error: error.message };
        }
    }

    getAuditHistory() {
        return [...this.auditLog];
    }
}
