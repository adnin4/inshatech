/**
 * IINSHA AI-BOS — Public Marketing & Positioning Parity Sanitizer
 * Purges legacy ungrounded claims and aligns copy with Bounded Autonomous AI Company architecture
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const FILES = ['index.html', 'store.html', 'marketplace.html', 'compare.html'];

console.log('================================================================================');
console.log('🧹 SANITIZING PUBLIC MARKETING COPY TO HONEST BOUNDED AI-BOS STANDARDS');
console.log('================================================================================\n');

for (const file of FILES) {
    const filePath = path.join(BASE_DIR, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    let modifications = 0;

    // 1. Replace Cloudflare Bypass claims
    if (content.includes('Cloudflare Bypass')) {
        content = content.replace(/Cloudflare Bypass/g, 'Resilient Session Management');
        modifications++;
    }

    // 2. Replace OpenClaw stealth scraper claims
    if (content.includes('OpenClaw stealth') || content.includes('stealth scraper')) {
        content = content.replace(/OpenClaw stealth/g, 'Playwright Resilient Pipeline');
        content = content.replace(/stealth scraper/g, 'structured pipeline extractor');
        modifications++;
    }

    // 3. Modernize Hostinger VPS promo text into Enterprise Self-Hosted VPS
    if (content.includes('Hostinger VPS Promo: <strong>IINSHA20</strong>')) {
        content = content.replace(/Hostinger VPS Promo: <strong>IINSHA20<\/strong> \(20% OFF\)/g, 'Self-Hosted Cloud VPS • Zero Vendor Lock-in');
        modifications++;
    }

    // 4. Calibrate Gemini 3.5 Ultra or unverified model claims
    if (content.includes('Gemini 3.5 Ultra')) {
        content = content.replace(/Gemini 3.5 Ultra/g, 'Gemini 2.0 Flash / Pro');
        modifications++;
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ [${file}] Sanitized ${modifications} legacy marketing claims.`);
}

console.log('\n================================================================================');
console.log('🎉 MARKETING CONTENT PARITY SANITIZATION COMPLETE!');
console.log('================================================================================\n');
