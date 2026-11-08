/**
 * IINSHA AI-BOS — IN-MEMORY BUSINESS STORE
 * Light-weight in-memory persistence store for sandbox testing of full business cycles.
 */

class InMemoryBusinessStore {
    constructor() {
        this.opportunities = new Map();
        this.proposals = new Map();
        this.orders = new Map();
        this.webhooks = new Set();
        this.projects = new Map();
        this.supportTickets = new Map();
        this.renewals = new Map();
        this.learnings = new Map();
        this.events = [];
    }

    saveOpportunity(opp) {
        this.opportunities.set(opp.id, opp);
        return opp;
    }

    saveProposal(prop) {
        this.proposals.set(prop.id, prop);
        return prop;
    }

    saveOrder(order) {
        this.orders.set(order.id, order);
        return order;
    }

    recordWebhook(idempotencyKey) {
        if (this.webhooks.has(idempotencyKey)) return false;
        this.webhooks.add(idempotencyKey);
        return true;
    }

    saveProject(proj) {
        this.projects.set(proj.id, proj);
        return proj;
    }

    saveSupportTicket(ticket) {
        this.supportTickets.set(ticket.id, ticket);
        return ticket;
    }

    saveRenewal(renewal) {
        this.renewals.set(renewal.id, renewal);
        return renewal;
    }

    saveLearning(record) {
        this.learnings.set(record.id, record);
        return record;
    }

    recordEvent(eventType, payload) {
        const evt = {
            id: `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            eventType,
            payload,
            timestamp: new Date().toISOString()
        };
        this.events.push(evt);
        return evt;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InMemoryBusinessStore };
}
