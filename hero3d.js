/**
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
        { name: 'Magician', color: '#8B5CF6', aura: 'rgba(139, 92, 246, 0.45)', radius: 17, orbitR: 160, speed: 0.0022, angle: 0, tilt: 0.35 },
        { name: 'Automator', color: '#38BDF8', aura: 'rgba(56, 189, 248, 0.45)', radius: 19, orbitR: 260, speed: -0.0016, angle: 1.2, tilt: -0.42 },
        { name: 'Genius', color: '#EC4899', aura: 'rgba(236, 72, 153, 0.50)', radius: 22, orbitR: 360, speed: 0.0012, angle: 2.5, tilt: 0.28 },
        { name: 'UI-AI', color: '#6366F1', aura: 'rgba(99, 102, 241, 0.45)', radius: 18, orbitR: 460, speed: -0.0009, angle: 3.8, tilt: -0.32 },
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
