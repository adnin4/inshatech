import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const portalJsPath = path.join(ROOT, 'js', 'core', 'affiliate-portal.js');
let js = fs.readFileSync(portalJsPath, 'utf8');

// Add 1-click Demo Partner Access button inside renderAuthGateway
if (!js.includes('⚡ 1-Click Instant Partner Access (Demo Partner)')) {
    js = js.replace(
        '<!-- Auth Mode Switch Tabs -->',
        () => `<div style="text-align:center; margin-bottom:20px;">
                    <button type="button" onclick="window.quickDemoLogin('mahin10')" style="background:linear-gradient(135deg, #00f2fe, #0284c7); color:#000; font-weight:800; padding:12px 24px; border:none; border-radius:8px; cursor:pointer; width:100%; max-width:460px; font-size:0.95rem; box-shadow:0 4px 15px rgba(0, 242, 254, 0.35); transition:all 0.2s;">
                        ⚡ 1-Click Instant Partner Access (Demo Partner) →
                    </button>
                    <div style="display:flex; align-items:center; gap:8px; max-width:460px; margin:14px auto 0 auto;"><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div><span style="font-size:0.72rem; color:#64748b; font-family:monospace;">OR LOG IN / REGISTER WITH DETAILS</span><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div></div>
                </div>\n                <!-- Auth Mode Switch Tabs -->`
    );
}

// In handlePartnerSignIn, default password if empty
js = js.replace(
    "const password = document.getElementById('signin-password').value;",
    () => "const password = (document.getElementById('signin-password')?.value || '').trim() || '123456';"
);

// Pre-fill signin input with mahin10 and 123456
js = js.replace(
    'placeholder="Enter your password"',
    () => 'placeholder="Enter your password" value="123456"'
);
js = js.replace(
    'placeholder="partner@inshatech.pages.dev or mahin10"',
    () => 'placeholder="partner@inshatech.pages.dev or mahin10" value="mahin10"'
);

fs.writeFileSync(portalJsPath, js, 'utf8');
console.log('✓ Added instant 1-click demo partner access in renderAuthGateway');
