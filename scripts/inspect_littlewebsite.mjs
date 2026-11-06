fetch('https://littlewebsite.co/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
})
.then(r => r.text())
.then(html => {
    const media = html.match(/https:\/\/[^"'\s)]+\.(mp4|webm|webp|gif|png|jpg)/gi) || [];
    console.log('Media URLs found:', [...new Set(media)].slice(0, 15));
    const iframes = html.match(/<iframe[\s\S]*?<\/iframe>/gi) || [];
    console.log('iframes found:', iframes.length);
    const canvas = html.match(/<canvas[\s\S]*?<\/canvas>/gi) || [];
    console.log('canvas found:', canvas.length);
    const scripts = html.match(/src="([^"]+\.js[^"]*)"/gi) || [];
    console.log('Scripts:', scripts.slice(0, 10));
})
.catch(console.error);
