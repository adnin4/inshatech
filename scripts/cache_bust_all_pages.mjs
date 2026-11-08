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
    'portal.html',
    'privacy.html',
    'terms.html'
];

const newVer = '20261109_v900_diagram_master_replica';

for (const file of htmlFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Replace CSS version queries
    content = content.replace(/style\.css(\?v=[^"'\s>]+)?/g, `style.css?v=${newVer}`);
    content = content.replace(/iinsha-diagram-motion\.css(\?v=[^"'\s>]+)?/g, `iinsha-diagram-motion.css?v=${newVer}`);
    content = content.replace(/iinsha-diagram-design-system\.css(\?v=[^"'\s>]+)?/g, `iinsha-diagram-design-system.css?v=${newVer}`);
    content = content.replace(/iinsha-design-system\.css(\?v=[^"'\s>]+)?/g, `iinsha-design-system.css?v=${newVer}`);

    // Replace JS version queries
    content = content.replace(/iinsha-diagram-motion\.js(\?v=[^"'\s>]+)?/g, `iinsha-diagram-motion.js?v=${newVer}`);
    content = content.replace(/hero3d\.js(\?v=[^"'\s>]+)?/g, `hero3d.js?v=${newVer}`);
    content = content.replace(/ux_interactions\.js(\?v=[^"'\s>]+)?/g, `ux_interactions.js?v=${newVer}`);
    content = content.replace(/app\.js(\?v=[^"'\s>]+)?/g, `app.js?v=${newVer}`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cache-busted assets in ${file} to v=${newVer}`);
}

// Ensure 100% byte-for-byte exact parity between index.html and live_index.html
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
fs.writeFileSync(path.join(ROOT, 'live_index.html'), indexHtml, 'utf8');
console.log('✅ Synchronized index.html -> live_index.html (100% byte-for-byte parity guaranteed)');
