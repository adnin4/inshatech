/**
 * IINSHA AI-BOS — Production Adapter Registry
 *
 * Centralizes all external side effects behind explicit, owner-configurable
 * adapters. No adapter is considered live unless it is registered with a
 * verified provider implementation.
 */

const REQUIRED_METHODS = Object.freeze({
    CRM: ['upsertOpportunity', 'saveProposal'],
    PAYMENT: ['createCheckout', 'verifyWebhook', 'reconcile'],
    PROJECT: ['createWorkspace', 'runTask'],
    QA: ['runSuite'],
    DELIVERY: ['deploy', 'rollback'],
    SUPPORT: ['createCase', 'notify'],
    NOTIFICATION: ['send']
});

export class ProductionAdapterRegistry {
    constructor() {
        this.adapters = new Map();
    }

    register(type, name, adapter, { verified = false } = {}) {
        if (!REQUIRED_METHODS[type]) throw new Error(`Unknown adapter type: ${type}`);
        if (!name || !adapter) throw new Error('Adapter name and implementation are required');
        for (const method of REQUIRED_METHODS[type]) {
            if (typeof adapter[method] !== 'function') {
                throw new TypeError(`${type}/${name} must implement ${method}()`);
            }
        }
        this.adapters.set(`${type}:${name}`, { type, name, adapter, verified: Boolean(verified) });
    }

    status(type, name) {
        const entry = this.adapters.get(`${type}:${name}`);
        if (!entry) return { status: 'NOT_CONFIGURED', type, name };
        return { status: entry.verified ? 'LIVE_VERIFIED' : 'CONFIGURED_NOT_VERIFIED', type, name };
    }

    get(type, name) {
        const entry = this.adapters.get(`${type}:${name}`);
        if (!entry) return null;
        if (!entry.verified) return null;
        return entry.adapter;
    }

    list() {
        return Array.from(this.adapters.values()).map(({ type, name, verified }) => ({
            type,
            name,
            status: verified ? 'LIVE_VERIFIED' : 'CONFIGURED_NOT_VERIFIED'
        }));
    }

    assertVerified(type, name) {
        const adapter = this.get(type, name);
        if (!adapter) throw new Error(`${type}/${name} is NOT_CONFIGURED or NOT_VERIFIED`);
        return adapter;
    }
}

export const REQUIRED_ADAPTER_METHODS = REQUIRED_METHODS;
