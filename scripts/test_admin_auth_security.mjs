/**
 * scripts/test_admin_auth_security.mjs
 * Comprehensive Security Verification Suite for Admin Authentication & Role Authorization
 * Deterministically tests fail-closed behavior, MFA enforcement, HMAC tampering rejection,
 * token expiry, and endpoint gating.
 */

import fs from 'fs';
import { onRequestPost as handleAuthSession, onRequestGet as handleAuthSessionGet, base32Decode, verifyTotp, computeTotp as computeSessionTotp } from '../functions/api/auth/session.js';
import { onRequestGet as handleAdminGate } from '../functions/api/admin/gate.js';
import { onRequestPost as handleKillswitch } from '../functions/api/workforce/killswitch.js';
import { onRequestPost as handleAuthLogout, onRequestGet as handleAuthLogoutGet } from '../functions/api/auth/logout.js';
import { onRequestPost as handleAdminKillswitch } from '../functions/api/admin/killswitch.js';
import { onRequestGet as handleAdminIntegrations } from '../functions/api/admin/integrations.js';

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

async function generatePbkdf2Hash(password, iterations = 600000) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = [...salt].map(x => x.toString(16).padStart(2, '0')).join('');
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
        key,
        256
    );
    const hashHex = [...new Uint8Array(derived)].map(x => x.toString(16).padStart(2, '0')).join('');
    return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
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
    const mockPasswordHash = await generatePbkdf2Hash(mockAdminPassword, 600000);
    const mockLegacySha256Hash = await sha256(mockAdminPassword);
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

    // Test 12: Adaptive Salted PBKDF2 Password Verification
    {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = [...salt].map(x => x.toString(16).padStart(2, '0')).join('');
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(mockAdminPassword),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        const derived = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
            key,
            256
        );
        const hashHex = [...new Uint8Array(derived)].map(x => x.toString(16).padStart(2, '0')).join('');
        const pbkdf2StoredHash = 'pbkdf2:100000:' + saltHex + ':' + hashHex;

        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: { ...testEnv, ADMIN_PASSWORD_HASH: pbkdf2StoredHash } });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'MFA_REQUIRED',
            'Adaptive salted PBKDF2 password verifies correctly and prompts for MFA');
    }

    // Test 13: OWASP-Recommended 600,000 Iterations PBKDF2 Verification
    {
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = [...salt].map(x => x.toString(16).padStart(2, '0')).join('');
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(mockAdminPassword),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        const derived = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt, iterations: 600000, hash: 'SHA-256' },
            key,
            256
        );
        const hashHex = [...new Uint8Array(derived)].map(x => x.toString(16).padStart(2, '0')).join('');
        const pbkdf2StoredHash = 'pbkdf2:600000:' + saltHex + ':' + hashHex;

        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: { ...testEnv, ADMIN_PASSWORD_HASH: pbkdf2StoredHash } });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'MFA_REQUIRED',
            'OWASP-recommended 600,000 iterations PBKDF2 verifies correctly and prompts for MFA');
    }

    // Test 13B: Legacy Fast-Hash SHA-256 strictly rejected (Zero Legacy Fast-Hash Fallback)
    {
        const req = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: { ...testEnv, ADMIN_PASSWORD_HASH: mockLegacySha256Hash } });
        const data = await res.json();
        assert(res.status === 401 && data.status === 'INVALID_CREDENTIALS',
            'Legacy unsalted SHA-256 hash is rejected with HTTP 401 INVALID_CREDENTIALS');
    }

    // Test 14: Cookie-Based Session Authentication on /api/admin/gate -> 200 AUTHORIZED
    {
        const req = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Cookie': `__Host-iinsha_admin_session=${validSessionToken}` }
        });
        const res = await handleAdminGate({ request: req, env: testEnv });
        const data = await res.json();
        assert(res.status === 200 && data.authenticated === true && data.status === 'AUTHORIZED',
            'HttpOnly Cookie-based session token grants HTTP 200 AUTHORIZED on /api/admin/gate');
    }

    // Test 15: Session Revocation via /api/auth/logout -> Subsequent Requests Blocked with TOKEN_REVOKED
    {
        const logoutReq = new Request('https://inshatech.pages.dev/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${validSessionToken}` }
        });
        const logoutRes = await handleAuthLogout({ request: logoutReq, env: testEnv });
        const logoutData = await logoutRes.json();
        assert(logoutRes.status === 200 && logoutData.status === 'LOGGED_OUT',
            '/api/auth/logout invalidates session and clears cookies');

        // Subsequent call with the revoked token must fail
        const postRevokeReq = new Request('https://inshatech.pages.dev/api/admin/gate', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${validSessionToken}` }
        });
        const postRevokeRes = await handleAdminGate({ request: postRevokeReq, env: testEnv });
        const postRevokeData = await postRevokeRes.json();
        assert(postRevokeRes.status === 401 && postRevokeData.status === 'TOKEN_REVOKED',
            'Revoked session token is rejected with HTTP 401 TOKEN_REVOKED');
    }

    // Test 16: Admin Killswitch Endpoint (/api/admin/killswitch) Enforces Session Auth
    {
        const unauthReq = new Request('https://inshatech.pages.dev/api/admin/killswitch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ENGAGE_KILL_SWITCH' })
        });
        const unauthRes = await handleAdminKillswitch({ request: unauthReq, env: testEnv });
        const unauthData = await unauthRes.json();
        assert(unauthRes.status === 401 && unauthData.status === 'UNAUTHORIZED',
            'Unauthenticated /api/admin/killswitch fails closed with HTTP 401 UNAUTHORIZED');

        // Generate fresh valid session token
        const freshTotp = await computeTotp(mockMfaSecret);
        const loginReq = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: freshTotp })
        });
        const loginRes = await handleAuthSession({ request: loginReq, env: testEnv });
        const loginData = await loginRes.json();
        const freshToken = loginData.session_token;

        const authReq = new Request('https://inshatech.pages.dev/api/admin/killswitch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${freshToken}`
            },
            body: JSON.stringify({ action: 'STATUS' })
        });
        const authRes = await handleAdminKillswitch({ request: authReq, env: testEnv });
        const authData = await authRes.json();
        assert(authRes.status === 200 && authData.status === 'KILLSWITCH_STATUS',
            'Authenticated /api/admin/killswitch succeeds with HTTP 200 KILLSWITCH_STATUS');
    }

    // Test 17: Admin Integrations Endpoint (/api/admin/integrations) Enforces Session Auth & Truthful State
    {
        const unauthReq = new Request('https://inshatech.pages.dev/api/admin/integrations', {
            method: 'GET'
        });
        const unauthRes = await handleAdminIntegrations({ request: unauthReq, env: testEnv });
        const unauthData = await unauthRes.json();
        assert(unauthRes.status === 401 && unauthData.status === 'UNAUTHORIZED',
            'Unauthenticated /api/admin/integrations fails closed with HTTP 401 UNAUTHORIZED');

        // Generate fresh token
        const freshTotp = await computeTotp(mockMfaSecret);
        const loginReq = new Request('https://inshatech.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: freshTotp })
        });
        const loginRes = await handleAuthSession({ request: loginReq, env: testEnv });
        const loginData = await loginRes.json();
        const freshToken = loginData.session_token;

        const authReq = new Request('https://inshatech.pages.dev/api/admin/integrations', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${freshToken}` }
        });
        const authRes = await handleAdminIntegrations({ request: authReq, env: testEnv });
        const authData = await authRes.json();
        assert(authRes.status === 200 && authData.status === 'SUCCESS' && Array.isArray(authData.integrations),
            'Authenticated /api/admin/integrations succeeds with HTTP 200 and truthful provider array');
        
        // Ensure no provider falsely claims LIVE_VERIFIED without credentials
        const falseVerified = authData.integrations.find(i => i.status === 'LIVE_VERIFIED');
        assert(!falseVerified, 'Zero unverified integrations claim LIVE_VERIFIED without live credentials');
    }

    // -------------------------------------------------------------------------
    // TEST 18: GET /api/auth/session and GET /api/auth/logout -> 405 METHOD_NOT_ALLOWED
    // -------------------------------------------------------------------------
    {
        const getSessionRes = await handleAuthSessionGet({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/session', { method: 'GET' })
        });
        assert(getSessionRes.status === 405, 'GET /api/auth/session returns 405 METHOD_NOT_ALLOWED instead of HTML 200');

        const getLogoutRes = await handleAuthLogoutGet({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/logout', { method: 'GET' })
        });
        assert(getLogoutRes.status === 405, 'GET /api/auth/logout returns 405 METHOD_NOT_ALLOWED');
    }

    // -------------------------------------------------------------------------
    // TEST 19: Out-of-bounds PBKDF2 iteration count fails safely with 401
    // -------------------------------------------------------------------------
    {
        const badIterEnv = {
            ...testEnv,
            ADMIN_PASSWORD_HASH: 'pbkdf2:99999999:00112233445566778899aabbccddeeff:00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff'
        };
        const req = new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword })
        });
        const res = await handleAuthSession({ request: req, env: badIterEnv });
        assert(res.status === 401, 'Out-of-bounds PBKDF2 iteration hash rejects with 401 INVALID_CREDENTIALS');
    }

    // -------------------------------------------------------------------------
    // TEST 20: TOTP Replay Protection & Fail-Closed SECURITY_COORDINATOR
    // -------------------------------------------------------------------------
    {
        const seenTotp = new Set();
        const revokedJtis = new Set();
        const mockCoordinatorEnv = {
            ...testEnv,
            SECURITY_COORDINATOR: {
                idFromName: (name) => name,
                get: () => ({
                    fetch: async (url, init = {}) => {
                        const pathname = new URL(url).pathname;
                        if (pathname === '/mfa-verify') {
                            const body = JSON.parse(init.body || '{}');
                            const key = `${body.step}:${body.code}`;
                            if (seenTotp.has(key)) {
                                return new Response(JSON.stringify({ verified: false }), { status: 409 });
                            }
                            seenTotp.add(key);
                            return new Response(JSON.stringify({ verified: true }), { status: 200 });
                        }
                        if (pathname === '/revoke') {
                            const body = JSON.parse(init.body || '{}');
                            revokedJtis.add(body.jti);
                            return new Response(JSON.stringify({ revoked: true }), { status: 200 });
                        }
                        if (pathname === '/is-revoked') {
                            const jti = new URL(url).searchParams.get('jti');
                            return new Response(JSON.stringify({ is_revoked: revokedJtis.has(jti) }), { status: 200 });
                        }
                        return new Response('Not found', { status: 404 });
                    }
                })
            }
        };

        const validTotp = await computeTotp(mockMfaSecret);
        const firstRes = await handleAuthSession({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: validTotp })
            }),
            env: mockCoordinatorEnv
        });
        assert(firstRes.status === 200, 'First TOTP claim succeeds with 200');
        const firstData = await firstRes.json();

        const replayRes = await handleAuthSession({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: validTotp })
            }),
            env: mockCoordinatorEnv
        });
        const replayData = await replayRes.json();
        assert(replayRes.status === 401 && replayData.status === 'REPLAY_DETECTED', 'Immediate TOTP code reuse rejected with 401 REPLAY_DETECTED');

        // Unreachable SECURITY_COORDINATOR fails closed on gate check (503 SECURITY_AUTHORITY_UNAVAILABLE),
        // login (503), and logout (503), distinct from an actually revoked session (401 TOKEN_REVOKED).
        const brokenCoordinatorEnv = {
            ...testEnv,
            SECURITY_COORDINATOR: {
                idFromName: () => 'global',
                get: () => ({ fetch: async () => new Response('DO error', { status: 500 }) })
            }
        };

        const brokenGateRes = await handleAdminGate({
            request: new Request('https://inshatech-b6b.pages.dev/api/admin/gate', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${firstData.session_token}` }
            }),
            env: brokenCoordinatorEnv
        });
        const brokenGateData = await brokenGateRes.json();
        assert(
            brokenGateRes.status === 503 && brokenGateData.status === 'SECURITY_AUTHORITY_UNAVAILABLE',
            'Broken SECURITY_COORDINATOR fails closed on gate check with HTTP 503 SECURITY_AUTHORITY_UNAVAILABLE (distinct from TOKEN_REVOKED)'
        );

        const brokenLoginRes = await handleAuthSession({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: validTotp })
            }),
            env: brokenCoordinatorEnv
        });
        assert(brokenLoginRes.status === 503, 'Broken SECURITY_COORDINATOR fails closed on login with HTTP 503');

        const brokenLogoutRes = await handleAuthLogout({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${firstData.session_token}` }
            }),
            env: brokenCoordinatorEnv
        });
        assert(brokenLogoutRes.status === 503, 'Broken SECURITY_COORDINATOR fails closed on logout with HTTP 503');

        // Actual revoked session via working coordinator returns 401 TOKEN_REVOKED
        const workingLogoutRes = await handleAuthLogout({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/logout', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${firstData.session_token}` }
            }),
            env: mockCoordinatorEnv
        });
        assert(workingLogoutRes.status === 200, 'Logout succeeds via working SECURITY_COORDINATOR');

        const revokedGateRes = await handleAdminGate({
            request: new Request('https://inshatech-b6b.pages.dev/api/admin/gate', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${firstData.session_token}` }
            }),
            env: mockCoordinatorEnv
        });
        const revokedGateData = await revokedGateRes.json();
        assert(
            revokedGateRes.status === 401 && revokedGateData.status === 'TOKEN_REVOKED',
            'Revoked session token rejected with HTTP 401 TOKEN_REVOKED (distinct from 503 DO outage)'
        );
    }

    // -------------------------------------------------------------------------
    // TEST 21: Arbitrary *.pages.dev Origin Rejected in CORS
    // -------------------------------------------------------------------------
    {
        const evilOriginReq = new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
            method: 'GET',
            headers: { 'Origin': 'https://evil-attacker.pages.dev' }
        });
        const evilRes = await handleAuthSessionGet({ request: evilOriginReq });
        assert(evilRes.headers.get('Access-Control-Allow-Origin') !== 'https://evil-attacker.pages.dev',
            'CORS never reflects arbitrary third-party *.pages.dev origins');
    }

    // -------------------------------------------------------------------------
    // TEST 22: RFC 6238 Base32 Google Authenticator Key Interoperability
    // -------------------------------------------------------------------------
    {
        // Standard RFC 4648 Base32 Secret used in Google Authenticator provisioning
        const base32Secret = 'JBSWY3DPEHPK3PXP'; // Base32 for 'Hello!\xde\xad\xbe\xef'
        const base32Bytes = base32Decode(base32Secret);
        assert(base32Bytes instanceof Uint8Array && base32Bytes.length === 10,
            'Base32 decoder converts standard RFC 4648 authenticator string to exact Uint8Array bytes');

        // Verify invalid Base32 strings return null safely
        assert(base32Decode('INVALID890!') === null, 'Malformed Base32 characters rejected cleanly');
        assert(base32Decode('') === null, 'Empty Base32 rejected cleanly');

        // Test TOTP generation and verification against decoded binary key
        const key = await crypto.subtle.importKey(
            'raw',
            base32Bytes,
            { name: 'HMAC', hash: 'SHA-1' },
            false,
            ['sign']
        );
        const counter = Math.floor(Date.now() / 30000);
        const ab = new ArrayBuffer(8);
        new DataView(ab).setBigUint64(0, BigInt(counter));
        const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, ab));
        const offset = sig[sig.length - 1] & 15;
        const code = ((sig[offset] & 127) << 24 | (sig[offset + 1] << 16) | (sig[offset + 2] << 8) | sig[offset + 3]) % 1000000;
        const validBase32Totp = String(code).padStart(6, '0');

        const verifyResult = await verifyTotp(validBase32Totp, base32Secret);
        assert(verifyResult.valid === true && verifyResult.matchedStep === counter,
            'Standard Base32 Google Authenticator TOTP token verified with 100% cryptographic accuracy');
    }

    // -------------------------------------------------------------------------
    // TEST 23: Fail-Closed Security Coordinator Enforcement in Staging/Production
    // -------------------------------------------------------------------------
    {
        // When ENVIRONMENT is staging or production, missing coordinator MUST return HTTP 503
        const base32Secret = 'JBSWY3DPEHPK3PXP';
        const prodEnvWithoutCoordinator = {
            ...testEnv,
            ENVIRONMENT: 'staging',
            MFA_SECRET: base32Secret
        };
        const currentTotp = await computeSessionTotp(base32Secret, Math.floor(Date.now() / 1000));
        const res = await handleAuthSession({
            request: new Request('https://inshatech-b6b.pages.dev/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mockAdminEmail, password: mockAdminPassword, mfa_token: currentTotp })
            }),
            env: prodEnvWithoutCoordinator
        });
        const data = await res.json();
        assert(res.status === 503 && data.status === 'SECURITY_AUTHORITY_UNAVAILABLE',
            'Missing SecurityCoordinator binding in staging environment strictly fails closed with HTTP 503');
    }

    // -------------------------------------------------------------------------
    // TEST 24: Fail-Closed Shared Session Revocation Authority in Staging/Production
    // -------------------------------------------------------------------------
    {
        // Gate check in staging environment without DO or KV must return 503 SECURITY_AUTHORITY_UNAVAILABLE
        const stagingEnvWithoutRevocationAuthority = {
            ...testEnv,
            ENVIRONMENT: 'staging'
        };
        const freshUnrevokedToken = await generateSignedToken({
            sub: mockAdminEmail,
            role: 'owner',
            hierarchy_level: 1,
            mfa_verified: true,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            jti: crypto.randomUUID()
        }, mockJwtSecret);

        const res = await handleAdminGate({
            request: new Request('https://inshatech-b6b.pages.dev/api/admin/gate', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${freshUnrevokedToken}` }
            }),
            env: stagingEnvWithoutRevocationAuthority
        });
        const data = await res.json();
        assert(res.status === 503 && data.status === 'SECURITY_AUTHORITY_UNAVAILABLE',
            'Missing shared revocation authority in staging strictly fails closed with HTTP 503 SECURITY_AUTHORITY_UNAVAILABLE');
    }

    // -------------------------------------------------------------------------
    // TEST 25: RFC 6238 Appendix B Official Known-Answer Test Vectors (SHA-1)
    // -------------------------------------------------------------------------
    {
        const rfcSecret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'; // ASCII '12345678901234567890'
        const rfcVectors = [
            { timeSec: 59, expected8: '94287082', expected6: '287082' },
            { timeSec: 1111111109, expected8: '07081804', expected6: '081804' },
            { timeSec: 1111111111, expected8: '14050471', expected6: '050471' },
            { timeSec: 1234567890, expected8: '89005924', expected6: '005924' },
            { timeSec: 2000000000, expected8: '69279037', expected6: '279037' },
            { timeSec: 20000000000, expected8: '65353130', expected6: '353130' }
        ];

        for (const vec of rfcVectors) {
            const computed8 = await computeSessionTotp(rfcSecret, vec.timeSec, 8);
            const computed6 = await computeSessionTotp(rfcSecret, vec.timeSec, 6);
            assert(computed8 === vec.expected8,
                `RFC 6238 Appendix B vector t=${vec.timeSec}s 8-digit OTP matches: ${computed8}`);
            assert(computed6 === vec.expected6,
                `RFC 6238 Appendix B vector t=${vec.timeSec}s 6-digit OTP matches: ${computed6}`);

            // Independent verification via verifyTotp
            const res6 = await verifyTotp(vec.expected6, rfcSecret, {
                timestamp: vec.timeSec * 1000,
                digits: 6,
                allowDrift: false
            });
            assert(res6.valid === true,
                `RFC 6238 verifyTotp accepts exact expected OTP ${vec.expected6} at t=${vec.timeSec}s`);
        }
    }

    // -------------------------------------------------------------------------
    // TEST 26: Strict RFC 4648 Base32 Padding and Alphabet Validation
    // -------------------------------------------------------------------------
    {
        // Valid RFC 4648 decode
        const decoded = base32Decode('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
        assert(decoded instanceof Uint8Array && decoded.length === 20,
            'RFC 4648 valid Base32 decodes to exact 20-byte seed');

        // Invalid characters outside A-Z, 2-7
        assert(base32Decode('GEZDGNBV123') === null, 'Base32 rejects digit 1');
        assert(base32Decode('GEZDGNBV890') === null, 'Base32 rejects digits 8, 9, 0');
        assert(base32Decode('GEZD$NBV') === null, 'Base32 rejects special symbol $');

        // Invalid padding constraints (only 0, 1, 3, 4, 6 '=' allowed in Base32)
        assert(base32Decode('MZXW6Y==') === null, 'Base32 rejects invalid 2-pad format');
        assert(base32Decode('MZX=====') === null, 'Base32 rejects invalid 5-pad format');
        assert(base32Decode('MZX=W6==') === null, 'Base32 rejects padding inside character string');
        assert(base32Decode('M') === null, 'Base32 rejects incomplete 1-char unpadded block');
        assert(base32Decode('MZX') === null, 'Base32 rejects incomplete 3-char unpadded block');
        assert(base32Decode('MZXW6Y') === null, 'Base32 rejects incomplete 6-char unpadded block');

        // Valid padding
        const paddedVal = base32Decode('MZXW6YTB'); // "foobar" (6 chars = 48 bits = 6 bytes = 8 Base32 chars, no pad)
        assert(paddedVal instanceof Uint8Array && paddedVal.length === 5,
            'Base32 decodes standard 8-character block to 5 bytes');
    }

    // -------------------------------------------------------------------------
    // TEST 27: Authoritative Durable Object Enforcement (KV Cache Cannot Replace Missing DO in Production)
    // -------------------------------------------------------------------------
    {
        // In staging/production, having KV cache without DO must strictly fail closed with 503
        const stagingEnvWithKvOnly = {
            ...testEnv,
            ENVIRONMENT: 'staging',
            SECURITY_COORDINATOR: null,
            REVOCATION_KV: {
                get: async () => null,
                put: async () => {}
            }
        };
        const freshToken = await generateSignedToken({
            sub: mockAdminEmail,
            role: 'owner',
            hierarchy_level: 1,
            mfa_verified: true,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            jti: crypto.randomUUID()
        }, mockJwtSecret);

        const res = await handleAdminGate({
            request: new Request('https://inshatech-b6b.pages.dev/api/admin/gate', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${freshToken}` }
            }),
            env: stagingEnvWithKvOnly
        });
        const data = await res.json();
        assert(res.status === 503 && data.status === 'SECURITY_AUTHORITY_UNAVAILABLE',
            'KV cache without Durable Object in staging strictly fails closed with HTTP 503 (Durable Object required for strong consistency)');
    }

    // -------------------------------------------------------------------------
    // TEST 28: Admin UI Accessible Dialog Semantics & Inert DOM Isolation
    // -------------------------------------------------------------------------
    {
        const adminHtml = fs.readFileSync('admin.html', 'utf-8');
        assert(adminHtml.includes('id="admin-auth-overlay" role="dialog" aria-modal="true"'),
            'admin.html enforces accessible role="dialog" and aria-modal="true" on auth guardian');
        assert(adminHtml.includes('id="admin-main-content" inert aria-hidden="true"'),
            'admin.html enforces inert and aria-hidden="true" on unauthenticated background controls');
        assert(adminHtml.includes('aria-label="Commander Email"') && adminHtml.includes('aria-label="Master Commander Password"'),
            'admin.html provides explicit accessible labels for credential inputs');
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
