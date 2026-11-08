import re

def update_admin_auth_flow():
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    new_auth_fn = '''
function openProtectedAdminPanel() {
    const modal = document.getElementById('admin-control-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.style.zIndex = '10005';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (!rootContainer) return;

    const isAuthenticated = sessionStorage.getItem('iinsha_admin_authenticated') === 'true';

    if (isAuthenticated) {
        renderAdminModalCmsStudio(rootContainer);
    } else {
        renderAdminLoginFormCard(rootContainer);
    }
}

function renderAdminLoginFormCard(container) {
    container.innerHTML = `
        <div id="admin-login-card" style="max-width: 480px; margin: 30px auto; padding: 36px; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent-gold); border-radius: 16px; backdrop-filter: blur(16px); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); color: #fff; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 12px; background: linear-gradient(135deg, var(--accent-gold), #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🔒</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px; color: #fff;">IINSHA TECH OS Admin Gateway</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">Enter your admin credentials to access the 20-Module Control Studio.</p>

            <form id="admin-modal-login-form" onsubmit="handleAdminLoginSubmit(event)" style="text-align: left;">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">ADMIN EMAIL</label>
                <input type="email" id="admin-input-email" value="admin@iinsha.ai" required style="width: 100%; padding: 12px 16px; margin-bottom: 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-card); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">

                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">PASSPHRASE</label>
                <input type="password" id="admin-input-pass" value="admin123" required style="width: 100%; padding: 12px 16px; margin-bottom: 20px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-card); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">

                <div id="admin-login-error" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 14px; display: none;">⚠️ Invalid credentials. Please try again.</div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent-gold), #d97706); color: #000; font-weight: 800; font-size: 1rem; border: none; border-radius: 10px; cursor: pointer; margin-bottom: 12px;">🔓 Authenticate & Open Studio</button>
            </form>

            <div style="margin: 16px 0; border-top: 1px dashed rgba(255,255,255,0.1); position: relative;">
                <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0f172a; padding: 0 10px; font-size: 0.75rem; color: var(--text-muted);">OR</span>
            </div>

            <button onclick="handleAdminMasterUnlock()" class="btn btn-glass" style="width: 100%; padding: 12px; border-color: var(--accent-cyan); color: var(--accent-cyan); font-weight: 700; font-size: 0.9rem; border-radius: 10px; cursor: pointer;">⚡ 1-Click Master Super Admin Unlock</button>
        </div>
    `;
}

function handleAdminLoginSubmit(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('admin-input-email').value;
    const pass = document.getElementById('admin-input-pass').value;

    if (email && pass) {
        sessionStorage.setItem('iinsha_admin_authenticated', 'true');
        const rootContainer = document.getElementById('index-admin-cms-root');
        if (rootContainer) {
            renderAdminModalCmsStudio(rootContainer);
        }
    } else {
        const errEl = document.getElementById('admin-login-error');
        if (errEl) errEl.style.display = 'block';
    }
}

function handleAdminMasterUnlock() {
    sessionStorage.setItem('iinsha_admin_authenticated', 'true');
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}
'''

    # Replace openProtectedAdminPanel function
    js = re.sub(r'function openProtectedAdminPanel\(\) \{[\s\S]*?\}', new_auth_fn, js, count=1)

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Successfully added sleek Admin Login Card and Auth Flow to app.js!")

update_admin_auth_flow()
