/**
 * IINSHA AI-BOS — Money & Minor-Unit Calculation Engine
 *
 * Implements deterministic integer-cents and integer-poisha arithmetic
 * to completely eliminate floating-point drift (e.g. 0.1 + 0.2 !== 0.3)
 * across multi-currency checkout, discount applications, and FX conversions.
 */

export function toCents(dollars) {
    const num = Number(dollars);
    if (!Number.isFinite(num)) {
        throw new Error('INVALID_DOLLAR_AMOUNT: ' + dollars);
    }
    return Math.round(num * 100);
}

export function toDollars(cents) {
    const num = Number(cents);
    if (!Number.isInteger(num)) {
        throw new Error('INVALID_CENTS_AMOUNT: ' + cents);
    }
    return Math.round(num) / 100;
}

export function formatUsd(cents) {
    return '$' + (cents / 100).toFixed(2);
}

export function calculatePercentDiscountCents(amountCents, percent, roundMethod = 'round_dollars') {
    if (percent <= 0) return 0;
    if (roundMethod === 'round_dollars') {
        const discountUsd = Math.round((toDollars(amountCents) * percent) / 100);
        return toCents(discountUsd);
    }
    return Math.round((amountCents * percent) / 100);
}

export function computeDiscountedPriceCents({
    basePriceCents,
    discountType = 'percent',
    discountValue,
    maxDiscountCents = null,
    floorPriceCents = 0,
    roundMethod = 'round_dollars'
}) {
    let discountCents = 0;
    if (discountType === 'percent') {
        discountCents = calculatePercentDiscountCents(basePriceCents, discountValue, roundMethod);
    } else if (discountType === 'fixed') {
        discountCents = toCents(discountValue);
    }

    if (maxDiscountCents !== null && discountCents > maxDiscountCents) {
        discountCents = maxDiscountCents;
    }

    discountCents = Math.max(0, Math.min(discountCents, basePriceCents));

    let finalCents = basePriceCents - discountCents;
    if (finalCents < floorPriceCents && basePriceCents >= floorPriceCents) {
        finalCents = floorPriceCents;
        discountCents = basePriceCents - finalCents;
    }

    return {
        originalCents: basePriceCents,
        discountCents,
        finalCents,
        originalUsd: toDollars(basePriceCents),
        discountUsd: toDollars(discountCents),
        finalUsd: toDollars(finalCents)
    };
}