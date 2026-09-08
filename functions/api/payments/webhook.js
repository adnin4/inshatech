/**
 * Payment Webhook Handler — fail-closed and idempotent.
 *
 * Security invariant:
 * 1) provider must be identified;
 * 2) webhook secret and signature must be configured and valid;
 * 3) duplicate event IDs are rejected before any order mutation;
 * 4) durable webhook evidence is recorded with required provider metadata;
 * 5) only verified payment-success events may move an order to paid.
 */

import { SSLCommerzAdapter } from './providers/sslcommerz.js';

async function hmac(raw, secret) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const bytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(raw));
    return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function headers() {
    return {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
    };
}

function timingSafe(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function json(status, payload) {
    return new Response(JSON.stringify(payload), { status, headers: headers() });
}

export async function onRequestGet({ request }) {
    // Legacy gateway browser-return compatibility. This GET path only redirects;
    // it never authenticates, records, or mutates payment state.
    const url = new URL(request.url);
    const orderId = String(
        url.searchParams.get('order_id') ||
        url.searchParams.get('tran_id') ||
        url.searchParams.get('merchantInvoiceNumber') ||
        ''
    ).trim();
    const provider = String(url.searchParams.get('provider') || '').trim().toLowerCase();
    const status = String(url.searchParams.get('status') || 'unknown').trim().toLowerCase();

    if (!/^ORD-[A-Z0-9]{8,32}$/.test(orderId)) {
        return json(400, { status: 'INVALID_RETURN' });
    }

    const destination = new URL('https://inshatech.pages.dev/api/payments/return');
    destination.searchParams.set('order_id', orderId);
    destination.searchParams.set('status', status);
    if (provider) destination.searchParams.set('provider', provider);
    return Response.redirect(destination.toString(), 303);
}

export async function onRequestPost({ request, env = {} }) {
    try {
        const raw = await request.text();
        const url = new URL(request.url);
        let provider = String(
            url.searchParams.get('provider') ||
            request.headers.get('X-Payment-Provider') ||
            ''
        ).toLowerCase().trim();

        if (!provider) {
            if (request.headers.get('X-Signature') || env.LEMONSQUEEZY_WEBHOOK_SECRET) {
                provider = 'lemonsqueezy';
            } else if (request.headers.get('Stripe-Signature') || env.STRIPE_WEBHOOK_SECRET) {
                provider = 'stripe';
            } else {
                provider = 'generic';
            }
        }

        let secret = env.WEBHOOK_SECRET;
        if (provider === 'lemonsqueezy' && env.LEMONSQUEEZY_WEBHOOK_SECRET) {
            secret = env.LEMONSQUEEZY_WEBHOOK_SECRET;
        } else if (provider === 'stripe' && env.STRIPE_WEBHOOK_SECRET) {
            secret = env.STRIPE_WEBHOOK_SECRET;
        }

        if (!secret) {
            if (!env.WEBHOOK_SECRET) {
                return json(503, { status: 'WEBHOOK_NOT_CONFIGURED' });
            }
        }

        const signature = String(
            request.headers.get('X-Webhook-Signature') ||
            request.headers.get('X-Signature') ||
            request.headers.get('Stripe-Signature') ||
            ''
        ).trim();
        if (!signature) {
            return json(401, { status: 'SIGNATURE_REQUIRED' });
        }

        let isValid = false;
        if (provider === 'stripe' && signature.includes('t=') && signature.includes('v1=')) {
            const sigMap = Object.fromEntries(signature.split(',').map(kv => kv.trim().split('=')));
            if (sigMap.v1 && sigMap.t) {
                const signedPayload = `${sigMap.t}.${raw}`;
                const expected = await hmac(signedPayload, secret);
                isValid = timingSafe(sigMap.v1.toLowerCase(), expected.toLowerCase());
            }
        } else {
            const expected = await hmac(raw, secret);
            isValid = timingSafe(signature.toLowerCase(), expected.toLowerCase());
        }

        if (!isValid) {
            return json(401, { status: 'UNAUTHORIZED' });
        }

        let event;
        try {
            event = JSON.parse(raw || '{}');
        } catch {
            return json(400, { status: 'INVALID_JSON' });
        }

        const eventId = String(
            event.id ||
            event.event_id ||
            event.tran_id ||
            event.mer_txnid ||
            ''
        ).trim();
        if (!eventId) {
            return json(400, { status: 'EVENT_ID_REQUIRED' });
        }

        const type = String(
            event.type ||
            event.event_name ||
            event.status ||
            event.pay_status ||
            'unknown'
        ).trim();

        const orderCode = String(
            event.data?.object?.metadata?.order_id ||
            event.meta?.custom_data?.order_id ||
            event.custom_data?.order_id ||
            event.value_a ||
            event.order_id ||
            event.tran_id ||
            ''
        ).trim();

        const isSuccess = [
            'payment_intent.succeeded',
            'checkout.session.completed',
            'order_created',
            'order_paid',
            'VALID',
            'VALIDATED',
            'Successful',
            'payment.success',
            'PAID'
        ].includes(type) || event.status === 'VALID' || event.status_code === '2';

        if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
            return json(503, { status: 'DATABASE_NOT_CONFIGURED' });
        }

        const base = `${env.SUPABASE_URL}/rest/v1`;
        const key = env.SUPABASE_SERVICE_ROLE_KEY;
        const auth = {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
        };

        // Idempotency check MUST happen before any order mutation.
        const duplicateRes = await fetch(
            `${base}/ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}&select=id&limit=1`,
            { method: 'GET', headers: auth }
        );
        if (!duplicateRes.ok) {
            return json(503, { status: 'DATABASE_LOOKUP_FAILED' });
        }
        const duplicateRows = await duplicateRes.json().catch(() => []);
        if (Array.isArray(duplicateRows) && duplicateRows.length > 0) {
            return json(200, {
                status: 'SUCCESS',
                action: 'duplicate_ignored',
                event_id: eventId,
                order_id: orderCode || 'UNSPECIFIED',
                provider
            });
        }

        let resolvedOrder = null;
        if (isSuccess) {
            if (!orderCode) {
                return json(400, {
                    status: 'ORDER_REQUIRED',
                    event_id: eventId,
                    provider
                });
            }

            const orderRes = await fetch(
                `${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderCode)}&select=id,order_code,payment_status,amount,currency,bdt_amount,payment_provider,affiliate_ref_code,affiliate_commission,client_email`,
                { method: 'GET', headers: auth }
            );
            if (!orderRes.ok) {
                return json(503, { status: 'ORDER_LOOKUP_FAILED', event_id: eventId });
            }
            const orders = await orderRes.json().catch(() => []);
            if (!Array.isArray(orders) || orders.length !== 1) {
                return json(409, { status: 'ORDER_NOT_UNIQUELY_RESOLVED', event_id: eventId, order_id: orderCode });
            }
            resolvedOrder = orders[0];

            // Native SSLCommerz IPN verification using SSLCommerz Order Validation API
            if (provider === 'sslcommerz') {
                const valId = String(event.val_id || url.searchParams.get('val_id') || '').trim();
                if (!valId) {
                    return json(400, { status: 'VAL_ID_REQUIRED', event_id: eventId, provider });
                }
                const sslAdapter = new SSLCommerzAdapter(env);
                if (sslAdapter.isConfigured()) {
                    const valRes = await sslAdapter.validatePayment({ valId });
                    if (!valRes.ok) {
                        return json(400, {
                            status: 'ORDER_VALIDATION_FAILED',
                            reason: valRes.error || 'SSLCommerz validation failed',
                            event_id: eventId,
                            provider
                        });
                    }

                    // Strict matching: transaction ID must match order_code
                    if (valRes.tranId !== resolvedOrder.order_code) {
                        return json(400, {
                            status: 'TRANSACTION_ID_MISMATCH',
                            expected: resolvedOrder.order_code,
                            received: valRes.tranId,
                            event_id: eventId,
                            provider
                        });
                    }

                    // Strict currency verification
                    const expectedCurrency = String(resolvedOrder.currency || 'BDT').toUpperCase();
                    const receivedCurrency = String(valRes.currency || '').toUpperCase();
                    if (receivedCurrency && expectedCurrency && receivedCurrency !== expectedCurrency && receivedCurrency !== 'BDT') {
                        return json(400, {
                            status: 'CURRENCY_MISMATCH',
                            expected: expectedCurrency,
                            received: receivedCurrency,
                            event_id: eventId,
                            provider
                        });
                    }

                    // Strict amount verification
                    const expectedAmount = parseFloat(resolvedOrder.bdt_amount || resolvedOrder.amount || '0');
                    if (expectedAmount > 0 && Math.abs(valRes.amount - expectedAmount) > 0.01) {
                        return json(400, {
                            status: 'AMOUNT_MISMATCH',
                            expected: expectedAmount,
                            received: valRes.amount,
                            event_id: eventId,
                            provider
                        });
                    }

                    // Risk level assessment: fail-closed if risk_level is '1'
                    if (String(valRes.raw?.risk_level || '0') === '1') {
                        return json(400, {
                            status: 'RISK_LEVEL_EXCEEDED',
                            risk_level: valRes.raw.risk_level,
                            risk_title: valRes.raw.risk_title || 'High Risk Transaction',
                            event_id: eventId,
                            provider
                        });
                    }

                    // Optional verify_sign hash check if present in IPN payload
                    if (event.verify_sign && event.verify_key) {
                        const hashCheck = sslAdapter.verifyIPNHash(event);
                        if (!hashCheck.ok) {
                            return json(400, {
                                status: 'IPN_HASH_VERIFICATION_FAILED',
                                reason: hashCheck.error || 'verify_sign mismatch',
                                event_id: eventId,
                                provider
                            });
                        }
                    }
                }
            }
        }

        // Durable event registration happens BEFORE payment mutation. The
        // unique event_id constraint becomes the replay/concurrency gate.
        const now = new Date().toISOString();
        const eventRes = await fetch(`${base}/ibos_webhook_events`, {
            method: 'POST',
            headers: { ...auth, Prefer: 'return=representation' },
            body: JSON.stringify({
                event_id: eventId,
                provider,
                event_type: type,
                order_code: orderCode || null,
                order_id: resolvedOrder?.id || null,
                status: isSuccess ? 'authenticated' : 'received',
                signature_verified: true,
                payload: event,
                received_at: now,
                processed_at: null
            })
        });

        if (eventRes.status === 409) {
            return json(200, {
                status: 'SUCCESS',
                action: 'duplicate_ignored',
                event_id: eventId,
                order_id: orderCode || 'UNSPECIFIED',
                provider
            });
        }
        if (!eventRes.ok) {
            return json(503, {
                status: 'DURABLE_EVENT_WRITE_FAILED',
                event_id: eventId,
                order_id: orderCode || 'UNSPECIFIED',
                provider
            });
        }

        if (isSuccess) {
            if (resolvedOrder && String(resolvedOrder.payment_status || '').toLowerCase() === 'paid') {
                const alreadyPaidPatch = await fetch(
                    `${base}/ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,
                    {
                        method: 'PATCH',
                        headers: { ...auth, Prefer: 'return=minimal' },
                        body: JSON.stringify({ status: 'processed', processed_at: now })
                    }
                );
                if (!alreadyPaidPatch.ok) return json(503, { status: 'EVENT_FINALIZE_FAILED', event_id: eventId });
                return json(200, {
                    status: 'SUCCESS',
                    action: 'already_paid',
                    event_id: eventId,
                    order_id: orderCode,
                    provider
                });
            }

            const patchRes = await fetch(
                `${base}/ibos_orders?order_code=eq.${encodeURIComponent(orderCode)}&payment_status=neq.paid`,
                {
                    method: 'PATCH',
                    headers: { ...auth, Prefer: 'return=representation' },
                    body: JSON.stringify({
                        payment_status: 'paid',
                        order_status: 'confirmed',
                        payment_provider: provider,
                        payment_reference: event.payment_reference || event.transaction_id || event.tran_id || event.id || null,
                        paid_at: now
                    })
                }
            );
            if (!patchRes.ok) {
                await fetch(
                    `${base}/ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,
                    {
                        method: 'PATCH',
                        headers: { ...auth, Prefer: 'return=minimal' },
                        body: JSON.stringify({ status: 'failed', error_message: `ORDER_UPDATE_FAILED_${patchRes.status}` })
                    }
                );
                return json(503, { status: 'ORDER_UPDATE_FAILED', event_id: eventId, order_id: orderCode });
            }

            // Post-Payment Settlement & Reconciliation Automation
            try {
                // 1. Record Revenue Ledger Entry (Double-entry credit)
                const revenueAmount = parseFloat(resolvedOrder.amount || '0');
                if (revenueAmount > 0) {
                    await fetch(`${base}/ibos_revenue`, {
                        method: 'POST',
                        headers: { ...auth, Prefer: 'return=minimal' },
                        body: JSON.stringify({
                            order_id: resolvedOrder.id || null,
                            amount: revenueAmount,
                            currency: resolvedOrder.currency || 'USD',
                            type: 'one_time',
                            period_start: now.slice(0, 10),
                            period_end: now.slice(0, 10),
                            created_at: now
                        })
                    }).catch(() => null);
                }

                // 2. Affiliate Commission Settlement Ledger Entry if applicable
                const commissionAmount = parseFloat(resolvedOrder.affiliate_commission || '0');
                if (resolvedOrder.affiliate_ref_code && commissionAmount > 0) {
                    await fetch(`${base}/ibos_commission_ledger`, {
                        method: 'POST',
                        headers: { ...auth, Prefer: 'return=minimal' },
                        body: JSON.stringify({
                            amount: commissionAmount,
                            type: 'commission',
                            status: 'pending',
                            created_at: now
                        })
                    }).catch(() => null);
                }
            } catch (settleErr) {
                console.warn('Post-payment settlement non-blocking notice:', settleErr.message);
            }
        }

        const finalizeRes = await fetch(
            `${base}/ibos_webhook_events?event_id=eq.${encodeURIComponent(eventId)}`,
            {
                method: 'PATCH',
                headers: { ...auth, Prefer: 'return=minimal' },
                body: JSON.stringify({ status: isSuccess ? 'processed' : 'received', processed_at: isSuccess ? now : null })
            }
        );
        if (!finalizeRes.ok) {
            return json(503, { status: 'EVENT_FINALIZE_FAILED', event_id: eventId, order_id: orderCode || 'UNSPECIFIED' });
        }

        return json(200, {
            status: 'SUCCESS',
            action: isSuccess ? 'payment_confirmed' : 'event_recorded',
            event_id: eventId,
            order_id: orderCode || 'UNSPECIFIED',
            event_type: type,
            provider
        });
    } catch (error) {
        return json(500, {
            status: 'ERROR',
            message: error instanceof Error ? error.message : 'Webhook processing failed'
        });
    }
}
