import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const EXCLUDED = new Set(['.git', 'node_modules', 'scratch', 'cloudflare_pages_dist', 'build', 'dist', 'public', 'static_dist', '.wrangler']);
const EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);
const failures = [];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failures.push({ file: rel, stderr: (result.stderr || '').trim(), stdout: (result.stdout || '').trim() });
  }
}

console.log(JSON.stringify({ checked: walk(ROOT).length, failures }, null, 2));
if (failures.length) {
  console.error(`JAVASCRIPT_SYNTAX_GATE: FAIL (${failures.length})`);
  process.exit(1);
}
console.log('JAVASCRIPT_SYNTAX_GATE: PASS');
