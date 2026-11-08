/**
 * Invoice API remains blocked until a durable order source, immutable invoice
 * records and a real PDF/object-storage renderer are configured.
 */
export async function onRequestPost() {
  return new Response(JSON.stringify({
    status: 'NOT_CONFIGURED',
    code: 'INVOICE_STORAGE_AND_RENDERER_NOT_CONFIGURED',
    message: 'No invoice was generated or stored. A persistent order source, tax policy and PDF renderer are required.'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
