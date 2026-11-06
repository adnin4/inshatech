import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

// 1. UPDATE style.css FOR BACKGROUND VISIBILITY & LUMINOUS CYBERNETIC PALETTE
const stylePath = path.join(ROOT, 'style.css');
let css = fs.readFileSync(stylePath, 'utf8');

// Target the global cinematic stage block in style.css
const oldStageRegex = /\.global-cinematic-stage\s*\{[\s\S]*?body\s*\{[\s\S]*?background-color:\s*#030712[\s\S]*?\}\s*main,\s*section,\s*\.hero-section\s*\{[\s\S]*?\}/;

const newStageReplacement = `html {
    background-color: #02040a !important;
}

body {
    background: transparent !important;
    background-color: transparent !important;
    position: relative !important;
    color: var(--text-primary) !important;
    overflow-x: hidden !important;
}

.global-cinematic-stage {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    pointer-events: none !important;
    z-index: 0 !important;
    transform: translateZ(0) !important;
    backface-visibility: hidden !important;
}

.global-video-backdrop {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 0.62 !important;
    filter: contrast(1.15) brightness(0.95) saturate(1.4) !important;
    transition: opacity 0.6s ease !important;
    display: block !important;
}

.global-video-backdrop img,
.global-media-cover {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
}

.global-3d-canvas-wrap {
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

.global-halftone-overlay {
    position: absolute !important;
    inset: 0 !important;
    background-image: radial-gradient(rgba(255, 255, 255, 0.10) 1.2px, transparent 1.2px) !important;
    background-size: 20px 20px !important;
    opacity: 0.45 !important;
    pointer-events: none !important;
    z-index: 2 !important;
}

.global-vignette-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: radial-gradient(ellipse 95% 85% at 50% 50%, rgba(2, 4, 10, 0.15) 0%, rgba(2, 4, 10, 0.5) 60%, rgba(2, 4, 10, 0.88) 100%) !important;
    pointer-events: none !important;
    z-index: 3 !important;
}

header, .navbar, .iinsha-navbar, .os-status-bar, main, section, .hero-section, footer, .dash-container, #toastContainer, #auth-overlay {
    position: relative !important;
    z-index: 2 !important;
    background: transparent !important;
}`;

if (oldStageRegex.test(css)) {
    css = css.replace(oldStageRegex, () => newStageReplacement);
    fs.writeFileSync(stylePath, css, 'utf8');
    console.log('✓ style.css background visibility & stacking context upgraded');
} else {
    console.log('Stage regex did not match directly, appending enhanced stage rules');
    css += '\n\n/* === ENHANCED 3D GLOBAL STAGE ELEVATION === */\n' + newStageReplacement;
    fs.writeFileSync(stylePath, css, 'utf8');
}
