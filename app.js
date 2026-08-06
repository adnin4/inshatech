
function getSiteWords() {
    const defaults = {
        heroTitle: 'Enterprise AI Automation Lab & n8n Pipeline Studio',
        heroSub: 'Production-grade AI agents, OpenClaw stealth web scrapers, and Hostinger Docker VPS infrastructure.',
        whatsapp: '+8801629286887',
        bdtRate: 120
    };
    const raw = localStorage.getItem('iinsha_site_words_cms');
    if (!raw) return defaults;
    try { return { ...defaults, ...JSON.parse(raw) }; } catch(e) { return defaults; }
}

function saveSiteWords(words) {
    localStorage.setItem('iinsha_site_words_cms', JSON.stringify(words));
}


/* Core Utility Helpers & Security Sanitization */
function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function clampNumber(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(width < 768 ? 35 : 70, 100);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}

function validateRoiInput(val, minVal, maxVal, defaultVal) {
    let num = parseFloat(val);
    if (isNaN(num)) return defaultVal;
    return Math.min(Math.max(num, minVal), maxVal);
}

function initRoiCalculator() {
    const setupInput = document.getElementById('roi-setup-cost');
    const infraInput = document.getElementById('roi-infra-cost');
    const paybackEl = document.getElementById('roi-payback-val');
    const percentEl = document.getElementById('roi-percent-val');
    const savingsEl = document.getElementById('roi-net-savings');
    const btnCalc = document.getElementById('calculate-roi-btn') || document.getElementById('calculate-roi');

    if (!setupInput || !infraInput) return;

    const compute = debounce(() => {
        const setupCost = validateRoiInput(setupInput.value, 100, 100000, 3000);
        const monthlyInfra = validateRoiInput(infraInput.value, 10, 5000, 120);

        const currentOpsCost = (setupCost * 2.5) + (monthlyInfra * 24);
        const automatedCost = setupCost + (monthlyInfra * 12);
        const netYear1Savings = Math.max(0, currentOpsCost - automatedCost);
        const paybackDays = Math.max(7, Math.round((setupCost / (netYear1Savings / 365 || 1))));
        const roiPercent = Math.round((netYear1Savings / setupCost) * 100);

        if (paybackEl) paybackEl.textContent = paybackDays + ' Days';
        if (percentEl) percentEl.textContent = roiPercent + '%';
        if (savingsEl) savingsEl.textContent = '$' + netYear1Savings.toLocaleString();
    }, 100);

    setupInput.addEventListener('input', compute);
    infraInput.addEventListener('input', compute);
    if (btnCalc) btnCalc.addEventListener('click', compute);
    compute();
}


function initCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (!checkoutModal) return;
    document.querySelectorAll('.open-checkout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute('data-service') || 'Custom AI Solution';
            const price = btn.getAttribute('data-price') || '349';
            const nameEl = document.getElementById('checkout-service-title');
            const priceEl = document.getElementById('checkout-price-val');
            if (nameEl) nameEl.textContent = serviceName;
            if (priceEl) priceEl.textContent = '$' + price;
            checkoutModal.classList.remove('hidden');
        });
    });
    document.getElementById('close-checkout-modal')?.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });
}

function initChatbotWidget() {
    const floatChat = document.getElementById('floating-chat-widget');
    const chatInput = document.getElementById('floating-chat-input');
    const chatSendBtn = document.getElementById('floating-chat-send-btn');
    const chatBox = document.getElementById('floating-chat-messages');

    if (!chatInput || !chatSendBtn || !chatBox) return;

    chatSendBtn.addEventListener('click', () => {
        const query = chatInput.value.trim();
        if (!query) return;

        const userMsg = document.createElement('div');
        userMsg.style.cssText = 'background:rgba(99,102,241,0.2); color:#fff; padding:8px 12px; border-radius:10px; align-self:flex-end; font-size:0.85rem; margin-bottom:8px; border:1px solid rgba(99,102,241,0.4);';
        userMsg.textContent = query;
        chatBox.appendChild(userMsg);
        chatInput.value = '';

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.style.cssText = 'background:rgba(30,41,59,0.8); color:var(--text-main); padding:8px 12px; border-radius:10px; align-self:flex-start; font-size:0.85rem; margin-bottom:8px; border:1px solid var(--border-card);';
            botMsg.textContent = '✨ Thank you! Our AI Assistant has processed your query: "' + query + '". For instant consultation, connect via WhatsApp (+8801629286887).';
            chatBox.appendChild(botMsg);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500);
    });
}




/* ============================================================
   IINSHAA OS (INTELLIGENT BUSINESS OPERATING SYSTEM v50)
   15 Business Domains | 20 Enterprise Levels | 10 Control Systems
   ============================================================ */

function createUniversalObject(domain, type, data) {
    const now = new Date().toISOString();
    return {
        uuid: domain.toLowerCase() + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        slug: (data.title || data.name || type).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        domain,
        type,
        owner: data.owner || 'adnansadatmahin4@gmail.com',
        status: data.status || 'published',
        visibility: data.visibility || 'public',
        version: 1.0,
        created: now,
        updated: now,
        deleted: false,
        history: [{ timestamp: now, action: 'CREATED', author: data.owner || 'System' }],
        permissions: { read: ['all'], write: ['admin'], delete: ['super_admin'] },
        tags: data.tags || ['enterprise', 'ai-os'],
        aiMetadata: { indexed: true, vectorScore: 0.98, embeddingModel: 'text-embedding-3-large' },
        analyticsMetadata: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
        ...data
    };
}

const IINSHAAOS_SDK = {
    version: '50.0.0-ENTERPRISE',
    domains: ['Identity', 'Service', 'Marketplace', 'Affiliate', 'CRM', 'AI', 'Finance', 'Knowledge', 'Automation', 'Media', 'Notification', 'Analytics', 'Developer', 'Security', 'Platform'],
    
    emitEvent(eventName, payload) {
        console.log(`[IINSHAA OS EVENT BUS v50] Event: ${eventName}`, payload);
        try {
            const raw = localStorage.getItem('iinsha_v50_event_trail') || '[]';
            const events = JSON.parse(raw);
            events.unshift({
                uuid: 'evt_' + Date.now(),
                eventName,
                payload,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('iinsha_v50_event_trail', JSON.stringify(events.slice(0, 500)));
        } catch(e) {}
    },

    getFeatureFlags() {
        const defaults = {
            aiChat: true,
            affiliateNetwork: true,
            marketplace: true,
            assetStore: true,
            clientPortal: true,
            fomoToasts: true,
            stealthScraper: true,
            autoAudit: true,
            aiExecutiveBriefing: true,
            rulesEngine: true,
            vectorGraphRAG: true
        };
        const raw = localStorage.getItem('iinsha_v50_feature_flags');
        if (!raw) return defaults;
        try { return { ...defaults, ...JSON.parse(raw) }; } catch(e) { return defaults; }
    },

    saveFeatureFlags(flags) {
        localStorage.setItem('iinsha_v50_feature_flags', JSON.stringify(flags));
    },

    evaluateRules(orderAmount, clientCountry) {
        if (orderAmount >= 1000) {
            return { assignRole: 'Senior Sales Manager', discount: 10, prioritySLA: 'Immediate 1-Hour' };
        }
        if (clientCountry === 'USA' || clientCountry === 'EUR') {
            return { currency: 'USD', taxRate: 0 };
        }
        return { currency: 'BDT', bdtRate: 120 };
    }
};

function getAIExecutiveBriefing() {
    const siteWords = getSiteWords();
    return {
        greeting: "Good Morning Mahin! Here is your IINSHAA OS v50 Executive Intelligence Briefing:",
        revenueYesterday: "$2,540.00",
        revenueYesterdayBDT: "৳" + (2540 * siteWords.bdtRate).toLocaleString() + " BDT",
        affiliateSales: 31,
        lostLeads: 12,
        bestProduct: "OpenClaw Stealth Price Monitor ($599)",
        worstFunnel: "Checkout Drop-off on Mobile (2.4%)",
        suggestions: [
            "Scale Facebook Ad budget by +25% for AI Lead Capture Pipeline.",
            "Approve 4 pending Affiliate Payouts via bKash / Nagad ($384.00 total).",
            "Publish new Programmatic SEO Case Study on Gemini Vision OCR."
        ],
        predictedRevenueMonth: "$18,400.00 USD"
    };
}

function getIBOSData() {
    return {
        words: getSiteWords(),
        services: getServiceRegistry(),
        blog: getBlogPosts(),
        admins: getAdminUsers(),
        audits: getPriceChangeLogs(),
        flags: IINSHAAOS_SDK.getFeatureFlags(),
        briefing: getAIExecutiveBriefing(),
        clients: JSON.parse(localStorage.getItem('iinsha_ibos_clients') || '[]'),
        projects: JSON.parse(localStorage.getItem('iinsha_ibos_projects') || '[]'),
        affiliates: JSON.parse(localStorage.getItem('iinsha_ibos_affiliates') || '[]'),
        media: JSON.parse(localStorage.getItem('iinsha_ibos_media') || '[]'),
        aiSwarms: [
            { id: 'ai_sales', name: 'Sales AI Swarm', domain: 'Sales', model: 'Gemini 3.5 Ultra', status: 'ACTIVE' },
            { id: 'ai_support', name: 'Support AI Swarm', domain: 'Support', model: 'Claude 3.7 Sonnet', status: 'ACTIVE' },
            { id: 'ai_affiliate', name: 'Affiliate AI Assistant', domain: 'Marketing', model: 'GPT-5 Turbo', status: 'ACTIVE' },
            { id: 'ai_proposal', name: 'Proposal AI Agent', domain: 'Sales', model: 'DeepSeek-R1', status: 'ACTIVE' },
            { id: 'ai_executive', name: 'Executive AI Briefing Agent', domain: 'Executive', model: 'Gemini 3.5 Pro', status: 'ACTIVE' }
        ]
    };
}

let ibosActiveTab = 'exec';

function renderAdminModalCmsStudio(container) {
    if (!container) return;

    const data = getIBOSData();
    const siteWords = data.words;
    const services = data.services;
    const adminUsers = data.admins;
    const flags = data.flags;
    const briefing = data.briefing;
    const clients = data.clients.length ? data.clients : [
        { id: 'c1', name: 'Tanvir Ahmed', company: 'SMMA Growth Agency', email: 'tanvir@smma.com', phone: '+8801700000000', totalSpent: 948, status: 'Active VIP' },
        { id: 'c2', name: 'Rifat Hossain', company: 'Apex E-commerce Ltd', email: 'rifat@apex.com', phone: '+8801800000000', totalSpent: 1249, status: 'Active' }
    ];
    const projects = data.projects.length ? data.projects : [
        { id: 'p1', title: 'OpenClaw Stealth Price Monitor', client: 'Apex E-commerce Ltd', phase: 'Deployment', progress: 85, price: 599, status: 'On Track' },
        { id: 'p2', title: 'Gemini Customer Support RAG Bot', client: 'SMMA Growth Agency', phase: 'Development', progress: 60, price: 450, status: 'In Progress' }
    ];

    container.innerHTML = `
        <div style="background: rgba(3, 7, 18, 0.98); border: 1px solid var(--accent-gold); border-radius: 16px; padding: 24px; color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
            
            <!-- IBOS HEADER BRANDING -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:2.4rem; background:linear-gradient(135deg, var(--accent-gold), #d97706); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">🛡️</div>
                    <div>
                        <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin:0; color:#fff;">IINSHAA OS v50 Enterprise Operating System</h2>
                        <span style="font-size:0.75rem; color:var(--accent-gold); font-family:var(--font-mono); font-weight:700;">15 Domains | 20 Levels | 10 Control Systems | Single Source Kernel</span>
                    </div>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span class="badge-gold" style="font-size:0.72rem; padding:4px 10px; background:rgba(245,158,11,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold);">Super Admin Mode</span>
                    <button onclick="sessionStorage.removeItem('iinsha_admin_authenticated'); renderAdminModalContent();" class="btn btn-glass-sm" style="color:#fca5a5; border-color:#ef4444;">🔒 Lock OS</button>
                </div>
            </div>

            <!-- IBOS MODULE NAVIGATION TABS (15 ENTERPRISE DOMAINS) -->
            <div style="display:flex; gap:6px; overflow-x:auto; padding-bottom:10px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08);">
                <button onclick="ibosSwitchTab('exec')" class="btn btn-glass-sm ${ibosActiveTab === 'exec' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'exec' ? 'background:var(--accent-gold); color:#000; font-weight:800;' : ''}">📊 AI Briefing</button>
                <button onclick="ibosSwitchTab('market')" class="btn btn-glass-sm ${ibosActiveTab === 'market' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'market' ? 'background:var(--accent-cyan); color:#000; font-weight:800;' : ''}">🛍️ Marketplace 2.0</button>
                <button onclick="ibosSwitchTab('pricing')" class="btn btn-glass-sm ${ibosActiveTab === 'pricing' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'pricing' ? 'background:var(--accent-emerald); color:#000; font-weight:800;' : ''}">💲 Pricing Engine</button>
                <button onclick="ibosSwitchTab('affiliate')" class="btn btn-glass-sm ${ibosActiveTab === 'affiliate' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'affiliate' ? 'background:var(--accent-purple); color:#fff; font-weight:800;' : ''}">🤝 Affiliate BOS 5.0</button>
                <button onclick="ibosSwitchTab('ai')" class="btn btn-glass-sm ${ibosActiveTab === 'ai' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'ai' ? 'background:var(--accent-purple); color:#fff; font-weight:800;' : ''}">🤖 AI Swarms</button>
                <button onclick="ibosSwitchTab('crm')" class="btn btn-glass-sm ${ibosActiveTab === 'crm' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'crm' ? 'background:var(--accent-gold); color:#000; font-weight:800;' : ''}">👥 Client CRM</button>
                <button onclick="ibosSwitchTab('projects')" class="btn btn-glass-sm ${ibosActiveTab === 'projects' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'projects' ? 'background:var(--accent-emerald); color:#000; font-weight:800;' : ''}">📂 Projects</button>
                <button onclick="ibosSwitchTab('blog')" class="btn btn-glass-sm ${ibosActiveTab === 'blog' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'blog' ? 'background:var(--accent-cyan); color:#000; font-weight:800;' : ''}">📝 Blog CMS</button>
                <button onclick="ibosSwitchTab('media')" class="btn btn-glass-sm ${ibosActiveTab === 'media' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'media' ? 'background:var(--accent-cyan); color:#000; font-weight:800;' : ''}">🖼️ Media Library</button>
                <button onclick="ibosSwitchTab('analytics')" class="btn btn-glass-sm ${ibosActiveTab === 'analytics' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'analytics' ? 'background:var(--accent-gold); color:#000; font-weight:800;' : ''}">📈 Analytics 360</button>
                <button onclick="ibosSwitchTab('automation')" class="btn btn-glass-sm ${ibosActiveTab === 'automation' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'automation' ? 'background:var(--accent-emerald); color:#000; font-weight:800;' : ''}">⚡ Automations</button>
                <button onclick="ibosSwitchTab('flags')" class="btn btn-glass-sm ${ibosActiveTab === 'flags' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'flags' ? 'background:var(--accent-purple); color:#fff; font-weight:800;' : ''}">🚩 Feature Flags</button>
                <button onclick="ibosSwitchTab('audit')" class="btn btn-glass-sm ${ibosActiveTab === 'audit' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'audit' ? 'background:var(--accent-gold); color:#000; font-weight:800;' : ''}">📜 Audit Sourcing</button>
                <button onclick="ibosSwitchTab('rbac')" class="btn btn-glass-sm ${ibosActiveTab === 'rbac' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'rbac' ? 'background:var(--accent-gold); color:#000; font-weight:800;' : ''}">🛡️ RBAC Credentials</button>
                <button onclick="ibosSwitchTab('settings')" class="btn btn-glass-sm ${ibosActiveTab === 'settings' ? 'active-ibos-tab' : ''}" style="${ibosActiveTab === 'settings' ? 'background:var(--accent-cyan); color:#000; font-weight:800;' : ''}">⚙️ System Settings</button>
            </div>

            <!-- IBOS MODULE TAB CONTENT PANEL -->
            <div id="ibos-module-viewport">
                ${renderIBOSViewportContent(ibosActiveTab, data, clients, projects, briefing)}
            </div>

        </div>
    `;

    bindIBOSModuleListeners();
}

function ibosSwitchTab(tabName) {
    ibosActiveTab = tabName;
    const cmsRoot = document.getElementById('index-admin-cms-root');
    if (cmsRoot) renderAdminModalCmsStudio(cmsRoot);
}

function renderIBOSViewportContent(tab, data, clients, projects, briefing) {
    const siteWords = data.words;
    const services = data.services;
    const adminUsers = data.admins;
    const flags = data.flags;
    const aiSwarms = data.aiSwarms;

    if (tab === 'exec') {
        return `
            <!-- LEVEL 8: AI EXECUTIVE DAILY BRIEFING -->
            <div>
                <div class="ipc-card ipc-card-gold" style="margin-bottom:20px; background:linear-gradient(135deg, rgba(15,23,42,0.95), rgba(245,158,11,0.1));">
                    <h3 style="color:var(--accent-gold); font-size:1.2rem; margin-bottom:8px;">🤖 ${sanitize(briefing.greeting)}</h3>
                    <div class="admin-stat-grid" style="margin:16px 0;">
                        <div class="admin-stat-card">
                            <span style="font-size:0.7rem; color:var(--text-muted);">YESTERDAY REVENUE</span>
                            <div style="font-size:1.6rem; font-weight:800; color:var(--accent-emerald);">${briefing.revenueYesterday}</div>
                            <span style="font-size:0.7rem; color:var(--accent-cyan);">${briefing.revenueYesterdayBDT}</span>
                        </div>
                        <div class="admin-stat-card">
                            <span style="font-size:0.7rem; color:var(--text-muted);">AFFILIATE SALES</span>
                            <div style="font-size:1.6rem; font-weight:800; color:var(--accent-gold);">${briefing.affiliateSales} Sales</div>
                            <span style="font-size:0.7rem; color:var(--accent-gold);">bKash Payouts Ready</span>
                        </div>
                        <div class="admin-stat-card">
                            <span style="font-size:0.7rem; color:var(--text-muted);">PREDICTED MONTH REVENUE</span>
                            <div style="font-size:1.5rem; font-weight:800; color:var(--accent-cyan);">${briefing.predictedRevenueMonth}</div>
                            <span style="font-size:0.7rem; color:var(--accent-emerald);">+18.4% Growth Forecast</span>
                        </div>
                    </div>

                    <h4 style="color:#fff; font-size:0.95rem; margin-bottom:8px;">💡 AI Autonomous Strategy Suggestions:</h4>
                    <ul style="padding-left:20px; margin:0; font-size:0.82rem; color:var(--text-muted); line-height:1.6;">
                        ${briefing.suggestions.map(s => `<li>${sanitize(s)}</li>`).join('')}
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
        `;
    }

    if (tab === 'market') {
        return `
            <!-- MARKETPLACE DOMAIN & FULL GRANULAR CRUD -->
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="color:var(--accent-cyan); font-size:1.15rem; margin:0;">🛍️ Marketplace Domain CMS (${services.length} Services Active)</h3>
                        <p style="font-size:0.78rem; color:var(--text-muted); margin:2px 0 0;">Single Source of Truth Service Registry Catalog.</p>
                    </div>
                    <button id="ibos-btn-add-service" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-cyan), #0284c7); color:#000; font-weight:800;">➕ Add New Service</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${services.map((svc, sIdx) => `
                        <div style="background:rgba(15,23,42,0.8); padding:14px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div>
                                <strong style="color:#fff; font-size:1rem;">${sanitize(svc.title)}</strong>
                                <span class="badge-secure" style="margin-left:8px; font-size:0.7rem;">${sanitize(svc.category)}</span>
                                <span class="badge-pro" style="margin-left:4px; font-size:0.68rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border-color:var(--accent-emerald);">PUBLISHED & TESTED</span>
                                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">
                                    Price: <strong style="color:var(--accent-emerald); font-family:var(--font-mono);">$${svc.price}</strong> | Commission: <strong style="color:var(--accent-gold); font-family:var(--font-mono);">${svc.commission_rate}%</strong>
                                </div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button class="btn btn-glass-sm ibos-btn-edit-svc" data-svc-idx="${sIdx}" style="font-size:0.75rem; color:var(--accent-cyan); border-color:var(--accent-cyan);">✏️ Edit Service</button>
                                <button class="btn btn-glass-sm ibos-btn-delete-svc" data-svc-idx="${sIdx}" style="font-size:0.75rem; color:#fca5a5; border-color:#ef4444;">🗑️ Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (tab === 'pricing') {
        return `
            <!-- PRICING DOMAIN -->
            <div>
                <h3 style="color:var(--accent-emerald); font-size:1.15rem; margin-bottom:6px;">💲 Dynamic Pricing Engine & BDT Currency Converter</h3>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">Edits here dynamically update Marketplace, Asset Store, Checkout Modal, Partner Portal, and AI Sales Agent.</p>

                <div class="ipc-card ipc-card-gold">
                    <h4 style="color:#fff; font-size:0.95rem; margin-bottom:10px;">Global Currency Exchange Rate Config</h4>
                    <div style="display:flex; gap:14px; align-items:center; flex-wrap:wrap;">
                        <div>
                            <label style="font-size:0.75rem; color:var(--text-muted); display:block;">USD to BDT Rate:</label>
                            <input type="number" id="ibos-bdt-rate-input" class="dash-select" value="${siteWords.bdtRate}" style="width:140px;">
                        </div>
                        <button id="ibos-btn-update-rate" class="btn btn-primary-sm" style="background:var(--accent-gold); color:#000; font-weight:800;">💾 Save Currency Rate</button>
                    </div>
                </div>
            </div>
        `;
    }

    if (tab === 'affiliate') {
        return `
            <!-- AFFILIATE DOMAIN 5.0 -->
            <div>
                <h3 style="color:var(--accent-purple); font-size:1.15rem; margin-bottom:6px;">🤝 Enterprise Affiliate Network 5.0 (Impact / PartnerStack Rules)</h3>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">100% Service Auto-Sync, Unique Referral Links & Ownership Attribution.</p>

                <div class="ipc-card">
                    <h4 style="color:#fff; font-size:0.95rem; margin-bottom:10px;">Partner Tier Rules & Commission Engine</h4>
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px;">
                        <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                            <strong style="color:var(--accent-cyan);">Starter Tier</strong>
                            <div style="font-size:1.2rem; font-weight:800; color:#fff;">15% Commission</div>
                        </div>
                        <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                            <strong style="color:var(--accent-gold);">VIP Tier</strong>
                            <div style="font-size:1.2rem; font-weight:800; color:#fff;">20% Commission</div>
                        </div>
                        <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                            <strong style="color:var(--accent-purple);">Elite Tier</strong>
                            <div style="font-size:1.2rem; font-weight:800; color:#fff;">25% Commission</div>
                        </div>
                        <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                            <strong style="color:var(--accent-emerald);">Legend Tier</strong>
                            <div style="font-size:1.2rem; font-weight:800; color:#fff;">30% Commission</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    if (tab === 'ai') {
        return `
            <!-- AI SWARM DOMAIN -->
            <div>
                <h3 style="color:var(--accent-purple); font-size:1.15rem; margin-bottom:6px;">🤖 Multi-Agent AI Swarm Orchestra (14 AI Agents)</h3>
                <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:16px;">Configure specialized AI Agents & Pinecone Vector RAG Knowledge Base.</p>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${aiSwarms.map(agent => `
                        <div style="background:rgba(15,23,42,0.8); padding:14px; border-radius:10px; border:1px solid rgba(99,102,241,0.3); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div>
                                <strong style="color:#fff; font-size:1rem;">${sanitize(agent.name)}</strong>
                                <span class="badge-pro" style="margin-left:8px; font-size:0.7rem;">${sanitize(agent.model)}</span>
                                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">Domain: ${sanitize(agent.domain)}</div>
                            </div>
                            <button class="btn btn-glass-sm" onclick="alert('Configuring ${sanitize(agent.name)}')" style="font-size:0.75rem; color:var(--accent-purple); border-color:var(--accent-purple);">⚙️ Config Prompt & RAG</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (tab === 'rbac') {
        return `
            <!-- IDENTITY DOMAIN & RBAC CMS -->
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                    <div>
                        <h3 style="color:var(--accent-gold); font-size:1.15rem; margin:0;">🛡️ Identity Domain & RBAC Credential CMS</h3>
                        <p style="font-size:0.78rem; color:var(--text-muted); margin:2px 0 0;">Manage Admin User ID & Passwords anytime.</p>
                    </div>
                    <button id="ibos-btn-add-admin" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:800;">➕ Add Admin User</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${adminUsers.map((adm, aIdx) => `
                        <div style="background:rgba(15,23,42,0.8); padding:14px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div>
                                <strong style="color:#fff; font-size:1rem;">${sanitize(adm.name || adm.email)}</strong>
                                <span class="badge-gold" style="margin-left:8px; font-size:0.7rem; padding:2px 8px; border-radius:4px; background:rgba(245,158,11,0.2); color:var(--accent-gold);">${sanitize(adm.role || 'Super Admin')}</span>
                                <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">
                                    User ID: <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${sanitize(adm.email)}</strong> | Password: <strong style="color:var(--accent-gold); font-family:var(--font-mono);">${sanitize(adm.password)}</strong>
                                </div>
                            </div>
                            <button class="btn btn-glass-sm ibos-btn-edit-admin" data-admin-idx="${aIdx}" style="font-size:0.75rem; color:var(--accent-gold); border-color:var(--accent-gold);">✏️ Change Credentials</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Default Fallback View
    return `
        <!-- PLATFORM DOMAIN & SETTINGS -->
        <div>
            <h3 style="color:var(--accent-cyan); font-size:1.15rem; margin-bottom:12px;">⚙️ Platform Domain Settings & Branding</h3>
            <div class="ipc-card">
                <h4 style="color:#fff; font-size:0.95rem; margin-bottom:10px;">Global Headline Words</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="font-size:0.75rem; color:var(--text-muted); display:block;">Hero Title:</label>
                        <input type="text" id="ibos-hero-title" class="dash-select" style="width:100%;" value="${sanitize(siteWords.heroTitle)}">
                    </div>
                    <div>
                        <label style="font-size:0.75rem; color:var(--text-muted); display:block;">Hero Subtitle:</label>
                        <input type="text" id="ibos-hero-sub" class="dash-select" style="width:100%;" value="${sanitize(siteWords.heroSub)}">
                    </div>
                    <button id="ibos-btn-save-words" class="btn btn-primary-sm" style="background:var(--accent-cyan); color:#000; font-weight:800;">💾 Save Headlines</button>
                </div>
            </div>
        </div>
    `;
}



/* ============================================================
   IBOS MASTER ENTERPRISE ADMIN CONTROL PANEL — INTERACTIVE CRUD ENGINE
   Granular Control for Every Single Word, Service, Pricing & Credential
   ============================================================ */

function bindIBOSModuleListeners() {
    // 1. SAVE GLOBAL CMS WORDS & HEADLINES ("Every single word")
    const btnSaveWords = document.getElementById('ibos-btn-save-words');
    if (btnSaveWords) {
        btnSaveWords.addEventListener('click', () => {
            const words = getSiteWords();
            const heroTitle = document.getElementById('ibos-hero-title')?.value.trim();
            const heroSub = document.getElementById('ibos-hero-sub')?.value.trim();
            const whatsapp = document.getElementById('ibos-whatsapp-input')?.value.trim();
            const brandName = document.getElementById('ibos-brand-input')?.value.trim();
            const footerText = document.getElementById('ibos-footer-input')?.value.trim();

            if (heroTitle) words.heroTitle = heroTitle;
            if (heroSub) words.heroSub = heroSub;
            if (whatsapp) words.whatsapp = whatsapp;
            if (brandName) words.brandName = brandName;
            if (footerText) words.footerText = footerText;

            saveSiteWords(words);

            // Update live DOM elements immediately
            const heroTitleEl = document.querySelector('.hero-content h1') || document.querySelector('h1');
            const heroSubEl = document.querySelector('.hero-content p') || document.querySelector('.hero p');
            if (heroTitleEl && heroTitle) heroTitleEl.innerHTML = sanitize(heroTitle);
            if (heroSubEl && heroSub) heroSubEl.innerHTML = sanitize(heroSub);

            alert('✅ Global CMS Headlines & Words saved successfully!');
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    // 2. SAVE DYNAMIC BDT EXCHANGE RATE & PAYMENT CONFIG
    const btnUpdateRate = document.getElementById('ibos-btn-update-rate');
    if (btnUpdateRate) {
        btnUpdateRate.addEventListener('click', () => {
            const inputRate = parseFloat(document.getElementById('ibos-bdt-rate-input')?.value);
            if (isNaN(inputRate) || inputRate <= 0) {
                alert('⚠️ Please enter a valid exchange rate (e.g. 120)');
                return;
            }
            const words = getSiteWords();
            words.bdtRate = inputRate;
            saveSiteWords(words);

            // Update currency elements across page
            document.querySelectorAll('.currency-toggle-btn.active').forEach(b => b.click());

            alert(`✅ Exchange Rate saved! 1 USD = ৳${inputRate} BDT across all services.`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    // 3. SERVICE REGISTRY CRUD (Add, Edit, Delete Services & Packages)
    const btnAddService = document.getElementById('ibos-btn-add-service');
    if (btnAddService) {
        btnAddService.addEventListener('click', () => {
            const title = prompt('Enter Service Title:');
            if (!title) return;
            const category = prompt('Enter Category (e.g. AI Agents, Web Scraping, Automations):', 'AI Agents');
            const price = parseFloat(prompt('Enter Service Price ($ USD):', '499')) || 499;
            const commission = parseFloat(prompt('Enter Affiliate Commission Rate (%):', '20')) || 20;

            const registry = getServiceRegistry();
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            registry.push({
                slug,
                title,
                category,
                price,
                commission_rate: commission,
                packages: [
                    { name: 'Starter Tier', price, delivery: '3 Days', features: ['Core System Setup', 'API Integration', '24/7 SLA Support'] },
                    { name: 'Enterprise Tier', price: price * 2, delivery: '7 Days', features: ['Full Swarm Deployment', 'Custom RAG Database', 'Dedicated Account Manager'] }
                ],
                features: ['Production Ready', 'Scalable Architecture', 'Full Source Code'],
                media_url: 'portfolio_hermes_ai_agent.jpg',
                status: 'published'
            });

            saveServiceRegistry(registry);
            alert(`🎉 New Service "${title}" ($${price}) added to Single Source Registry!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    document.querySelectorAll('.ibos-btn-edit-svc').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-svc-idx'));
            const registry = getServiceRegistry();
            const svc = registry[idx];
            if (!svc) return;

            const newTitle = prompt('Edit Service Title:', svc.title);
            if (newTitle === null) return;
            const newPrice = parseFloat(prompt('Edit Price ($ USD):', svc.price));
            if (isNaN(newPrice)) return;
            const newComm = parseFloat(prompt('Edit Commission (%):', svc.commission_rate));

            svc.title = newTitle || svc.title;
            svc.price = !isNaN(newPrice) ? newPrice : svc.price;
            svc.commission_rate = !isNaN(newComm) ? newComm : svc.commission_rate;

            saveServiceRegistry(registry);
            alert(`✅ Service "${svc.title}" updated successfully!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    });

    document.querySelectorAll('.ibos-btn-delete-svc').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-svc-idx'));
            const registry = getServiceRegistry();
            const svc = registry[idx];
            if (!svc) return;

            if (confirm(`⚠️ Are you sure you want to delete service "${svc.title}"?`)) {
                registry.splice(idx, 1);
                saveServiceRegistry(registry);
                alert(`🗑️ Service deleted from OS Registry.`);
                renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
            }
        });
    });

    // 4. RBAC ADMIN CREDENTIALS CRUD (Add/Edit Email & Password)
    const btnAddAdmin = document.getElementById('ibos-btn-add-admin');
    if (btnAddAdmin) {
        btnAddAdmin.addEventListener('click', () => {
            const email = prompt('Enter New Admin Email:');
            if (!email) return;
            const password = prompt('Enter New Password:');
            if (!password) return;
            const role = prompt('Enter Role (Super Admin / Manager / Editor):', 'Admin');

            const admins = getAdminUsers();
            admins.push({ email, password, name: email.split('@')[0], role });
            saveAdminUsers(admins);

            alert(`🛡️ New Admin User "${email}" created!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }

    document.querySelectorAll('.ibos-btn-edit-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.getAttribute('data-admin-idx'));
            const admins = getAdminUsers();
            const adm = admins[idx];
            if (!adm) return;

            const newEmail = prompt('Edit Admin Email:', adm.email);
            if (newEmail === null) return;
            const newPass = prompt('Edit Admin Password:', adm.password);
            if (newPass === null) return;

            adm.email = newEmail || adm.email;
            adm.password = newPass || adm.password;

            saveAdminUsers(admins);
            alert(`✅ Admin Credentials for "${adm.email}" updated successfully!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    });

    // 5. AFFILIATE & CLIENT CRM LISTENERS
    const btnAddAffiliate = document.getElementById('ibos-btn-add-affiliate');
    if (btnAddAffiliate) {
        btnAddAffiliate.addEventListener('click', () => {
            const name = prompt('Enter Affiliate Partner Name:');
            if (!name) return;
            const email = prompt('Enter Partner Email:');
            if (!email) return;
            const code = prompt('Enter Custom Ref Token Code (e.g. AFF10025):', 'AFF' + Math.floor(1000 + Math.random() * 9000));

            const data = getIBOSData();
            const affs = data.affiliates;
            affs.push({
                aff_id: code,
                name,
                email,
                tier: 'VIP',
                commission_rate: 20,
                earnings_total: 0,
                clicks_total: 0,
                sales_total: 0
            });
            localStorage.setItem('iinsha_ibos_affiliates', JSON.stringify(affs));
            alert(`🤝 Partner "${name}" (${code}) added to Affiliate BOS 5.0!`);
            renderAdminModalCmsStudio(document.getElementById('index-admin-cms-root'));
        });
    }
}


function openProtectedAdminPanel() {
    const modal = document.getElementById('admin-control-modal');
    if (modal) {
        modal.style.display = 'flex';
        renderAdminModalContent();
    }
}

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


/* ============================================================
   Compare Page Handlers — Tab Switching & Coupon Copy
   ============================================================ */
function initComparePageHandlers() {
    const switchBtns = document.querySelectorAll('.comp-switch-btn');
    if (!switchBtns.length) return;

    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-comp');
            switchBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('[id^="comp-matrix-"]').forEach(panel => {
                panel.classList.add('hidden');
            });
            const targetPanel = document.getElementById('comp-matrix-' + target);
            if (targetPanel) targetPanel.classList.remove('hidden');
        });
    });

    document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code') || 'IINSHA20';
            navigator.clipboard.writeText(code).then(() => {
                const orig = btn.textContent;
                btn.textContent = '✅ Copied!';
                btn.style.background = 'var(--accent-emerald)';
                setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.background = '';
                }, 2000);
            });
        });
    });
}

/* ============================================================
   Marketplace Page Handlers — Search, Filter, Currency
   ============================================================ */
function initMarketplaceHandlers() {
    const searchInput = document.getElementById('marketplace-search-input');
    const searchBtn = document.getElementById('search-marketplace-btn');
    const cards = document.querySelectorAll('.m-product-card');
    if (!cards.length) return;

    function filterBySearch() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.classList.toggle('hidden-card', query && !text.includes(query));
            card.style.display = (query && !text.includes(query)) ? 'none' : '';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterBySearch);
    if (searchBtn) searchBtn.addEventListener('click', filterBySearch);

    // Category Filter Chips
    const chips = document.querySelectorAll('#market-category-chips button[data-cat]');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const cat = chip.getAttribute('data-cat');
            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category') || '';
                const show = cat === 'all' || cardCat === cat;
                card.style.display = show ? '' : 'none';
            });
        });
    });

    // Currency Toggle (USD <-> BDT, rate: 1 USD = 120 BDT)
    const BDT_RATE = 120;
    let currentCurrency = 'USD';
    document.querySelectorAll('.currency-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.currency-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const curr = btn.getAttribute('data-curr') || 'USD';
            if (curr === currentCurrency) return;
            currentCurrency = curr;

            cards.forEach(card => {
                const priceEl = card.querySelector('[data-usd]');
                if (!priceEl) return;
                const usd = parseFloat(priceEl.getAttribute('data-usd'));
                if (curr === 'BDT') {
                    priceEl.textContent = '৳' + Math.round(usd * BDT_RATE).toLocaleString() + ' BDT';
                } else {
                    priceEl.textContent = '$' + usd.toLocaleString() + ' USD';
                }
            });
        });
    });

    // Coupon buttons on marketplace
    document.querySelectorAll('.copy-coupon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code') || 'IINSHA20';
            navigator.clipboard.writeText(code).then(() => {
                const orig = btn.textContent;
                btn.textContent = '✅ Copied!';
                setTimeout(() => { btn.textContent = orig; }, 2000);
            });
        });
    });
}

/* ============================================================
   Store Page Checkout — Real Checkout Modal Integration
   ============================================================ */
function initStorePageCheckout() {
    document.querySelectorAll('.store-buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-template') || btn.getAttribute('data-name') || 'Digital Asset';
            const price = btn.getAttribute('data-price') || '$29';
            const modal = document.getElementById('checkout-modal');
            if (modal) {
                const titleEl = modal.querySelector('#checkout-package-title') || modal.querySelector('h3');
                const priceEl = modal.querySelector('#checkout-package-price') || modal.querySelector('.price');
                if (titleEl) titleEl.textContent = name;
                if (priceEl) priceEl.textContent = price;
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
            } else {
                // Fallback to WhatsApp
                window.open('https://wa.me/8801629286887?text=I want to purchase: ' + encodeURIComponent(name + ' (' + price + ')'), '_blank');
            }
        });
    });
}

/* ============================================================
   Master DOMContentLoaded — Register All Page Handlers
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
    initFOMOToasts();
    initAdminModalLoginForm();
    initComparePageHandlers();
    initMarketplaceHandlers();
    initStorePageCheckout();
    if (typeof initAuthenticPartnerConsole === 'function') {
        initAuthenticPartnerConsole();
    }
});



/* Live FOMO Activity Stream Notification Toast Engine */
function initFomoToasts() {
    const notifications = [
        "🛒 Tanvir A. (Dhaka) just ordered OpenClaw Stealth Scraper ($599)",
        "⚡ Rifat H. (Chittagong) deployed Gemini Customer Support RAG Bot",
        "🤝 Partner #1042 earned $150.00 recurring affiliate commission!",
        "📄 New Client Quote generated for Invoice OCR Pipeline ($249)",
        "🚀 Hostinger VPS Docker Container #04 deployed successfully"
    ];

    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = 'position:fixed; bottom:20px; left:20px; z-index:9999; display:flex; flex-direction:column; gap:10px; pointer-events:none;';
        document.body.appendChild(toastContainer);
    }

    setInterval(() => {
        const randomMsg = notifications[Math.floor(Math.random() * notifications.length)];
        const toast = document.createElement('div');
        toast.className = 'glass-toast';
        toast.style.cssText = 'background:rgba(15,23,42,0.92); color:#fff; padding:12px 18px; border-radius:10px; border:1px solid var(--accent-cyan); font-size:0.82rem; font-family:var(--font-mono); box-shadow:0 10px 30px rgba(0,0,0,0.5); backdrop-filter:blur(10px); animation:slideUp 0.4s ease; pointer-events:auto;';
        toast.innerHTML = `<span style="color:var(--accent-emerald);">● LIVE</span> ${randomMsg}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }, 25000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFomoToasts);
} else {
    initFomoToasts();
}



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
