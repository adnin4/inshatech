import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Find all sections and their headings
const sectionRegex = /<section[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/section>/gi;
let match;
const sections = [];
while ((match = sectionRegex.exec(html)) !== null) {
    const id = match[1];
    const content = match[2];
    const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const h2 = h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : 'No H2';
    sections.push({ id, h2, length: content.length });
}

console.log('Total sections in index.html:', sections.length);
sections.forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.id}] -> ${s.h2} (${s.length} bytes)`);
});
