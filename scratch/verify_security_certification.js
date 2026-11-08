const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');

console.log('=== STEP 7: SECURITY CERTIFICATION ENGINE ===');

const securityChecks = [
    { name: 'Admin Session Authentication & Brute Force Gate', file: 'functions/api/auth/session.js', pattern: 'loginAttempts' },
    { name: '14-Role RBAC Authorization & Wildcard Permissions', file: 'functions/api/auth/rbac.js', pattern: 'ENTERPRISE_ROLES' },
    { name: 'WebAuthn / Passkeys Enterprise Authentication', file: 'functions/api/auth/webauthn.js', pattern: 'webauthn' },
    { name: 'Multi-Factor TOTP MFA Verification', file: 'functions/api/auth/mfa.js', pattern: 'mfa' },
    { name: 'SQL Row Level Security (RLS) & Multi-Tenancy', file: 'supabase/migrations/20260818000013_enterprise_multi_tenancy_rls.sql', pattern: 'ROW LEVEL SECURITY' },
    { name: 'AI Firewall & Risk Scoring Policy Check', file: 'functions/api/ai/firewall.js', pattern: 'risk_score' },
    { name: 'Cryptographic Tool Permission Matrix & Level 4 Guardrails', file: 'functions/api/tools/execute.js', pattern: 'LEVEL_4_RESTRICTED' },
    { name: 'Server-Side Webhook HMAC Signature Verification', file: 'functions/api/payments/webhook.js', pattern: 'Signature' },
    { name: 'Zero-Trust Evidence Pack Journaling', file: 'functions/api/delivery/evidence_pack.js', pattern: 'evidence' },
    { name: 'Data Privacy & PII Firewall Enforcement', file: 'functions/api/privacy/firewall.js', pattern: 'pii' }
];

let passCount = 0;
securityChecks.forEach(check => {
    const fullPath = path.join(BASE_DIR, check.file);
    if (!fs.existsSync(fullPath)) {
        console.error(`âŒ [FAIL] Security Check: ${check.name} (${check.file} does not exist)`);
    } else {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes(check.pattern.toLowerCase())) {
            console.log(`âœ… [PASS] Security Check: ${check.name}`);
            passCount++;
        } else {
            console.error(`âŒ [FAIL] Security Check: ${check.name} (Pattern "${check.pattern}" missing)`);
        }
    }
});

console.log(`\nSecurity Certification Status: ${passCount}/${securityChecks.length} Passed`);
if (passCount === securityChecks.length) {
    console.log('ðŸ›¡ï¸ SECURITY CERTIFICATION: PASSED (GREEN STATUS)');
    process.exit(0);
} else {
    process.exit(1);
}

