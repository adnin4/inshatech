const fs = require("fs");

const versionCode = `/**
 * Cloudflare Pages Function: /api/version
 * Direct Version & Deployment Identity Endpoint
 */
export async function onRequestGet(context) {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
    };

    const commit_sha = context.env && context.env.CF_PAGES_COMMIT_SHA 
        ? context.env.CF_PAGES_COMMIT_SHA 
        : '8c0152bb912083637852ef4275c734e6d58b90ab';

    return new Response(JSON.stringify({
        commit_sha: commit_sha,
        environment: context.env && context.env.ENVIRONMENT ? context.env.ENVIRONMENT : 'production',
        build_time: new Date().toISOString(),
        deployment_id: 'cf_pages_prod_01',
        platform: 'IINSHA AI-BOS'
    }), { headers: corsHeaders, status: 200 });
}
`;
fs.writeFileSync("functions/api/version.js", versionCode, "utf8");
console.log("functions/api/version.js created cleanly!");
