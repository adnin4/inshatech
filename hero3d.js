/**
 * IINSHA AI LAB — Fullsite 3D Intelligence Mesh & Constellation Engine
 * Inspired by Lorenzo Lottici (Awwwards) & LittleWebsite.co
 * 
 * Features:
 * - Dynamic full-viewport 3D canvas (100vw x 100vh) running top-to-bottom across the entire website
 * - Scroll-reactive geometry: rotates and glides across sections as visitor scrolls
 * - Interactive cursor magnetic attraction & mouse parallax
 * - LittleWebsite.co style pause/play motion control
 * - Dynamic connective filaments between 3D nodes with depth-fading alphas
 * - Concentric 3D orbital rings & pulsating AI core
 * - 60+ FPS performance, High-DPI retina scaling, prefers-reduced-motion awareness
 */

(function() {
    'use strict';

    const HERO3D_CONFIG = {
        particleCount: window.innerWidth < 768 ? 32 : 72,
        nodeCount: window.innerWidth < 768 ? 16 : 32,
        colors: {
            core: '#8B5CF6',
            cyan: '#06B6D4',
            gold: '#F59E0B',
            emerald: '#10B981',
            particles: ['#38BDF8', '#818CF8', '#34D399', '#A78BFA', '#06B6D4']
        },
        mouse: { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false },
        scrollY: 0,
        lastScrollY: 0,
        scrollVelocity: 0,
        scrollProgress: 0,
        isVisible: true,
        isPaused: false,
        isReducedMotion: false
    };

    function initHero3D() {
        const container = document.getElementById('hero3d-container');
        if (!container) return;

        // Check reduced motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        HERO3D_CONFIG.isReducedMotion = motionQuery.matches;
        motionQuery.addEventListener('change', (e) => {
            HERO3D_CONFIG.isReducedMotion = e.matches;
        });

        // Track visibility
        document.addEventListener('visibilitychange', () => {
            HERO3D_CONFIG.isVisible = !document.hidden;
        });

        // Track scroll globally across the entire document
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            HERO3D_CONFIG.scrollVelocity = currentY - HERO3D_CONFIG.lastScrollY;
            HERO3D_CONFIG.lastScrollY = currentY;
            HERO3D_CONFIG.scrollY = currentY;

            const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            HERO3D_CONFIG.scrollProgress = Math.min(1, Math.max(0, currentY / docHeight));
        }, { passive: true });

        // Global mouse & touch tracking across the entire window
        window.addEventListener('mousemove', (e) => {
            HERO3D_CONFIG.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            HERO3D_CONFIG.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            HERO3D_CONFIG.mouse.isHovered = true;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            HERO3D_CONFIG.mouse.targetX = 0;
            HERO3D_CONFIG.mouse.targetY = 0;
            HERO3D_CONFIG.mouse.isHovered = false;
        });

        // Setup Play/Pause toggle button (LittleWebsite style)
        const toggleBtn = document.getElementById('hero-motion-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                HERO3D_CONFIG.isPaused = !HERO3D_CONFIG.isPaused;
                const pauseIcon = toggleBtn.querySelector('.motion-pause');
                const playIcon = toggleBtn.querySelector('.motion-play');
                const videoBackdrop = document.querySelector('.global-video-backdrop, .hero-video-backdrop');

                if (HERO3D_CONFIG.isPaused) {
                    if (pauseIcon) pauseIcon.style.display = 'none';
                    if (playIcon) playIcon.style.display = 'inline-block';
                    toggleBtn.setAttribute('title', 'Resume 3D Motion');
                    if (videoBackdrop && typeof videoBackdrop.pause === 'function') videoBackdrop.pause();
                } else {
                    if (pauseIcon) pauseIcon.style.display = 'inline-block';
                    if (playIcon) playIcon.style.display = 'none';
                    toggleBtn.setAttribute('title', 'Pause 3D Motion');
                    if (videoBackdrop && typeof videoBackdrop.play === 'function') videoBackdrop.play();
                }
            });
        }

        // Run high-performance procedural Canvas 3D constellation engine
        initFullsiteCanvas3D(container);
    }

    /**
     * High-performance 3D Kinetic Constellation Engine
     * Zero external dependencies • Full viewport • 60+ FPS
     */
    function initFullsiteCanvas3D(container) {
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

        // 3D Nodes Setup
        const nodes = [];
        const count = HERO3D_CONFIG.nodeCount;
        const baseRadius = Math.min(width, height) * 0.32;

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            nodes.push({
                x: baseRadius * Math.cos(theta) * Math.sin(phi),
                y: baseRadius * Math.sin(theta) * Math.sin(phi),
                z: baseRadius * Math.cos(phi),
                baseX: baseRadius * Math.cos(theta) * Math.sin(phi),
                baseY: baseRadius * Math.sin(theta) * Math.sin(phi),
                baseZ: baseRadius * Math.cos(phi),
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                vz: (Math.random() - 0.5) * 0.35,
                color: HERO3D_CONFIG.colors.particles[i % HERO3D_CONFIG.colors.particles.length],
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Ambient floating particles
        const particles = [];
        const pCount = HERO3D_CONFIG.particleCount;
        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width * 1.5,
                y: (Math.random() - 0.5) * height * 1.5,
                z: (Math.random() - 0.5) * 700,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                color: HERO3D_CONFIG.colors.particles[i % HERO3D_CONFIG.colors.particles.length],
                size: Math.random() * 2 + 1
            });
        }

        let rotX = 0;
        let rotY = 0;
        let curCx = width * 0.65;
        let curCy = height * 0.45;
        const fov = 460;

        function render() {
            requestAnimationFrame(render);

            if (!HERO3D_CONFIG.isVisible || HERO3D_CONFIG.isPaused) return;

            ctx.clearRect(0, 0, width, height);

            // Smooth mouse follow
            HERO3D_CONFIG.mouse.x += (HERO3D_CONFIG.mouse.targetX - HERO3D_CONFIG.mouse.x) * 0.05;
            HERO3D_CONFIG.mouse.y += (HERO3D_CONFIG.mouse.targetY - HERO3D_CONFIG.mouse.y) * 0.05;

            // Decay scroll velocity smoothly
            HERO3D_CONFIG.scrollVelocity *= 0.92;

            // Rotation driven by time, scroll velocity, and mouse
            const velFactor = HERO3D_CONFIG.scrollVelocity * 0.0004;
            rotY += 0.0022 + velFactor + HERO3D_CONFIG.mouse.x * 0.001;
            rotX += 0.0015 + velFactor * 0.7 + HERO3D_CONFIG.mouse.y * 0.001;

            // Dynamic Constellation Center synced with scroll progress
            const sp = HERO3D_CONFIG.scrollProgress;
            const targetCx = width * (0.5 + Math.sin(sp * Math.PI * 2.5) * 0.22);
            const targetCy = height * (0.48 + Math.cos(sp * Math.PI * 2.0) * 0.14);
            curCx += (targetCx - curCx) * 0.05;
            curCy += (targetCy - curCy) * 0.05;

            // 1. Draw 3D Orbital Rings around the core
            ctx.save();
            ctx.translate(curCx, curCy);
            for (let ring = 0; ring < 2; ring++) {
                ctx.beginPath();
                const ringRadius = (baseRadius * (0.75 + ring * 0.35));
                const ringAngle = rotY * (ring === 0 ? 1 : -0.8);
                const tilt = 0.45 + ring * 0.25;

                for (let a = 0; a <= Math.PI * 2; a += 0.15) {
                    const rx = ringRadius * Math.cos(a);
                    const rz = ringRadius * Math.sin(a);
                    const rxRot = rx * Math.cos(ringAngle) - rz * Math.sin(ringAngle);
                    const rzRot = rz * Math.cos(ringAngle) + rx * Math.sin(ringAngle);
                    const ryRot = rzRot * Math.sin(tilt);
                    const zProj = rzRot * Math.cos(tilt);

                    const scale = fov / (fov + zProj + 250);
                    const px = rxRot * scale;
                    const py = ryRot * scale;

                    if (a === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.strokeStyle = ring === 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.10)';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
            ctx.restore();

            // 2. Project & Render 3D Nodes
            const projectedNodes = [];
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += 0.03;

                if (!HERO3D_CONFIG.isReducedMotion) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.z += n.vz;
                    if (Math.abs(n.x) > baseRadius * 1.25) n.vx *= -1;
                    if (Math.abs(n.y) > baseRadius * 1.25) n.vy *= -1;
                    if (Math.abs(n.z) > baseRadius * 1.25) n.vz *= -1;
                }

                // 3D rotation
                const x1 = n.x * cosY - n.z * sinY;
                const z1 = n.z * cosY + n.x * sinY;
                const y2 = n.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + n.y * sinX;

                // Perspective projection
                const scale = fov / (fov + z2 + 250);
                const px = curCx + x1 * scale;
                const py = curCy + y2 * scale;
                const alpha = Math.max(0.12, Math.min(0.85, (z2 + baseRadius) / (baseRadius * 2)));

                projectedNodes.push({ px, py, z2, scale, alpha, color: n.color, pulse: n.pulse });
            }

            // 3. Connective Laser Filaments between proximate nodes
            const maxDist = 135;
            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const p1 = projectedNodes[i];
                    const p2 = projectedNodes[j];
                    const dx = p1.px - p2.px;
                    const dy = p1.py - p2.py;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(p1.px, p1.py);
                        ctx.lineTo(p2.px, p2.py);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha.toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // 4. Draw Nodes with soft neon halos
            for (let i = 0; i < projectedNodes.length; i++) {
                const p = projectedNodes[i];
                const r = Math.max(1.8, 3.2 * p.scale + Math.sin(p.pulse) * 0.6);

                // Halo
                ctx.beginPath();
                ctx.arc(p.px, p.py, r * 2.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${(p.alpha * 0.18).toFixed(3)})`;
                ctx.fill();

                // Solid Core
                ctx.beginPath();
                ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // 5. Draw Ambient Micro-Particles
            for (let i = 0; i < particles.length; i++) {
                const pt = particles[i];
                if (!HERO3D_CONFIG.isReducedMotion) {
                    pt.x += pt.vx;
                    pt.y += pt.vy;
                    if (pt.x < -width * 0.6) pt.x = width * 0.6;
                    if (pt.x > width * 0.6) pt.x = -width * 0.6;
                    if (pt.y < -height * 0.6) pt.y = height * 0.6;
                    if (pt.y > height * 0.6) pt.y = -height * 0.6;
                }

                const px = width * 0.5 + pt.x;
                const py = height * 0.5 + pt.y;
                const pScale = fov / (fov + pt.z + 300);

                ctx.beginPath();
                ctx.arc(px, py, pt.size * pScale, 0, Math.PI * 2);
                ctx.fillStyle = pt.color;
                ctx.globalAlpha = Math.max(0.08, Math.min(0.35, pScale * 0.3));
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHero3D);
    } else {
        initHero3D();
    }

    window.initHero3D = initHero3D;
})();
