/**
 * IINSHA AI-BOS — Governed Outreach Policy
 *
 * Central policy gate for autonomous outbound actions.
 * The owner remains in control through explicit configuration and approval thresholds.
 */

export class LeadOutreachPolicy {
    constructor(config = {}) {
        this.enabled = config.enabled === true;
        this.maxMessagesPerContactPerDay = this._positiveInt(config.maxMessagesPerContactPerDay, 1);
        this.maxCampaignMessagesPerDay = this._positiveInt(config.maxCampaignMessagesPerDay, 100);
        this.requireVerifiedSource = config.requireVerifiedSource !== false;
        this.requireApprovalForFirstCampaign = config.requireApprovalForFirstCampaign !== false;
    }

    evaluate({ prospect, channel, dailyContactCount = 0, campaignApproved = false, suppressed = false } = {}) {
        if (!this.enabled) return { allowed: false, reason: 'OUTREACH_DISABLED_BY_OWNER' };
        if (!prospect) return { allowed: false, reason: 'MISSING_PROSPECT' };
        if (suppressed) return { allowed: false, reason: 'CONTACT_SUPPRESSED' };
        if (prospect.source_type === 'SYNTHETIC_DEMO') {
            return { allowed: false, reason: 'SYNTHETIC_DATA_CANNOT_OUTREACH' };
        }
        if (this.requireVerifiedSource && prospect.source_type === 'REAL' && !prospect.verification?.provider_verified) {
            return { allowed: false, reason: 'REAL_SOURCE_NOT_VERIFIED' };
        }
        if (!['EMAIL', 'WHATSAPP', 'OTHER'].includes(String(channel || '').toUpperCase())) {
            return { allowed: false, reason: 'UNSUPPORTED_CHANNEL' };
        }
        if (dailyContactCount >= this.maxCampaignMessagesPerDay) {
            return { allowed: false, reason: 'DAILY_CAMPAIGN_LIMIT_REACHED' };
        }
        if (this.requireApprovalForFirstCampaign && !campaignApproved) {
            return { allowed: false, reason: 'OWNER_APPROVAL_REQUIRED' };
        }
        return { allowed: true, reason: 'POLICY_ALLOWED' };
    }

    _positiveInt(value, fallback) {
        const number = Number(value);
        return Number.isInteger(number) && number > 0 ? number : fallback;
    }
}
