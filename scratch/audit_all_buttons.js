const fs = require('fs');

const htmlFiles = [
    'index.html',
    'store.html',
    'marketplace.html',
    'portal.html',
    'admin.html',
    'affiliate.html',
    'affiliate-login.html',
    'affiliate-dashboard.html',
    'compare.html',
    'blog.html'
];

console.log('=== COMPREHENSIVE BUTTON & LINK AUDIT ===');

const allFunctionsInAppJs = fs.readFileSync('app.js', 'utf8');

let grandTotalButtons = 0;
let grandTotalIssues = 0;

htmlFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    
    console.log(`\n--- Inspecting ${file} ---`);
    
    // Find all <button> elements
    const buttonRegex = /<button([\s\S]*?)>([\s\S]*?)<\/button>/gi;
    let match;
    let totalButtons = 0;
    let fileIssues = 0;
    
    while ((match = buttonRegex.exec(content)) !== null) {
        totalButtons++;
        grandTotalButtons++;
        const attrs = match[1];
        const text = match[2].replace(/<[^>]*>?/gm, '').trim();
        
        const hasOnClick = /onclick=["']([^"']+)["']/i.exec(attrs);
        const hasId = /id=["']([^"']+)["']/i.exec(attrs);
        const hasType = /type=["']([^"']+)["']/i.exec(attrs);
        const classMatch = /class=["']([^"']+)["']/i.exec(attrs);
        const classes = classMatch ? classMatch[1].split(/\s+/) : [];
        
        let isHandled = false;
        
        if (hasOnClick) {
            const handler = hasOnClick[1];
            const fnNameMatch = handler.match(/^([a-zA-Z0-9_$]+)\s*\(/);
            if (fnNameMatch) {
                const fnName = fnNameMatch[1];
                const exists = content.includes(`function ${fnName}`) || content.includes(`${fnName} =`) || content.includes(`window.${fnName}`) ||
                               allFunctionsInAppJs.includes(`function ${fnName}`) || allFunctionsInAppJs.includes(`${fnName} =`) || allFunctionsInAppJs.includes(`window.${fnName}`) ||
                               ['alert', 'confirm', 'prompt', 'openCheckoutModal', 'openMarketplaceDetails'].includes(fnName);
                if (exists) {
                    isHandled = true;
                } else {
                    console.log(`  ❌ [${file}] Button "${text}": Handler function "${fnName}" missing!`);
                    fileIssues++;
                }
            } else {
                // inline statement like modal.style.display='none'
                isHandled = true;
            }
        }
        
        if (hasType && (hasType[1] === 'submit' || hasType[1] === 'reset')) {
            isHandled = true;
        }
        
        if (hasId) {
            const id = hasId[1];
            if (content.includes(id) || allFunctionsInAppJs.includes(id)) {
                isHandled = true;
            }
        }
        
        // Check if any class has a document.querySelectorAll or getElementsByClassName listener
        classes.forEach(c => {
            if (content.includes(`.${c}`) || content.includes(`"${c}"`) || content.includes(`'${c}'`) ||
                allFunctionsInAppJs.includes(`.${c}`) || allFunctionsInAppJs.includes(`"${c}"`) || allFunctionsInAppJs.includes(`'${c}'`)) {
                isHandled = true;
            }
        });
        
        // Check data- attributes handled
        if (attrs.includes('data-cat') || attrs.includes('data-curr') || attrs.includes('data-comp') || attrs.includes('data-code') || attrs.includes('data-query') || attrs.includes('data-tier')) {
            isHandled = true;
        }
        
        if (!isHandled) {
            console.log(`  🚨 [${file}] Unhandled button "${text}": (Attrs: ${attrs.trim()})`);
            fileIssues++;
        }
    }
    
    grandTotalIssues += fileIssues;
    console.log(`  Total buttons in ${file}: ${totalButtons} | Issues found: ${fileIssues}`);
});

console.log(`\n========================================`);
console.log(`AUDIT COMPLETE: ${grandTotalButtons} Buttons Evaluated | ${grandTotalIssues} Issues Found`);
console.log(`========================================`);
