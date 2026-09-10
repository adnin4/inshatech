/**
 * Release Identity Engine (Phase 2)
 *
 * Fail-closed verification of source/build/deployment/runtime identity.
 * Missing identity is never inferred from another field.
 */

import { CANONICAL_RELEASE } from './release_manifest.js';

/**
 * Validate a full Git SHA-1 or SHA-256 hash.
 * Short SHAs are intentionally rejected for release authority.
 * @param {string|null|undefined} sha
 * @returns {boolean}
 */
export function isValidSha(sha) {
    if (typeof sha !== 'string') return false;
    const clean = sha.trim();
    return /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(clean);
}

/**
 * Normalize a full release SHA.
 * @param {string|null|undefined} sha
 * @returns {string|null}
 */
export function normalizeSha(sha) {
    if (!sha || typeof sha !== 'string') return null;
    const clean = sha.trim().toLowerCase();
    return isValidSha(clean) ? clean : null;
}

/**
 * Computes release identity parity across execution contexts.
 * Every required identity field is independently supplied; no field is
 * backfilled from deployment_sha or another observed value.
 *
 * @param {Object} context
 * @param {string} [context.source_sha]
 * @param {string} [context.build_sha]
 * @param {string} [context.deployment_sha]
 * @param {string} [context.runtime_sha]
 * @param {string} [context.branch]
 * @returns {Object}
 */
export function verifyReleaseIdentity(context = {}) {
    const source_sha = normalizeSha(context.source_sha);
    const build_sha = normalizeSha(context.build_sha);
    const deployment_sha = normalizeSha(context.deployment_sha);
    const runtime_sha = normalizeSha(context.runtime_sha);
    const branch = typeof context.branch === 'string' ? context.branch.trim() : null;

    const missing_fields = [];
    if (!source_sha) missing_fields.push('source_sha');
    if (!build_sha) missing_fields.push('build_sha');
    if (!deployment_sha) missing_fields.push('deployment_sha');
    if (!runtime_sha) missing_fields.push('runtime_sha');
    if (!branch) missing_fields.push('branch');

    const all_shas = [source_sha, build_sha, deployment_sha, runtime_sha];
    const allMatch = missing_fields.length === 0 && all_shas.every((sha) => sha === source_sha);
    const branchMatch = branch === CANONICAL_RELEASE.canonical_branch;

    let parity_status = 'UNVERIFIED';
    if (missing_fields.length > 0) {
        parity_status = 'MISSING_IDENTITY_FIELDS';
    } else if (!branchMatch) {
        parity_status = 'NON_CANONICAL_BRANCH';
    } else if (allMatch) {
        parity_status = 'FULL_PARITY_VERIFIED';
    } else {
        parity_status = 'MISMATCH_DETECTED';
    }

    return {
        verified: allMatch && branchMatch,
        parity_status,
        missing_fields,
        branch: {
            active: branch || 'UNSPECIFIED',
            canonical: CANONICAL_RELEASE.canonical_branch,
            matches: branchMatch
        },
        shas: {
            source_sha: source_sha || 'UNSPECIFIED',
            build_sha: build_sha || 'UNSPECIFIED',
            deployment_sha: deployment_sha || 'UNSPECIFIED',
            runtime_sha: runtime_sha || 'UNSPECIFIED'
        },
        metadata: {
            platform: 'IINSHA AI-BOS',
            canonical_repository: CANONICAL_RELEASE.canonical_repository,
            canonical_branch: CANONICAL_RELEASE.canonical_branch,
            evaluated_at: new Date().toISOString()
        }
    };
}
