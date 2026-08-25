import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');

function syntaxCheck() {
  return spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
}

let syntax = syntaxCheck();
if (syntax.status === 0) {
  console.log('PUBLIC_APP_REPAIR: app.js syntax already clean; no repair required');
  process.exit(0);
}

let removed = 0;
while (true) {
  const marker = 'window.openCopilot = window.openIinshaChatWindow;';
  const markerPos = source.indexOf(marker);
  if (markerPos < 0) break;

  const widgetStart = source.indexOf('widget.style.cssText', markerPos);
  if (widgetStart < 0) break;

  const templateClose = source.indexOf('\n    `;\n}', widgetStart);
  if (templateClose < 0) break;

  const end = templateClose + '\n    `;\n}'.length;
  source = source.slice(0, widgetStart) + '\n' + source.slice(end);
  removed += 1;
}

if (removed === 0) {
  console.error(syntax.stderr || syntax.stdout || 'Unknown JavaScript syntax failure');
  throw new Error('PUBLIC_APP_REPAIR: syntax failure exists but no known orphan widget block could be safely located');
}

fs.writeFileSync(file, source, 'utf8');
syntax = syntaxCheck();
if (syntax.status !== 0) {
  console.error(syntax.stderr || syntax.stdout || 'Unknown post-repair syntax failure');
  throw new Error(`PUBLIC_APP_REPAIR: removed ${removed} orphan block(s) but app.js is still syntactically invalid`);
}

console.log(`PUBLIC_APP_REPAIR: removed ${removed} orphan widget block(s); app.js syntax PASS`);
