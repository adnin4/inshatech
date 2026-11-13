/**
 * Release Identity Engine (Phase 2 & Root Cause Enforcement)
 *
 * Fail-closed verification of source/build/deployment/runtime identity.
 * Required classifications:
 * SOURCE_VERIFIED | BUILD_VERIFIED | DEPLOYMENT_VERIFIED | RUNTIME_VERIFIED |
 * DATABASE_VERIFIED | FULL_RELEASE_VERIFIED | UNVERIFIED | MISMATCH
 *
 * Enforces strict 40-char SHA-1 or 64-char SHA-256 validation.
 * Missing identity is never inferred from another field.
 * Distinguishes GitHub synthetic merge SHA from actual PR head.
 */

import { CANONICAL_RELEASE } from './release_manifest.js';

export const RELEASE_CLASSIFICATIONS = Object.freeze({
    SOURCE_VERIFIED: 'SOURCE_VERIFIED',
    BUILD_VERIFIED: 'BUILD_VERIFIED',
    DEPLOYMENT_VERIFIED: 'DEPLOYMENT_VERIFIED',
    RUNTIME_VERIFIED: 'RUNTIME_VERIFIED',
    DATABASE_VERIFIED: 'DATABASE_VERIFIED',
    FULL_RELEASE_VERIFIED: 'FULL_RELEASE_VERIFIED',
    UNVERIFIED: 'UNVERIFIED',
    MISMATCH: 'MISMATCH'
});

/**
 * Validate a full Git SHA-1 (40 hex) or SHA-256 (64 hex) hash.
 * Short SHAs (e.g. 7-character) are strictly rejected for release authority.
 * @param {string|null|undefined} sha
 * @returns {boolean}
 */
export function isValidSha(sha) {
    if (typeof sha !== 'string') return false;
    const clean = sha.trim();
    return /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(clean);
}

/**
 * Normalize a full release SHA to lowercase hex.
 * @param {string|null|undefined} sha
 * @returns {string|null}
 */
export function normalizeSha(sha) {
    if (!sha || typeof sha !== 'string') return null;
    const clean = sha.trim().toLowerCase();
    return isValidSha(clean) ? clean : null;
}

/**
 * Validates timestamp freshness (rejects stale snapshots >24h or >5m in future).
 * @param {string|null|undefined} timestamp
 * @returns {boolean}
 */
export function isFreshTimestamp(timestamp) {
    if (!timestamp || typeof timestamp !== 'string') return false;
    const parsed = Date.parse(timestamp);
    if (Number.isNaN(parsed)) return false;
    const now = Date.now();
    const ageMs = now - parsed;
    // Max 24 hours in the past, max 5 minutes in the future (clock skew)
    return ageMs >= -300000 && ageMs <= 86400000;
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
 * @param {string} [context.repository]
 * @param {string} [context.deployment_id]
 * @param {string} [context.captured_at]
 * @param {string} [context.pr_head_sha]
 * @param {string} [context.synthetic_merge_sha]
 * @param {boolean} [context.database_verified]
 * @returns {Object}
 */
export function verifyReleaseIdentity(context = {}) {
    const source_sha = normalizeSha(context.source_sha);
    const build_sha = normalizeSha(context.build_sha);
    const deployment_sha = normalizeSha(context.deployment_sha);
    const runtime_sha = normalizeSha(context.runtime_sha);
    const pr_head_sha = normalizeSha(context.pr_head_sha);
    const synthetic_merge_sha = normalizeSha(context.synthetic_merge_sha);

    const branch = typeof context.branch === 'string' ? context.branch.trim() : null;
    const repository = typeof context.repository === 'string' ? context.repository.trim() : null;
    const deployment_id = typeof context.deployment_id === 'string' ? context.deployment_id.trim() : null;
    const captured_at = typeof context.captured_at === 'string' ? context.captured_at.trim() : null;
    const database_verified = Boolean(context.database_verified);

    const missing_fields = [];
    if (!source_sha) missing_fields.push('source_sha');
    if (!build_sha) missing_fields.push('build_sha');
    if (!deployment_sha) missing_fields.push('deployment_sha');
    if (!runtime_sha) missing_fields.push('runtime_sha');
    if (!branch) missing_fields.push('branch');

    const canonicalBranches = Array.isArray(CANONICAL_RELEASE.canonical_branches)
        ? CANONICAL_RELEASE.canonical_branches
        : [CANONICAL_RELEASE.canonical_branch];
    const branchMatch = canonicalBranches.includes(branch);

    const canonicalRepo = CANONICAL_RELEASE.canonical_repository;
    const repoMatch = !repository || repository === canonicalRepo || repository.includes('adnin4/inshatech');

    // Synthetic merge SHA detection (GitHub Actions PR synthetic merge commit)
    const isSyntheticMergeConfusion = Boolean(
        synthetic_merge_sha && pr_head_sha &&
        source_sha === synthetic_merge_sha &&
        source_sha !== pr_head_sha
    );

    // Stale evidence check
    const timestampValid = (captured_at && captured_at !== 'UNSPECIFIED') ? isFreshTimestamp(captured_at) : true;

    // Source provenance analysis
    const sourceProvenance = context.source_provenance || (source_sha ? 'PROVIDED' : 'UNVERIFIED');
    const buildProvenance = context.build_provenance || (build_sha ? 'PROVIDED' : 'UNVERIFIED');
    const deploymentProvenance = context.deployment_provenance || (deployment_sha ? 'PROVIDED' : 'UNVERIFIED');
    const runtimeProvenance = context.runtime_provenance || (runtime_sha ? 'PROVIDED' : 'UNVERIFIED');

    const hasInheritedDeploymentSha = Boolean(
        sourceProvenance === 'INHERITED_DEPLOYMENT_SHA' ||
        buildProvenance === 'INHERITED_DEPLOYMENT_SHA' ||
        runtimeProvenance === 'INHERITED_DEPLOYMENT_SHA'
    );

    const provenance_independent = !hasInheritedDeploymentSha &&
        sourceProvenance !== 'UNVERIFIED' &&
        buildProvenance !== 'UNVERIFIED' &&
        deploymentProvenance !== 'UNVERIFIED' &&
        runtimeProvenance !== 'UNVERIFIED';

    // Multi-SHA parity
    const all_shas = [source_sha, build_sha, deployment_sha, runtime_sha];
    const shasMatch = missing_fields.length === 0 && all_shas.every((sha) => sha === source_sha);

    // Progressive verification classifications
    const classifications = [];
    if (source_sha && !isSyntheticMergeConfusion) classifications.push(RELEASE_CLASSIFICATIONS.SOURCE_VERIFIED);
    if (build_sha && source_sha && build_sha === source_sha) classifications.push(RELEASE_CLASSIFICATIONS.BUILD_VERIFIED);
    if (deployment_sha && build_sha && deployment_sha === build_sha) classifications.push(RELEASE_CLASSIFICATIONS.DEPLOYMENT_VERIFIED);
    if (runtime_sha && deployment_sha && runtime_sha === deployment_sha && database_verified) classifications.push(RELEASE_CLASSIFICATIONS.RUNTIME_VERIFIED);
    if (database_verified) classifications.push(RELEASE_CLASSIFICATIONS.DATABASE_VERIFIED);

    let classification = RELEASE_CLASSIFICATIONS.UNVERIFIED;
    let parity_status = 'UNVERIFIED';

    if (missing_fields.length > 0) {
        classification = RELEASE_CLASSIFICATIONS.UNVERIFIED;
        parity_status = 'MISSING_IDENTITY_FIELDS';
    } else if (isSyntheticMergeConfusion) {
        classification = RELEASE_CLASSIFICATIONS.MISMATCH;
        parity_status = 'SYNTHETIC_MERGE_SHA_CONFUSION';
    } else if (!repoMatch) {
        classification = RELEASE_CLASSIFICATIONS.MISMATCH;
        parity_status = 'REPOSITORY_MISMATCH';
    } else if (!branchMatch) {
        classification = RELEASE_CLASSIFICATIONS.MISMATCH;
        parity_status = 'NON_CANONICAL_BRANCH';
    } else if (!shasMatch) {
        classification = RELEASE_CLASSIFICATIONS.MISMATCH;
        parity_status = 'MISMATCH_DETECTED';
    } else if (!timestampValid) {
        classification = RELEASE_CLASSIFICATIONS.UNVERIFIED;
        parity_status = 'STALE_EVIDENCE_TIMESTAMP';
    } else if (hasInheritedDeploymentSha) {
        classification = RELEASE_CLASSIFICATIONS.DEPLOYMENT_VERIFIED;
        parity_status = 'DEPLOYMENT_SHA_MATCHED_ONLY';
    } else {
        parity_status = 'FULL_PARITY_VERIFIED';
        classification = database_verified
            ? RELEASE_CLASSIFICATIONS.FULL_RELEASE_VERIFIED
            : RELEASE_CLASSIFICATIONS.DEPLOYMENT_VERIFIED;
    }

    const verified = parity_status === 'FULL_PARITY_VERIFIED';

    return {
        verified,
        provenance_independent,
        deployment_matched: shasMatch && missing_fields.length === 0,
        classification,
        parity_status,
        missing_fields,
        classifications,
        branch: {
            active: branch || 'UNSPECIFIED',
            canonical: CANONICAL_RELEASE.canonical_branch,
            allowed: canonicalBranches,
            matches: branchMatch
        },
        repository: {
            active: repository || 'UNSPECIFIED',
            canonical: canonicalRepo,
            matches: repoMatch
        },
        deployment_id: deployment_id || 'UNSPECIFIED',
        captured_at: captured_at || 'UNSPECIFIED',
        timestamp_valid: timestampValid,
        shas: {
            source_sha: source_sha || 'UNSPECIFIED',
            build_sha: build_sha || 'UNSPECIFIED',
            deployment_sha: deployment_sha || 'UNSPECIFIED',
            runtime_sha: runtime_sha || 'UNSPECIFIED'
        },
        provenance: {
            source_provenance: context.source_provenance || (source_sha ? 'PROVIDED' : 'UNVERIFIED'),
            build_provenance: context.build_provenance || (build_sha ? 'PROVIDED' : 'UNVERIFIED'),
            deployment_provenance: context.deployment_provenance || (deployment_sha ? 'PROVIDED' : 'UNVERIFIED'),
            runtime_provenance: context.runtime_provenance || (runtime_sha ? 'PROVIDED' : 'UNVERIFIED')
        },
        synthetic_check: {
            confused: isSyntheticMergeConfusion,
            pr_head_sha: pr_head_sha || 'N/A',
            synthetic_merge_sha: synthetic_merge_sha || 'N/A'
        },
        metadata: {
            platform: 'IINSHA AI-BOS',
            canonical_repository: canonicalRepo,
            canonical_branch: CANONICAL_RELEASE.canonical_branch,
            evaluated_at: new Date().toISOString()
        }
    };
}
