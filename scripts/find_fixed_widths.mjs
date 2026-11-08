import fs from 'fs';

const files = ['index.html', 'admin.html', 'marketplace.html', 'store.html', 'compare.html', 'affiliate.html', 'affiliate-dashboard.html', 'affiliate-login.html', 'blog.html', 'portal.html'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const regex = /style=['"][^'"]*(?:(?<!max-)width|min-width)\s*:\s*([3-9]\d{2,}|[1-9]\d{3,})px[^'"]*['"]/gi;
  let match;
  const fileMatches = [];
  while ((match = regex.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    fileMatches.push({ line, match: match[0] });
  }
  if (fileMatches.length > 0) {
    console.log(`=== ${file} (${fileMatches.length} matches) ===`);
    fileMatches.slice(0, 15).forEach(m => console.log(`  L${m.line}: ${m.match.substring(0, 90)}`));
  }
}
