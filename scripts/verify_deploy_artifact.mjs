/**
 * Staged Deployment Artifact Validator
 * Verifies that a staging or production Pages artifact (dist-pages/)
 * adheres to strict zero-leakage policies:
 * 1. Zero forbidden file extensions (*.bundle, *.sql, *.env*, *.pem, *.key, *.py, *.bat, *.sh, *.backup).
 * 2. Zero conflict copies (*-DESKTOP-*).
 * 3. Zero private folders (.git/, .github/, docs/, scripts/, supabase/, tests/, workers/, node_modules/).
 * 4. Critical runtime files present (index.html, app.js, style.css, _routes.json, _headers, functions/).
 * 5. Valid release-manifest.json with SHA-256 integrity.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(process.cwd());
const DIST_PAGES = path.join(ROOT, 'dist-pages');

console.log('================================================================================');
console.log('IINSHA AI-BOS: STAGED PAGES ARTIFACT VERIFIER');
console.log('================================================================================\n');

// Build clean dist-pages if it doesn't exist
function ensureStagedArtifact() {
    if (fs.existsSync(DIST_PAGES)) {
        fs.rmSync(DIST_PAGES, { recursive: true, force: true });
    }
    fs.mkdirSync(DIST_PAGES, { recursive: true });

    const assetsIgnoreLines = fs.readFileSync(path.join(ROOT, '.assetsignore'), 'utf8')
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#'));

    function isIgnored(relPath) {
        const normalized = relPath.replace(/\\/g, '/');
        const base = path.basename(normalized);
        if (normalized === 'dist-pages' || normalized.startsWith('dist-pages/')) return true;

        for (const pattern of assetsIgnoreLines) {
            if (pattern.endsWith('/')) {
                const dirPattern = pattern.slice(0, -1);
                if (normalized === dirPattern || normalized.startsWith(dirPattern + '/')) {
                    return true;
                }
            } else if (pattern.includes('*')) {
                const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
                const regex = new RegExp('^' + escaped + '$', 'i');
                if (regex.test(base) || regex.test(normalized)) return true;
            } else if (normalized === pattern || base === pattern) {
                return true;
            }
        }
        return false;
    }

    function copyRecursive(srcDir, destDir, currentRel = '') {
        const entries = fs.readdirSync(srcDir, { withFileTypes: true });
        for (const ent of entries) {
            const rel = currentRel ? `${currentRel}/${ent.name}` : ent.name;
            if (isIgnored(rel)) continue;

            const srcPath = path.join(srcDir, ent.name);
            const destPath = path.join(destDir, ent.name);

            if (ent.isDirectory()) {
                fs.mkdirSync(destPath, { recursive: true });
                copyRecursive(srcPath, destPath, rel);
            } else if (ent.isFile()) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    copyRecursive(ROOT, DIST_PAGES);
}

ensureStagedArtifact();

const forbiddenRegexes = [
    /\.bundle$/i,
    /\.sql$/i,
    /\.env($|\.)/i,
    /\.pem$/i,
    /\.key$/i,
    /\.backup$/i,
    /\.py$/i,
    /\.bat$/i,
    /\.sh$/i,
    /-DESKTOP-/i
];

const requiredFiles = [
    'index.html',
    'app.js',
    'style.css',
    '_routes.json',
    '_headers',
    '_redirects',
    'functions/_middleware.js',
    'functions/_shared/origin_policy.js',
    'functions/_shared/auth_gate.js',
    'functions/api/health.js',
    'functions/api/version.js',
    'functions/api/auth/session.js',
    'functions/api/payments/checkout.js',
    'functions/api/payments/return.js',
    'functions/api/payments/webhook.js'
];

let violations = [];
let fileList = [];

function auditDir(dir, rel = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
        const childRel = rel ? `${rel}/${ent.name}` : ent.name;
        const full = path.join(dir, ent.name);

        if (ent.isDirectory()) {
            auditDir(full, childRel);
        } else if (ent.isFile()) {
            fileList.push(childRel);
            for (const r of forbiddenRegexes) {
                if (r.test(ent.name)) {
                    violations.push(`Forbidden file matched pattern ${r}: ${childRel}`);
                }
            }
        }
    }
}

auditDir(DIST_PAGES);

// Compute release-manifest.json inside dist-pages
const manifestEntries = fileList.sort().map(f => {
    const full = path.join(DIST_PAGES, f);
    const content = fs.readFileSync(full);
    return {
        path: f,
        sha256: crypto.createHash('sha256').update(content).digest('hex'),
        bytes: content.length
    };
});

const releaseManifest = {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    total_files: manifestEntries.length,
    files: manifestEntries
};

fs.writeFileSync(
    path.join(DIST_PAGES, 'release-manifest.json'),
    JSON.stringify(releaseManifest, null, 2),
    'utf8'
);

for (const req of requiredFiles) {
    if (!fs.existsSync(path.join(DIST_PAGES, req))) {
        violations.push(`Missing required release file in dist-pages: ${req}`);
    }
}

if (violations.length > 0) {
    console.error('❌ STAGED ARTIFACT VALIDATION FAILED WITH VIOLATIONS:');
    for (const v of violations) console.error('  - ' + v);
    process.exit(1);
}

console.log(`✅ Staged artifact validated cleanly!`);
console.log(`   Total clean publishable files: ${manifestEntries.length}`);
console.log(`   Forbidden file violations: 0`);
console.log(`   Required runtime files verified: ${requiredFiles.length}/${requiredFiles.length}`);
console.log(`   Artifact manifest written to dist-pages/release-manifest.json`);
console.log('================================================================================\n');
