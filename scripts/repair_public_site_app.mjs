import fs from 'node:fs';

const file = 'app.js';
const source = fs.readFileSync(file, 'utf8');
const orphanMarker = 'window.openCopilot = window.openIinshaChatWindow;\nwidget.style.cssText';
const start = source.indexOf(orphanMarker);

if (start < 0) {
  console.log('PUBLIC_APP_REPAIR: already clean; no orphaned widget block found');
  process.exit(0);
}

const widgetStart = source.indexOf('widget.style.cssText', start);
const end = source.indexOf('function initMasterApp() {', widgetStart);
if (widgetStart < 0 || end < 0 || end <= widgetStart) {
  throw new Error('PUBLIC_APP_REPAIR: exact orphaned widget block detected but safe boundary was not found; refusing to modify app.js');
}

const stray = source.slice(widgetStart, end);
if (!stray.includes('widget.innerHTML')) {
  throw new Error('PUBLIC_APP_REPAIR: detected orphan marker without widget body; refusing to modify app.js');
}

const repaired = source.slice(0, widgetStart) + '\n' + source.slice(end);
fs.writeFileSync(file, repaired, 'utf8');
console.log('PUBLIC_APP_REPAIR: removed orphaned widget block safely');
