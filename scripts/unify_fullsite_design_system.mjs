import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';

console.log('=== UNIFYING DESIGN SYSTEM & HARMONIZING FULLSITE BACKGROUND & CARDS ===');

// 1. Upgrade style.css with Harmonized Tokens & Card Styles
const stylePath = path.join(ROOT, 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// Update Root Cyan and Card Tokens
css = css.replace(
    /--accent-cyan:\s*#06B6D4;/g,
    '--accent-cyan: #00F2FE;'
);
css = css.replace(
    /--accent-cyan-glow:\s*rgba\(6,\s*182,\s*212,\s*0\.2\);/g,
    '--accent-cyan-glow: rgba(0, 242, 254, 0.25);'
);
css = css.replace(
    /--accent-cyan-surface:\s*rgba\(6,\s*182,\s*212,\s*0\.06\);/g,
    '--accent-cyan-surface: rgba(0, 242, 254, 0.08);'
);

// Add Unified Glass HUD Tokens to style.css if not already present
const unifiedGlassBlock = `
/* ==========================================================================
   UNIFIED ENTERPRISE GLASS HUD SYSTEM (/ui-ux-pro-max standard)
   Ensures 100% visual coherence between fullsite 3D video backdrop & all UI cards
   ========================================================================== */
.glass-card, .ipc-card, .blueprint-card, .store-card, .tmpl-card, 
.solution-card, .category-card, .feature-card, .admin-card, .dash-card, 
.hero-studio-card, .auth-container, .pricing-card, .pricing-tier-card {
    background: rgba(8, 13, 26, 0.82) !important;
    border: 1px solid rgba(0, 242, 254, 0.14) !important;
    border-radius: 14px !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 15px rgba(0, 242, 254, 0.03) !important;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease !important;
}

.glass-card:hover, .ipc-card:hover, .blueprint-card:hover, .store-card:hover, .tmpl-card:hover, 
.solution-card:hover, .category-card:hover, .feature-card:hover, .admin-card:hover, .dash-card:hover, 
.hero-studio-card:hover, .auth-container:hover, .pricing-card:hover, .pricing-tier-card:hover {
    transform: translateY(-3px) !important;
    border-color: rgba(0, 242, 254, 0.35) !important;
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.75), 0 0 25px rgba(0, 242, 254, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
}

/* Harmonized Form Controls & Inputs */
input[type="text"], input[type="email"], input[type="password"], input[type="tel"], 
select, textarea, .form-input, .dash-select, .calc-select {
    background: rgba(5, 9, 18, 0.85) !important;
    border: 1px solid rgba(0, 242, 254, 0.2) !important;
    color: #f8fafc !important;
    border-radius: 8px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, input[type="tel"]:focus, 
select:focus, textarea:focus, .form-input:focus, .dash-select:focus, .calc-select:focus {
    border-color: #00f2fe !important;
    box-shadow: 0 0 16px rgba(0, 242, 254, 0.25) !important;
    outline: none !important;
}

/* Harmonized Buttons with High-Contrast Tokens */
.btn-primary, .btn-primary-glow, .btn-submit {
    background: linear-gradient(135deg, #00f2fe, #0284c7) !important;
    color: #000000 !important;
    font-weight: 800 !important;
    border: none !important;
    box-shadow: 0 0 20px rgba(0, 242, 254, 0.35) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.btn-primary:hover, .btn-primary-glow:hover, .btn-submit:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 0 30px rgba(0, 242, 254, 0.5) !important;
}
`;

if (!css.includes('UNIFIED ENTERPRISE GLASS HUD SYSTEM')) {
    css += '\n' + unifiedGlassBlock;
    fs.writeFileSync(stylePath, css, 'utf8');
    console.log('✓ style.css upgraded with unified Glass HUD tokens');
}

// 2. Stage HTML Snippet for Subpages
const cinematicStageHtml = `
    <!-- FULLSITE CINEMATIC 3D BACKGROUND STAGE -->
    <div id="global-cinematic-stage" class="global-cinematic-stage" aria-hidden="true">
        <picture class="global-video-backdrop">
            <source srcset="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/animated.webp" type="image/webp">
            <img src="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/animated.webp" alt="Cinematic Ambient 3D Mesh" class="global-media-cover" loading="eager" decoding="async">
        </picture>
        <div id="hero3d-container" class="global-3d-canvas-wrap"></div>
        <div class="global-halftone-overlay"></div>
        <div class="global-vignette-overlay"></div>
    </div>
`;

// Subpages to inject global cinematic stage and hero3d.js
const subpages = [
    'affiliate.html',
    'affiliate-dashboard.html',
    'affiliate-login.html',
    'store.html',
    'marketplace.html',
    'compare.html',
    'blog.html',
    'portal.html',
    'admin.html'
];

for (const subpage of subpages) {
    const subpagePath = path.join(ROOT, subpage);
    if (!fs.existsSync(subpagePath)) continue;

    let html = fs.readFileSync(subpagePath, 'utf8');

    // 1. Inject global-cinematic-stage right after <body>
    if (!html.includes('id="global-cinematic-stage"')) {
        html = html.replace(/(<body[^>]*>)/i, `$1\n${cinematicStageHtml}\n`);
    }

    // 2. Remove legacy particleCanvas and glows if present to avoid dual canvas collisions
    html = html.replace(/<canvas id="particleCanvas"[\s\S]*?<\/canvas>/i, '<!-- particleCanvas unified into global-cinematic-stage -->');

    // 3. Ensure hero3d.js is included before </body>
    if (!html.includes('hero3d.js')) {
        html = html.replace(
            /(<\/body>)/i,
            `    <script src="hero3d.js?v=20261106_awwwards_mesh" defer></script>\n$1`
        );
    }

    fs.writeFileSync(subpagePath, html, 'utf8');
    console.log(`✓ ${subpage} updated with global cinematic stage & hero3d engine`);
}

// 4. Update admin.html cockpit styling
const adminPath = path.join(ROOT, 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

// Update admin :root CSS tokens
adminHtml = adminHtml.replace(/--bg-cockpit:\s*#040812;/g, '--bg-cockpit: #030712;');
adminHtml = adminHtml.replace(/--bg-sidebar:\s*#070d1a;/g, '--bg-sidebar: rgba(5, 10, 22, 0.90);');
adminHtml = adminHtml.replace(/--bg-card:\s*rgba\(13,\s*22,\s*38,\s*0\.85\);/g, '--bg-card: rgba(8, 13, 26, 0.85);');
adminHtml = adminHtml.replace(/--border-cockpit:\s*rgba\(0,\s*242,\s*254,\s*0\.15\);/g, '--border-cockpit: rgba(0, 242, 254, 0.16);');

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('✓ admin.html cockpit variables harmonized with global tokens');

console.log('=== FULLSITE DESIGN SYSTEM HARMONIZATION COMPLETE ===');
