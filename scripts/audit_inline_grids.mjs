import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const regex = /style=['"][^'"]*grid-template-columns\s*:[^'"]*['"]/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  const line = html.substring(0, match.index).split('\n').length;
  console.log(`L${line}: ${match[0]}`);
}
