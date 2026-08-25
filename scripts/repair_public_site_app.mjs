import fs from 'node:fs';

const file = 'app.js';
const source = fs.readFileSync(file, 'utf8');
const marker = 'window.openCopilot = window.openIinshaChatWindow;';
const start = source.indexOf(marker);
if (start < 0) throw new Error('PUBLIC_APP_REPAIR: canonical copilot export marker not found; refusing to modify app.js');

const widgetStart = source.indexOf('widget.style.cssText', start);
if (widgetStart < 0) {
  console.log('PUBLIC_APP_REPAIR: already clean; no change required');
  process.exit(0);
}

const end = source.indexOf('function initMasterApp() {', widgetStart);
if (end < 0 || end <= widgetStart) {
  throw new Error('PUBLIC_APP_REPAIR: expected initMasterApp boundary was not found; refusing to modify app.js');
}

const stray = source.slice(widgetStart, end);
if (!stray.includes('widget.innerHTML') || !stray.trimEnd().endsWith('}')) {
  throw new Error('PUBLIC_APP_REPAIR: unexpected widget block shape; refusing to modify app.js');
}

// Keep canonical copilot exports and init functions. Remove only the orphaned
// widget manipulation block that sits outside any function and causes the parse error.
const repaired = source.slice(0, widgetStart) + '\n' + source.slice(end);
fs.writeFileSync(file, repaired, 'utf8');
console.log('PUBLIC_APP_REPAIR: removed orphaned widget block safely');
