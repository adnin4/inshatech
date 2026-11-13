/**
 * Cloudflare Pages Function: /api/health
 * Live edge health endpoint.
 * Reports infrastructure facts only; measured SLO metrics must come from telemetry.
 */

import { CANONICAL_RELEASE } from '../_shared/release_manifest.js';
import { probeDatabaseHealth, PROBE_STATUS } from '../_shared/database_probe.js';
import { resolveCorsOrigin, resolveRuntimeEnvironment } from '../_shared/origin_policy.js';

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const corsOrigin = resolveCorsOrigin(request);
    const startedAt = Date.now();
    const gitSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || CANONICAL_RELEASE.canonical_sha || null;
    const environment = resolveRuntimeEnvironment(request, env);

    const url = new URL(request.url);
    const probeType = url.searchParams.get('type');

    // Real server-side DB probe (bounds timeout to 3000ms max)
    const dbProbe = await probeDatabaseHealth(env);
    const databaseVerified = dbProbe.status === PROBE_STATUS.ACTIVE_HEALTHY;
    const hasSupabaseConfig = Boolean(env.SUPABASE_URL && (env.SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY));

    const liveness = {
        status: 'HEALTHY',
        edge_process: 'ACTIVE',
        edge_region: request.cf?.colo || 'EDGE',
        edge_country: request.cf?.country || 'GLOBAL'
    };

    const readiness = {
        status: databaseVerified ? 'READY' : 'NOT_READY',
        database_pool: hasSupabaseConfig ? (databaseVerified ? 'ACTIVE_HEALTHY' : dbProbe.status) : 'NOT_CONFIGURED',
        database_verified: databaseVerified,
        details: dbProbe.details || (databaseVerified ? 'Database connected and healthy' : 'Database credentials missing or unreachable')
    };

    if (probeType === 'liveness') {
        return new Response(JSON.stringify({ status: 'HEALTHY', liveness, environment, git_sha: gitSha, timestamp: new Date().toISOString() }, null, 2), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': corsOrigin,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'X-Content-Type-Options': 'nosniff'
            }
        });
    }

    if (probeType === 'readiness') {
        const httpStatus = databaseVerified ? 200 : 503;
        return new Response(JSON.stringify({ status: readiness.status, readiness, environment, git_sha: gitSha, timestamp: new Date().toISOString() }, null, 2), {
            status: httpStatus,
            headers: {
                'Access-Control-Allow-Origin': corsOrigin,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'X-Content-Type-Options': 'nosniff'
            }
        });
    }

    const payload = {
        status: 'EDGE_HEALTHY',
        database_pool: readiness.database_pool,
        environment: environment,
        liveness,
        readiness,
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
            'X-Content-Type-Options': 'nosniff',
            'traceparent': request.headers.get('traceparent') || ''
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
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, traceparent'
        }
    });
}
