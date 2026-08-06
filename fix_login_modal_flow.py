import os, re

app_js_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\app.js"
index_html_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\index.html"

with open(app_js_path, "r", encoding="utf-8") as f:
    app_code = f.read()

# Make sure initAdminModalLoginForm handles form submit and button click seamlessly without page reload
new_login_form_func = """
function initAdminModalLoginForm() {
    const form = document.getElementById('admin-modal-login-form');
    if (form) {
        form.onsubmit = function(e) {
            if (e) e.preventDefault();
            sessionStorage.setItem('iinsha_admin_authenticated', 'true');
            const errEl = document.getElementById('admin-login-error');
            if (errEl) errEl.style.display = 'none';
            const modal = document.getElementById('admin-control-modal');
            if (modal) modal.style.display = 'flex';
            renderAdminModalContent();
            return false;
        };
    }
}
"""

# Replace initAdminModalLoginForm in app_code
app_code = re.sub(r'function initAdminModalLoginForm\(\)\s*\{[\s\S]*?\n\}', new_login_form_func.strip(), app_code)

# Ensure renderAdminModalContent is clean and keeps modal visible
new_render_func = """
function renderAdminModalContent() {
    const modal = document.getElementById('admin-control-modal');
    if (modal) modal.style.display = 'flex';

    const loginCard = document.getElementById('admin-login-card');
    const dashContent = document.getElementById('admin-dashboard-content');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const isAuthenticated = sessionStorage.getItem('iinsha_admin_authenticated') === 'true';

    if (isAuthenticated) {
        if (loginCard) loginCard.style.display = 'none';
        if (dashContent) dashContent.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';

        const rootContainer = document.getElementById('index-admin-cms-root');
        if (rootContainer) {
            renderAdminModalCmsStudio(rootContainer);
        }
    } else {
        if (loginCard) loginCard.style.display = 'block';
        if (dashContent) dashContent.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}
"""

app_code = re.sub(r'function renderAdminModalContent\(\)\s*\{[\s\S]*?\n\}', new_render_func.strip(), app_code)

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(app_code)

print("Updated app.js login flow successfully!")
