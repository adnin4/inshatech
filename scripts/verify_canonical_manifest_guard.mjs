/**
 * CI Guard: Enforces Single Canonical System State and Blocks Conflicting Manifests
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { isValidSha } from '../functions/_shared/release_identity.js';

console.log('Running verify_canonical_manifest_guard.mjs...');

const rootPath = path.resolve('CANONICAL_SYSTEM_STATE.json');
const docsPath = path.resolve('docs/CANONICAL_SYSTEM_STATE.json');

assert(fs.existsSync(rootPath), 'CANONICAL_SYSTEM_STATE.json must exist at root');
assert(fs.existsSync(docsPath), 'docs/CANONICAL_SYSTEM_STATE.json must exist');

const rootManifest = JSON.parse(fs.readFileSync(rootPath, 'utf8'));
const docsManifest = JSON.parse(fs.readFileSync(docsPath, 'utf8'));

// 1. Snapshot type check
assert.strictEqual(rootManifest.snapshot_type, 'SNAPSHOT_ONLY', 'Root manifest must declare snapshot_type: SNAPSHOT_ONLY');
assert.strictEqual(docsManifest.snapshot_type, 'SNAPSHOT_ONLY', 'Docs manifest must declare snapshot_type: SNAPSHOT_ONLY');

// 2. Full SHA validation
assert(isValidSha(rootManifest.captured_source_sha), 'Root captured_source_sha must be a full 40-char or 64-char hex SHA');
assert(isValidSha(docsManifest.captured_source_sha), 'Docs captured_source_sha must be a full 40-char or 64-char hex SHA');

// 3. Exact SHA synchronization across root and docs
assert.strictEqual(
    rootManifest.captured_source_sha,
    docsManifest.captured_source_sha,
    `Manifest SHA mismatch: root=${rootManifest.captured_source_sha} vs docs=${docsManifest.captured_source_sha}`
);

// 4. Canonical Database Reference check
const rootDb = rootManifest.database_identity?.canonical_db_ref;
const docsDb = docsManifest.database_identity?.canonical_db_ref;
assert.strictEqual(rootDb, 'kitwadizsvjmuxkfewxj', 'Root manifest must point to canonical Supabase ref kitwadizsvjmuxkfewxj');
assert.strictEqual(docsDb, 'kitwadizsvjmuxkfewxj', 'Docs manifest must point to canonical Supabase ref kitwadizsvjmuxkfewxj');

// 5. Canonical branch check
assert.strictEqual(rootManifest.canonical_branch, 'master');
assert.strictEqual(docsManifest.canonical_branch, 'master');

console.log('✅ Canonical manifest guard passed: Zero conflicting manifests detected.');
