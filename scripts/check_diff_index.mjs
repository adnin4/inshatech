import fs from 'fs';

const a = fs.readFileSync('index.html', 'utf8').split('\n');
const b = fs.readFileSync('live_index.html', 'utf8').split('\n');

console.log(`index.html lines: ${a.length}, live_index.html lines: ${b.length}`);

for (let i = 0; i < Math.max(a.length, b.length); i++) {
  if (a[i] !== b[i]) {
    console.log(`First difference at line ${i + 1}:`);
    console.log(`  index:      ${a[i]?.substring(0, 60)}`);
    console.log(`  live_index: ${b[i]?.substring(0, 60)}`);
    break;
  }
}
