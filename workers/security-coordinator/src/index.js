/**
 * Standalone Cloudflare Worker for SecurityCoordinator Durable Object
 *
 * Cloudflare Pages supports DO bindings (`script_name`), while DO class
 * definitions and SQLite migrations must live in a dedicated Worker script.
 */

export { SecurityCoordinator } from '../../../functions/_shared/security_coordinator.js';

export default {
    async fetch() {
        return new Response(JSON.stringify({
            status: 'ACTIVE',
            service: 'iinsha-security-coordinator',
            note: 'Internal Durable Object authority Worker. Bind via SECURITY_COORDINATOR.'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        });
    }
};
