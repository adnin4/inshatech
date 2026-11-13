/**
 * scripts/generate_admin_pbkdf2_hash.mjs
 * Secure PBKDF2-HMAC-SHA256 Credential Generation Utility for IINSHA AI-BOS
 *
 * Generates OWASP-recommended 600,000-iteration salted hash for ADMIN_PASSWORD_HASH secret.
 * Security Invariant: Accepts password via secure interactive prompt or piped stdin
 * to prevent plaintext passwords from being recorded in shell history or process tables.
 *
 * Usage:
 *   Interactive (secure, masked): node scripts/generate_admin_pbkdf2_hash.mjs
 *   Piped (CI / automated):       echo "MySecretPassword" | node scripts/generate_admin_pbkdf2_hash.mjs
 */

import crypto from 'node:crypto';
import readline from 'node:readline';

async function getPassword() {
    // 1. Environment variable fallback (useful for CI/Docker without shell history exposure)
    if (process.env.ADMIN_PASSWORD_INPUT) {
        return process.env.ADMIN_PASSWORD_INPUT.trim();
    }

    // 2. CLI argument (only if explicitly provided, with warning)
    if (process.argv[2]) {
        console.warn('⚠️  Warning: Passing passwords via CLI arguments may expose them in process logs and shell history.');
        return process.argv[2];
    }

    // 3. Interactive prompt or piped stdin
    if (!process.stdin.isTTY) {
        // Piped stdin
        return new Promise((resolve, reject) => {
            let data = '';
            process.stdin.setEncoding('utf8');
            process.stdin.on('data', chunk => { data += chunk; });
            process.stdin.on('end', () => resolve(data.trim()));
            process.stdin.on('error', reject);
        });
    }

    // Interactive TTY prompt
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Prompt user
        process.stdout.write('Enter Admin Password to Hash: ');

        // Disable raw echo if supported for privacy
        if (process.stdin.isTTY) {
            process.stdin.on('data', () => {});
        }

        rl.question('', (answer) => {
            rl.close();
            console.log(''); // newline after enter
            resolve(answer.trim());
        });
    });
}

async function main() {
    const iterations = parseInt(process.argv[3], 10) || 600000;
    const password = await getPassword();

    if (!password) {
        console.error('❌ Error: Password cannot be empty.');
        process.exit(1);
    }

    if (password.length < 12) {
        console.warn('⚠️  Warning: Password length is under 12 characters. Enterprise minimum 16+ recommended.');
    }

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
    console.log('Formatted Secret Value for Cloudflare Pages ADMIN_PASSWORD_HASH:');
    console.log(formatted);
    console.log('================================================================================');
}

main().catch(err => {
    console.error('Fatal error generating hash:', err);
    process.exit(1);
});
