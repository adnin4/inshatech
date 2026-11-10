import fs from 'node:fs';

async function main() {
  const [prodRes, prevRes] = await Promise.all([
    fetch('https://inshatech-b6b.pages.dev/'),
    fetch('https://fe71deb2.inshatech-b6b.pages.dev/')
  ]);

  const prodHtml = await prodRes.text();
  const prevHtml = await prevRes.text();

  function analyze(name, html) {
    const panels = (html.match(/class=["'][^"']*service-panel/g) || []).length;
    const cards = (html.match(/class=["'][^"']*service-item-card/g) || []).length;
    const hasServicesAnchor = html.includes('id="services"');
    const hasS3 = html.includes('id="s3"');
    const hasVideo = html.includes('id="hero-celestial-video"');
    const hasCanvas = html.includes('id="iinsha-diagram-scene"');

    console.log(`=== ${name} ===`);
    console.log(`Panels count: ${panels}`);
    console.log(`Cards count: ${cards}`);
    console.log(`id="services" present: ${hasServicesAnchor}`);
    console.log(`id="s3" present: ${hasS3}`);
    console.log(`video present: ${hasVideo}`);
    console.log(`canvas present: ${hasCanvas}`);
  }

  analyze('CANONICAL (inshatech-b6b.pages.dev)', prodHtml);
  analyze('PREVIEW (fe71deb2.inshatech-b6b.pages.dev)', prevHtml);
}

main().catch(console.error);
