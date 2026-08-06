import os

index_html_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\index.html"

with open(index_html_path, "r", encoding="utf-8") as f:
    html_code = f.read()

# Fallback HTML for static pre-rendering
admin_studio_static_html = """
<div id="index-admin-cms-root">
    <div style="background: rgba(3, 7, 18, 0.98); border: 1px solid var(--accent-gold); border-radius: 16px; padding: 24px; color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        
        <!-- IBOS HEADER BRANDING -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="font-size:2.4rem; background:linear-gradient(135deg, var(--accent-gold), #d97706); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">🛡️</div>
                <div>
                    <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin:0; color:#fff;">IINSHA TECH OS v1000 Enterprise Control Panel</h2>
                    <span style="font-size:0.75rem; color:var(--accent-gold); font-family:var(--font-mono); font-weight:700;">20 Enterprise Domains | Visual Component CMS | Zero Hardcoding Single Source Kernel</span>
                </div>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <span class="badge-gold" style="font-size:0.72rem; padding:4px 10px; background:rgba(245,158,11,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold);">Super Admin Mode</span>
                <button onclick="sessionStorage.removeItem('iinsha_admin_authenticated'); location.reload();" class="btn btn-glass-sm" style="color:#fca5a5; border-color:#ef4444;">🔒 Lock OS</button>
            </div>
        </div>

        <!-- IBOS MODULE NAVIGATION TABS (20 ENTERPRISE DOMAINS) -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08);">
            <button onclick="ibosSwitchTab('exec')" class="btn btn-glass-sm active-ibos-tab" style="background:var(--accent-gold); color:#000; font-weight:800;">📊 AI Briefing</button>
            <button onclick="ibosSwitchTab('market')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800;">🛍️ Marketplace 2.0</button>
            <button onclick="ibosSwitchTab('pricing')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800;">💲 Pricing Engine</button>
            <button onclick="ibosSwitchTab('affiliate')" class="btn btn-glass-sm" style="background:var(--accent-purple); color:#fff; font-weight:800;">🤝 Affiliate BOS 5.0</button>
            <button onclick="ibosSwitchTab('ai')" class="btn btn-glass-sm" style="background:var(--accent-purple); color:#fff; font-weight:800;">🤖 AI Swarms</button>
            <button onclick="ibosSwitchTab('crm')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800;">👥 Client CRM</button>
            <button onclick="ibosSwitchTab('projects')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800;">📂 Projects</button>
            <button onclick="ibosSwitchTab('blog')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800;">📝 Blog CMS</button>
            <button onclick="ibosSwitchTab('media')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800;">🖼️ Media Library</button>
            <button onclick="ibosSwitchTab('analytics')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800;">📈 Analytics 360</button>
            <button onclick="ibosSwitchTab('automation')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800;">⚡ Automations</button>
            <button onclick="ibosSwitchTab('rbac')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800;">🛡️ RBAC Credentials</button>
            <button onclick="ibosSwitchTab('settings')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800;">⚙️ System Settings</button>
        </div>

        <!-- IBOS MODULE TAB CONTENT PANEL -->
        <div id="ibos-module-viewport">
            <div class="ipc-card ipc-card-gold" style="margin-bottom:20px; background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(245,158,11,0.1));">
                <h3 style="color:var(--accent-gold); font-size:1.2rem; margin-bottom:8px;">🤖 Executive AI Autonomous Daily Briefing</h3>
                <div class="admin-stat-grid" style="margin:16px 0;">
                    <div class="admin-stat-card">
                        <span style="font-size:0.7rem; color:var(--text-muted);">YESTERDAY REVENUE</span>
                        <div style="font-size:1.6rem; font-weight:800; color:var(--accent-emerald);">$1,240.00 USD</div>
                        <span style="font-size:0.7rem; color:var(--accent-cyan);">148,800.00 BDT</span>
                    </div>
                    <div class="admin-stat-card">
                        <span style="font-size:0.7rem; color:var(--text-muted);">AFFILIATE SALES</span>
                        <div style="font-size:1.6rem; font-weight:800; color:var(--accent-gold);">31 Sales</div>
                        <span style="font-size:0.7rem; color:var(--accent-gold);">bKash Payouts Ready</span>
                    </div>
                    <div class="admin-stat-card">
                        <span style="font-size:0.7rem; color:var(--text-muted);">PREDICTED MONTH REVENUE</span>
                        <div style="font-size:1.5rem; font-weight:800; color:var(--accent-cyan);">$18,400.00 USD</div>
                        <span style="font-size:0.7rem; color:var(--accent-emerald);">+18.4% Growth Forecast</span>
                    </div>
                </div>

                <h4 style="color:#fff; font-size:0.95rem; margin-bottom:8px;">💡 AI Autonomous Strategy Suggestions:</h4>
                <ul style="padding-left:20px; margin:0; font-size:0.82rem; color:var(--text-muted); line-height:1.6;">
                    <li>Scale Facebook Ad budget by +25% for AI Lead Capture Pipeline.</li>
                    <li>Approve 4 pending Affiliate Payouts via bKash / Nagad ($384.00 total).</li>
                    <li>Publish new Programmatic SEO Case Study on Gemini Vision OCR.</li>
                </ul>
            </div>

            <div class="ipc-card">
                <h4 style="color:#fff; font-size:1rem; margin-bottom:10px;">⚡ Quick Command Shortcuts</h4>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="ibosSwitchTab('market')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-cyan), #0284c7);">➕ Add New Service</button>
                    <button onclick="ibosSwitchTab('blog')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-emerald), #047857);">✍️ Publish Blog Article</button>
                    <button onclick="ibosSwitchTab('affiliate')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-purple), #7c3aed);">🤝 Approve Partner Sale</button>
                    <button onclick="ibosSwitchTab('rbac')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:800;">👥 Admin Credentials CMS</button>
                </div>
            </div>
        </div>

    </div>
</div>
"""

# Replace empty root div with static HTML fallback
html_code = html_code.replace('<div id="index-admin-cms-root"></div>', admin_studio_static_html)

with open(index_html_path, "w", encoding="utf-8") as f:
    f.write(html_code)

print("Embedded static Admin CMS HTML fallback into index.html!")
