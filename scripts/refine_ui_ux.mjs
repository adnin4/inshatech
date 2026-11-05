import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const indexPath = path.join(ROOT_DIR, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('1. Refining os-status-bar in index.html...');
const oldStatusBarStart = html.indexOf('<div class="os-status-bar"');
const oldStatusBarEnd = html.indexOf('<!-- NAVIGATION HEADER -->');
if (oldStatusBarStart !== -1 && oldStatusBarEnd !== -1) {
    const newStatusBar = `<div class="os-status-bar" style="background: rgba(6, 8, 13, 0.95); border-bottom: 1px solid var(--border-card); padding: 6px 16px;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; font-size: 0.78rem;">
            <div class="status-bar-left" style="display: flex; gap: 14px; align-items: center;">
                <span class="os-metric-badge" style="background: rgba(16, 185, 129, 0.12); color: var(--accent-emerald); border-color: rgba(16, 185, 129, 0.3); font-weight: 700;">
                    <span class="os-pulse-dot"></span> SYSTEM ONLINE • NODE 22 MESH
                </span>
                <span class="os-status-secondary-text" style="color: var(--text-dim);">Enterprise Multi-Agent Architecture</span>
                <span class="os-status-secondary-text" style="color: var(--text-dim);">Sovereign VPS • Zero Vendor Lock-in</span>
            </div>
            <div class="status-bar-right" style="display: flex; gap: 12px; align-items: center;">
                <a href="https://wa.me/8801629286887" target="_blank" class="os-whatsapp-contact" style="color: var(--text-secondary); text-decoration: none;">Direct WhatsApp: <strong style="color: #f1f5f9;">+8801629286887</strong></a>
                <a href="affiliate.html" style="color: var(--accent-cyan); text-decoration: none; font-weight: 600;">Partner Network →</a>
                <button onclick="openProtectedAdminPanel()" class="portal-tab-admin-btn" style="padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; cursor: pointer;">Control Panel</button>
            </div>
        </div>
    </div>\n\n    `;
    html = html.slice(0, oldStatusBarStart) + newStatusBar + html.slice(oldStatusBarEnd);
    console.log('   ✓ os-status-bar upgraded to enterprise ticker.');
}

console.log('2. Refining logo icon in navbar...');
html = html.replace(
    '<span class="logo-icon">⚡</span>',
    '<span class="logo-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span>'
);

console.log('3. Refining scarcity-badge into architectural invariant badge...');
html = html.replace(
    /Production Capacity:\s*<strong style="color: #10b981;">3 Active Engineering Slots<\/strong>\s*•\s*Response SLA:\s*<strong style="color: #38bdf8;">&lt; 1 Hour<\/strong>/g,
    'Operational Invariant: <strong style="color: #10b981;">Deterministic Autonomous Workflows</strong> • Verification SLA: <strong style="color: #38bdf8;">100% Invariant Gate</strong>'
);

console.log('4. Refining hero actions...');
html = html.replace(
    '<span>Launch AI Solution Finder →</span>',
    '<span>Explore Solutions →</span>'
);
html = html.replace(
    '<span>Partner Network (15-20% Recurring) →</span>',
    '<span>Partner Network →</span>'
);
html = html.replace(
    '<span>20-Q AI Readiness Audit</span>',
    '<span>AI Readiness Audit (20-Q)</span>'
);

console.log('5. Refining pre-sales prompt engine...');
html = html.replace('💡 AI Pre-Sales Assistant', 'AI Pre-Sales Assistant');

console.log('6. Refining urgency bar text...');
html = html.replace('⚡ <strong>Current Studio Capacity:</strong>', '<strong>Current Studio Capacity:</strong>');

console.log('7. Refining Solution Finder section...');
html = html.replace('<span class="section-tag">Interactive AI Module 1</span>', '<span class="section-tag">Architecture Engine 01</span>');
html = html.replace('<h2> AI Solution Finder</h2>', '<h2>AI Solution Finder</h2>');
html = html.replace('<h2> ✨ AI Solution Finder</h2>', '<h2>AI Solution Finder</h2>');
html = html.replace('>📄 Invoice OCR<', '>Invoice OCR<');
html = html.replace('>🕷️  E-commerce Scraper<', '>E-Commerce Scraper<');
html = html.replace('>🤖 Support Triage Bot<', '>Support Triage Bot<');
html = html.replace('>📊 Lead Enrichment<', '>Lead Enrichment<');
html = html.replace('<span>✨ Generate Custom Architecture Blueprint →</span>', '<span>Generate Custom Architecture Blueprint →</span>');

console.log('8. Removing package button emoji clutter...');
html = html.replaceAll('📦 View Packages', 'View Packages');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ index.html refined successfully.');
