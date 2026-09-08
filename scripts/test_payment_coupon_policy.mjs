import { evaluateCoupon, evaluateCouponWithDb, COUPON_POLICIES } from '../functions/_shared/payments/coupon_policy.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
    total++;
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        process.exitCode = 1;
    }
}

console.log('================================================================================');
console.log('IINSHA AI-BOS: AUTHORITATIVE COUPON POLICY ENGINE TEST SUITE');
console.log('================================================================================\n');

// 1. Valid EARLY2026 application
{
    const res = evaluateCoupon({
        couponCode: 'EARLY2026',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850
    });
    assert(res.valid && res.appliedCoupon === 'EARLY2026' && res.finalAmountUsd === 765 && res.discountAmountUsd === 85,
        'EARLY2026: 10% discount accurately calculated ($850 -> $765)');
}

// 2. Valid APEX15 application
{
    const res = evaluateCoupon({
        couponCode: 'APEX15',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850
    });
    assert(res.valid && res.appliedCoupon === 'APEX15' && res.finalAmountUsd === 722 && res.discountAmountUsd === 128,
        'APEX15: 15% discount accurately calculated ($850 -> $722)');
}

// 3. Discount capping: 10% on $2000 is $200, but capped at $150
{
    const res = evaluateCoupon({
        couponCode: 'EARLY2026',
        serviceSlug: 'voice-ai-receptionist',
        packageName: 'Enterprise',
        orderAmountUsd: 2000
    });
    assert(res.discountAmountUsd === 150 && res.finalAmountUsd === 1850,
        'EARLY2026: Maximum discount cap enforced ($150 max on $2,000 order)');
}

// 4. Invalid coupon rejection
{
    const res = evaluateCoupon({
        couponCode: 'HACKER_99',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850
    });
    assert(!res.valid && res.error === 'INVALID_COUPON' && res.finalAmountUsd === 850,
        'Invalid coupon code rejected by server authority, original amount preserved');
}

// 5. Expired coupon rejection
{
    const res = evaluateCoupon({
        couponCode: 'EARLY2026',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850,
        now: new Date('2027-01-01T00:00:00Z')
    });
    assert(!res.valid && res.error === 'EXPIRED_COUPON' && res.finalAmountUsd === 850,
        'Expired coupon rejected when evaluated past validity window');
}

// 6. Future coupon rejection
{
    const res = evaluateCoupon({
        couponCode: 'EARLY2026',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850,
        now: new Date('2025-12-01T00:00:00Z')
    });
    assert(!res.valid && res.error === 'COUPON_NOT_YET_ACTIVE' && res.finalAmountUsd === 850,
        'Future coupon rejected before start_at date');
}

// 7. Minimum spend requirement
{
    const res = evaluateCoupon({
        couponCode: 'APEX15', // minimum $200
        serviceSlug: 'test-service',
        packageName: 'Standard',
        orderAmountUsd: 150
    });
    assert(!res.valid && res.error === 'MINIMUM_ORDER_NOT_MET' && res.finalAmountUsd === 150,
        'Minimum order spend threshold enforced ($200 required for APEX15)');
}

// 8. Floor price protection
{
    // invoice-ocr-pipeline ($249 catalog, min floor $200). 15% off $249 = $37.35 -> $212 (above min)
    const res = evaluateCoupon({
        couponCode: 'EARLY2026',
        serviceSlug: 'invoice-ocr-pipeline',
        packageName: 'Standard',
        orderAmountUsd: 210 // 10% off is $21 -> $189, which is below floor $200
    });
    assert(res.finalAmountUsd === 200 && res.discountAmountUsd === 10,
        'Floor price protection: Discount bounded so final price never falls below server floor ($200)');
}

// 9. Null coupon returns original amount
{
    const res = evaluateCoupon({
        couponCode: null,
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850
    });
    assert(res.valid && res.appliedCoupon === null && res.finalAmountUsd === 850 && res.discountAmountUsd === 0,
        'Omitted coupon safely resolves original order amount without errors');
}

// 10. evaluateCouponWithDb: Enforces database max_uses ceiling
{
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
        if (url.includes('ibos_coupons')) {
            return {
                ok: true,
                json: async () => [{
                    id: 'coupon-uuid-1',
                    code: 'EARLY2026',
                    max_uses: 100,
                    used_count: 100, // Exhausted
                    per_user_limit: 1,
                    is_active: true
                }]
            };
        }
        return { ok: true, json: async () => [] };
    };

    const res = await evaluateCouponWithDb({
        couponCode: 'EARLY2026',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850,
        customerEmail: 'client@example.com',
        supabaseUrl: 'https://test.supabase.co',
        supabaseKey: 'test-key'
    });

    assert(!res.valid && res.error === 'COUPON_MAX_USES_REACHED',
        'evaluateCouponWithDb: Rejects coupon when max_uses ceiling reached');

    globalThis.fetch = originalFetch;
}

// 11. evaluateCouponWithDb: Enforces per-user limit
{
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
        if (url.includes('ibos_coupons')) {
            return {
                ok: true,
                json: async () => [{
                    id: 'coupon-uuid-1',
                    code: 'EARLY2026',
                    max_uses: 500,
                    used_count: 5,
                    per_user_limit: 1,
                    is_active: true
                }]
            };
        }
        if (url.includes('ibos_coupon_redemptions')) {
            return {
                ok: true,
                json: async () => [{ id: 'redemption-1' }] // Already redeemed once
            };
        }
        return { ok: true, json: async () => [] };
    };

    const res = await evaluateCouponWithDb({
        couponCode: 'EARLY2026',
        serviceSlug: 'b2b-lead-swarm',
        packageName: 'Standard',
        orderAmountUsd: 850,
        customerEmail: 'repeat_buyer@example.com',
        supabaseUrl: 'https://test.supabase.co',
        supabaseKey: 'test-key'
    });

    assert(!res.valid && res.error === 'COUPON_USER_LIMIT_REACHED',
        'evaluateCouponWithDb: Rejects coupon when customer per_user_limit exceeded');

    globalThis.fetch = originalFetch;
}

console.log(`\n================================================================================`);
console.log(`COUPON POLICY SUMMARY: ${passed}/${total} ASSERTIONS PASSED!`);
console.log(`================================================================================\n`);

if (passed !== total) {
    process.exit(1);
}
console.log('PAYMENT_COUPON_POLICY=PASS');
