/**
 * Comprehensive Test Suite for Release Identity Engine & Database Probe
 * Verifies multi-SHA parity, missing-field fail-closed behavior, branch authority,
 * repository authority, synthetic merge SHA distinction, stale evidence detection,
 * and live database probe classifications.
 */

import { isValidSha, normalizeSha, verifyReleaseIdentity, RELEASE_CLASSIFICATIONS } from '../functions/_shared/release_identity.js';
import { probeDatabaseHealth, PROBE_STATUS, extractProjectRef } from '../functions/_shared/database_probe.js';
import assert from 'node:assert';

console.log('Running comprehensive test_release_identity.mjs...');

const testSha1 = '00918c5072b1a0c19c2606ec74096ea651900eea';
const testSha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const otherSha = '1111111111111111111111111111111111111111';
const syntheticMergeSha = '2222222222222222222222222222222222222222';
const prHeadSha = '3333333333333333333333333333333333333333';

// 1. Validation and normalization
assert.strictEqual(isValidSha(testSha1), true, 'Full 40-char SHA-1 must be valid');
assert.strictEqual(isValidSha(testSha256), true, 'Full 64-char SHA-256 must be valid');
assert.strictEqual(isValidSha('00918c5'), false, 'Short 7-char SHAs must be rejected');
assert.strictEqual(isValidSha('INVALID_SHA_XYZ'), false, 'Malformed SHAs must be rejected');
assert.strictEqual(isValidSha(''), false, 'Empty strings must be rejected');
assert.strictEqual(normalizeSha(`  ${testSha1.toUpperCase()}  `), testSha1, 'Normalization must lowercase and trim');
assert.strictEqual(normalizeSha(null), null);

// 2. Full parity check with database verification
const fullParity = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: testSha1,
    runtime_sha: testSha1,
    branch: 'master',
    repository: 'https://github.com/adnin4/inshatech.git',
    deployment_id: 'dep_12345',
    captured_at: new Date().toISOString(),
    database_verified: true
});
assert.strictEqual(fullParity.verified, true);
assert.strictEqual(fullParity.parity_status, 'FULL_PARITY_VERIFIED');
assert.strictEqual(fullParity.classification, RELEASE_CLASSIFICATIONS.FULL_RELEASE_VERIFIED);
assert.deepStrictEqual(fullParity.missing_fields, []);
assert.strictEqual(fullParity.branch.matches, true);
assert.strictEqual(fullParity.repository.matches, true);

// 3. Mismatch detection between SHAs
const mismatch = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: otherSha,
    runtime_sha: testSha1,
    branch: 'master'
});
assert.strictEqual(mismatch.verified, false);
assert.strictEqual(mismatch.parity_status, 'MISMATCH_DETECTED');
assert.strictEqual(mismatch.classification, RELEASE_CLASSIFICATIONS.MISMATCH);

// 4. Missing identity fields must NEVER be backfilled from deployment SHA
const missing = verifyReleaseIdentity({ deployment_sha: testSha1, branch: 'master' });
assert.strictEqual(missing.verified, false);
assert.strictEqual(missing.parity_status, 'MISSING_IDENTITY_FIELDS');
assert.strictEqual(missing.classification, RELEASE_CLASSIFICATIONS.UNVERIFIED);
assert.deepStrictEqual(missing.missing_fields.sort(), [
    'build_sha',
    'runtime_sha',
    'source_sha'
]);

// 5. Non-canonical branches are never production-authoritative
const wrongBranch = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: testSha1,
    runtime_sha: testSha1,
    branch: 'staging-dev'
});
assert.strictEqual(wrongBranch.verified, false);
assert.strictEqual(wrongBranch.parity_status, 'NON_CANONICAL_BRANCH');
assert.strictEqual(wrongBranch.classification, RELEASE_CLASSIFICATIONS.MISMATCH);
assert.strictEqual(wrongBranch.branch.matches, false);

// 6. Canonical branches: Both master and main are authorized canonical release branches
const mainBranch = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: testSha1,
    runtime_sha: testSha1,
    branch: 'main'
});
assert.strictEqual(mainBranch.verified, true);
assert.strictEqual(mainBranch.parity_status, 'FULL_PARITY_VERIFIED');
assert.strictEqual(mainBranch.branch.matches, true);

// 7. Repository mismatch rejection
const wrongRepo = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: testSha1,
    runtime_sha: testSha1,
    branch: 'master',
    repository: 'https://github.com/attacker/malicious-repo.git'
});
assert.strictEqual(wrongRepo.verified, false);
assert.strictEqual(wrongRepo.parity_status, 'REPOSITORY_MISMATCH');
assert.strictEqual(wrongRepo.classification, RELEASE_CLASSIFICATIONS.MISMATCH);

// 8. Synthetic merge SHA confusion detection (GitHub Actions PR synthetic merge vs PR head)
const syntheticConfusion = verifyReleaseIdentity({
    source_sha: syntheticMergeSha,
    build_sha: syntheticMergeSha,
    deployment_sha: syntheticMergeSha,
    runtime_sha: syntheticMergeSha,
    branch: 'master',
    pr_head_sha: prHeadSha,
    synthetic_merge_sha: syntheticMergeSha
});
assert.strictEqual(syntheticConfusion.verified, false);
assert.strictEqual(syntheticConfusion.parity_status, 'SYNTHETIC_MERGE_SHA_CONFUSION');
assert.strictEqual(syntheticConfusion.classification, RELEASE_CLASSIFICATIONS.MISMATCH);

// 9. Stale evidence timestamp rejection (>24h old)
const staleTimestamp = new Date(Date.now() - 100000000).toISOString(); // ~27 hours ago
const staleCheck = verifyReleaseIdentity({
    source_sha: testSha1,
    build_sha: testSha1,
    deployment_sha: testSha1,
    runtime_sha: testSha1,
    branch: 'master',
    captured_at: staleTimestamp
});
assert.strictEqual(staleCheck.verified, false);
assert.strictEqual(staleCheck.parity_status, 'STALE_EVIDENCE_TIMESTAMP');
assert.strictEqual(staleCheck.classification, RELEASE_CLASSIFICATIONS.UNVERIFIED);

// 10. Database Probe Unit Tests
assert.strictEqual(extractProjectRef('https://kitwadizsvjmuxkfewxj.supabase.co'), 'kitwadizsvjmuxkfewxj');
assert.strictEqual(extractProjectRef('kitwadizsvjmuxkfewxj'), 'kitwadizsvjmuxkfewxj');

// 10A: Missing credentials -> UNVERIFIED
const dbMissing = await probeDatabaseHealth({});
assert.strictEqual(dbMissing.status, PROBE_STATUS.UNVERIFIED);
assert.strictEqual(dbMissing.verified, false);

// 10B: Project ref mismatch -> IDENTITY_MISMATCH
const dbMismatch = await probeDatabaseHealth({
    SUPABASE_URL: 'https://wrongprojectref123.supabase.co',
    SUPABASE_ANON_KEY: 'test-key'
});
assert.strictEqual(dbMismatch.status, PROBE_STATUS.IDENTITY_MISMATCH);
assert.strictEqual(dbMismatch.verified, false);

// 10C: Database Inactive (HTTP 503)
const mockInactiveFetch = async () => new Response(JSON.stringify({ error: 'project inactive' }), { status: 503 });
const dbInactive = await probeDatabaseHealth({
    SUPABASE_URL: 'https://kitwadizsvjmuxkfewxj.supabase.co',
    SUPABASE_ANON_KEY: 'test-key'
}, mockInactiveFetch);
assert.strictEqual(dbInactive.status, PROBE_STATUS.INACTIVE);
assert.strictEqual(dbInactive.verified, false);

// 10D: Authentication Failed (HTTP 401)
const mockAuthFailFetch = async () => new Response(JSON.stringify({ error: 'invalid api key' }), { status: 401 });
const dbAuthFail = await probeDatabaseHealth({
    SUPABASE_URL: 'https://kitwadizsvjmuxkfewxj.supabase.co',
    SUPABASE_ANON_KEY: 'bad-key'
}, mockAuthFailFetch);
assert.strictEqual(dbAuthFail.status, PROBE_STATUS.AUTHENTICATION_FAILED);
assert.strictEqual(dbAuthFail.verified, false);

// 10E: Timeout (>3000ms)
const mockTimeoutFetch = async (_url, options) => {
    return new Promise((_, reject) => {
        if (options?.signal) {
            options.signal.addEventListener('abort', () => {
                const err = new Error('The operation was aborted');
                err.name = 'AbortError';
                reject(err);
            });
        }
    });
};
const dbTimeout = await probeDatabaseHealth({
    SUPABASE_URL: 'https://kitwadizsvjmuxkfewxj.supabase.co',
    SUPABASE_ANON_KEY: 'test-key'
}, mockTimeoutFetch);
assert.strictEqual(dbTimeout.status, PROBE_STATUS.TIMEOUT);
assert.strictEqual(dbTimeout.verified, false);

// 10F: Active Healthy (HTTP 200)
const mockHealthyFetch = async () => new Response(JSON.stringify({ definitions: {} }), { status: 200 });
const dbHealthy = await probeDatabaseHealth({
    SUPABASE_URL: 'https://kitwadizsvjmuxkfewxj.supabase.co',
    SUPABASE_ANON_KEY: 'valid-key'
}, mockHealthyFetch);
assert.strictEqual(dbHealthy.status, PROBE_STATUS.ACTIVE_HEALTHY);
assert.strictEqual(dbHealthy.verified, true);

// 11. /api/version integration testing
{
    const { onRequestGet } = await import('../functions/api/version.js');

    const validReleaseEnv = {
        SOURCE_RELEASE_SHA: testSha1,
        BUILD_RELEASE_SHA: testSha1,
        CF_PAGES_COMMIT_SHA: testSha1,
        RUNTIME_RELEASE_SHA: testSha1,
        CF_PAGES_BRANCH: 'master'
    };

    // 11A: Valid release + missing DB credentials -> READY_FOR_STAGING
    const resA = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: { ...validReleaseEnv }
    });
    const bodyA = await resA.json();
    assert.strictEqual(bodyA.release_identity.verified, true);
    assert.strictEqual(bodyA.database_identity.status, PROBE_STATUS.UNVERIFIED);
    assert.strictEqual(bodyA.status, 'READY_FOR_STAGING');
    assert.strictEqual(bodyA.parity, true);
    assert.strictEqual(bodyA.release_parity, true);
    assert.strictEqual(bodyA.full_production_parity, false);
    assert.notStrictEqual(bodyA.release_identity.deployment_id, 'UNSPECIFIED');
    assert.notStrictEqual(bodyA.release_identity.captured_at, 'UNSPECIFIED');

    // 11B: Valid release + inactive DB -> READY_FOR_STAGING (fail closed for full production)
    const resB = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            ...validReleaseEnv,
            SUPABASE_URL: 'https://kitwadizsvjmuxkfewxj.supabase.co',
            SUPABASE_ANON_KEY: 'test-key'
        }
    });
    const bodyB = await resB.json();
    assert.strictEqual(bodyB.status, 'READY_FOR_STAGING');
    assert.strictEqual(bodyB.parity, true);
    assert.strictEqual(bodyB.full_production_parity, false);
    assert.strictEqual(bodyB.production_sealed, false);

    // 11C: SHA mismatch -> UNVERIFIED
    const resC = await onRequestGet({
        request: new Request('https://inshatech.pages.dev/api/version'),
        env: {
            ...validReleaseEnv,
            CF_PAGES_COMMIT_SHA: otherSha
        }
    });
    const bodyC = await resC.json();
    assert.strictEqual(bodyC.release_identity.verified, false);
    assert.strictEqual(bodyC.parity, false);
    assert.strictEqual(bodyC.status, 'UNVERIFIED');
}

console.log('✅ All release identity, PR synthetic check, and database probe unit tests passed!');
