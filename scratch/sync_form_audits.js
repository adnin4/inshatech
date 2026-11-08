import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const formAuditCode = fs.readFileSync(path.join(ROOT_DIR, 'scripts/form_contract_audit.mjs'), 'utf-8');
fs.writeFileSync(path.join(ROOT_DIR, 'scripts/public_form_contract_audit.mjs'), formAuditCode, 'utf-8');

console.log("Synchronized scripts/public_form_contract_audit.mjs with scripts/form_contract_audit.mjs");
