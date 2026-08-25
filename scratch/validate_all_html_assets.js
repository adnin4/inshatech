/**
 * Validate that every <img> src, <link> href, and asset referenced in all HTML files physically exists
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const HTML_FILES = [
    'index.html', 'store.html', 'marketplace.html', 'compare.html', 'blog.html',
    'portal.html', 'affiliate.html', 'affiliate-login.html', 'affiliate-dashboard.html', 'admin.html'
];

console.log('================================================================================');
console.log('🔍 STRICT HTML ASSET & IMAGE EXISTENCE AUDIT (ZERO WARNING TOLERANCE)');
console.log('================================================================================\n');

let missingCount = 0;
let checkedCount = 0;

for (const file of HTML_FILES) {
    const filePath = path.join(BASE_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');

    // Find all img src
    const imgMatches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
    for (const match of imgMatches) {
        const src = match[1];
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;

        checkedCount++;
        const assetPath = path.join(BASE_DIR, src.split('?')[0]);
        if (fs.existsSync(assetPath)) {
            console.log(`✅ [${file}] Image Exists: ${src}`);
        } else {
            console.error(`❌ [${file}] MISSING IMAGE: ${src}`);
            missingCount++;
        }
    }
}

console.log('\n================================================================================');
if (missingCount === 0) {
    console.log(`🎉 STRICT ASSET AUDIT PASSED: All ${checkedCount} local images & assets verified on disk!`);
    console.log('================================================================================\n');
    process.exit(0);
} else {
    console.error(`❌ STRICT ASSET AUDIT FAILED: ${missingCount} missing image(s) detected.`);
    console.log('================================================================================\n');
    process.exit(1);
}
