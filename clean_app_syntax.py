import re

def cleanup_duplicate_block():
    with open('app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    duplicate_snippet = '''function openProtectedAdminPanel() {
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

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}'''

    clean_snippet = '''function openProtectedAdminPanel() {
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
}'''

    content = content.replace(duplicate_snippet, clean_snippet)

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cleaned duplicate snippet in app.js!")

cleanup_duplicate_block()
