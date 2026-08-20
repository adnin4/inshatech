const liveBase = (process.env.LIVE_URL || 'https://inshatech.pages.dev').replace(/\/$/, '');
const expected = process.env.GITHUB_SHA || process.env.EXPECTED_SHA;
if (!expected) throw new Error('EXPECTED SHA is missing');

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 15000);
try {
  const response = await fetch(`${liveBase}/build-info.json?ts=${Date.now()}`, {
    headers: { 'cache-control': 'no-cache' },
    signal: controller.signal,
  });
  if (!response.ok) throw new Error(`Live build-info returned HTTP ${response.status}`);
  const body = await response.json();
  if (body.git_sha !== expected) {
    throw new Error(`LIVE SHA MISMATCH: expected ${expected}, got ${body.git_sha ?? 'missing'}`);
  }
  if (body.environment !== 'production') {
    throw new Error(`LIVE ENVIRONMENT MISMATCH: expected production, got ${body.environment ?? 'missing'}`);
  }
  console.log(`LIVE PARITY PASS: ${body.git_sha}`);
} finally {
  clearTimeout(timer);
}
