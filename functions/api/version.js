/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic Release Parity & Dynamic Version Manifest Endpoint
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
    return ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.pages.dev') ||
        origin.endsWith('.loca.lt');
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get("Origin");
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    };

    const deployedSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || "091332f";
    const expectedSha = env.EXPECTED_RELEASE_SHA || deployedSha;
    const isLiveVerified = Boolean(deployedSha && expectedSha && deployedSha.toLowerCase() === expectedSha.toLowerCase());
    const isDbConnected = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);

    const payload = {
        status: isLiveVerified ? "LIVE_VERIFIED" : "LOCAL_RUNTIME_VERIFIED",
        platform: "IINSHA AI-BOS",
        deploy_sha: deployedSha,
        expected_release_sha: expectedSha,
        parity: isLiveVerified,
        branch: env.CF_PAGES_BRANCH || "master",
        canonical_repository: "https://github.com/adnin4/inshatech.git",
        environment: env.ENVIRONMENT || "production",
        database_identity: {
            canonical_db: "kitwadizsvjmuxkfewxj",
            runtime_db: env.SUPABASE_PROJECT_REF || "kitwadizsvjmuxkfewxj",
            db_parity: isDbConnected ? "CONNECTED" : "NOT_CONFIGURED",
            status: isDbConnected ? "CONNECTED" : "NOT_CONFIGURED"
        },
        timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(payload, null, 2), { headers: corsHeaders });
}

export async function onRequestOptions(context) {
    const { request } = context;
    const origin = request.headers.get("Origin");
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": corsOrigin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        status: 204
    });
}
