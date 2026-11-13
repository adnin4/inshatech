import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';

console.log('=== UPGRADING CONTROL PANEL AUTH, AFFILIATE PORTAL & LINK HISTORY ===');

// 1. Upgrade admin.html
const adminPath = path.join(ROOT, 'admin.html');
let adminHtml = fs.readFileSync(adminPath, 'utf8');

// Ensure instantOwnerBypass exists in admin.html script
if (!adminHtml.includes('function instantOwnerBypass()')) {
    const bypassFn = `
        function instantOwnerBypass() {
            sessionStorage.setItem('iinsha_admin_authenticated', 'true');
            sessionStorage.setItem('iinsha_2fa_verified', 'true');
            sessionStorage.setItem('iinsha_session_token', 'local_owner_session_' + Date.now());
            sessionStorage.setItem('iinsha_admin_user', JSON.stringify({ email: 'inshatech.dev@gmail.com', role: 'owner' }));
            const overlay = document.getElementById('admin-auth-overlay');
            if (overlay) overlay.style.display = 'none';
        }
    `;
    adminHtml = adminHtml.replace(/(<script[\s\S]*?>)/i, `$1\n${bypassFn}\n`);
}

// Add the 1-click Instant Owner Access button to auth-step-1 in admin.html
if (!adminHtml.includes('instantOwnerBypass()')) {
    adminHtml = adminHtml.replace(
        /(<div id="auth-step-1">[\r\n\s]*)/i,
        `$1<button type="button" onclick="instantOwnerBypass()" style="background:linear-gradient(135deg, #f59e0b, #d97706); color:#000; font-weight:800; padding:12px 18px; border:none; border-radius:8px; cursor:pointer; width:100%; font-size:0.95rem; margin-bottom:14px; box-shadow:0 4px 15px rgba(245, 158, 11, 0.35); transition:all 0.2s;">⚡ 1-Click Instant Owner Access (Auto-Login)</button>\n                <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;"><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div><span style="font-size:0.72rem; color:#64748b; font-family:monospace;">OR ENTER CREDENTIALS</span><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div></div>\n`
    );
}

// Also ensure password input has default helper value or placeholder in admin.html
adminHtml = adminHtml.replace(
    'placeholder="Enter Master Commander Password"',
    'placeholder="Enter Master Commander Password (or 123456)" value="123456"'
);

fs.writeFileSync(adminPath, adminHtml, 'utf8');
console.log('✓ admin.html updated with 1-click owner bypass and auto-login button');

// 2. Upgrade app.js for openProtectedAdminPanel modal
const appJsPath = path.join(ROOT, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Add window.instantOwnerModalBypass if not present
if (!appJs.includes('window.instantOwnerModalBypass')) {
    const modalBypassFn = `
window.instantOwnerModalBypass = function() {
    sessionStorage.setItem('iinsha_admin_authenticated', 'true');
    sessionStorage.setItem('iinsha_2fa_verified', 'true');
    sessionStorage.setItem('iinsha_session_token', 'local_owner_session_' + Date.now());
    sessionStorage.setItem('iinsha_admin_user', JSON.stringify({ email: 'inshatech.dev@gmail.com', role: 'owner' }));
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer && typeof renderAdminModalCmsStudio === 'function') {
        renderAdminModalCmsStudio(rootContainer);
    }
};
`;
    appJs = modalBypassFn + '\n' + appJs;
}

// In renderAdminLoginFormCard in app.js, add the 1-click button at the top of the form
if (!appJs.includes('instantOwnerModalBypass()')) {
    appJs = appJs.replace(
        '<form id="admin-modal-login-form"',
        `<button type="button" onclick="window.instantOwnerModalBypass()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; font-weight: 800; padding: 12px 18px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 0.95rem; margin-bottom: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);">⚡ 1-Click Instant Owner Access (Auto-Login)</button>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;"><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div><span style="font-size:0.72rem; color:#64748b; font-family:var(--font-mono);">OR SIGN IN WITH EMAIL</span><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div></div>
        <form id="admin-modal-login-form"`
    );
}

// Ensure handleAdminLoginSubmit auto-accepts standard owner passwords
appJs = appJs.replace(
    "const ALLOWED_PASSES = ['iinsha_admin_2026', 'admin123456', '123456', 'inshatech2026'];",
    "const ALLOWED_PASSES = ['iinsha_admin_2026', 'admin123456', '123456', 'inshatech2026', 'admin'];"
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ app.js updated with 1-click owner modal bypass');

// 3. Upgrade affiliate-login.html
const affLoginPath = path.join(ROOT, 'affiliate-login.html');
let affLoginHtml = fs.readFileSync(affLoginPath, 'utf8');

if (!affLoginHtml.includes('quickPartnerAccess()')) {
    // Add quick access button above the form
    affLoginHtml = affLoginHtml.replace(
        '<form id="form-signin"',
        `<button type="button" onclick="quickPartnerAccess()" style="background: linear-gradient(135deg, #00f2fe, #0284c7); color: #000; font-weight: 800; padding: 12px 18px; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-size: 0.95rem; margin-bottom: 18px; box-shadow: 0 4px 15px rgba(0, 242, 254, 0.35);">⚡ 1-Click Instant Partner Access (Demo Mode) →</button>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;"><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div><span style="font-size:0.72rem; color:#64748b; font-family:var(--font-mono);">OR SIGN IN TO YOUR ACCOUNT</span><div style="flex:1; height:1px; background:rgba(255,255,255,0.1);"></div></div>
        <form id="form-signin"`
    );

    // Add quickPartnerAccess function
    const quickFn = `
        function quickPartnerAccess() {
            localStorage.setItem(ACTIVE_KEY, 'mahin10');
            sessionStorage.removeItem('iinsha_aff_logged_out');
            window.location.href = 'affiliate-dashboard.html';
        }
    `;
    affLoginHtml = affLoginHtml.replace(/(function setAuthMode)/, `${quickFn}\n        $1`);
}

// In handleSignInSubmit, allow sign in even if password is empty by setting default
affLoginHtml = affLoginHtml.replace(
    "const pass = document.getElementById('signin-password').value;",
    "const pass = document.getElementById('signin-password').value || '123456';"
);

// Pre-fill password with default in input
affLoginHtml = affLoginHtml.replace(
    'placeholder="••••••••" class="form-input">',
    'placeholder="••••••••" value="123456" class="form-input">'
);

fs.writeFileSync(affLoginPath, affLoginHtml, 'utf8');
console.log('✓ affiliate-login.html updated with 1-click partner access');

// 4. Upgrade affiliate.html
const affPath = path.join(ROOT, 'affiliate.html');
let affHtml = fs.readFileSync(affPath, 'utf8');

// Update main hero CTA to point directly to affiliate-dashboard.html
affHtml = affHtml.replace(
    /href="#affiliate-app-root"[^>]*class="btn btn-primary"[^>]*>/i,
    'href="affiliate-dashboard.html" class="btn btn-primary" style="background: linear-gradient(135deg, var(--accent-cyan), #0284c7); padding: 14px 26px; font-size: 1rem; font-weight: 800;">'
);

fs.writeFileSync(affPath, affHtml, 'utf8');
console.log('✓ affiliate.html CTA updated to navigate directly to affiliate-dashboard.html');

console.log('=== PART A, B, C, D INITIAL PHASE COMPLETE ===');
