/**
 * IINSHA AI-BOS — Governed Lead Acquisition Engine
 *
 * Purpose:
 * - replace synthetic production lead generation with a provider-driven pipeline
 * - keep REAL prospect acquisition separate from SYNTHETIC_DEMO data
 * - score prospects using explicit, explainable signals
 * - never send outreach unless a prospect is eligible and not suppressed
 *
 * This module deliberately does NOT perform arbitrary scraping or network calls.
 * External acquisition providers must implement the adapter contract and be explicitly
 * configured by the owner/admin control plane.
 */

const SOURCE_TYPES = new Set([
    'REAL',
    'SYNTHETIC_DEMO',
    'MANUAL',
    'REFERRAL',
    'IMPORT'
]);

const STATUSES = new Set([
    'DISCOVERED',
    'ENRICHED',
    'QUALIFIED',
    'OUTREACH_READY',
    'CONTACTED',
    'RESPONDED',
    'ENGAGED',
    'PROPOSAL',
    'WON',
    'LOST',
    'SUPPRESSED'
]);

export class LeadAcquisitionEngine {
    constructor({ providerRegistry = new Map(), logger = console } = {}) {
        this.providerRegistry = providerRegistry;
        this.logger = logger;
    }

    registerProvider(name, adapter) {
        if (!name || !adapter || typeof adapter.discover !== 'function') {
            throw new TypeError('Provider must implement discover()');
        }
        this.providerRegistry.set(name, adapter);
    }

    listProviders() {
        return Array.from(this.providerRegistry.keys());
    }

    async discover({ provider, query, limit = 25, context = {} } = {}) {
        const adapter = this.providerRegistry.get(provider);
        if (!adapter) {
            return {
                status: 'NOT_CONFIGURED',
                provider,
                prospects: []
            };
        }

        const safeLimit = Math.min(Math.max(Number(limit) || 1, 1), 100);
        const raw = await adapter.discover({ query, limit: safeLimit, context });
        const items = Array.isArray(raw) ? raw : [];

        return {
            status: 'DISCOVERY_COMPLETE',
            provider,
            prospects: items.map((item) => this.normalizeProspect(item))
        };
    }

    normalizeProspect(input = {}) {
        const sourceType = String(input.source_type || 'REAL').toUpperCase();
        if (!SOURCE_TYPES.has(sourceType)) {
            throw new Error(`Invalid source_type: ${sourceType}`);
        }

        const email = this.normalizeEmail(input.contact_email);
        const website = this.normalizeUrl(input.website);

        return {
            external_ref: this.clean(input.external_ref),
            source_type: sourceType,
            company_name: this.clean(input.company_name),
            contact_name: this.clean(input.contact_name),
            contact_email: email,
            contact_phone: this.clean(input.contact_phone),
            website,
            industry: this.clean(input.industry),
            country_code: this.clean(input.country_code),
            job_title: this.clean(input.job_title),
            profile: this.isObject(input.profile) ? input.profile : {},
            verification: {
                provider_verified: Boolean(input.provider_verified),
                verified_at: input.verified_at || null
            },
            status: 'DISCOVERED'
        };
    }

    scoreProspect(prospect = {}, signals = {}) {
        const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
        const weights = {
            icp: 0.22,
            intent: 0.22,
            pain: 0.18,
            budget: 0.14,
            timing: 0.10,
            serviceFit: 0.14
        };

        const scores = {
            icp: clamp(signals.icp_score),
            intent: clamp(signals.intent_score),
            pain: clamp(signals.pain_score),
            budget: clamp(signals.budget_score),
            timing: clamp(signals.timing_score),
            serviceFit: clamp(signals.service_fit_score)
        };

        const opportunity = Number((
            scores.icp * weights.icp +
            scores.intent * weights.intent +
            scores.pain * weights.pain +
            scores.budget * weights.budget +
            scores.timing * weights.timing +
            scores.serviceFit * weights.serviceFit
        ).toFixed(2));

        return {
            ...prospect,
            score: {
                icp_score: scores.icp,
                intent_score: scores.intent,
                pain_score: scores.pain,
                budget_score: scores.budget,
                timing_score: scores.timing,
                service_fit_score: scores.serviceFit,
                opportunity_score: opportunity,
                explanation: signals.explanation || {}
            }
        };
    }

    qualifyForOutreach(prospect, {
        suppressed = false,
        minimumOpportunityScore = 70,
        requireVerifiedSourceForReal = true
    } = {}) {
        if (!prospect) return { eligible: false, reason: 'MISSING_PROSPECT' };
        if (!SOURCE_TYPES.has(prospect.source_type)) {
            return { eligible: false, reason: 'INVALID_SOURCE_TYPE' };
        }
        if (suppressed) return { eligible: false, reason: 'SUPPRESSED' };
        if (prospect.source_type === 'SYNTHETIC_DEMO') {
            return { eligible: false, reason: 'SYNTHETIC_DEMO_CANNOT_OUTREACH' };
        }
        if (requireVerifiedSourceForReal && prospect.source_type === 'REAL' && !prospect.verification?.provider_verified) {
            return { eligible: false, reason: 'REAL_PROSPECT_NOT_VERIFIED' };
        }
        if ((prospect.score?.opportunity_score ?? 0) < minimumOpportunityScore) {
            return { eligible: false, reason: 'OPPORTUNITY_SCORE_BELOW_THRESHOLD' };
        }
        if (!prospect.contact_email && !prospect.contact_phone) {
            return { eligible: false, reason: 'NO_CONTACT_CHANNEL' };
        }
        return { eligible: true, reason: 'ELIGIBLE' };
    }

    transition(prospect, nextStatus) {
        if (!STATUSES.has(nextStatus)) {
            throw new Error(`Invalid prospect status: ${nextStatus}`);
        }
        return { ...prospect, status: nextStatus };
    }

    buildAttributionMetadata(prospect, campaign = {}) {
        return {
            prospect_id: prospect.id || null,
            source_type: prospect.source_type,
            source_id: prospect.source_id || null,
            campaign_id: campaign.campaign_id || null,
            medium: campaign.medium || 'outbound',
            created_at: new Date().toISOString()
        };
    }

    clean(value) {
        if (value === null || value === undefined) return null;
        const text = String(value).trim();
        return text ? text : null;
    }

    normalizeEmail(value) {
        const email = this.clean(value);
        if (!email) return null;
        const normalized = email.toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
        return normalized;
    }

    normalizeUrl(value) {
        const raw = this.clean(value);
        if (!raw) return null;
        try {
            const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
            return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
        } catch {
            return null;
        }
    }

    isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }
}

export const LEAD_SOURCE_TYPES = Object.freeze(Array.from(SOURCE_TYPES));
export const LEAD_STATUSES = Object.freeze(Array.from(STATUSES));
