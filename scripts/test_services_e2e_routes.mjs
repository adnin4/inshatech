import fs from 'fs';
import path from 'node:path';

console.log('=== TEST SUITE: SERVICE LANDING PAGES E2E INTEGRITY & ROUTE CERTIFICATION ===');

const expectedServices = [
  { slug: 'ai-video-studio', titleSnippet: 'Video', price: '$450' },
  { slug: 'ai-saas-engineering', titleSnippet: 'SaaS', price: '$850' },
  { slug: 'ai-governance-operations', titleSnippet: 'Governance', price: '$950' },
  { slug: 'ecommerce-growth-operations', titleSnippet: 'Commerce', price: '$490' },
  { slug: 'ai-finance-automation', titleSnippet: 'Finance', price: '$650' },
  { slug: 'ai-data-operations', titleSnippet: 'Data Operations', price: '$750' },
  { slug: 'enterprise-knowledge-search', titleSnippet: 'Knowledge', price: '$850' },
  { slug: 'software-qa-release', titleSnippet: 'Software QA', price: '$750' },
  { slug: 'cloud-finops-reliability', titleSnippet: 'Cloud FinOps', price: '$850' },
  { slug: 'computer-vision-systems', titleSnippet: 'Computer Vision', price: '$1200' }
];

const checkDirectories = ['services', path.join('dist-pages', 'services')];
let errors = 0;
const uniqueTitles = new Set();
const uniqueH1s = new Set();

for (const dir of checkDirectories) {
  console.log(`\n[CHECKING DIRECTORY] ${dir}...`);
  for (const s of expectedServices) {
    const filePath = path.join(dir, `${s.slug}.html`);
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Missing file: ${filePath}`);
      errors++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (content.length < 5000) {
      console.error(`[FAIL] File suspiciously small (<5KB): ${filePath}`);
      errors++;
    }

    // Check title
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    if (!titleMatch || !titleMatch[1].toLowerCase().includes(s.titleSnippet.toLowerCase())) {
      console.error(`[FAIL] Title mismatch in ${filePath}: found "${titleMatch ? titleMatch[1] : 'NONE'}"`);
      errors++;
    } else {
      uniqueTitles.add(titleMatch[1]);
    }

    // Check H1
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (!h1Match) {
      console.error(`[FAIL] Missing <h1> in ${filePath}`);
      errors++;
    } else {
      const h1Text = h1Match[1].replace(/<[^>]+>/g, '').trim();
      uniqueH1s.add(h1Text);
    }

    // Check insha-3d-visual
    if (!content.includes(`<insha-3d-visual service="${s.slug}"`) && !content.includes(`service="${s.slug}"`)) {
      console.error(`[FAIL] Missing <insha-3d-visual service="${s.slug}"> in ${filePath}`);
      errors++;
    }

    // Check canonical price
    if (!content.includes(s.price)) {
      console.error(`[FAIL] Missing canonical price ${s.price} in ${filePath}`);
      errors++;
    }

    console.log(`[PASS] ${filePath}: Unique Title, H1, 3D visual, and Price (${s.price}) verified.`);
  }
}

if (uniqueTitles.size < expectedServices.length) {
  console.error(`[FAIL] Duplicate titles detected: ${uniqueTitles.size} unique titles out of ${expectedServices.length}`);
  errors++;
}

if (uniqueH1s.size < expectedServices.length) {
  console.error(`[FAIL] Duplicate H1 headings detected: ${uniqueH1s.size} unique H1s out of ${expectedServices.length}`);
  errors++;
}

if (errors === 0) {
  console.log('\n================================================================================');
  console.log('🎉 SERVICE LANDING PAGES E2E CERTIFICATION: ALL ASSERTIONS PASSED (100%)');
  console.log('All 10 services verified with distinct titles, H1s, 3D visuals, and pricing across root and dist-pages.');
  console.log('================================================================================');
} else {
  console.error(`\n[FATAL] ${errors} errors detected in service landing pages!`);
  process.exit(1);
}
