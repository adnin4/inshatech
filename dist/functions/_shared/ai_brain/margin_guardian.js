/**
 * IINSHA Margin Guardian & Deal Protection Engine
 * Verifies Deal Value, Delivery Cost, AI Compute Cost, Affiliate Commission,
 * and Support Reserve before permitting client quotes or contracts.
 */

export class MarginGuardian {
    constructor() {
        this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT = 50.0;
        this.AFFILIATE_DEFAULT_PERCENT = 20.0;
        this.SUPPORT_RESERVE_PERCENT = 5.0;
        this.AI_COMPUTE_ESTIMATE_PERCENT = 3.0;
        this.DELIVERY_BASE_COST_PERCENT = 22.0;
    }

    /**
     * Audit a proposed deal or custom quotation
     * @param {Object} dealParams - { serviceName, proposedPriceUSD, customDiscountPercent }
     */
    auditDealProfitability(dealParams = {}) {
        const {
            serviceName = "Custom AI Solution",
            proposedPriceUSD = 750.00,
            customDiscountPercent = 0.0
        } = dealParams;

        const effectivePriceUSD = proposedPriceUSD * (1 - customDiscountPercent / 100);
        const deliveryCost = effectivePriceUSD * (this.DELIVERY_BASE_COST_PERCENT / 100);
        const aiComputeCost = effectivePriceUSD * (this.AI_COMPUTE_ESTIMATE_PERCENT / 100);
        const affiliateCommission = effectivePriceUSD * (this.AFFILIATE_DEFAULT_PERCENT / 100);
        const supportReserve = effectivePriceUSD * (this.SUPPORT_RESERVE_PERCENT / 100);

        const totalCostOfDelivery = deliveryCost + aiComputeCost + affiliateCommission + supportReserve;
        const grossProfitUSD = effectivePriceUSD - totalCostOfDelivery;
        const grossMarginPercent = parseFloat(((grossProfitUSD / effectivePriceUSD) * 100).toFixed(1));

        const isApproved = grossMarginPercent >= this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT;

        return {
            serviceName,
            financial_breakdown: {
                effectivePriceUSD: parseFloat(effectivePriceUSD.toFixed(2)),
                deliveryCostUSD: parseFloat(deliveryCost.toFixed(2)),
                aiComputeCostUSD: parseFloat(aiComputeCost.toFixed(2)),
                affiliateCommissionUSD: parseFloat(affiliateCommission.toFixed(2)),
                supportReserveUSD: parseFloat(supportReserve.toFixed(2)),
                totalCostOfDeliveryUSD: parseFloat(totalCostOfDelivery.toFixed(2)),
                grossProfitUSD: parseFloat(grossProfitUSD.toFixed(2)),
                grossMarginPercent
            },
            policy_check: {
                min_required_margin_percent: this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT,
                is_margin_safe: isApproved,
                status: isApproved ? 'APPROVED_AUTONOMOUS' : 'BLOCKED_REQUIRES_APPROVAL'
            },
            counter_offer_proposal: isApproved ? null : {
                recommended_min_price_usd: Math.ceil((totalCostOfDelivery / (1 - this.MINIMUM_ACCEPTABLE_MARGIN_PERCENT / 100))),
                rationale: "Discount exceeds minimum 50% gross margin rule. Counter-offer adjusted automatically."
            }
        };
    }
}
