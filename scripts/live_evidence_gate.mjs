#!/usr/bin/env node
const base = process.env.LIVE_BASE_URL || 'https://inshatech.pages.dev';
const routes = [
  '/', '/store.html', '/marketplace.html', '/portal.html', '/affiliate.html',
  '/affiliate-login.html', '/affiliate-dashboard.html', '/compare.html', '/blog.html'
];

const requiredHeaders = ['content-type'];
const results = [];
let hardFail = false;

for (const route of routes) {
  const url = new URL(route, base).toString();
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    const ok = res.ok && text.length > 100;
    results.push({ route, status: res.status, ok, bytes: text.length });
    if (!ok) hardFail = true;
    for (const h of requiredHeaders) {
      if (!res.headers.get(h)) hardFail = true;
    }
  } catch (err) {
    hardFail = true;
    results.push({ route, status: 'ERROR', ok: false, error: String(err) });
  }
}

console.log(JSON.stringify({
  live_base_url: base,
  checked_at: new Date().toISOString(),
  results,
  overall: hardFail ? 'FAIL' : 'PASS'
}, null, 2));

process.exit(hardFail ? 1 : 0);
