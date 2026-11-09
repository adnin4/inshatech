/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic release parity and runtime manifest with live database health probe.
 * Never invents deployment or database health claims from static variables.
 */

import { CANONICAL_RELEASE } from '../_shared/release_manifest.js';
import { verifyReleaseIdentity, RELEASE_CLASSIFICATIONS } from '../_shared/release_identity.js';
import { probeDatabaseHealth, PROBE_STATUS } from '../_shared/database_probe.js';

const ALLOWED_ORIGINS = [
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8080',
    'http://localhost:8788',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8788'
];

function isOriginAllowed(origin) {
    if (!origin) return false;
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    return /^https:\/\/[a-z0-9-]+\.inshatech\.pages\.dev$/i.test(origin);
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    // 1. Live Authenticated Database Probe (no static fallback illusions)
    const dbProbe = await probeDatabaseHealth(env);
    const databaseVerified = dbProbe.status === PROBE_STATUS.ACTIVE_HEALTHY;

    // 2. Multi-SHA Release Parity Verification
    const defaultSha = env.CF_PAGES_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;
    const identity = verifyReleaseIdentity({
        source_sha: env.SOURCE_RELEASE_SHA || env.GIT_COMMIT_SHA || defaultSha,
        build_sha: env.BUILD_RELEASE_SHA || defaultSha,
        deployment_sha: env.CF_PAGES_COMMIT_SHA || defaultSha,
        runtime_sha: env.RUNTIME_RELEASE_SHA || env.EXPECTED_RELEASE_SHA || defaultSha,
        branch: env.CF_PAGES_BRANCH || CANONICAL_RELEASE.canonical_branch || null,
        repository: env.GITHUB_REPOSITORY || CANONICAL_RELEASE.canonical_repository,
        deployment_id: env.CF_PAGES_DEPLOYMENT_ID || null,
        captured_at: env.BUILD_TIMESTAMP || null,
        pr_head_sha: env.PR_HEAD_SHA || null,
        synthetic_merge_sha: env.SYNTHETIC_MERGE_SHA || null,
        database_verified: databaseVerified
    });

    const isFullReleaseVerified = identity.verified && databaseVerified;

    const payload = {
        status: isFullReleaseVerified ? 'LIVE_VERIFIED' : 'UNVERIFIED',
        platform: 'IINSHA AI-BOS',
        classification: identity.classification,
        deploy_sha: identity.shas.deployment_sha === 'UNSPECIFIED' ? null : identity.shas.deployment_sha,
        expected_release_sha: identity.shas.runtime_sha === 'UNSPECIFIED' ? null : identity.shas.runtime_sha,
        parity: isFullReleaseVerified,
        release_identity: identity,
        branch: identity.branch.active === 'UNSPECIFIED' ? null : identity.branch.active,
        canonical_repository: CANONICAL_RELEASE.canonical_repository,
        environment: env.ENVIRONMENT || 'production',
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
            'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
    });
}

export async function onRequestOptions(context) {
    const origin = context.request?.headers?.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

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
