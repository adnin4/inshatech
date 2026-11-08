import fs from 'fs';

let style = fs.readFileSync('style.css', 'utf8');

const targetHeader = `/* ==========================================================================
   UNIFIED ENTERPRISE GLASS HUD SYSTEM (/ui-ux-pro-max standard)`;

const targetEnd = `/* ==========================================================================
   MASTER UNIVERSAL RESPONSIVE ARCHITECTURE (A-Z RESPONSIVE ENGINE)`;

const startIdx = style.indexOf(targetHeader);
const endIdx = style.indexOf(targetEnd);

if (startIdx === -1 || endIdx === -1) {
    console.error('Target boundary not found!', { startIdx, endIdx });
    process.exit(1);
}

const ponderBlock = `/* ==========================================================================
   PONDER HIGH-CONTRAST MONOCHROMATIC & MOTION SYSTEM (AWWWARDS / PONDER.AI CLONE)
   High-contrast stark monochromatic typography, deep obsidian glass, crisp white pill CTAs,
   and dynamic cursor spotlight luminescence.
   ========================================================================== */
.glass-card, .ipc-card, .blueprint-card, .store-card, .tmpl-card, 
.solution-card, .category-card, .feature-card, .admin-card, .dash-card, 
.hero-studio-card, .auth-container, .pricing-card, .pricing-tier-card,
.lead-magnet-card, .newsletter-card, .trust-principle-card, .premium-card {
    background: linear-gradient(165deg, rgba(14, 18, 30, 0.82), rgba(6, 8, 15, 0.94)) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(24px) saturate(1.6) !important;
    -webkit-backdrop-filter: blur(24px) saturate(1.6) !important;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease !important;
}

.glass-card:hover, .ipc-card:hover, .blueprint-card:hover, .store-card:hover, .tmpl-card:hover, 
.solution-card:hover, .category-card:hover, .feature-card:hover, .admin-card:hover, .dash-card:hover, 
.hero-studio-card:hover, .auth-container:hover, .pricing-card:hover, .pricing-tier-card:hover,
.lead-magnet-card:hover, .newsletter-card:hover, .trust-principle-card:hover, .premium-card:hover {
    transform: translateY(-3px) !important;
    border-color: rgba(255, 255, 255, 0.32) !important;
    box-shadow: 0 26px 64px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
}

/* Ponder Dynamic White Luminescence Cursor Spotlight */
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
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.09), transparent 42%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
}

.glass-card:hover::before,
.ipc-card:hover::before,
.solution-card:hover::before,
.blueprint-card:hover::before,
.store-card:hover::before,
.tmpl-card:hover::before,
.hero-studio-card:hover::before,
.lead-magnet-card:hover::before,
.newsletter-card:hover::before,
.trust-principle-card:hover::before,
.premium-card:hover::before {
    opacity: 1;
}

/* Ponder Minimal Subtle Corner Accent */
.glass-card::after,
.ipc-card::after,
.hero-studio-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-top: 2px solid rgba(255, 255, 255, 0.35);
    border-right: 2px solid rgba(255, 255, 255, 0.35);
    border-top-right-radius: 14px;
    pointer-events: none;
    opacity: 0.5;
}

/* Ponder Form Controls & Inputs */
input[type="text"], input[type="email"], input[type="password"], input[type="tel"], 
select, textarea, .form-input, .dash-select, .calc-select {
    background: rgba(5, 8, 16, 0.88) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    color: #f8fafc !important;
    border-radius: 10px !important;
    transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

input[type="text"]:focus, input[type="email"]:focus, input[type="password"]:focus, input[type="tel"]:focus, 
select:focus, textarea:focus, .form-input:focus, .dash-select:focus, .calc-select:focus {
    border-color: #ffffff !important;
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.25) !important;
    outline: none !important;
}

/* Ponder Signature Primary Pill CTA (Stark White Pill) */
.btn-primary, .btn-primary-glow, .btn-submit, .ponder-pill-primary {
    background: #ffffff !important;
    color: #030508 !important;
    font-weight: 800 !important;
    border-radius: 9999px !important;
    border: 1px solid #ffffff !important;
    box-shadow: 0 4px 22px rgba(255, 255, 255, 0.28), 0 1px 3px rgba(0, 0, 0, 0.8) !important;
    letter-spacing: -0.01em !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.btn-primary:hover, .btn-primary-glow:hover, .btn-submit:hover, .ponder-pill-primary:hover {
    background: #f1f5f9 !important;
    color: #000000 !important;
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.42), 0 2px 6px rgba(0, 0, 0, 0.9) !important;
}

/* Ponder Secondary Frosted Ghost Pill CTA */
.btn-secondary, .btn-outline, .btn-ghost, .btn-glass-glow, .ponder-pill-secondary {
    background: rgba(255, 255, 255, 0.05) !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.btn-secondary:hover, .btn-outline:hover, .btn-ghost:hover, .btn-glass-glow:hover, .ponder-pill-secondary:hover {
    background: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;
    border-color: rgba(255, 255, 255, 0.45) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
}

/* Ponder Amber Highlight Pill */
.btn-gold-pill, .ponder-pill-amber {
    background: rgba(245, 158, 11, 0.08) !important;
    color: #fbbf24 !important;
    font-weight: 700 !important;
    border-radius: 9999px !important;
    border: 1px solid rgba(245, 158, 11, 0.35) !important;
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.15) !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.btn-gold-pill:hover, .ponder-pill-amber:hover {
    background: rgba(245, 158, 11, 0.18) !important;
    color: #fde68a !important;
    border-color: rgba(245, 158, 11, 0.6) !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.28) !important;
}

/* Ponder Floating Capsule Navbar & Tab States */
.navbar {
    background: rgba(6, 10, 20, 0.82) !important;
    backdrop-filter: blur(28px) saturate(1.8) !important;
    -webkit-backdrop-filter: blur(28px) saturate(1.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 9999px !important;
    box-shadow: 0 16px 45px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.14) !important;
}

.portal-tab-btn {
    border-radius: 9999px !important;
    font-weight: 600 !important;
    color: #94a3b8 !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.portal-tab-btn:hover {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.08) !important;
}

.portal-tab-btn.active {
    background: #ffffff !important;
    color: #030508 !important;
    font-weight: 800 !important;
    border-color: #ffffff !important;
    box-shadow: 0 2px 14px rgba(255, 255, 255, 0.32) !important;
}

/* Ponder Editorial Typography & Headings */
h1, .hero-title, .section-title {
    letter-spacing: -0.04em !important;
    font-weight: 900 !important;
    color: #ffffff !important;
}

/* Ponder Numbered Pipeline & Step Items */
.pipeline-step-item {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 10px !important;
    padding: 10px 14px !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    cursor: pointer !important;
}

.pipeline-step-item:hover {
    background: rgba(255, 255, 255, 0.07) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    transform: translateX(3px) !important;
}

/* Section Transparency for Fullsite Backdrop Depth */
main > section,
main > div:not(.modal-overlay):not(#auth-overlay):not(.admin-modal-overlay) {
    background: transparent !important;
}

@media screen and (max-width: 768px) {
    .navbar {
        top: 8px !important;
        width: calc(100% - 20px) !important;
        margin: 8px auto 0 auto !important;
        border-radius: 16px !important;
    }
}

`;

style = style.slice(0, startIdx) + ponderBlock + style.slice(endIdx);
fs.writeFileSync('style.css', style, 'utf8');
console.log('Successfully upgraded style.css to Ponder High-Contrast Monochromatic & Motion System');
