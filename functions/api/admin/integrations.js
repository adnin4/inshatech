import { verifyAdminSession, adminJson, adminOptions, rejectAdminRequest } from '../../_shared/admin_session.js';

const PROVIDERS = [
  { id: 'bkash', name: 'bKash Online Business / Merchant API', riskTier: 'CRITICAL', requiredSecrets: ['BKASH_APP_KEY','BKASH_APP_SECRET','BKASH_USERNAME','BKASH_PASSWORD','BKASH_WEBHOOK_SECRET'], configured: env => Boolean(env.BKASH_APP_KEY && env.BKASH_APP_SECRET) },
  { id: 'stripe', name: 'Stripe International Gateway & Elements', riskTier: 'CRITICAL', requiredSecrets: ['STRIPE_PUBLISHABLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET'], configured: env => Boolean(env.STRIPE_SECRET_KEY || env.STRIPE_TEST_SECRET_KEY) },
  { id: 'resend', name: 'Resend Transactional Email API', riskTier: 'HIGH_IMPACT', requiredSecrets: ['RESEND_API_KEY','RESEND_FROM_DOMAIN'], configured: env => Boolean(env.RESEND_API_KEY) },
  { id: 'whatsapp', name: 'Meta WhatsApp Cloud API Gateway', riskTier: 'HIGH_IMPACT', requiredSecrets: ['WHATSAPP_TOKEN','WHATSAPP_PHONE_ID','WHATSAPP_BUSINESS_ACCOUNT_ID'], configured: env => Boolean(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID) },
  { id: 'telegram', name: 'Telegram Emergency Owner Alert Bot', riskTier: 'HIGH_IMPACT', requiredSecrets: ['TELEGRAM_BOT_TOKEN','TELEGRAM_OWNER_CHAT_ID'], configured: env => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_OWNER_CHAT_ID) },
  { id: 'hubspot', name: 'HubSpot / Private CRM Integration', riskTier: 'MEDIUM', requiredSecrets: ['HUBSPOT_ACCESS_TOKEN'], configured: env => Boolean(env.HUBSPOT_ACCESS_TOKEN) },
  { id: 'lead_provider', name: 'Apollo / B2B Lead Enrichment Provider', riskTier: 'LOW', requiredSecrets: ['APOLLO_API_KEY'], configured: env => Boolean(env.APOLLO_API_KEY) }
];

export async function onRequestGet({ request, env = {} }) {
  const auth = await verifyAdminSession(request, env);
  if (!auth.ok) return rejectAdminRequest(request, auth);
  const integrations = PROVIDERS.map(provider => {
    const configured = provider.configured(env);
    return {
      id: provider.id,
      name: provider.name,
      riskTier: provider.riskTier,
      isConfigured: configured,
      status: configured ? 'CONFIGURED_UNVERIFIED' : 'NOT_CONFIGURED',
      requiredSecrets: provider.requiredSecrets,
      environment: configured ? 'CONFIGURED' : 'UNINITIALIZED',
      lastVerified: null
    };
  });
  return adminJson(request, { status: 'INVENTORY_ONLY', integrations, timestamp: new Date().toISOString() });
}

export async function onRequestPost({ request, env = {} }) {
  const auth = await verifyAdminSession(request, env);
  if (!auth.ok) return rejectAdminRequest(request, auth);
  const body = await request.json().catch(() => ({}));
  const provider = PROVIDERS.find(item => item.id === body.provider_id);
  if (!provider || body.action !== 'test_connection') {
    return adminJson(request, { status: 'INVALID_ACTION' }, 400);
  }
  return adminJson(request, {
    status: 'NOT_CONFIGURED',
    code: 'PROVIDER_HEALTH_CHECK_NOT_IMPLEMENTED',
    provider: provider.id,
    credentials_present: provider.configured(env),
    message: 'Secret presence is not proof of provider connectivity. A provider-specific sandbox/live health check is not implemented; no connection was tested.'
  }, 503);
}

export function onRequestOptions({ request }) {
  return adminOptions(request);
}
