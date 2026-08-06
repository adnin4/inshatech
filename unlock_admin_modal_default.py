import os, re

index_html_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\index.html"
app_js_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\app.js"

# 1. Update index.html to make admin-dashboard-content visible by default and remove login hurdle
with open(index_html_path, "r", encoding="utf-8") as f:
    html_code = f.read()

# Make admin-dashboard-content visible by default
html_code = html_code.replace('<div id="admin-dashboard-content" style="display: none;">', '<div id="admin-dashboard-content" style="display: block;">')
# Hide admin-login-card by default
html_code = html_code.replace('<div id="admin-login-card"', '<div id="admin-login-card" style="display: none;"')

with open(index_html_path, "w", encoding="utf-8") as f:
    f.write(html_code)

# 2. Update app.js so openProtectedAdminPanel and renderAdminModalContent always render the 20 Master Modules
with open(app_js_path, "r", encoding="utf-8") as f:
    app_code = f.read()

new_open_func = """
function openProtectedAdminPanel() {
    const modal = document.getElementById('admin-control-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}
"""

new_render_func = """
function renderAdminModalContent() {
    const modal = document.getElementById('admin-control-modal');
    if (modal) modal.style.display = 'flex';
    const loginCard = document.getElementById('admin-login-card');
    if (loginCard) loginCard.style.display = 'none';
    const dashContent = document.getElementById('admin-dashboard-content');
    if (dashContent) dashContent.style.display = 'block';

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}
"""

app_code = re.sub(r'function openProtectedAdminPanel\(\)\s*\{[\s\S]*?\n\}', new_open_func.strip(), app_code)
app_code = re.sub(r'function renderAdminModalContent\(\)\s*\{[\s\S]*?\n\}', new_render_func.strip(), app_code)

with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(app_code)

print("Unlocked Admin Modal by Default!")
