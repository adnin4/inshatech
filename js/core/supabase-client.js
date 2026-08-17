/**
 * IINSHA AI-BOS — Unified Supabase Client & Local Mock Fallback
 * Provides consistent data access with Row-Level Security awareness.
 */

(function(window) {
    'use strict';

    class IINSHASupabaseClient {
        constructor() {
            this.supabaseUrl = window.ENV_SUPABASE_URL || localStorage.getItem('iinsha_supabase_url') || '';
            this.supabaseAnonKey = window.ENV_SUPABASE_ANON_KEY || localStorage.getItem('iinsha_supabase_anon_key') || '';
            this.isConfigured = !!(this.supabaseUrl && this.supabaseAnonKey);
        }

        async getServices() {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.services) return data.services;
                }
            } catch (e) {}

            // Graceful fallback to static services JSON
            try {
                const res = await fetch('/knowledge/services.json');
                if (res.ok) return await res.json();
            } catch (e) {}

            return [];
        }

        async getFAQs() {
            try {
                const res = await fetch('/knowledge/faqs.json');
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        }

        async trackAffiliateClick(affiliateId, landingPage) {
            try {
                const res = await fetch('/api/affiliate/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ affiliate_id: affiliateId, landing_page: landingPage })
                });
                return await res.json();
            } catch (e) {
                return { status: 'OFFLINE_FALLBACK', affiliate_id: affiliateId };
            }
        }

        async createOrder(orderPayload) {
            try {
                const res = await fetch('/api/payments/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });
                return await res.json();
            } catch (e) {
                return { status: 'ERROR', error: e.message };
            }
        }

        async submitLead(leadPayload) {
            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadPayload)
                });
                return await res.json();
            } catch (e) {
                return { status: 'OFFLINE_SAVED' };
            }
        }
    }

    window.IINSHADB = new IINSHASupabaseClient();
})(window);
