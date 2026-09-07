/**
 * IINSHA AI-BOS — Production Deployment Adapter
 *
 * This adapter never reports a deployment unless a real provider-side
 * deployment receipt is obtained. A configured target without a provider
 * receipt remains NOT_CONFIGURED/UNVERIFIED.
 */

import crypto from 'crypto';

export class ProductionDeploymentAdapter {
    constructor(config = {}) {
        this.environment = config.environment || process.env.NODE_ENV || 'production';
        this.cloudflareApiToken = config.cloudflareApiToken || process.env.CLOUDFLARE_API_TOKEN || '';
        this.cloudflareAccountId = config.cloudflareAccountId || process.env.CLOUDFLARE_ACCOUNT_ID || '';
        this.pagesProject = config.pagesProject || process.env.CLOUDFLARE_PAGES_PROJECT || '';
        this.activeDeployments = [];
    }

    _missingConfig() {
        return [
            !this.cloudflareApiToken ? 'CLOUDFLARE_API_TOKEN' : null,
            !this.cloudflareAccountId ? 'CLOUDFLARE_ACCOUNT_ID' : null,
            !this.pagesProject ? 'CLOUDFLARE_PAGES_PROJECT' : null
        ].filter(Boolean);
    }

    async verifyLiveParity(expectedSha) {
        const liveVersionUrl = process.env.IINSHA_LIVE_VERSION_URL || 'https://inshatech.pages.dev/api/version';
        try {
            const response = await fetch(liveVersionUrl, { headers: { Accept: 'application/json' } });
            const body = await response.json().catch(() => null);
            const liveSha = body?.sha || body?.commit_sha || body?.version?.sha || null;
            return {
                status: response.ok && liveSha && expectedSha && liveSha === expectedSha ? 'PARITY_VERIFIED' : 'PARITY_UNVERIFIED',
                production_verified: response.ok && liveSha === expectedSha,
                expected_sha: expectedSha || null,
                live_sha: liveSha,
                source: liveVersionUrl,
                http_code: response.status
            };
        } catch (error) {
            return { status: 'PROVIDER_UNREACHABLE', production_verified: false, expected_sha: expectedSha || null, error: error.message };
        }
    }

    async deployRelease({ commitSha, qaReport, ownerApproved, targetEnvironment = 'PRODUCTION' } = {}) {
        if (!qaReport?.certified) return { status: 'BLOCKED_QA_FAILED', deployed: false, production_verified: false };
        if (targetEnvironment === 'PRODUCTION' && !ownerApproved) return { status: 'BLOCKED_APPROVAL_REQUIRED', deployed: false, production_verified: false };

        const missing = this._missingConfig();
        if (missing.length) {
            return {
                status: 'NOT_CONFIGURED',
                deployed: false,
                production_verified: false,
                missing_env: missing,
                note: 'Cloudflare deployment provider is not fully configured; no deployment is claimed.'
            };
        }

        // Deployment API implementation is intentionally kept behind this boundary.
        // Until the exact Pages deployment/upload contract is verified and tested,
        // fail closed rather than pretending an edge deployment occurred.
        const attemptId = `DEP-ATTEMPT-${crypto.randomUUID()}`;
        return {
            status: 'UNVERIFIED',
            deployed: false,
            production_verified: false,
            attempt_id: attemptId,
            commit_sha: commitSha || null,
            target_environment: targetEnvironment,
            provider: 'cloudflare_pages',
            note: 'Provider credentials exist, but deployment receipt/upload contract has not been independently verified.'
        };
    }
}
