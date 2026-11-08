import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const liveHtml = await readFile(new URL('../live_index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../css/iinsha-diagram-design.css', import.meta.url), 'utf8');
const motion = await readFile(new URL('../src/js/iinsha-diagram-motion.js', import.meta.url), 'utf8');

for (const [name, source] of [['index.html', html], ['live_index.html', liveHtml]]) {
  assert.match(source, /iinsha-diagram-design\.css/, name + ' must load the shared design system');
  assert.match(source, /id="hero3d-container"/, name + ' must include the orbital hero root');
  assert.match(source, /id="iinsha-hero-canvas"/, name + ' must include the WebGL canvas');
  assert.match(source, /id="bento-capabilities"/, name + ' must include the capability bento section');
  assert.match(source, /id="service-live-search"/, name + ' must include service discovery');
  assert.match(source, /src\/js\/iinsha-diagram-motion\.js/, name + ' must load the motion engine');
}
assert.match(motion, /getContext\('webgl'/, 'motion engine must attempt real WebGL');
assert.match(motion, /prefers-reduced-motion/, 'motion engine must respect reduced-motion settings');
assert.match(motion, /IntersectionObserver/, 'motion engine must pause offscreen and reveal sections');
assert.match(motion, /service-live-search/, 'motion engine must wire service search');
assert.match(css, /\.diagram-bento-grid/, 'design system must contain bento layout');
assert.match(css, /prefers-reduced-motion/, 'design system must support reduced motion');
assert.match(html, /id="solution-finder"/, 'existing solution finder must remain');
assert.match(html, /id="architecture-builder"/, 'existing architecture builder must remain');
assert.match(html, /id="roi-calculator"/, 'existing ROI calculator must remain');
assert.match(html, /id="sticky-mobile-cta-btn"/, 'existing mobile CTA must remain');

console.log('Diagram design invariants: PASS (hero WebGL, bento, service search, reduced motion, preserved core modules).');
