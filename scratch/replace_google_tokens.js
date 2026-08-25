/**
 * Replace placeholder Google verification tokens with verified token
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const files = ['affiliate.html', 'blog.html', 'compare.html', 'marketplace.html', 'portal.html', 'store.html', 'admin.html', 'index.html'];

for (const file of files) {
    const p = path.join(BASE_DIR, file);
    if (fs.existsSync(p)) {
        let c = fs.readFileSync(p, 'utf8');
        c = c.replace(/google-search-console-verification-code/g, 'google050e48ae270ce622');
        fs.writeFileSync(p, c, 'utf8');
        console.log(`✅ [${file}] Updated Google verification token.`);
    }
}
