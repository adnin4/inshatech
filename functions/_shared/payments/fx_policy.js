/**
 * IINSHA AI-BOS — Authoritative FX Policy Engine (Step 03-B)
 *
 * Defines the server-side foreign exchange conversion rules, rounding policy,
 * source tracking, and metadata generation for financial reconciliation.
 */

export const FX_CONFIG = Object.freeze({
    DEFAULT_USD_BDT_RATE: 122.50,
    POLICY_NAME: 'IINSHA_STABLE_PEG_V1',
    ROUNDING_METHOD: 'ROUND_HALF_UP_INTEGER',
    MIN_RATE: 100.00,
    MAX_RATE: 200.00
});

/**
 * Resolves current authoritative FX rate and metadata.
 * Can be overridden by environment variable or external oracle if provided.
 */
export function resolveFxRate(env = {}) {
    let rate = FX_CONFIG.DEFAULT_USD_BDT_RATE;
    let source = 'DEFAULT_POLICY';

    if (env.BDT_CONVERSION_RATE) {
        const parsed = parseFloat(env.BDT_CONVERSION_RATE);
        if (Number.isFinite(parsed) && parsed >= FX_CONFIG.MIN_RATE && parsed <= FX_CONFIG.MAX_RATE) {
            rate = parsed;
            source = 'ENV_CONFIGURATION';
        }
    }

    return Object.freeze({
        rate,
        currency_pair: 'USD_BDT',
        source,
        policy: FX_CONFIG.POLICY_NAME,
        timestamp: new Date().toISOString(),
        rounding: FX_CONFIG.ROUNDING_METHOD
    });
}

/**
 * Converts USD amount to authoritative integer BDT using the FX policy.
 */
export function convertUsdToBdt(amountUsd, fxRate = FX_CONFIG.DEFAULT_USD_BDT_RATE) {
    const usd = Number(amountUsd);
    if (!Number.isFinite(usd) || usd < 0) {
        throw new Error(`INVALID_USD_AMOUNT: ${amountUsd}`);
    }
    const rate = Number(fxRate);
    if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error(`INVALID_FX_RATE: ${fxRate}`);
    }
    return Math.round(usd * rate);
}
