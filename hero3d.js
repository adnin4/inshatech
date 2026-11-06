/**
 * IINSHA AI LAB — Fullsite 3D Kinetic Neural Mesh & Cybernetic Core Engine v6.0
 * Architecture: ChainGPT + Zero-Tech + Active Theory + Lorenzo Lottici + Apiant
 * 
 * Features:
 * - Central 3D Pulsating Neural Core with volumetric breathing corona & chromatic glow
 * - Dynamic kinetic synaptic energy packets traveling across laser filaments (synapses firing)
 * - Concentric 3D orbital rings with rotating targeting reticles & tick dashes
 * - Interactive mouse gravitational attraction & click shockwave ripples
 * - Full-viewport (100vw x 100vh) scroll-reactive 3D constellation running top-to-bottom
 * - 60+ FPS high-performance Canvas 2D matrix, high-DPI scaling, and power-efficient pause/play
 */

(function() {
    'use strict';

    const HERO3D_CONFIG = {
        particleCount: window.innerWidth < 768 ? 36 : 84,
        nodeCount: window.innerWidth < 768 ? 18 : 36,
        colors: {
            core: '#00F2FE',
            cyan: '#00F2FE',
            violet: '#8B5CF6',
            gold: '#F59E0B',
            emerald: '#10B981',
            particles: ['#00F2FE', '#38BDF8', '#818CF8', '#A78BFA', '#34D399', '#F59E0B']
        },
        mouse: { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false, clickX: 0, clickY: 0, clickTime: 0 },
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

        // Global mouse & touch tracking
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

        // Click Shockwave Ripple Trigger (Active Theory / Zero-Tech style)
        window.addEventListener('click', (e) => {
            HERO3D_CONFIG.mouse.clickX = e.clientX;
            HERO3D_CONFIG.mouse.clickY = e.clientY;
            HERO3D_CONFIG.mouse.clickTime = Date.now();
        }, { passive: true });

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
     * High-performance 3D Kinetic Neural Mesh & Cybernetic Core Engine
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
        const baseRadius = Math.min(width, height) * 0.34;

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

        // Synaptic Energy Packets (Light packets traveling along network filaments)
        const synapticPackets = [];
        const packetCount = 8;
        for (let p = 0; p < packetCount; p++) {
            synapticPackets.push({
                sourceIdx: Math.floor(Math.random() * count),
                targetIdx: Math.floor(Math.random() * count),
                progress: Math.random(),
                speed: 0.006 + Math.random() * 0.008,
                color: '#FFFFFF'
            });
        }

        // Ambient floating particles
        const particles = [];
        const pCount = HERO3D_CONFIG.particleCount;
        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width * 1.5,
                y: (Math.random() - 0.5) * height * 1.5,
                z: (Math.random() - 0.5) * 750,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                color: HERO3D_CONFIG.colors.particles[i % HERO3D_CONFIG.colors.particles.length],
                size: Math.random() * 2 + 0.8
            });
        }

        let rotX = 0;
        let rotY = 0;
        let curCx = width * 0.65;
        let curCy = height * 0.45;
        const fov = 480;

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
            rotY += 0.0022 + velFactor + HERO3D_CONFIG.mouse.x * 0.0012;
            rotX += 0.0015 + velFactor * 0.7 + HERO3D_CONFIG.mouse.y * 0.0012;

            // Dynamic Constellation Center synced with scroll progress
            const sp = HERO3D_CONFIG.scrollProgress;
            const targetCx = width * (0.5 + Math.sin(sp * Math.PI * 2.5) * 0.22);
            const targetCy = height * (0.48 + Math.cos(sp * Math.PI * 2.0) * 0.14);
            curCx += (targetCx - curCx) * 0.05;
            curCy += (targetCy - curCy) * 0.05;

            const timeNow = Date.now();
            const clickAge = timeNow - HERO3D_CONFIG.mouse.clickTime;

            // 1. Draw Central Pulsating AI Core Sphere (Zero-Tech & ChainGPT style)
            const corePulse = Math.sin(timeNow * 0.0025);
            const coreR = Math.max(22, 28 + corePulse * 6);

            ctx.save();
            ctx.translate(curCx, curCy);

            // Volumetric Outer Corona Glow
            const coronaGrad = ctx.createRadialGradient(0, 0, coreR * 0.2, 0, 0, coreR * 3.8);
            coronaGrad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
            coronaGrad.addColorStop(0.35, 'rgba(139, 92, 246, 0.14)');
            coronaGrad.addColorStop(0.7, 'rgba(0, 242, 254, 0.04)');
            coronaGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(0, 0, coreR * 3.8, 0, Math.PI * 2);
            ctx.fillStyle = coronaGrad;
            ctx.fill();

            // Luminous Inner Core
            const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreR);
            coreGrad.addColorStop(0, '#FFFFFF');
            coreGrad.addColorStop(0.3, 'rgba(0, 242, 254, 0.95)');
            coreGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.8)');
            coreGrad.addColorStop(1, 'rgba(0, 242, 254, 0.1)');
            ctx.beginPath();
            ctx.arc(0, 0, coreR, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();

            // 2. 3D Orbital Targeting Rings with Segmented Reticle Ticks
            for (let ring = 0; ring < 3; ring++) {
                ctx.beginPath();
                const ringRadius = (baseRadius * (0.65 + ring * 0.35));
                const ringAngle = rotY * (ring % 2 === 0 ? 1 : -0.75);
                const tilt = 0.42 + ring * 0.28;

                for (let a = 0; a <= Math.PI * 2; a += 0.12) {
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
                ctx.save();
                if (ring === 0) {
                    ctx.setLineDash([12, 16]);
                    ctx.strokeStyle = 'rgba(0, 242, 254, 0.22)';
                } else if (ring === 1) {
                    ctx.setLineDash([6, 12]);
                    ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
                } else {
                    ctx.strokeStyle = 'rgba(56, 189, 248, 0.10)';
                }
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            // 3. Project & Render 3D Nodes
            const projectedNodes = [];
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.pulse += 0.035;

                if (!HERO3D_CONFIG.isReducedMotion) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.z += n.vz;
                    if (Math.abs(n.x) > baseRadius * 1.3) n.vx *= -1;
                    if (Math.abs(n.y) > baseRadius * 1.3) n.vy *= -1;
                    if (Math.abs(n.z) > baseRadius * 1.3) n.vz *= -1;

                    // Click shockwave expansion (Active Theory)
                    if (clickAge < 800) {
                        const waveProgress = clickAge / 800;
                        const waveRadius = waveProgress * Math.max(width, height) * 0.8;
                        const distToClick = Math.hypot(n.x + curCx - HERO3D_CONFIG.mouse.clickX, n.y + curCy - HERO3D_CONFIG.mouse.clickY);
                        if (Math.abs(distToClick - waveRadius) < 100) {
                            n.x += (Math.random() - 0.5) * 4;
                            n.y += (Math.random() - 0.5) * 4;
                        }
                    }
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
                const alpha = Math.max(0.12, Math.min(0.9, (z2 + baseRadius) / (baseRadius * 2)));

                projectedNodes.push({ px, py, z2, scale, alpha, color: n.color, pulse: n.pulse });
            }

            // 4. Connective Laser Filaments
            const maxDist = 145;
            const validConnections = [];
            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const p1 = projectedNodes[i];
                    const p2 = projectedNodes[j];
                    const dx = p1.px - p2.px;
                    const dy = p1.py - p2.py;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        validConnections.push({ i, j, p1, p2, dist });
                        const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.45;
                        ctx.beginPath();
                        ctx.moveTo(p1.px, p1.py);
                        ctx.lineTo(p2.px, p2.py);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${lineAlpha.toFixed(3)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // 5. Draw Traveling Synaptic Energy Packets (Synapses Firing)
            for (let p = 0; p < synapticPackets.length; p++) {
                const pkt = synapticPackets[p];
                pkt.progress += pkt.speed;
                if (pkt.progress >= 1) {
                    pkt.progress = 0;
                    pkt.sourceIdx = Math.floor(Math.random() * projectedNodes.length);
                    pkt.targetIdx = (pkt.sourceIdx + 1 + Math.floor(Math.random() * 4)) % projectedNodes.length;
                }

                const sNode = projectedNodes[pkt.sourceIdx];
                const tNode = projectedNodes[pkt.targetIdx];
                if (sNode && tNode) {
                    const sparkX = sNode.px + (tNode.px - sNode.px) * pkt.progress;
                    const sparkY = sNode.py + (tNode.py - sNode.py) * pkt.progress;

                    ctx.beginPath();
                    ctx.arc(sparkX, sparkY, 2.4, 0, Math.PI * 2);
                    ctx.fillStyle = '#FFFFFF';
                    ctx.shadowColor = '#00F2FE';
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // 6. Draw Nodes with soft neon halos
            for (let i = 0; i < projectedNodes.length; i++) {
                const p = projectedNodes[i];
                const r = Math.max(2.0, 3.6 * p.scale + Math.sin(p.pulse) * 0.7);

                // Halo
                ctx.beginPath();
                ctx.arc(p.px, p.py, r * 3.0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 242, 254, ${(p.alpha * 0.22).toFixed(3)})`;
                ctx.fill();

                // Solid Core
                ctx.beginPath();
                ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // 7. Draw Ambient Cyber Micro-Particles
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
                ctx.globalAlpha = Math.max(0.08, Math.min(0.4, pScale * 0.35));
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
