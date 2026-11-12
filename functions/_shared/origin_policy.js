/**
 * Canonical Origin, Base-URL, CORS, and Runtime Environment Policy
 *
 * Single source of truth for:
 * 1. Exact allowlisted production, staging, preview, and local development origins.
 * 2. Host-header / Origin-header injection protection for payment callbacks and redirects.
 * 3. Deterministic runtime environment resolution with verified custom-domain precedence.
 */

export const STAGING_DEFAULT_ORIGIN = 'https://inshatech-b6b.pages.dev';
export const PRODUCTION_PRIMARY_ORIGIN = 'https://inshatech.com';

export const PRODUCTION_HOSTS = new Set([
    'inshatech.com',
    'www.inshatech.com',
    'admin.inshatech.com'
]);

export const EXACT_ALLOWED_ORIGINS = new Set([
    'https://inshatech-b6b.pages.dev',
    'https://inshatech.pages.dev',
    'https://inshatech.com',
    'https://www.inshatech.com',
    'https://admin.inshatech.com',
    'http://localhost:8080',
    'http://localhost:8788',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8788'
]);

const PREVIEW_PAGES_RE = /^https:\/\/[a-z0-9-]+\.(?:inshatech|inshatech-b6b)\.pages\.dev$/i;

export function isOriginAllowed(origin) {
    if (!origin || typeof origin !== 'string') return false;
    try {
        const parsed = new URL(origin);
        if (parsed.username || parsed.password) return false;
        if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
            if (origin !== parsed.origin) return false;
        }
        const normalized = parsed.origin.toLowerCase();
        if (EXACT_ALLOWED_ORIGINS.has(normalized)) return true;
        if (!parsed.port && PREVIEW_PAGES_RE.test(normalized)) return true;
        return false;
    } catch (_) {
        return false;
    }
}

export function resolveCorsOrigin(request, fallback = STAGING_DEFAULT_ORIGIN) {
    const origin = request?.headers?.get?.('Origin') || '';
    return isOriginAllowed(origin) ? origin : fallback;
}

/**
 * Resolves a trusted base URL for payment return/IPN callbacks and portal redirects.
 * Rejects spoofed Host headers, unallowlisted origins, userinfo, and custom ports.
 */
export function resolveTrustedBaseUrl(request, env = {}) {
    const candidateEnv = env?.APP_URL ? String(env.APP_URL).trim().replace(/\/+$/, '') : '';
    if (candidateEnv && isOriginAllowed(candidateEnv)) {
        return new URL(candidateEnv).origin;
    }

    try {
        const parsed = new URL(request.url);
        if (isOriginAllowed(parsed.origin)) {
            return parsed.origin;
        }
    } catch (_) {
        // Fall through to fail-closed default
    }

    return STAGING_DEFAULT_ORIGIN;
}

/**
 * Resolves runtime environment ('production' | 'staging' | 'preview' | 'development')
 * using verified host identity first so static [vars] cannot leak across environments.
 */
export function resolveRuntimeEnvironment(request, env = {}) {
    try {
        const parsed = new URL(request.url);
        const host = (parsed.hostname || '').toLowerCase();
        if (host === 'localhost' || host === '127.0.0.1') {
            return 'development';
        }
        if (PRODUCTION_HOSTS.has(host)) {
            return 'production';
        }
        if (host === 'inshatech-b6b.pages.dev' || host === 'inshatech.pages.dev') {
            return 'staging';
        }
        if (PREVIEW_PAGES_RE.test(parsed.origin.toLowerCase())) {
            return 'preview';
        }
    } catch (_) {
        // Ignore URL parse error
    }

    const declared = String(env?.ENVIRONMENT || '').trim().toLowerCase();
    if (declared === 'staging' || declared === 'preview' || declared === 'development' || declared === 'production') {
        return declared;
    }
    return 'staging';
}

export function isApprovedProductionHost(request) {
    try {
        const parsed = new URL(request.url);
        const host = (parsed.hostname || '').toLowerCase();
        return parsed.protocol === 'https:' && PRODUCTION_HOSTS.has(host);
    } catch (_) {
        return false;
    }
}
