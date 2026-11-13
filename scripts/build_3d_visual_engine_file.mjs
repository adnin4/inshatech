import fs from 'fs';

const configs = JSON.parse(fs.readFileSync('scripts/generated_visual_configs.json', 'utf8'));

const code = `/**
 * INSHA 3D Visual Web Component Engine (<insha-3d-visual>)
 * Authoritative Procedural 3D Geometric Composition & Motion Engine for Service Cards & Detail Pages.
 * 
 * Capabilities:
 * - 100% Manifest coverage for 80 microservices (svc-01..svc-80 + slugs), 10 commercial suites, 8 category defaults, legacy aliases.
 * - 13 Distinct Procedural 3D Geometric Topologies (neural-polyhedron, cube-lattice, video-reel, shield-gate, pipeline-flow, ledger-orbit, point-cloud, neural-book, test-gate, cloud-orbit, ocular-scan, dialog-rings, crawler-mesh).
 * - True Lifecycle Management: IntersectionObserver cancellation (zero CPU when off-screen).
 * - prefers-reduced-motion compliance: 1 pristine static perspective projection, zero CPU loop.
 * - visibilitychange tab pause / resume.
 * - ResizeObserver with devicePixelRatio retina sharpness.
 * - Interactive 3D mouse parallax tilt.
 */

(function () {
  'use strict';

  const VISUAL_CONFIGS = ${JSON.stringify(configs, null, 2)};

  class Insha3DVisual extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.animationFrameId = null;
      this.isVisible = false;
      this.angle = 0;
      this.mouseTiltX = 0;
      this.mouseTiltY = 0;
      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.prefersReducedMotion = false;
      this.resizeObserver = null;
      this.intersectionObserver = null;
      this.onVisibilityChange = this.handleVisibilityChange.bind(this);
      this.onReducedMotionChange = this.handleReducedMotionChange.bind(this);
    }

    static get observedAttributes() {
      return ['service', 'label', 'quality'];
    }

    connectedCallback() {
      this.checkReducedMotion();
      this.render();
      this.setupObservers();
      this.setupInteraction();
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    disconnectedCallback() {
      this.stopAnimation();
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect();
        this.intersectionObserver = null;
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
      if (this.reducedMotionMediaQuery && this.reducedMotionMediaQuery.removeEventListener) {
        this.reducedMotionMediaQuery.removeEventListener('change', this.onReducedMotionChange);
      }
    }

    attributeChangedCallback() {
      if (this.shadowRoot && this.canvas) {
        this.updateConfig();
        if (this.prefersReducedMotion) {
          this.drawScene();
        }
      }
    }

    checkReducedMotion() {
      if (typeof window !== 'undefined' && window.matchMedia) {
        this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.prefersReducedMotion = this.reducedMotionMediaQuery.matches;
        if (this.reducedMotionMediaQuery.addEventListener) {
          this.reducedMotionMediaQuery.addEventListener('change', this.onReducedMotionChange);
        }
      }
    }

    handleReducedMotionChange(e) {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.stopAnimation();
        this.drawScene();
      } else if (this.isVisible && !document.hidden) {
        this.startAnimation();
      }
    }

    handleVisibilityChange() {
      if (document.hidden) {
        this.stopAnimation();
      } else if (this.isVisible && !this.prefersReducedMotion) {
        this.startAnimation();
      }
    }

    getServiceConfig() {
      const rawId = (this.getAttribute('service') || 'cat-agents').trim();
      if (VISUAL_CONFIGS[rawId]) return VISUAL_CONFIGS[rawId];

      const lower = rawId.toLowerCase();
      if (VISUAL_CONFIGS[lower]) return VISUAL_CONFIGS[lower];

      // Keyword based heuristic fallback
      if (lower.includes('video') || lower.includes('reel') || lower.includes('ugc')) return VISUAL_CONFIGS['ai-video-studio'];
      if (lower.includes('saas') || lower.includes('mvp') || lower.includes('billing')) return VISUAL_CONFIGS['ai-saas-engineering'];
      if (lower.includes('governance') || lower.includes('audit') || lower.includes('eval') || lower.includes('soc2')) return VISUAL_CONFIGS['ai-governance-operations'];
      if (lower.includes('ecom') || lower.includes('courier') || lower.includes('shopify') || lower.includes('commerce')) return VISUAL_CONFIGS['ecommerce-growth-operations'];
      if (lower.includes('invoice') || lower.includes('finance') || lower.includes('ledger') || lower.includes('quickbooks')) return VISUAL_CONFIGS['ai-finance-automation'];
      if (lower.includes('data') || lower.includes('annotation') || lower.includes('dataset') || lower.includes('vector')) return VISUAL_CONFIGS['ai-data-operations'];
      if (lower.includes('knowledge') || lower.includes('search') || lower.includes('slack') || lower.includes('drive')) return VISUAL_CONFIGS['enterprise-knowledge-search'];
      if (lower.includes('qa') || lower.includes('test') || lower.includes('playwright') || lower.includes('cypress')) return VISUAL_CONFIGS['software-qa-release'];
      if (lower.includes('cloud') || lower.includes('cost') || lower.includes('finops') || lower.includes('sre') || lower.includes('docker')) return VISUAL_CONFIGS['cloud-finops-reliability'];
      if (lower.includes('vision') || lower.includes('detect') || lower.includes('defect') || lower.includes('ocr')) return VISUAL_CONFIGS['computer-vision-systems'];

      return VISUAL_CONFIGS['cat-agents'];
    }

    render() {
      this.shadowRoot.innerHTML = \`
        <style>
          :host {
            display: block;
            position: relative;
            width: 100%;
            height: 240px;
            max-height: 280px;
            overflow: hidden;
            border-radius: 16px;
            background: radial-gradient(circle at 50% 50%, rgba(20, 24, 45, 0.75), rgba(8, 10, 22, 0.96));
            border: 1px solid rgba(222, 229, 255, 0.09);
            box-sizing: border-box;
            user-select: none;
          }
          canvas {
            display: block;
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
          .visual-badge {
            position: absolute;
            bottom: 10px;
            left: 12px;
            font-family: var(--font-mono, monospace, monospace);
            font-size: 0.68rem;
            color: #94a3b8;
            background: rgba(0, 0, 0, 0.75);
            padding: 4px 9px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            pointer-events: none;
            letter-spacing: 0.05em;
            backdrop-filter: blur(4px);
          }
          .visual-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 140px;
            height: 140px;
            border-radius: 50%;
            filter: blur(45px);
            opacity: 0.22;
            pointer-events: none;
            transition: background 0.3s ease;
          }
          .visual-topology {
            position: absolute;
            top: 10px;
            right: 12px;
            font-family: var(--font-mono, monospace);
            font-size: 0.62rem;
            color: rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.04);
            padding: 2px 7px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            pointer-events: none;
            text-transform: uppercase;
          }
        </style>
        <div class="visual-glow" id="glow"></div>
        <div class="visual-topology" id="topology">TOPOLOGY // 3D</div>
        <canvas id="canvas" aria-label="\${this.getAttribute('label') || '3D Service Visual'}"></canvas>
        <div class="visual-badge" id="badge">3D SCENE // ACTIVE</div>
      \`;

      this.canvas = this.shadowRoot.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.glow = this.shadowRoot.getElementById('glow');
      this.badge = this.shadowRoot.getElementById('badge');
      this.topologyBadge = this.shadowRoot.getElementById('topology');

      this.updateConfig();
      this.resizeCanvas();
    }

    updateConfig() {
      this.cfg = this.getServiceConfig();
      if (this.glow) {
        this.glow.style.background = this.cfg.color;
      }
      if (this.badge) {
        const labelText = (this.getAttribute('label') || this.cfg.label || '3D SCENE').toUpperCase();
        this.badge.textContent = \`3D // \${labelText}\`;
        this.badge.style.color = this.cfg.color;
      }
      if (this.topologyBadge) {
        this.topologyBadge.textContent = (this.cfg.geometry || 'NEURAL-POLYHEDRON').toUpperCase();
      }
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(rect.width || 320, 100);
      const h = Math.max(rect.height || 240, 100);

      this.width = w;
      this.height = h;
      this.canvas.width = Math.floor(w * dpr);
      this.canvas.height = Math.floor(h * dpr);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);
    }

    setupObservers() {
      // 1. IntersectionObserver for true CPU pausing
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            const wasVisible = this.isVisible;
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !wasVisible) {
              if (this.prefersReducedMotion) {
                this.drawScene();
              } else if (!document.hidden) {
                this.startAnimation();
              }
            } else if (!this.isVisible && wasVisible) {
              this.stopAnimation();
            }
          });
        }, { threshold: 0.05 });
        this.intersectionObserver.observe(this);
      } else {
        this.isVisible = true;
        if (!this.prefersReducedMotion) this.startAnimation();
      }

      // 2. ResizeObserver for sharp rendering
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(() => {
          this.resizeCanvas();
          if (this.prefersReducedMotion || !this.animationFrameId) {
            this.drawScene();
          }
        });
        this.resizeObserver.observe(this);
      }
    }

    setupInteraction() {
      this.addEventListener('mousemove', e => {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        this.targetTiltX = x * 0.5;
        this.targetTiltY = y * 0.5;
      });

      this.addEventListener('mouseleave', () => {
        this.targetTiltX = 0;
        this.targetTiltY = 0;
      });
    }

    startAnimation() {
      if (this.animationFrameId || this.prefersReducedMotion) return;

      const loop = () => {
        if (!this.isVisible || document.hidden) {
          this.stopAnimation();
          return;
        }

        // Smooth tilt lerp
        this.mouseTiltX += (this.targetTiltX - this.mouseTiltX) * 0.1;
        this.mouseTiltY += (this.targetTiltY - this.mouseTiltY) * 0.1;
        this.angle += 0.015;

        this.drawScene();
        this.animationFrameId = requestAnimationFrame(loop);
      };

      this.animationFrameId = requestAnimationFrame(loop);
    }

    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    // ==========================================
    // 13 DISTINCT PROCEDURAL 3D RENDERERS
    // ==========================================

    drawScene() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      if (!ctx || !w || !h) {
        this.resizeCanvas();
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const cfg = this.cfg || this.getServiceConfig();
      const geom = cfg.geometry || 'neural-polyhedron';

      const rotX = 0.35 + this.mouseTiltY;
      const rotY = this.angle + this.mouseTiltX;

      // Dispatch to topology renderer
      switch (geom) {
        case 'neural-polyhedron':
          this.renderNeuralPolyhedron(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'cube-lattice':
          this.renderCubeLattice(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'video-reel':
          this.renderVideoReel(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'shield-gate':
        case 'shield-ring':
          this.renderShieldGate(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'pipeline-flow':
          this.renderPipelineFlow(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'ledger-orbit':
          this.renderLedgerOrbit(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'point-cloud':
          this.renderPointCloud(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'neural-book':
          this.renderNeuralBook(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'test-gate':
          this.renderTestGate(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'cloud-orbit':
        case 'docker-cube':
          this.renderCloudOrbit(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'ocular-scan':
        case 'ocr-scanner':
          this.renderOcularScan(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'dialog-rings':
          this.renderDialogRings(ctx, cx, cy, cfg, rotX, rotY);
          break;
        case 'crawler-mesh':
          this.renderCrawlerMesh(ctx, cx, cy, cfg, rotX, rotY);
          break;
        default:
          this.renderNeuralPolyhedron(ctx, cx, cy, cfg, rotX, rotY);
      }
    }

    // 1. NEURAL POLYHEDRON (3D Icosahedron / Octahedron Wireframe with Pulsing Vertices)
    renderNeuralPolyhedron(ctx, cx, cy, cfg, rotX, rotY) {
      const radius = 55;
      const phi = (1 + Math.sqrt(5)) / 2;
      const rawVerts = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
      ];

      const projVerts = rawVerts.map(v => {
        const norm = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
        const x0 = (v[0] / norm) * radius;
        const y0 = (v[1] / norm) * radius;
        const z0 = (v[2] / norm) * radius;
        return this.project3D(x0, y0, z0, rotX, rotY, cx, cy);
      });

      // Draw Edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.22)\`;
      for (let i = 0; i < projVerts.length; i++) {
        for (let j = i + 1; j < projVerts.length; j++) {
          const dx = rawVerts[i][0] - rawVerts[j][0];
          const dy = rawVerts[i][1] - rawVerts[j][1];
          const dz = rawVerts[i][2] - rawVerts[j][2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < 2.1) {
            ctx.beginPath();
            ctx.moveTo(projVerts[i].x, projVerts[i].y);
            ctx.lineTo(projVerts[j].x, projVerts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Pulsing Core
      this.drawPulsingCore(ctx, cx, cy, cfg.color, 12);

      // Draw Vertices
      projVerts.forEach((pv, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? cfg.color : cfg.accent;
        ctx.beginPath();
        ctx.arc(pv.x, pv.y, 3 * pv.scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 2. CUBE LATTICE (Distributed 3D Tesseract / Lattice with Connecting Struts)
    renderCubeLattice(ctx, cx, cy, cfg, rotX, rotY) {
      const s1 = 48; // outer box
      const s2 = 24; // inner box
      const outerVerts = [
        [-s1, -s1, -s1], [s1, -s1, -s1], [s1, s1, -s1], [-s1, s1, -s1],
        [-s1, -s1, s1], [s1, -s1, s1], [s1, s1, s1], [-s1, s1, s1]
      ].map(v => this.project3D(v[0], v[1], v[2], rotX, rotY, cx, cy));

      const innerVerts = [
        [-s2, -s2, -s2], [s2, -s2, -s2], [s2, s2, -s2], [-s2, s2, -s2],
        [-s2, -s2, s2], [s2, -s2, s2], [s2, s2, s2], [-s2, s2, s2]
      ].map(v => this.project3D(v[0], v[1], v[2], -rotX * 0.7, -rotY * 0.8, cx, cy));

      const edges = [
        [0,1],[1,2],[2,3],[3,0],
        [4,5],[5,6],[6,7],[7,4],
        [0,4],[1,5],[2,6],[3,7]
      ];

      // Draw Outer Cube
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.35)\`;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(outerVerts[a].x, outerVerts[a].y);
        ctx.lineTo(outerVerts[b].x, outerVerts[b].y);
        ctx.stroke();
      });

      // Draw Inner Cube
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.accent)}, 0.45)\`;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(innerVerts[a].x, innerVerts[a].y);
        ctx.lineTo(innerVerts[b].x, innerVerts[b].y);
        ctx.stroke();
      });

      // Struts connecting outer to inner
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([2, 4]);
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(outerVerts[i].x, outerVerts[i].y);
        ctx.lineTo(innerVerts[i].x, innerVerts[i].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      this.drawPulsingCore(ctx, cx, cy, cfg.color, 10);
    }

    // 3. VIDEO REEL (3D Cylindrical Filmstrip with Sweeping Playhead Scanner)
    renderVideoReel(ctx, cx, cy, cfg, rotX, rotY) {
      const radius = 60;
      const count = 10;
      const hSpan = 40;

      // Draw Upper and Lower Spiral Ribbons
      for (let ring = -1; ring <= 1; ring += 2) {
        ctx.beginPath();
        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.3)\`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i <= count * 2; i++) {
          const a = (i / count) * Math.PI + rotY;
          const x0 = Math.cos(a) * radius;
          const z0 = Math.sin(a) * radius;
          const y0 = ring * (hSpan / 2) + Math.sin(a * 2) * 6;
          const p = this.project3D(x0, y0, z0, rotX, 0, cx, cy);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

      // Draw Frames
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + rotY;
        const x0 = Math.cos(a) * radius;
        const z0 = Math.sin(a) * radius;
        const pTop = this.project3D(x0, -hSpan/2, z0, rotX, 0, cx, cy);
        const pBot = this.project3D(x0, hSpan/2, z0, rotX, 0, cx, cy);

        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.accent)}, 0.4)\`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pTop.x, pTop.y);
        ctx.lineTo(pBot.x, pBot.y);
        ctx.stroke();

        // Node sprocket
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pTop.x, pTop.y, 2 * pTop.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // Laser scanner playhead
      const scanX = cx + Math.sin(this.angle * 2) * (radius * 0.7);
      const scanGrad = ctx.createLinearGradient(scanX, cy - 45, scanX, cy + 45);
      scanGrad.addColorStop(0, 'transparent');
      scanGrad.addColorStop(0.5, '#ffffff');
      scanGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = scanGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, cy - 45);
      ctx.lineTo(scanX, cy + 45);
      ctx.stroke();
    }

    // 4. SHIELD GATE (Concentric 3D Hexagonal Zero-Trust Energy Barriers)
    renderShieldGate(ctx, cx, cy, cfg, rotX, rotY) {
      const rings = [62, 44, 26];
      rings.forEach((r, idx) => {
        const tilt = rotX + (idx * 0.2);
        const spin = (idx % 2 === 0 ? 1 : -1) * (rotY * 0.6);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin);
        ctx.scale(1, Math.cos(tilt));

        ctx.strokeStyle = idx === 0 ? cfg.color : (idx === 1 ? cfg.accent : '#ffffff');
        ctx.lineWidth = idx === 0 ? 1.8 : 1;
        ctx.setLineDash(idx === 1 ? [6, 4] : []);

        // Hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      // Deflector nodes
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rotY * 0.5;
        const x = cx + Math.cos(a) * 62;
        const y = cy + Math.sin(a) * 62 * Math.cos(rotX);
        ctx.fillStyle = cfg.accent;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      this.drawPulsingCore(ctx, cx, cy, cfg.color, 14);
    }

    // 5. PIPELINE FLOW (Cascading 3D Isometric Conduits with Data Flow Packets)
    renderPipelineFlow(ctx, cx, cy, cfg, rotX, rotY) {
      const pipes = 3;
      const length = 110;

      for (let p = 0; p < pipes; p++) {
        const yOffset = (p - 1) * 28;
        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.25)\`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = [];
        for (let step = 0; step <= 8; step++) {
          const t = (step / 8) - 0.5;
          const x0 = t * length;
          const z0 = Math.sin(t * 4 + rotY + p) * 22;
          const y0 = yOffset + Math.cos(t * 3 + p) * 10;
          const pt = this.project3D(x0, y0, z0, rotX, 0.4, cx, cy);
          points.push(pt);
          if (step === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Data Packets moving through pipe
        const packetT = ((this.angle * 0.8 + p * 0.33) % 1);
        const idx = Math.floor(packetT * (points.length - 1));
        if (points[idx]) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(points[idx].x, points[idx].y, 4 * points[idx].scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      this.drawPulsingCore(ctx, cx, cy, cfg.accent, 10);
    }

    // 6. LEDGER ORBIT (Interlocking 3-Way Gimbal Rings with Balancing Markers)
    renderLedgerOrbit(ctx, cx, cy, cfg, rotX, rotY) {
      const radius = 54;
      // 3 orthogonal rings
      const ringConfigs = [
        { rx: rotX, ry: rotY, color: cfg.color, dash: [] },
        { rx: rotX + Math.PI / 3, ry: -rotY * 0.9, color: cfg.accent, dash: [4, 4] },
        { rx: rotX - Math.PI / 3, ry: rotY * 1.2, color: '#f59e0b', dash: [8, 5] }
      ];

      ringConfigs.forEach(rc => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rc.ry * 0.5);
        ctx.scale(1, Math.cos(rc.rx));

        ctx.strokeStyle = rc.color;
        ctx.lineWidth = 1.4;
        ctx.setLineDash(rc.dash);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Audit Balance Markers (Golden / Amber Nodes)
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2 + rotY;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius * Math.cos(rotX);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      this.drawPulsingCore(ctx, cx, cy, '#fbbf24', 12);
    }

    // 7. POINT CLOUD (3D Semantic Vector Point Cloud with Dynamic Neighbors)
    renderPointCloud(ctx, cx, cy, cfg, rotX, rotY) {
      const points = [];
      const count = 22;
      for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2;
        const v = ((i % 5) / 5) * Math.PI - (Math.PI / 2);
        const r = 50 + Math.sin(i * 3 + this.angle) * 8;
        const x = Math.cos(u) * Math.cos(v) * r;
        const y = Math.sin(v) * r;
        const z = Math.sin(u) * Math.cos(v) * r;
        points.push(this.project3D(x, y, z, rotX, rotY, cx, cy));
      }

      // Proximity connection lines
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.18)\`;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 1200) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      points.forEach((p, idx) => {
        ctx.fillStyle = idx % 3 === 0 ? '#ffffff' : cfg.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.5, 3 * p.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      this.drawPulsingCore(ctx, cx, cy, cfg.accent, 9);
    }

    // 8. NEURAL BOOK (3D Hierarchical Knowledge Graph Tree Lattice)
    renderNeuralBook(ctx, cx, cy, cfg, rotX, rotY) {
      const root = this.project3D(0, -45, 0, rotX, rotY * 0.4, cx, cy);
      const branches = 4;
      const leavesPerBranch = 3;

      for (let b = 0; b < branches; b++) {
        const bAngle = (b / branches) * Math.PI * 2 + rotY * 0.5;
        const bx = Math.cos(bAngle) * 38;
        const bz = Math.sin(bAngle) * 38;
        const bNode = this.project3D(bx, 0, bz, rotX, 0, cx, cy);

        // Line root -> branch
        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.4)\`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(root.x, root.y);
        ctx.lineTo(bNode.x, bNode.y);
        ctx.stroke();

        // Branch node
        ctx.fillStyle = cfg.accent;
        ctx.beginPath();
        ctx.arc(bNode.x, bNode.y, 3.5 * bNode.scale, 0, Math.PI * 2);
        ctx.fill();

        for (let l = 0; l < leavesPerBranch; l++) {
          const lAngle = bAngle + ((l - 1) * 0.5);
          const lx = Math.cos(lAngle) * 62;
          const lz = Math.sin(lAngle) * 62;
          const lNode = this.project3D(lx, 35, lz, rotX, 0, cx, cy);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.beginPath();
          ctx.moveTo(bNode.x, bNode.y);
          ctx.lineTo(lNode.x, lNode.y);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(lNode.x, lNode.y, 2 * lNode.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      this.drawPulsingCore(ctx, root.x, root.y, cfg.color, 12);
    }

    // 9. TEST GATE (3D Automated Validation Scanner Gate with Depth Planes)
    renderTestGate(ctx, cx, cy, cfg, rotX, rotY) {
      const w = 55;
      const h = 42;

      // Outer Gate Frame
      const gateVerts = [
        [-w, -h, 0], [w, -h, 0], [w, h, 0], [-w, h, 0]
      ].map(v => this.project3D(v[0], v[1], v[2], rotX, rotY * 0.3, cx, cy));

      ctx.strokeStyle = cfg.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      gateVerts.forEach((gv, idx) => {
        if (idx === 0) ctx.moveTo(gv.x, gv.y);
        else ctx.lineTo(gv.x, gv.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Sweeping Laser Scanner Plane in Z-depth
      const zScan = Math.sin(this.angle * 2) * 35;
      const scanVerts = [
        [-w, -h, zScan], [w, -h, zScan], [w, h, zScan], [-w, h, zScan]
      ].map(v => this.project3D(v[0], v[1], v[2], rotX, rotY * 0.3, cx, cy));

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      scanVerts.forEach((sv, idx) => {
        if (idx === 0) ctx.moveTo(sv.x, sv.y);
        else ctx.lineTo(sv.x, sv.y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);

      // Green Pass Beacons
      [-w, w].forEach(xSign => {
        const beacon = this.project3D(xSign, -h, 0, rotX, rotY * 0.3, cx, cy);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(beacon.x, beacon.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      this.drawPulsingCore(ctx, cx, cy, '#10b981', 11);
    }

    // 10. CLOUD ORBIT (3D Sphere Wireframe with Edge Nodes & Telemetry Rings)
    renderCloudOrbit(ctx, cx, cy, cfg, rotX, rotY) {
      const radius = 52;
      // Latitudinal & Longitudinal rings
      for (let lat = -1; lat <= 1; lat++) {
        const rLat = radius * Math.cos(lat * 0.5);
        const yLat = radius * Math.sin(lat * 0.5);
        ctx.save();
        ctx.translate(cx, cy + yLat * Math.cos(rotX));
        ctx.scale(1, Math.cos(rotX));
        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.2)\`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, rLat, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Orbital Satellites
      const sats = 5;
      for (let s = 0; s < sats; s++) {
        const a = (s / sats) * Math.PI * 2 + rotY * 0.9;
        const x = Math.cos(a) * (radius + 14);
        const z = Math.sin(a) * (radius + 14);
        const y = Math.sin(a * 2) * 16;
        const pt = this.project3D(x, y, z, rotX, 0, cx, cy);

        ctx.fillStyle = s === 0 ? '#ffffff' : cfg.accent;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5 * pt.scale, 0, Math.PI * 2);
        ctx.fill();

        // Sync trail to center
        ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.12)\`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }

      this.drawPulsingCore(ctx, cx, cy, cfg.color, 13);
    }

    // 11. OCULAR SCAN (3D Computer Vision Aperture Cone with Floating Bounding Boxes)
    renderOcularScan(ctx, cx, cy, cfg, rotX, rotY) {
      // 3D Wireframe Frustum / Camera Cone
      const apex = this.project3D(0, 0, -50, rotX, rotY * 0.3, cx, cy);
      const baseW = 55;
      const baseH = 40;
      const baseZ = 45;
      const baseVerts = [
        [-baseW, -baseH, baseZ], [baseW, -baseH, baseZ],
        [baseW, baseH, baseZ], [-baseW, baseH, baseZ]
      ].map(v => this.project3D(v[0], v[1], v[2], rotX, rotY * 0.3, cx, cy));

      // Cone rays
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.22)\`;
      ctx.lineWidth = 1;
      baseVerts.forEach(bv => {
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(bv.x, bv.y);
        ctx.stroke();
      });

      // Base rectangle
      ctx.strokeStyle = cfg.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      baseVerts.forEach((bv, idx) => {
        if (idx === 0) ctx.moveTo(bv.x, bv.y);
        else ctx.lineTo(bv.x, bv.y);
      });
      ctx.closePath();
      ctx.stroke();

      // Floating target bounding box
      const targetBoxW = 20;
      const targetBoxH = 15;
      const tx = cx + Math.sin(this.angle) * 18;
      const ty = cy + Math.cos(this.angle * 1.5) * 12;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(tx - targetBoxW/2, ty - targetBoxH/2, targetBoxW, targetBoxH);

      // Center crosshair
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - 6, ty); ctx.lineTo(tx + 6, ty);
      ctx.moveTo(tx, ty - 6); ctx.lineTo(tx, ty + 6);
      ctx.stroke();
    }

    // 12. DIALOG RINGS (3D Harmonic Conversational Soundwave Rings)
    renderDialogRings(ctx, cx, cy, cfg, rotX, rotY) {
      const ringCount = 5;
      for (let i = 0; i < ringCount; i++) {
        const radius = 24 + i * 16;
        const ripple = Math.sin(this.angle * 3 - i * 0.6) * 4;
        const curR = Math.max(8, radius + ripple);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotY * 0.4 + (i * 0.15));
        ctx.scale(1, Math.cos(rotX + i * 0.1));

        ctx.strokeStyle = i === 1 ? cfg.color : \`rgba(\${this.hexToRgb(cfg.accent)}, \${0.7 - i * 0.12})\`;
        ctx.lineWidth = i === 1 ? 2 : 1;
        ctx.beginPath();
        ctx.arc(0, 0, curR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      this.drawPulsingCore(ctx, cx, cy, cfg.color, 14);
    }

    // 13. CRAWLER MESH (3D Geodesic Dome with Crawling Spider Nodes)
    renderCrawlerMesh(ctx, cx, cy, cfg, rotX, rotY) {
      const radius = 55;
      const rows = 4;
      const cols = 8;
      const meshVerts = [];

      for (let r = 0; r <= rows; r++) {
        const lat = (r / rows) * (Math.PI / 2);
        const y0 = Math.sin(lat) * radius - 20;
        const rRow = Math.cos(lat) * radius;

        const rowNodes = [];
        for (let c = 0; c < cols; c++) {
          const lon = (c / cols) * Math.PI * 2 + rotY * 0.6;
          const x0 = Math.cos(lon) * rRow;
          const z0 = Math.sin(lon) * rRow;
          rowNodes.push(this.project3D(x0, y0, z0, rotX, 0, cx, cy));
        }
        meshVerts.push(rowNodes);
      }

      // Draw Grid Lines
      ctx.strokeStyle = \`rgba(\${this.hexToRgb(cfg.color)}, 0.2)\`;
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const nextC = (c + 1) % cols;
          ctx.beginPath();
          ctx.moveTo(meshVerts[r][c].x, meshVerts[r][c].y);
          ctx.lineTo(meshVerts[r][nextC].x, meshVerts[r][nextC].y);
          ctx.lineTo(meshVerts[r+1][c].x, meshVerts[r+1][c].y);
          ctx.stroke();
        }
      }

      // Crawling nodes
      const crawlerIndex = Math.floor(this.angle * 2) % cols;
      const crawlerPt = meshVerts[1][crawlerIndex];
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(crawlerPt.x, crawlerPt.y, 4, 0, Math.PI * 2);
      ctx.fill();

      this.drawPulsingCore(ctx, cx, cy - 20, cfg.color, 11);
    }

    // Utility: 3D to 2D Perspective Projection
    project3D(x, y, z, rotX, rotY, cx, cy) {
      // Rotation around Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotation around X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const fov = 200;
      const scale = fov / (fov + z2 + 80);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale: Math.max(0.2, scale)
      };
    }

    // Utility: Pulsing Central Holographic Core
    drawPulsingCore(ctx, cx, cy, hexColor, baseRadius) {
      const pulse = Math.sin(this.angle * 2.5) * 2;
      const r = Math.max(4, baseRadius + pulse);
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 2.2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, hexColor);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    hexToRgb(hex) {
      if (!hex) return '168, 85, 247';
      const sanitized = hex.replace('#', '');
      const bigint = parseInt(sanitized, 16);
      if (isNaN(bigint)) return '168, 85, 247';
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return \`\${r}, \${g}, \${b}\`;
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('insha-3d-visual')) {
    customElements.define('insha-3d-visual', Insha3DVisual);
  }
})();
`;

fs.writeFileSync('js/insha-3d-visual.js', code, 'utf8');
console.log('Successfully wrote js/insha-3d-visual.js, size:', code.length);
