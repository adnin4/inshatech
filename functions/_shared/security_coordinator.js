/**
 * functions/_shared/security_coordinator.js
 * Cloudflare Durable Object: SecurityCoordinator
 * Strongly consistent, SQLite-backed transactional state authority for:
 * 1. Immediate global session revocation (zero eventual consistency delay)
 * 2. Hardware Emergency Kill-Switch & Agent Swarm lockdown
 * 3. MFA TOTP time-step replay prevention
 */

export class SecurityCoordinator {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sql = state.storage?.sql || null;
        this.state.blockConcurrencyWhile(async () => {
            await this.initSchema();
        });
    }

    async initSchema() {
        if (this.sql) {
            // SQLite storage inside Durable Object
            this.sql.exec(`
                CREATE TABLE IF NOT EXISTS revoked_tokens (
                    jti TEXT PRIMARY KEY,
                    revoked_at TEXT NOT NULL,
                    expires_at INTEGER NOT NULL
                );
                CREATE TABLE IF NOT EXISTS system_state (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS mfa_used_tokens (
                    code TEXT PRIMARY KEY,
                    used_at INTEGER NOT NULL
                );
            `);
        }
    }

    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // 1. Session Revocation
            if (path === '/revoke' && request.method === 'POST') {
                const { jti, exp } = await request.json().catch(() => ({}));
                if (!jti) return new Response(JSON.stringify({ error: 'Missing jti' }), { status: 400 });

                const now = new Date().toISOString();
                const expiresAt = exp || Math.floor(Date.now() / 1000) + 86400;

                if (this.sql) {
                    this.sql.exec(
                        'INSERT OR REPLACE INTO revoked_tokens (jti, revoked_at, expires_at) VALUES (?, ?, ?)',
                        jti, now, expiresAt
                    );
                } else {
                    await this.state.storage.put(`revoked:${jti}`, { revoked_at: now, expires_at: expiresAt });
                }

                return new Response(JSON.stringify({ status: 'REVOKED', jti, timestamp: now }), { status: 200 });
            }

            if (path === '/is-revoked' && request.method === 'GET') {
                const jti = url.searchParams.get('jti');
                if (!jti) return new Response(JSON.stringify({ error: 'Missing jti' }), { status: 400 });

                const nowSec = Math.floor(Date.now() / 1000);
                let isRevoked = false;
                if (this.sql) {
                    // Actively enforce expires_at during lookup and prune expired records
                    const cursor = this.sql.exec('SELECT 1 FROM revoked_tokens WHERE jti = ? AND expires_at > ?', jti, nowSec);
                    isRevoked = cursor.toArray().length > 0;
                    this.sql.exec('DELETE FROM revoked_tokens WHERE expires_at <= ?', nowSec);
                } else {
                    const val = await this.state.storage.get(`revoked:${jti}`);
                    isRevoked = Boolean(val && (!val.expires_at || val.expires_at > nowSec));
                }

                return new Response(JSON.stringify({ jti, is_revoked: isRevoked }), { status: 200 });
            }

            // 2. Kill-Switch State
            if (path === '/killswitch' && request.method === 'POST') {
                const { action } = await request.json().catch(() => ({}));
                const active = action === 'ENGAGE_KILL_SWITCH';
                const now = new Date().toISOString();

                if (this.sql) {
                    this.sql.exec(
                        'INSERT OR REPLACE INTO system_state (key, value, updated_at) VALUES (?, ?, ?)',
                        'system_lockdown', active ? 'true' : 'false', now
                    );
                } else {
                    await this.state.storage.put('system_lockdown', active);
                }

                return new Response(JSON.stringify({
                    status: active ? 'LOCKDOWN_ENGAGED' : 'LOCKDOWN_DISENGAGED',
                    killswitch_active: active,
                    timestamp: now
                }), { status: 200 });
            }

            if (path === '/killswitch' && request.method === 'GET') {
                let active = false;
                if (this.sql) {
                    const cursor = this.sql.exec("SELECT value FROM system_state WHERE key = 'system_lockdown'");
                    const rows = cursor.toArray();
                    active = rows.length > 0 && rows[0].value === 'true';
                } else {
                    active = Boolean(await this.state.storage.get('system_lockdown'));
                }

                return new Response(JSON.stringify({
                    status: 'KILLSWITCH_STATUS',
                    killswitch_active: active,
                    timestamp: new Date().toISOString()
                }), { status: 200 });
            }

            // 3. MFA TOTP Replay Prevention
            if (path === '/mfa-verify' && request.method === 'POST') {
                const { code, step } = await request.json().catch(() => ({}));
                if (!code || !step) return new Response(JSON.stringify({ error: 'Missing code or step' }), { status: 400 });

                const now = Math.floor(Date.now() / 1000);
                const key = `${code}:${step}`;

                let alreadyUsed = false;
                if (this.sql) {
                    // Safe retention cleanup: prune MFA replay tokens older than 5 minutes (300s)
                    this.sql.exec('DELETE FROM mfa_used_tokens WHERE used_at < ?', now - 300);
                    const cursor = this.sql.exec('SELECT 1 FROM mfa_used_tokens WHERE code = ?', key);
                    alreadyUsed = cursor.toArray().length > 0;
                    if (!alreadyUsed) {
                        this.sql.exec('INSERT INTO mfa_used_tokens (code, used_at) VALUES (?, ?)', key, now);
                    }
                } else {
                    alreadyUsed = Boolean(await this.state.storage.get(`mfa:${key}`));
                    if (!alreadyUsed) {
                        await this.state.storage.put(`mfa:${key}`, now);
                    }
                }

                if (alreadyUsed) {
                    return new Response(JSON.stringify({
                        status: 'REPLAY_DETECTED',
                        error: 'TOTP code has already been used in this time-step'
                    }), { status: 409 });
                }

                return new Response(JSON.stringify({ status: 'ACCEPTED' }), { status: 200 });
            }

            return new Response('Not Found', { status: 404 });

        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
    }
}
