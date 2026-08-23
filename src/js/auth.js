/**
 * IINSHA AI-BOS — Client-Side Supabase Auth & RBAC Manager
 */

(function () {
  'use strict';

  const SUPABASE_CONFIG = {
    url: window.SUPABASE_URL || 'https://inshatech-db.supabase.co',
    anonKey: window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
  };

  class AuthManager {
    constructor() {
      this.client = null;
      this.session = null;
      this.initClient();
    }

    initClient() {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      }
    }

    async getSession() {
      if (this.client) {
        const { data } = await this.client.auth.getSession();
        this.session = data?.session || null;
        return this.session;
      }
      return null;
    }

    async signInWithPassword(email, password) {
      if (!this.client) {
        return { error: { message: 'Supabase client initializing' } };
      }
      const res = await this.client.auth.signInWithPassword({ email, password });
      if (res.data?.session) {
        this.session = res.data.session;
        sessionStorage.setItem('iinsha_auth_token', this.session.access_token);
      }
      return res;
    }

    async signOut() {
      if (this.client) {
        await this.client.auth.signOut();
      }
      this.session = null;
      sessionStorage.removeItem('iinsha_auth_token');
      sessionStorage.removeItem('iinsha_user_role');
    }
  }

  window.IINSHA_AUTH = new AuthManager();
})();
