/**
 * Test Release Identity Engine Suite
 * Verifies multi-SHA parity calculation, edge cases, formatting and falsification resistance.
 */

import { isValidSha, normalizeSha, verifyReleaseIdentity } from '../functions/_shared/release_identity.js';
import assert from 'node:assert';

console.log('Running test_release_identity.mjs...');

// 1. Validation and normalization
assert.strictEqual(isValidSha('00918c5072b1a0c19c2606ec74096ea651900eea'), true);
assert.strictEqual(isValidSha('00918c5'), true);
assert.strictEqual(isValidSha('INVALID_SHA_XYZ'), false);
assert.strictEqual(isValidSha(''), false);
assert.strictEqual(normalizeSha('  00918C5072B1A0C19C2606EC74096EA651900EEA  '), '00918c5072b1a0c19c2606ec74096ea651900eea');
assert.strictEqual(normalizeSha(null), null);

// 2. Full parity check
const testSha = '00918c5072b1a0c19c2606ec74096ea651900eea';
const fullParity = verifyReleaseIdentity({
    source_sha: testSha,
    build_sha: testSha,
    deployment_sha: testSha,
    runtime_sha: testSha,
    branch: 'master'
});
assert.strictEqual(fullParity.verified, true);
assert.strictEqual(fullParity.parity_status, 'FULL_PARITY_VERIFIED');

// 3. Mismatch detection
const mismatch = verifyReleaseIdentity({
    source_sha: testSha,
    deployment_sha: '1111111111111111111111111111111111111111',
    branch: 'master'
});
assert.strictEqual(mismatch.verified, false);
assert.strictEqual(mismatch.parity_status, 'MISMATCH_DETECTED');

// 4. Missing SHAs detection
const missing = verifyReleaseIdentity({});
assert.strictEqual(missing.verified, false);
assert.strictEqual(missing.parity_status, 'NO_SHA_SUPPLIED');

console.log('✅ All release identity unit tests passed!');
