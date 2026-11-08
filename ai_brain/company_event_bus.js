/**
 * IINSHA AI-BOS — AUTONOMOUS COMPANY EVENT BUS & WORKFLOW ENGINE
 * Wave O: Centralized event-driven architecture connecting all departments:
 * Events: lead.created, lead.qualified, proposal.created, proposal.accepted,
 * payment.completed, project.created, task.completed, qa.passed, deployment.success,
 * ticket.created, renewal.due, customer.churn_risk, skill.created.
 */

class CompanyEventBus {
    constructor() {
        this.subscribers = new Map();
        this.eventHistory = [];
        this.deadLetterQueue = [];
    }

    /**
     * Subscribe an agent or handler to a company event topic
     * @param {string} eventType 
     * @param {Function} handler 
     * @param {string} subscriberId 
     */
    subscribe(eventType, handler, subscriberId = 'ANONYMOUS_AGENT') {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push({ subscriberId, handler });
    }

    /**
     * Publish an event to the company event bus
     * @param {string} eventType 
     * @param {Object} payload 
     * @param {string} publisherId 
     * @returns {Object} Event Receipt
     */
    publish(eventType, payload = {}, publisherId = 'SYSTEM') {
        const eventRecord = {
            eventId: `EVT_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            eventType,
            publisherId,
            payload,
            timestamp: new Date().toISOString(),
            status: 'PUBLISHED'
        };

        this.eventHistory.push(eventRecord);

        const handlers = this.subscribers.get(eventType) || [];
        const deliveryResults = [];

        for (const sub of handlers) {
            try {
                const result = sub.handler(payload, eventRecord);
                deliveryResults.push({ subscriberId: sub.subscriberId, status: 'DELIVERED', result });
            } catch (err) {
                this.deadLetterQueue.push({
                    eventRecord,
                    subscriberId: sub.subscriberId,
                    error: err.message,
                    failedAt: new Date().toISOString()
                });
                deliveryResults.push({ subscriberId: sub.subscriberId, status: 'FAILED', error: err.message });
            }
        }

        eventRecord.deliveries = deliveryResults;
        return eventRecord;
    }

    /**
     * Get recent audit event ledger
     */
    getEventLedger(limit = 50) {
        return this.eventHistory.slice(-limit);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CompanyEventBus };
}
