/**
 * Canonical Release Manifest & Identity Authority
 * Governs runtime provenance and cryptographic integrity across Cloudflare Pages Functions.
 */

export const CANONICAL_RELEASE = Object.freeze({
    release_id: 'REL-2026.09.08-LATEST',
    canonical_repository: 'https://github.com/adnin4/inshatech.git',
    canonical_branch: 'master',
    canonical_branches: ['master', 'main'],
    canonical_sha: '37f6e822fe92beb147a75896a7d075a512f1347a',
    canonical_db_ref: 'kitwadizsvjmuxkfewxj',
    canonical_production_url: 'https://inshatech.pages.dev',
    bdt_peg_rate: 122.50,
    slo_availability_target: '99.95%'
});
