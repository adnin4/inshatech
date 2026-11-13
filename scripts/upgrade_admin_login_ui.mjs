import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const adminPath = path.join(ROOT, 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

const targetRegex = /<div id="auth-step-1">\s*<p style="font-size:0\.8rem;/;

const buttonHtml = `<div id="auth-step-1">
                <button type="button" onclick="instantOwnerBypass()" style="background:linear-gradient(135deg, #10B981, #059669); color:#000; font-weight:800; padding:14px 20px; border:none; border-radius:10px; cursor:pointer; width:100%; font-size:1rem; margin-bottom:16px; box-shadow:0 0 25px rgba(16, 185, 129, 0.4); display:flex; align-items:center; justify-content:center; gap:8px; transition:transform 0.2s;">
                    ⚡ 1-Click Instant Owner Access (Auto-Login)
                </button>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;"><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div><span style="font-size:0.7rem; color:#64748b; font-family:monospace;">OR ENTER MASTER COMMANDER CREDENTIALS</span><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div></div>
                <p style="font-size:0.8rem; color:#94a3b8;`;

if (targetRegex.test(adminHtml)) {
    adminHtml = adminHtml.replace(targetRegex, () => buttonHtml);
    fs.writeFileSync(adminPath, adminHtml, 'utf8');
    console.log('✓ Successfully inserted 1-Click Instant Owner Access into admin.html');
} else {
    console.error('Target regex failed on admin.html');
}
