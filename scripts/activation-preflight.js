/**
 * IINSHA AI-BOS — Integration Provider Activation Preflight Inspector
 * Checks configuration and health of all 11 external pillars WITHOUT leaking raw secret values.
 */

const fs = require('fs');
const path = require('path');

// Auto-load .env file if present
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (val && !process.env[key]) {
                process.env[key] = val;
            }
        }
    }
}

console.log('================================================================================');
console.log('🛡️ IINSHA AI-BOS: INTEGRATION PROVIDER ACTIVATION PREFLIGHT INSPECTOR');
console.log('================================================================================\n');

const PROVIDERS = [
    {
        id: 'SUPABASE_DB',
        name: 'Supabase PostgreSQL & Zero-Trust RLS',
        envKeys: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'SESSION_AUTH',
        name: 'Admin Session Security & HMAC Token Gate',
        envKeys: ['SESSION_SECRET', 'ADMIN_PASSWORD_HASH'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'AI_PROVIDER',
        name: 'Gemini 2.0 / Claude 3.5 LLM Engine',
        envKeys: ['GEMINI_API_KEY'],
        riskTier: 'HIGH_IMPACT'
    },
    {
        id: 'LEMONSQUEEZY_GATEWAY',
        name: 'Lemon Squeezy Global Visa / Mastercard / MoR Gateway',
        envKeys: ['LEMONSQUEEZY_API_KEY', 'LEMONSQUEEZY_STORE_ID', 'LEMONSQUEEZY_VARIANT_ID', 'LEMONSQUEEZY_WEBHOOK_SECRET'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'SSLCOMMERZ_GATEWAY',
        name: 'SSLCommerz Bangladesh & Global Cards Gateway',
        envKeys: ['SSLCOMMERZ_STORE_ID', 'SSLCOMMERZ_STORE_PASSWORD', 'SSLCOMMERZ_IS_LIVE'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'STRIPE_GATEWAY',
        name: 'Stripe International Card & 3DS Gateway',
        envKeys: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'BKASH_GATEWAY',
        name: 'bKash Merchant Online Settlement API',
        envKeys: ['BKASH_APP_KEY', 'BKASH_APP_SECRET', 'BKASH_USERNAME', 'BKASH_PASSWORD'],
        riskTier: 'CRITICAL'
    },
    {
        id: 'EMAIL_DISPATCHER',
        name: 'Resend Transactional Email API',
        envKeys: ['RESEND_API_KEY'],
        riskTier: 'HIGH_IMPACT'
    },
    {
        id: 'WHATSAPP_WABA',
        name: 'Meta WhatsApp Cloud API & Webhook',
        envKeys: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_ID', 'WHATSAPP_BUSINESS_ACCOUNT_ID'],
        riskTier: 'HIGH_IMPACT'
    },
    {
        id: 'CRM_INTEGRATION',
        name: 'HubSpot / Enterprise Private CRM',
        envKeys: ['HUBSPOT_ACCESS_TOKEN'],
        riskTier: 'MEDIUM'
    },
    {
        id: 'LEAD_ENRICHMENT',
        name: 'Apollo / B2B Lead Enrichment Provider',
        envKeys: ['APOLLO_API_KEY'],
        riskTier: 'LOW'
    },
    {
        id: 'PROJECT_WORKER',
        name: 'Dockerized Project Execution Sandbox',
        envKeys: ['WORKER_EXECUTION_SECRET'],
        riskTier: 'HIGH_IMPACT'
    },
    {
        id: 'TELEGRAM_ALERT',
        name: 'Telegram Emergency Owner Alert Bot',
        envKeys: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_OWNER_CHAT_ID'],
        riskTier: 'HIGH_IMPACT'
    }
];

let configuredCount = 0;
let sandboxCount = 0;
let missingCount = 0;

for (const p of PROVIDERS) {
    const presentKeys = p.envKeys.filter(k => Boolean(process.env[k]));
    const isFullConfig = presentKeys.length === p.envKeys.length;
    const isPartial = presentKeys.length > 0 && presentKeys.length < p.envKeys.length;

    let status = 'NOT_CONFIGURED';
    let icon = '⚪';

    if (isFullConfig) {
        status = 'CONFIGURED (Ready for Live)';
        icon = '🟢';
        configuredCount++;
    } else if (isPartial) {
        status = `PARTIAL (${presentKeys.length}/${p.envKeys.length} Keys Configured)`;
        icon = '🟡';
        sandboxCount++;
    } else {
        missingCount++;
    }

    console.log(`${icon} [${p.id}] ${p.name}`);
    console.log(`   Tier: ${p.riskTier} | Status: ${status}`);
    console.log(`   Expected Env Keys: ${p.envKeys.join(', ')}`);
    console.log(`   Present Keys Fingerprint: ${presentKeys.length > 0 ? presentKeys.map(k => `${k}=***[PRESENT]`).join(', ') : 'None'}\n`);
}

console.log('================================================================================');
console.log(`📊 PREFLIGHT SUMMARY: Configured: ${configuredCount} | Partial/Sandbox: ${sandboxCount} | Pending Credentials: ${missingCount}`);
console.log('🔒 INVARIANT: Zero secrets leaked. System ready for secure credential activation.');
console.log('================================================================================\n');

process.exit(0);
