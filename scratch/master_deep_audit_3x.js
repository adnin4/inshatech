const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');

const ALL_PAGES = [
    'index.html',
    'admin.html',
    'affiliate.html',
    'affiliate-login.html',
    'affiliate-dashboard.html',
    'marketplace.html',
    'portal.html',
    'store.html',
    'compare.html',
    'blog.html'
];

console.log('======================================================================');
console.log('ðŸ”¬ MASTER 3X DEEP AUDIT: LINKS, BUTTONS, MODALS, IMAGES, APIS & SEO');
console.log('======================================================================\n');

let issuesFound = 0;

// Load Core JS files for function definitions
const appJs = fs.readFileSync(path.join(BASE_DIR, 'app.js'), 'utf8');
const copilotJs = fs.readFileSync(path.join(BASE_DIR, 'universal_ai_copilot.js'), 'utf8');
const affiliateJs = fs.existsSync(path.join(BASE_DIR, 'js', 'core', 'affiliate-portal.js')) 
    ? fs.readFileSync(path.join(BASE_DIR, 'js', 'core', 'affiliate-portal.js'), 'utf8') : '';

ALL_PAGES.forEach(page => {
    const filePath = path.join(BASE_DIR, page);
    if (!fs.existsSync(filePath)) {
        console.log(`âŒ Page missing on disk: ${page}`);
        issuesFound++;
        return;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    console.log(`\nðŸ“„ Auditing: ${page} (${(html.length / 1024).toFixed(1)} KB)`);

    // 1. Check SEO & Social Meta
    const hasTitle = /<title>([^<]+)<\/title>/i.test(html);
    const hasDesc = /<meta\s+name=["']description["']/i.test(html);
    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
    const hasCanonical = /<link\s+rel=["']canonical["']/i.test(html);
    const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(html);

    if (!hasTitle) { console.log(`   âš ï¸ [SEO] Missing <title> tag in ${page}`); issuesFound++; }
    if (!hasDesc) { console.log(`   âš ï¸ [SEO] Missing description meta tag in ${page}`); issuesFound++; }
    if (!hasViewport) { console.log(`   âš ï¸ [SEO] Missing viewport meta tag in ${page}`); issuesFound++; }
    if (!hasCanonical) { console.log(`   âš ï¸ [SEO] Missing canonical link in ${page}`); issuesFound++; }
    if (!hasOgTitle) { console.log(`   âš ï¸ [SEO] Missing OpenGraph tags in ${page}`); issuesFound++; }

    // 2. Check all Anchor Links
    const aTags = [...html.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    aTags.forEach(m => {
        const href = m[1].trim();
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            if (!html.includes(`id="${targetId}"`) && !html.includes(`id='${targetId}'`)) {
                // If it's a dynamic JS tab/modal, ignore; otherwise flag
                if (!['tab-panel-', 'view-'].some(prefix => targetId.startsWith(prefix))) {
                    console.log(`   âš ï¸ [Anchor] Fragment '#${targetId}' not found in ${page}`);
                    issuesFound++;
                }
            }
        } else if (!href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('${')) {
            const targetFile = href.split('#')[0].split('?')[0];
            if (targetFile && !fs.existsSync(path.join(BASE_DIR, targetFile))) {
                console.log(`   âš ï¸ [Link] Local target '${targetFile}' linked in ${page} does not exist on disk!`);
                issuesFound++;
            }
        }
    });

    // 3. Check all Images
    const imgTags = [...html.matchAll(/<img\s+[^>]*src=["']([^"']*)["'][^>]*>/gi)];
    imgTags.forEach(m => {
        const src = m[1].trim();
        if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('data:') && !src.startsWith('${')) {
            if (!fs.existsSync(path.join(BASE_DIR, src))) {
                console.log(`   âš ï¸ [Image] Local image '${src}' in ${page} does not exist on disk!`);
                issuesFound++;
            }
        }
    });

    // 4. Check all Scripts & Stylesheets
    const scriptTags = [...html.matchAll(/<script\s+[^>]*src=["']([^"']*)["'][^>]*>/gi)];
    scriptTags.forEach(m => {
        const src = m[1].trim().split('?')[0];
        if (!src.startsWith('http://') && !src.startsWith('https://')) {
            if (!fs.existsSync(path.join(BASE_DIR, src))) {
                console.log(`   âš ï¸ [Script] Script '${src}' in ${page} not found on disk!`);
                issuesFound++;
            }
        }
    });

    const cssTags = [...html.matchAll(/<link\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']stylesheet["']/gi)];
    cssTags.forEach(m => {
        const href = m[1].trim().split('?')[0];
        if (!href.startsWith('http://') && !href.startsWith('https://')) {
            if (!fs.existsSync(path.join(BASE_DIR, href))) {
                console.log(`   âš ï¸ [CSS] Stylesheet '${href}' in ${page} not found on disk!`);
                issuesFound++;
            }
        }
    });

    // 5. Check all Buttons and OnClick Handlers
    const btnRegex = /<button([\s\S]*?)>([\s\S]*?)<\/button>/gi;
    let bMatch;
    while ((bMatch = btnRegex.exec(html)) !== null) {
        const attrs = bMatch[1];
        const text = bMatch[2].replace(/<[^>]+>/g, '').trim();
        const ocMatch = attrs.match(/onclick=["']([^"']+)["']/i);
        if (ocMatch) {
            const code = ocMatch[1].trim();
            const fnMatch = code.match(/^([a-zA-Z0-9_$]+)\s*\(/);
            if (fnMatch) {
                const fn = fnMatch[1];
                const isGlobal = /^(alert|confirm|prompt|open|close|eval|setTimeout|setInterval)/.test(fn);
                const fnRegex = new RegExp(`(?:function\\s+${fn}|(?:window\\.)?${fn}\\s*=\\s*(?:function|\\()|const\\s+${fn}\\s*=)`, 'i');
                const isDef = fnRegex.test(html) || fnRegex.test(appJs) || fnRegex.test(copilotJs) || fnRegex.test(affiliateJs);
                if (!isGlobal && !isDef) {
                    console.log(`   âŒ [Button] Button "${text}" onclick="${fn}()" is undefined in ${page}!`);
                    issuesFound++;
                }
            }
        }
    }
});

// 6. Check API Endpoints invoked in JS vs Existing Functions
console.log('\nðŸ“¡ Auditing Client-to-Edge API Endpoints...');
const allCode = appJs + copilotJs + affiliateJs;
const fetchMatches = [...allCode.matchAll(/fetch\s*\(\s*['"`](\/api\/[^'"`?]+)/g)];
const checkedApis = new Set();
fetchMatches.forEach(m => {
    const apiPath = m[1];
    if (checkedApis.has(apiPath)) return;
    checkedApis.add(apiPath);

    // Map /api/foo/bar to functions/api/foo/bar.js or functions/api/foo/bar/index.js
    const relPath = apiPath.replace(/^\//, '') + '.js';
    const diskPath = path.join(BASE_DIR, 'functions', apiPath.replace(/^\/api\//, '') + '.js');
    const diskPathDirect = path.join(BASE_DIR, apiPath.replace(/^\//, '') + '.js');
    const diskPathFunctions = path.join(BASE_DIR, 'functions', apiPath.replace(/^\//, '') + '.js');

    const exists = fs.existsSync(diskPath) || fs.existsSync(diskPathDirect) || fs.existsSync(diskPathFunctions);
    if (!exists) {
        console.log(`   âš ï¸ [API] Endpoint '${apiPath}' called in JS is missing edge handler file under functions/!`);
        issuesFound++;
    } else {
        console.log(`   âœ… [API] Endpoint '${apiPath}' -> Handler Verified ðŸŸ¢`);
    }
});

console.log('\n======================================================================');
if (issuesFound === 0) {
    console.log('ðŸŽ‰ 100% PERFECT AUDIT! 0 Issues Found Across All 10 Pages & Edge APIs!');
} else {
    console.log(`âš ï¸ AUDIT COMPLETE: ${issuesFound} Potential Issues / Enhancements Isolated.`);
}
console.log('======================================================================\n');

