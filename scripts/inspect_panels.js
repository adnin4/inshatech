import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const panelMatches = [...html.matchAll(/<div id="(cat-[^"]+)" class="service-panel([^"]*)"[^>]*>([\s\S]*?)<\/div>\s*(?=<div id="cat-|<\/div>\s*<\/div>\s*<!--)/g)];

console.log('Total panels found:', panelMatches.length);
panelMatches.forEach((m, idx) => {
    const id = m[1];
    const body = m[3];
    const cards = [...body.matchAll(/<div class="service-item-card">[\s\S]*?<div class="service-item-title">([\s\S]*?)<\/div>[\s\S]*?<div class="service-item-desc">([\s\S]*?)<\/div>/g)];
    console.log(`\n[Panel ${idx+1}] ID: ${id} | Total Cards: ${cards.length}`);
    cards.forEach((c, cIdx) => {
        const title = c[1].replace(/<[^>]+>/g, '').trim();
        const desc = c[2].trim();
        console.log(`  ${cIdx+1}. ${title} -> ${desc}`);
    });
});
