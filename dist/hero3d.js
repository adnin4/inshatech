/**
 * IINSHA AI LAB — 3D Intelligence Core
 * Three.js WebGL cinematic hero visualization
 * 
 * Features:
 * - Central glowing AI core with pulsing aura
 * - Orbital rings with data nodes
 * - Floating particle field
 * - Mouse parallax camera movement
 * - Scroll-driven depth
 * - Mobile optimization (reduced particles)
 * - prefers-reduced-motion support
 * - Tab-hidden pause
 * - WebGL failure graceful fallback
 */

(function() {
    'use strict';

    const HERO3D_CONFIG = {
        particleCount: window.innerWidth < 768 ? 25 : 50,
        nodeCount: window.innerWidth < 768 ? 8 : 16,
        ringCount: 3,
        colors: {
            core: 0x8B5CF6,
            coreGlow: 0xA78BFA,
            ring1: 0x06B6D4,
            ring2: 0x8B5CF6,
            ring3: 0x10B981,
            particles: [0x06B6D4, 0x8B5CF6, 0x10B981, 0x00FF87],
            nodes: [0x06B6D4, 0x8B5CF6, 0x10B981]
        },
        mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
        scrollY: 0,
        isVisible: true,
        isReducedMotion: false
    };

    function initHero3D() {
        const container = document.getElementById('hero3d-container');
        if (!container) return;

        // Check reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        HERO3D_CONFIG.isReducedMotion = motionQuery.matches;
        motionQuery.addEventListener('change', (e) => {
            HERO3D_CONFIG.isReducedMotion = e.matches;
        });

        // Check WebGL support
        if (!window.THREE) {
            container.classList.add('hero3d-fallback');
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                container.classList.add('hero3d-fallback');
                return;
            }
        } catch(e) {
            container.classList.add('hero3d-fallback');
            return;
        }

        // Setup Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 6);

        const renderer = new THREE.WebGLRenderer({
            antialias: window.innerWidth > 768,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // === CENTRAL AI CORE ===
        const coreGeometry = new THREE.IcosahedronGeometry(0.6, 2);
        const coreMaterial = new THREE.MeshBasicMaterial({
            color: HERO3D_CONFIG.colors.core,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        // Inner core solid
        const innerCoreGeo = new THREE.IcosahedronGeometry(0.35, 1);
        const innerCoreMat = new THREE.MeshBasicMaterial({
            color: HERO3D_CONFIG.colors.coreGlow,
            transparent: true,
            opacity: 0.3
        });
        const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
        scene.add(innerCore);

        // Core glow sprite
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = 128;
        glowCanvas.height = 128;
        const glowCtx = glowCanvas.getContext('2d');
        const gradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.6)');
        gradient.addColorStop(0.4, 'rgba(139, 92, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
        glowCtx.fillStyle = gradient;
        glowCtx.fillRect(0, 0, 128, 128);
        const glowTexture = new THREE.CanvasTexture(glowCanvas);
        const glowSprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0.8 })
        );
        glowSprite.scale.set(3, 3, 1);
        scene.add(glowSprite);

        // === ORBITAL RINGS ===
        const rings = [];
        const ringConfigs = [
            { radius: 1.5, color: HERO3D_CONFIG.colors.ring1, tilt: [0.3, 0, 0], speed: 0.003 },
            { radius: 2.2, color: HERO3D_CONFIG.colors.ring2, tilt: [0, 0, 0.5], speed: -0.002 },
            { radius: 3.0, color: HERO3D_CONFIG.colors.ring3, tilt: [-0.2, 0.3, 0], speed: 0.0015 }
        ];

        ringConfigs.forEach(cfg => {
            const ringGeo = new THREE.RingGeometry(cfg.radius - 0.01, cfg.radius + 0.01, 80);
            const ringMat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.25
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.set(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
            ring.userData = { speed: cfg.speed };
            scene.add(ring);
            rings.push(ring);
        });

        // === DATA NODES ON RINGS ===
        const nodes = [];
        const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        
        for (let i = 0; i < HERO3D_CONFIG.nodeCount; i++) {
            const ringIdx = i % ringConfigs.length;
            const angle = (i / HERO3D_CONFIG.nodeCount) * Math.PI * 2;
            const radius = ringConfigs[ringIdx].radius;
            const color = HERO3D_CONFIG.colors.nodes[ringIdx];
            
            const nodeMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.3,
                Math.sin(angle) * radius * 0.7
            );
            node.userData = { angle: angle, radius: radius, ringIdx: ringIdx, speed: ringConfigs[ringIdx].speed * 1.2 };
            scene.add(node);
            nodes.push(node);

            // Node glow
            const nGlowSprite = new THREE.Sprite(
                new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0.3 })
            );
            nGlowSprite.scale.set(0.4, 0.4, 1);
            node.add(nGlowSprite);
        }

        // === CONNECTION LINES (core to nodes) ===
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.08
        });

        const connectionLines = [];
        nodes.forEach(node => {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                node.position.clone()
            ]);
            const line = new THREE.Line(lineGeo, lineMaterial);
            scene.add(line);
            connectionLines.push({ line, node });
        });

        // === FLOATING PARTICLES ===
        const particlePositions = new Float32Array(HERO3D_CONFIG.particleCount * 3);
        const particleColors = new Float32Array(HERO3D_CONFIG.particleCount * 3);
        const particleSpeeds = [];

        for (let i = 0; i < HERO3D_CONFIG.particleCount; i++) {
            particlePositions[i * 3] = (Math.random() - 0.5) * 10;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
            
            const color = new THREE.Color(
                HERO3D_CONFIG.colors.particles[Math.floor(Math.random() * HERO3D_CONFIG.colors.particles.length)]
            );
            particleColors[i * 3] = color.r;
            particleColors[i * 3 + 1] = color.g;
            particleColors[i * 3 + 2] = color.b;
            
            particleSpeeds.push({
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.002
            });
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // === MOUSE PARALLAX ===
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            HERO3D_CONFIG.mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            HERO3D_CONFIG.mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        // === SCROLL DEPTH ===
        window.addEventListener('scroll', () => {
            HERO3D_CONFIG.scrollY = window.scrollY;
        }, { passive: true });

        // === VISIBILITY ===
        document.addEventListener('visibilitychange', () => {
            HERO3D_CONFIG.isVisible = !document.hidden;
        });

        // === RESIZE ===
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }, 150);
        });

        // === ANIMATION LOOP ===
        let time = 0;

        function animate() {
            requestAnimationFrame(animate);

            if (!HERO3D_CONFIG.isVisible) return;
            if (HERO3D_CONFIG.isReducedMotion) {
                renderer.render(scene, camera);
                return;
            }

            time += 0.01;

            // Smooth mouse follow
            HERO3D_CONFIG.mouse.x += (HERO3D_CONFIG.mouse.targetX - HERO3D_CONFIG.mouse.x) * 0.03;
            HERO3D_CONFIG.mouse.y += (HERO3D_CONFIG.mouse.targetY - HERO3D_CONFIG.mouse.y) * 0.03;

            // Camera parallax
            camera.position.x = HERO3D_CONFIG.mouse.x * 0.5;
            camera.position.y = -HERO3D_CONFIG.mouse.y * 0.3;
            
            // Scroll depth
            const scrollFactor = Math.min(HERO3D_CONFIG.scrollY / 800, 1);
            camera.position.z = 6 + scrollFactor * 3;
            camera.lookAt(0, 0, 0);

            // Rotate core
            core.rotation.x += 0.002;
            core.rotation.y += 0.003;
            innerCore.rotation.x -= 0.003;
            innerCore.rotation.y -= 0.002;

            // Pulse core
            const pulse = 1 + Math.sin(time * 2) * 0.05;
            core.scale.set(pulse, pulse, pulse);
            glowSprite.material.opacity = 0.5 + Math.sin(time * 1.5) * 0.2;

            // Rotate rings
            rings.forEach(ring => {
                ring.rotation.z += ring.userData.speed;
            });

            // Animate nodes along orbits
            nodes.forEach(node => {
                node.userData.angle += node.userData.speed;
                const a = node.userData.angle;
                const r = node.userData.radius;
                const tilt = ringConfigs[node.userData.ringIdx].tilt;
                
                node.position.x = Math.cos(a) * r;
                node.position.y = Math.sin(a) * r * 0.3 + Math.sin(a + tilt[0]) * r * 0.2;
                node.position.z = Math.sin(a) * r * 0.7;

                // Pulse nodes
                const np = 0.8 + Math.sin(time * 3 + node.userData.angle) * 0.2;
                node.material.opacity = np;
            });

            // Update connection lines
            connectionLines.forEach(({ line, node }) => {
                const positions = line.geometry.attributes.position.array;
                positions[3] = node.position.x;
                positions[4] = node.position.y;
                positions[5] = node.position.z;
                line.geometry.attributes.position.needsUpdate = true;
            });

            // Animate particles
            const pos = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < HERO3D_CONFIG.particleCount; i++) {
                pos[i * 3] += particleSpeeds[i].x;
                pos[i * 3 + 1] += particleSpeeds[i].y;
                pos[i * 3 + 2] += particleSpeeds[i].z;

                // Wrap around
                if (Math.abs(pos[i * 3]) > 5) particleSpeeds[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > 4) particleSpeeds[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > 3) particleSpeeds[i].z *= -1;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;

            // Fade out on scroll
            scene.children.forEach(child => {
                if (child.material && child.material.opacity !== undefined) {
                    // don't override base opacity, just reduce
                }
            });
            renderer.domElement.style.opacity = Math.max(1 - scrollFactor * 0.7, 0.3);

            renderer.render(scene, camera);
        }

        animate();
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHero3D);
    } else {
        initHero3D();
    }

    window.initHero3D = initHero3D;
})();
