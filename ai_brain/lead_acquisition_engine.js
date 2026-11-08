/**
 * IINSHA AI-BOS — REAL LEAD ACQUISITION & ADAPTER ENGINE
 * Wave 2: Lawful lead sources, provider abstraction (LeadSourceAdapter),
 * strict classification (REAL_PROSPECT, SYNTHETIC_DEMO, MANUAL, REFERRAL, IMPORTED),
 * deduplication, enrichment, and multi-factor opportunity scoring.
 */

class LeadSourceAdapter {
    constructor(providerCode, name, type) {
        this.providerCode = providerCode;
        this.name = name;
        this.type = type; // SEARCH, DIRECTORY, CRM, REFERRAL, INBOUND, SYNTHETIC
        this.isConfigured = type === 'SYNTHETIC' || type === 'INBOUND' || type === 'MANUAL';
    }

    discover(querySpec = {}) {
        if (!this.isConfigured) {
            return {
                status: 'NOT_CONFIGURED',
                provider: this.name,
                message: `Provider '${this.name}' requires external API credentials to execute live discovery queries.`
            };
        }
        return {
            status: 'DISCOVERY_EXECUTED',
            provider: this.name,
            results: []
        };
    }

    enrich(prospectRecord) {
        if (!this.isConfigured) {
            return { status: 'NOT_CONFIGURED', enrichedData: {} };
        }
        return {
            status: 'ENRICHMENT_COMPLETE',
            enrichedData: {
                verifiedDomain: prospectRecord.companyDomain || 'verified-business.com',
                techStackIdentified: ['n8n', 'Node.js', 'PostgreSQL', 'Stripe'],
                estimatedTeamSize: '10-50 employees'
            }
        };
    }

    validate(prospectRecord) {
        const hasName = Boolean(prospectRecord.name && prospectRecord.name.trim().length > 2);
        const hasCompany = Boolean(prospectRecord.company && prospectRecord.company.trim().length > 2);
        const hasContact = Boolean(prospectRecord.email || prospectRecord.phone);
        return {
            isValid: hasName && hasCompany && hasContact,
            missingFields: [
                !hasName && 'name',
                !hasCompany && 'company',
                !hasContact && 'contact (email or phone)'
            ].filter(Boolean)
        };
    }
}

class LeadAcquisitionEngine {
    constructor() {
        this.adapters = new Map([
            ['SEARCH_PROVIDER', new LeadSourceAdapter('SEARCH_PROVIDER', 'Lawful Web & Search API Provider', 'SEARCH')],
            ['BUSINESS_DIRECTORY', new LeadSourceAdapter('BUSINESS_DIRECTORY', 'Verified Business Registry & Directory', 'DIRECTORY')],
            ['CRM_IMPORT', new LeadSourceAdapter('CRM_IMPORT', 'Customer CRM / CSV Ingestion Adapter', 'CRM')],
            ['REFERRAL_PROVIDER', new LeadSourceAdapter('REFERRAL_PROVIDER', 'Affiliate & Partner Referral Network', 'REFERRAL')],
            ['INBOUND_FORM', new LeadSourceAdapter('INBOUND_FORM', 'Website Inbound & AI Solution Finder', 'INBOUND')],
            ['DEMO_GENERATOR', new LeadSourceAdapter('DEMO_GENERATOR', 'Synthetic Demo Simulation Generator', 'SYNTHETIC')]
        ]);

        this.optOutList = new Set(['spam@example.com', 'optout@company.com', 'unsubscribed@user.com']);
        this.prospectStore = new Map();
    }

    /**
     * Ingest or discover a prospect with strict classification, validation, and opportunity scoring
     * @param {Object} prospectData 
     * @returns {Object} Processed and classified prospect record
     */
    ingestProspect(prospectData) {
        const email = (prospectData.email || '').toLowerCase().trim();
        const domain = prospectData.companyDomain || (email.includes('@') ? email.split('@')[1] : null);

        // 1. Opt-out and Suppression Check
        if (this.optOutList.has(email) || (domain && this.optOutList.has(domain))) {
            return {
                status: 'SUPPRESSED',
                leadStatus: 'SUPPRESSED',
                reason: 'Email or domain is in the active suppression / opt-out registry.',
                email
            };
        }

        // 2. Validate Prospect Data
        const adapterKey = prospectData.source_id || 'INBOUND_FORM';
        const adapter = this.adapters.get(adapterKey) || this.adapters.get('INBOUND_FORM');
        const validation = adapter.validate(prospectData);
        if (!validation.isValid) {
            return {
                status: 'REJECTED_INVALID_DATA',
                missingFields: validation.missingFields
            };
        }

        // 3. Prospect Classification Gate
        let classification = prospectData.classification || 'MANUAL';
        if (!['REAL_PROSPECT', 'SYNTHETIC_DEMO', 'MANUAL', 'REFERRAL', 'IMPORTED'].includes(classification)) {
            classification = 'MANUAL';
        }

        // 4. Deduplication Check
        const dedupKey = email || `${prospectData.name}_${prospectData.company}`;
        if (this.prospectStore.has(dedupKey)) {
            const existing = this.prospectStore.get(dedupKey);
            existing.interactionCount = (existing.interactionCount || 1) + 1;
            existing.lastSeenAt = new Date().toISOString();
            return {
                status: 'DUPLICATE_UPDATED',
                lead_id: existing.lead_id,
                classification: existing.classification,
                record: existing
            };
        }

        // 5. Multi-Factor Opportunity Scoring
        const icpFit = this.calculateIcpFit(prospectData);
        const intentScore = this.calculateIntentScore(prospectData);
        const painScore = prospectData.painPoint ? 90 : 50;
        const budgetScore = prospectData.visitedPricing || prospectData.budgetUSD >= 500 ? 85 : 50;
        const serviceFit = 90;

        const opportunityScore = Math.round(
            (icpFit * 0.30) + (intentScore * 0.25) + (painScore * 0.20) + (budgetScore * 0.15) + (serviceFit * 0.10)
        );

        // 6. Determine Lead Status
        let leadStatus = 'DISCOVERED';
        if (classification === 'SYNTHETIC_DEMO') {
            leadStatus = 'QUALIFIED_DEMO_ONLY';
        } else if (opportunityScore >= 75) {
            leadStatus = 'OUTREACH_READY';
        } else {
            leadStatus = 'ENRICHED';
        }

        const prospectRecord = {
            lead_id: `PROSPECT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: prospectData.name,
            email: email || null,
            phone: prospectData.phone || null,
            company: prospectData.company,
            companyDomain: domain,
            industry: prospectData.industry || 'Technology & Digital Services',
            targetRole: prospectData.role || 'Executive Decision Maker',
            source_id: adapter.providerCode,
            classification: classification,
            is_synthetic: classification === 'SYNTHETIC_DEMO',
            scores: {
                icpFit,
                intentScore,
                painScore,
                budgetScore,
                serviceFit,
                opportunityScore
            },
            leadStatus: leadStatus,
            recommended_service: this.matchRecommendedService(prospectData.industry, prospectData.painPoint),
            created_at: new Date().toISOString()
        };

        this.prospectStore.set(dedupKey, prospectRecord);

        return {
            status: 'INGESTED_SUCCESS',
            lead_id: prospectRecord.lead_id,
            classification: prospectRecord.classification,
            leadStatus: prospectRecord.leadStatus,
            opportunityScore: prospectRecord.scores.opportunityScore,
            isOutreachEligible: prospectRecord.leadStatus === 'OUTREACH_READY',
            record: prospectRecord
        };
    }

    calculateIcpFit(data) {
        let score = 40;
        const industry = (data.industry || '').toLowerCase();
        const role = (data.role || '').toLowerCase();

        if (industry.includes('saas') || industry.includes('tech') || industry.includes('agency')) score += 25;
        if (industry.includes('ecommerce') || industry.includes('retail')) score += 20;
        if (industry.includes('real estate') || industry.includes('clinic')) score += 20;

        if (role.includes('founder') || role.includes('ceo') || role.includes('owner') || role.includes('managing director')) score += 25;
        else if (role.includes('director') || role.includes('vp') || role.includes('head')) score += 20;
        else if (role.includes('manager')) score += 10;

        return Math.min(score, 100);
    }

    calculateIntentScore(data) {
        let score = 30;
        if (data.visitedPricing) score += 30;
        if (data.interactedWithCopilot) score += 20;
        if (data.requestedQuote) score += 35;
        if (data.painPoint) score += 15;
        return Math.min(score, 100);
    }

    matchRecommendedService(industry = '', pain = '') {
        const ind = industry.toLowerCase();
        const p = pain.toLowerCase();

        if (ind.includes('saas') || p.includes('lead') || p.includes('b2b')) return 'b2b-lead-swarm';
        if (ind.includes('ecommerce') || p.includes('whatsapp') || p.includes('customer')) return 'ecommerce-ai-whatsapp';
        if (ind.includes('real estate') || ind.includes('clinic') || p.includes('voice')) return 'voice-ai-receptionist';
        if (p.includes('zapier') || p.includes('workflow') || p.includes('cost')) return 'n8n-docker-cluster';
        if (p.includes('invoice') || p.includes('document')) return 'invoice-ocr-pipeline';

        return 'b2b-lead-swarm';
    }

    registerOptOut(identifier) {
        if (!identifier) return false;
        this.optOutList.add(identifier.toLowerCase().trim());
        return true;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LeadAcquisitionEngine, LeadSourceAdapter };
}
