/**
 * IINSHA AI-BOS — Authoritative Coupon Policy Engine
 *
 * Enforces server-side coupon validation, validity windows, service/package scoping,
 * minimum spend thresholds, discount ceilings, and floor price limits.
 */

import { computeDiscountedPriceCents, toCents, toDollars } from './money.js';

export const COUPON_POLICIES = Object.freeze({
    'EARLY2026': {
        code: 'EARLY2026',
        active: true,
        start_at: '2026-01-01T00:00:00Z',
        expires_at: '2026-12-31T23:59:59Z',
        discount_type: 'percent',
        discount_value: 10,
        minimum_order_usd: 100,
        maximum_discount_usd: 150,
        service_scope: null, // null = all published services
        package_scope: null,
        min_floor_price_usd: 200
    },
    'FOUNDER10': {
        code: 'FOUNDER10',
        active: true,
        start_at: '2026-01-01T00:00:00Z',
        expires_at: '2026-12-31T23:59:59Z',
        discount_type: 'percent',
        discount_value: 10,
        minimum_order_usd: 100,
        maximum_discount_usd: 100,
        service_scope: null,
        package_scope: null,
        min_floor_price_usd: 200
    },
    'APEX15': {
        code: 'APEX15',
        active: true,
        start_at: '2026-01-01T00:00:00Z',
        expires_at: '2026-12-31T23:59:59Z',
        discount_type: 'percent',
        discount_value: 15,
        minimum_order_usd: 200,
        maximum_discount_usd: 250,
        service_scope: null,
        package_scope: null,
        min_floor_price_usd: 200
    }
});

/**
 * Evaluates requested coupon against authoritative server policies
 */
export function evaluateCoupon({
    couponCode,
    serviceSlug,
    packageName,
    orderAmountUsd,
    now = new Date()
}) {
    const rawCode = String(couponCode || '').trim();
    if (!rawCode) {
        return {
            valid: true,
            appliedCoupon: null,
            discountAmountUsd: 0,
            finalAmountUsd: orderAmountUsd,
            error: null
        };
    }

    const code = rawCode.toUpperCase();
    const policy = COUPON_POLICIES[code];

    if (!policy || !policy.active) {
        return {
            valid: false,
            appliedCoupon: null,
            discountAmountUsd: 0,
            finalAmountUsd: orderAmountUsd,
            error: 'INVALID_COUPON'
        };
    }

    const currentTime = new Date(now).getTime();
    if (policy.start_at && currentTime < new Date(policy.start_at).getTime()) {
        return {
            valid: false,
            appliedCoupon: null,
            discountAmountUsd: 0,
            finalAmountUsd: orderAmountUsd,
            error: 'COUPON_NOT_YET_ACTIVE'
        };
    }

    if (policy.expires_at && currentTime > new Date(policy.expires_at).getTime()) {
        return {
            valid: false,
            appliedCoupon: null,
            discountAmountUsd: 0,
            finalAmountUsd: orderAmountUsd,
            error: 'EXPIRED_COUPON'
        };
    }

    if (policy.service_scope && Array.isArray(policy.service_scope)) {
        if (!policy.service_scope.includes(serviceSlug)) {
            return {
                valid: false,
                appliedCoupon: null,
                discountAmountUsd: 0,
                finalAmountUsd: orderAmountUsd,
                error: 'COUPON_SERVICE_MISMATCH'
            };
        }
    }

    if (policy.package_scope && Array.isArray(policy.package_scope)) {
        if (!policy.package_scope.includes(packageName)) {
            return {
                valid: false,
                appliedCoupon: null,
                discountAmountUsd: 0,
                finalAmountUsd: orderAmountUsd,
                error: 'COUPON_PACKAGE_MISMATCH'
            };
        }
    }

    if (policy.minimum_order_usd && orderAmountUsd < policy.minimum_order_usd) {
        return {
            valid: false,
            appliedCoupon: null,
            discountAmountUsd: 0,
            finalAmountUsd: orderAmountUsd,
            error: 'MINIMUM_ORDER_NOT_MET'
        };
    }

    const basePriceCents = toCents(orderAmountUsd);
    const maxDiscountCents = policy.maximum_discount_usd !== null && policy.maximum_discount_usd !== undefined
        ? toCents(policy.maximum_discount_usd)
        : null;
    const floorPriceCents = policy.min_floor_price_usd ? toCents(policy.min_floor_price_usd) : 0;

    const computed = computeDiscountedPriceCents({
        basePriceCents,
        discountType: policy.discount_type,
        discountValue: policy.discount_value,
        maxDiscountCents,
        floorPriceCents
    });

    return {
        valid: true,
        appliedCoupon: code,
        discountAmountUsd: computed.discountUsd,
        finalAmountUsd: computed.finalUsd,
        error: null
    };
}

/**
 * Asynchronously evaluates coupon against database usage counters and per-user limits
 * if Supabase connection details are available, falling back safely to in-memory policies.
 */
export async function evaluateCouponWithDb({
    couponCode,
    serviceSlug,
    packageName,
    orderAmountUsd,
    customerEmail,
    supabaseUrl,
    supabaseKey,
    now = new Date()
}) {
    const memoryResult = evaluateCoupon({
        couponCode,
        serviceSlug,
        packageName,
        orderAmountUsd,
        now
    });

    if (!memoryResult.valid || !memoryResult.appliedCoupon) {
        return memoryResult;
    }

    if (!supabaseUrl || !supabaseKey) {
        return memoryResult;
    }

    try {
        const code = memoryResult.appliedCoupon;
        const res = await fetch(
            `${supabaseUrl}/rest/v1/ibos_coupons?code=eq.${encodeURIComponent(code)}&select=id,code,max_uses,used_count,per_user_limit,is_active&limit=1`,
            {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`
                }
            }
        );

        if (res.ok) {
            const rows = await res.json().catch(() => []);
            if (Array.isArray(rows) && rows.length > 0) {
                const dbCoupon = rows[0];
                if (!dbCoupon.is_active) {
                    return {
                        valid: false,
                        appliedCoupon: null,
                        discountAmountUsd: 0,
                        finalAmountUsd: orderAmountUsd,
                        error: 'COUPON_INACTIVE'
                    };
                }

                if (dbCoupon.used_count >= dbCoupon.max_uses) {
                    return {
                        valid: false,
                        appliedCoupon: null,
                        discountAmountUsd: 0,
                        finalAmountUsd: orderAmountUsd,
                        error: 'COUPON_MAX_USES_REACHED'
                    };
                }

                if (customerEmail && dbCoupon.per_user_limit) {
                    const redRes = await fetch(
                        `${supabaseUrl}/rest/v1/ibos_coupon_redemptions?coupon_code=eq.${encodeURIComponent(code)}&customer_email=eq.${encodeURIComponent(customerEmail.toLowerCase().trim())}&select=id`,
                        {
                            headers: {
                                apikey: supabaseKey,
                                Authorization: `Bearer ${supabaseKey}`
                            }
                        }
                    );
                    if (redRes.ok) {
                        const redRows = await redRes.json().catch(() => []);
                        if (Array.isArray(redRows) && redRows.length >= dbCoupon.per_user_limit) {
                            return {
                                valid: false,
                                appliedCoupon: null,
                                discountAmountUsd: 0,
                                finalAmountUsd: orderAmountUsd,
                                error: 'COUPON_USER_LIMIT_REACHED'
                            };
                        }
                    }
                }
            }
        }
    } catch {
        // Fail-safe to in-memory evaluation on network error
    }

    return memoryResult;
}

