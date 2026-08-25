import fs from 'node:fs';

const file = 'app.js';
const source = fs.readFileSync(file, 'utf8');
const marker = 'window.openCopilot = window.openIinshaChatWindow;';
const start = source.indexOf(marker);
const widgetStart = source.indexOf('widget.style.cssText', start);
const end = source.indexOf('function initMasterApp() {', widgetStart);

if (start < 0 || widgetStart < 0 || end < 0 || end <= widgetStart) {
  throw new Error('PUBLIC_APP_REPAIR: expected stray widget block was not found; refusing to modify app.js');
}

const stray = source.slice(widgetStart, end);
if (!stray.includes('widget.innerHTML') || !stray.trimEnd().endsWith('}')) {
  throw new Error('PUBLIC_APP_REPAIR: unexpected widget block shape; refusing to modify app.js');
}

// Keep all canonical copilot exports and init functions. Remove only the orphaned
// widget manipulation block that sits outside any function and causes the syntax error.
const repaired = source.slice(0, widgetStart) + '\n' + source.slice(end);
fs.writeFileSync(file, repaired, 'utf8');
console.log('PUBLIC_APP_REPAIR: removed orphaned widget block safely');
