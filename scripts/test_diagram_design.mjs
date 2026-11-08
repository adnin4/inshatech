import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = async path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const html = await read('index.html');
const liveHtml = await read('live_index.html');
const css = await read('css/iinsha-diagram-design.css');
const motion = await read('src/js/iinsha-diagram-motion.js');

const publicPages = [
  'index.html','live_index.html','admin.html','marketplace.html','store.html',
  'compare.html','affiliate.html','affiliate-dashboard.html','affiliate-login.html',
  'blog.html','portal.html','privacy.html','terms.html',
  'services/ai-agent-development.html','services/ai-business-automation.html',
  'services/ai-document-processing.html','services/ai-infrastructure.html',
  'services/ai-integration.html','services/ai-website-development.html',
  'services/hermes-ai-support-agent.html','services/managed-ai-services.html',
  'services/n8n-automation-expert.html','services/playwright-web-scraping.html'
];

for (const page of publicPages) {
  const source = await read(page);
  assert.match(source, /<body[^>]*iinsha-diagram-redesign/, page + ' must opt into the shared IINSHA design system');
  const expectedSheet = page.startsWith('services/')
    ? '../css/iinsha-diagram-design.css'
    : 'css/iinsha-diagram-design.css';
  assert.ok(source.includes(expectedSheet), page + ' must load the correct relative design-system path');
}

for (const [name, source] of [['index.html', html], ['live_index.html', liveHtml]]) {
  assert.match(source, /id="hero3d-container"/, name + ' must include the orbital hero root');
  assert.match(source, /id="iinsha-hero-canvas"/, name + ' must include the WebGL canvas');
  assert.match(source, /id="bento-capabilities"/, name + ' must include the capability bento section');
  assert.match(source, /id="service-live-search"/, name + ' must include service discovery');
  assert.match(source, /src\/js\/iinsha-diagram-motion\.js/, name + ' must load the motion engine');
}
assert.equal((html.match(/class="diagram-bento-card/g) || []).length, 4, 'exactly four capability bento cards');
assert.ok((html.match(/class="service-item-card"/g) || []).length >= 80, 'all 80 existing detailed service cards must remain');
assert.match(motion, /getContext\('webgl'/, 'motion engine must attempt real WebGL');
assert.match(motion, /diagram-webgl-fallback/, 'WebGL failure must have a fallback');
assert.match(motion, /prefers-reduced-motion/, 'motion engine must respect reduced-motion settings');
assert.match(motion, /IntersectionObserver/, 'motion engine must pause offscreen and reveal sections');
assert.match(motion, /service-live-search/, 'motion engine must wire service search');
assert.match(css, /\.diagram-bento-grid/, 'design system must contain bento layout');
assert.match(css, /prefers-reduced-motion/, 'design system must support reduced motion');
assert.match(css, /service-panel\.search-visible/, 'search must reveal only matching service panels');
assert.match(html, /id="solution-finder"/, 'existing solution finder must remain');
assert.match(html, /id="architecture-builder"/, 'existing architecture builder must remain');
assert.match(html, /id="roi-calculator"/, 'existing ROI calculator must remain');
assert.match(html, /id="sticky-mobile-cta-btn"/, 'existing mobile CTA must remain');

console.log('Diagram design tests: PASS (23 pages themed, WebGL hero, 4-card bento, all 80 service cards, service search, reduced motion, core modules preserved).');
