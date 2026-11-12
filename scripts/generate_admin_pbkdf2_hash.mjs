/**
 * scripts/generate_admin_pbkdf2_hash.mjs
 * Secure PBKDF2-HMAC-SHA256 Credential Generation Utility for IINSHA AI-BOS
 *
 * Generates OWASP-recommended 600,000-iteration salted hash for ADMIN_PASSWORD_HASH secret.
 * Usage: node scripts/generate_admin_pbkdf2_hash.mjs "<password>"
 */

import crypto from 'node:crypto';

const password = process.argv[2] || 'TestSuperAdminKey2026!';
const iterations = parseInt(process.argv[3], 10) || 600000;

const salt = crypto.randomBytes(16);
const derived = crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');

const saltHex = salt.toString('hex');
const hashHex = derived.toString('hex');
const formatted = `pbkdf2:${iterations}:${saltHex}:${hashHex}`;

console.log('================================================================================');
console.log('🔐 IINSHA AI-BOS: SECURE PBKDF2-HMAC-SHA256 CREDENTIAL GENERATOR');
console.log('================================================================================');
console.log(`Iterations : ${iterations} (OWASP Recommended)`);
console.log(`Salt (Hex) : ${saltHex}`);
console.log(`Hash (Hex) : ${hashHex}`);
console.log('--------------------------------------------------------------------------------');
console.log('Formatted Secret Value for ADMIN_PASSWORD_HASH:');
console.log(formatted);
console.log('================================================================================');
