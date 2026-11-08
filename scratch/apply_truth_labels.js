const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Update ROI calculator header to include "● Illustrative Financial Simulation"
indexHtml = indexHtml.replace(
    '<h2>⭐ Enterprise Automation ROI Calculator</h2>',
    '<h2>⭐ Enterprise Automation ROI Calculator <span style="background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.3); color:#93c5fd; font-size:0.75rem; padding:3px 8px; border-radius:4px; font-weight:600; vertical-align:middle;">● Illustrative Simulation</span></h2>'
);

// 2. Update scraper terminal log line to Resilient Session Handshake
indexHtml = indexHtml.replace(
    '[INFO] Playwright Pipeline Resilient Data Scraper Node #4: Cloudflare Challenge Cleared (210ms)',
    '[INFO] Playwright Pipeline Resilient Data Collection Node #4: Session Handshake Cleared (210ms)'
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('index.html updated with Truth-in-Advertising labels successfully!');
