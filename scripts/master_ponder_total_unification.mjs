/**
 * MASTER PONDER TOTAL UNIFICATION SCRIPT
 * =====================================
 * Transforms the entire codebase to match Ponder's high-contrast monochromatic,
 * brutalist-editorial, high-precision aesthetic.
 * 
 * - Purges all neon gradients, purples, cyans, and greens from inline HTML, CSS, and JS
 * - Sets background video to deep monochromatic texture (opacity 0.12, grayscale)
 * - Upgrades hero3d.js to pure white/silver neural constellation
 * - Upgrades universal_ai_copilot.js to sleek obsidian glass
 * - Harmonizes all button CTAs into stark white pills and frosted ghost pills
 * - Enforces 100% DOM parity between index.html and live_index.html
 * - Bumps cache busters across all 13 HTML files
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

console.log('🚀 Starting Master Ponder Total Unification...\n');

// =========================================================================
// 1. TRANSFORM hero3d.js -> Pure Silver/White Monochromatic Constellation
// =========================================================================
function transformHero3D() {
    const hero3dPath = path.join(ROOT, 'hero3d.js');
    if (!fs.existsSync(hero3dPath)) {
        console.warn('⚠️ hero3d.js not found');
        return;
    }
    let code = fs.readFileSync(hero3dPath, 'utf8');

    // Replace color config
    code = code.replace(
        /colors:\s*\{[^}]+\}/s,
        `colors: {
            core: '#ffffff',
            cyan: '#ffffff',
            violet: '#ffffff',
            gold: '#e2e8f0',
            emerald: '#cbd5e1',
            particles: ['#ffffff', '#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']
        }`
    );

    // Replace corona glow
    code = code.replace(
        /coronaGrad\.addColorStop\(0\.35,\s*'rgba\(139,\s*92,\s*246,\s*0\.35\)'\);/g,
        "coronaGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.25)');"
    );
    code = code.replace(
        /coreGrad\.addColorStop\(0\.7,\s*'rgba\(139,\s*92,\s*246,\s*0\.8\)'\);/g,
        "coreGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');"
    );
    code = code.replace(
        /ctx\.strokeStyle\s*=\s*'rgba\(139,\s*92,\s*246,\s*0\.38\)';/g,
        "ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';"
    );

    fs.writeFileSync(hero3dPath, code, 'utf8');
    console.log('✅ hero3d.js transformed to pure Ponder silver/white constellation');
}

// =========================================================================
// 2. TRANSFORM Copilot Headers in universal_ai_copilot.js
// =========================================================================
function transformCopilot() {
    const files = [
        path.join(ROOT, 'universal_ai_copilot.js'),
        path.join(ROOT, 'ai_brain', 'universal_ai_copilot.js')
    ];

    for (const f of files) {
        if (!fs.existsSync(f)) continue;
        let code = fs.readFileSync(f, 'utf8');

        // Replace gradient headers
        code = code.replace(
            /linear-gradient\(135deg,\s*#ffffff\s*0%,\s*#6366f1\s*50%,\s*#a855f7\s*100%\)/g,
            'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)'
        );
        code = code.replace(
            /background:\s*linear-gradient\(135deg,\s*#6366f1,\s*#a855f7\)/g,
            'background: #ffffff; color: #020202'
        );
        code = code.replace(
            /linear-gradient\(135deg,\s*rgba\(99,\s*102,\s*241,\s*0\.2\),\s*rgba\(168,\s*85,\s*247,\s*0\.2\)\)/g,
            'rgba(255, 255, 255, 0.06)'
        );

        fs.writeFileSync(f, code, 'utf8');
        console.log(`✅ Copilot script updated: ${path.basename(f)}`);
    }
}

// =========================================================================
// 3. TRANSFORM app.js Dynamic Injection Neons
// =========================================================================
function transformAppJs() {
    const appPath = path.join(ROOT, 'app.js');
    if (!fs.existsSync(appPath)) return;
    let code = fs.readFileSync(appPath, 'utf8');

    // Replace neon colors in SVG lines and nodes
    code = code.replace(/stop-color="#06b6d4"/g, 'stop-color="#ffffff"');
    code = code.replace(/stroke="#8b5cf6"/g, 'stroke="rgba(255,255,255,0.4)"');
    code = code.replace(/stroke="#06b6d4"/g, 'stroke="rgba(255,255,255,0.4)"');
    code = code.replace(/color:#06b6d4/g, 'color:#ffffff');
    code = code.replace(/color:#8b5cf6/g, 'color:#cbd5e1');
    code = code.replace(/color:#a855f7/g, 'color:#e2e8f0');
    code = code.replace(/color:#c084fc/g, 'color:#ffffff');
    code = code.replace(/color:#a78bfa/g, 'color:#ffffff');
    code = code.replace(/background:rgba\(139,\s*92,\s*246,\s*0\.25\)/g, 'background:rgba(255,255,255,0.08)');
    code = code.replace(/background:rgba\(168,\s*85,\s*247,\s*0\.2\)/g, 'background:rgba(255,255,255,0.08)');
    code = code.replace(/background:rgba\(168,\s*85,\s*247,\s*0\.1\)/g, 'background:rgba(255,255,255,0.04)');
    code = code.replace(/border:1px solid #a855f7/g, 'border:1px solid rgba(255,255,255,0.18)');
    code = code.replace(/border-left: 3px solid #a855f7/g, 'border-left: 1px solid rgba(255,255,255,0.25)');
    code = code.replace(/border: 1px solid #06b6d4/g, 'border: 1px solid rgba(255,255,255,0.15)');
    code = code.replace(/color: '#8b5cf6'/g, "color: '#ffffff'");

    // God mode panel gradients
    code = code.replace(
        /linear-gradient\(135deg,\s*rgba\(15,23,42,0\.98\),\s*rgba\(30,27,75,0\.95\)\)/g,
        'rgba(8, 8, 8, 0.96)'
    );
    code = code.replace(
        /linear-gradient\(135deg,\s*rgba\(15,23,42,0\.98\),\s*rgba\(88,28,135,0\.95\)\)/g,
        'rgba(8, 8, 8, 0.96)'
    );

    fs.writeFileSync(appPath, code, 'utf8');
    console.log('✅ app.js dynamic injections purged of neons');
}

// =========================================================================
// 4. TRANSFORM style.css -> Video Backdrop, Remaining Colors, Ponder Depth
// =========================================================================
function transformCSS() {
    const cssPath = path.join(ROOT, 'style.css');
    let css = fs.readFileSync(cssPath, 'utf8');

    // 4A: Purge remaining neon hexes
    css = css.replace(/#4facfe/gi, '#ffffff');
    css = css.replace(/#06b6d4/gi, '#ffffff');
    css = css.replace(/#8b5cf6/gi, '#ffffff');
    css = css.replace(/#00ff87/gi, '#ffffff');

    // 4B: Mute global video backdrop to subtle dark cinematic texture
    css = css.replace(
        /\.global-video-backdrop\s*\{[^}]*\}/g,
        `.global-video-backdrop {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 0.12 !important;
    filter: grayscale(100%) contrast(1.4) brightness(0.5) !important;
    transition: opacity 0.6s ease !important;
    display: block !important;
}`
    );

    // 4C: Ensure all glowing borders are crisp 1px borders
    css = css.replace(
        /\.glowing-border\s*\{[^}]*\}/g,
        `.glowing-border {
    box-shadow: none !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
}`
    );

    // 4D: Ensure buttons have true Ponder styling across the entire stylesheet
    if (!css.includes('/* PONDER CANONICAL PILL CTAS */')) {
        css += `\n
/* PONDER CANONICAL PILL CTAS */
.btn-primary, .btn-primary-glow, .btn-submit, .ponder-pill-primary {
    background: #ffffff !important;
    color: #020202 !important;
    font-weight: 700 !important;
    border-radius: 9999px !important;
    border: 1px solid #ffffff !important;
    box-shadow: none !important;
    letter-spacing: -0.01em !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.btn-primary:hover, .btn-primary-glow:hover, .btn-submit:hover, .ponder-pill-primary:hover {
    background: #e2e8f0 !important;
    color: #020202 !important;
    transform: translateY(-1px) !important;
    box-shadow: none !important;
}

.btn-secondary, .btn-outline, .btn-ghost, .btn-glass-glow, .btn-glass, .btn-glass-sm, .ponder-pill-secondary {
    background: rgba(255, 255, 255, 0.05) !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.18) !important;
    box-shadow: none !important;
    transition: all 0.25s ease !important;
}

.btn-secondary:hover, .btn-outline:hover, .btn-ghost:hover, .btn-glass-glow:hover, .btn-glass:hover, .btn-glass-sm:hover, .ponder-pill-secondary:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.35) !important;
    transform: translateY(-1px) !important;
    box-shadow: none !important;
}
`;
    }

    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✅ style.css updated with muted video backdrop & canonical Ponder pills');
}

// =========================================================================
// 5. TRANSFORM All HTML Files: Purge Inline Colored Gradients & Neon Buttons
// =========================================================================
function transformHTMLFiles() {
    const htmlFiles = [
        'index.html',
        'live_index.html',
        'admin.html',
        'affiliate.html',
        'affiliate-dashboard.html',
        'affiliate-login.html',
        'store.html',
        'marketplace.html',
        'compare.html',
        'blog.html',
        'portal.html',
        'privacy.html',
        'terms.html'
    ];

    for (const fileName of htmlFiles) {
        const filePath = path.join(ROOT, fileName);
        if (!fs.existsSync(filePath)) continue;

        let html = fs.readFileSync(filePath, 'utf8');

        // Replace green/blue button gradients with stark white or ghost pill
        html = html.replace(
            /style="background:\s*linear-gradient\(135deg,\s*#10b981,\s*#059669\)(?:[^"]*)?"/g,
            'style="background: #ffffff; color: #020202; font-weight: 700; border-radius: 9999px; border: 1px solid #ffffff;"'
        );
        html = html.replace(
            /style="background:\s*linear-gradient\(135deg,\s*#10b981,\s*#047857\)(?:[^"]*)?"/g,
            'style="background: #ffffff; color: #020202; font-weight: 700; border-radius: 9999px; border: 1px solid #ffffff;"'
        );
        html = html.replace(
            /style="background:\s*linear-gradient\(135deg,\s*#25d366,\s*#128c7e\)(?:[^"]*)?"/g,
            'style="background: #ffffff; color: #020202; font-weight: 700; border-radius: 9999px; border: 1px solid #ffffff;"'
        );
        html = html.replace(
            /style="background:\s*linear-gradient\(135deg,\s*var\(--accent-cyan\),\s*#0369a1\)(?:[^"]*)?"/g,
            'style="background: #ffffff; color: #020202; font-weight: 700; border-radius: 9999px; border: 1px solid #ffffff;"'
        );
        html = html.replace(
            /style="background:\s*linear-gradient\(135deg,\s*#06b6d4,\s*#0284c7\)(?:[^"]*)?"/g,
            'style="background: #ffffff; color: #020202; font-weight: 700; border-radius: 9999px; border: 1px solid #ffffff;"'
        );

        // General fallback for any remaining linear-gradient on buttons
        html = html.replace(
            /background:\s*linear-gradient\(135deg,\s*#[0-9a-fA-F]+,\s*#[0-9a-fA-F]+\)/g,
            'background: #ffffff; color: #020202'
        );

        // Replace green/purple card border accents with sleek white/silver
        html = html.replace(
            /border-color:\s*#10b981/g,
            'border-color: rgba(255, 255, 255, 0.15)'
        );
        html = html.replace(
            /border-color:\s*#8b5cf6/g,
            'border-color: rgba(255, 255, 255, 0.15)'
        );
        html = html.replace(
            /border-color:\s*#a855f7/g,
            'border-color: rgba(255, 255, 255, 0.15)'
        );
        html = html.replace(
            /border-left:\s*3px\s+solid\s+#[0-9a-fA-F]+/g,
            'border-left: 1px solid rgba(255, 255, 255, 0.15)'
        );

        // Replace any inline neon color texts with clean silver/white
        html = html.replace(/color:\s*#10b981/g, 'color: #ffffff');
        html = html.replace(/color:\s*#8b5cf6/g, 'color: #cbd5e1');
        html = html.replace(/color:\s*#a855f7/g, 'color: #e2e8f0');
        html = html.replace(/color:\s*#06b6d4/g, 'color: #ffffff');

        // Clean badges
        html = html.replace(
            /background:\s*rgba\(16,\s*185,\s*129,\s*0\.15\)/g,
            'background: rgba(255, 255, 255, 0.05)'
        );
        html = html.replace(
            /background:\s*rgba\(139,\s*92,\s*246,\s*0\.15\)/g,
            'background: rgba(255, 255, 255, 0.05)'
        );

        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ HTML purged: ${fileName}`);
    }
}

// =========================================================================
// 6. ENSURE 100% BYTE-FOR-BYTE DOM PARITY: index.html === live_index.html
// =========================================================================
function enforceDOMParity() {
    const indexPath = path.join(ROOT, 'index.html');
    const livePath = path.join(ROOT, 'live_index.html');

    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    fs.writeFileSync(livePath, indexHtml, 'utf8');

    const verifyIndex = fs.readFileSync(indexPath, 'utf8');
    const verifyLive = fs.readFileSync(livePath, 'utf8');

    if (verifyIndex === verifyLive) {
        console.log('✅ DOM PARITY: 100% exact byte-for-byte match (index.html === live_index.html)');
    } else {
        throw new Error('❌ DOM Parity check failed!');
    }
}

// =========================================================================
// 7. BUMP CACHE BUSTER TO v250 ACROSS ALL PAGES
// =========================================================================
function bumpCacheBuster() {
    const NEW_CACHE_BUSTER = 'v=20261108_v250_ponder_editorial_production';
    const htmlFiles = [
        'index.html',
        'live_index.html',
        'admin.html',
        'affiliate.html',
        'affiliate-dashboard.html',
        'affiliate-login.html',
        'store.html',
        'marketplace.html',
        'compare.html',
        'blog.html',
        'portal.html',
        'privacy.html',
        'terms.html'
    ];

    for (const fileName of htmlFiles) {
        const filePath = path.join(ROOT, fileName);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/v=\d{8}_v\d+[_a-zA-Z0-9]*/g, NEW_CACHE_BUSTER);
        fs.writeFileSync(filePath, content, 'utf8');
    }

    console.log(`✅ Cache buster bumped to: ${NEW_CACHE_BUSTER}`);
}

// Run all phases
transformHero3D();
transformCopilot();
transformAppJs();
transformCSS();
transformHTMLFiles();
enforceDOMParity();
bumpCacheBuster();
enforceDOMParity(); // Re-sync after cache bust

console.log('\n🎉 Master Ponder Total Unification Completed Successfully!\n');
