import fs from 'node:fs';

const returnSource = fs.readFileSync('functions/api/payments/return.js', 'utf8');
const middlewareSource = fs.readFileSync('functions/api/payments/_middleware.js', 'utf8');

const requiredReturnMarkers = [
  'export async function onRequestGet',
  'payment_return',
  'Response.redirect',
  'export async function onRequestPost',
  'METHOD_NOT_ALLOWED',
  'Payment confirmation is handled by the provider webhook/IPN'
];

for (const marker of requiredReturnMarkers) {
  if (!returnSource.includes(marker)) {
    throw new Error(`Missing browser-return contract marker: ${marker}`);
  }
}

if (returnSource.includes("payment_status: 'paid'") || returnSource.includes('payment_status = paid')) {
  throw new Error('Browser return endpoint must never mutate payment state.');
}

const middlewareMarkers = [
  "request.method === 'GET'",
  "url.pathname === '/api/payments/webhook'",
  "return Response.redirect",
  'return next();'
];

for (const marker of middlewareMarkers) {
  if (!middlewareSource.includes(marker)) {
    throw new Error(`Missing legacy browser-return boundary marker: ${marker}`);
  }
}

console.log('PAYMENT_BROWSER_RETURN_CONTRACT=PASS');
