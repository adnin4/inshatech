/**
 * IINSHA AI-BOS — Production Notification Dispatcher
 * Every channel must prove provider acceptance before reporting success.
 */

import crypto from 'crypto';

export class MultiChannelNotificationDispatcher {
    constructor(config = {}) {
        this.telegramBotToken = config.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || '';
        this.ownerChatId = config.ownerChatId || process.env.TELEGRAM_OWNER_CHAT_ID || '';
        this.resendApiKey = config.resendApiKey || process.env.RESEND_API_KEY || '';
        this.ownerEmail = config.ownerEmail || process.env.OWNER_EMAIL || '';
        this.ownerPhone = config.ownerPhone || process.env.OWNER_PHONE || '';
        this.dispatchedLogs = [];
    }

    async _sendTelegram(message) {
        if (!this.telegramBotToken || !this.ownerChatId) {
            return { status: 'NOT_CONFIGURED', channel: 'TELEGRAM', missing_env: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_OWNER_CHAT_ID'] };
        }
        const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: this.ownerChatId, text: message })
        });
        const body = await response.json().catch(() => null);
        return { status: response.ok && body?.ok ? 'PROVIDER_ACCEPTED' : 'PROVIDER_ERROR', channel: 'TELEGRAM', provider_receipt: body };
    }

    async _sendEmail(subject, message) {
        if (!this.resendApiKey || !this.ownerEmail) {
            return { status: 'NOT_CONFIGURED', channel: 'EMAIL', missing_env: ['RESEND_API_KEY', 'OWNER_EMAIL'] };
        }
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${this.resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL || 'IINSHA AI <support@inshatech.com>', to: [this.ownerEmail], subject, text: message })
        });
        const body = await response.json().catch(() => null);
        return { status: response.ok ? 'PROVIDER_ACCEPTED' : 'PROVIDER_ERROR', channel: 'EMAIL', provider_receipt: body };
    }

    async dispatchAlert(priority = 'P1', title = '', message = '') {
        const notificationId = `NOTIF-${crypto.randomUUID()}`;
        const results = [await this._sendTelegram(`${title}\n\n${message}`)];
        if (priority === 'P0' || priority === 'P1') results.push(await this._sendEmail(title, message));

        const allAccepted = results.length > 0 && results.every(item => item.status === 'PROVIDER_ACCEPTED');
        const anyAccepted = results.some(item => item.status === 'PROVIDER_ACCEPTED');
        const status = allAccepted ? 'DISPATCHED' : anyAccepted ? 'PARTIAL' : 'NOT_CONFIGURED';

        const logEntry = {
            notification_id: notificationId,
            priority,
            title,
            message,
            timestamp: new Date().toISOString(),
            channels: results,
            delivery_status: status,
            production_verified: status === 'DISPATCHED'
        };
        this.dispatchedLogs.push(logEntry);
        return logEntry;
    }

    getLogs() {
        return [...this.dispatchedLogs];
    }
}
