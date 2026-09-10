/**
 * Test Release Identity Engine Suite
 * Verifies multi-SHA parity, missing-field fail-closed behavior, branch authority,
 * formatting, and falsification resistance.
 */

import { isValidSha, normalizeSha, verifyReleaseIdentity } from '../functions/_shared/release_identity.js';
import assert from 'node:assert';

console.log('Running test_release_identity.mjs...');

const testSha = '00918c5072b1a0c19c2606ec74096ea651900eea';
const otherSha = '1111111111111111111111111111111111111111';

// 1. Validation and normalization
assert.strictEqual(isValidSha(testSha), true);
assert.strictEqual(isValidSha('00918c5'), false, 'short SHAs must not be release-authoritative');
assert.strictEqual(isValidSha('INVALID_SHA_XYZ'), false);
assert.strictEqual(isValidSha(''), false);
assert.strictEqual(
    normalizeSha(`  ${testSha.toUpperCase()}  `),
    testSha
);
assert.strictEqual(normalizeSha(null), null);

// 2. Full parity check
const fullParity = verifyReleaseIdentity({
    source_sha: testSha,
    build_sha: testSha,
    deployment_sha: testSha,
    runtime_sha: testSha,
    branch: 'master'
});
assert.strictEqual(fullParity.verified, true);
assert.strictEqual(fullParity.parity_status, 'FULL_PARITY_VERIFIED');
assert.deepStrictEqual(fullParity.missing_fields, []);
assert.strictEqual(fullParity.branch.matches, true);

// 3. Mismatch detection
const mismatch = verifyReleaseIdentity({
    source_sha: testSha,
    build_sha: testSha,
    deployment_sha: otherSha,
    runtime_sha: testSha,
    branch: 'master'
});
assert.strictEqual(mismatch.verified, false);
assert.strictEqual(mismatch.parity_status, 'MISMATCH_DETECTED');

// 4. Missing identity fields must never be backfilled from deployment SHA
const missing = verifyReleaseIdentity({ deployment_sha: testSha, branch: 'master' });
assert.strictEqual(missing.verified, false);
assert.strictEqual(missing.parity_status, 'MISSING_IDENTITY_FIELDS');
assert.deepStrictEqual(missing.missing_fields.sort(), [
    'build_sha',
    'runtime_sha',
    'source_sha'
]);

// 5. Non-canonical branches are never production-authoritative
const wrongBranch = verifyReleaseIdentity({
    source_sha: testSha,
    build_sha: testSha,
    deployment_sha: testSha,
    runtime_sha: testSha,
    branch: 'staging-dev'
});
assert.strictEqual(wrongBranch.verified, false);
assert.strictEqual(wrongBranch.parity_status, 'NON_CANONICAL_BRANCH');
assert.strictEqual(wrongBranch.branch.matches, false);

// 5B. Both master and main (Cloudflare Pages production alias) are authorized canonical branches
const mainBranch = verifyReleaseIdentity({
    source_sha: testSha,
    build_sha: testSha,
    deployment_sha: testSha,
    runtime_sha: testSha,
    branch: 'main'
});
assert.strictEqual(mainBranch.verified, true);
assert.strictEqual(mainBranch.parity_status, 'FULL_PARITY_VERIFIED');
assert.strictEqual(mainBranch.branch.matches, true);

// 6. No evidence remains unverified
const none = verifyReleaseIdentity({});
assert.strictEqual(none.verified, false);
assert.strictEqual(none.parity_status, 'MISSING_IDENTITY_FIELDS');
assert.ok(none.missing_fields.length > 0);

// 7. Regression: /api/version fail-closed on unverified database identity
{
    const { onRequestGet } = await import('../functions/api/version.js');

    const validReleaseEnv = {
        SOURCE_RELEASE_SHA: testSha,
        BUILD_RELEASE_SHA: testSha,
        CF_PAGES_COMMIT_SHA: testSha,
        RUNTIME_RELEASE_SHA: testSha,
        CF_PAGES_BRANCH: 'master'
    };

    // Case 7A: Valid release identity but missing DB configuration -> must fail-closed as UNVERIFIED
    const resA = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: { ...validReleaseEnv }
    });
    const bodyA = await resA.json();
    assert.strictEqual(bodyA.release_identity.verified, true, 'Release identity itself should be verified');
    assert.strictEqual(bodyA.database_identity.status, 'UNVERIFIED', 'Database status must be UNVERIFIED');
    assert.strictEqual(bodyA.status, 'UNVERIFIED', '/api/version status must be UNVERIFIED when DB is unverified');
    assert.strictEqual(bodyA.parity, false, 'Parity must be false when DB is unverified');

    // Case 7B: Valid release identity but DB mismatch -> must fail-closed as UNVERIFIED
    const resB = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            ...validReleaseEnv,
            CANONICAL_SUPABASE_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_PROJECT_REF: 'different_db_ref',
            SUPABASE_RUNTIME_HEALTH: 'HEALTHY'
        }
    });
    const bodyB = await resB.json();
    assert.strictEqual(bodyB.database_identity.status, 'MISMATCH', 'Database status must detect MISMATCH');
    assert.strictEqual(bodyB.status, 'UNVERIFIED', 'Status must remain UNVERIFIED on DB mismatch');
    assert.strictEqual(bodyB.parity, false, 'Parity must be false on DB mismatch');

    // Case 7C: Valid release identity + DB identity matches, but health is UNHEALTHY or unverified -> must fail-closed
    const resC = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            ...validReleaseEnv,
            CANONICAL_SUPABASE_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_HEALTH: 'DEGRADED'
        }
    });
    const bodyC = await resC.json();
    assert.strictEqual(bodyC.database_identity.status, 'IDENTITY_VERIFIED_HEALTH_UNVERIFIED');
    assert.strictEqual(bodyC.status, 'UNVERIFIED', 'Status must remain UNVERIFIED when DB health is degraded');
    assert.strictEqual(bodyC.parity, false, 'Parity must be false when DB health is not HEALTHY');

    // Case 7D: Valid release identity + matching DB ref + HEALTHY -> LIVE_VERIFIED
    const resD = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            ...validReleaseEnv,
            CANONICAL_SUPABASE_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_HEALTH: 'HEALTHY'
        }
    });
    const bodyD = await resD.json();
    assert.strictEqual(bodyD.database_identity.status, 'LIVE_VERIFIED');
    assert.strictEqual(bodyD.release_identity.verified, true);
    assert.strictEqual(bodyD.status, 'LIVE_VERIFIED', 'Status should be LIVE_VERIFIED only when both release & DB pass');
    assert.strictEqual(bodyD.parity, true, 'Parity should be true only when both release & DB pass');

    // Case 7E: Invalid release identity even if DB is LIVE_VERIFIED -> must fail-closed as UNVERIFIED
    const resE = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            SOURCE_RELEASE_SHA: testSha,
            CF_PAGES_COMMIT_SHA: otherSha, // mismatch
            CF_PAGES_BRANCH: 'master',
            CANONICAL_SUPABASE_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_PROJECT_REF: 'kitwadizsvjmuxkfewxj',
            SUPABASE_RUNTIME_HEALTH: 'HEALTHY'
        }
    });
    const bodyE = await resE.json();
    assert.strictEqual(bodyE.release_identity.verified, false);
    assert.strictEqual(bodyE.status, 'UNVERIFIED');
    assert.strictEqual(bodyE.parity, false);
}

console.log('✅ All release identity & /api/version database verification unit tests passed!');
