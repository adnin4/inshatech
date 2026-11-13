/**
 * Cloudflare Pages Function: /api/sre/health
 * Live SRE Observability & Edge Telemetry Endpoint.
 * Enforces fail-closed reporting of runtime facts only.
 */

import { probeDatabaseHealth, PROBE_STATUS } from '../../_shared/database_probe.js';

const ALLOWED_ORIGINS = [
    'https://inshatech-b6b.pages.dev',
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
    return /^https:\/\/[a-z0-9-]+\.(?:inshatech|inshatech-b6b)\.pages\.dev$/i.test(origin);
}

function resolveEnvironment(request, env = {}) {
    try {
        const url = new URL(request.url);
        const host = (url.hostname || request.headers.get('host') || '').toLowerCase();
        if (host.includes('localhost') || host.includes('127.0.0.1')) return 'development';
        if (host.endsWith('.pages.dev')) {
            const parts = host.split('.');
            if (parts.length > 3) {
                return 'preview';
            }
            return 'staging';
        }
        if (host === 'inshatech.com' || host === 'www.inshatech.com') {
            return 'production';
        }
    } catch (_) {}
    if (env.ENVIRONMENT) return env.ENVIRONMENT;
    return 'staging';
}

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = isOriginAllowed(origin) ? origin : 'https://inshatech-b6b.pages.dev';
    const startedAt = Date.now();
    const gitSha = env.CF_PAGES_COMMIT_SHA || env.GIT_COMMIT_SHA || null;
    const environment = resolveEnvironment(request, env);

    const dbProbe = await probeDatabaseHealth(env);
    let sreStatus = 'DEGRADED';
    let poolStatus = dbProbe.status;

    if (dbProbe.status === PROBE_STATUS.ACTIVE_HEALTHY) {
        sreStatus = 'SRE_HEALTHY';
        poolStatus = 'ACTIVE_HEALTHY';
    } else if (dbProbe.status === PROBE_STATUS.UNVERIFIED) {
        sreStatus = 'DEPENDENCY_UNAVAILABLE';
        poolStatus = 'NOT_CONFIGURED';
    } else {
        sreStatus = 'DEGRADED';
        poolStatus = dbProbe.status;
    }

    const payload = {
        status: sreStatus,
        observability_level: 'FAIL_CLOSED',
        environment: environment,
        edge_region: request.cf?.colo || 'EDGE',
        edge_country: request.cf?.country || 'GLOBAL',
        git_sha: gitSha,
        runtime_identity: {
            platform: 'Cloudflare Pages Functions',
            canonical_db_ref: 'kitwadizsvjmuxkfewxj',
            database_pool: poolStatus,
            database_probe_status: dbProbe.status,
            database_verified: dbProbe.verified
        },
        slo: {
            availability_target: '99.95%',
            measured_availability: 'TELEMETRY_REQUIRED',
            latency_slo_ms: 100
        },
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
