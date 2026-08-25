import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const file = 'app.js';
const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
if (syntax.status === 0) {
  console.log('PUBLIC_APP_REPAIR: app.js syntax already clean; no repair required');
  process.exit(0);
}

const source = fs.readFileSync(file, 'utf8');
const marker = 'window.openCopilot = window.openIinshaChatWindow;';
const start = source.indexOf(marker);
const widgetStart = source.indexOf('widget.style.cssText', start);
const end = source.indexOf('function initMasterApp() {', widgetStart);

if (start < 0 || widgetStart < 0 || end < 0 || end <= widgetStart) {
  console.error(syntax.stderr || syntax.stdout || 'Unknown JavaScript syntax failure');
  throw new Error('PUBLIC_APP_REPAIR: syntax failure exists, but the known orphaned widget block could not be safely located');
}

const stray = source.slice(widgetStart, end);
if (!stray.includes('widget.innerHTML')) {
  throw new Error('PUBLIC_APP_REPAIR: syntax failure found but expected widget body is not present; refusing to modify app.js');
}

const repaired = source.slice(0, widgetStart) + '\n' + source.slice(end);
fs.writeFileSync(file, repaired, 'utf8');

const verify = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
if (verify.status !== 0) {
  fs.writeFileSync(file, source, 'utf8');
  console.error(verify.stderr || verify.stdout || 'Unknown post-repair syntax failure');
  throw new Error('PUBLIC_APP_REPAIR: repair did not produce syntactically valid app.js; original restored');
}

console.log('PUBLIC_APP_REPAIR: orphaned widget block removed and app.js syntax verified');
