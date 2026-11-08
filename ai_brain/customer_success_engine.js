/**
 * IINSHA AI-BOS — CUSTOMER SUCCESS & CHURN RISK ENGINE
 * Wave F: Monitors post-delivery customer health, onboarding activation,
 * satisfaction tracking, SLA compliance, churn risk detection, and expansion opportunities.
 */

class CustomerSuccessEngine {
    constructor() {
        this.customerHealthRecords = new Map();
    }

    /**
     * Compute comprehensive customer health score & churn risk probability
     * @param {Object} metrics - { customerId, deliveryOnTime, openTicketsCount, daysSinceLastLogin, npsScore, monthlySpendUSD }
     * @returns {Object} Health analysis & retention strategy
     */
    evaluateCustomerHealth(metrics) {
        let healthScore = 70; // Base score

        // 1. Delivery & SLA Factor
        if (metrics.deliveryOnTime) healthScore += 15;
        else healthScore -= 20;

        // 2. Support Ticket Factor
        if (metrics.openTicketsCount === 0) healthScore += 10;
        else if (metrics.openTicketsCount > 2) healthScore -= 25;

        // 3. Engagement & Inactivity Factor
        const daysInactive = metrics.daysSinceLastLogin || 0;
        if (daysInactive < 7) healthScore += 10;
        else if (daysInactive > 30) healthScore -= 30;

        // 4. Customer NPS Feedback
        if (metrics.npsScore >= 9) healthScore += 15;
        else if (metrics.npsScore <= 6) healthScore -= 20;

        healthScore = Math.min(Math.max(healthScore, 0), 100);

        // Churn Probability Calculation
        let churnRisk = 'LOW';
        if (healthScore < 40) churnRisk = 'CRITICAL';
        else if (healthScore < 60) churnRisk = 'ELEVATED';

        // Upsell / Expansion Readiness
        const isUpsellReady = healthScore >= 80 && metrics.monthlySpendUSD >= 500;

        const record = {
            customerId: metrics.customerId,
            healthScore,
            churnRisk,
            isUpsellReady,
            recommendedAction: this.determineRetentionAction(churnRisk, isUpsellReady),
            evaluatedAt: new Date().toISOString()
        };

        this.customerHealthRecords.set(metrics.customerId, record);
        return record;
    }

    /**
     * Determine best retention or expansion action
     */
    determineRetentionAction(churnRisk, isUpsellReady) {
        if (churnRisk === 'CRITICAL') {
            return {
                priority: 'P0_IMMEDIATE_INTERVENTION',
                action: 'Schedule executive check-in with Owner; review unresolved support tickets within 4 hours.'
            };
        }
        if (churnRisk === 'ELEVATED') {
            return {
                priority: 'P1_PROACTIVE_SUPPORT',
                action: 'Send personalized workflow optimization guide and offer free 15-min technical review.'
            };
        }
        if (isUpsellReady) {
            return {
                priority: 'P2_EXPANSION_OPPORTUNITY',
                action: 'Recommend multi-agent expansion package (e.g. adding Voice AI Receptionist to Lead Swarm).'
            };
        }
        return {
            priority: 'P3_NORMAL_CADENCE',
            action: 'Maintain automated monthly health monitoring and quarterly satisfaction surveys.'
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CustomerSuccessEngine };
}
