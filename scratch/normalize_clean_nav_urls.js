/**
 * Normalize navigation links to clean canonical URLs across all HTML files
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const files = [
    'index.html', 'store.html', 'marketplace.html', 'compare.html', 'blog.html',
    'portal.html', 'affiliate.html', 'affiliate-login.html', 'affiliate-dashboard.html', 'admin.html'
];

const urlMappings = [
    { from: /href="store\.html"/g, to: 'href="/store"' },
    { from: /href="marketplace\.html"/g, to: 'href="/marketplace"' },
    { from: /href="compare\.html"/g, to: 'href="/compare"' },
    { from: /href="blog\.html"/g, to: 'href="/blog"' },
    { from: /href="portal\.html"/g, to: 'href="/portal"' },
    { from: /href="affiliate\.html"/g, to: 'href="/affiliate"' },
    { from: /href="affiliate-login\.html"/g, to: 'href="/affiliate-login"' },
    { from: /href="affiliate-dashboard\.html"/g, to: 'href="/affiliate-dashboard"' },
    { from: /href="admin\.html"/g, to: 'href="/admin"' }
];

for (const file of files) {
    const p = path.join(BASE_DIR, file);
    if (!fs.existsSync(p)) continue;

    let content = fs.readFileSync(p, 'utf8');
    let count = 0;

    for (const map of urlMappings) {
        const matches = content.match(map.from);
        if (matches) {
            count += matches.length;
            content = content.replace(map.from, map.to);
        }
    }

    fs.writeFileSync(p, content, 'utf8');
    console.log(`✅ [${file}] Normalized ${count} internal links to clean URLs.`);
}
