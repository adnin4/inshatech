import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const subpages = [
    'marketplace.html',
    'store.html',
    'portal.html',
    'blog.html',
    'compare.html',
    'affiliate.html',
    'affiliate-login.html',
    'affiliate-dashboard.html'
];

for (const page of subpages) {
    const fullPath = path.join(ROOT_DIR, page);
    if (!fs.existsSync(fullPath)) continue;

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Lower canvas opacity
    content = content.replaceAll('opacity: 0.55;', 'opacity: 0.06;');

    // 2. Clean emoji clutter in nav links
    content = content.replaceAll('🚀 Mission System', 'Mission System');
    content = content.replaceAll('⚡ Outcomes', 'Outcomes');
    content = content.replaceAll('💎 Pricing', 'Pricing');
    content = content.replaceAll('🤝  Affiliate OS (30%)', 'Partner Network');
    content = content.replaceAll('🤝 Affiliate OS (30%)', 'Partner Network');
    content = content.replaceAll('🛒 Marketplace', 'Marketplace');
    content = content.replaceAll('⚔️  Compare', 'Compare');
    content = content.replaceAll('⚔️ Compare', 'Compare');
    content = content.replaceAll('🚀 Launch Mission', 'Launch Mission');
    content = content.replaceAll('🎛️  Control Panel', 'Control Panel');
    content = content.replaceAll('🎛️ Control Panel', 'Control Panel');
    content = content.replaceAll('📝 Blog', 'Blog');
    content = content.replaceAll('🏪 Store', 'Store');
    content = content.replaceAll('🌐 Portal', 'Portal');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[✓] Cleaned nav & canvas in ${page}`);
}

console.log('✅ All subpages cleaned.');
