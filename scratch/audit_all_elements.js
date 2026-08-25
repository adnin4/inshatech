const fs = require('fs');
const path = require('path');
const BASE_DIR = path.resolve(__dirname, '..');

const pages = ['index.html', 'admin.html', 'affiliate.html', 'affiliate-login.html', 'affiliate-dashboard.html', 'marketplace.html', 'portal.html', 'store.html', 'compare.html', 'blog.html'];

console.log('======================================================');
console.log('ðŸ” THOROUGH AUDIT: BUTTONS, NAV, TABS, SECTIONS & LINKS');
console.log('======================================================\n');

pages.forEach(p => {
    const filePath = path.join(BASE_DIR, p);
    const html = fs.readFileSync(filePath, 'utf8');
    
    console.log(`\n================== [ ${p} ] ==================`);
    
    // 1. Audit Navigation Links
    const aTags = [...html.matchAll(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    console.log(`ðŸ“Œ Found ${aTags.length} Anchor Links`);
    const brokenAnchors = [];
    aTags.forEach(m => {
        const href = m[1].trim();
        const text = m[2].replace(/<[^>]+>/g, '').trim().substring(0, 30);
        if (href.startsWith('#') && href.length > 1) {
            const targetId = href.substring(1);
            const idRegex = new RegExp(`id=["']${targetId}["']`, 'i');
            if (!idRegex.test(html)) {
                brokenAnchors.push({ href, text, reason: `Target ID #${targetId} NOT found in page` });
            }
        } else if (!href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:') && !href.startsWith('#') && href !== '') {
            // Local file link
            const targetFile = href.split('#')[0].split('?')[0];
            if (targetFile && !fs.existsSync(path.join(BASE_DIR, targetFile))) {
                brokenAnchors.push({ href, text, reason: `Local file ${targetFile} NOT found on disk` });
            }
        }
    });
    if (brokenAnchors.length > 0) {
        console.log(`   âš ï¸ Broken/Missing Anchor Targets (${brokenAnchors.length}):`);
        brokenAnchors.forEach(b => console.log(`      - href="${b.href}" (Text: "${b.text}") -> ${b.reason}`));
    } else {
        console.log(`   âœ… All ${aTags.length} anchor links point to valid targets/IDs!`);
    }

    // 2. Audit Buttons & Action Handlers
    const buttonTags = [...html.matchAll(/<button\s+([^>]*)>([\s\S]*?)<\/button>/gi)];
    console.log(`ðŸ“Œ Found ${buttonTags.length} Buttons`);
    const unhandledButtons = [];
    buttonTags.forEach((m, idx) => {
        const attrs = m[1];
        const text = m[2].replace(/<[^>]+>/g, '').trim().substring(0, 30);
        const onclickMatch = attrs.match(/onclick=["']([^"']*)["']/i);
        const idMatch = attrs.match(/id=["']([^"']*)["']/i);
        const classMatch = attrs.match(/class=["']([^"']*)["']/i);
        
        if (onclickMatch) {
            const funcCall = onclickMatch[1].trim();
            const funcName = funcCall.split('(')[0].replace(/return\s+/, '').trim();
            // Check if funcName is defined in html or app.js
            if (funcName && !/^(window\.|document\.|location\.|history\.|alert|confirm|prompt|event)/.test(funcName)) {
                const funcRegex = new RegExp(`(?:function\\s+${funcName}|(?:window\\.)?${funcName}\\s*=\\s*(?:function|\\()|const\\s+${funcName}\\s*=)`, 'i');
                const isDefInHtml = funcRegex.test(html);
                const isDefInApp = funcRegex.test(fs.readFileSync(path.join(BASE_DIR, 'app.js'), 'utf8'));
                const isDefInCopilot = funcRegex.test(fs.readFileSync(path.join(BASE_DIR, 'universal_ai_copilot.js'), 'utf8'));
                const isDefInAffiliate = fs.existsSync(path.join(BASE_DIR, 'js', 'core', 'affiliate-portal.js')) && funcRegex.test(fs.readFileSync(path.join(BASE_DIR, 'js', 'core', 'affiliate-portal.js'), 'utf8'));
                
                if (!isDefInHtml && !isDefInApp && !isDefInCopilot && !isDefInAffiliate) {
                    unhandledButtons.push({ idx, text, attrs: onclickMatch[0], reason: `Function '${funcName}()' not found in page or core JS` });
                }
            }
        } else if (!idMatch && !classMatch) {
            unhandledButtons.push({ idx, text, attrs, reason: 'No onclick, id, or class found' });
        }
    });

    if (unhandledButtons.length > 0) {
        console.log(`   âš ï¸ Potential Unhandled/Undefined Button Actions (${unhandledButtons.length}):`);
        unhandledButtons.forEach(u => console.log(`      - Button #${u.idx} ("${u.text}"): ${u.attrs} -> ${u.reason}`));
    } else {
        console.log(`   âœ… All ${buttonTags.length} buttons have handlers or identifiers!`);
    }

    // 3. Audit Tab Switching Panels (if admin.html or has tabs)
    if (p === 'admin.html') {
        console.log(`ðŸ“Œ Auditing Admin Cockpit Tabs...`);
        const tabTriggers = [...html.matchAll(/switchAdminCockpitTab\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
        const uniqueTabs = [...new Set(tabTriggers)];
        console.log(`   Found ${uniqueTabs.length} Unique Tabs: ${uniqueTabs.join(', ')}`);
        uniqueTabs.forEach(tab => {
            const panelExists = new RegExp(`id=["']view-${tab}["']`, 'i').test(html);
            const btnExists = new RegExp(`id=["']nav-btn-${tab}["']`, 'i').test(html);
            if (!panelExists) console.log(`   âŒ Missing View Panel: #view-${tab}`);
            if (!btnExists) console.log(`   âš ï¸ Missing Nav Button: #nav-btn-${tab}`);
        });
    }

    // 4. Audit Modals
    const modals = [...html.matchAll(/id=["']([a-zA-Z0-9_-]*modal[a-zA-Z0-9_-]*)["']/gi)].map(m => m[1]);
    if (modals.length > 0) {
        console.log(`ðŸ“Œ Found ${modals.length} Modals: ${modals.join(', ')}`);
    }
});

