/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic release parity and runtime manifest.
 * Never invents deployment or database health claims.
 */

import { CANONICAL_RELEASE } from '../_shared/release_manifest.js';
import { verifyReleaseIdentity } from '../_shared/release_identity.js';

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

function databaseIdentity(env) {
    const canonical = typeof env.CANONICAL_SUPABASE_PROJECT_REF === 'string'
        ? env.CANONICAL_SUPABASE_PROJECT_REF.trim()
        : null;
    const runtime = typeof env.SUPABASE_RUNTIME_PROJECT_REF === 'string'
        ? env.SUPABASE_RUNTIME_PROJECT_REF.trim()
        : null;
    const health = typeof env.SUPABASE_RUNTIME_HEALTH === 'string'
        ? env.SUPABASE_RUNTIME_HEALTH.trim().toUpperCase()
        : null;

    const identityPresent = Boolean(canonical && runtime);
    const identityMatches = identityPresent && canonical === runtime;
    const healthVerified = health === 'HEALTHY';

    return {
        canonical_db: canonical || 'UNSPECIFIED',
        runtime_db: runtime || 'UNSPECIFIED',
        db_parity: identityMatches,
        status: !identityPresent
            ? 'UNVERIFIED'
            : !identityMatches
                ? 'MISMATCH'
                : healthVerified
                    ? 'LIVE_VERIFIED'
                    : 'IDENTITY_VERIFIED_HEALTH_UNVERIFIED'
    };
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    const identity = verifyReleaseIdentity({
        source_sha: env.SOURCE_RELEASE_SHA || env.GIT_COMMIT_SHA || null,
        build_sha: env.BUILD_RELEASE_SHA || null,
        deployment_sha: env.CF_PAGES_COMMIT_SHA || null,
        runtime_sha: env.RUNTIME_RELEASE_SHA || env.EXPECTED_RELEASE_SHA || null,
        branch: env.CF_PAGES_BRANCH || null
    });
    const db = databaseIdentity(env);
    const productionVerified = identity.verified && db.status === 'LIVE_VERIFIED';

    const payload = {
        status: productionVerified ? 'LIVE_VERIFIED' : 'UNVERIFIED',
        platform: 'IINSHA AI-BOS',
        deploy_sha: identity.shas.deployment_sha === 'UNSPECIFIED' ? null : identity.shas.deployment_sha,
        expected_release_sha: identity.shas.runtime_sha === 'UNSPECIFIED' ? null : identity.shas.runtime_sha,
        parity: productionVerified,
        release_identity: identity,
        branch: identity.branch.active === 'UNSPECIFIED' ? null : identity.branch.active,
        canonical_repository: CANONICAL_RELEASE.canonical_repository,
        environment: env.ENVIRONMENT || 'production',
        database_identity: db,
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}
