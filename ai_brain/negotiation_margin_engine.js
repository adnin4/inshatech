/**
 * IINSHA AI-BOS — DYNAMIC NEGOTIATION & MARGIN GUARDIAN ENGINE
 * Wave 3: Server-side cost modeling, dynamic margin calculation, and strict discount bounding.
 * Ensures the sales agent never negotiates below policy thresholds without L3 human approval.
 */

class NegotiationMarginEngine {
    constructor() {
        // Base Unit Economics Model per Service Category
        this.unitEconomics = {
            'b2b-lead-swarm': {
                listPriceUSD: 850,
                directLaborCostUSD: 120,
                infrastructureCostUSD: 40,
                aiTokenCostUSD: 25,
                affiliateCommissionRate: 0.20, // 20% = $170
                minimumRequiredMarginRate: 0.40, // 40% target
                maxAutonomousDiscountRate: 0.10 // Max 10% discount autonomous
            },
            'ecommerce-ai-whatsapp': {
                listPriceUSD: 750,
                directLaborCostUSD: 100,
                infrastructureCostUSD: 30,
                aiTokenCostUSD: 20,
                affiliateCommissionRate: 0.20, // $150
                minimumRequiredMarginRate: 0.40,
                maxAutonomousDiscountRate: 0.10
            },
            'voice-ai-receptionist': {
                listPriceUSD: 1800,
                directLaborCostUSD: 250,
                infrastructureCostUSD: 80,
                aiTokenCostUSD: 60,
                affiliateCommissionRate: 0.20, // $360
                minimumRequiredMarginRate: 0.45,
                maxAutonomousDiscountRate: 0.12
            },
            'n8n-docker-cluster': {
                listPriceUSD: 497,
                directLaborCostUSD: 50,
                infrastructureCostUSD: 20,
                aiTokenCostUSD: 10,
                affiliateCommissionRate: 0.20, // $99.40
                minimumRequiredMarginRate: 0.50,
                maxAutonomousDiscountRate: 0.15
            }
        };
    }

    /**
     * Calculate financial floor and minimum safe price for a service
     * @param {string} serviceId 
     * @returns {Object} Cost breakdown and minimum safe price
     */
    calculateFinancialFloor(serviceId) {
        const econ = this.unitEconomics[serviceId] || {
            listPriceUSD: 500,
            directLaborCostUSD: 80,
            infrastructureCostUSD: 30,
            aiTokenCostUSD: 15,
            affiliateCommissionRate: 0.20,
            minimumRequiredMarginRate: 0.40,
            maxAutonomousDiscountRate: 0.10
        };

        const totalCostOfDelivery = econ.directLaborCostUSD + econ.infrastructureCostUSD + econ.aiTokenCostUSD;
        const affiliateAmount = econ.listPriceUSD * econ.affiliateCommissionRate;
        const minimumSafeMargin = econ.listPriceUSD * econ.minimumRequiredMarginRate;
        
        // Minimum Safe Price = Delivery Cost + Affiliate Cost + Minimum Required Margin + 5% Risk Buffer
        const riskBuffer = econ.listPriceUSD * 0.05;
        const minimumSafePrice = Math.round(totalCostOfDelivery + affiliateAmount + minimumSafeMargin + riskBuffer);
        const maxAutonomousDiscountUSD = Math.round(econ.listPriceUSD * econ.maxAutonomousDiscountRate);
        const autonomousPriceFloor = econ.listPriceUSD - maxAutonomousDiscountUSD;

        return {
            serviceId,
            listPriceUSD: econ.listPriceUSD,
            totalCostOfDeliveryUSD: totalCostOfDelivery,
            affiliateProvisionUSD: affiliateAmount,
            minimumRequiredMarginUSD: minimumSafeMargin,
            riskBufferUSD: riskBuffer,
            calculatedMinimumSafePriceUSD: minimumSafePrice,
            autonomousPriceFloorUSD: Math.max(autonomousPriceFloor, minimumSafePrice),
            maxAutonomousDiscountPercent: econ.maxAutonomousDiscountRate * 100
        };
    }

    /**
     * Evaluate a negotiated price offer
     * @param {string} serviceId 
     * @param {number} proposedPriceUSD 
     * @param {string} clientContext 
     * @returns {Object} Decision on offer approval, counter-offer, or L3 escalation
     */
    evaluateNegotiationOffer(serviceId, proposedPriceUSD, clientContext = '') {
        const floor = this.calculateFinancialFloor(serviceId);
        const discountUSD = floor.listPriceUSD - proposedPriceUSD;
        const discountPercent = Math.round((discountUSD / floor.listPriceUSD) * 100);

        // Case 1: Proposed price is at or above list price
        if (proposedPriceUSD >= floor.listPriceUSD) {
            return {
                decision: 'ACCEPT_FULL_PRICE',
                approvedPriceUSD: floor.listPriceUSD,
                discountPercent: 0,
                requiresOwnerApproval: false,
                rationale: 'Standard catalog price accepted.'
            };
        }

        // Case 2: Proposed price is within autonomous discount bounds (e.g. <= 10%)
        if (proposedPriceUSD >= floor.autonomousPriceFloorUSD) {
            return {
                decision: 'ACCEPT_AUTONOMOUS_DISCOUNT',
                approvedPriceUSD: proposedPriceUSD,
                discountPercent: discountPercent,
                requiresOwnerApproval: false,
                rationale: `Discount of ${discountPercent}% is within the autonomous ${floor.maxAutonomousDiscountPercent}% policy limit.`
            };
        }

        // Case 3: Proposed price is below autonomous limit but above strict break-even floor
        if (proposedPriceUSD >= floor.calculatedMinimumSafePriceUSD) {
            return {
                decision: 'REQUIRES_L3_OWNER_APPROVAL',
                proposedPriceUSD: proposedPriceUSD,
                discountPercent: discountPercent,
                counterOfferUSD: floor.autonomousPriceFloorUSD,
                requiresOwnerApproval: true,
                rationale: `Discount of ${discountPercent}% exceeds autonomous threshold. Escalated to Owner Cockpit for L3 sign-off.`
            };
        }

        // Case 4: Proposed price violates minimum safe margin floor (Unprofitable deal)
        return {
            decision: 'REJECT_UNPROFITABLE_OFFER',
            proposedPriceUSD: proposedPriceUSD,
            minimumSafePriceUSD: floor.calculatedMinimumSafePriceUSD,
            counterOfferUSD: floor.autonomousPriceFloorUSD,
            requiresOwnerApproval: false,
            rationale: `Offered price of $${proposedPriceUSD} breaches minimum financial safe floor ($${floor.calculatedMinimumSafePriceUSD}). Counter-offered at $${floor.autonomousPriceFloorUSD}.`
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NegotiationMarginEngine };
}
