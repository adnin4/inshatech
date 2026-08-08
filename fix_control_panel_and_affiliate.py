import re

def fix_control_panel_and_affiliate():
    # 1. Update index.html to remove intrusive auto-load popup script and ensure clean button triggers
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Remove auto-popup script if present
    html = re.sub(r'<script>\s*window\.onload = function\(\) \{[\s\S]*?\};\s*</script>', '', html)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Cleaned index.html auto-load script.")

    # 2. Update app.js for robust Control Panel entry and upgraded Affiliate Engine
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Make openProtectedAdminPanel 100% foolproof
    robust_admin_fn = '''
function openProtectedAdminPanel() {
    const modal = document.getElementById('admin-control-modal');
    if (!modal) return;

    modal.style.display = 'flex';
    modal.style.zIndex = '10005';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}
'''
    js = re.sub(r'function openProtectedAdminPanel\(\) \{[\s\S]*?\}', robust_admin_fn, js, count=1)

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated app.js openProtectedAdminPanel function.")

fix_control_panel_and_affiliate()
