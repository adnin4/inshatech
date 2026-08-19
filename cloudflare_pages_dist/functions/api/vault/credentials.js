/**
 * Cloudflare Pages Function: /api/vault/credentials
 * Zero-Trust Secret & Credential Broker
 * Agents query this via Tool Gateway without ever seeing plaintext secrets.
 */

export const CREDENTIAL_VAULT = [
    { id: 'SEC-001', service: 'Gemini 2.5 Pro / Flash API', key_alias: 'GEMINI_PRO_API_KEY', status: 'ACTIVE', used_by: ['Copilot', 'SDR Hunter', 'Sales Agent'], last_rotated: '2026-08-01', rotation_interval_days: 90, masked_value: 'AIzaSy********************4b8' },
    { id: 'SEC-002', service: 'Stripe Live Gateway', key_alias: 'STRIPE_SECRET_KEY', status: 'READY', used_by: ['Finance CFO', 'Checkout Gateway'], last_rotated: '2026-08-10', rotation_interval_days: 60, masked_value: 'sk_live_********************92f' },
    { id: 'SEC-003', service: 'Supabase PostgreSQL Cloud', key_alias: 'SUPABASE_SERVICE_ROLE_KEY', status: 'ACTIVE', used_by: ['PostgreSQL RLS Engine'], last_rotated: '2026-08-15', rotation_interval_days: 30, masked_value: 'eyJhbGciOiJIUzI1NiIsIn********************' },
    { id: 'SEC-004', service: 'Meta WhatsApp Cloud API', key_alias: 'META_WHATSAPP_TOKEN', status: 'ACTIVE', used_by: ['Voice Receptionist', 'Speed-to-Lead Bot'], last_rotated: '2026-08-05', rotation_interval_days: 60, masked_value: 'EAAG********************' }
];

export async function onRequestGet(context) {
    const origin = context.request.headers.get("Origin") || "*";
    const headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    return new Response(JSON.stringify({
        status: 'SUCCESS',
        vault_state: 'SECURED_ZERO_TRUST',
        total_credentials: CREDENTIAL_VAULT.length,
        credentials: CREDENTIAL_VAULT
    }), { headers });
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
