import fs from 'fs';

const masterResponsiveCss = `

/* ==========================================================================
   MASTER UNIVERSAL RESPONSIVE ARCHITECTURE (A-Z RESPONSIVE ENGINE)
   Enforces Gemini & Awwwards Standard:
   1. Viewport & Zero Horizontal Scrollbar (Top-to-Bottom Vertical Scroll Only)
   2. Fluid Layouts & Media (100% Fluid Containers, Images, Videos, Canvases)
   3. Fluid Typography & Spacing (No Overlaps, No Collision, Text Wrap)
   4. Touch-Friendly Targets (WCAG 2.2 AA 44x44px+, Form Inputs 16px iOS fix)
   5. Comprehensive Responsive Grids (All Grids Collapse to 1fr on Mobile)
   6. Data Tables & Code Snippets Touch Horizontal Scroll
   7. Mobile Navigation & Floating Capsule Ergonomics
   8. Responsive Modals & Overlay Containers (Max 90vh, Scrollable)
   9. Safe Area Insets (iOS Home Indicator & Notches)
   ========================================================================== */

/* 1. ROOT ZERO HORIZONTAL SCROLL ENFORCEMENT */
html {
    box-sizing: border-box !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
    -webkit-text-size-adjust: 100% !important;
    text-size-adjust: 100% !important;
    scroll-behavior: smooth !important;
}

*, *::before, *::after {
    box-sizing: inherit !important;
}

body {
    max-width: 100vw !important;
    overflow-x: hidden !important;
    width: 100% !important;
    position: relative !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

/* 2. FLUID MEDIA & EMBEDS */
img,
video,
canvas,
svg,
iframe,
object,
embed {
    max-width: 100% !important;
    height: auto !important;
}

/* Global 3D Cinematic Stage Background Responsive Constraint */
#global-cinematic-stage,
.global-video-backdrop {
    max-width: 100vw !important;
    overflow: hidden !important;
}

/* 3. CODE & TABLES RESPONSIVE SCROLL CONTAINERS */
pre,
code,
kbd,
samp {
    max-width: 100% !important;
    word-break: break-word !important;
}

pre {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    white-space: pre-wrap !important;
    scrollbar-width: thin !important;
}

.table-wrapper,
.table-container,
.comparison-table-wrapper {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: thin !important;
    border-radius: 12px !important;
}

table {
    width: 100% !important;
    max-width: 100% !important;
    border-collapse: collapse !important;
}

/* 4. WORKFLOW CANVAS NODE PIPELINE (RESPONSIVE HORIZONTAL FLOW) */
.canvas-node-grid {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: thin !important;
    padding: 16px !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.canvas-node-card {
    min-width: 150px !important;
    flex-shrink: 0 !important;
    padding: 14px 16px !important;
    border-radius: 12px !important;
    text-align: center !important;
}

.canvas-connector {
    font-size: 1.25rem !important;
    color: var(--accent-cyan, #00f2fe) !important;
    flex-shrink: 0 !important;
    user-select: none !important;
}

/* 5. RESPONSIVE BREAKPOINT: TABLETS & MOBILE (<= 1024px) */
@media screen and (max-width: 1024px) {
    .container,
    .dash-container,
    main {
        max-width: 100% !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
        box-sizing: border-box !important;
    }

    .hero-grid {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
    }

    .solutions-grid,
    .pricing-grid,
    .blueprint-grid,
    #blueprint-grid,
    .model-matrix-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 20px !important;
    }
}

/* 6. RESPONSIVE BREAKPOINT: SMARTPHONES & TABLETS (<= 768px) */
@media screen and (max-width: 768px) {
    /* Fluid Container & Padding */
    .container,
    .dash-container,
    .auth-container,
    main {
        padding-left: 14px !important;
        padding-right: 14px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Floating Capsule Navbar Mobile Adaptations */
    .navbar {
        top: 8px !important;
        width: calc(100% - 16px) !important;
        margin: 6px auto !important;
        padding: 6px 10px !important;
        border-radius: 14px !important;
    }

    .nav-container {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 8px !important;
        width: 100% !important;
    }

    .logo {
        justify-content: center !important;
    }

    /* Portal Tabs: Friction-free Horizontal Drag Bar */
    .portal-tabs,
    .nav-container nav.portal-tabs {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        gap: 6px !important;
        width: 100% !important;
        padding: 2px 2px 4px 2px !important;
    }

    .portal-tab-btn {
        flex-shrink: 0 !important;
        padding: 8px 12px !important;
        font-size: 0.78rem !important;
        min-height: 44px !important;
        white-space: nowrap !important;
    }

    /* All Multi-Column Grids Collapse Gracefully */
    .hero-grid,
    .solutions-grid,
    .packages-grid,
    .blueprint-grid,
    #blueprint-grid,
    .model-matrix-grid,
    .trust-grid,
    .premium-grid,
    .template-store-grid,
    .lab-tools-grid,
    .industry-grid,
    .cat-cards-grid,
    .services-grid,
    .pricing-grid,
    .features-grid,
    .blueprint-filter-grid,
    .hub-actions-grid,
    .newsletter-grid,
    .success-slide,
    .lead-magnet-card {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
        width: 100% !important;
    }

    /* 4-Column Metric Hubs Collapse to 2-Column Grid on Tablet */
    .finder-metrics-grid,
    .roi-results-metrics-grid,
    .engineering-stats-grid,
    .hub-metrics-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px !important;
        width: 100% !important;
    }

    .roi-inputs-team-grid,
    .roi-inputs-invest-grid {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
    }

    /* Form Controls & iOS Safari Auto-Zoom Fix */
    input[type="text"],
    input[type="number"],
    input[type="email"],
    input[type="password"],
    input[type="tel"],
    input[type="url"],
    input[type="search"],
    select,
    textarea,
    .dash-select {
        font-size: 16px !important; /* Critical: prevents iOS Safari auto-zoom on focus */
        min-height: 48px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }

    /* Touch-Friendly Hit Targets (WCAG 2.2 AA) */
    button,
    .btn,
    .btn-primary,
    .btn-glass,
    .btn-primary-sm,
    .btn-glass-sm,
    .finder-preset,
    .pay-method-tab,
    .add-node-btn {
        min-height: 44px !important;
        padding: 10px 16px !important;
        font-size: 0.88rem !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        touch-action: manipulation !important;
        -webkit-tap-highlight-color: transparent !important;
    }

    .hero-actions {
        flex-direction: column !important;
        width: 100% !important;
        gap: 10px !important;
    }

    .hero-actions .btn,
    .hero-actions a {
        width: 100% !important;
        justify-content: center !important;
    }

    /* Fluid Typography with Safe Word Breaking */
    h1, .hero-title {
        font-size: clamp(1.85rem, 6.5vw, 2.75rem) !important;
        line-height: 1.18 !important;
        letter-spacing: -0.02em !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
    }

    h2, .section-header h2 {
        font-size: clamp(1.4rem, 5vw, 2rem) !important;
        line-height: 1.25 !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
    }

    p, .hero-subtitle {
        font-size: clamp(0.9rem, 3vw, 1.05rem) !important;
        line-height: 1.6 !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
    }

    /* Modals & Overlays Responsive Safeguard */
    .toast-modal,
    .cmd-palette-container,
    .admin-modal-box,
    .pkg-modal-box,
    #lead-magnet-modal > div,
    #checkout-modal,
    #ai-readiness-modal,
    #ai-playground-modal {
        width: calc(100vw - 24px) !important;
        max-width: calc(100vw - 24px) !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 18px 14px !important;
        border-radius: 16px !important;
        margin: 10px auto !important;
        box-sizing: border-box !important;
    }

    /* Safe Bottom Inset for Sticky CTA */
    .sticky-mobile-cta {
        padding-bottom: max(12px, env(safe-area-inset-bottom)) !important;
    }

    body:not(.cta-dismissed) {
        padding-bottom: 74px !important;
    }
}

/* 7. RESPONSIVE BREAKPOINT: SMALL SMARTPHONES (<= 480px & 320px) */
@media screen and (max-width: 480px) {
    .container,
    .dash-container,
    main {
        padding-left: 10px !important;
        padding-right: 10px !important;
    }

    /* Collapse Metric Hubs to Single Column on Narrow Screens */
    .finder-metrics-grid,
    .roi-results-metrics-grid,
    .engineering-stats-grid,
    .hub-metrics-grid,
    .partner-stats-grid,
    .hero-card-actions-grid {
        grid-template-columns: 1fr !important;
        gap: 8px !important;
    }

    .hero-telemetry-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 4px !important;
    }

    .hero-telemetry-grid > div {
        padding: 8px 4px !important;
    }

    .hero-telemetry-grid > div > div:first-child {
        font-size: 0.78rem !important;
    }

    .hero-telemetry-grid > div > div:last-child {
        font-size: 0.58rem !important;
    }

    /* Trust Strip on Narrow Screens */
    .hero-trust-strip {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px !important;
    }

    .hero-trust-strip > div[style*="width: 1px"] {
        display: none !important;
    }

    /* Responsive Headings */
    h1, .hero-title {
        font-size: clamp(1.6rem, 7.5vw, 2.1rem) !important;
    }

    h2, .section-header h2 {
        font-size: clamp(1.25rem, 5.8vw, 1.65rem) !important;
    }

    .btn, button {
        padding: 10px 14px !important;
        font-size: 0.82rem !important;
    }

    /* Floating Copilot Launcher scale on tiny screens */
    #iinsha-copilot-trigger,
    .iinsha-cockpit-launcher {
        transform: scale(0.85) !important;
        right: 8px !important;
    }
}

/* 8. ULTRA-NARROW SCREENS (<= 360px: iPhone SE, Galaxy Fold Cover) */
@media screen and (max-width: 360px) {
    .hero-telemetry-grid {
        grid-template-columns: 1fr !important;
    }
    
    .hero-trust-strip {
        grid-template-columns: 1fr !important;
    }
}
`;

let styleContent = fs.readFileSync('style.css', 'utf8');

// If already appended previously, replace it; otherwise append.
const marker = '/* === MASTER UNIVERSAL RESPONSIVE ARCHITECTURE';
if (styleContent.includes(marker)) {
    const idx = styleContent.indexOf(marker);
    styleContent = styleContent.substring(0, idx) + masterResponsiveCss.trim() + '\n';
} else {
    styleContent = styleContent.trim() + '\n' + masterResponsiveCss.trim() + '\n';
}

fs.writeFileSync('style.css', styleContent, 'utf8');
console.log('Successfully appended Master Universal Responsive Architecture to style.css');
