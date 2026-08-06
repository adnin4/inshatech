import os

app_js_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    app_code = f.read()

prerender_code = """
document.addEventListener('DOMContentLoaded', () => {
    try {
        const rootContainer = document.getElementById('index-admin-cms-root');
        if (rootContainer) {
            renderAdminModalCmsStudio(rootContainer);
        }
    } catch(e) {}
});
"""

if "index-admin-cms-root" not in app_code[-300:]:
    app_code += "\n\n" + prerender_code
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(app_code)
    print("Pre-rendering attached to DOMContentLoaded!")
