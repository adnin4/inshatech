/**
 * Cloudflare Pages Function: /api/admin/integrations
 * Handles integration configuration testing, status inquiry, and secret presence checks.
 * Invariant: Never return raw secret keys in responses; only return fingerprints, status, and verification metrics.
 * Protected by server-side authorization: requires valid owner session.
 */

import { getCorsHeaders, verifyServerSession } from '../../_shared/auth_gate.js';

export async function onRequestGet(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    // Require Level 1 Owner Authentication
    const auth = await verifyServerSession(request, env, {
        requiredRole: 'owner',
        minHierarchyLevel: 1,
        requireMfa: true
    });

    if (!auth.authorized) {
        const httpStatus = auth.status === 'CONFIGURATION_ERROR' ? 503 :
                           auth.status === 'PRIVILEGE_REJECTED' || auth.status === 'HIERARCHY_REJECTED' ? 403 : 401;
        return new Response(JSON.stringify({
            status: auth.status,
            error: auth.error || 'Server authorization required to view integrations'
        }), { status: httpStatus, headers });
    }

    // Truthful check of server-side environment variables
    const integrations = [
        {
            id: 'bkash',
            pillar: 'PAYMENT',
            name: 'bKash Online Business / Merchant API',
            isConfigured: Boolean(env?.BKASH_APP_KEY && env?.BKASH_APP_SECRET),
            status: Boolean(env?.BKASH_APP_KEY && env?.BKASH_APP_SECRET) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['BKASH_APP_KEY', 'BKASH_APP_SECRET', 'BKASH_USERNAME', 'BKASH_PASSWORD', 'BKASH_WEBHOOK_SECRET'],
            environment: Boolean(env?.BKASH_APP_KEY) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'CRITICAL'
        },
        {
            id: 'stripe',
            pillar: 'PAYMENT',
            name: 'Stripe International Gateway & Elements',
            isConfigured: Boolean(env?.STRIPE_SECRET_KEY || env?.STRIPE_TEST_SECRET_KEY),
            status: Boolean(env?.STRIPE_SECRET_KEY) ? 'CONFIGURED_UNVERIFIED' : (Boolean(env?.STRIPE_TEST_SECRET_KEY) ? 'SANDBOX_CONFIGURED' : 'NOT_CONFIGURED'),
            requiredSecrets: ['STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
            environment: Boolean(env?.STRIPE_SECRET_KEY) ? 'LIVE' : (Boolean(env?.STRIPE_TEST_SECRET_KEY) ? 'SANDBOX' : 'UNINITIALIZED'),
            lastVerified: null,
            riskTier: 'CRITICAL'
        },
        {
            id: 'resend',
            pillar: 'EMAIL',
            name: 'Resend Transactional Email API',
            isConfigured: Boolean(env?.RESEND_API_KEY),
            status: Boolean(env?.RESEND_API_KEY) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['RESEND_API_KEY', 'RESEND_FROM_DOMAIN'],
            environment: Boolean(env?.RESEND_API_KEY) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'HIGH_IMPACT'
        },
        {
            id: 'whatsapp',
            pillar: 'WHATSAPP',
            name: 'Meta WhatsApp Cloud API Gateway',
            isConfigured: Boolean(env?.WHATSAPP_TOKEN && env?.WHATSAPP_PHONE_ID),
            status: Boolean(env?.WHATSAPP_TOKEN && env?.WHATSAPP_PHONE_ID) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_ID', 'WHATSAPP_BUSINESS_ACCOUNT_ID'],
            environment: Boolean(env?.WHATSAPP_TOKEN) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'HIGH_IMPACT'
        },
        {
            id: 'telegram',
            pillar: 'NOTIFICATION',
            name: 'Telegram Emergency Owner Alert Bot',
            isConfigured: Boolean(env?.TELEGRAM_BOT_TOKEN && env?.TELEGRAM_OWNER_CHAT_ID),
            status: Boolean(env?.TELEGRAM_BOT_TOKEN && env?.TELEGRAM_OWNER_CHAT_ID) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_OWNER_CHAT_ID'],
            environment: Boolean(env?.TELEGRAM_BOT_TOKEN) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'HIGH_IMPACT'
        },
        {
            id: 'hubspot',
            pillar: 'CRM',
            name: 'HubSpot / Private CRM Integration',
            isConfigured: Boolean(env?.HUBSPOT_ACCESS_TOKEN),
            status: Boolean(env?.HUBSPOT_ACCESS_TOKEN) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['HUBSPOT_ACCESS_TOKEN'],
            environment: Boolean(env?.HUBSPOT_ACCESS_TOKEN) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'MEDIUM'
        },
        {
            id: 'lead_provider',
            pillar: 'CRM',
            name: 'Apollo / B2B Lead Enrichment Provider',
            isConfigured: Boolean(env?.APOLLO_API_KEY),
            status: Boolean(env?.APOLLO_API_KEY) ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
            requiredSecrets: ['APOLLO_API_KEY'],
            environment: Boolean(env?.APOLLO_API_KEY) ? 'LIVE' : 'UNINITIALIZED',
            lastVerified: null,
            riskTier: 'LOW'
        }
    ];

    return new Response(JSON.stringify({
        status: 'SUCCESS',
        integrations,
        timestamp: new Date().toISOString()
    }), { headers, status: 200 });
}

export async function onRequestPost(context) {
    const { request, env = {} } = context;
    const headers = getCorsHeaders(request);

    // Require Level 1 Owner Authentication
    const auth = await verifyServerSession(request, env, {
        requiredRole: 'owner',
        minHierarchyLevel: 1,
        requireMfa: true
    });

    if (!auth.authorized) {
        const httpStatus = auth.status === 'CONFIGURATION_ERROR' ? 503 :
                           auth.status === 'PRIVILEGE_REJECTED' || auth.status === 'HIERARCHY_REJECTED' ? 403 : 401;
        return new Response(JSON.stringify({
            status: auth.status,
            error: auth.error || 'Server authorization required to test integrations'
        }), { status: httpStatus, headers });
    }

    const body = await request.json().catch(() => ({}));
    const { provider_id, action } = body;

    if (action === 'test_connection') {
        if (!provider_id) {
            return new Response(JSON.stringify({ error: 'Missing provider_id' }), { status: 400, headers });
        }

        const idUpper = String(provider_id).toUpperCase();
        const hasEnv = Boolean(
            env?.[`${idUpper}_API_KEY`] ||
            env?.[`${idUpper}_SECRET_KEY`] ||
            env?.[`${idUpper}_APP_KEY`] ||
            env?.[`${idUpper}_TOKEN`] ||
            (idUpper === 'BKASH' && env?.BKASH_APP_KEY && env?.BKASH_APP_SECRET) ||
            (idUpper === 'STRIPE' && (env?.STRIPE_SECRET_KEY || env?.STRIPE_TEST_SECRET_KEY)) ||
            (idUpper === 'TELEGRAM' && env?.TELEGRAM_BOT_TOKEN) ||
            (idUpper === 'WHATSAPP' && env?.WHATSAPP_TOKEN)
        );

        if (!hasEnv) {
            return new Response(JSON.stringify({
                status: 'NOT_CONFIGURED',
                provider: provider_id,
                message: `Provider '${provider_id}' credentials are not configured in server environment variables. Please add secrets in Cloudflare Pages dashboard.`
            }), { status: 503, headers });
        }

        return new Response(JSON.stringify({
            status: 'CONFIGURED_UNVERIFIED',
            provider: provider_id,
            verifiedAt: new Date().toISOString(),
            message: `Provider '${provider_id}' secrets are loaded. Awaiting external sandbox transaction verification.`
        }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers });
}

export function onRequestOptions(context) {
    return new Response(null, { status: 204, headers: getCorsHeaders(context.request) });
}
