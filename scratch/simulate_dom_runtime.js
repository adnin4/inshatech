const fs = require('fs');
const path = require('path');

// Simulate basic browser environment to catch unhandled null reference exceptions
function testJsRuntimeOnHtml(htmlFile, jsFile) {
    console.log(`\n=======================================================`);
    console.log(`TESTING RUNTIME: ${jsFile} on ${htmlFile}`);
    console.log(`=======================================================`);

    const html = fs.readFileSync(htmlFile, 'utf8');
    const js = fs.readFileSync(jsFile, 'utf8');

    // Simple mock DOM
    const elementIds = new Set();
    const idMatches = html.matchAll(/id=[\"\']([^\"\']+)[\"\']/g);
    for (const m of idMatches) elementIds.add(m[1]);

    console.log(`Loaded ${htmlFile} with ${elementIds.size} unique DOM IDs.`);

    // Check for unsafe getElementById calls without null checks in app.js
    const unsafePatterns = [
        /document\.getElementById\([\'\"]([^\'\"]+)[\'\"]\)\.(?:addEventListener|innerHTML|style|classList|value|onclick|appendChild)/g,
        /document\.querySelector\([\'\"]([^\'\"]+)[\'\"]\)\.(?:addEventListener|innerHTML|style|classList|value|onclick|appendChild)/g
    ];

    let unsafeCount = 0;
    for (const pat of unsafePatterns) {
        let match;
        while ((match = pat.exec(js)) !== null) {
            const queried = match[1];
            if (queried.startsWith('#')) {
                const rawId = queried.substring(1);
                if (!elementIds.has(rawId)) {
                    unsafeCount++;
                    if (unsafeCount <= 15) {
                        console.log(`❌ Unsafe null access on missing ID in ${htmlFile}: #${rawId} -> '${match[0]}'`);
                    }
                }
            } else if (!queried.startsWith('.') && !elementIds.has(queried)) {
                unsafeCount++;
                if (unsafeCount <= 15) {
                    console.log(`❌ Unsafe null access on missing ID in ${htmlFile}: #${queried} -> '${match[0]}'`);
                }
            }
        }
    }

    console.log(`Total unsafe direct property accesses on missing elements in ${htmlFile}: ${unsafeCount}`);
}

testJsRuntimeOnHtml('index.html', 'app.js');
testJsRuntimeOnHtml('admin.html', 'app.js');
testJsRuntimeOnHtml('store.html', 'app.js');
testJsRuntimeOnHtml('marketplace.html', 'app.js');
testJsRuntimeOnHtml('portal.html', 'app.js');
