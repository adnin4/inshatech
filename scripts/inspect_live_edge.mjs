async function check() {
    const r1 = await fetch('https://inshatech-b6b.pages.dev');
    const h1 = await r1.text();
    const r2 = await fetch('https://inshatech.pages.dev');
    const h2 = await r2.text();

    console.log('--- inshatech-b6b.pages.dev ---');
    console.log('Title:', h1.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('Hero tag:', h1.match(/<div class="hero-awwwards-tag"[\s\S]*?<\/div>/)?.[0]?.replace(/\s+/g, ' '));
    console.log('CSS link:', h1.match(/<link[^>]+style\.css[^>]*>/)?.[0]);
    console.log('Hero3D link:', h1.match(/<script[^>]+hero3d\.js[^>]*>/)?.[0]);

    console.log('\n--- inshatech.pages.dev ---');
    console.log('Title:', h2.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('Hero tag:', h2.match(/<div class="hero-awwwards-tag"[\s\S]*?<\/div>/)?.[0]?.replace(/\s+/g, ' '));
    console.log('CSS link:', h2.match(/<link[^>]+style\.css[^>]*>/)?.[0]);
    console.log('Hero3D link:', h2.match(/<script[^>]+hero3d\.js[^>]*>/)?.[0]);
}

check().catch(console.error);
