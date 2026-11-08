/**
 * IINSHA AI-BOS — Client-Side Supabase Auth & RBAC Manager
 */

(function () {
  'use strict';

  const SUPABASE_CONFIG = {
    url: window.SUPABASE_URL || 'https://kitwadizsvjmuxkfewxj.supabase.co',
    anonKey: typeof window.SUPABASE_ANON_KEY === 'string' ? window.SUPABASE_ANON_KEY : ''
  };

  class AuthManager {
    constructor() {
      this.client = null;
      this.session = null;
      this.initClient();
    }

    initClient() {
      if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        this.configError = 'Supabase Auth is not configured for this deployment.';
        return;
      }
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      } else {
        this.configError = 'Supabase client library is unavailable.';
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
        return { error: { message: this.configError || 'Supabase Auth is not configured.' } };
      }
      const res = await this.client.auth.signInWithPassword({ email, password });
      if (res.data?.session) {
        this.session = res.data.session;
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
