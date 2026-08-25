import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const file = 'app.js';
let source = fs.readFileSync(file, 'utf8');
const original = source;

function syntaxCheck() {
  return spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
}

let syntax = syntaxCheck();
if (syntax.status === 0) {
  console.log('PUBLIC_APP_REPAIR: app.js syntax already clean; no repair required');
  process.exit(0);
}

let changed = false;

// Repair duplicate orphan floating-widget blocks safely.
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
  changed = true;
}

// Repair a known generator defect that emits invalid conditional expressions like:
// const x = ((document.getElementById('field') ? document.getElementById('field')?.value || '') : "");
// Only this exact shape is rewritten; other source is left untouched.
const malformedTernary = /const\s+(\w+)\s*=\s*\(\(document\.getElementById\('([^']+)'\)\s*\?\s*document\.getElementById\('\2'\)\?\.value\s*\|\|\s*''\)\s*:\s*""\);/g;
const repairedSource = source.replace(malformedTernary, "const $1 = document.getElementById('$2')?.value || '';" );
if (repairedSource !== source) {
  source = repairedSource;
  changed = true;
}

if (!changed) {
  console.error(syntax.stderr || syntax.stdout || 'Unknown JavaScript syntax failure');
  throw new Error('PUBLIC_APP_REPAIR: syntax failure exists but no known safe repair pattern was found');
}

fs.writeFileSync(file, source, 'utf8');
syntax = syntaxCheck();
if (syntax.status !== 0) {
  fs.writeFileSync(file, original, 'utf8');
  console.error(syntax.stderr || syntax.stdout || 'Unknown post-repair syntax failure');
  throw new Error('PUBLIC_APP_REPAIR: repair produced invalid app.js; original restored');
}

console.log('PUBLIC_APP_REPAIR: known safe public-app defects repaired; syntax PASS');
