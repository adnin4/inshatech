/**
 * IINSHA cinematic motion layer
 * Self-contained WebGL 1 orbital animation, scroll reveal and service discovery.
 * No remote Three.js, image or video dependency; all geometry is generated locally.
 */
(function () {
  'use strict';

  const READY = () => {
    initOrbitalHero();
    initSectionReveal();
    initServiceSearch();
  };

  function initOrbitalHero() {
    const container = document.getElementById('hero3d-container');
    const canvas = document.getElementById('iinsha-hero-canvas');
    if (!container || !canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'low-power'
    });
    if (!gl) {
      container.classList.add('diagram-webgl-fallback');
      return;
    }

    const vertexSource = `
      attribute vec2 a_position;
      attribute vec3 a_color;
      attribute float a_size;
      attribute float a_alpha;
      uniform float u_pointMode;
      varying vec3 v_color;
      varying float v_alpha;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
        v_color = a_color;
        v_alpha = a_alpha;
      }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform float u_pointMode;
      varying vec3 v_color;
      varying float v_alpha;
      void main() {
        if (u_pointMode > 0.5) {
          vec2 p = (gl_PointCoord - vec2(0.5)) * 2.0;
          float r = length(p);
          if (r > 1.0) discard;
          float sphere = sqrt(max(0.0, 1.0 - r * r));
          float highlight = pow(max(0.0, 1.0 - length(p - vec2(-0.28, 0.34)) * 1.55), 3.0);
          float rim = smoothstep(1.0, 0.42, r);
          vec3 shade = v_color * (0.34 + sphere * 0.78) + vec3(0.32, 0.36, 0.52) * highlight * 0.5;
          gl_FragColor = vec4(shade, v_alpha * rim);
        } else {
          gl_FragColor = vec4(v_color, v_alpha);
        }
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('WebGL shader allocation failed');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || 'Shader compilation failed';
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    let program;
    let buffer;
    let locations;
    try {
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error('WebGL program allocation failed');
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'WebGL program linking failed');
      }
      buffer = gl.createBuffer();
      if (!buffer) throw new Error('WebGL vertex buffer allocation failed');
      locations = {
        position: gl.getAttribLocation(program, 'a_position'),
        color: gl.getAttribLocation(program, 'a_color'),
        size: gl.getAttribLocation(program, 'a_size'),
        alpha: gl.getAttribLocation(program, 'a_alpha'),
        pointMode: gl.getUniformLocation(program, 'u_pointMode')
      };
    } catch (error) {
      container.classList.add('diagram-webgl-fallback');
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = window.matchMedia('(max-width: 700px)');
    const starCount = smallScreen.matches ? 42 : 86;
    const stars = [];
    let width = 1;
    let height = 1;
    let pixelRatio = 1;
    let elapsed = 0;
    let lastFrame = 0;
    let animationFrame = 0;
    let visible = true;
    let destroyed = false;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const rings = [
      { radius: 1.05, tiltX: .52, tiltY: .08, speed: .20, color: [0.38, 0.78, 0.89], alpha: .25 },
      { radius: 1.48, tiltX: -.36, tiltY: .48, speed: -.13, color: [0.62, 0.55, 0.98], alpha: .22 },
      { radius: 1.92, tiltX: .18, tiltY: -.36, speed: .075, color: [0.50, 0.83, 0.73], alpha: .16 }
    ];
    const planets = [
      { ring: 0, phase: .5, size: 12, color: [0.42, 0.82, 0.92] },
      { ring: 0, phase: 3.2, size: 8, color: [0.87, 0.61, 0.49] },
      { ring: 1, phase: 1.85, size: 19, color: [0.58, 0.52, 0.95] },
      { ring: 1, phase: 4.6, size: 10, color: [0.49, 0.84, 0.72] },
      { ring: 2, phase: 2.5, size: 14, color: [0.87, 0.72, 0.47] }
    ];

    let seed = 9137;
    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (random() - .5) * 7.3,
        y: (random() - .5) * 4.5,
        z: (random() - .5) * 4.5,
        size: 1 + random() * 1.7,
        alpha: .18 + random() * .38,
        drift: .08 + random() * .22
      });
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, smallScreen.matches ? 1.25 : 1.6);
      canvas.width = Math.max(1, Math.round(width * pixelRatio));
      canvas.height = Math.max(1, Math.round(height * pixelRatio));
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (reducedMotion.matches) render(0);
    }

    function rotatePoint(x, y, z, angle, tiltX, tiltY) {
      const ca = Math.cos(angle), sa = Math.sin(angle);
      const x1 = x * ca - z * sa;
      const z1 = x * sa + z * ca;
      const cx = Math.cos(tiltX), sx = Math.sin(tiltX);
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const cy = Math.cos(tiltY), sy = Math.sin(tiltY);
      return {
        x: x1 * cy + z2 * sy,
        y: y2,
        z: -x1 * sy + z2 * cy
      };
    }

    function project(point) {
      const p = rotatePoint(point.x, point.y, point.z, pointer.y * .12, .04 + pointer.x * .08, pointer.y * .06);
      const camera = 5.5 - p.z;
      const focal = 2.45;
      const aspect = width / height;
      return [
        (p.x * focal / camera) / Math.max(.55, aspect),
        (p.y * focal / camera)
      ];
    }

    function vertex(x, y, color, size, alpha) {
      const p = project({ x, y, z: 0 });
      return [p[0], p[1], color[0], color[1], color[2], size * pixelRatio, alpha];
    }

    function ringVertices(ring, time) {
      const out = [];
      const segments = 150;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const rotated = rotatePoint(
          Math.cos(angle) * ring.radius,
          Math.sin(angle) * ring.radius,
          0,
          time * ring.speed,
          ring.tiltX,
          ring.tiltY
        );
        const p = project(rotated);
        out.push(p[0], p[1], ring.color[0], ring.color[1], ring.color[2], 1, ring.alpha);
      }
      return out;
    }

    function pointVertices(time) {
      const out = [];
      for (const star of stars) {
        const z = star.z + Math.sin(time * star.drift + star.x) * .12;
        const p = project({ x: star.x + pointer.x * .025, y: star.y + pointer.y * .025, z });
        out.push(p[0], p[1], .68, .75, .88, star.size * pixelRatio, star.alpha);
      }
      for (const planet of planets) {
        const ring = rings[planet.ring];
        const angle = planet.phase + time * ring.speed * 2.15;
        const point = rotatePoint(Math.cos(angle) * ring.radius, Math.sin(angle) * ring.radius, 0, time * ring.speed, ring.tiltX, ring.tiltY);
        const p = project(point);
        out.push(p[0], p[1], planet.color[0], planet.color[1], planet.color[2], planet.size * pixelRatio, .96);
      }
      const core = project({ x: 0, y: 0, z: 0 });
      const pulse = 1 + Math.sin(time * 1.25) * .045;
      out.push(core[0], core[1], .67, .62, 1.0, 66 * pixelRatio * pulse, .96);
      return out;
    }

    function draw(data, mode, primitive) {
      if (!data.length) return;
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
      const stride = 7 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(locations.position);
      gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(locations.color);
      gl.vertexAttribPointer(locations.color, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(locations.size);
      gl.vertexAttribPointer(locations.size, 1, gl.FLOAT, false, stride, 5 * Float32Array.BYTES_PER_ELEMENT);
      gl.enableVertexAttribArray(locations.alpha);
      gl.vertexAttribPointer(locations.alpha, 1, gl.FLOAT, false, stride, 6 * Float32Array.BYTES_PER_ELEMENT);
      gl.uniform1f(locations.pointMode, mode);
      gl.drawArrays(primitive, 0, data.length / 7);
    }

    function render(timeSeconds) {
      if (destroyed) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      rings.forEach(ring => draw(ringVertices(ring, timeSeconds), 0, gl.LINE_STRIP));
      draw(pointVertices(timeSeconds), 1, gl.POINTS);
    }

    function frame(timestamp) {
      if (destroyed || document.hidden || !visible || reducedMotion.matches) {
        animationFrame = 0;
        return;
      }
      const delta = lastFrame ? Math.min(.05, (timestamp - lastFrame) / 1000) : 0;
      lastFrame = timestamp;
      elapsed += delta;
      pointer.x += (pointer.tx - pointer.x) * .035;
      pointer.y += (pointer.ty - pointer.y) * .035;
      render(elapsed);
      animationFrame = window.requestAnimationFrame(frame);
    }

    function start() {
      if (destroyed || reducedMotion.matches || document.hidden || !visible || animationFrame) return;
      lastFrame = 0;
      animationFrame = window.requestAnimationFrame(frame);
    }
    function stop() {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      lastFrame = 0;
    }
    function pointerMove(event) {
      const rect = container.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      pointer.ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
    }
    function pointerLeave() { pointer.tx = 0; pointer.ty = 0; }

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (resizeObserver) resizeObserver.observe(container);
    else window.addEventListener('resize', resize, { passive: true });
    container.addEventListener('pointermove', pointerMove, { passive: true });
    container.addEventListener('pointerleave', pointerLeave, { passive: true });
    const visibilityObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(entries => {
          visible = Boolean(entries[0] && entries[0].isIntersecting);
          if (visible) start(); else stop();
        }, { threshold: .03 })
      : null;
    if (visibilityObserver) visibilityObserver.observe(container);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else if (reducedMotion.matches) render(elapsed);
      else start();
    });
    reducedMotion.addEventListener?.('change', event => {
      if (event.matches) { stop(); render(elapsed); }
      else start();
    });

    resize();
    render(0);
    if (!reducedMotion.matches) start();
    window.addEventListener('pagehide', () => {
      destroyed = true;
      stop();
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
    }, { once: true });
  }

  function initSectionReveal() {
    const body = document.body;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;
    const targets = document.querySelectorAll(
      'main > section:not(#hero), .diagram-bento-card, #services .cat-overview-card, .section-header'
    );
    if (!targets.length) return;
    body.classList.add('has-diagram-motion');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .10, rootMargin: '0px 0px -5% 0px' });
    targets.forEach((element, index) => {
      element.setAttribute('data-diagram-reveal', '');
      element.style.setProperty('--diagram-order', String(Math.min(index % 6, 5)));
      observer.observe(element);
    });
  }

  function initServiceSearch() {
    const input = document.getElementById('service-live-search');
    const clear = document.getElementById('service-live-search-clear');
    const meta = document.getElementById('service-live-search-meta');
    const nav = document.querySelector('#services .service-nav-tabs');
    const panels = Array.from(document.querySelectorAll('#services .service-panel'));
    if (!input || !panels.length) return;

    const cards = panels.flatMap(panel => Array.from(panel.querySelectorAll('.service-item-card')));
    const total = cards.length;

    function reset() {
      panels.forEach(panel => {
        panel.classList.remove('search-visible');
        panel.querySelectorAll('.service-item-card').forEach(card => { card.hidden = false; });
      });
      if (nav) nav.hidden = false;
      document.getElementById('services')?.classList.remove('service-searching');
      if (clear) clear.hidden = true;
      if (meta) meta.textContent = total ? total + ' services across ' + panels.length + ' categories' : 'Browse service categories';
    }

    function search() {
      const query = input.value.trim().toLocaleLowerCase();
      if (!query) { reset(); return; }
      let count = 0;
      panels.forEach(panel => {
        let panelCount = 0;
        panel.querySelectorAll('.service-item-card').forEach(card => {
          const match = card.textContent.toLocaleLowerCase().includes(query);
          card.hidden = !match;
          if (match) { count++; panelCount++; }
        });
        panel.classList.toggle('search-visible', panelCount > 0);
      });
      if (nav) nav.hidden = true;
      document.getElementById('services')?.classList.add('service-searching');
      if (clear) clear.hidden = false;
      if (meta) meta.textContent = count + ' matching service' + (count === 1 ? '' : 's') + ' across ' + panels.filter(p => p.classList.contains('search-visible')).length + ' categories';
    }

    input.addEventListener('input', search);
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape' && input.value) {
        input.value = '';
        reset();
      }
    });
    clear?.addEventListener('click', () => {
      input.value = '';
      reset();
      input.focus();
    });
    nav?.addEventListener('click', event => {
      if (event.target.closest('.service-tab-btn') && input.value) {
        input.value = '';
        reset();
      }
    });
    reset();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', READY, { once: true });
  else READY();
})();
