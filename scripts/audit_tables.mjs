import fs from 'fs';

const files = ['index.html', 'admin.html', 'marketplace.html', 'store.html', 'compare.html', 'affiliate.html', 'affiliate-dashboard.html', 'affiliate-login.html', 'blog.html', 'portal.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const regex = /<table\b[^>]*>/gi;
  let match;
  const list = [];
  while ((match = regex.exec(html)) !== null) {
    const line = html.substring(0, match.index).split('\n').length;
    // check parent
    const before = html.substring(Math.max(0, match.index - 120), match.index);
    list.push(`L${line}: ${match[0].substring(0, 50)} | parent: ${before.replace(/\s+/g, ' ')}`);
  }
  if (list.length > 0) {
    console.log(`=== ${file} (${list.length} tables) ===`);
    list.forEach(item => console.log('  ' + item));
  }
}
