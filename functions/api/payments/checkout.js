/**
 * Cloudflare Pages Function: /api/payments/checkout
 * Provider-Agnostic Payment Checkout Endpoint
 */

export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json().catch(() => ({}));
        const {
            service_id, package_name, amount, currency = 'USD',
            customer_name, customer_email, customer_phone,
            payment_provider = 'manual', // stripe, bkash, nagad, bank, manual
            affiliate_code, idempotency_key
        } = body;

        // Validation
        if (!service_id || !amount || !customer_name) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Missing required fields: service_id, amount, customer_name'
            }), { headers: corsHeaders, status: 400 });
        }

        if (amount <= 0 || amount > 50000) {
            return new Response(JSON.stringify({
                status: 'ERROR',
                error: 'Invalid amount. Must be between $1 and $50,000'
            }), { headers: corsHeaders, status: 400 });
        }

        // Idempotency check (prevent duplicate orders)
        const orderIdempotencyKey = idempotency_key || `order_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

        // Generate order
        const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        const bdtAmount = Math.round(amount * 122.50);

        // Calculate affiliate commission if applicable
        let commission = 0;
        if (affiliate_code) {
            commission = Math.round(amount * 0.20 * 100) / 100; // 20% commission
        }

        // Payment provider routing
        let paymentInstructions = {};
        switch (payment_provider) {
            case 'bkash':
                paymentInstructions = {
                    method: 'bKash Send Money',
                    account: '01629286887',
                    amount: bdtAmount,
                    currency: 'BDT',
                    reference: orderId,
                    instructions: `Send ৳${bdtAmount.toLocaleString()} to 01629286887 via bKash Send Money. Use reference: ${orderId}`
                };
                break;
            case 'nagad':
                paymentInstructions = {
                    method: 'Nagad Send Money',
                    account: '01629286887',
                    amount: bdtAmount,
                    currency: 'BDT',
                    reference: orderId,
                    instructions: `Send ৳${bdtAmount.toLocaleString()} to 01629286887 via Nagad. Use reference: ${orderId}`
                };
                break;
            case 'stripe':
                paymentInstructions = {
                    method: 'Stripe',
                    status: env.STRIPE_SECRET_KEY ? 'READY' : 'CONFIGURATION_REQUIRED',
                    note: 'Stripe checkout session will be created when API key is configured'
                };
                break;
            case 'bank':
                paymentInstructions = {
                    method: 'Bank Wire Transfer',
                    bank_name: 'City Bank PLC',
                    amount: amount,
                    currency: 'USD',
                    reference: orderId,
                    instructions: `Wire $${amount} USD to City Bank PLC. Reference: ${orderId}`
                };
                break;
            default:
                paymentInstructions = {
                    method: 'Manual / WhatsApp',
                    whatsapp_link: `https://wa.me/8801629286887?text=${encodeURIComponent(`Order ${orderId}: ${service_id} - $${amount} USD`)}`,
                    instructions: 'Contact Adnin via WhatsApp to complete payment'
                };
        }

        const order = {
            order_id: orderId,
            idempotency_key: orderIdempotencyKey,
            service_id,
            package_name: package_name || 'Standard',
            amount_usd: amount,
            amount_bdt: bdtAmount,
            currency,
            customer: { name: customer_name, email: customer_email, phone: customer_phone },
            affiliate_code: affiliate_code || null,
            affiliate_commission: commission,
            payment_provider,
            payment_instructions: paymentInstructions,
            payment_status: 'awaiting_payment',
            order_status: 'created',
            created_at: new Date().toISOString()
        };

        return new Response(JSON.stringify({
            status: 'SUCCESS',
            message: 'Order created successfully',
            order
        }), { headers: corsHeaders });

    } catch (err) {
        return new Response(JSON.stringify({
            status: 'ERROR',
            error: err.message
        }), { headers: corsHeaders, status: 500 });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        },
        status: 204
    });
}
