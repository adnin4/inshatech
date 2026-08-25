/**
 * SSLCommerz Official Production Gateway Integration — Session Initialization
 * Upstream API: https://securepay.sslcommerz.com/gwprocess/v4/api.php
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://inshatech.pages.dev',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
};

export async function onRequestPost({ request, env = {} }) {
    try {
        const storeId = env.SSLCOMMERZ_STORE_ID;
        const storePass = env.SSLCOMMERZ_STORE_PASSWORD;
        const isLive = env.SSLCOMMERZ_IS_LIVE !== 'false';

        if (!storeId || !storePass) {
            return new Response(JSON.stringify({
                status: 'NOT_CONFIGURED',
                provider: 'SSLCommerz',
                message: 'SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD required in Cloudflare Environment Secrets.',
                code: 'CREDENTIALS_MISSING'
            }), { status: 422, headers: CORS_HEADERS });
        }

        const body = await request.json().catch(() => ({}));
        const orderId = String(body.order_id || `ORD-${Date.now().toString(36).toUpperCase()}`);
        const amountBdt = Number(body.amount_bdt || 0);

        if (amountBdt <= 0) {
            return new Response(JSON.stringify({ status: 'INVALID_AMOUNT', message: 'Amount in BDT must be greater than 0' }), { status: 400, headers: CORS_HEADERS });
        }

        const endpoint = isLive 
            ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php' 
            : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

        const postData = new URLSearchParams({
            store_id: storeId,
            store_passwd: storePass,
            total_amount: amountBdt.toString(),
            currency: 'BDT',
            tran_id: orderId,
            success_url: `https://inshatech.pages.dev/api/payments/sslcommerz/validate?status=success&order_id=${orderId}`,
            fail_url: `https://inshatech.pages.dev/api/payments/sslcommerz/validate?status=fail&order_id=${orderId}`,
            cancel_url: `https://inshatech.pages.dev/store.html?canceled=true&order_id=${orderId}`,
            ipn_url: `https://inshatech.pages.dev/api/payments/webhook?provider=sslcommerz`,
            cus_name: String(body.customer_name || 'Valued Client').slice(0, 255),
            cus_email: String(body.customer_email || 'client@inshatech.com').slice(0, 255),
            cus_add1: 'Dhaka, Bangladesh',
            cus_city: 'Dhaka',
            cus_country: 'Bangladesh',
            cus_phone: String(body.customer_phone || '+8801629286887').slice(0, 50),
            shipping_method: 'NO',
            product_name: String(body.service_title || 'IINSHA AI Automation Service'),
            product_category: 'AI Software & Automation',
            product_profile: 'non-physical-goods'
        });

        const upstreamRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: postData.toString()
        });

        const data = await upstreamRes.json().catch(() => ({}));

        if (data.status === 'SUCCESS' && data.GatewayPageURL) {
            return new Response(JSON.stringify({
                status: 'SUCCESS',
                provider: 'SSLCommerz',
                order_id: orderId,
                sessionkey: data.sessionkey,
                redirect_url: data.GatewayPageURL,
                amount_bdt: amountBdt
            }), { status: 200, headers: CORS_HEADERS });
        } else {
            return new Response(JSON.stringify({
                status: 'GATEWAY_INITIATION_FAILED',
                provider: 'SSLCommerz',
                error_reason: data.failedreason || 'Failed to initialize payment session with SSLCommerz'
            }), { status: 502, headers: CORS_HEADERS });
        }

    } catch (err) {
        return new Response(JSON.stringify({ status: 'SERVER_ERROR', message: err.message }), { status: 500, headers: CORS_HEADERS });
    }
}

export function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
