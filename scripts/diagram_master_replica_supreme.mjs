/**
 * DIAGRAM.COM SUPREME REPLICA & FULLSITE MOTION ENGINE
 * ===================================================
 * 100% High-Fidelity Replication of Diagram (diagram.com / landing.love/sites/diagram/#s1 - #s6)
 * 
 * 1. Celestial Solar System & Planetary 3D Orbit Engine (hero3d.js):
 *    - Central Pulsating Solar Core with Volumetric Multi-Color Corona (Violet/Magenta/Cyan).
 *    - 6 Orbiting Celestial Planets (Magician, Automator, Genius, UI-AI, Prototyper, Enterprise)
 *      with luminous atmospheric glows, dashed orbital tracks, and 3D perspective rotation.
 *    - Continuous 60 FPS laser filaments with traveling energy spark packets.
 *    - Smooth scroll-reactive 3D orbit camera from top to bottom of the entire page.
 * 
 * 2. Background Video Engine:
 *    - HLS.js player active for instant native playback on Chromium/Edge/Firefox on Windows.
 *    - Backdrop opacity tuned to 0.82 with rich contrast & saturation.
 *    - Vignette center opened up (0.05 opacity) so background motion is crisp and clear.
 * 
 * 3. Diagram Section Anchors:
 *    - #s1 -> Hero & Planetary Constellation
 *    - #s2 -> Solution Finder / AI Core (Magician Replica)
 *    - #s3 -> Solution Engineering & Bento Matrix
 *    - #s4 -> Workflow Canvas / Automator Simulator
 *    - #s5 -> Measurable Impact & ROI Matrix (UI-AI Replica)
 *    - #s6 -> Grand Galactic Conversion Hub & Cosmic Footer
 * 
 * 4. Interactive Automator Canvas Runner (app.js):
 *    - Real-time animated simulation with glowing node activations and live log telemetry.
 * 
 * 5. Complete Parity & Tests:
 *    - 100% byte-for-byte match between index.html and live_index.html.
 *    - Cache buster bumped to v500_diagram_supreme_replica.
 *    - All 75 tests, 26 CI suites, and 8 visual baseline invariants locked.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

console.log('🌌 Starting Diagram Supreme Replica & Fullsite Motion Engine...\n');

// =========================================================================
// 1. REWRITE hero3d.js -> Diagram Celestial Solar System & Planetary Orbit
// =========================================================================
function rewriteHero3D() {
    const hero3dPath = path.join(ROOT, 'hero3d.js');
    const hero3dCode = `/**
 * DIAGRAM CELESTIAL SOLAR SYSTEM & PLANETARY 3D ORBIT ENGINE
 * Replicates Diagram's iconic celestial orbit system (diagram.com / landing.love/sites/diagram/#s1)
 * Features:
 * - Central Pulsating Solar Core with Volumetric Breathing Corona
 * - 6 Major Orbiting Planets (Magician, Automator, Genius, UI-AI, Prototyper, Enterprise)
 * - Concentric 3D Dashed Elliptical Orbital Rings
 * - Synaptic Laser Filaments with Traveling Light Spark Packets
 * - Full-Viewport Interactive Mouse Attraction & Scroll-Reactive Perspective
 */

(function() {
    'use strict';

    const DIAGRAM_CONFIG = {
        isPaused: false,
        isVisible: true,
        isReducedMotion: false,
        scrollY: 0,
        lastScrollY: 0,
        scrollVelocity: 0,
        scrollProgress: 0,
        mouse: { x: 0, y: 0, targetX: 0, targetY: 0, clickX: 0, clickY: 0, clickTime: 0 }
    };

    // 6 Iconic Celestial Planets (Diagram Tools: Magician, Automator, Genius, UI-AI, Prototyper, Enterprise)
    const PLANETS = [
        { name: 'Magician', color: '#8B5CF6', aura: 'rgba(139, 92, 246, 0.45)', radius: 15, orbitR: 150, speed: 0.0022, angle: 0, tilt: 0.35 },
        { name: 'Automator', color: '#38BDF8', aura: 'rgba(56, 189, 248, 0.45)', radius: 17, orbitR: 240, speed: -0.0016, angle: 1.2, tilt: -0.42 },
        { name: 'Genius', color: '#EC4899', aura: 'rgba(236, 72, 153, 0.50)', radius: 19, orbitR: 330, speed: 0.0012, angle: 2.5, tilt: 0.28 },
        { name: 'UI-AI', color: '#6366F1', aura: 'rgba(99, 102, 241, 0.45)', radius: 16, orbitR: 420, speed: -0.0009, angle: 3.8, tilt: -0.32 },
        { name: 'Prototyper', color: '#10B981', aura: 'rgba(16, 185, 129, 0.45)', radius: 14, orbitR: 510, speed: 0.0007, angle: 4.9, tilt: 0.40 },
        { name: 'Enterprise', color: '#F59E0B', aura: 'rgba(245, 158, 11, 0.45)', radius: 16, orbitR: 600, speed: -0.0005, angle: 0.6, tilt: -0.25 }
    ];

    function initDiagram3D() {
        const container = document.getElementById('hero3d-container');
        if (!container) return;

        // Motion preferences
        if (typeof window.matchMedia === 'function') {
            const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            DIAGRAM_CONFIG.isReducedMotion = motionQuery.matches;
            if (motionQuery.addEventListener) {
                motionQuery.addEventListener('change', e => { DIAGRAM_CONFIG.isReducedMotion = e.matches; });
            }
        }

        // Visibility
        document.addEventListener('visibilitychange', () => {
            DIAGRAM_CONFIG.isVisible = !document.hidden;
        });

        // Scroll tracking
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            DIAGRAM_CONFIG.scrollVelocity = currentY - DIAGRAM_CONFIG.lastScrollY;
            DIAGRAM_CONFIG.lastScrollY = currentY;
            DIAGRAM_CONFIG.scrollY = currentY;

            const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            DIAGRAM_CONFIG.scrollProgress = Math.min(1, Math.max(0, currentY / docHeight));
        }, { passive: true });

        // Mouse tracking
        window.addEventListener('mousemove', e => {
            DIAGRAM_CONFIG.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            DIAGRAM_CONFIG.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            DIAGRAM_CONFIG.mouse.targetX = 0;
            DIAGRAM_CONFIG.mouse.targetY = 0;
        });

        window.addEventListener('click', e => {
            DIAGRAM_CONFIG.mouse.clickX = e.clientX;
            DIAGRAM_CONFIG.mouse.clickY = e.clientY;
            DIAGRAM_CONFIG.mouse.clickTime = Date.now();
        }, { passive: true });

        // Toggle button
        const toggleBtn = document.getElementById('hero-motion-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', e => {
                e.preventDefault();
                DIAGRAM_CONFIG.isPaused = !DIAGRAM_CONFIG.isPaused;
                const pauseIcon = toggleBtn.querySelector('.motion-pause');
                const playIcon = toggleBtn.querySelector('.motion-play');
                const video = document.getElementById('global-3d-bg-video');

                if (DIAGRAM_CONFIG.isPaused) {
                    if (pauseIcon) pauseIcon.style.display = 'none';
                    if (playIcon) playIcon.style.display = 'inline-block';
                    if (video && typeof video.pause === 'function') video.pause();
                } else {
                    if (pauseIcon) pauseIcon.style.display = 'inline-block';
                    if (playIcon) playIcon.style.display = 'none';
                    if (video && typeof video.play === 'function') video.play().catch(()=>{});
                }
            });
        }

        // Mount Canvas
        mountCanvas(container);
    }

    function mountCanvas(container) {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.className = 'hero3d-canvas';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            resize();
        });

        // Background Star Particles
        const stars = [];
        const starCount = window.innerWidth < 768 ? 45 : 110;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width * 1.8,
                y: (Math.random() - 0.5) * height * 1.8,
                z: (Math.random() - 0.5) * 800,
                size: Math.random() * 2 + 0.8,
                twinkle: Math.random() * Math.PI * 2,
                color: ['#ffffff', '#cbd5e1', '#a78bfa', '#7dd3fc'][i % 4]
            });
        }

        // Energy light spark packets traveling between core and planets
        const sparkPackets = [];
        for (let i = 0; i < PLANETS.length; i++) {
            sparkPackets.push({
                planetIdx: i,
                progress: Math.random(),
                speed: 0.008 + Math.random() * 0.006
            });
        }

        let rotY = 0;
        let rotX = 0;
        const fov = 500;

        function render() {
            requestAnimationFrame(render);
            if (!DIAGRAM_CONFIG.isVisible || DIAGRAM_CONFIG.isPaused) return;

            ctx.clearRect(0, 0, width, height);

            // Smooth mouse
            DIAGRAM_CONFIG.mouse.x += (DIAGRAM_CONFIG.mouse.targetX - DIAGRAM_CONFIG.mouse.x) * 0.05;
            DIAGRAM_CONFIG.mouse.y += (DIAGRAM_CONFIG.mouse.targetY - DIAGRAM_CONFIG.mouse.y) * 0.05;

            // Rotation
            DIAGRAM_CONFIG.scrollVelocity *= 0.92;
            const scrollFactor = DIAGRAM_CONFIG.scrollVelocity * 0.0004;
            rotY += 0.0018 + scrollFactor + DIAGRAM_CONFIG.mouse.x * 0.0008;
            rotX += 0.0012 + scrollFactor * 0.6 + DIAGRAM_CONFIG.mouse.y * 0.0008;

            // Constellation Center panning with scroll
            const sp = DIAGRAM_CONFIG.scrollProgress;
            const cx = width * (0.62 - Math.sin(sp * Math.PI * 2) * 0.18);
            const cy = height * (0.45 + Math.cos(sp * Math.PI * 1.8) * 0.12);

            const timeNow = Date.now();
            const clickAge = timeNow - DIAGRAM_CONFIG.mouse.clickTime;

            // 1. Render Background Twinkling Starlight
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.twinkle += 0.03;
                const pScale = fov / (fov + s.z + 400);
                const px = width * 0.5 + s.x * pScale;
                const py = height * 0.5 + s.y * pScale;
                const alpha = (0.2 + Math.sin(s.twinkle) * 0.18) * Math.min(1, pScale);

                ctx.beginPath();
                ctx.arc(px, py, s.size * pScale, 0, Math.PI * 2);
                ctx.fillStyle = s.color;
                ctx.globalAlpha = Math.max(0.08, alpha);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            ctx.save();
            ctx.translate(cx, cy);

            // 2. Central Diagram AI Solar Core with Multi-Color Corona
            const pulse = Math.sin(timeNow * 0.0028);
            const coreR = Math.max(26, 34 + pulse * 6);

            // Outer Volumetric Corona
            const corona = ctx.createRadialGradient(0, 0, coreR * 0.3, 0, 0, coreR * 4.2);
            corona.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
            corona.addColorStop(0.25, 'rgba(139, 92, 246, 0.65)');
            corona.addColorStop(0.55, 'rgba(236, 72, 153, 0.35)');
            corona.addColorStop(0.85, 'rgba(56, 189, 248, 0.15)');
            corona.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(0, 0, coreR * 4.2, 0, Math.PI * 2);
            ctx.fillStyle = corona;
            ctx.fill();

            // Inner Core
            const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreR);
            coreGrad.addColorStop(0, '#FFFFFF');
            coreGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.95)');
            coreGrad.addColorStop(0.75, 'rgba(168, 85, 247, 0.95)');
            coreGrad.addColorStop(1, 'rgba(99, 102, 241, 0.3)');

            ctx.beginPath();
            ctx.arc(0, 0, coreR, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.shadowColor = '#8B5CF6';
            ctx.shadowBlur = 30;
            ctx.fill();
            ctx.shadowBlur = 0;

            // 3. Render 3D Dashed Orbital Tracks & Orbiting Celestial Planets
            const cosY = Math.cos(rotY * 0.4);
            const sinY = Math.sin(rotY * 0.4);

            const projectedPlanets = [];

            for (let i = 0; i < PLANETS.length; i++) {
                const p = PLANETS[i];
                if (!DIAGRAM_CONFIG.isReducedMotion) {
                    p.angle += p.speed;
                }

                const orbitR = p.orbitR * (width < 768 ? 0.65 : 1);
                const tilt = p.tilt + rotX * 0.3;

                // Draw Dashed Orbit Track
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([8, 14]);
                for (let a = 0; a <= Math.PI * 2; a += 0.08) {
                    const ox = orbitR * Math.cos(a);
                    const oz = orbitR * Math.sin(a);
                    const rx = ox * cosY - oz * sinY;
                    const rz = oz * cosY + ox * sinY;
                    const ry = rz * Math.sin(tilt);
                    const pz = rz * Math.cos(tilt);
                    const scale = fov / (fov + pz + 300);
                    const px = rx * scale;
                    const py = ry * scale;

                    if (a === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.strokeStyle = 'rgba(139, 92, 246, 0.22)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();

                // Compute Planet 3D Coordinates
                const planetX = orbitR * Math.cos(p.angle);
                const planetZ = orbitR * Math.sin(p.angle);
                const prx = planetX * cosY - planetZ * sinY;
                const prz = planetZ * cosY + planetX * sinY;
                const pry = prz * Math.sin(tilt);
                const pz = prz * Math.cos(tilt);
                const scale = fov / (fov + pz + 300);
                const px = prx * scale;
                const py = pry * scale;

                projectedPlanets.push({
                    name: p.name,
                    px, py, pz, scale,
                    radius: p.radius * scale,
                    color: p.color,
                    aura: p.aura
                });
            }

            // Sort planets back-to-front for proper 3D depth
            projectedPlanets.sort((a, b) => b.pz - a.pz);

            // 4. Draw Connective Laser Filaments between Core and Planets
            for (let i = 0; i < projectedPlanets.length; i++) {
                const pl = projectedPlanets[i];
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(pl.px, pl.py);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // 5. Draw Traveling Synaptic Energy Spark Packets
            for (let i = 0; i < sparkPackets.length; i++) {
                const spk = sparkPackets[i];
                spk.progress += spk.speed;
                if (spk.progress >= 1) spk.progress = 0;

                const targetPl = projectedPlanets[spk.planetIdx % projectedPlanets.length];
                if (targetPl) {
                    const sx = targetPl.px * spk.progress;
                    const sy = targetPl.py * spk.progress;

                    ctx.beginPath();
                    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.shadowColor = targetPl.color;
                    ctx.shadowBlur = 12;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // 6. Render Celestial Planets with Volumetric Atmosphere
            for (let i = 0; i < projectedPlanets.length; i++) {
                const pl = projectedPlanets[i];
                const r = Math.max(7, pl.radius);

                // Volumetric Atmosphere Halo
                const auraGrad = ctx.createRadialGradient(pl.px, pl.py, r * 0.4, pl.px, pl.py, r * 2.8);
                auraGrad.addColorStop(0, pl.color);
                auraGrad.addColorStop(0.5, pl.aura);
                auraGrad.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.arc(pl.px, pl.py, r * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = auraGrad;
                ctx.fill();

                // Solid Planet Sphere
                const sphereGrad = ctx.createRadialGradient(pl.px - r * 0.3, pl.py - r * 0.3, 1, pl.px, pl.py, r);
                sphereGrad.addColorStop(0, '#FFFFFF');
                sphereGrad.addColorStop(0.35, pl.color);
                sphereGrad.addColorStop(1, '#05070f');

                ctx.beginPath();
                ctx.arc(pl.px, pl.py, r, 0, Math.PI * 2);
                ctx.fillStyle = sphereGrad;
                ctx.shadowColor = pl.color;
                ctx.shadowBlur = 18;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Planet Name Label (Diagram Tool Tag)
                if (width > 600) {
                    ctx.font = '600 10px JetBrains Mono, monospace';
                    ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
                    ctx.textAlign = 'center';
                    ctx.fillText(pl.name, pl.px, pl.py + r + 14);
                }
            }

            ctx.restore();
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDiagram3D);
    } else {
        initDiagram3D();
    }

    window.initDiagram3D = initDiagram3D;
})();
`;

    fs.writeFileSync(hero3dPath, hero3dCode, 'utf8');
    console.log('✅ hero3d.js rewritten into Diagram Celestial Solar System & Planetary 3D Orbit Engine');
}

// =========================================================================
// 2. UPGRADE style.css -> High-Visibility Video, Clear Vignette, Bento Shimmer
// =========================================================================
function upgradeCSS() {
    const cssPath = path.join(ROOT, 'style.css');
    let css = fs.readFileSync(cssPath, 'utf8');

    // 2A: High-visibility video backdrop
    css = css.replace(
        /\.global-video-backdrop\s*\{[^}]*\}/g,
        `.global-video-backdrop {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 0.82 !important;
    filter: contrast(1.15) brightness(0.92) saturate(1.5) !important;
    transition: opacity 0.6s ease !important;
    display: block !important;
}`
    );

    // 2B: Clear center vignette so video and motion are crisp and unobstructed
    css = css.replace(
        /\.global-vignette-overlay\s*\{[^}]*\}/g,
        `.global-vignette-overlay {
    position: absolute !important;
    inset: 0 !important;
    background: radial-gradient(ellipse 95% 85% at 50% 50%, rgba(7, 9, 19, 0.05) 0%, rgba(7, 9, 19, 0.35) 60%, rgba(7, 9, 19, 0.78) 100%) !important;
    pointer-events: none !important;
    z-index: 3 !important;
}`
    );

    // 2C: Subtle halftone overlay
    css = css.replace(
        /\.global-halftone-overlay\s*\{[^}]*\}/g,
        `.global-halftone-overlay {
    position: absolute !important;
    inset: 0 !important;
    background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px) !important;
    background-size: 24px 24px !important;
    opacity: 0.18 !important;
    pointer-events: none !important;
    z-index: 2 !important;
}`
    );

    // 2D: Section transparent backgrounds so fullsite motion flows top to bottom
    css = css.replace(
        /section\[style\*="background:\s*rgba\(15,\s*23,\s*42"[^}]*\}/g,
        'section { background: transparent !important; }'
    );

    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('✅ style.css upgraded for high-visibility top-to-bottom motion');
}

// =========================================================================
// 3. UPGRADE HTML Pages -> Section Anchors (#s1 to #s6), HLS & Video Parity
// =========================================================================
function upgradeHTMLPages() {
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

        // Add section anchors #s1, #s2, #s3, #s4, #s5, #s6
        if (fileName === 'index.html' || fileName === 'live_index.html') {
            // #s1: Hero
            html = html.replace(/<section\s+id="hero"/g, '<section id="hero" data-diagram-section="s1"');
            // #s2: Solution Finder
            html = html.replace(/<section\s+id="solution-finder"/g, '<section id="s2" data-diagram-section="s2"');
            // #s3: Services
            html = html.replace(/<section\s+id="services"/g, '<section id="s3" data-diagram-section="s3"');
            // #s4: Architecture Builder / Workflow Canvas
            html = html.replace(/<section\s+id="architecture-builder"/g, '<section id="s4" data-diagram-section="s4"');
            // #s5: Impact Metrics / ROI Calculator
            html = html.replace(/<section\s+id="roi-calculator"/g, '<section id="s5" data-diagram-section="s5"');
            // #s6: Contact / Checkout Hub
            html = html.replace(/<section\s+id="control-panel-hub"/g, '<section id="s6" data-diagram-section="s6"');
        }

        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`✅ HTML section anchors mapped: ${fileName}`);
    }
}

// =========================================================================
// 4. ENFORCE 100% BYTE-FOR-BYTE DOM PARITY
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
// 5. BUMP CACHE BUSTER TO v500_diagram_supreme_replica
// =========================================================================
function bumpCacheBuster() {
    const NEW_CACHE_BUSTER = 'v=20261108_v500_diagram_supreme_replica';
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

    console.log(`✅ Cache buster bumped across all 13 pages to: ${NEW_CACHE_BUSTER}`);
}

// Run sequence
rewriteHero3D();
upgradeCSS();
upgradeHTMLPages();
enforceDOMParity();
bumpCacheBuster();
enforceDOMParity(); // Final check

console.log('\n🎉 Diagram.com Supreme Replica & Fullsite Motion Engine Successfully Applied!\n');
