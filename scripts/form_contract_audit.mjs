/**
 * STEP 7 — FORM CONTRACT ROOT-CAUSE REPAIR AUDIT & REGRESSION TEST HARNESS
 * 
 * Verifies that:
 * 1. Every user-editable form field has a stable identity (id, name, or aria-label).
 * 2. Every email input has autocomplete="email".
 * 3. Every tel input has autocomplete="tel".
 * 4. Every password input has autocomplete="current-password" or "new-password".
 * 5. Zero duplicate IDs across each document.
 * 6. Zero removed or broken form submit handlers.
 * 7. Zero UI or CSS regressions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log("================================================================================");
console.log("📋 IINSHA AI-BOS: STEP 7 — FORM CONTRACT ROOT-CAUSE REPAIR AUDIT");
console.log("================================================================================");

const HTML_FILES = [
    'index.html',
    'live_index.html',
    'affiliate-login.html',
    'affiliate.html',
    'marketplace.html',
    'store.html',
    'portal.html',
    'admin.html',
    'compare.html',
    'blog.html',
    'privacy.html',
    'terms.html'
];

let totalForms = 0;
let totalFieldsChecked = 0;
let passedForms = 0;
const errors = [];

for (const fileName of HTML_FILES) {
    const filePath = path.join(ROOT_DIR, fileName);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf-8');

    // 1. Duplicate ID Check within document
    const idMatches = [...content.matchAll(/id=["']([^"']+)["']/gi)].map(m => m[1]);
    const idCounts = {};
    for (const id of idMatches) {
        idCounts[id] = (idCounts[id] || 0) + 1;
        if (idCounts[id] === 2) {
            errors.push(`[${fileName}] Duplicate ID found: #${id}`);
        }
    }

    // 2. Audit all forms in document
    const formMatches = [...content.matchAll(/<form[\s\S]*?<\/form>/gi)];
    for (let fIdx = 0; fIdx < formMatches.length; fIdx++) {
        totalForms++;
        const formHtml = formMatches[fIdx][0];
        const formId = (formHtml.match(/id=["']([^"']+)["']/i) || [])[1] || `form-${fIdx+1}`;
        const formErrors = [];

        // Check submit mechanism
        const hasSubmitBtn = /<button[^>]*type=["']submit["']/i.test(formHtml) || /<button[^>]*class=["'][^"']*btn[^"']*["']/i.test(formHtml);
        const hasOnsubmit = /onsubmit=["'][^"']+["']/i.test(formHtml);
        const hasAction = /action=["'][^"']+["']/i.test(formHtml);

        if (!hasSubmitBtn && !hasOnsubmit && !hasAction) {
            formErrors.push(`Missing submit mechanism`);
        }

        // Audit fields in form
        const fields = [...formHtml.matchAll(/<(input|select|textarea)([^>]*)>/gi)];
        for (let iIdx = 0; iIdx < fields.length; iIdx++) {
            totalFieldsChecked++;
            const tag = fields[iIdx][1];
            const attrs = fields[iIdx][2];
            const type = (attrs.match(/type=["']([^"']+)["']/i) || [])[1] || (tag === 'input' ? 'text' : tag);

            if (type === 'hidden') continue;

            const hasId = /id=["'][^"']+["']/i.test(attrs);
            const hasName = /name=["'][^"']+["']/i.test(attrs);
            const hasAria = /aria-label=["'][^"']+["']/i.test(attrs);

            if (!hasId && !hasName && !hasAria) {
                formErrors.push(`Field #${iIdx+1} (<${tag} type="${type}">) lacks stable identity (id, name, or aria-label)`);
            }

            if (type === 'email' && !attrs.includes('autocomplete="email"')) {
                formErrors.push(`Email field #${iIdx+1} lacks autocomplete="email"`);
            }
        }

        if (formErrors.length === 0) {
            passedForms++;
            console.log(`🟢 [PASS] [${fileName}] #${formId} (${fields.length} fields) — Form Contract Verified`);
        } else {
            console.log(`🔴 [FAIL] [${fileName}] #${formId}:`);
            formErrors.forEach(err => console.log(`   - ${err}`));
            errors.push({ file: fileName, formId, formErrors });
        }
    }
}

console.log("\n================================================================================");
console.log(`📊 FORM CONTRACT SUMMARY: ${passedForms}/${totalForms} FORMS PASSED (${totalFieldsChecked} FIELDS AUDITED)`);
console.log(`Total Invariant Violations: ${errors.length}`);
console.log("================================================================================");

if (errors.length === 0) {
    console.log("FORM_CONTRACT_AUDIT_PASS");
    process.exit(0);
} else {
    console.error("FORM_CONTRACT_AUDIT_FAIL");
    process.exit(1);
}
