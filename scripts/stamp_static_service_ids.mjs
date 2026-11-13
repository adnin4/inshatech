import fs from 'fs';
import path from 'path';

const files = ['index.html', 'live_index.html'];

for (const relPath of files) {
  const filePath = path.resolve(process.cwd(), relPath);
  let html = fs.readFileSync(filePath, 'utf8');

  // Regex to match service panels and their service-item-card elements
  // We want to transform:
  // <div class="service-item-card"><div class="service-item-title"><span>...</span> Title</div><div class="service-item-desc">Desc</div></div>
  // into:
  // <div class="service-item-card" data-service-id="svc-XX" data-service-slug="slug" data-service-category="cat-XX"><div class="service-item-title">...
  
  let cardIndex = 0;
  const panelRegex = /(<div\s+id="(cat-[a-z0-9_-]+)"\s+class="service-panel[^"]*"[^>]*>)([\s\S]*?)(<\/div>\s*(?=<div\s+id="cat-|<\/div>\s*<\/div>\s*<\/section>))/g;

  html = html.replace(panelRegex, (match, openTag, panelId, content, closeTag) => {
    // Match each service-item-card including its title and desc divs
    const updatedContent = content.replace(/<div\s+class="service-item-card"[^>]*>([\s\S]*?<div\s+class="service-item-desc">[\s\S]*?<\/div>\s*)<\/div>/g, (cardMatch, innerContent) => {
      cardIndex++;
      const id = `svc-${String(cardIndex).padStart(2, '0')}`;
      
      // Extract title text for slug
      const titleMatch = innerContent.match(/class="service-item-title"[^>]*>([\s\S]*?)<\/div>/i);
      let slug = `service-${cardIndex}`;
      if (titleMatch) {
        // Strip tags and special chars
        const rawText = titleMatch[1].replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim();
        if (rawText) {
          slug = rawText.toLowerCase().replace(/\s+/g, '-');
        }
      }

      return `<div class="service-item-card" data-service-id="${id}" data-service-slug="${slug}" data-service-category="${panelId}">${innerContent}</div>`;
    });

    return openTag + updatedContent + closeTag;
  });

  console.log(`${relPath}: Stamped ${cardIndex} service cards with static data-service-id.`);
  fs.writeFileSync(filePath, html, 'utf8');
}
