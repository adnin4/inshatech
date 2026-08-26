#!/usr/bin/env node

const BASE = process.env.BASE_URL || 'https://inshatech.pages.dev';

const routes = [
  '/',
  '/marketplace',
  '/compare',
  '/blog',
  '/store',
  '/portal',
  '/affiliate',
  '/affiliate-login',
  '/affiliate-dashboard',
  '/admin',
  '/api/sre/health',
  '/api/version',
];

const failures = [];

for (const route of routes) {
  const url = new URL(route, BASE).toString();
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'IINSHA-public-surface-smoke/1.0' },
    });
    if (response.status < 200 || response.status >= 400) {
      failures.push(`${route}: HTTP ${response.status}`);
    }
  } catch (error) {
    failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length) {
  console.error('PUBLIC_SURFACE_SMOKE=FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PUBLIC_SURFACE_SMOKE=PASS (${routes.length}/${routes.length})`);
