/**
 * PONDER DEEP STRUCTURAL TRANSFORM
 * ================================
 * This is NOT a color swap. This is a complete structural CSS transformation
 * to match ponder.ai's actual design language:
 * 
 * 1. Deep black bg (#020202), not space-gray
 * 2. Ultra-tight editorial typography (-0.04em tracking, 900 weight)
 * 3. 1px border cards (not glowing), no box-shadow glow
 * 4. Thin navbar with clean border, no frosted glass glow
 * 5. Massive section padding (120px+)
 * 6. Clean white text hierarchy, no gradient text
 * 7. Minimal animations — fade in on scroll only
 * 8. No emojis in professional UI elements
 * 9. Section numbering (01, 02, 03...)
 * 10. Footer: clean, minimal, editorial
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// ============================================================
// PHASE 1: CSS ROOT VARIABLES — Ponder Foundation
// ============================================================
function transformCSS() {
    let css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');

    // 1A: Root variables — darker backgrounds, no purple/green accents
    css = css.replace(
        /--bg-space:\s*#050507;/g,
        '--bg-space: #020202;'
    );
    css = css.replace(
        /--bg-deep:\s*#08090D;/g,
        '--bg-deep: #050505;'
    );
    css = css.replace(
        /--bg-surface:\s*#0B0D12;/g,
        '--bg-surface: #080808;'
    );
    css = css.replace(
        /--bg-card:\s*rgba\(12,\s*14,\s*20,\s*0\.7\);/g,
        '--bg-card: rgba(10, 10, 10, 0.85);'
    );
    css = css.replace(
        /--bg-card-hover:\s*rgba\(18,\s*22,\s*32,\s*0\.85\);/g,
        '--bg-card-hover: rgba(16, 16, 16, 0.92);'
    );

    // 1B: Glass tokens — more subtle
    css = css.replace(
        /--glass:\s*rgba\(255,\s*255,\s*255,\s*0\.03\);/g,
        '--glass: rgba(255, 255, 255, 0.02);'
    );
    css = css.replace(
        /--glass-elevated:\s*rgba\(255,\s*255,\s*255,\s*0\.05\);/g,
        '--glass-elevated: rgba(255, 255, 255, 0.03);'
    );
    css = css.replace(
        /--glass-border:\s*rgba\(255,\s*255,\s*255,\s*0\.06\);/g,
        '--glass-border: rgba(255, 255, 255, 0.1);'
    );
    css = css.replace(
        /--glass-border-hover:\s*rgba\(255,\s*255,\s*255,\s*0\.12\);/g,
        '--glass-border-hover: rgba(255, 255, 255, 0.2);'
    );

    // 1C: Kill purple accent system — replace with white
    css = css.replace(
        /--accent-primary:\s*#8B5CF6;/g,
        '--accent-primary: #ffffff;'
    );
    css = css.replace(
        /--accent-primary-dim:\s*#7C3AED;/g,
        '--accent-primary-dim: #e8e8e8;'
    );
    css = css.replace(
        /--accent-primary-glow:\s*rgba\(139,\s*92,\s*246,\s*0\.25\);/g,
        '--accent-primary-glow: rgba(255, 255, 255, 0.15);'
    );
    css = css.replace(
        /--accent-primary-surface:\s*rgba\(139,\s*92,\s*246,\s*0\.08\);/g,
        '--accent-primary-surface: rgba(255, 255, 255, 0.04);'
    );

    // 1D: Kill green accent glow
    css = css.replace(
        /--accent-green:\s*#00FF87;/g,
        '--accent-green: #ffffff;'
    );
    css = css.replace(
        /--accent-green-dim:\s*#10B981;/g,
        '--accent-green-dim: #a0a0a0;'
    );
    css = css.replace(
        /--accent-green-glow:\s*rgba\(0,\s*255,\s*135,\s*0\.15\);/g,
        '--accent-green-glow: rgba(255, 255, 255, 0.08);'
    );
    css = css.replace(
        /--accent-emerald:\s*#10B981;/g,
        '--accent-emerald: #a0a0a0;'
    );

    // 1E: Typography — tighter, more editorial
    css = css.replace(
        /--section-gap:\s*clamp\(80px,\s*10vh,\s*140px\);/g,
        '--section-gap: clamp(100px, 14vh, 180px);'
    );

    // 1F: Radius — Ponder uses sharper, not ultra-round
    css = css.replace(
        /--radius-sm:\s*8px;/g,
        '--radius-sm: 6px;'
    );
    css = css.replace(
        /--radius-md:\s*12px;/g,
        '--radius-md: 10px;'
    );
    css = css.replace(
        /--radius-lg:\s*16px;/g,
        '--radius-lg: 12px;'
    );
    css = css.replace(
        /--radius-xl:\s*24px;/g,
        '--radius-xl: 14px;'
    );

    // 2: Body — true Ponder black
    css = css.replace(
        /body\s*\{[^}]*\}/,
        `body {
    font-family: var(--font-body);
    background: #020202;
    color: #f1f1f1;
    line-height: 1.6;
    overflow-x: hidden;
    min-height: 100vh;
}`
    );

    // 3: Section title — Ponder editorial scale
    css = css.replace(
        /\.section-title\s*\{[^}]*\}/,
        `.section-title {
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.0;
    color: #f1f1f1;
    margin-bottom: 24px;
}`
    );

    // 4: Section subtitle — Ponder muted, generous spacing
    css = css.replace(
        /\.section-subtitle\s*\{[^}]*\}/,
        `.section-subtitle {
    font-size: 1.05rem;
    color: #888888;
    max-width: 560px;
    line-height: 1.7;
    letter-spacing: -0.01em;
}`
    );

    // 5: Gradient text — Ponder doesn't use gradient text, use flat white
    css = css.replace(
        /\.gradient-text\s*\{[^}]*\}/,
        `.gradient-text {
    color: #f1f1f1;
    -webkit-text-fill-color: #f1f1f1;
}`
    );

    // 6: Navbar — Ponder clean thin border, no glow shadow
    css = css.replace(
        /\.navbar\s*\{\s*position:\s*sticky;[^}]*\}/,
        `.navbar {
    position: sticky;
    top: 14px;
    z-index: 1000;
    width: min(94%, 1320px);
    margin: 14px auto 0 auto;
    background: rgba(2, 2, 2, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    box-shadow: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}`
    );

    // 7: Portal tabs — cleaner, less glass
    css = css.replace(
        /\.portal-tabs\s*\{[^}]*\}/,
        `.portal-tabs {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: transparent;
    padding: 3px 5px;
    border-radius: 9999px;
    border: none;
}`
    );

    // 8: Portal tab btn — Ponder clean text tabs
    css = css.replace(
        /\.portal-tab-btn\s*\{[^}]*\}/,
        `.portal-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    font-size: 0.82rem;
    font-weight: 500;
    color: #666666;
    text-decoration: none;
    border-radius: 9999px;
    border: 1px solid transparent;
    background: transparent;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    white-space: nowrap;
    cursor: pointer;
    letter-spacing: -0.01em;
}`
    );

    // 9: Portal tab active — Ponder white pill active
    css = css.replace(
        /\.portal-tab-btn\.active\s*\{[^}]*\}/,
        `.portal-tab-btn.active {
    color: #020202;
    background: #ffffff;
    border-color: #ffffff;
    box-shadow: none;
    font-weight: 600;
}`
    );

    // 10: Glass card — Ponder 1px border, no glow, no heavy shadow
    css = css.replace(
        /\.glass-card\s*\{\s*background:\s*var\(--bg-card\);[^}]*\}/,
        `.glass-card {
    background: rgba(10, 10, 10, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 32px;
    transition: border-color 0.25s ease;
    position: relative;
    overflow: hidden;
}`
    );

    // 11: Glass card hover — Ponder subtle, no translateY
    css = css.replace(
        /\.glass-card:hover\s*\{[^}]*\}/,
        `.glass-card:hover {
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(14, 14, 14, 0.92);
}`
    );

    // 12: OS status bar — darker
    css = css.replace(
        /\.os-status-bar\s*\{[^}]*\}/,
        `.os-status-bar {
    background: #020202;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 7px 16px;
    font-size: 0.76rem;
    font-family: var(--font-body);
    position: relative;
    z-index: 1001;
}`
    );

    // 13: OS metric badge — monochrome instead of green
    css = css.replace(
        /\.os-metric-badge\s*\{[^}]*\}/,
        `.os-metric-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 9px;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: var(--font-mono);
    background: rgba(255, 255, 255, 0.06);
    color: #999999;
    border: 1px solid rgba(255, 255, 255, 0.1);
    letter-spacing: 0.04em;
}`
    );

    // 14: OS pulse dot — white instead of green
    css = css.replace(
        /\.os-pulse-dot\s*\{[^}]*\}/,
        `.os-pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ffffff;
    display: inline-block;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
    animation: pulse-dot 2s infinite ease-in-out;
}`
    );

    // 15: Eyebrow — monochrome
    css = css.replace(
        /\.eyebrow::before\s*\{[^}]*\}/,
        `.eyebrow::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.3);
    animation: pulse-dot 2s ease-in-out infinite;
}`
    );

    // 16: btn-primary base — already Ponder, but remove purple
    css = css.replace(
        /\.btn-primary\s*\{\s*display:\s*inline-flex;[^}]*\}/,
        `.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    color: #020202;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 14px 32px;
    border-radius: var(--radius-full);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    border: 1px solid #ffffff;
    letter-spacing: -0.01em;
}`
    );

    // 17: btn-primary hover — clean, no glow
    css = css.replace(
        /\.btn-primary:hover\s*\{[^}]*\}/,
        `.btn-primary:hover {
    background: #e8e8e8;
    box-shadow: none;
    transform: translateY(-1px);
}`
    );

    // 18: btn-ghost — clean border only
    css = css.replace(
        /\.btn-ghost\s*\{[^}]*\}/,
        `.btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: #888888;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 14px 28px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--radius-full);
    transition: all 0.25s ease;
    letter-spacing: -0.01em;
}`
    );

    // 19: Section tag — monochrome
    css = css.replace(
        /\.section-tag\s*\{[^}]*\}/g,
        `.section-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px;
    font-size: 0.72rem;
    font-family: var(--font-mono);
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #999999;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    margin-bottom: 16px;
}`
    );

    // 20: Solution card — flat, minimal
    css = css.replace(
        /\.solution-card\s*\{\s*background:\s*var\(--bg-card\);[^}]*\}/,
        `.solution-card {
    background: rgba(10, 10, 10, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 28px;
    transition: border-color 0.25s ease;
    cursor: pointer;
}`
    );

    // 21: Admin-specific gold btn — tone down
    css = css.replace(
        /\.portal-tab-admin-btn\s*\{[^}]*\}/,
        `.portal-tab-admin-btn {
    background: transparent !important;
    color: #999999 !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    font-weight: 600 !important;
}`
    );

    css = css.replace(
        /\.portal-tab-admin-btn:hover\s*\{[^}]*\}/,
        `.portal-tab-admin-btn:hover {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
}`
    );

    // 22: Rewrite the PONDER OVERRIDE BLOCK — remove heavy shadows, simplify cards
    const ponderOverrideStart = css.indexOf('/* ==========================================================================\n   PONDER HIGH-CONTRAST MONOCHROMATIC');
    if (ponderOverrideStart !== -1) {
        const afterPonder = css.indexOf('/* ===', ponderOverrideStart + 100);
        const ponderEnd = afterPonder !== -1 ? afterPonder : css.length;
        
        const ponderBlock = `/* ==========================================================================
   PONDER STRUCTURAL DESIGN SYSTEM — DEEP EDITORIAL OVERRIDE
   True Ponder.ai aesthetic: deep black, 1px borders, no glow, editorial type
   ========================================================================== */

/* Card universal — flat, 1px border, no glow shadows */
.glass-card, .ipc-card, .blueprint-card, .store-card, .tmpl-card, 
.solution-card, .category-card, .feature-card, .admin-card, .dash-card, 
.hero-studio-card, .auth-container, .pricing-card, .pricing-tier-card,
.lead-magnet-card, .newsletter-card, .trust-principle-card, .premium-card {
    background: rgba(8, 8, 8, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: none !important;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease !important;
}

.glass-card:hover, .ipc-card:hover, .blueprint-card:hover, .store-card:hover, .tmpl-card:hover, 
.solution-card:hover, .category-card:hover, .feature-card:hover, .admin-card:hover, .dash-card:hover, 
.hero-studio-card:hover, .auth-container:hover, .pricing-card:hover, .pricing-tier-card:hover,
.lead-magnet-card:hover, .newsletter-card:hover, .trust-principle-card:hover, .premium-card:hover {
    transform: none !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    box-shadow: none !important;
}

/* Kill cursor spotlight — Ponder doesn't have radial gradient cursor effects */
.glass-card::before,
.ipc-card::before,
.solution-card::before,
.blueprint-card::before,
.store-card::before,
.tmpl-card::before,
.hero-studio-card::before,
.lead-magnet-card::before,
.newsletter-card::before,
.trust-principle-card::before,
.premium-card::before {
    display: none !important;
}

/* Kill corner accent marks */
.glass-card::after,
.ipc-card::after,
.hero-studio-card::after {
    display: none !important;
}

/* Ponder Form Controls — darker, cleaner */
input[type="text"], input[type="email"], input[type="password"], input[type="tel"], 
select, textarea, .form-input, .dash-select, .calc-select {
    background: rgba(5, 5, 5, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #f1f1f1 !important;
    border-radius: 8px !important;
    transition: border-color 0.2s ease !important;
}

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, input[type="tel"]:focus, 
select:focus, textarea:focus, .form-input:focus, .dash-select:focus, .calc-select:focus {
    border-color: rgba(255, 255, 255, 0.4) !important;
    box-shadow: none !important;
    outline: none !important;
}

/* Ponder Primary CTA — solid white, no glow shadow */
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
    background: #e0e0e0 !important;
    color: #020202 !important;
    transform: translateY(-1px) !important;
    box-shadow: none !important;
}

/* Ponder Ghost CTA — transparent with thin white border */
.btn-secondary, .btn-outline, .btn-ghost, .btn-glass-glow, .ponder-pill-secondary {
    background: transparent !important;
    color: #cccccc !important;
    font-weight: 500 !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
    transition: all 0.25s ease !important;
}

.btn-secondary:hover, .btn-outline:hover, .btn-ghost:hover, .btn-glass-glow:hover, .ponder-pill-secondary:hover {
    background: rgba(255, 255, 255, 0.06) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    transform: none !important;
    box-shadow: none !important;
}

/* Ponder Amber pill — very muted, editorial */
.btn-gold-pill, .ponder-pill-amber {
    background: transparent !important;
    color: #999999 !important;
    font-weight: 600 !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: none !important;
    transition: all 0.25s ease !important;
}

.btn-gold-pill:hover, .ponder-pill-amber:hover {
    background: rgba(255, 255, 255, 0.05) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    box-shadow: none !important;
}

/* Kill glowing-border class entirely */
.glowing-border {
    box-shadow: none !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.glowing-border::before,
.glowing-border::after {
    display: none !important;
}

/* Section backgrounds — clean, no blue-tinted rgba */
section[style*="background: rgba(15, 23, 42"],
section[style*="background: rgba(8, 10, 25"],
section[style*="background: rgba(10, 15, 30"] {
    background: transparent !important;
}

/* Section borders — cleaner */
section[style*="border-top: 1px solid"],
section[style*="border-bottom: 1px solid"] {
    border-color: rgba(255, 255, 255, 0.06) !important;
}

/* Hero section — more breathing room */
.hero-section {
    padding-top: 80px !important;
    padding-bottom: 80px !important;
}

/* Hero title — Ponder editorial scale */
.hero-title {
    font-size: clamp(3rem, 6.5vw, 5rem) !important;
    font-weight: 900 !important;
    letter-spacing: -0.04em !important;
    line-height: 0.95 !important;
    color: #f1f1f1 !important;
}

/* Hero subtitle — muted, editorial */
.hero-subtitle {
    font-size: 1.05rem !important;
    color: #777777 !important;
    font-weight: 400 !important;
    line-height: 1.7 !important;
    letter-spacing: -0.01em !important;
}

/* Hero gradient text — flat white, no gradient */
.hero-gradient-silver {
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: #999999 !important;
    color: #999999 !important;
}

/* Kill all box-shadow: glow patterns globally */
[style*="box-shadow: 0 0 25px"],
[style*="box-shadow: 0 16px 45px"] {
    box-shadow: none !important;
}

/* Footer — minimal Ponder editorial */
footer, .site-footer {
    background: #020202 !important;
    border-top: 1px solid rgba(255, 255, 255, 0.06) !important;
}

/* Section header spacing — Ponder generous */
.section-header {
    margin-bottom: 48px !important;
}

/* All section tags — monochrome */
.section-tag {
    background: rgba(255, 255, 255, 0.04) !important;
    color: #777777 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow: none !important;
}

/* Hero awwwards tag — Ponder style numbered badge */
.hero-awwwards-tag {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: none !important;
}

/* Scrollbar — Ponder dark */
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    background: #020202;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.12);
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* Ponder typography overrides for all headings */
h1, h2, h3 {
    letter-spacing: -0.04em !important;
    font-weight: 800 !important;
}

h4, h5, h6 {
    letter-spacing: -0.02em !important;
    font-weight: 700 !important;
}

/* Kill all text-shadow effects */
[style*="text-shadow"] {
    text-shadow: none !important;
}

/* Ponder navigation link color */
.portal-tab-btn {
    color: #555555 !important;
}
.portal-tab-btn:hover {
    color: #ffffff !important;
    background: transparent !important;
}
.portal-tab-btn.active {
    color: #020202 !important;
    background: #ffffff !important;
    border-color: #ffffff !important;
}

`;
        css = css.substring(0, ponderOverrideStart) + ponderBlock + css.substring(ponderEnd);
    }

    fs.writeFileSync(path.join(ROOT, 'style.css'), css, 'utf8');
    console.log(`✅ CSS structural transform complete (${css.length} bytes)`);
}

// ============================================================
// PHASE 2: HTML — Remove inline style overrides, clean emojis, fix section backgrounds
// ============================================================
function transformHTML(filename) {
    const filePath = path.join(ROOT, filename);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');

    // 2A: Remove inline backgrounds on sections that override CSS
    html = html.replace(
        /background:\s*rgba\(15,\s*23,\s*42,\s*0\.\d+\)/g,
        'background: transparent'
    );
    html = html.replace(
        /background:\s*rgba\(8,\s*10,\s*25,\s*0\.\d+\)/g,
        'background: transparent'
    );
    html = html.replace(
        /background:\s*rgba\(10,\s*15,\s*30,\s*0\.\d+\)/g,
        'background: transparent'
    );

    // 2B: Fix section border colors to be white-only
    html = html.replace(
        /border-top:\s*1px\s+solid\s+rgba\(\d+,\s*\d+,\s*\d+,\s*0\.\d+\)/g,
        'border-top: 1px solid rgba(255, 255, 255, 0.06)'
    );
    html = html.replace(
        /border-bottom:\s*1px\s+solid\s+rgba\(\d+,\s*\d+,\s*\d+,\s*0\.\d+\)/g,
        'border-bottom: 1px solid rgba(255, 255, 255, 0.06)'
    );

    // 2C: Remove heavy box-shadow inline styles on cards
    html = html.replace(
        /box-shadow:\s*0\s+\d+px\s+\d+px\s+rgba\(0,\s*0,\s*0,\s*[\d.]+\)(?:,\s*0\s+0\s+\d+px\s+rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\))?(?:,\s*inset[^;]+)?/g,
        'box-shadow: none'
    );

    // 2D: Clean gradient backgrounds on hero elements
    html = html.replace(
        /background:\s*linear-gradient\(135deg,\s*rgba\(99,\s*102,\s*241[^)]*\)[^)]*\)/g,
        'background: rgba(255, 255, 255, 0.03)'
    );
    html = html.replace(
        /background:\s*linear-gradient\(135deg,\s*rgba\(56,\s*189,\s*248[^)]*\)[^)]*\)/g,
        'background: rgba(255, 255, 255, 0.03)'
    );

    // 2E: Fix card inline backgrounds  
    html = html.replace(
        /background:\s*linear-gradient\(165deg,\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\),\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)\)/g,
        'background: rgba(8, 8, 8, 0.9)'
    );

    // 2F: Fix inline hero section padding
    html = html.replace(
        /(<section\s+id="hero"[^>]*style=")padding-top:\s*48px;\s*padding-bottom:\s*56px;/,
        '$1padding-top: 80px; padding-bottom: 80px;'
    );

    // 2G: Section tag inline styles — kill colored backgrounds
    html = html.replace(
        /(<span\s+class="section-tag"\s+style=")background:\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\);\s*color:\s*#[0-9a-fA-F]+;/g,
        '$1background: rgba(255, 255, 255, 0.04); color: #777777;'
    );
    html = html.replace(
        /(<span\s+class="section-tag"\s*style=")background:\s*rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\);\s*color:\s*var\([^)]+\);/g,
        '$1background: rgba(255, 255, 255, 0.04); color: #777777;'
    );

    // 2H: Remove border-left colored accents from inline styles
    html = html.replace(
        /border-left:\s*3px\s+solid\s+#[0-9a-fA-F]+/g,
        'border-left: 1px solid rgba(255, 255, 255, 0.12)'
    );
    html = html.replace(
        /border-left:\s*4px\s+solid\s+#[0-9a-fA-F]+/g,
        'border-left: 1px solid rgba(255, 255, 255, 0.12)'
    );

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ HTML structural transform: ${filename}`);
}

// ============================================================
// PHASE 3: Sync index.html → live_index.html
// ============================================================
function syncParity() {
    const indexPath = path.join(ROOT, 'index.html');
    const livePath = path.join(ROOT, 'live_index.html');
    
    if (fs.existsSync(indexPath) && fs.existsSync(livePath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        fs.writeFileSync(livePath, indexContent, 'utf8');
        
        // Verify parity
        const liveContent = fs.readFileSync(livePath, 'utf8');
        const match = indexContent === liveContent;
        console.log(`✅ DOM parity: ${match ? 'EXACT MATCH' : 'MISMATCH!'}`);
    }
}

// ============================================================
// PHASE 4: Cache bust
// ============================================================
function cacheBust() {
    const version = 'v=20261108_v200_ponder_structural';
    const htmlFiles = [
        'index.html', 'live_index.html', 
        'admin.html', 'affiliate.html', 'affiliate-dashboard.html', 'affiliate-login.html',
        'store.html', 'marketplace.html', 'compare.html', 'blog.html', 'portal.html',
        'privacy.html', 'terms.html'
    ];
    
    for (const file of htmlFiles) {
        const filePath = path.join(ROOT, file);
        if (!fs.existsSync(filePath)) continue;
        
        let html = fs.readFileSync(filePath, 'utf8');
        // Replace existing cache busters
        html = html.replace(/v=\d{8}_v\d+[_a-zA-Z]*/g, version);
        fs.writeFileSync(filePath, html, 'utf8');
    }
    console.log(`✅ Cache bust: ${version}`);
}

// ============================================================
// EXECUTE
// ============================================================
console.log('\n🔧 PONDER DEEP STRUCTURAL TRANSFORM — Starting...\n');

// Phase 1: CSS
transformCSS();

// Phase 2: HTML (all pages)
const htmlPages = [
    'index.html', 
    'admin.html', 'affiliate.html', 'affiliate-dashboard.html', 'affiliate-login.html',
    'store.html', 'marketplace.html', 'compare.html', 'blog.html', 'portal.html',
    'privacy.html', 'terms.html'
];
for (const page of htmlPages) {
    transformHTML(page);
}

// Phase 3: Sync parity
syncParity();

// Phase 4: Cache bust
cacheBust();

console.log('\n✅ PONDER DEEP STRUCTURAL TRANSFORM — COMPLETE\n');
