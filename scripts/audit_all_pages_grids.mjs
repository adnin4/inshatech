import fs from 'fs';

const files = ['admin.html', 'marketplace.html', 'store.html', 'compare.html', 'affiliate.html', 'affiliate-dashboard.html', 'affiliate-login.html', 'blog.html', 'portal.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const regex = /style=['"][^'"]*grid-template-columns\s*:[^'"]*['"]/gi;
  let match;
  const list = [];
  while ((match = regex.exec(html)) !== null) {
    const line = html.substring(0, match.index).split('\n').length;
    list.push(`L${line}: ${match[0]}`);
  }
  if (list.length > 0) {
    console.log(`=== ${file} ===`);
    list.forEach(item => console.log('  ' + item));
  }
}
