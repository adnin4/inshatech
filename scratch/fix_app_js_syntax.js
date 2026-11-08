const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

const lines = content.split(/\r?\n/);
let replacedCount = 0;
const cleanedLines = lines.map(line => {
    if (line.includes('document.getElementById') && line.includes('?') && line.includes(':')) {
        const match = line.match(/^(\s*(?:const|let|var)\s+[a-zA-Z0-9_$]+\s*=)\s*.*document\.getElementById\((['"][^'"]+['"])\).*$/);
        if (match) {
            replacedCount++;
            const prefix = match[1];
            const elemId = match[2]; // this contains 'audit-company'
            return `${prefix} document.getElementById(${elemId}) ? (document.getElementById(${elemId}).value || '') : '';`;
        }
    }
    return line;
});

fs.writeFileSync(appJsPath, cleanedLines.join('\n'), 'utf8');
console.log(`Replaced ${replacedCount} malformed element getter lines in app.js!`);
