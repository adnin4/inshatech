/**
 * Canonical Release Manifest & Identity Authority
 * Governs runtime provenance and cryptographic integrity across Cloudflare Pages Functions.
 */

export const CANONICAL_RELEASE = Object.freeze({
    release_id: 'REL-2026.11.11-V1500-STAGING',
    canonical_repository: 'https://github.com/adnin4/inshatech.git',
    canonical_branch: 'master',
    canonical_branches: ['master', 'main'],
    canonical_sha: '4d35561e6323396dfafcb0e78824f8f5817ca354',
    canonical_db_ref: 'kitwadizsvjmuxkfewxj',
    canonical_production_url: 'https://inshatech.pages.dev',
    bdt_peg_rate: 122.50,
    slo_availability_target: '99.95%'
});
