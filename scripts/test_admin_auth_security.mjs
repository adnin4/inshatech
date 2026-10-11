/**
 * scripts/test_admin_auth_security.mjs
 * Comprehensive Security Verification Suite for Admin Authentication & Role Authorization
 * Deterministically tests fail-closed behavior, MFA enforcement, HMAC tampering rejection,
 * token expiry, and endpoint gating.
 */

import { onRequestPost as handleAuthSession } from '../functions/api/auth/session.js';
import { onRequestGet as handleAdminGate } from '../functions/api/admin/gate.js';
import { onRequestPost as handleKillswitch } from '../functions/api/workforce/killswitch.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
    totalTests++;
    if (!condition) {
        console.error(`❌ [FAIL] ${message}`);
        throw new Error(`Test assertion failed: ${message}`);
    }
    passedTests++;
    console.log(`🟢 [PASS] ${message}`);
}

async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}

function b64(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function generateSignedToken(payload, secret) {
    const body = b64(JSON.stringify(payload));
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = b64(String.fromCharCode(...new Uint8Array(
        await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
    )));
    return `${body}.${sig}`;
}

async function computeTotp(secret, offsetSeconds = 0) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );
    const counter = Math.floor((Date.now() + (offsetSeconds * 1000)) / 30000);
    const ab = new ArrayBuffer(8);
    new DataView(ab).setBigUint64(0, BigInt(counter));
    const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab));
    const offset = sig[sig.length - 1] & 15;
    const code = ((sig[offset] & 127) << 24 | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]) % 1000000;
    return String(code).padStart(6, '0');
}

async function runTestSuite() {
    console.log('================================================================================');
    console.log('🛡️ IINSHA AI-BOS: ADMIN AUTH & GATE SECURITY TEST SUITE');
    console.log('================================================================================\n');

    const mockAdminEmail = 'admin@inshatech.com';
    const mockAdminPassword = 'TestSuperAdminKey2026!';
    const mockPasswordHash = await sha256(mockAdminPassword);
    const mockJwtSecret = 'mock-jwt-secret-key-for-test-suite-minimum-32-chars';
    const mockMfaSecret = 'TESTMFASECRET123';

    const testEnv = {
        ADMIN_EMAIL: mockAdminEmail,
        ADMIN_PASSWORD_HASH: mockPasswordHash,
        JWT_SECRET: mockJwtSecret,
        MFA_SECRET: mockMfaSecret
    };

    // Test 1: Missing Server Configuration -> 503 CONFIGURATION_ERROR
    {
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: {} });
        const data = await res.json();
        assert(res.status === 503 && data.status === 'CONFIGURATION_ERROR',
            'Missing server secrets fail-closed with HTTP 503 CONFIGURATION_ERROR');
    }

    // Test 2: Invalid Admin Email or Password -> 401 INVALID_CREDENTIALS
    {
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'wrong@email.com', password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'INVALID_CREDENTIALS',
            'Wrong email/password fails closed with HTTP 401 INVALID_CREDENTIALS');
    }

    // Test 3: Valid Credentials Without MFA Token -> 401 MFA_REQUIRED
    {
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'MFA_REQUIRED',
            'Valid credentials without MFA token prompt HTTP 401 MFA_REQUIRED');
    }

    // Test 4: Valid Credentials With Invalid MFA Code -> 401 MFA_REQUIRED
    {
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: '000000' })
        });
        const res = await handleAuthSession({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'MFA_REQUIRED',
            'Invalid MFA token is rejected with HTTP 401 MFA_REQUIRED');
    }

    // Test 5: Valid Credentials With Valid TOTP Code -> 200 AUTHENTICATED
    let validSessionToken = '';
    {
        const currentTotp = await computeTotp(mockMfaSecret);
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: currentTotp })
        });
        const res = await handleAuthSession({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 200 && data.status === 'AUTHENTICATED' && !!data.session_token,
            'Valid credentials + valid TOTP returns HTTP 200 AUTHENTICATED with signed token');
        validSessionToken = data.session_token;
    }

    // Test 6: Verify Valid Session Token on /api/admin/gate -> 200 AUTHORIZED
    {
        const req = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${validSessionToken}` }
        });
        const res = await handleAdminGate({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 200 && data.authenticated === true && data.status === 'AUTHORIZED',
            'Signed session token grants HTTP 200 AUTHORIZED on /api/admin/gate');
    }

    // Test 7: Tampered Token Signature on /api/admin/gate -> 401 FORGERY_REJECTED
    {
        const tamperedToken = validSessionToken.slice(0, -6) + 'XXXXXX';
        const req = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tamperedToken}` }
        });
        const res = await handleAdminGate({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'FORGERY_REJECTED',
            'Tampered token signature is detected and rejected with HTTP 401 FORGERY_REJECTED');
    }

    // Test 8: Expired Session Token -> 401 TOKEN_EXPIRED
    {
        const now = Math.floor(Date.now() / 1000);
        const expiredPayload = {
            sub: mockAdminEmail,
            role: 'owner',
            hierarchy_level: 1,
            mfa_verified: true,
            iat: now - 7200,
            exp: now - 3600 // Expired 1 hour ago
        };
        const expiredToken = await generateSignedToken(expiredPayload, mockJwtSecret);
        const req = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${expiredToken}` }
        });
        const res = await handleAdminGate({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'TOKEN_EXPIRED',
            'Expired session token is rejected with HTTP 401 TOKEN_EXPIRED');
    }

    // Test 9: Non-Owner Role / Insufficient Privilege -> 403 PRIVILEGE_REJECTED
    {
        const now = Math.floor(Date.now() / 1000);
        const viewerPayload = {
            sub: 'viewer@inshatech.com',
            role: 'viewer', // Insufficient role
            hierarchy_level: 4,
            mfa_verified: true,
            iat: now,
            exp: now + 3600
        };
        const viewerToken = await generateSignedToken(viewerPayload, mockJwtSecret);
        const req = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${viewerToken}` }
        });
        const res = await handleAdminGate({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 403 && data.status === 'PRIVILEGE_REJECTED',
            'Non-owner role is rejected with HTTP 403 PRIVILEGE_REJECTED');
    }

    // Test 10: Unauthenticated Protected Mutation (/api/workforce/killswitch) -> 401/403
    {
        const unauthReq = new Request('https://inshatech.pages.dev/api/workforce/killswitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target: 'system', action: 'pause' })
        });
        const res = await handleKillswitch({ request: unauthReq, env: testEnv });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'UNAUTHORIZED',
            'Unauthenticated workforce killswitch mutation is rejected with HTTP 401 UNAUTHORIZED');
    }

    // Test 11: Authenticated Protected Mutation (/api/workforce/killswitch) -> Allowed
    {
        const authReq = new Request('https://inshatech.pages.dev/api/workforce/killswitch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${validSessionToken}`
            },
            body: JSON.stringify({ target: 'system', action: 'pause' })
        });
        const res = await handleKillswitch({ request: authReq, env: testEnv });
        const data = await res.json();
        assert(res.status === 200 && data.status === 'SUCCESS',
            'Authorized owner token succeeds on workforce killswitch mutation');
    }

    console.log('\n================================================================================');
    console.log(`📊 RESULTS: ${passedTests}/${totalTests} SECURITY TESTS PASSED (100%)`);
    console.log('STATUS: ADMIN AUTH & SERVER GATING FULLY SECURED & FAIL-CLOSED');
    console.log('================================================================================\n');
}

runTestSuite().catch(err => {
    console.error('Fatal test error:', err);
    process.exit(1);
});
