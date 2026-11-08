import re

def update_index_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Add Language Switcher to Nav Bar if not exists
    if 'id="site-lang-toggle-btn"' not in html:
        lang_btn = '<button id="site-lang-toggle-btn" onclick="toggleSiteLanguage()" class="btn btn-glass-sm" style="color:var(--accent-gold); border-color:var(--accent-gold); font-weight:700; margin-right:8px;">🇧🇩 বাংলা</button>'
        html = html.replace(
            '<button onclick="openProtectedAdminPanel()" class="btn btn-glass-sm"',
            lang_btn + '<button onclick="openProtectedAdminPanel()" class="btn btn-glass-sm"'
        )

    # 2. Add "Build Your Custom AI System" Button to Hero Action Buttons
    if 'openBuildAISystemModal()' not in html:
        hero_btn = '<button onclick="openBuildAISystemModal()" class="btn btn-primary" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:800; border:none; padding:12px 22px; margin-left:8px;">🏆 Build Your Custom AI System</button>'
        html = html.replace(
            '<button onclick="openProtectedAdminPanel()" class="btn btn-glass"',
            hero_btn + '\n' + '<button onclick="openProtectedAdminPanel()" class="btn btn-glass"'
        )

    # 3. Add Enterprise Proof Badges to ROI Calculator Header
    if 'LIVE BENCHMARK' not in html:
        html = html.replace(
            '<span class="section-tag" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald);">Interactive Calculator</span>',
            '<span class="section-tag" style="background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald);">Interactive Calculator</span> <span class="badge-gold" style="font-size:0.75rem; padding:4px 10px; background:rgba(6,182,212,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); border-radius:6px; margin-left:8px;">VERIFIED CASE STUDY BENCHMARK</span>'
        )

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("Updated index.html successfully!")

update_index_html()
