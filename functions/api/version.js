/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic release parity and runtime manifest with live database health probe.
 * Never invents deployment or database health claims from static variables.
 */

import { CANONICAL_RELEASE } from '../_shared/release_manifest.js';
import { verifyReleaseIdentity, isFreshTimestamp, RELEASE_CLASSIFICATIONS } from '../_shared/release_identity.js';
import { probeDatabaseHealth, PROBE_STATUS } from '../_shared/database_probe.js';
import { resolveCorsOrigin, resolveRuntimeEnvironment } from '../_shared/origin_policy.js';

export function resolveEnvironment(request, env = {}) {
    return resolveRuntimeEnvironment(request, env);
}

export function resolveDeploymentId(request, env = {}, defaultSha = null) {
    if (env.CF_PAGES_DEPLOYMENT_ID) return env.CF_PAGES_DEPLOYMENT_ID;
    const environment = resolveEnvironment(request, env);
    try {
        const url = new URL(request.url);
        const host = url.hostname || request.headers.get('host') || '';
        const previewMatch = host.match(/^([a-z0-9-]+)\.([a-z0-9-]+)\.pages\.dev$/i);
        if (previewMatch && previewMatch[1] !== previewMatch[2]) {
            return `dpl_preview_${previewMatch[1]}`;
        }
    } catch (_) {}
    const shaSlice = (defaultSha || 'live').slice(0, 10);
    if (environment === 'production') return `dpl_prod_${shaSlice}`;
    if (environment === 'development') return `dpl_dev_${shaSlice}`;
    return `dpl_staging_${shaSlice}`;
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const corsOrigin = resolveCorsOrigin(request);

    // 1. Live Authenticated Database Probe (no static fallback illusions)
    const dbProbe = await probeDatabaseHealth(env);
    const databaseVerified = dbProbe.status === PROBE_STATUS.ACTIVE_HEALTHY;

    // 2. Multi-SHA Release Parity Verification (independent provenance tracking)
    const sourceProvenance = env.SOURCE_RELEASE_SHA ? 'ENV_SOURCE_RELEASE_SHA'
        : (env.GIT_COMMIT_SHA ? 'ENV_GIT_COMMIT_SHA'
        : (env.CF_PAGES_COMMIT_SHA ? 'INHERITED_DEPLOYMENT_SHA'
        : (CANONICAL_RELEASE.canonical_sha ? 'CANONICAL_MANIFEST' : 'UNVERIFIED')));
    const sourceSha = env.SOURCE_RELEASE_SHA || env.GIT_COMMIT_SHA || env.CF_PAGES_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;

    const buildProvenance = env.BUILD_RELEASE_SHA ? 'ENV_BUILD_RELEASE_SHA'
        : (env.CF_PAGES_COMMIT_SHA ? 'INHERITED_DEPLOYMENT_SHA'
        : (CANONICAL_RELEASE.canonical_sha ? 'CANONICAL_MANIFEST' : 'UNVERIFIED'));
    const buildSha = env.BUILD_RELEASE_SHA || env.CF_PAGES_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;

    const deploymentProvenance = env.CF_PAGES_COMMIT_SHA ? 'ENV_CF_PAGES_COMMIT_SHA'
        : (CANONICAL_RELEASE.canonical_sha ? 'CANONICAL_MANIFEST' : 'UNVERIFIED');
    const deploymentSha = env.CF_PAGES_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;

    const runtimeProvenance = env.RUNTIME_RELEASE_SHA ? 'ENV_RUNTIME_RELEASE_SHA'
        : (env.EXPECTED_RELEASE_SHA ? 'ENV_EXPECTED_RELEASE_SHA'
        : (env.CF_PAGES_COMMIT_SHA ? 'INHERITED_DEPLOYMENT_SHA'
        : (CANONICAL_RELEASE.canonical_sha ? 'CANONICAL_MANIFEST' : 'UNVERIFIED')));
    const runtimeSha = env.RUNTIME_RELEASE_SHA || env.EXPECTED_RELEASE_SHA || env.CF_PAGES_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;

    const deploymentId = resolveDeploymentId(request, env, deploymentSha);
    const environment = resolveEnvironment(request, env);
    const capturedAt = env.BUILD_TIMESTAMP || (CANONICAL_RELEASE.captured_at && isFreshTimestamp(CANONICAL_RELEASE.captured_at) ? CANONICAL_RELEASE.captured_at : new Date().toISOString());

    const identity = verifyReleaseIdentity({
        source_sha: sourceSha,
        source_provenance: sourceProvenance,
        build_sha: buildSha,
        build_provenance: buildProvenance,
        deployment_sha: deploymentSha,
        deployment_provenance: deploymentProvenance,
        runtime_sha: runtimeSha,
        runtime_provenance: runtimeProvenance,
        branch: env.CF_PAGES_BRANCH || CANONICAL_RELEASE.canonical_branch || null,
        repository: env.GITHUB_REPOSITORY || CANONICAL_RELEASE.canonical_repository,
        deployment_id: deploymentId,
        captured_at: capturedAt,
        pr_head_sha: env.PR_HEAD_SHA || null,
        synthetic_merge_sha: env.SYNTHETIC_MERGE_SHA || null,
        database_verified: databaseVerified
    });

    const isFullReleaseVerified = identity.verified && databaseVerified;

    const payload = {
        status: isFullReleaseVerified ? 'LIVE_VERIFIED' : (identity.verified ? 'READY_FOR_STAGING' : 'UNVERIFIED'),
        platform: 'IINSHA AI-BOS',
        classification: isFullReleaseVerified ? 'FULL_RELEASE_VERIFIED' : (identity.verified ? 'DEPLOYMENT_PARITY_VERIFIED' : 'UNVERIFIED'),
        deploy_sha: identity.shas.deployment_sha === 'UNSPECIFIED' ? null : identity.shas.deployment_sha,
        expected_release_sha: identity.shas.runtime_sha === 'UNSPECIFIED' ? null : identity.shas.runtime_sha,
        parity: identity.verified,
        release_parity: identity.verified,
        full_production_parity: isFullReleaseVerified,
        production_ready: isFullReleaseVerified,
        production_sealed: false,
        release_ceiling: 'READY_FOR_STAGING',
        system_readiness: isFullReleaseVerified ? 'PRODUCTION_VERIFIED' : (identity.verified ? 'READY_FOR_STAGING_DB_UNVERIFIED' : 'UNVERIFIED'),
        provenance: identity.provenance,
        release_identity: identity,
        branch: identity.branch.active === 'UNSPECIFIED' ? null : identity.branch.active,
        canonical_repository: CANONICAL_RELEASE.canonical_repository,
        environment: environment,
        database_identity: {
            status: dbProbe.status,
            verified: dbProbe.verified,
            db_parity: dbProbe.verified && dbProbe.canonical_ref === dbProbe.project_ref,
            canonical_db: dbProbe.canonical_ref,
            runtime_db: dbProbe.project_ref,
            query_latency_ms: dbProbe.query_latency_ms,
            details: dbProbe.details,
            probe_type: dbProbe.probe_type,
            checked_at: dbProbe.checked_at
        },
        timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
    });
}

export async function onRequestOptions(context) {
    const corsOrigin = resolveCorsOrigin(context.request);

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}
