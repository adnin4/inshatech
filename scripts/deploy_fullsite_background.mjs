import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('C:/Users/mahin khan/.gemini/antigravity/scratch/portfolio-showcase');

const globalStageHtml = `    <!-- ====================================================================
         GLOBAL FULLSITE CINEMATIC 3D MOTION STAGE (AWWWARDS / LITTLEWEBSITE)
         Dynamic Top-to-Bottom Interactive Video + Lorenzo Lottici 3D Mesh
         ==================================================================== -->
    <div id="global-cinematic-stage" class="global-cinematic-stage" aria-hidden="true">
        <!-- LittleWebsite Fullsite Looping Motion Video / Animated WebP -->
        <picture class="global-video-backdrop">
            <source srcset="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/animated.webp" type="image/webp">
            <img src="https://image.mux.com/omDw6A2bMbivggNyFVfIeV8Pcpd6fVZmN009mvRFQZyU/thumbnail.webp?time=0&amp;width=1920" alt="Fullsite Cinematic 3D Motion" class="global-media-cover" loading="eager">
        </picture>
        <!-- Fullsite Lorenzo Lottici 3D Kinetic Constellation WebGL / Canvas Container -->
        <div id="hero3d-container" class="global-3d-canvas-wrap"></div>
        <!-- Fullsite Halftone Dot-Matrix Pattern Overlay -->
        <div class="global-halftone-overlay"></div>
        <!-- Fullsite Ambient Vignette & Contrast Control Mask -->
        <div class="global-vignette-overlay"></div>
    </div>

    <!-- AWWWARDS / LITTLEWEBSITE FLOATING MOTION CONTROLLER (GLOBAL) -->
    <button id="hero-motion-toggle" class="global-motion-control" aria-label="Toggle Fullsite 3D Background Motion" title="Pause / Play Fullsite 3D Motion">
        <span class="motion-icon motion-pause">⏸ 3D Motion Active</span>
        <span class="motion-icon motion-play" style="display:none;">▶ 3D Motion Paused</span>
    </button>`;

for (const fileName of ['index.html', 'live_index.html']) {
    const filePath = path.join(baseDir, fileName);
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Remove old hero-cinematic-stage inside section#hero if present
    if (html.includes('hero-cinematic-stage')) {
        const stageRegex = /<div class="hero-cinematic-stage"[\s\S]*?<\/button>\s*/;
        html = html.replace(stageRegex, '');
    }

    // 2. Insert global stage right after <body...> tag
    if (!html.includes('id="global-cinematic-stage"')) {
        html = html.replace(/(<body[^>]*>)/i, `$1\n\n${globalStageHtml}`);
        console.log(`✅ ${fileName} injected with global-cinematic-stage`);
    } else {
        console.log(`ℹ️ ${fileName} already has global-cinematic-stage`);
    }

    // 3. Ensure hero3d.js script tag is present before </body>
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
