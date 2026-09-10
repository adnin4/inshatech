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
    branch: 'main'
});
assert.strictEqual(wrongBranch.verified, false);
assert.strictEqual(wrongBranch.parity_status, 'NON_CANONICAL_BRANCH');
assert.strictEqual(wrongBranch.branch.matches, false);

// 6. No evidence remains unverified
const none = verifyReleaseIdentity({});
assert.strictEqual(none.verified, false);
assert.strictEqual(none.parity_status, 'MISSING_IDENTITY_FIELDS');
assert.ok(none.missing_fields.length > 0);

console.log('✅ All release identity unit tests passed!');
