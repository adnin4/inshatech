/**
 * Cloudflare Pages Function: /api/version
 * Cryptographic Release Parity & Dynamic Version Manifest Endpoint
 * Dynamically resolves live Cloudflare runtime environment with truthful fallback.
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

    const sourceSha = "11c740b9a541f60793afe3a3d9bf8214c5a38756";
    const liveSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || null;
    const isLiveVerified = Boolean(liveSha && liveSha.toLowerCase() === sourceSha.toLowerCase());

    const payload = {
        status: isLiveVerified ? "LIVE_VERIFIED" : "UNVERIFIED",
        platform: "IINSHA AI-BOS",
        source_sha: sourceSha,
        build_sha: sourceSha,
        deploy_sha: liveSha || "PENDING_CLOUDFLARE_DEPLOYMENT",
        live_sha: liveSha || "UNAVAILABLE_RUNNING_LOCAL_PREVIEW",
        parity: isLiveVerified,
        branch: env.CF_PAGES_BRANCH || "main",
        canonical_repository: "https://github.com/adnin4/inshatech.git",
        environment: env.ENVIRONMENT || "production",
        database_identity: {
            canonical_db: "uulqaslcfjrvkvyegmvo",
            runtime_db: "kitwadizsvjmuxkfewxj",
            db_parity: "MISMATCH_UNVERIFIED"
        },
        timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(payload, null, 2), { headers: corsHeaders });
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
