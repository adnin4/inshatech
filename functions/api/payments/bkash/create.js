/**
 * Cloudflare Pages Function: /api/payments/bkash/create
 * bKash Mode 0011 Tokenized Checkout Payment Creation Official Endpoint
 * Upstream API: https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create
 */

const RATE_BDT = 122.50;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://inshatech.pages.dev",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
};

export async function onRequestPost({ request, env = {} }) {
    try {
        const appKey = env.BKASH_APP_KEY;
        const appSecret = env.BKASH_APP_SECRET;
        const username = env.BKASH_USERNAME;
        const password = env.BKASH_PASSWORD;
        const isLive = env.BKASH_IS_LIVE !== 'false';

        if (!appKey || !appSecret || !username || !password) {
            return new Response(JSON.stringify({
                status: 'NOT_CONFIGURED',
                provider: 'bKash Tokenized',
                message: 'BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_USERNAME, and BKASH_PASSWORD required in Cloudflare Secrets.',
                code: 'CREDENTIALS_MISSING'
            }), { status: 422, headers: CORS_HEADERS });
        }

        const body = await request.json().catch(() => ({}));
        const orderId = String(body.order_id || body.invoice_number || `ORD-${Date.now().toString(36).toUpperCase()}`);
        const amountBdt = body.amount_bdt ? Number(body.amount_bdt) : Math.round((Number(body.amount_usd) || 100) * RATE_BDT);

        const baseUrl = isLive 
            ? 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout' 
            : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout';

        // 1. Grant Token
        const tokenRes = await fetch(`${baseUrl}/token/grant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'username': username,
                'password': password
            },
            body: JSON.stringify({ app_key: appKey, app_secret: appSecret })
        });
        const tokenData = await tokenRes.json().catch(() => ({}));

        if (!tokenData.id_token) {
            return new Response(JSON.stringify({
                status: 'BKASH_AUTH_FAILED',
                message: tokenData.statusMessage || 'Failed to authenticate with bKash API'
            }), { status: 502, headers: CORS_HEADERS });
        }

        // 2. Create Payment Session
        const createRes = await fetch(`${baseUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': tokenData.id_token,
                'X-APP-Key': appKey
            },
            body: JSON.stringify({
                mode: '0011',
                payerReference: String(body.customer_phone || '+8801629286887'),
                callbackURL: `https://inshatech.pages.dev/api/payments/bkash/callback`,
                amount: amountBdt.toString(),
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: orderId
            })
        });

        const createData = await createRes.json().catch(() => ({}));

        if (createData.statusCode === '0000' && createData.bkashURL) {
            return new Response(JSON.stringify({
                status: 'SUCCESS',
                provider: 'bKash Tokenized',
                order_id: orderId,
                payment_id: createData.paymentID,
                redirect_url: createData.bkashURL,
                amount_bdt: amountBdt
            }), { status: 200, headers: CORS_HEADERS });
        } else {
            return new Response(JSON.stringify({
                status: 'GATEWAY_INITIATION_FAILED',
                provider: 'bKash',
                error: createData.statusMessage || 'Failed to initialize bKash checkout session'
            }), { status: 502, headers: CORS_HEADERS });
        }

    } catch (err) {
        return new Response(JSON.stringify({ status: 'SERVER_ERROR', message: err.message }), { status: 500, headers: CORS_HEADERS });
    }
}

export function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
