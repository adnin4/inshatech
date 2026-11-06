/**
 * IINSHA AI LAB — 3D Intelligence Core (Awwwards / Lorenzo Lottici Standard)
 * Three.js WebGL + Autonomous Canvas 3D Kinetic Mesh Engine
 * 
 * Features:
 * - Central rotating 3D wireframe AI core & data constellation
 * - Interactive mouse parallax & magnetic cursor attraction
 * - LittleWebsite.co style motion toggle (Play/Pause)
 * - Autonomous procedural 3D fallback if Three.js CDN is unavailable
 * - High-DPI crisp retina scaling
 * - prefers-reduced-motion & visibility API awareness
 */

(function() {
    'use strict';

    const HERO3D_CONFIG = {
        particleCount: window.innerWidth < 768 ? 30 : 65,
        nodeCount: window.innerWidth < 768 ? 12 : 22,
        colors: {
            core: '#8B5CF6',
            cyan: '#06B6D4',
            gold: '#F59E0B',
            emerald: '#10B981',
            particles: ['#38BDF8', '#818CF8', '#34D399', '#A78BFA']
        },
        mouse: { x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false },
        scrollY: 0,
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

        // Track scroll
        window.addEventListener('scroll', () => {
            HERO3D_CONFIG.scrollY = window.scrollY;
        }, { passive: true });

        // Setup mouse tracking across the entire hero section
        const heroSection = document.getElementById('hero') || container.parentElement;
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                HERO3D_CONFIG.mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                HERO3D_CONFIG.mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                HERO3D_CONFIG.mouse.isHovered = true;
            });
            heroSection.addEventListener('mouseleave', () => {
                HERO3D_CONFIG.mouse.targetX = 0;
                HERO3D_CONFIG.mouse.targetY = 0;
                HERO3D_CONFIG.mouse.isHovered = false;
            });
        }

        // Setup Play/Pause toggle button (LittleWebsite style)
        const toggleBtn = document.getElementById('hero-motion-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                HERO3D_CONFIG.isPaused = !HERO3D_CONFIG.isPaused;
                const pauseIcon = toggleBtn.querySelector('.motion-pause');
                const playIcon = toggleBtn.querySelector('.motion-play');
                const label = toggleBtn.querySelector('.motion-label');
                const videoBackdrop = document.querySelector('.hero-video-backdrop');

                if (HERO3D_CONFIG.isPaused) {
                    if (pauseIcon) pauseIcon.style.display = 'none';
                    if (playIcon) playIcon.style.display = 'inline-block';
                    if (label) label.textContent = 'Paused';
                    if (videoBackdrop && typeof videoBackdrop.pause === 'function') videoBackdrop.pause();
                } else {
                    if (pauseIcon) pauseIcon.style.display = 'inline-block';
                    if (playIcon) playIcon.style.display = 'none';
                    if (label) label.textContent = '3D Motion';
                    if (videoBackdrop && typeof videoBackdrop.play === 'function') videoBackdrop.play();
                }
            });
        }

        // If window.THREE is available, run Three.js scene
        if (window.THREE) {
            initThreeJsScene(container);
        } else {
            // Autonomous high-performance procedural Canvas 3D kinetic mesh
            initAutonomousCanvas3D(container);
        }
    }

    /**
     * Autonomous Procedural 3D Kinetic Constellation Engine
     * Zero external dependencies • 60+ FPS • Lorenzo Lottici aesthetic
     */
    function initAutonomousCanvas3D(container) {
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.className = 'hero3d-canvas';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || 650;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            width = container.clientWidth || window.innerWidth;
            height = container.clientHeight || 650;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
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
        const radius = Math.min(width, height) * 0.28;

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            nodes.push({
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi),
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: (Math.random() - 0.5) * 0.3,
                color: HERO3D_CONFIG.colors.particles[i % HERO3D_CONFIG.colors.particles.length]
            });
        }

        // Floating particles
        const particles = [];
        const pCount = HERO3D_CONFIG.particleCount;
        for (let i = 0; i < pCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * width * 1.2,
                y: (Math.random() - 0.5) * height * 1.2,
                z: (Math.random() - 0.5) * 600,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                color: HERO3D_CONFIG.colors.particles[i % HERO3D_CONFIG.colors.particles.length]
            });
        }

        let rotX = 0;
        let rotY = 0;
        const fov = 420;

        function render() {
            requestAnimationFrame(render);

            if (!HERO3D_CONFIG.isVisible || HERO3D_CONFIG.isPaused) return;

            ctx.clearRect(0, 0, width, height);

            // Smooth mouse follow
            HERO3D_CONFIG.mouse.x += (HERO3D_CONFIG.mouse.targetX - HERO3D_CONFIG.mouse.x) * 0.05;
            HERO3D_CONFIG.mouse.y += (HERO3D_CONFIG.mouse.targetY - HERO3D_CONFIG.mouse.y) * 0.05;

            rotY += 0.003 + HERO3D_CONFIG.mouse.x * 0.002;
            rotX += 0.002 + HERO3D_CONFIG.mouse.y * 0.002;

            const cx = width * 0.72; // Positioned gracefully towards the right cockpit area
            const cy = height * 0.48;

            const projectedNodes = [];

            // Project & render 3D Nodes
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                if (!HERO3D_CONFIG.isReducedMotion) {
                    n.x += n.vx;
                    n.y += n.vy;
                    n.z += n.vz;
                    if (Math.abs(n.x) > radius * 1.2) n.vx *= -1;
                    if (Math.abs(n.y) > radius * 1.2) n.vy *= -1;
                    if (Math.abs(n.z) > radius * 1.2) n.vz *= -1;
                }

                // 3D Rotation matrices
                const cosY = Math.cos(rotY);
                const sinY = Math.sin(rotY);
                const x1 = n.x * cosY - n.z * sinY;
                const z1 = n.z * cosY + n.x * sinY;

                const cosX = Math.cos(rotX);
                const sinX = Math.sin(rotX);
                const y2 = n.y * cosX - z1 * sinX;
                const z2 = z1 * cosX + n.y * sinX;

                // Perspective projection
                const scale = fov / (fov + z2 + 200);
                const px = cx + x1 * scale;
                const py = cy + y2 * scale;
                const alpha = Math.max(0.15, Math.min(0.9, (z2 + radius) / (radius * 2)));

                projectedNodes.push({ px, py, scale, alpha, color: n.color });
            }

            // Draw glowing connective lasers between nearby nodes
            ctx.lineWidth = 1;
            for (let i = 0; i < projectedNodes.length; i++) {
                for (let j = i + 1; j < projectedNodes.length; j++) {
                    const p1 = projectedNodes[i];
                    const p2 = projectedNodes[j];
                    const dx = p1.px - p2.px;
                    const dy = p1.py - p2.py;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        const lineAlpha = (1 - dist / 140) * 0.28 * Math.min(p1.alpha, p2.alpha);
                        ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.px, p1.py);
                        ctx.lineTo(p2.px, p2.py);
                        ctx.stroke();
                    }
                }
            }

            // Draw nodes
            for (let i = 0; i < projectedNodes.length; i++) {
                const p = projectedNodes[i];
                const nodeRadius = Math.max(2, 4 * p.scale);

                // Halo glow
                const grad = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, nodeRadius * 3);
                grad.addColorStop(0, p.color);
                grad.addColorStop(0.5, `rgba(56, 189, 248, ${p.alpha * 0.4})`);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(p.px, p.py, nodeRadius * 3, 0, Math.PI * 2);
                ctx.fill();

                // Solid center
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.px, p.py, Math.max(1.5, nodeRadius * 0.6), 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw ambient particles
            for (let i = 0; i < particles.length; i++) {
                const pt = particles[i];
                if (!HERO3D_CONFIG.isReducedMotion) {
                    pt.x += pt.vx;
                    pt.y += pt.vy;
                    if (pt.x < -width * 0.2) pt.x = width * 1.2;
                    if (pt.x > width * 1.2) pt.x = -width * 0.2;
                    if (pt.y < -height * 0.2) pt.y = height * 1.2;
                    if (pt.y > height * 1.2) pt.y = -height * 0.2;
                }

                ctx.fillStyle = `rgba(255, 255, 255, 0.25)`;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        render();
    }

    /**
     * Standard Three.js Scene fallback
     */
    function initThreeJsScene(container) {
        try {
            const THREE = window.THREE;
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.set(0, 0, 6);

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            const coreGeometry = new THREE.IcosahedronGeometry(0.8, 2);
            const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.65 });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            scene.add(core);

            function animate() {
                requestAnimationFrame(animate);
                if (HERO3D_CONFIG.isPaused || !HERO3D_CONFIG.isVisible) return;
                core.rotation.x += 0.002;
                core.rotation.y += 0.003;
                renderer.render(scene, camera);
            }
            animate();
        } catch(e) {
            initAutonomousCanvas3D(container);
        }
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHero3D);
    } else {
        initHero3D();
    }

    window.initHero3D = initHero3D;
})();
