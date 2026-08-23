/**
 * IINSHA Margin Guardian & Deal Protection Engine
 *
 * Governs commercial proposals before they reach checkout/contract stages.
 * The legacy percentage assumptions remain as explicit fallbacks for compatibility,
 * but callers can now provide real, server-side cost inputs.
 */

export class MarginGuardian {
    constructor(config = {}) {
        this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT = this._number(config.minimumMarginPercent, 50.0);
        this.DEFAULT_AFFILIATE_PERCENT = this._number(config.affiliatePercent, 20.0);
        this.DEFAULT_SUPPORT_RESERVE_PERCENT = this._number(config.supportReservePercent, 5.0);
        this.DEFAULT_AI_COMPUTE_PERCENT = this._number(config.aiComputePercent, 3.0);
        this.DEFAULT_DELIVERY_COST_PERCENT = this._number(config.deliveryCostPercent, 22.0);
        this.DEFAULT_RISK_RESERVE_PERCENT = this._number(config.riskReservePercent, 0.0);
    }

    /**
     * Server-side deal profitability audit.
     * Real absolute costs should be supplied whenever available.
     * Percentage fallbacks preserve compatibility with older callers.
     */
    auditDealProfitability(dealParams = {}) {
        const serviceName = dealParams.serviceName || 'Custom AI Solution';
        const proposedPriceUSD = this._nonNegative(dealParams.proposedPriceUSD, 750.00);
        const discountPercent = this._bounded(dealParams.customDiscountPercent, 0, 100, 0);
        const effectivePriceUSD = Number((proposedPriceUSD * (1 - discountPercent / 100)).toFixed(2));

        if (effectivePriceUSD <= 0) {
            return this._blockedResult(serviceName, effectivePriceUSD, 'NON_POSITIVE_EFFECTIVE_PRICE');
        }

        const costs = this._resolveCosts(effectivePriceUSD, dealParams.costs || {});
        const totalCostOfDelivery = Number(Object.values(costs).reduce((sum, value) => sum + value, 0).toFixed(2));
        const grossProfitUSD = Number((effectivePriceUSD - totalCostOfDelivery).toFixed(2));
        const grossMarginPercent = Number(((grossProfitUSD / effectivePriceUSD) * 100).toFixed(2));
        const isMarginSafe = grossMarginPercent >= this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT;
        const recommendedMinPriceUSD = Number((
            totalCostOfDelivery / (1 - this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT / 100)
        ).toFixed(2));

        return {
            serviceName,
            financial_breakdown: {
                effectivePriceUSD,
                ...this._roundCosts(costs),
                totalCostOfDeliveryUSD: totalCostOfDelivery,
                grossProfitUSD,
                grossMarginPercent
            },
            policy_check: {
                min_required_margin_percent: this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT,
                is_margin_safe: isMarginSafe,
                status: isMarginSafe ? 'APPROVED_AUTONOMOUS' : 'BLOCKED_REQUIRES_APPROVAL',
                cost_mode: dealParams.costs && Object.keys(dealParams.costs).length ? 'REAL_INPUTS_PLUS_FALLBACKS' : 'PERCENTAGE_FALLBACKS'
            },
            counter_offer_proposal: isMarginSafe ? null : {
                recommended_min_price_usd: Math.ceil(recommendedMinPriceUSD * 100) / 100,
                rationale: `Deal is below the minimum ${this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT}% gross margin policy.`
            }
        };
    }

    _resolveCosts(price, provided) {
        const cost = (absolute, percent) => {
            if (absolute !== undefined && absolute !== null) return this._nonNegative(absolute, 0);
            return Number((price * (percent / 100)).toFixed(2));
        };

        return {
            deliveryCostUSD: cost(provided.deliveryCostUSD, this.DEFAULT_DELIVERY_COST_PERCENT),
            aiComputeCostUSD: cost(provided.aiComputeCostUSD, this.DEFAULT_AI_COMPUTE_PERCENT),
            affiliateCommissionUSD: cost(provided.affiliateCommissionUSD, this.DEFAULT_AFFILIATE_PERCENT),
            supportReserveUSD: cost(provided.supportReserveUSD, this.DEFAULT_SUPPORT_RESERVE_PERCENT),
            riskReserveUSD: cost(provided.riskReserveUSD, this.DEFAULT_RISK_RESERVE_PERCENT)
        };
    }

    _roundCosts(costs) {
        return Object.fromEntries(Object.entries(costs).map(([key, value]) => [key, Number(value.toFixed(2))]));
    }

    _blockedResult(serviceName, effectivePriceUSD, reason) {
        return {
            serviceName,
            financial_breakdown: {
                effectivePriceUSD,
                totalCostOfDeliveryUSD: 0,
                grossProfitUSD: effectivePriceUSD,
                grossMarginPercent: 0
            },
            policy_check: {
                min_required_margin_percent: this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT,
                is_margin_safe: false,
                status: 'BLOCKED_REQUIRES_APPROVAL',
                reason
            },
            counter_offer_proposal: null
        };
    }

    _number(value, fallback) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    _nonNegative(value, fallback) {
        const n = this._number(value, fallback);
        return Math.max(0, n);
    }

    _bounded(value, min, max, fallback) {
        const n = this._number(value, fallback);
        return Math.min(max, Math.max(min, n));
    }
}
