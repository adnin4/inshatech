#!/usr/bin/env node
/**
 * IINSHA live truth gate.
 * Safe/non-destructive: reads only public HTTP surfaces.
 * Requires LIVE_URL and EXPECTED_SHA in CI; defaults to production URL.
 */

const baseUrl = (process.env.LIVE_URL || 'https://inshatech.pages.dev').replace(/\/$/, '');
const expectedSha = process.env.EXPECTED_SHA || process.env.GITHUB_SHA || '';
const timeoutMs = Number(process.env.LIVE_TIMEOUT_MS || 15000);
const attempts = Number(process.env.LIVE_ATTEMPTS || 18);
const delayMs = Number(process.env.LIVE_RETRY_DELAY_MS || 10000);

const routes = [
  '/',
  '/store.html',
  '/marketplace.html',
  '/compare.html',
  '/blog.html',
  '/portal.html',
  '/admin.html',
  '/affiliate.html',
  '/affiliate-login.html',
  '/affiliate-dashboard.html',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'manual',
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function readText(response) {
  try {
    return await response.text();
  } catch {
    return '';
  }
}

async function getJson(url) {
  const response = await fetchWithTimeout(url, {
    headers: { accept: 'application/json' },
  });
  const text = await readText(response);
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Keep null so the caller can produce a useful diagnostic.
  }
  return { response, json };
}

async function verifyVersion() {
  const url = `${baseUrl}/api/version`;
  const { response, json } = await getJson(url);
  const actualSha = json?.git_sha || json?.commit_sha || json?.sha || '';
  return {
    url,
    status: response.status,
    actualSha,
    expectedSha,
    pass: response.status === 200 && !!actualSha && (!expectedSha || actualSha === expectedSha),
  };
}

async function verifyRoutes() {
  const results = [];
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { accept: 'text/html,application/xhtml+xml' },
      });
      const body = await readText(response);
      const location = response.headers.get('location');
      results.push({
        route,
        status: response.status,
        location,
        bytes: Buffer.byteLength(body, 'utf8'),
        pass: response.status === 200 && !location && body.length > 0,
      });
    } catch (error) {
      results.push({
        route,
        status: 0,
        location: null,
        bytes: 0,
        pass: false,
        error: error?.message || String(error),
      });
    }
  }
  return results;
}

async function main() {
  if (process.env.SKIP_LIVE_TRUTH === '1') {
    console.log('LIVE_TRUTH_SKIP_REQUESTED');
    process.exit(0);
  }

  if (!expectedSha && process.env.CI === 'true') {
    console.error('ERROR: EXPECTED_SHA/GITHUB_SHA is required in CI.');
    process.exit(1);
  }

  let lastFailure = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const version = await verifyVersion();
      const routesResult = await verifyRoutes();
      const routesPass = routesResult.every((entry) => entry.pass);
      const overall = version.pass && routesPass;

      console.log(JSON.stringify({
        attempt,
        baseUrl,
        expectedSha,
        version,
        routes: routesResult,
        overall,
      }, null, 2));

      if (overall) {
        console.log('LIVE_TRUTH_PASS');
        process.exit(0);
      }

      lastFailure = { version, routes: routesResult };
    } catch (error) {
      lastFailure = { error: error?.message || String(error) };
      console.error(`attempt=${attempt} live-truth error=${lastFailure.error}`);
    }

    if (attempt < attempts) await sleep(delayMs);
  }

  console.error(JSON.stringify({
    error: 'LIVE_TRUTH_FAIL',
    baseUrl,
    expectedSha,
    lastFailure,
  }, null, 2));
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
