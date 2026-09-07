/**
 * Cloudflare Pages Function: /api/health
 * Live edge health endpoint.
 * Reports infrastructure facts only; measured SLO metrics must come from telemetry.
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

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';
    const startedAt = Date.now();
    const hasSupabaseConfig = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
    const gitSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || null;

    const payload = {
        status: 'EDGE_HEALTHY',
        database_pool: hasSupabaseConfig ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
        environment: env.ENVIRONMENT || 'unknown',
        edge_region: request.cf?.colo || 'EDGE',
        edge_country: request.cf?.country || 'GLOBAL',
        git_sha: gitSha,
        slo_target: '99.95%',
        timestamp: new Date().toISOString(),
        duration_ms: Date.now() - startedAt
    };

    return new Response(JSON.stringify(payload, null, 2), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, traceparent',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'traceparent': request.headers.get('traceparent') || ''
        }
    });
}

export async function onRequestOptions(context) {
    const origin = context.request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech.pages.dev';

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': corsOrigin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, traceparent'
        }
    });
}
