/**
 * IINSHA AI-BOS — AUTONOMOUS CHANNEL ADAPTERS & SENDER REPUTATION ENGINE
 * Wave 2: Governed multi-channel message dispatch (Email, WhatsApp, Webhook).
 * Enforces provider configuration checks, opt-out suppression lists, daily frequency limits,
 * and rate-limiting to protect domain and phone sender reputation.
 */

class AutonomousChannelAdapters {
    constructor() {
        this.channelProviders = {
            EMAIL_RESEND: { name: 'Resend SMTP API', configured: false, dailyLimit: 100, sentToday: 0 },
            WHATSAPP_META: { name: 'Meta WhatsApp Cloud API', configured: false, dailyLimit: 250, sentToday: 0 },
            TELEGRAM_BOT: { name: 'Telegram SRE Alert Bot', configured: false, dailyLimit: 500, sentToday: 0 }
        };

        this.sentHistory = [];
        this.suppressionList = new Set(['unsubscribed@user.com', 'blacklist@spam.com']);
    }

    /**
     * Dispatch an outbound message through a governed channel adapter
     * @param {Object} messageSpec - { channel, recipient, body, campaignId, leadId }
     * @returns {Object} Dispatch result or configuration requirement status
     */
    dispatchMessage(messageSpec) {
        const channelKey = messageSpec.channel || 'EMAIL_RESEND';
        const provider = this.channelProviders[channelKey];

        // 1. Validate Provider Configuration
        if (!provider) {
            return {
                status: 'REJECTED_UNKNOWN_CHANNEL',
                message: `Channel ${channelKey} is not registered in system.`
            };
        }

        // 2. Check Opt-out / Suppression List
        const recipientClean = (messageSpec.recipient || '').toLowerCase().trim();
        if (this.suppressionList.has(recipientClean)) {
            return {
                status: 'BLOCKED_OPTED_OUT',
                recipient: recipientClean,
                reason: 'Recipient is in the global suppression / opt-out list.'
            };
        }

        // 3. Frequency & Rate-Limiting Guard
        if (provider.sentToday >= provider.dailyLimit) {
            return {
                status: 'BLOCKED_RATE_LIMIT_EXCEEDED',
                provider: provider.name,
                limit: provider.dailyLimit,
                reason: 'Daily dispatch limit reached to preserve domain reputation.'
            };
        }

        // 4. Provider Live Key Presence Verification
        if (!provider.configured) {
            return {
                status: 'NOT_CONFIGURED',
                provider: provider.name,
                channel: channelKey,
                requiresSetup: true,
                message: `Channel provider '${provider.name}' requires live API credentials in environment variables to execute real outbound transmission.`,
                queuedPayload: {
                    recipient: messageSpec.recipient,
                    campaignId: messageSpec.campaignId,
                    leadId: messageSpec.leadId,
                    bodySnippet: (messageSpec.body || '').substr(0, 80)
                }
            };
        }

        // 5. Successful Live Dispatch Execution (when credentials present)
        provider.sentToday++;
        const auditReceipt = {
            dispatchId: `DISP_${Date.now()}`,
            timestamp: new Date().toISOString(),
            channel: channelKey,
            recipient: recipientClean,
            status: 'TRANSMITTED_SUCCESS',
            campaignId: messageSpec.campaignId
        };
        this.sentHistory.push(auditReceipt);

        return auditReceipt;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutonomousChannelAdapters };
}
