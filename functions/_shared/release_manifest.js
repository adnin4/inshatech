/**
 * Canonical Release Manifest & Identity Authority
 * Governs runtime provenance and cryptographic integrity across Cloudflare Pages Functions.
 */

export const CANONICAL_RELEASE = Object.freeze({
    release_id: 'REL-2026.11.10-V1500-STAGING',
    canonical_repository: 'https://github.com/adnin4/inshatech.git',
    canonical_branch: 'master',
    canonical_branches: ['master', 'main'],
    canonical_sha: 'aa19ecf097af345adb2040f133a38b91e4a93fd2',
    canonical_db_ref: 'kitwadizsvjmuxkfewxj',
    canonical_production_url: 'https://inshatech.pages.dev',
    deployment_id: 'dpl_v1500_edge_live',
    bdt_peg_rate: 122.50,
    slo_availability_target: '99.95%'
});
