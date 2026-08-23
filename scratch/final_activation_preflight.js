#!/usr/bin/env node
/**
 * Final IINSHA AI-BOS activation preflight.
 * Safe by default: validates presence/shape of configuration without printing secrets
 * and never performs external side effects.
 */

const checks = [
  { name: 'Supabase URL', env: 'SUPABASE_URL', group: 'core' },
  { name: 'Supabase anon key', env: 'SUPABASE_ANON_KEY', group: 'core' },
  { name: 'Admin/session secret', env: 'SESSION_SECRET', group: 'security' },
  { name: 'AI provider key', env: 'GEMINI_API_KEY', group: 'ai' },
  { name: 'Stripe live secret', env: 'STRIPE_SECRET_KEY', group: 'payment', live: true },
  { name: 'Stripe webhook secret', env: 'STRIPE_WEBHOOK_SECRET', group: 'payment', live: true },
  { name: 'bKash app key', env: 'BKASH_APP_KEY', group: 'payment', live: true },
  { name: 'bKash app secret', env: 'BKASH_APP_SECRET', group: 'payment', live: true },
  { name: 'Transactional email provider', env: 'EMAIL_PROVIDER_API_KEY', group: 'notifications', live: true },
  { name: 'CRM provider', env: 'CRM_API_KEY', group: 'crm', live: true },
  { name: 'Lead source provider', env: 'LEAD_SOURCE_API_KEY', group: 'growth', live: true },
  { name: 'Project execution provider', env: 'PROJECT_EXECUTOR_URL', group: 'delivery', live: true },
  { name: 'QA runner endpoint', env: 'QA_RUNNER_URL', group: 'qa', live: true },
  { name: 'Deployment provider', env: 'DEPLOYMENT_PROVIDER_URL', group: 'delivery', live: true },
];

const missing = [];
const present = [];
for (const check of checks) {
  const value = process.env[check.env];
  if (typeof value === 'string' && value.trim()) present.push(check);
  else missing.push(check);
}

const byGroup = (items) => items.reduce((acc, item) => {
  (acc[item.group] ||= []).push(item.env);
  return acc;
}, {});

const result = {
  status: missing.length ? 'NOT_READY' : 'CONFIGURED',
  present_non_secret_names: present.map(x => x.env),
  missing_by_group: byGroup(missing),
  activation_rule: 'Configuration presence is not live verification. Run provider-specific connection tests and record LIVE_VERIFIED evidence before enabling external side effects.',
  external_side_effects_performed: false,
};

console.log(JSON.stringify(result, null, 2));

// Core configuration must exist; live providers are intentionally allowed to be missing
// in development/staging. A production operator should require zero missing entries.
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.SESSION_SECRET) {
  process.exitCode = 2;
}
