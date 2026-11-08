const fs = require('fs');
const path = require('path');

const p = path.resolve(__dirname, '..', 'index.html');
let c = fs.readFileSync(p, 'utf8');

// Replace any <a href="https://wa.me... containing Download with real download link
c = c.replace(/<a\s+href="https:\/\/wa\.me\/8801629286887\?text=Hi%20Adnin!%20Send%20me%20the%20Free%20Gmail%20Invoice%20OCR%20n8n%20Template"[^>]*>[\s\S]*?Download\s+JSON<\/a>/i,
    '<a href="knowledge/gmail_invoice_ocr_template.json" download="gmail_invoice_ocr_template.json" class="btn btn-primary-sm" style="background:var(--accent-purple); text-decoration:none;">📥 Download JSON</a>'
);

fs.writeFileSync(p, c, 'utf8');
console.log('✅ Fixed Download JSON button in index.html to real file download.');
