import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const portalJsPath = path.join(ROOT, 'js', 'core', 'affiliate-portal.js');
let js = fs.readFileSync(portalJsPath, 'utf8');

js = js.replace(/window\.quickDemoLogin/g, 'window.activatePartnerProfile');

fs.writeFileSync(portalJsPath, js, 'utf8');
console.log('✓ Renamed quickDemoLogin to activatePartnerProfile');
