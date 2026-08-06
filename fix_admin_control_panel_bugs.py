import os, re

app_js_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\app.js"
index_html_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\index.html"

# 1. Update app.js
with open(app_js_path, "r", encoding="utf-8") as f:
    app_code = f.read()

# Add renderAdminModalContent definition
render_admin_modal_content_func = """
function renderAdminModalContent() {
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

if "function renderAdminModalContent()" not in app_code:
    app_code += "\n\n" + render_admin_modal_content_func
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(app_code)
    print("Added renderAdminModalContent function to app.js!")

# 2. Fix index.html broken HTML lines
with open(index_html_path, "r", encoding="utf-8") as f:
    index_code = f.read()

# Fix broken lines around line 2661
broken_pattern = re.compile(r'</div>\s*</div>\s*1\';\s*setTimeout.*?(?=<div id="lead-magnet-modal")', re.DOTALL)
if broken_pattern.search(index_code):
    index_code = broken_pattern.sub('</div>\n        </div>\n    </div>\n\n    ', index_code)
    with open(index_html_path, "w", encoding="utf-8") as f:
        f.write(index_code)
    print("Fixed broken HTML in index.html!")
else:
    print("Broken HTML pattern not matched or already fixed.")
