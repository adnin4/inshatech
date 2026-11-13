import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
console.log('--- INDEX.HTML INSPECTION ---');
console.log('length:', html.length);
console.log('has #hero-celestial-video:', html.includes('hero-celestial-video'));
console.log('has #iinsha-diagram-scene:', html.includes('iinsha-diagram-scene'));
console.log('has #hero3d-container:', html.includes('hero3d-container'));
console.log('has #iinsha-hero-canvas:', html.includes('iinsha-hero-canvas'));
console.log('has #particleCanvas:', html.includes('particleCanvas'));
console.log('service-panel matches:', (html.match(/service-panel/g) || []).length);
console.log('service-item-card matches:', (html.match(/service-item-card/g) || []).length);
console.log('diagram-bento-card matches:', (html.match(/diagram-bento-card/g) || []).length);
console.log('h1 matches:', (html.match(/<h1[\s>]/gi) || []).length);
console.log('canonical matches:', (html.match(/rel=["']canonical["']/gi) || []).length);

if (fs.existsSync('live_index.html')) {
  const liveHtml = fs.readFileSync('live_index.html', 'utf8');
  console.log('\n--- LIVE_INDEX.HTML INSPECTION ---');
  console.log('length:', liveHtml.length);
  console.log('has #hero-celestial-video:', liveHtml.includes('hero-celestial-video'));
  console.log('has #iinsha-diagram-scene:', liveHtml.includes('iinsha-diagram-scene'));
  console.log('has #hero3d-container:', liveHtml.includes('hero3d-container'));
  console.log('has #iinsha-hero-canvas:', liveHtml.includes('iinsha-hero-canvas'));
  console.log('has #particleCanvas:', liveHtml.includes('particleCanvas'));
  console.log('service-panel matches:', (liveHtml.match(/service-panel/g) || []).length);
  console.log('service-item-card matches:', (liveHtml.match(/service-item-card/g) || []).length);
  console.log('diagram-bento-card matches:', (liveHtml.match(/diagram-bento-card/g) || []).length);
}
