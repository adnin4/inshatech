import re

def fix_orphan_brace():
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    js = js.replace('''function handleAdminMasterUnlock() {
    sessionStorage.setItem('iinsha_admin_authenticated', 'true');
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}

}''', '''function handleAdminMasterUnlock() {
    sessionStorage.setItem('iinsha_admin_authenticated', 'true');
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}''')

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed orphan brace in app.js!")

fix_orphan_brace()
