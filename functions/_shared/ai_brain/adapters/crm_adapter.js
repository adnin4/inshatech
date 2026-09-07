/**
 * IINSHA AI-BOS — Production CRM Adapter
 *
 * Production rule: never fabricate a CRM success result.
 * Live persistence requires explicit Supabase credentials and a successful
 * provider response. Otherwise the adapter returns NOT_CONFIGURED/BLOCKED.
 */

import crypto from 'crypto';

export class CrmAdapter {
    constructor(config = {}) {
        this.supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || '';
        this.supabaseKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        this.table = config.table || process.env.SUPABASE_LEADS_TABLE || 'ibos_leads';
    }

    _validateConfig() {
        const missing = [];
        if (!this.supabaseUrl) missing.push('SUPABASE_URL');
        if (!this.supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
        return missing;
    }

    async syncLead(leadData = {}) {
        const missing = this._validateConfig();
        if (missing.length) {
            return {
                status: 'NOT_CONFIGURED',
                connector: 'supabase_crm',
                missing_env: missing,
                production_verified: false
            };
        }

        const correlationId = `CRM-${crypto.randomUUID()}`;
        const payload = {
            name: leadData.name || null,
            email: leadData.email || null,
            phone: leadData.phone || null,
            company: leadData.company || null,
            score: Number.isFinite(Number(leadData.score)) ? Number(leadData.score) : null,
            status: leadData.status || 'qualified',
            source: leadData.source || 'IINSHA_AI_BOS',
            correlation_id: correlationId,
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${this.supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(this.table)}`, {
                method: 'POST',
                headers: {
                    apikey: this.supabaseKey,
                    Authorization: `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=representation,resolution=error-if-duplicates'
                },
                body: JSON.stringify(payload)
            });

            const body = await response.json().catch(() => null);
            if (!response.ok) {
                return {
                    status: 'PROVIDER_ERROR',
                    connector: 'supabase_crm',
                    http_code: response.status,
                    correlation_id: correlationId,
                    production_verified: false,
                    error: body?.message || body?.hint || `Supabase returned HTTP ${response.status}`
                };
            }

            return {
                status: 'PERSISTED_TO_POSTGRES',
                connector: 'supabase_crm',
                correlation_id: correlationId,
                production_verified: true,
                provider_receipt: Array.isArray(body) ? body[0] : body
            };
        } catch (error) {
            return {
                status: 'PROVIDER_UNREACHABLE',
                connector: 'supabase_crm',
                correlation_id: correlationId,
                production_verified: false,
                error: error.message
            };
        }
    }
}
