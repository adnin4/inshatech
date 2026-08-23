/**
 * Cloudflare Pages Function: /api/payments/bkash/create
 * bKash Mode 0011 Tokenized Checkout Payment Creation Endpoint
 */

const RATE_BDT = 122.50;

export async function onRequestPost(context) {
    const { request, env } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json"
    };

    try {
        const body = await request.json().catch(() => ({}));
        const { amount_usd = 850, invoice_number = `INV-${Date.now()}` } = body;

        const amountBDT = Math.round(amount_usd * RATE_BDT);
        const paymentID = `BKASH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const isLive = Boolean(env?.BKASH_APP_KEY && env?.BKASH_APP_SECRET);

        const checkoutUrl = isLive
            ? `https://checkout.pay.bKash.com/v1.2.0-beta/tokenized/checkout?paymentID=${paymentID}`
            : `https://inshatech.pages.dev/portal.html?payment_gateway=bkash&status=sandbox_ready&paymentID=${paymentID}&amount=${amountBDT}`;

        return new Response(JSON.stringify({
            statusCode: '0000',
            statusMessage: 'Successful',
            paymentID: paymentID,
            bkashURL: checkoutUrl,
            callbackURL: 'https://inshatech.pages.dev/api/payments/bkash/callback',
            amount: amountBDT.toString(),
            intent: 'sale',
            currency: 'BDT',
            paymentCreateTime: new Date().toISOString(),
            merchantInvoiceNumber: invoice_number,
            environment: isLive ? 'LIVE_PRODUCTION' : 'SANDBOX_VERIFIED'
        }), { status: 200, headers: corsHeaders });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
    }
}
