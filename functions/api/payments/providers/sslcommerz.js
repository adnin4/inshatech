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

    /**
     * Server-side Refund Initiation API (Call when authorized refund requested)
     */
    async initiateRefund({ bankTranId, refundAmount, refundRemarks }) {
        if (!bankTranId || !refundAmount) {
            return { ok: false, error: 'BANK_TRAN_ID_AND_AMOUNT_REQUIRED' };
        }
        if (!this.isConfigured()) {
            return { ok: false, error: 'CONFIGURATION_REQUIRED' };
        }

        const endpoint = `${this.baseUrl}/validator/api/merchantTransIDvalidationAPI.php?bank_tran_id=${encodeURIComponent(bankTranId)}&refund_amount=${encodeURIComponent(refundAmount)}&refund_remarks=${encodeURIComponent(refundRemarks || 'Customer Refund')}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePasswd)}&format=json`;

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            const isSuccess = data.status === 'success' || data.status === 'SUCCESS';
            return {
                ok: isSuccess,
                status: data.status,
                refundRefId: data.refund_ref_id,
                raw: data
            };
        } catch (e) {
            return {
                ok: false,
                error: `Refund API request failed: ${e.message}`
            };
        }
    }

    /**
     * Query Refund Status API
     */
    async queryRefundStatus({ refundRefId }) {
        if (!refundRefId) {
            return { ok: false, error: 'REFUND_REF_ID_REQUIRED' };
        }
        if (!this.isConfigured()) {
            return { ok: false, error: 'CONFIGURATION_REQUIRED' };
        }

        const endpoint = `${this.baseUrl}/validator/api/merchantTransIDvalidationAPI.php?refund_ref_id=${encodeURIComponent(refundRefId)}&store_id=${encodeURIComponent(this.storeId)}&store_passwd=${encodeURIComponent(this.storePasswd)}&format=json`;

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            return {
                ok: true,
                status: data.status,
                raw: data
            };
        } catch (e) {
            return {
                ok: false,
                error: `Query refund status failed: ${e.message}`
            };
        }
    }

    /**
     * Verify IPN Hash (verify_sign)
     * SSLCommerz calculates verify_sign as MD5(key1=val1&key2=val2...&store_passwd_md5)
     * where keys are sorted alphabetically from verify_key list.
     */
    verifyIPNHash(params = {}) {
        const verifySign = params.verify_sign;
        const verifyKeyList = params.verify_key;
        if (!verifySign || !verifyKeyList) {
            return { ok: false, error: 'VERIFY_SIGN_OR_KEY_MISSING' };
        }
        if (!this.storePasswd) {
            return { ok: false, error: 'STORE_PASSWD_REQUIRED' };
        }

        const keys = String(verifyKeyList).split(',').map(k => k.trim()).filter(Boolean).sort();
        const kvPairs = [];
        for (const k of keys) {
            if (k in params) {
                kvPairs.push(`${k}=${params[k]}`);
            }
        }

        const storePasswdHash = computeMd5(this.storePasswd);
        kvPairs.push(`store_passwd=${storePasswdHash}`);
        const stringToHash = kvPairs.join('&');
        const calculatedSign = computeMd5(stringToHash);

        return {
            ok: calculatedSign.toLowerCase() === String(verifySign).toLowerCase(),
            calculatedSign,
            expectedSign: verifySign
        };
    }
}

/**
 * Pure JavaScript MD5 Implementation (compatible with Cloudflare Workers runtime)
 */
export function computeMd5(string) {
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
        const lX4 = lX & 0x40000000;
        const lY4 = lY & 0x40000000;
        const lX8 = lX & 0x80000000;
        const lY8 = lY & 0x80000000;
        const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
        if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        if (lX4 | lY4) {
            if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
            return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
        return lResult ^ lX8 ^ lY8;
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return x ^ y ^ z; }
    function I(x, y, z) { return y ^ (x | (~z)); }

    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(str) {
        let lWordCount;
        const lMessageLength = str.length;
        const lNumberOfWords_temp1 = lMessageLength + 8;
        const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        const lWordArray = new Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }

    function wordToHex(lValue) {
        let wordToHexValue = '', wordToHexValue_temp = '', lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            wordToHexValue_temp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
    }

    const x = convertToWordArray(unescape(encodeURIComponent(string)));
    let a = 0x67452301;
    let b = 0xefcdab89;
    let c = 0x98badcfe;
    let d = 0x10325476;

    for (let k = 0; k < x.length; k += 16) {
        const AA = a; const BB = b; const CC = c; const DD = d;
        a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478);
        d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756);
        c = FF(c, d, a, b, x[k + 2], 17, 0x242070db);
        b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
        a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf);
        d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a);
        c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613);
        b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
        a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8);
        d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af);
        c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1);
        b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
        a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122);
        d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193);
        c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e);
        b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);

        a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562);
        d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340);
        c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51);
        b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
        a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d);
        d = GG(d, a, b, c, x[k + 10], 9, 0x02441453);
        c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681);
        b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
        a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6);
        d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6);
        c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87);
        b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
        a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905);
        d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8);
        c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9);
        b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);

        a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942);
        d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681);
        c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122);
        b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
        a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44);
        d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9);
        c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60);
        b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
        a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6);
        d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa);
        c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085);
        b = HH(b, c, d, a, x[k + 6], 23, 0x04881d05);
        a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039);
        d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5);
        c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8);
        b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);

        a = II(a, b, c, d, x[k + 0], 6, 0xf4292244);
        d = II(d, a, b, c, x[k + 7], 10, 0x432aff97);
        c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7);
        b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
        a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3);
        d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92);
        c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d);
        b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
        a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f);
        d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0);
        c = II(c, d, a, b, x[k + 6], 15, 0xa3014314);
        b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
        a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82);
        d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235);
        c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb);
        b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);

        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }

    return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}


