import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const htmlFiles = [
    'index.html',
    'live_index.html',
    'admin.html',
    'affiliate.html',
    'affiliate-dashboard.html',
    'affiliate-login.html',
    'store.html',
    'marketplace.html',
    'compare.html',
    'blog.html',
    'portal.html'
];

const newVer = '20261108_v170_master_responsive_engine_unlocked';

for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace style.css version query
    content = content.replace(/style\.css\?v=[^"'\s>]+/g, `style.css?v=${newVer}`);
    // Replace hero3d.js version query
    content = content.replace(/hero3d\.js(\?v=[^"'\s>]+)?/g, `hero3d.js?v=${newVer}`);
    // Replace ux_interactions.js version query
    content = content.replace(/ux_interactions\.js\?v=[^"'\s>]+/g, `ux_interactions.js?v=${newVer}`);
    // Replace app.js version query
    content = content.replace(/app\.js\?v=[^"'\s>]+/g, `app.js?v=${newVer}`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Cache-busted assets in ${file} to v=${newVer}`);
}
