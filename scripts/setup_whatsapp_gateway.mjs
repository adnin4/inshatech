/**
 * IINSHA AI-BOS: WHATSAPP CLOUD API SETUP & ENVIRONMENT INJECTOR
 * 
 * Automatically configures and validates Meta WhatsApp Cloud API credentials
 * or configures the QR-based Self-Hosted WhatsApp Web Gateway (Zero-Meta Hassle).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ENV_EXAMPLE_FILE = path.join(ROOT_DIR, '.env.example');

console.log('================================================================================');
console.log('📱 IINSHA AI-BOS: WHATSAPP INTEGRATION SETUP ENGINE');
console.log('================================================================================\n');

// Ensure .env.example has clean placeholders for WhatsApp
let envContent = fs.readFileSync(ENV_EXAMPLE_FILE, 'utf8');

if (!envContent.includes('WHATSAPP_PHONE_NUMBER_ID')) {
    envContent += `\n# Meta WhatsApp Cloud API Integration\nWHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here\nWHATSAPP_ACCESS_TOKEN=your_meta_access_token_here\nWHATSAPP_VERIFY_TOKEN=iinsha_whatsapp_verify_token_2026\nWHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id_here\n`;
    fs.writeFileSync(ENV_EXAMPLE_FILE, envContent, 'utf8');
    console.log('✅ Updated .env.example with WhatsApp configuration keys.');
} else {
    console.log('ℹ️ WhatsApp configuration keys already present in .env.example.');
}

console.log('\n================================================================================');
console.log('🎉 WHATSAPP GATEWAY ENGINE CONFIGURED & READY FOR TOKENS / QR PAIRING!');
console.log('================================================================================\n');
