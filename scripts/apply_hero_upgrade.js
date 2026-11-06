import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('C:/Users/mahin khan/.gemini/antigravity/scratch/portfolio-showcase');

// 1. UPDATE style.css
const cssToAdd = `
/* ==========================================================================
   AWWWARDS LORENZO LOTTICI & LITTLEWEBSITE DESIGN SYSTEM (2026)
   ========================================================================== */
.hero-section {
    position: relative !important;
    overflow: hidden !important;
    min-height: 82vh !important;
    display: flex !important;
    align-items: center !important;
    background: radial-gradient(ellipse 90% 70% at 50% -15%, rgba(14, 28, 54, 0.65), rgba(4, 7, 15, 0.98) 75%) !important;
}

.hero-cinematic-stage {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    pointer-events: none !important;
    z-index: 0 !important;
}

.hero-video-backdrop {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 0.28 !important;
    mix-blend-mode: screen !important;
    filter: contrast(1.15) brightness(0.9) saturate(1.2) !important;
    transition: opacity 0.6s ease !important;
    display: block !important;
}

.hero-video-backdrop img,
.hero-media-cover {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
}

.hero3d-canvas-wrap {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1 !important;
    pointer-events: none !important;
}

.hero3d-canvas {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
}

.hero-halftone-overlay {
    position: absolute !important;
    inset: 0 !important;
    background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px) !important;
    background-size: 20px 20px !important;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%) !important;
    -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 80%) !important;
    opacity: 0.45 !important;
    pointer-events: none !important;
    z-index: 2 !important;
}

.hero-vignette-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(4, 7, 15, 0.2) 0%, rgba(4, 7, 15, 0.85) 75%, rgba(4, 7, 15, 1) 100%) !important;
    pointer-events: none !important;
    z-index: 3 !important;
}

.hero-section > .container {
    position: relative !important;
    z-index: 4 !important;
}

.hero-motion-control {
    position: absolute !important;
    bottom: 24px !important;
    right: 32px !important;
    z-index: 10 !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 8px 16px !important;
    font-family: var(--font-mono, monospace) !important;
    font-size: 0.76rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    color: #94a3b8 !important;
    background: rgba(15, 23, 42, 0.7) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 9999px !important;
    backdrop-filter: blur(12px) !important;
    cursor: pointer !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.hero-motion-control:hover {
    color: #ffffff !important;
    border-color: rgba(56, 189, 248, 0.5) !important;
    background: rgba(15, 23, 42, 0.9) !important;
    box-shadow: 0 4px 16px rgba(56, 189, 248, 0.2) !important;
}

.hero-awwwards-tag {
    display: inline-flex !important;
    align-items: center !important;
    gap: 8px !important;
    padding: 4px 14px !important;
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 9999px !important;
    font-family: var(--font-mono, monospace) !important;
    font-size: 0.74rem !important;
    font-weight: 600 !important;
    letter-spacing: 0.06em !important;
    color: #cbd5e1 !important;
    margin-bottom: 14px !important;
    backdrop-filter: blur(10px) !important;
}

.awwwards-pulsing-dot {
    width: 6px !important;
    height: 6px !important;
    border-radius: 50% !important;
    background: #38bdf8 !important;
    box-shadow: 0 0 10px #38bdf8 !important;
    animation: awwwardsPulse 2s infinite ease-in-out !important;
}

@keyframes awwwardsPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
}

.hero-gradient-silver {
    background: linear-gradient(135deg, #ffffff 20%, #cbd5e1 50%, #38bdf8 100%) !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    display: inline-block !important;
}

@media (max-width: 768px) {
    .hero-motion-control {
        bottom: 12px !important;
        right: 14px !important;
        padding: 6px 12px !important;
        font-size: 0.7rem !important;
    }
}
`;

const stylePath = path.join(baseDir, 'style.css');
let styleContent = fs.readFileSync(stylePath, 'utf8');
if (!styleContent.includes('hero-cinematic-stage')) {
    styleContent += '\n' + cssToAdd;
    fs.writeFileSync(stylePath, styleContent, 'utf8');
    console.log('✅ style.css updated with Awwwards Hero CSS');
} else {
    console.log('ℹ️ style.css already contains hero-cinematic-stage');
}

// 2. UPDATE universal_ai_copilot.css
const copilotCssPath = path.join(baseDir, 'universal_ai_copilot.css');
let copilotCss = fs.readFileSync(copilotCssPath, 'utf8');
if (!copilotCss.includes('max-width: 900px')) {
    copilotCss += `
@media (max-width: 900px) {
    #iinsha-copilot-teaser {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
}
`;
    fs.writeFileSync(copilotCssPath, copilotCss, 'utf8');
    console.log('✅ universal_ai_copilot.css updated with mobile teaser suppression');
}

// 3. UPDATE universal_ai_copilot.js to hide teaser on mobile
const copilotJsPath = path.join(baseDir, 'universal_ai_copilot.js');
let copilotJs = fs.readFileSync(copilotJsPath, 'utf8');
if (!copilotJs.includes('navigator.userAgent')) {
    copilotJs = copilotJs.replace(
        "if (window.innerWidth <= 768 || sessionStorage.getItem('iinsha_teaser_dismissed') === 'true') {",
        "const isMobileTeaser = window.innerWidth <= 900 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);\n            if (isMobileTeaser || sessionStorage.getItem('iinsha_teaser_dismissed') === 'true') {"
    );
    fs.writeFileSync(copilotJsPath, copilotJs, 'utf8');
    console.log('✅ universal_ai_copilot.js updated with userAgent mobile check');
}

// 4. UPDATE index.html and live_index.html
const heroStageHtml = `        <!-- TIER 1: HERO SECTION -->
        <section id="hero" class="hero-section" style="padding-top: 50px; padding-bottom: 50px; position: relative; overflow: hidden;">
            <!-- CINEMATIC 3D MOTION STAGE (LITTLEWEBSITE & LORENZO LOTTICI) -->
            <div class="hero-cinematic-stage" aria-hidden="true">
                <picture class="hero-video-backdrop">
                    <source srcset="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/animated.webp" type="image/webp">
                    <img src="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/thumbnail.webp?time=0&width=1920" alt="Cinematic 3D Motion Backdrop" class="hero-media-cover" loading="eager">
                </picture>
                <div id="hero3d-container" class="hero3d-canvas-wrap"></div>
                <div class="hero-halftone-overlay"></div>
                <div class="hero-vignette-overlay"></div>
            </div>

            <!-- LITTLEWEBSITE MOTION CONTROL TOGGLE -->
            <button id="hero-motion-toggle" class="hero-motion-control" aria-label="Toggle Hero Background Motion" title="Pause / Play 3D Kinetic Motion">
                <span class="motion-icon motion-pause">⏸ Motion Active</span>
                <span class="motion-icon motion-play" style="display:none;">▶ Motion Paused</span>
            </button>

            <div class="container" style="position: relative; z-index: 4;">
                <div class="hero-grid">
                    <div>
                        <!-- AI RETURNING USER MEMORY BANNER -->
                        <div id="os-memory-banner" class="os-memory-banner" style="display: none; margin-bottom: 20px;"></div>

                        <!-- AWWWARDS EDITORIAL NOMINEE BADGE -->
                        <div class="hero-awwwards-tag">
                            <span class="awwwards-pulsing-dot"></span>
                            <span class="awwwards-tag-text">AWWWARDS HONOREE NOMINEE • DIGITAL EXCELLENCE 2026</span>
                        </div>

                        <div class="hero-badge">
                            <span class="pulse-beacon" style="width: 6px; height: 6px;"></span> ENTERPRISE AUTONOMOUS INFRASTRUCTURE
                        </div>
                        
                        <!-- PRIORITY 3: SCARCITY & LIVE AVAILABILITY BADGE -->
                        <div class="scarcity-badge" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(16, 185, 129, 0.35); color: #e2e8f0; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 600; margin: 12px 0 16px 0; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(10px);">
                            <span class="os-pulse-dot" style="background: #10b981;"></span>
                            <span>Production Capacity: <strong style="color: #10b981;">3 Active Engineering Slots</strong> • Response SLA: <strong style="color: #38bdf8;">&lt; 1 Hour</strong></span>
                        </div>
                        
                        <h1 class="hero-title" style="font-size: clamp(2.3rem, 4.8vw, 3.8rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; margin-bottom: 16px;">
                            Autonomous AI Systems.<br>
                            <span class="hero-gradient-silver">Engineered for Scale.</span>
                        </h1>`;

for (const fileName of ['index.html', 'live_index.html']) {
    const filePath = path.join(baseDir, fileName);
    let html = fs.readFileSync(filePath, 'utf8');

    // Replace hero section header if not yet upgraded
    if (!html.includes('hero-cinematic-stage')) {
        // Regex to target the start of hero section up to h1
        const heroRegex = /<!-- TIER 1: HERO SECTION -->[\s\S]*?<h1 class="hero-title"[\s\S]*?<\/h1>/;
        if (heroRegex.test(html)) {
            html = html.replace(heroRegex, heroStageHtml);
            console.log(`✅ ${fileName} hero section upgraded`);
        } else {
            console.warn(`⚠️ Could not match heroRegex in ${fileName}`);
        }
    } else {
        console.log(`ℹ️ ${fileName} already contains hero-cinematic-stage`);
    }

    // Ensure hero3d.js script tag is present before </body>
    if (!html.includes('hero3d.js')) {
        html = html.replace(
            '<script src="app.js?v=20260907_v130_modal_dom_perfection" defer></script>',
            '<script src="hero3d.js?v=20261106_awwwards_mesh" defer></script>\n    <script src="app.js?v=20260907_v130_modal_dom_perfection" defer></script>'
        );
        console.log(`✅ ${fileName} hero3d.js script tag added`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
}

console.log('✨ All files successfully upgraded!');
