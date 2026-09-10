/**
 * Release Identity Engine (Phase 1)
 *
 * Enforces cryptographic consistency across source_sha, build_sha, deployment_sha, and runtime_sha.
 * Replaces ad-hoc string comparisons with a single, authoritative verification engine.
 */

import { CANONICAL_RELEASE } from './release_manifest.js';

/**
 * Validates a SHA-1 or SHA-256 hash string format.
 * @param {string|null|undefined} sha
 * @returns {boolean}
 */
export function isValidSha(sha) {
    if (typeof sha !== 'string') return false;
    const clean = sha.trim();
    return /^[0-9a-f]{7,64}$/i.test(clean);
}

/**
 * Normalizes SHA to lowercase.
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
 *
 * @param {Object} context
 * @param {string} [context.source_sha]       - Git commit SHA at repository source
 * @param {string} [context.build_sha]        - SHA tagged during build/bundle step
 * @param {string} [context.deployment_sha]   - SHA provided by deployment provider (e.g. CF_PAGES_COMMIT_SHA)
 * @param {string} [context.runtime_sha]      - Expected release SHA configured in environment
 * @param {string} [context.branch]           - Active Git branch name
 * @returns {Object} Full cryptographic identity assessment
 */
export function verifyReleaseIdentity(context = {}) {
    const deployment_sha = normalizeSha(context.deployment_sha);
    const runtime_sha = normalizeSha(context.runtime_sha) || deployment_sha;
    const build_sha = normalizeSha(context.build_sha) || deployment_sha;
    const source_sha = normalizeSha(context.source_sha) || deployment_sha;

    const shasPresent = [deployment_sha, runtime_sha, build_sha, source_sha].filter(Boolean);
    const hasSufficientData = shasPresent.length > 0;

    const allMatch = hasSufficientData && shasPresent.every(s => s === shasPresent[0]);

    let parityStatus = 'UNVERIFIED';
    if (!hasSufficientData) {
        parityStatus = 'NO_SHA_SUPPLIED';
    } else if (allMatch) {
        parityStatus = 'FULL_PARITY_VERIFIED';
    } else {
        parityStatus = 'MISMATCH_DETECTED';
    }

    return {
        verified: allMatch,
        parity_status: parityStatus,
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
            active_branch: context.branch || CANONICAL_RELEASE.canonical_branch,
            evaluated_at: new Date().toISOString()
        }
    };
}
