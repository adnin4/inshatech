const LIVE_URL = (process.env.LIVE_URL || 'https://inshatech.pages.dev').replace(/\/$/, '');
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 15000);

const coreRoutes = [
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

function withTimeout(ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

async function request(url, options = {}) {
  const { signal, done } = withTimeout();
  try {
    return await fetch(url, {
      redirect: 'manual',
      ...options,
      signal,
      headers: {
        'user-agent': 'IINSHA-live-surface-smoke/1.0',
        ...(options.headers || {}),
      },
    });
  } finally {
    done();
  }
}

function absoluteUrl(value) {
  try {
    return new URL(value, `${LIVE_URL}/`);
  } catch {
    return null;
  }
}

function isInternal(url) {
  return url && url.origin === new URL(LIVE_URL).origin;
}

function extract(html, regex) {
  return [...html.matchAll(regex)].map((m) => m[1]).filter(Boolean);
}

async function checkUrl(url, label) {
  try {
    const res = await request(url, { method: 'GET' });
    const ok = res.status >= 200 && res.status < 400;
    return { label, url, status: res.status, ok };
  } catch (error) {
    return { label, url, status: 0, ok: false, error: error?.message || String(error) };
  }
}

const homepage = await request(`${LIVE_URL}/`);
if (!homepage.ok) {
  throw new Error(`Homepage request failed: HTTP ${homepage.status}`);
}

const html = await homepage.text();
const hrefs = extract(html, /href=["']([^"']+)["']/gi);
const scriptSrcs = extract(html, /<script[^>]+src=["']([^"']+)["']/gi);
const deadTargets = hrefs.filter((href) => href === '#' || /^javascript:/i.test(href));

const internalLinks = [...new Set(hrefs
  .map(absoluteUrl)
  .filter(isInternal)
  .map((u) => `${u.pathname}${u.search}`))];

const routeUrls = [...new Set([
  ...coreRoutes,
  ...internalLinks,
  ...coreRoutes.filter((r) => r.startsWith('/') && !r.includes('/api/')).map((r) => `${r}.html`),
])];

const routeResults = [];
for (const path of routeUrls) {
  routeResults.push(await checkUrl(`${LIVE_URL}${path}`, `route:${path}`));
}

const assetResults = [];
for (const src of [...new Set(scriptSrcs)]) {
  const u = absoluteUrl(src);
  if (isInternal(u)) {
    assetResults.push(await checkUrl(u.href, `script:${src}`));
  }
}

const buttonCount = (html.match(/<button\b/gi) || []).length;
const formCount = (html.match(/<form\b/gi) || []).length;
const onclickCount = (html.match(/\bonclick\s*=\s*["']/gi) || []).length;

const failures = [...routeResults, ...assetResults].filter((r) => !r.ok);
const report = {
  generated_at: new Date().toISOString(),
  live_url: LIVE_URL,
  homepage: { status: homepage.status, ok: homepage.ok },
  core_routes: coreRoutes,
  internal_route_count: internalLinks.length,
  route_results: routeResults,
  asset_results: assetResults,
  interactive_surface: {
    buttons: buttonCount,
    forms: formCount,
    inline_handlers: onclickCount,
    obvious_dead_href_targets: deadTargets,
  },
  summary: {
    route_checks: routeResults.length,
    route_failures: routeResults.filter((r) => !r.ok).length,
    asset_checks: assetResults.length,
    asset_failures: assetResults.filter((r) => !r.ok).length,
    passed: failures.length === 0,
  },
};

console.log(JSON.stringify(report, null, 2));

if (deadTargets.length) {
  console.warn(`WARNING: ${deadTargets.length} homepage href target(s) are obvious placeholders: ${deadTargets.join(', ')}`);
}

if (failures.length) {
  console.error(`LIVE SURFACE FAIL: ${failures.length} route/asset check(s) failed.`);
  process.exit(1);
}

console.log('LIVE SURFACE PASS: homepage, core routes, internal links and internal scripts are reachable.');
