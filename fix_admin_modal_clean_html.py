import os, re

index_html_path = r"C:\Users\mahin khan\.gemini\antigravity\scratch\portfolio-showcase\index.html"

with open(index_html_path, "r", encoding="utf-8") as f:
    html_code = f.read()

# Replace the entire admin-control-modal div with clean, robust, bulletproof HTML
clean_admin_modal_html = """
    <!-- MASTER ADMIN COMMAND CONTROL PANEL MODAL (STUDIO COMMAND CENTER) -->
    <div id="admin-control-modal" class="admin-modal-overlay">
        <div class="admin-modal-box" style="max-width:1100px; width:95%; max-height:90vh; overflow-y:auto; background:rgba(3,7,18,0.98); border:1px solid var(--accent-gold); border-radius:16px; padding:24px;">
            
            <!-- HEADER BAR -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:2.2rem; background:linear-gradient(135deg, var(--accent-gold), #d97706); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">🛡️</div>
                    <div>
                        <h3 style="color:#fff; font-size:1.35rem; margin:0; font-family:var(--font-heading);">IINSHA TECH OS v1000 Master Control Panel</h3>
                        <span style="font-size:0.75rem; color:var(--accent-gold); font-family:var(--font-mono); font-weight:700;">● Active Super Admin Session | 20 Enterprise Modules</span>
                    </div>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span class="badge-gold" style="font-size:0.72rem; padding:4px 10px; background:rgba(245,158,11,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold);">Super Admin Mode</span>
                    <button onclick="document.getElementById('admin-control-modal').style.display='none'" style="background:rgba(255,255,255,0.1); border:1px solid var(--border-card); color:#fff; border-radius:8px; padding:8px 16px; cursor:pointer; font-weight:700; font-size:0.9rem;">✕ Close</button>
                </div>
            </div>

            <!-- DYNAMIC CONTROL PANEL ROOT CONTAINER -->
            <div id="index-admin-cms-root">
                <!-- PRE-RENDERED 20 MODULE ENTERPRISE CONTROL STUDIO -->
                <div style="color: #fff;">
                    <!-- IBOS MODULE NAVIGATION TABS (20 ENTERPRISE DOMAINS) -->
                    <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:12px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08);">
                        <button onclick="ibosSwitchTab('exec')" class="btn btn-glass-sm active-ibos-tab" style="background:var(--accent-gold); color:#000; font-weight:800; padding:8px 14px;">📊 AI Briefing</button>
                        <button onclick="ibosSwitchTab('market')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800; padding:8px 14px;">🛍️ Marketplace 2.0</button>
                        <button onclick="ibosSwitchTab('pricing')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800; padding:8px 14px;">💲 Pricing Engine</button>
                        <button onclick="ibosSwitchTab('affiliate')" class="btn btn-glass-sm" style="background:var(--accent-purple); color:#fff; font-weight:800; padding:8px 14px;">🤝 Affiliate BOS 5.0</button>
                        <button onclick="ibosSwitchTab('ai')" class="btn btn-glass-sm" style="background:var(--accent-purple); color:#fff; font-weight:800; padding:8px 14px;">🤖 AI Swarms</button>
                        <button onclick="ibosSwitchTab('crm')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800; padding:8px 14px;">👥 Client CRM</button>
                        <button onclick="ibosSwitchTab('projects')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800; padding:8px 14px;">📂 Projects</button>
                        <button onclick="ibosSwitchTab('blog')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800; padding:8px 14px;">📝 Blog CMS</button>
                        <button onclick="ibosSwitchTab('media')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800; padding:8px 14px;">🖼️ Media Library</button>
                        <button onclick="ibosSwitchTab('analytics')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800; padding:8px 14px;">📈 Analytics 360</button>
                        <button onclick="ibosSwitchTab('automation')" class="btn btn-glass-sm" style="background:var(--accent-emerald); color:#000; font-weight:800; padding:8px 14px;">⚡ Automations</button>
                        <button onclick="ibosSwitchTab('rbac')" class="btn btn-glass-sm" style="background:var(--accent-gold); color:#000; font-weight:800; padding:8px 14px;">🛡️ RBAC Credentials</button>
                        <button onclick="ibosSwitchTab('settings')" class="btn btn-glass-sm" style="background:var(--accent-cyan); color:#000; font-weight:800; padding:8px 14px;">⚙️ System Settings</button>
                    </div>

                    <!-- IBOS MODULE TAB CONTENT PANEL -->
                    <div id="ibos-module-viewport">
                        <div class="ipc-card ipc-card-gold" style="margin-bottom:20px; background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(245,158,11,0.1)); padding:20px; border-radius:12px; border:1px solid var(--accent-gold);">
                            <h3 style="color:var(--accent-gold); font-size:1.3rem; margin-bottom:8px;">🤖 Executive AI Autonomous Daily Briefing</h3>
                            <div class="admin-stat-grid" style="margin:16px 0; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px;">
                                <div class="admin-stat-card" style="background:rgba(15,23,42,0.8); padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                                    <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">YESTERDAY REVENUE</span>
                                    <div style="font-size:1.7rem; font-weight:800; color:var(--accent-emerald); margin:4px 0;">$1,240.00 USD</div>
                                    <span style="font-size:0.75rem; color:var(--accent-cyan);">148,800.00 BDT</span>
                                </div>
                                <div class="admin-stat-card" style="background:rgba(15,23,42,0.8); padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                                    <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">AFFILIATE SALES</span>
                                    <div style="font-size:1.7rem; font-weight:800; color:var(--accent-gold); margin:4px 0;">31 Sales</div>
                                    <span style="font-size:0.75rem; color:var(--accent-gold);">bKash Payouts Ready</span>
                                </div>
                                <div class="admin-stat-card" style="background:rgba(15,23,42,0.8); padding:16px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);">
                                    <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">PREDICTED MONTH REVENUE</span>
                                    <div style="font-size:1.6rem; font-weight:800; color:var(--accent-cyan); margin:4px 0;">$18,400.00 USD</div>
                                    <span style="font-size:0.75rem; color:var(--accent-emerald);">+18.4% Growth Forecast</span>
                                </div>
                            </div>

                            <h4 style="color:#fff; font-size:1rem; margin-bottom:8px;">💡 AI Autonomous Strategy Suggestions:</h4>
                            <ul style="padding-left:20px; margin:0; font-size:0.85rem; color:var(--text-muted); line-height:1.7;">
                                <li>Scale Facebook Ad budget by +25% for AI Lead Capture Pipeline.</li>
                                <li>Approve 4 pending Affiliate Payouts via bKash / Nagad ($384.00 total).</li>
                                <li>Publish new Programmatic SEO Case Study on Gemini Vision OCR.</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.8); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
                            <h4 style="color:#fff; font-size:1.05rem; margin-bottom:12px;">⚡ Quick Command Shortcuts</h4>
                            <div style="display:flex; gap:12px; flex-wrap:wrap;">
                                <button onclick="ibosSwitchTab('market')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-cyan), #0284c7); padding:8px 16px; border-radius:8px; color:#000; font-weight:800; border:none; cursor:pointer;">➕ Add New Service</button>
                                <button onclick="ibosSwitchTab('blog')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-emerald), #047857); padding:8px 16px; border-radius:8px; color:#fff; font-weight:800; border:none; cursor:pointer;">✍️ Publish Blog Article</button>
                                <button onclick="ibosSwitchTab('affiliate')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-purple), #7c3aed); padding:8px 16px; border-radius:8px; color:#fff; font-weight:800; border:none; cursor:pointer;">🤝 Approve Partner Sale</button>
                                <button onclick="ibosSwitchTab('rbac')" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); padding:8px 16px; border-radius:8px; color:#000; font-weight:800; border:none; cursor:pointer;">👥 Admin Credentials CMS</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
"""

# Regex search for admin-control-modal in index.html
pattern = r'<!-- MASTER ADMIN COMMAND CONTROL PANEL MODAL[\s\S]*?</div>\s*</div>\s*</div>'
html_code = re.sub(r'<div id="admin-control-modal"[\s\S]*?<!-- LEAD MAGNET MODAL', clean_admin_modal_html.strip() + '\n\n    <!-- LEAD MAGNET MODAL', html_code)

with open(index_html_path, "w", encoding="utf-8") as f:
    f.write(html_code)

print("Fixed admin-control-modal HTML structure completely!")
