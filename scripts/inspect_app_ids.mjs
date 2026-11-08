import fs from 'fs';

const appJs = fs.readFileSync('app.js', 'utf8');
const ids = new Set();
const matches = appJs.match(/getElementById\(['"]([^'"]+)['"]\)/g);
if (matches) {
  for (const m of matches) {
    const id = m.replace(/getElementById\(['"]/, '').replace(/['"]\)/, '');
    ids.add(id);
  }
}
console.log('Total IDs found in app.js:', ids.size);
console.log(Array.from(ids).sort());
