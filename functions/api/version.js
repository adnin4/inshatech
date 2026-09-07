/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic release parity and runtime manifest.
 * Never invents deployment or database health claims.
 */

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
    const canonical = env.CANONICAL_SUPABASE_PROJECT_REF || env.SUPABASE_PROJECT_REF || null;
    const runtime = env.SUPABASE_RUNTIME_PROJECT_REF || null;
    const health = String(env.SUPABASE_RUNTIME_HEALTH || '').toUpperCase();
    const parity = Boolean(canonical && runtime && canonical === runtime);

    if (!canonical || !runtime) {
        return {
            canonical_db: canonical,
            runtime_db: runtime,
            db_parity: false,
            status: 'UNVERIFIED'
        };
    }

    return {
        canonical_db: canonical,
        runtime_db: runtime,
        db_parity: parity,
        status: parity && health === 'HEALTHY'
            ? 'ACTIVE_HEALTHY_DECLARED'
            : parity
                ? 'IDENTITY_VERIFIED_HEALTH_UNVERIFIED'
                : 'MISMATCH'
    };
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    const deployedSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || null;
    const expectedSha = env.EXPECTED_RELEASE_SHA || null;
    const parity = Boolean(deployedSha && expectedSha && deployedSha.toLowerCase() === expectedSha.toLowerCase());
    const db = databaseIdentity(env);

    const payload = {
        status: parity ? 'LIVE_VERIFIED' : (deployedSha ? 'DEPLOYMENT_SHA_UNVERIFIED' : 'UNVERIFIED'),
        platform: 'IINSHA AI-BOS',
        deploy_sha: deployedSha,
        expected_release_sha: expectedSha,
        parity,
        branch: env.CF_PAGES_BRANCH || null,
        canonical_repository: 'https://github.com/adnin4/inshatech.git',
        environment: env.ENVIRONMENT || 'unknown',
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
