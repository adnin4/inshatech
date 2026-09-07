/**
 * SSLCommerz Native Provider Adapter (Bangladesh & International Payment Gateway)
 *
 * Strict Architectural Invariants:
 * 1. Customer browser redirects (success_url/fail_url/cancel_url) target the read-only /api/payments/return endpoint.
 * 2. ONLY server-to-server IPN (ipn_url targeting /api/payments/webhook) is permitted to confirm payment.
 * 3. IPN callback data MUST be verified by calling the SSLCommerz Order Validation API before state mutation.
 * 4. Exact amount, currency, tran_id (order_code), and store identity MUST match before marking PAID.
 */

export class SSLCommerzAdapter {
    constructor(env = {}) {
        this.storeId = env.SSLCOMMERZ_STORE_ID || '';
        this.storePasswd = env.SSLCOMMERZ_STORE_PASSWORD || '';
        this.isLive = String(env.SSLCOMMERZ_IS_LIVE || '').toLowerCase() === 'true';
        this.baseUrl = this.isLive
            ? 'https://securepay.sslcommerz.com'
            : 'https://sandbox.sslcommerz.com';
    }

    isConfigured() {
        return Boolean(this.storeId && this.storePasswd);
    }

    /**
     * Create SSLCommerz Hosted Checkout Session
     */
    async initCheckoutSession({
        orderCode,
        amount,
        currency = 'BDT',
        customerName,
        customerEmail,
        customerPhone,
        serviceName,
        appBaseUrl = 'https://inshatech.pages.dev'
    }) {
        if (!this.isConfigured()) {
            return {
                ok: false,
                status: 'CONFIGURATION_REQUIRED',
                error: 'SSLCommerz credentials (STORE_ID and STORE_PASSWORD) not configured.'
            };
        }

        const endpoint = `${this.baseUrl}/gwprocess/v4/api.php`;
        const params = new URLSearchParams();

        // Credentials
        params.append('store_id', this.storeId);
        params.append('store_passwd', this.storePasswd);

        // Transaction & Amounts
        params.append('total_amount', String(amount));
        params.append('currency', currency.toUpperCase());
        params.append('tran_id', orderCode);

        // Architectural Boundary: Browser URLs must be READ-ONLY return
        params.append('success_url', `${appBaseUrl}/api/payments/return?provider=sslcommerz&status=success&order_id=${encodeURIComponent(orderCode)}`);
        params.append('fail_url', `${appBaseUrl}/api/payments/return?provider=sslcommerz&status=failed&order_id=${encodeURIComponent(orderCode)}`);
        params.append('cancel_url', `${appBaseUrl}/api/payments/return?provider=sslcommerz&status=cancelled&order_id=${encodeURIComponent(orderCode)}`);

        // Server-to-Server IPN URL for authoritative mutation
        params.append('ipn_url', `${appBaseUrl}/api/payments/webhook?provider=sslcommerz`);

        // Customer Info
        params.append('cus_name', customerName || 'Valued Client');
        params.append('cus_email', customerEmail || 'client@inshatech.com');
        params.append('cus_add1', 'Dhaka');
        params.append('cus_city', 'Dhaka');
        params.append('cus_country', 'Bangladesh');
        params.append('cus_phone', customerPhone || '+8801629286887');

        // Product Details
        params.append('product_name', serviceName || 'IINSHA AI Automation System');
        params.append('product_category', 'AI Software');
        params.append('product_profile', 'digital-goods');

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            const data = await res.json();
            if (data.status === 'SUCCESS' && data.GatewayPageURL) {
                return {
                    ok: true,
                    sessionKey: data.sessionkey,
                    gatewayUrl: data.GatewayPageURL,
                    orderCode
                };
            }

            return {
                ok: false,
                status: 'GATEWAY_ERROR',
                error: data.failedreason || 'Failed to initialize payment gateway.'
            };
        } catch (e) {
            return {
                ok: false,
                status: 'NETWORK_ERROR',
                error: e.message
            };
        }
    }

    /**
     * Server-side Validation API Verification (Call during IPN processing)
     */
    async validatePayment({ valId }) {
        if (!valId) {
            return { ok: false, error: 'VAL_ID_REQUIRED' };
        }
        if (!this.isConfigured()) {
            return { ok: false, error: 'CONFIGURATION_REQUIRED' };
        }

        const endpoint = `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(valId)}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePasswd)}&format=json`;

        try {
            const res = await fetch(endpoint);
            const data = await res.json();

            const isValid = data.status === 'VALID' || data.status === 'VALIDATED';
            return {
                ok: isValid,
                status: data.status,
                tranId: data.tran_id,
                valId: data.val_id,
                amount: parseFloat(data.amount || '0'),
                currency: data.currency,
                cardType: data.card_type,
                bankTranId: data.bank_tran_id,
                tranDate: data.tran_date,
                raw: data
            };
        } catch (e) {
            return {
                ok: false,
                error: `Validation API request failed: ${e.message}`
            };
        }
    }
}
