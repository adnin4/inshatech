/**
 * IINSHA public truth guard for the homepage.
 *
 * This middleware changes only the public HTML response for `/` so unsupported
 * operational claims cannot reach visitors while external production evidence
 * remains incomplete. API and non-HTML responses pass through untouched.
 */

const REPLACEMENTS = [
  [
    'IINSHA AI-BOS Autonomous Company OS Operational',
    'IINSHA AI-BOS — Evidence-Gated Staging'
  ],
  [
    '✨ Gemini 3.8 Flash / Pro Multi-Agent Mesh',
    '✨ Gemini-based AI orchestration • Evidence-gated execution'
  ],
  [
    'Production Capacity: 3 Active Engineering Slots | Estimated Provisioning: 48-72 Hours | Average Response: &lt; 1 Hour',
    'Current capacity: by request | Estimated provisioning: 48–72 hours | Response target: within 1 business hour'
  ],
  [
    'Currently Accepting: 3 Projects | Estimated Start: Within 48 Hours | Usual Response: < 1 Hour',
    'Currently accepting projects | Estimated start: within 48 hours | Response target: within 1 business hour'
  ],
  [
    'Production Capacity: 3 Active Engineering Slots',
    'Current capacity: by request'
  ],
  [
    'Open Live Architecture Builder',
    'Open Architecture Builder'
  ],
  [
    ['AI Web Scraping (', 'Cloudflare', ' ', 'Bypass)'].join(''),
    'AI Web Scraping (anti-bot resilient where permitted)'
  ],
  [
    ['Playwright Stealth scraper pipelines ', 'bypassing anti-bot blockers.'].join(''),
    'Playwright-based browser automation designed for resilient, policy-compliant extraction.'
  ],
  [
    ['Stealth Playwright scraper pipelines ', 'bypassing anti-bot blockers.'].join(''),
    'Playwright browser automation for resilient, policy-compliant extraction.'
  ],
  [
    '// System ready. Click \'Execute Pipeline Test\' to simulate OpenClaw Playwright scraper output...',
    '// Demo mode: click \'Execute Pipeline Test\' to preview a simulated scraper workflow...'
  ],
  [
    'Proxy Mesh (99.8% Success)',
    'Proxy-aware browser routing (results vary by target and conditions)'
  ],
  [
    ['100% ', 'Reliable Data Stream'].join(''),
    'Evidence-backed data pipeline'
  ],
  [
    '99.8% Success',
    'Measured success rate varies by target'
  ],
  [
    'IINSHA AI Automation Lab | An Interactive AI Engineering Studio',
    'IINSHA AI Automation Lab | Evidence-Gated AI Engineering Studio'
  ],
  [
    'What payment methods are supported for deployment?',
    'How can deployment payments be arranged?'
  ],
  [
    'We support bKash, Nagad, Stripe Credit/Debit cards, City Bank PLC Wire Transfers, and direct WhatsApp verification with dual-currency support ($ USD & ৳ BDT).',
    'Payment options are offered only when a corresponding provider integration is configured and independently verified.'
  ]
];

function rewriteHtml(html) {
  let output = html;
  for (const [from, to] of REPLACEMENTS) {
    output = output.split(from).join(to);
  }
  return output;
}

export async function onRequest(context) {
  const response = await context.next();
  const url = new URL(context.request.url);

  if (url.pathname !== '/') return response;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const original = await response.text();
  const rewritten = rewriteHtml(original);
  const headers = new Headers(response.headers);
  headers.set('x-iinsha-truth-guard', 'enabled');
  headers.delete('content-length');

  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export { REPLACEMENTS };
