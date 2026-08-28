/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic Release Parity & Version Endpoint
 * Dynamically resolves git_sha from Cloudflare runtime environment
 */

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
    };

    const gitSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || '485c271e18d613e5fc4664a75aa32a53bbd5fc1d';
    const isLive = Boolean(env.CF_PAGES_COMMIT_SHA);

    return new Response(JSON.stringify({
        status: isLive ? 'LIVE_VERIFIED' : 'PENDING_LIVE_VERIFICATION',
        platform: 'IINSHA AI-BOS',
        git_commit_sha: gitSha,
        short_sha: gitSha.length >= 7 ? gitSha.slice(0, 7) : gitSha,
        branch: env.CF_PAGES_BRANCH || 'master',
        canonical_repository: 'https://github.com/adnin4/inshatech.git',
        environment: env.ENVIRONMENT || 'production',
        database_project: 'uulqaslcfjrvkvyegmvo',
        timestamp: new Date().toISOString()
    }), { headers: corsHeaders });
}

export async function onRequestOptions(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        status: 204
    });
}
