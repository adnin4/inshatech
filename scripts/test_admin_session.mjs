import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { verifyAdminSession, isAllowedAdminOrigin } from '../functions/_shared/admin_session.js';

globalThis.crypto = webcrypto;

const SECRET = "unit-test-owner-secret-for-hmac-session";
function encodeBase64Url(value) {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
async function makeToken(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'owner@inshatech.test',
    role: 'owner',
    hierarchy_level: 1,
    mfa_verified: true,
    iat: now,
    exp: now + 3600,
    jti: 'test-session-id',
    ...overrides
  };
  const encoded = encodeBase64Url(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(encoded)));
  const encodedSignature = encodeBase64Url(String.fromCharCode(...signature));
  return encoded + '.' + encodedSignature;
}
function request(token, origin = 'https://inshatech.pages.dev') {
  return new Request('https://inshatech.pages.dev/api/admin/gate', {
    headers: { Authorization: token ? 'Bearer ' + token : '', Origin: origin }
  });
}
const env = { JWT_SECRET: SECRET };

const valid = await verifyAdminSession(request(await makeToken()), env);
assert.equal(valid.ok, true, 'valid owner + MFA token should pass');
assert.equal(valid.user.role, 'owner');

const expired = await verifyAdminSession(request(await makeToken({ exp: Math.floor(Date.now()/1000) - 10 })), env);
assert.equal(expired.status, 'TOKEN_EXPIRED');

const member = await verifyAdminSession(request(await makeToken({ role: 'customer' })), env);
assert.equal(member.status, 'PRIVILEGE_REJECTED');

const noMfa = await verifyAdminSession(request(await makeToken({ mfa_verified: false })), env);
assert.equal(noMfa.status, 'PRIVILEGE_REJECTED');

const badSignature = await verifyAdminSession(request('eyJzdWIiOiJvd25lciJ9.' + 'A'.repeat(43)), env);
assert.equal(badSignature.ok, false);

const missingToken = await verifyAdminSession(request(''), env);
assert.equal(missingToken.status, 'UNAUTHORIZED');

const noSecret = await verifyAdminSession(request(await makeToken()), {});
assert.equal(noSecret.status, 'CONFIGURATION_ERROR');

assert.equal(isAllowedAdminOrigin(request(await makeToken())), true);
assert.equal(isAllowedAdminOrigin(request(await makeToken(), 'https://evil.example')), false);

console.log('Admin session tests: PASS (valid owner, expiry, role, MFA, signature, missing secret, origin).');
