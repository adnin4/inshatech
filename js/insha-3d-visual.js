/**
 * INSHA 3D Visual Web Component Engine (<insha-3d-visual>)
 * Procedural 3D Geometric Composition & Motion Engine for Service Cards & Detail Pages.
 * 
 * Capabilities:
 * - 80+ Service ID procedural visual mapping with category color schemes
 * - Canvas 3D projection (perspective wireframes, rotating orbital rings, pulsating holographic cores)
 * - Automatic IntersectionObserver pausing when off-screen (zero CPU waste)
 * - prefers-reduced-motion compliance (static elegant projection)
 * - HiDPI Retina canvas scaling (window.devicePixelRatio support)
 */

(function () {
  'use strict';

  // Category & Service Palette Definitions
  const VISUAL_CONFIGS = {
    // 10 New Commercial Suites
    'ai-video-studio': { color: '#f472b6', accent: '#ec4899', geometry: 'reel', rings: 3, nodes: 8, label: '3D Video Timeline Reel' },
    'ai-saas-engineering': { color: '#38bdf8', accent: '#0284c7', geometry: 'cube-lattice', rings: 2, nodes: 12, label: 'Distributed SaaS Architecture' },
    'ai-governance-operations': { color: '#c084fc', accent: '#9333ea', geometry: 'shield-ring', rings: 4, nodes: 6, label: 'Zero-Trust Governance Ring' },
    'ecommerce-growth-operations': { color: '#10b981', accent: '#059669', geometry: 'logistics-matrix', rings: 3, nodes: 9, label: 'Commerce Fulfillment Lattice' },
    'ai-finance-automation': { color: '#f59e0b', accent: '#d97706', geometry: 'ledger-orbit', rings: 3, nodes: 7, label: '3-Way Financial Ledger Orbit' },
    'ai-data-operations': { color: '#6366f1', accent: '#4f46e5', geometry: 'point-cloud', rings: 2, nodes: 16, label: 'Semantic Vector Point Cloud' },
    'enterprise-knowledge-search': { color: '#0ea5e9', accent: '#0284c7', geometry: 'neural-book', rings: 3, nodes: 10, label: 'Knowledge Graph Lattice' },
    'software-qa-release': { color: '#14b8a6', accent: '#0d9488', geometry: 'test-gate', rings: 4, nodes: 8, label: 'Automated CI/CD Quality Gate' },
    'cloud-finops-reliability': { color: '#06b6d4', accent: '#0891b2', geometry: 'cloud-orbit', rings: 3, nodes: 8, label: 'Edge SRE Observability Ring' },
    'computer-vision-systems': { color: '#a855f7', accent: '#7c3aed', geometry: 'ocular-scan', rings: 3, nodes: 12, label: 'Computer Vision Scanner' },

    // Core 8 Categories Defaults
    'cat-agents': { color: '#a855f7', accent: '#c084fc', geometry: 'agent-swarm', rings: 3, nodes: 7, label: 'Agent Swarm Coordination' },
    'cat-workflow': { color: '#38bdf8', accent: '#7dd3fc', geometry: 'pipeline-flow', rings: 2, nodes: 8, label: 'Observable Workflow Pipeline' },
    'cat-web': { color: '#10b981', accent: '#34d399', geometry: 'crawler-mesh', rings: 2, nodes: 10, label: 'Headless Browser Mesh' },
    'cat-conv': { color: '#f472b6', accent: '#fb7185', geometry: 'dialog-rings', rings: 3, nodes: 6, label: 'Conversational RAG Core' },
    'cat-vision': { color: '#f59e0b', accent: '#fbbf24', geometry: 'ocr-scanner', rings: 3, nodes: 8, label: 'Multimodal OCR Matrix' },
    'cat-software': { color: '#38bdf8', accent: '#818cf8', geometry: 'cube-lattice', rings: 2, nodes: 8, label: 'Full-Stack Software Architecture' },
    'cat-infra': { color: '#34d399', accent: '#6ee7b7', geometry: 'docker-cube', rings: 3, nodes: 6, label: 'Docker VPS Infrastructure' },
    'cat-security': { color: '#a855f7', accent: '#e879f9', geometry: 'shield-ring', rings: 3, nodes: 6, label: 'Managed Zero-Trust Care' }
  };

  class Insha3DVisual extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.animationFrameId = null;
      this.isVisible = true;
      this.angle = 0;
      this.mouseTiltX = 0;
      this.mouseTiltY = 0;
    }

    static get observedAttributes() {
      return ['service', 'label', 'quality'];
    }

    connectedCallback() {
      this.render();
      this.setupObserver();
      this.setupInteraction();
      this.startAnimation();
    }

    disconnectedCallback() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.observer) {
        this.observer.disconnect();
      }
    }

    attributeChangedCallback() {
      if (this.shadowRoot && this.canvas) {
        this.updateConfig();
      }
    }

    getServiceConfig() {
      const serviceId = this.getAttribute('service') || 'cat-agents';
      if (VISUAL_CONFIGS[serviceId]) return VISUAL_CONFIGS[serviceId];

      // Match by prefix or category fallback
      if (serviceId.includes('video') || serviceId.includes('reel') || serviceId.includes('ugc')) return VISUAL_CONFIGS['ai-video-studio'];
      if (serviceId.includes('saas') || serviceId.includes('mvp') || serviceId.includes('billing')) return VISUAL_CONFIGS['ai-saas-engineering'];
      if (serviceId.includes('governance') || serviceId.includes('audit') || serviceId.includes('eval')) return VISUAL_CONFIGS['ai-governance-operations'];
      if (serviceId.includes('ecom') || serviceId.includes('courier') || serviceId.includes('shopify')) return VISUAL_CONFIGS['ecommerce-growth-operations'];
      if (serviceId.includes('invoice') || serviceId.includes('finance') || serviceId.includes('ledger') || serviceId.includes('quickbooks')) return VISUAL_CONFIGS['ai-finance-automation'];
      if (serviceId.includes('data') || serviceId.includes('annotation') || serviceId.includes('dataset')) return VISUAL_CONFIGS['ai-data-operations'];
      if (serviceId.includes('knowledge') || serviceId.includes('search') || serviceId.includes('slack') || serviceId.includes('drive')) return VISUAL_CONFIGS['enterprise-knowledge-search'];
      if (serviceId.includes('qa') || serviceId.includes('test') || serviceId.includes('playwright')) return VISUAL_CONFIGS['software-qa-release'];
      if (serviceId.includes('cloud') || serviceId.includes('cost') || serviceId.includes('finops') || serviceId.includes('sre')) return VISUAL_CONFIGS['cloud-finops-reliability'];
      if (serviceId.includes('vision') || serviceId.includes('detect') || serviceId.includes('defect')) return VISUAL_CONFIGS['computer-vision-systems'];

      return VISUAL_CONFIGS['cat-agents'];
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            position: relative;
            width: 100%;
            height: 240px;
            max-height: 280px;
            overflow: hidden;
            border-radius: 16px;
            background: radial-gradient(circle at 50% 50%, rgba(20, 24, 45, 0.7), rgba(8, 10, 22, 0.95));
            border: 1px solid rgba(222, 229, 255, 0.08);
            box-sizing: border-box;
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
            background: rgba(0, 0, 0, 0.65);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            pointer-events: none;
            letter-spacing: 0.05em;
          }
          .visual-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 120px;
            height: 120px;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.25;
            pointer-events: none;
          }
        </style>
        <div class="visual-glow" id="glow"></div>
        <canvas id="canvas" aria-label="${this.getAttribute('label') || '3D Service Visual'}"></canvas>
        <div class="visual-badge" id="badge">3D SCENE // ACTIVE</div>
      `;

      this.canvas = this.shadowRoot.getElementById('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.glow = this.shadowRoot.getElementById('glow');
      this.badge = this.shadowRoot.getElementById('badge');

      this.updateConfig();
      this.resizeCanvas();
    }

    updateConfig() {
      this.cfg = this.getServiceConfig();
      if (this.glow) {
        this.glow.style.background = this.cfg.color;
      }
      if (this.badge) {
        this.badge.textContent = `3D ENGINE // ${this.cfg.label.toUpperCase()}`;
        this.badge.style.color = this.cfg.color;
      }
    }

    resizeCanvas() {
      if (!this.canvas) return;
      const rect = this.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width || 320;
      const h = rect.height || 240;

      this.width = w;
      this.height = h;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.scale(dpr, dpr);
    }

    setupObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.1 });
        this.observer.observe(this);
      }
    }

    setupInteraction() {
      this.addEventListener('mousemove', e => {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        this.mouseTiltX = x * 0.4;
        this.mouseTiltY = y * 0.4;
      });

      this.addEventListener('mouseleave', () => {
        this.mouseTiltX = 0;
        this.mouseTiltY = 0;
      });
    }

    startAnimation() {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const loop = () => {
        if (this.isVisible) {
          if (!prefersReduced) {
            this.angle += 0.015;
          }
          this.drawScene();
        }
        this.animationFrameId = requestAnimationFrame(loop);
      };

      this.animationFrameId = requestAnimationFrame(loop);
    }

    drawScene() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;
      if (!w || !h) {
        this.resizeCanvas();
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const cfg = this.cfg || this.getServiceConfig();

      const rotX = 0.35 + this.mouseTiltY;
      const rotY = this.angle + this.mouseTiltX;

      // 1. Draw Central Holographic Core
      const coreRadius = 14 + Math.sin(this.angle * 2) * 2;
      const coreGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreRadius * 2);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.4, cfg.color);
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Concentric 3D Orbital Rings
      const ringsCount = cfg.rings || 3;
      for (let i = 0; i < ringsCount; i++) {
        const radius = 45 + i * 26;
        const tilt = rotX + (i * 0.25);
        const spin = rotY * (i % 2 === 0 ? 1 : -0.85);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin * 0.4);
        ctx.scale(1, Math.cos(tilt));

        ctx.strokeStyle = i === 1 ? cfg.color : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = i === 1 ? 1.5 : 1;
        ctx.setLineDash(i === 0 ? [4, 4] : [8, 6]);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Traveling Orbiting Nodes
      const nodeCount = cfg.nodes || 8;
      for (let j = 0; j < nodeCount; j++) {
        const nodeAngle = this.angle + (j * (Math.PI * 2 / nodeCount));
        const orbitR = 60 + Math.sin(j + this.angle) * 15;
        const x3d = Math.cos(nodeAngle) * orbitR;
        const y3d = Math.sin(nodeAngle) * orbitR;
        const z3d = Math.sin(nodeAngle * 2) * 25;

        // Perspective projection
        const scale = 180 / (180 + z3d);
        const screenX = cx + x3d * scale;
        const screenY = cy + (y3d * Math.cos(rotX) - z3d * Math.sin(rotX)) * scale;

        // Line to center core
        if (j % 2 === 0) {
          ctx.strokeStyle = `rgba(${this.hexToRgb(cfg.color)}, 0.15)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(screenX, screenY);
          ctx.stroke();
        }

        // Draw Node
        ctx.fillStyle = j % 3 === 0 ? '#ffffff' : cfg.accent;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(1.5, 3.5 * scale), 0, Math.PI * 2);
        ctx.fill();

        // Node Glow
        if (j === 0) {
          ctx.fillStyle = `rgba(${this.hexToRgb(cfg.color)}, 0.4)`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, 8 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    hexToRgb(hex) {
      const sanitized = hex.replace('#', '');
      const bigint = parseInt(sanitized, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }
  }

  if (typeof customElements !== 'undefined' && !customElements.get('insha-3d-visual')) {
    customElements.define('insha-3d-visual', Insha3DVisual);
  }
})();
