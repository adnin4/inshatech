/*
 * IINSHA Diagram-inspired motion layer — dependency-free WebGL2.
 * - Real 3D sphere meshes, perspective camera and orbital paths.
 * - 2D fallback if WebGL2 is unavailable.
 * - Intersection/visibility pause, capped DPR, reduced-motion support.
 * - Optional scroll reveal, gentle card tilt and service search.
 *
 * Usage:
 *   <canvas id="iinsha-diagram-scene" data-iinsha-motion-scene aria-hidden="true"></canvas>
 *   <script src="/js/iinsha-diagram-motion.js" defer></script>
 *   <script> IINSHA.DiagramMotion.init(); </script>
 */
(function (global) {
  'use strict';

  const NS = global.IINSHA = global.IINSHA || {};
  const CONFIG = Object.freeze({
    maxDpr: 1.6,
    fps: 45,
    orbitCount: 6,
    starCount: 190,
    revealThreshold: 0.13,
    tiltMax: 3.5
  });

  const sceneRegistry = new WeakMap();
  const enhancedRoots = new WeakSet();

  const PLANETS = Object.freeze([
    { name: 'Agents', radius: 1.35, size: .20, color: [0.53, 0.45, 1.00], speed: .26, phase: .4, tilt: .18 },
    { name: 'Automation', radius: 1.95, size: .15, color: [0.34, 0.73, 1.00], speed: -.19, phase: 2.2, tilt: -.23 },
    { name: 'Intelligence', radius: 2.58, size: .23, color: [0.93, 0.49, 0.72], speed: .145, phase: 4.5, tilt: .12 },
    { name: 'Infrastructure', radius: 3.25, size: .17, color: [0.40, 0.86, 0.84], speed: -.12, phase: 1.1, tilt: -.15 },
    { name: 'Integration', radius: 3.92, size: .13, color: [0.96, 0.70, 0.42], speed: .095, phase: 3.2, tilt: .22 },
    { name: 'Enterprise', radius: 4.58, size: .19, color: [0.68, 0.72, 1.00], speed: -.075, phase: 5.3, tilt: -.10 }
  ]);

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function mix(a, b, t) { return a + (b - a) * t; }

  function mat4Identity() {
    return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }
  function mat4Multiply(a, b) {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        out[col * 4 + row] =
          a[0 * 4 + row] * b[col * 4 + 0] +
          a[1 * 4 + row] * b[col * 4 + 1] +
          a[2 * 4 + row] * b[col * 4 + 2] +
          a[3 * 4 + row] * b[col * 4 + 3];
      }
    }
    return out;
  }
  function mat4Perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    const out = new Float32Array(16);
    out[0] = f / aspect; out[5] = f; out[10] = (far + near) * nf;
    out[11] = -1; out[14] = 2 * far * near * nf;
    return out;
  }
  function vec3Normalize(v) {
    const len = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / len, v[1] / len, v[2] / len];
  }
  function vec3Cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function vec3Dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
  function mat4LookAt(eye, center, up) {
    const z = vec3Normalize([eye[0]-center[0], eye[1]-center[1], eye[2]-center[2]]);
    const x = vec3Normalize(vec3Cross(up, z));
    const y = vec3Cross(z, x);
    const out = mat4Identity();
    out[0]=x[0]; out[1]=y[0]; out[2]=z[0];
    out[4]=x[1]; out[5]=y[1]; out[6]=z[1];
    out[8]=x[2]; out[9]=y[2]; out[10]=z[2];
    out[12]=-vec3Dot(x, eye); out[13]=-vec3Dot(y, eye); out[14]=-vec3Dot(z, eye);
    return out;
  }
  function mat4Translation(x, y, z) {
    const out = mat4Identity(); out[12]=x; out[13]=y; out[14]=z; return out;
  }
  function mat4Scale(x, y, z) {
    const out = mat4Identity(); out[0]=x; out[5]=y; out[10]=z; return out;
  }
  function mat4RotateX(a) {
    const c=Math.cos(a), s=Math.sin(a), out=mat4Identity();
    out[5]=c; out[6]=s; out[9]=-s; out[10]=c; return out;
  }
  function mat4RotateY(a) {
    const c=Math.cos(a), s=Math.sin(a), out=mat4Identity();
    out[0]=c; out[2]=-s; out[8]=s; out[10]=c; return out;
  }

  function makeSphere(latitudes, longitudes) {
    const positions = [], normals = [], indices = [];
    for (let lat = 0; lat <= latitudes; lat++) {
      const theta = lat * Math.PI / latitudes;
      const sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
      for (let lon = 0; lon <= longitudes; lon++) {
        const phi = lon * 2 * Math.PI / longitudes;
        const x = Math.cos(phi) * sinTheta;
        const y = cosTheta;
        const z = Math.sin(phi) * sinTheta;
        positions.push(x, y, z); normals.push(x, y, z);
      }
    }
    for (let lat = 0; lat < latitudes; lat++) {
      for (let lon = 0; lon < longitudes; lon++) {
        const first = lat * (longitudes + 1) + lon;
        const second = first + longitudes + 1;
        indices.push(first, second, first + 1, second, second + 1, first + 1);
      }
    }
    return { positions: new Float32Array(positions), normals: new Float32Array(normals), indices: new Uint16Array(indices) };
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Unknown shader compile error';
      gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  function makeProgram(gl, vertex, fragment) {
    const vs = compileShader(gl, gl.VERTEX_SHADER, vertex);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Unknown program link error';
      gl.deleteProgram(program);
      throw new Error(message);
    }
    return program;
  }

  const SPHERE_VERTEX = `#version 300 es
    in vec3 aPosition; in vec3 aNormal;
    uniform mat4 uMVP; uniform mat4 uModel;
    out vec3 vNormal; out vec3 vPosition;
    void main(){
      vec4 world = uModel * vec4(aPosition, 1.0);
      vPosition = world.xyz;
      vNormal = normalize(mat3(uModel) * aNormal);
      gl_Position = uMVP * vec4(aPosition, 1.0);
    }`;
  const SPHERE_FRAGMENT = `#version 300 es
    precision highp float;
    in vec3 vNormal; in vec3 vPosition;
    uniform vec3 uColor; uniform float uGlow;
    out vec4 outColor;
    void main(){
      vec3 n = normalize(vNormal);
      vec3 lightDir = normalize(vec3(-0.45, 0.72, 0.9));
      float diffuse = max(dot(n, lightDir), 0.0);
      float rim = pow(1.0 - max(dot(n, normalize(vec3(0.0,0.0,1.0))), 0.0), 2.6);
      float shade = 0.27 + diffuse * 0.82;
      vec3 color = uColor * shade + uColor * rim * (0.25 + uGlow * 0.9);
      outColor = vec4(color, 1.0);
    }`;
  const LINE_VERTEX = `#version 300 es
    in vec3 aPosition; uniform mat4 uMVP;
    void main(){ gl_Position = uMVP * vec4(aPosition,1.0); }`;
  const LINE_FRAGMENT = `#version 300 es
    precision highp float; uniform vec4 uColor; out vec4 outColor;
    void main(){ outColor = uColor; }`;

  function makeBuffer(gl, target, data, usage) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, data, usage || gl.STATIC_DRAW);
    return buffer;
  }

  function makeOrbit(radius, points) {
    const out = [];
    for (let i = 0; i <= points; i++) {
      const a = i / points * Math.PI * 2;
      out.push(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }
    return new Float32Array(out);
  }

  class OrbitScene {
    constructor(canvas) {
      this.canvas = canvas;
      this.originalCanvas = canvas;
      this.gl = null;
      this.running = false;
      this.visible = true;
      this.destroyed = false;
      this.reduced = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      this.pointer = { x: 0, y: 0 };
      this.start = performance.now();
      this.lastFrame = 0;
      this.frameId = 0;
      this.resizeObserver = null;
      this.intersectionObserver = null;
      this.init();
    }
    init() {
      try {
        this.gl = this.canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
        if (!this.gl) throw new Error('WebGL2 unavailable');
        this.setupGL();
        this.canvas.dataset.renderer = 'webgl2';
      } catch (error) {
        this.gl = null;
        // A canvas context type is immutable. If WebGL2 initialized but shader setup
        // failed, replace the element before requesting a 2D fallback context.
        const replacement = this.canvas.cloneNode(false);
        this.canvas.replaceWith(replacement);
        this.canvas = replacement;
        this.canvas.dataset.renderer = 'canvas2d-fallback';
        this.ctx2d = this.canvas.getContext('2d');
      }
      this.resize();
      if ('ResizeObserver' in global) {
        this.resizeObserver = new global.ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.canvas);
      } else {
        global.addEventListener('resize', this.onResize);
      }
      if ('IntersectionObserver' in global) {
        this.intersectionObserver = new IntersectionObserver((entries) => {
          this.visible = !!entries[0] && entries[0].isIntersecting;
          this.sync();
        }, { threshold: 0.01 });
        this.intersectionObserver.observe(this.canvas);
      }
      this.onPointer = (event) => {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, -1, 1);
        this.pointer.y = clamp((event.clientY - rect.top) / Math.max(1, rect.height) * 2 - 1, -1, 1);
      };
      if (global.matchMedia && global.matchMedia('(pointer:fine)').matches) {
        this.canvas.addEventListener('pointermove', this.onPointer, { passive: true });
        this.canvas.addEventListener('pointerleave', () => { this.pointer.x = 0; this.pointer.y = 0; }, { passive: true });
      }
      this.onVisibility = () => { this.pageVisible = !document.hidden; this.sync(); };
      document.addEventListener('visibilitychange', this.onVisibility);
      this.pageVisible = !document.hidden;
      this.sync();
    }
    setupGL() {
      const gl = this.gl;
      this.sphereProgram = makeProgram(gl, SPHERE_VERTEX, SPHERE_FRAGMENT);
      this.lineProgram = makeProgram(gl, LINE_VERTEX, LINE_FRAGMENT);
      const sphere = makeSphere(22, 30);
      this.sphereIndexCount = sphere.indices.length;
      this.spherePosition = makeBuffer(gl, gl.ARRAY_BUFFER, sphere.positions);
      this.sphereNormal = makeBuffer(gl, gl.ARRAY_BUFFER, sphere.normals);
      this.sphereIndex = makeBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, sphere.indices);
      this.sphereLoc = {
        position: gl.getAttribLocation(this.sphereProgram, 'aPosition'),
        normal: gl.getAttribLocation(this.sphereProgram, 'aNormal'),
        mvp: gl.getUniformLocation(this.sphereProgram, 'uMVP'),
        model: gl.getUniformLocation(this.sphereProgram, 'uModel'),
        color: gl.getUniformLocation(this.sphereProgram, 'uColor'),
        glow: gl.getUniformLocation(this.sphereProgram, 'uGlow')
      };
      this.lineLoc = {
        position: gl.getAttribLocation(this.lineProgram, 'aPosition'),
        mvp: gl.getUniformLocation(this.lineProgram, 'uMVP'),
        color: gl.getUniformLocation(this.lineProgram, 'uColor')
      };
      this.orbits = PLANETS.map((planet, index) => {
        const values = makeOrbit(planet.radius, 144);
        return {
          buffer: makeBuffer(gl, gl.ARRAY_BUFFER, values),
          count: values.length / 3,
          radius: planet.radius,
          tilt: planet.tilt,
          color: index % 2 ? [0.53,0.57,0.88,0.22] : [0.62,0.60,0.90,0.19]
        };
      });
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      this.glReady = true;
    }
    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(global.devicePixelRatio || 1, CONFIG.maxDpr);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width; this.canvas.height = height;
      }
      if (this.gl) this.gl.viewport(0, 0, width, height);
      this.render(performance.now(), true);
    }
    renderSphere(model, color, glow, viewProjection) {
      const gl = this.gl, loc = this.sphereLoc;
      const mvp = mat4Multiply(viewProjection, model);
      gl.useProgram(this.sphereProgram);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.spherePosition);
      gl.enableVertexAttribArray(loc.position);
      gl.vertexAttribPointer(loc.position, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereNormal);
      gl.enableVertexAttribArray(loc.normal);
      gl.vertexAttribPointer(loc.normal, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sphereIndex);
      gl.uniformMatrix4fv(loc.mvp, false, mvp);
      gl.uniformMatrix4fv(loc.model, false, model);
      gl.uniform3fv(loc.color, color);
      gl.uniform1f(loc.glow, glow);
      gl.drawElements(gl.TRIANGLES, this.sphereIndexCount, gl.UNSIGNED_SHORT, 0);
    }
    renderLines(viewProjection, tilt) {
      const gl = this.gl, loc = this.lineLoc;
      gl.useProgram(this.lineProgram);
      gl.depthMask(false);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.orbits[0].buffer);
      gl.enableVertexAttribArray(loc.position);
      gl.vertexAttribPointer(loc.position, 3, gl.FLOAT, false, 0, 0);
      this.orbits.forEach((orbit) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, orbit.buffer);
        gl.vertexAttribPointer(loc.position, 3, gl.FLOAT, false, 0, 0);
        const ringModel = mat4Multiply(mat4RotateX(orbit.tilt + tilt), mat4RotateY(.04));
        const mvp = mat4Multiply(viewProjection, ringModel);
        gl.uniformMatrix4fv(loc.mvp, false, mvp);
        gl.uniform4fv(loc.color, orbit.color);
        gl.drawArrays(gl.LINE_STRIP, 0, orbit.count);
      });
      gl.depthMask(true);
    }
    renderGL(time) {
      const gl = this.gl;
      const w = this.canvas.width, h = this.canvas.height;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      const elapsed = this.reduced ? 0 : (time - this.start) / 1000;
      const aspect = w / Math.max(1,h);
      const mobile = aspect < .88;
      const cameraY = mobile ? 2.7 : 2.35;
      const cameraZ = mobile ? 13.2 : 11.5;
      const projection = mat4Perspective(39 * Math.PI / 180, aspect, .1, 50);
      const view = mat4LookAt([this.pointer.x * .38, cameraY + this.pointer.y * .20, cameraZ], [0,0,0], [0,1,0]);
      const viewProjection = mat4Multiply(projection, view);
      const scrollTilt = clamp(Number(this.canvas.dataset.scrollTilt) || 0, -.16, .16);
      this.renderLines(viewProjection, scrollTilt + this.pointer.y * .025);
      const coreModel = mat4Multiply(mat4Translation(0,0,0), mat4Scale(.53,.53,.53));
      this.renderSphere(coreModel, [0.84,0.86,1.0], 1.0, viewProjection);
      PLANETS.forEach((planet, i) => {
        const angle = elapsed * planet.speed + planet.phase;
        const x = Math.cos(angle) * planet.radius;
        const z = Math.sin(angle) * planet.radius;
        const y = Math.sin(angle * .53 + planet.phase) * .17;
        const rotation = mat4Multiply(mat4RotateY(elapsed * .34 + i), mat4RotateX(planet.tilt));
        const model = mat4Multiply(mat4Translation(x,y,z), mat4Multiply(rotation, mat4Scale(planet.size, planet.size, planet.size)));
        this.renderSphere(model, planet.color, .28, viewProjection);
      });
    }
    renderFallback(time) {
      const ctx = this.ctx2d;
      if (!ctx) return;
      const w=this.canvas.width, h=this.canvas.height, cx=w/2, cy=h*.52;
      const scale=Math.min(w,h)*.092;
      const elapsed=this.reduced ? 0 : (time-this.start)/1000;
      ctx.clearRect(0,0,w,h);
      const haze=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.min(w,h)*.49);
      haze.addColorStop(0,'rgba(131,116,255,.13)'); haze.addColorStop(1,'rgba(7,8,17,0)');
      ctx.fillStyle=haze; ctx.fillRect(0,0,w,h);
      for (let i=PLANETS.length-1;i>=0;i--) {
        const p=PLANETS[i], rx=p.radius*scale, ry=rx*.40;
        ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,p.tilt,0,Math.PI*2);
        ctx.strokeStyle='rgba(172,174,235,.18)'; ctx.lineWidth=1; ctx.stroke();
      }
      PLANETS.forEach((p,i)=>{
        const a=elapsed*p.speed+p.phase;
        const x=cx+Math.cos(a)*p.radius*scale;
        const y=cy+Math.sin(a)*p.radius*scale*.4;
        const r=Math.max(4,p.size*scale*.75);
        const g=ctx.createRadialGradient(x-r*.35,y-r*.38,1,x,y,r*1.3);
        const rgb=p.color.map(v=>Math.round(v*255));
        g.addColorStop(0,'#ffffff'); g.addColorStop(.2,`rgb(${rgb.join(',')})`); g.addColorStop(1,'rgba(30,28,75,.95)');
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
      });
      const core=ctx.createRadialGradient(cx-scale*.12,cy-scale*.12,1,cx,cy,scale*.68);
      core.addColorStop(0,'#ffffff'); core.addColorStop(.45,'#dfe2ff'); core.addColorStop(1,'#7774be');
      ctx.beginPath(); ctx.arc(cx,cy,scale*.46,0,Math.PI*2); ctx.fillStyle=core; ctx.fill();
    }
    render(time, force) {
      if (this.destroyed) return;
      if (this.gl && this.glReady) this.renderGL(time);
      else this.renderFallback(time);
      if (force) return;
    }
    tick = (time) => {
      if (this.destroyed || !this.running) return;
      const minFrame = 1000 / CONFIG.fps;
      if (!this.reduced && time - this.lastFrame >= minFrame) {
        this.render(time);
        this.lastFrame = time;
      }
      if (this.reduced) { this.render(time); this.running = false; return; }
      this.frameId = requestAnimationFrame(this.tick);
    };
    sync() {
      const shouldRun = !this.destroyed && this.visible && this.pageVisible && !this.reduced;
      if (shouldRun && !this.running) {
        this.running = true;
        this.frameId = requestAnimationFrame(this.tick);
      } else if (!shouldRun && this.running) {
        this.running = false;
        cancelAnimationFrame(this.frameId);
        this.render(performance.now(), true);
      } else if (this.reduced && !this.running) {
        this.render(performance.now(), true);
      }
    }
    destroy() {
      this.destroyed = true; this.running = false;
      cancelAnimationFrame(this.frameId);
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.intersectionObserver) this.intersectionObserver.disconnect();
      global.removeEventListener('resize', this.onResize);
      document.removeEventListener('visibilitychange', this.onVisibility);
      this.canvas.removeEventListener('pointermove', this.onPointer);
      sceneRegistry.delete(this.canvas);
      sceneRegistry.delete(this.originalCanvas);
      if (this.gl) {
        [this.spherePosition,this.sphereNormal,this.sphereIndex,...this.orbits.map(o=>o.buffer)].forEach(b=>b&&this.gl.deleteBuffer(b));
        [this.sphereProgram,this.lineProgram].forEach(p=>p&&this.gl.deleteProgram(p));
      }
    }
    onResize = () => this.resize();
  }

  function setupReveal(root) {
    const items = Array.from(root.querySelectorAll('[data-idg-reveal]'));
    if (!items.length) return;
    if (!('IntersectionObserver' in global) || (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      items.forEach(el => el.classList.add('idg-revealed'));
      return;
    }
    items.forEach((el, index) => {
      el.classList.add('idg-reveal', 'idg-reveal-ready');
      el.style.setProperty('--idg-delay', `${Math.min(index % 5, 4) * 70}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('idg-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.revealThreshold, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => observer.observe(el));
  }

  function setupTilt(root) {
    if (!global.matchMedia || !global.matchMedia('(pointer:fine)').matches) return;
    const cards = Array.from(root.querySelectorAll('[data-idg-tilt]'));
    cards.forEach(card => {
      let raf = 0;
      const onMove = (event) => {
        const rect=card.getBoundingClientRect();
        const px=clamp((event.clientX-rect.left)/rect.width,0,1);
        const py=clamp((event.clientY-rect.top)/rect.height,0,1);
        cancelAnimationFrame(raf);
        raf=requestAnimationFrame(()=>{
          const rx=(.5-py)*CONFIG.tiltMax;
          const ry=(px-.5)*CONFIG.tiltMax;
          card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
        });
      };
      const onLeave=()=>{ cancelAnimationFrame(raf); card.style.transform=''; };
      card.addEventListener('pointermove',onMove,{passive:true});
      card.addEventListener('pointerleave',onLeave,{passive:true});
    });
  }

  function setupFlow(root) {
    const nodes = Array.from(root.querySelectorAll('[data-idg-flow-node]'));
    if (!nodes.length) return;
    if (!('IntersectionObserver' in global)) { nodes.forEach(n=>n.classList.add('is-flow-active')); return; }
    let timer = 0, index = 0, active = false;
    const step = () => {
      if (!active || !nodes.length) return;
      nodes.forEach((node,i)=>node.classList.toggle('is-flow-active',i===index));
      index=(index+1)%nodes.length;
      timer=global.setTimeout(step,1500);
    };
    const observer = new IntersectionObserver(entries=>{
      active=!!entries[0]&&entries[0].isIntersecting;
      if(active){ if(!timer) step(); }
      else { global.clearTimeout(timer); timer=0; nodes.forEach(n=>n.classList.remove('is-flow-active')); }
    },{threshold:.2});
    observer.observe(nodes[0].parentElement || nodes[0]);
  }

  function setupServiceSearch(root) {
    const input=root.querySelector('[data-service-search], #service-live-search');
    if(!input) return;
    const items=Array.from(root.querySelectorAll('[data-service-search-item], .service-item-card'));
    if(!items.length) return;
    const empty=root.querySelector('[data-service-empty]');
    let activeCategory='all';
    const normalize=s=>String(s||'').normalize('NFKD').toLowerCase().trim();
    const apply=()=>{
      const q=normalize(input.value);
      let count=0;
      items.forEach(item=>{
        const text=normalize(item.textContent+' '+(item.dataset.category||'')+' '+(item.dataset.search||''));
        const category=normalize(item.dataset.category||'');
        const categoryMatch=activeCategory==='all'||category===activeCategory;
        const match=categoryMatch&&(!q||text.includes(q));
        item.classList.toggle('idg-filter-hidden', !match);
        item.hidden=!match;
        if(match) count++;
      });
      if(empty) empty.hidden=count!==0;
      root.dispatchEvent(new CustomEvent('iinsha:service-search',{detail:{query:q,category:activeCategory,count}}));
    };
    input.addEventListener('input',apply,{passive:true});
    root.querySelectorAll('[data-service-filter]').forEach(button=>{
      button.addEventListener('click',()=>{
        activeCategory=normalize(button.dataset.serviceFilter||'all')||'all';
        root.querySelectorAll('[data-service-filter]').forEach(b=>{
          const selected=b===button;
          b.classList.toggle('active',selected);
          b.setAttribute('aria-pressed',String(selected));
        });
        apply();
      });
    });
    apply();
  }

  function init(options) {
    const opts=options||{};
    const root=opts.root||document;
    const html=document.documentElement;
    if(opts.enableTheme!==false) html.setAttribute('data-iinsha-design','diagram');
    const canvases=Array.from(root.querySelectorAll('[data-iinsha-motion-scene], #iinsha-diagram-scene, #iinsha-hero-canvas'));
    const scenes=canvases.map(canvas=>{
      const existing=sceneRegistry.get(canvas);
      if(existing && !existing.destroyed) return existing;
      const scene=new OrbitScene(canvas);
      sceneRegistry.set(canvas,scene);
      sceneRegistry.set(scene.canvas,scene);
      return scene;
    });
    if(!enhancedRoots.has(root)) {
      enhancedRoots.add(root);
      setupReveal(root);
      setupTilt(root);
      setupFlow(root);
      setupServiceSearch(root);
    }
    return {
      scenes,
      destroy(){scenes.forEach(scene=>scene.destroy());}
    };
  }

  NS.DiagramMotion = Object.freeze({ init, version: '1.0.0', config: CONFIG });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',()=>{
      if(document.querySelector('[data-iinsha-auto-init]')) init();
    },{once:true});
  } else if (document.querySelector('[data-iinsha-auto-init]')) {
    init();
  }
})(window);
