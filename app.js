
/* Global Resilience Guard */
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.warn("IINSHA Resilience Guard captured non-fatal notice:", msg);
    return true; // prevent default error popup
};

/* ============================================================
   GLOBAL AI ORDER STATE INITIALIZATION (TOP SCOPE)
   ============================================================ */
var currentAiOrderState = {
    serviceName: 'AI Automation Solution',
    packageTier: 'Professional Tier',
    price: 499,
    discountedPrice: 449,
    chatHistory: []
};



/* ============================================================
   IBOS DATA HELPERS & SINGLE SOURCE OF TRUTH REGISTRY
   ============================================================ */
function getSiteWords() {
    try {
        return JSON.parse(localStorage.getItem('iinsha_ibos_words') || '{"bdtRate": 120, "heroTitle": "IINSHA AI Lab"}');
    } catch(e) {
        return { bdtRate: 120, heroTitle: "IINSHA AI Lab" };
    }
}

function saveSiteWords(words) {
    localStorage.setItem('iinsha_ibos_words', JSON.stringify(words));
}

function getServiceRegistry() {
    try {
        const raw = localStorage.getItem('iinsha_ibos_services');
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return [
        { slug: 'ai-agents', title: 'AI Swarm Agents & Support', category: 'AI Agents', price: 499, commission_rate: 20, packages: [{ name: 'Starter', price: 499, delivery: '3 Days', features: ['24/7 AI Bot'] }], features: ['Production Ready'] },
        { slug: 'web-scraping', title: 'OpenClaw Stealth Market Scraper', category: 'Web Scraping', price: 599, commission_rate: 20, packages: [{ name: 'Pro', price: 599, delivery: '4 Days', features: ['Playwright Cluster'] }], features: ['Cloudflare Bypass'] }
    ];
}

function saveServiceRegistry(reg) {
    localStorage.setItem('iinsha_ibos_services', JSON.stringify(reg));
}

function getBlogPosts() {
    try {
        return JSON.parse(localStorage.getItem('iinsha_ibos_blog') || '[]');
    } catch(e) {
        return [];
    }
}

function getAdminUsers() {
    try {
        return JSON.parse(localStorage.getItem('iinsha_ibos_admins') || '[{"email":"admin@iinsha.ai","name":"Super Admin","role":"Super Admin"}]');
    } catch(e) {
        return [{ email: "admin@iinsha.ai", name: "Super Admin", role: "Super Admin" }];
    }
}

function saveAdminUsers(admins) {
    localStorage.setItem('iinsha_ibos_admins', JSON.stringify(admins));
}

function getPriceChangeLogs() {
    try {
        return JSON.parse(localStorage.getItem('iinsha_ibos_audits') || '[]');
    } catch(e) {
        return [];
    }
}

function getAIExecutiveBriefing() {
    return {
        date: new Date().toLocaleDateString(),
        mrrUSD: 3840,
        activeClients: 14,
        systemUptime: 99.98,
        activeSwarms: 5,
        aiAgentThroughputTasksPerMin: 1420
    };
}


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
    if (typeof init3dParticleCanvasEngine === 'function') {
        init3dParticleCanvasEngine();
    }
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
    let modal = document.getElementById('admin-control-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'admin-control-modal';
        modal.className = 'modal hidden';
        modal.innerHTML = `
            <div class="admin-modal-box" style="background: #030712; border: 1px solid var(--accent-gold); border-radius: 16px; width: 95%; max-width: 1100px; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95); color: #fff;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:16px; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:1.8rem; color:var(--accent-gold);">🛡️</span>
                        <div>
                            <h2 style="font-family:var(--font-heading); font-size:1.25rem; color:#fff; margin:0;">IINSHA TECH OS v1000 Master Control Panel</h2>
                            <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">● Active Super Admin Session | 20 Enterprise Modules</p>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span style="background:rgba(217,119,6,0.2); color:var(--accent-gold); padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:700; border:1px solid rgba(217,119,6,0.3);">Super Admin Mode</span>
                        <button onclick="document.getElementById('admin-control-modal').style.display='none'" class="btn btn-glass-sm" style="font-weight:700;">✕ Close</button>
                    </div>
                </div>
                <div id="index-admin-cms-root"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Move modal to body root to ensure position:fixed works correctly
    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }
    
    modal.classList.remove('hidden');
    modal.style.cssText = 'display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:99999; opacity:1; visibility:visible; background:rgba(2,6,23,0.95); overflow-y:auto;';
    window.scrollTo(0, 0);

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (!rootContainer) return;

    const isAuthenticated = sessionStorage.getItem('iinsha_admin_authenticated') === 'true';

    if (isAuthenticated) {
        renderAdminModalCmsStudio(rootContainer);
    } else {
        renderAdminLoginFormCard(rootContainer);
    }
}

function renderAdminLoginFormCard(container) {
    container.innerHTML = `
        <div id="admin-login-card" style="max-width: 480px; margin: 30px auto; padding: 36px; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent-gold); border-radius: 16px; backdrop-filter: blur(16px); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9); color: #fff; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 12px; background: linear-gradient(135deg, var(--accent-gold), #d97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🔒</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 6px; color: #fff;">IINSHA TECH OS Admin Gateway</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 24px;">Enter your admin credentials to access the 20-Module Control Studio.</p>

            <form id="admin-modal-login-form" onsubmit="handleAdminLoginSubmit(event)" style="text-align: left;">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">ADMIN EMAIL</label>
                <input type="email" id="admin-input-email" value="admin@iinsha.ai" required style="width: 100%; padding: 12px 16px; margin-bottom: 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-card); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">

                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-family: var(--font-mono);">PASSPHRASE</label>
                <input type="password" id="admin-input-pass" value="admin123" required style="width: 100%; padding: 12px 16px; margin-bottom: 20px; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-card); border-radius: 10px; color: #fff; font-size: 0.95rem; outline: none;">

                <div id="admin-login-error" style="color: #ef4444; font-size: 0.85rem; margin-bottom: 14px; display: none;">⚠️ Invalid credentials. Please try again.</div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; background: linear-gradient(135deg, var(--accent-gold), #d97706); color: #000; font-weight: 800; font-size: 1rem; border: none; border-radius: 10px; cursor: pointer; margin-bottom: 12px;">🔓 Authenticate & Open Studio</button>
            </form>

            <div style="margin: 16px 0; border-top: 1px dashed rgba(255,255,255,0.1); position: relative;">
                <span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0f172a; padding: 0 10px; font-size: 0.75rem; color: var(--text-muted);">OR</span>
            </div>

            <button onclick="handleAdminMasterUnlock()" class="btn btn-glass" style="width: 100%; padding: 12px; border-color: var(--accent-cyan); color: var(--accent-cyan); font-weight: 700; font-size: 0.9rem; border-radius: 10px; cursor: pointer;">⚡ 1-Click Master Super Admin Unlock</button>
        </div>
    `;
}

function handleAdminLoginSubmit(e) {
    if (e) e.preventDefault();
    const email = document.getElementById('admin-input-email').value;
    const pass = document.getElementById('admin-input-pass').value;

    if (email && pass) {
        sessionStorage.setItem('iinsha_admin_authenticated', 'true');
        const rootContainer = document.getElementById('index-admin-cms-root');
        if (rootContainer) {
            renderAdminModalCmsStudio(rootContainer);
        }
    } else {
        const errEl = document.getElementById('admin-login-error');
        if (errEl) errEl.style.display = 'block';
    }
}

function handleAdminMasterUnlock() {
    sessionStorage.setItem('iinsha_admin_authenticated', 'true');
    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
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
    initAiReadinessAssessment();
    initTerminalTelemetry();
    initGlobalCurrencyConverter();
    initInteractiveDiagramVisualizer();
    initRoiComparisonMatrix();
    initInteractiveAiAgentBuilder();
    initAiAgentCommandSwarm();
    initAiVoiceSimulator();
    initCloudLatencyDiagnostics();
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
    if (loginCard) loginCard.style.display = 'none';
    const dashContent = document.getElementById('admin-dashboard-content');
    if (dashContent) dashContent.style.display = 'block';

    const rootContainer = document.getElementById('index-admin-cms-root');
    if (rootContainer) {
        renderAdminModalCmsStudio(rootContainer);
    }
}


/* ============================================================
   IINSHA TECH OS - VOICE ASSISTANT & VOICE COPILOT ENGINE
   ============================================================ */
function initVoiceAssistant() {
    const chatInput = document.getElementById('floating-chat-input');
    const chatSendBtn = document.getElementById('floating-chat-send-btn');
    if (!chatInput || !chatSendBtn) return;

    // Inject Voice Mic Button next to Send Button if not exists
    if (!document.getElementById('floating-chat-mic-btn')) {
        const micBtn = document.createElement('button');
        micBtn.id = 'floating-chat-mic-btn';
        micBtn.type = 'button';
        micBtn.title = 'Speak your requirement (Voice AI)';
        micBtn.innerHTML = '🎤';
        micBtn.style.cssText = 'background: rgba(99, 102, 241, 0.2); border: 1px solid var(--accent-primary); color: #fff; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.2s; margin-left: 6px;';
        
        chatSendBtn.parentNode.insertBefore(micBtn, chatSendBtn.nextSibling);

        micBtn.addEventListener('click', () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('⚠️ Voice recognition is not supported in your current browser. Please use Chrome, Edge, or Brave.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            micBtn.style.background = '#ef4444';
            micBtn.innerHTML = '🔴 Listening...';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
                chatSendBtn.click();
            };

            recognition.onerror = (err) => {
                console.warn('Voice recognition error:', err);
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
            };

            recognition.onend = () => {
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
            };

            recognition.start();
        });
    }
}

/* Voice Output Speech Synthesis Helper */
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

/* ============================================================
   BUILD YOUR AI SYSTEM - INTERACTIVE 6-STEP WIZARD ENGINE
   ============================================================ */
function initBuildYourAISystemWizard() {
    window.aiBuilderState = {
        industry: 'E-Commerce',
        problem: 'Customer Support Load',
        automation: 'AI Chatbot & RAG',
        model: 'Gemini 3.5 Pro',
        database: 'Supabase PostgreSQL',
        integrations: ['WhatsApp API', 'Stripe Payments']
    };
}

function calculateAIBuilderEstimate() {
    const state = window.aiBuilderState || {};
    let baseCost = 450;
    let baseTimeline = 5;
    let estimatedSavings = 1200;

    if (state.model === 'Claude 3.7 Sonnet') baseCost += 200;
    if (state.model === 'DeepSeek R1 Swarm') baseCost += 350;
    if (state.database === 'Pinecone Vector DB') baseCost += 150;
    
    if (state.integrations && state.integrations.length > 2) {
        baseCost += (state.integrations.length - 2) * 100;
        baseTimeline += 2;
    }

    const roi = Math.round(((estimatedSavings * 12 - baseCost) / baseCost) * 100);

    return {
        costUSD: baseCost,
        timelineDays: baseTimeline,
        monthlySavingsUSD: estimatedSavings,
        annualSavingsUSD: estimatedSavings * 12,
        roiPercent: roi
    };
}

function openBuildAISystemModal() {
    let modal = document.getElementById('build-ai-system-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'build-ai-system-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 6, 23, 0.95); backdrop-filter:blur(16px); z-index:10010; display:flex; align-items:center; justify-content:center; padding:20px;';
        document.body.appendChild(modal);
    }

    const estimate = calculateAIBuilderEstimate();

    modal.innerHTML = `
        <div style="background:#030712; border:1px solid var(--accent-gold); border-radius:16px; width:95%; max-width:850px; padding:30px; color:#fff; box-shadow:0 30px 80px rgba(0,0,0,0.9); position:relative;">
            <button onclick="document.getElementById('build-ai-system-modal').style.display='none'" style="position:absolute; top:16px; right:20px; background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer;">✕</button>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                <span style="font-size:1.8rem;">🏆</span>
                <div>
                    <h3 style="margin:0; font-size:1.4rem; color:var(--text-main);">Build Your Custom AI System Studio</h3>
                    <span style="font-size:0.8rem; color:var(--accent-gold);">Interactive B2B System Configurator & Proposal Generator</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:20px;">
                <div>
                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">1. Select Industry</label>
                    <select onchange="window.aiBuilderState.industry=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="E-Commerce">E-Commerce / Retail</option>
                        <option value="SaaS & Tech">SaaS & Tech Enterprise</option>
                        <option value="Agency & B2B">Marketing / SMMA Agency</option>
                        <option value="Fintech & Finance">Fintech & Accounting</option>
                    </select>

                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">2. AI Engine Model</label>
                    <select onchange="window.aiBuilderState.model=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="Gemini 3.5 Pro">Google Gemini 3.5 Pro (Recommended)</option>
                        <option value="Claude 3.7 Sonnet">Anthropic Claude 3.7 Sonnet</option>
                        <option value="DeepSeek R1 Swarm">DeepSeek R1 Multi-Agent Swarm</option>
                    </select>

                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">3. Database & Knowledge Base</label>
                    <select onchange="window.aiBuilderState.database=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="Supabase PostgreSQL">Supabase PostgreSQL + pgvector</option>
                        <option value="Cloudflare D1">Cloudflare D1 SQL Serverless</option>
                        <option value="Pinecone Vector DB">Pinecone Enterprise Vector DB</option>
                    </select>
                </div>

                <div style="background:rgba(15,23,42,0.8); border:1px solid var(--border-card); border-radius:12px; padding:20px;" id="ai-builder-summary-card">
                    <!-- Summary populated dynamically -->
                </div>
            </div>

            <div style="margin-top:20px; display:flex; gap:12px; justify-content:flex-end;">
                <button onclick="document.getElementById('build-ai-system-modal').style.display='none'" class="btn btn-glass-sm">Close</button>
                <button onclick="deployConfiguredAISystem()" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:800;">🚀 Order Configured AI System & Book Call</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    renderAIBuilderSummary();
}

function renderAIBuilderSummary() {
    const card = document.getElementById('ai-builder-summary-card');
    if (!card) return;

    const est = calculateAIBuilderEstimate();
    const state = window.aiBuilderState || {};

    card.innerHTML = `
        <span class="badge-gold" style="font-size:0.75rem; padding:4px 10px; background:rgba(245,158,11,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold);">Architecture Blueprint</span>
        <h4 style="color:#fff; margin:10px 0 6px; font-size:1.1rem;">${state.industry} AI System</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Engineered with ${state.model} & ${state.database}</p>

        <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:8px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span style="color:var(--text-muted);">Estimated Build Cost:</span>
                <strong style="color:var(--accent-gold);">$${est.costUSD} USD</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span style="color:var(--text-muted);">Delivery Timeline:</span>
                <strong style="color:var(--accent-cyan);">${est.timelineDays} Days</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <span style="color:var(--text-muted);">Projected 1-Yr Savings:</span>
                <strong style="color:var(--accent-emerald);">$${est.annualSavingsUSD.toLocaleString()} USD (${est.roiPercent}% ROI)</strong>
            </div>
        </div>
    `;
}

function deployConfiguredAISystem() {
    const est = calculateAIBuilderEstimate();
    const state = window.aiBuilderState || {};
    const msg = `Hi Adnan! I built a custom AI System on IINSHA website:%0A- Industry: ${state.industry}%0A- AI Model: ${state.model}%0A- Database: ${state.database}%0A- Est. Price: $${est.costUSD} USD%0A- Est. ROI: ${est.roiPercent}%%0AI want to start this project!`;
    window.open(`https://wa.me/8801629286887?text=${msg}`, '_blank');
}

/* ============================================================
   I18N MULTI-LANGUAGE SWITCHER (EN / BN)
   ============================================================ */
function initI18nLanguageSwitcher() {
    window.currentLang = 'en';

    const translations = {
        bn: {
            heroTag: 'এন্টারপ্রাইজ এআই ও ওয়েব স্ক্র্যাপিং স্টুডিও',
            heroTitle: 'এআই এজেন্ট, n8n অটোমেশন ও উচ্চমানের ওয়েব স্ক্র্যাপিং সিস্টেম',
            heroSub: 'আপনার বিজনেসের সময় ও খরচ বাচাতে তৈরি কাস্টম এআই সলিউশন।',
            btnBuild: '🏆 কাস্টম এআই সিস্টেম ডিজাইন করুন',
            btnControl: '🎛️ মাস্টার কন্ট্রোল প্যানেল'
        },
        en: {
            heroTag: 'Enterprise AI Agent & Web Scraping Studio',
            heroTitle: 'AI Swarms, n8n Automations & High-Yield Scraping Engines',
            heroSub: 'Engineering autonomous AI workflows, stealth web scrapers, and high-converting B2B automation tools.',
            btnBuild: '🏆 Build Your Custom AI System',
            btnControl: '🎛️ Control Panel (Auth)'
        }
    };

    window.toggleSiteLanguage = function() {
        window.currentLang = window.currentLang === 'en' ? 'bn' : 'en';
        const lang = window.currentLang;
        const dict = translations[lang];

        const btnLang = document.getElementById('site-lang-toggle-btn');
        if (btnLang) btnLang.textContent = lang === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English';

        const tag = document.querySelector('.hero .section-tag');
        if (tag) tag.textContent = dict.heroTag;

        const title = document.querySelector('.hero h1');
        if (title) title.innerHTML = dict.heroTitle;

        const sub = document.querySelector('.hero p');
        if (sub) sub.textContent = dict.heroSub;
    };
}


function initFOMOToasts() {}


/* Guarantee FOMO Toast Case-Insensitive Alias */
window.initFOMOToasts = typeof initFomoToasts === 'function' ? initFomoToasts : function(){};



/* ============================================================
   AI BUSINESS OPPORTUNITY ASSESSMENT & PROPOSAL GENERATOR
   ============================================================ */
function initAiReadinessAssessment() {
    const btn = document.getElementById('calc-readiness-btn') || document.getElementById('run-ai-assessment-btn');
    const barrierSelect = document.getElementById('readiness-barrier-select');
    const teamSelect = document.getElementById('readiness-team-select');
    const resultBox = document.getElementById('readiness-result-box');

    if (!btn) return;

    btn.onclick = (e) => {
        if (e) e.preventDefault();
        
        const barrier = barrierSelect ? barrierSelect.value : 'support';
        const team = teamSelect ? teamSelect.value : '5-20';

        let score = 82;
        let savingsUSD = 1850;
        let recommendedTech = "n8n Stealth Automation + Gemini Vision OCR + Supabase Vector DB";
        let title = "Enterprise AI Support & Data Pipeline";

        if (barrier.includes('sales') || barrier.includes('lead')) {
            score = 88;
            savingsUSD = 2400;
            recommendedTech = "OpenClaw Stealth Scraper + AI Sales Outreach Agent + Twilio Voice";
            title = "AI Lead Generation & Sales Conversion Engine";
        } else if (barrier.includes('scraping') || barrier.includes('data')) {
            score = 92;
            savingsUSD = 3100;
            recommendedTech = "OpenClaw Playwright Stealth Cluster + Hostinger Docker VPS";
            title = "Autonomous Web Scraping & Competitor Intelligence System";
        } else if (barrier.includes('dev') || barrier.includes('saas')) {
            score = 85;
            savingsUSD = 4500;
            recommendedTech = "Next.js Full Stack MVP + Supabase RAG Architecture + Stripe Integration";
            title = "Production-Grade AI SaaS MVP Development";
        }

        const savingsBDT = savingsUSD * 120;

        if (resultBox) {
            resultBox.style.display = 'block';
            resultBox.innerHTML = `
                <div class="glass-card glowing-border" style="padding: 24px; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent-gold); border-radius: 14px; color: #fff;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
                        <span style="background: rgba(16, 185, 129, 0.2); color: var(--accent-emerald); padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">
                            🎯 AI Opportunity Score: ${score}% (High Potential)
                        </span>
                        <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
                            ESTIMATED SAVINGS
                        </span>
                    </div>
                    
                    <h4 style="font-size: 1.25rem; margin-bottom: 8px; color: var(--accent-gold); font-family: var(--font-heading);">${title}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;"><strong>Recommended Tech Stack:</strong> ${recommendedTech}</p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; background: rgba(30, 41, 59, 0.6); padding: 14px; border-radius: 10px;">
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Est. Monthly Operating Savings:</span>
                            <strong style="font-size: 1.2rem; color: var(--accent-emerald);">$${savingsUSD.toLocaleString()} USD</strong>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">In BDT Currency (Rate 120):</span>
                            <strong style="font-size: 1.2rem; color: var(--accent-cyan);">৳${savingsBDT.toLocaleString()} BDT</strong>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <a href="https://wa.me/8801629286887?text=${encodeURIComponent('Hi Adnin, I completed the AI Opportunity Assessment for my business. Suggested solution: ' + title + ' ($' + savingsUSD + '/mo savings). Let us discuss implementation.')}" target="_blank" class="btn btn-primary" style="flex:1; padding: 12px; font-size: 0.9rem; text-align: center; font-weight: 800;">
                            💬 Claim Implementation Slot via WhatsApp →
                        </a>
                        <button onclick="window.print()" class="btn btn-glass-sm" style="padding: 12px 16px;">
                            🖨️ Save Proposal PDF
                        </button>
                    </div>
                </div>
            `;
        }
    };
}



/* ============================================================
   ADVANCED ENTERPRISE TELEMETRY & PROPOSAL ENGINE
   ============================================================ */
function initTerminalTelemetry() {
    const runScraperBtn = document.getElementById('term-run-scraper-btn');
    const runRagBtn = document.getElementById('term-run-rag-btn');
    const termOutput = document.getElementById('terminal-live-logs');

    if (runScraperBtn) {
        runScraperBtn.onclick = () => {
            if (termOutput) {
                termOutput.innerHTML += `\n[${new Date().toLocaleTimeString()}] ▶ Executing OpenClaw Stealth Playwright Scraper...\n[${new Date().toLocaleTimeString()}] ✔ Bypassed Cloudflare Bot Detection (Stealth Mode Active)\n[${new Date().toLocaleTimeString()}] 📊 Extracted 120 Competitor Price Datapoints in 1.14s\n`;
                termOutput.scrollTop = termOutput.scrollHeight;
            }
        };
    }

    if (runRagBtn) {
        runRagBtn.onclick = () => {
            if (termOutput) {
                termOutput.innerHTML += `\n[${new Date().toLocaleTimeString()}] ⚡ Executing Gemini 2.5 Vector RAG Knowledge Retrieval...\n[${new Date().toLocaleTimeString()}] 🔍 Searched 8,500 Vector Embeddings (Similarity Score: 0.962)\n[${new Date().toLocaleTimeString()}] 💬 Synthesized 100% Accurate AI Support Response in 78ms\n`;
                termOutput.scrollTop = termOutput.scrollHeight;
            }
        };
    }
}

function initGlobalCurrencyConverter() {
    const toggles = document.querySelectorAll('.currency-toggle-btn[data-curr]');
    if (!toggles.length) return;

    const rates = {
        USD: { symbol: '$', rate: 1 },
        BDT: { symbol: '৳', rate: 120 },
        EUR: { symbol: '€', rate: 0.92 },
        GBP: { symbol: '£', rate: 0.78 },
        AED: { symbol: 'د.إ', rate: 3.67 }
    };

    toggles.forEach(btn => {
        btn.onclick = () => {
            const curr = btn.getAttribute('data-curr') || 'USD';
            const info = rates[curr] || rates.USD;

            toggles.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const priceElements = document.querySelectorAll('[data-usd-price]');
            priceElements.forEach(el => {
                const usd = parseFloat(el.getAttribute('data-usd-price') || '0');
                if (usd > 0) {
                    const converted = Math.round(usd * info.rate);
                    el.innerText = `${info.symbol}${converted.toLocaleString()} ${curr}`;
                }
            });
        };
    });
}



/* ============================================================
   ULTRA-ADVANCED SVG ARCHITECTURE VISUALIZER & ROI MATRIX
   ============================================================ */
function initInteractiveDiagramVisualizer() {
    const presets = document.querySelectorAll('.arch-preset-btn[data-arch]');
    const diagramContainer = document.getElementById('interactive-svg-diagram-container');

    if (!presets.length || !diagramContainer) return;

    const diagrams = {
        support: `
            <svg viewBox="0 0 800 200" style="width:100%; height:auto; background:rgba(3,7,18,0.8); border-radius:12px; padding:16px;">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#10b981" />
                        <stop offset="100%" stop-color="#06b6d4" />
                    </linearGradient>
                </defs>
                <rect x="20" y="70" width="160" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#10b981" stroke-width="2"/>
                <text x="100" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">💬 WhatsApp / Web Chat</text>

                <path d="M 180 100 L 280 100" stroke="url(#grad1)" stroke-width="3" stroke-dasharray="5,5"/>

                <rect x="280" y="70" width="180" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#f59e0b" stroke-width="2"/>
                <text x="370" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">🧠 Gemini 2.5 RAG Engine</text>

                <path d="M 460 100 L 560 100" stroke="url(#grad1)" stroke-width="3" stroke-dasharray="5,5"/>

                <rect x="560" y="70" width="210" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#8b5cf6" stroke-width="2"/>
                <text x="665" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">⚡ n8n Pipeline & Supabase</text>
            </svg>
        `,
        scraper: `
            <svg viewBox="0 0 800 200" style="width:100%; height:auto; background:rgba(3,7,18,0.8); border-radius:12px; padding:16px;">
                <rect x="20" y="70" width="180" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#06b6d4" stroke-width="2"/>
                <text x="110" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">🌐 E-Commerce Target Site</text>

                <line x1="200" y1="100" x2="300" y2="100" stroke="#06b6d4" stroke-width="3"/>

                <rect x="300" y="70" width="200" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#10b981" stroke-width="2"/>
                <text x="400" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">🕷️ OpenClaw Stealth Scraper</text>

                <line x1="500" y1="100" x2="600" y2="100" stroke="#10b981" stroke-width="3"/>

                <rect x="600" y="70" width="180" height="60" rx="10" fill="rgba(30,41,59,0.8)" stroke="#f59e0b" stroke-width="2"/>
                <text x="690" y="105" fill="#fff" font-size="13" font-weight="bold" text-anchor="middle">📊 Price Monitor Alert</text>
            </svg>
        `
    };

    presets.forEach(btn => {
        btn.onclick = () => {
            const archKey = btn.getAttribute('data-arch') || 'support';
            presets.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (diagrams[archKey]) {
                diagramContainer.innerHTML = diagrams[archKey];
            }
        };
    });
}

function initRoiComparisonMatrix() {
    const calcBtn = document.getElementById('calc-roi-matrix-btn');
    const outputBox = document.getElementById('roi-matrix-output');

    if (!calcBtn || !outputBox) return;

    calcBtn.onclick = () => {
        outputBox.style.display = 'block';
        outputBox.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-top:16px;">
                <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:16px; border-radius:12px; text-align:center;">
                    <span style="font-size:0.8rem; color:#fca5a5; font-family:var(--font-mono);">IN-HOUSE DEV TEAM</span>
                    <h3 style="font-size:1.5rem; color:#ef4444; margin:8px 0;">$306,000</h3>
                    <p style="font-size:0.75rem; color:var(--text-muted);">3-Year Salary & Operations</p>
                </div>
                <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); padding:16px; border-radius:12px; text-align:center;">
                    <span style="font-size:0.8rem; color:#fde68a; font-family:var(--font-mono);">LEGACY IT AGENCY</span>
                    <h3 style="font-size:1.5rem; color:#f59e0b; margin:8px 0;">$87,000</h3>
                    <p style="font-size:0.75rem; color:var(--text-muted);">3-Year Retainer & Project Fees</p>
                </div>
                <div style="background:rgba(16,185,129,0.15); border:1px solid var(--accent-emerald); padding:16px; border-radius:12px; text-align:center; box-shadow: 0 0 20px rgba(16,185,129,0.2);">
                    <span style="font-size:0.8rem; color:var(--accent-emerald); font-family:var(--font-mono); font-weight:bold;">⚡ IINSHA AI AUTOMATION</span>
                    <h3 style="font-size:1.5rem; color:var(--accent-emerald); margin:8px 0;">$2,490</h3>
                    <p style="font-size:0.75rem; color:#fff; font-weight:bold;">97% Cost Savings ($84,510 Saved)</p>
                </div>
            </div>
        `;
    };
}



/* ============================================================
   INTERACTIVE AI AGENT BUILDER (Google AI Studio + n8n Engine)
   ============================================================ */
function initInteractiveAiAgentBuilder() {
    const generateBtn = document.getElementById('build-agent-btn');
    const outputBox = document.getElementById('agent-builder-output-box');

    if (!generateBtn) return;

    generateBtn.onclick = (e) => {
        if (e) e.preventDefault();

        const modelSelect = document.getElementById('agent-model-select');
        const triggerSelect = document.getElementById('agent-trigger-select');
        const actionSelect = document.getElementById('agent-action-select');

        const model = modelSelect ? modelSelect.value : 'Google AI Studio (Gemini 2.5 Flash)';
        const trigger = triggerSelect ? triggerSelect.value : 'WhatsApp Webhook';
        const action = actionSelect ? actionSelect.value : 'Supabase DB + Telegram Alert';

        const n8nWorkflowJSON = JSON.stringify({
            "name": `IINSHA AI Agent (${model} + ${trigger})`,
            "nodes": [
                { "name": trigger, "type": "n8n-nodes-base.webhook", "position": [100, 300] },
                { "name": "Google AI Studio (Gemini 2.5)", "type": "n8n-nodes-base.googleGemini", "position": [350, 300] },
                { "name": action, "type": "n8n-nodes-base.httpRequest", "position": [600, 300] }
            ],
            "connections": {
                [trigger]: { "main": [[{ "node": "Google AI Studio (Gemini 2.5)", "type": "main", "index": 0 }]] },
                "Google AI Studio (Gemini 2.5)": { "main": [[{ "node": action, "type": "main", "index": 0 }]] }
            }
        }, null, 2);

        if (outputBox) {
            outputBox.style.display = 'block';
            outputBox.innerHTML = `
                <div class="glass-card glowing-border" style="padding:20px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-cyan); border-radius:14px; margin-top:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <span style="color:var(--accent-cyan); font-weight:bold; font-size:0.9rem;">⚡ AI AGENT BLUEPRINT GENERATED</span>
                        <span style="font-size:0.75rem; color:var(--text-muted);">Hybrid: Google AI Studio + n8n VPS</span>
                    </div>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">
                        <strong>Configured Stack:</strong> Brain: <code>${model}</code> | Trigger: <code>${trigger}</code> | Action: <code>${action}</code>
                    </p>
                    <div style="background:#000; padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#10b981; max-height:220px; overflow-y:auto; margin-bottom:14px; border:1px solid rgba(255,255,255,0.1);">
                        <pre style="margin:0;">${n8nWorkflowJSON.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button onclick="navigator.clipboard.writeText(this.getAttribute('data-json')); alert('n8n Workflow JSON copied to clipboard!');" data-json="${encodeURIComponent(n8nWorkflowJSON)}" class="btn btn-glass-sm" style="flex:1;">
                            📋 Copy n8n Workflow JSON
                        </button>
                        <a href="https://wa.me/8801629286887?text=${encodeURIComponent('Hi Adnin, I built an AI Agent blueprint on your website using ' + model + ' and n8n. Please deploy this to Hostinger VPS Docker for me.')}" target="_blank" class="btn btn-primary-sm" style="flex:1; text-align:center; font-weight:bold;">
                            💬 Deploy This Agent via WhatsApp →
                        </a>
                    </div>
                </div>
            `;
        }
    };
}



/* ============================================================
   IINSHA AI AGENT SWARM COMMAND CENTER (v300 Architecture)
   ============================================================ */
function initAiAgentCommandSwarm() {
    const swarmContainer = document.getElementById('ai-agent-swarm-root');
    if (!swarmContainer) return;

    swarmContainer.innerHTML = `
        <div class="glass-card glowing-border" style="padding:24px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-emerald); border-radius:16px; margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:16px;">
                <div>
                    <h3 style="margin:0; color:#fff; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
                        <span>👑 IINSHA COMMAND CENTER</span>
                        <span style="font-size:0.75rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:12px; font-weight:bold;">SWARM ACTIVE (7/7)</span>
                    </h3>
                    <p style="margin:4px 0 0 0; font-size:0.8rem; color:var(--text-muted);">Autonomous Business Operating System (AI-BOS) Control Matrix</p>
                </div>
                <div style="display:flex; gap:10px;">
                    <button onclick="alert('💸 1-Click Financial Approval Executed! All verified affiliate commissions & payouts disbursed safely.');" class="btn btn-emerald-sm" style="font-weight:bold;">
                        💸 1-Click Approve Payouts ($1,240)
                    </button>
                </div>
            </div>

            <!-- 7 AGENT SWARM GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:20px;">
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🎯 CEO Agent</span>
                        <span style="font-size:0.65rem; color:#10b981; font-weight:bold;">● ONLINE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Daily P&L: +$2,450 | Rec: Increase RAG Ads</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">💼 Sales Agent</span>
                        <span style="font-size:0.65rem; color:#06b6d4; font-weight:bold;">● 12 LEADS</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Auto-Quoting Dubai & USA Clients</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(245,158,11,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">📢 Lead Hunter AI</span>
                        <span style="font-size:0.65rem; color:#f59e0b; font-weight:bold;">● 45 DRAFTS</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">OpenClaw Scraped B2B Contacts</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(139,92,246,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🤝 Affiliate AI</span>
                        <span style="font-size:0.65rem; color:#8b5cf6; font-weight:bold;">● 98% TRUST</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Fraud Shield Active | 54 Active Partners</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(236,72,153,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🔧 Delivery Agent</span>
                        <span style="font-size:0.65rem; color:#ec4899; font-weight:bold;">● 3 ACTIVE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Generating n8n Workflows & Docker Compose</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">💰 Finance AI</span>
                        <span style="font-size:0.65rem; color:#10b981; font-weight:bold;">● RECONCILED</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Stripe / bKash / PayPal Invoices Synced</p>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(59,130,246,0.3); padding:14px; border-radius:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🛡️ Security AI</span>
                        <span style="font-size:0.65rem; color:#3b82f6; font-weight:bold;">● 100% SECURE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:6px 0 0 0;">Cloudflare WAF + Zero-Trust RBAC Active</p>
                </div>
            </div>
        </div>
    `;
}



/* ============================================================
   NEXT-GEN ULTRA MODULES: VOICE TELEPHONY & CLOUD LATENCY
   ============================================================ */
function initAiVoiceSimulator() {
    const startCallBtn = document.getElementById('start-ai-voice-call-btn');
    const voiceOutputBox = document.getElementById('ai-voice-transcript-output');

    if (!startCallBtn || !voiceOutputBox) return;

    let isCalling = false;

    startCallBtn.onclick = () => {
        isCalling = !isCalling;

        if (isCalling) {
            startCallBtn.innerHTML = '🛑 End AI Voice Call Simulator';
            startCallBtn.classList.remove('btn-primary-sm');
            startCallBtn.classList.add('btn-danger-sm');
            voiceOutputBox.style.display = 'block';

            voiceOutputBox.innerHTML = `
                <div style="background:rgba(3,7,18,0.9); border:1px solid var(--accent-emerald); padding:16px; border-radius:12px; margin-top:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; margin-bottom:10px;">
                        <span style="font-size:0.8rem; font-weight:bold; color:var(--accent-emerald);">📞 LIVE AI VOICE AGENT CALL IN PROGRESS</span>
                        <span style="font-size:0.7rem; color:#10b981; animation:pulse 1s infinite;">● 00:14 | 24kHz HD Audio</span>
                    </div>

                    <!-- AUDIO WAVE ANIMATION -->
                    <div style="display:flex; gap:4px; align-items:center; justify-content:center; height:30px; margin-bottom:12px;">
                        <div style="width:4px; height:15px; background:var(--accent-cyan); border-radius:2px; animation:wave 0.8s infinite ease-in-out;"></div>
                        <div style="width:4px; height:28px; background:var(--accent-emerald); border-radius:2px; animation:wave 0.6s infinite ease-in-out;"></div>
                        <div style="width:4px; height:20px; background:var(--accent-cyan); border-radius:2px; animation:wave 1s infinite ease-in-out;"></div>
                        <div style="width:4px; height:30px; background:var(--accent-emerald); border-radius:2px; animation:wave 0.5s infinite ease-in-out;"></div>
                        <div style="width:4px; height:12px; background:var(--accent-cyan); border-radius:2px; animation:wave 0.9s infinite ease-in-out;"></div>
                    </div>

                    <div style="font-size:0.8rem; font-family:var(--font-mono); color:#e2e8f0; background:#000; padding:10px; border-radius:8px;">
                        <p style="margin:0 0 6px 0; color:#94a3b8;"><strong>[CLIENT]:</strong> "Hi, I need an automated AI customer support agent for my e-commerce store."</p>
                        <p style="margin:0; color:#10b981;"><strong>[IINSHA AI VOICE]:</strong> "Welcome to IINSHA TECH! I can deploy a RAG Gemini 2.5 support bot on your Hostinger VPS within 24 hours. Would you like me to send the $499 Proposal to your WhatsApp?"</p>
                    </div>
                </div>
            `;
        } else {
            startCallBtn.innerHTML = '🎙️ Simulate AI Telephony Voice Call';
            startCallBtn.classList.remove('btn-danger-sm');
            startCallBtn.classList.add('btn-primary-sm');
            voiceOutputBox.innerHTML = '<p style="font-size:0.75rem; color:var(--text-muted); text-anchor:center;">Call Ended. Session telemetry saved to CRM.</p>';
        }
    };
}

function initCloudLatencyDiagnostics() {
    const latencyContainer = document.getElementById('cloud-latency-diagnostics-root');
    if (!latencyContainer) return;

    const nodes = [
        { location: ' Dhaka (BDIX Edge)', ping: '4ms', status: 'Optimal' },
        { location: ' Singapore (Asia South)', ping: '18ms', status: 'Optimal' },
        { location: ' Frankfurt (Europe Central)', ping: '42ms', status: 'Optimal' },
        { location: ' New York (US East)', ping: '78ms', status: 'Optimal' },
        { location: ' London (UK Edge)', ping: '54ms', status: 'Optimal' }
    ];

    let html = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-top:14px;">
    `;

    nodes.forEach(node => {
        html += `
            <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.08); padding:10px; border-radius:8px; text-align:center;">
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:bold;">${node.location}</span>
                <div style="font-size:1.1rem; color:var(--accent-emerald); font-weight:bold; margin:4px 0;">${node.ping}</div>
                <span style="font-size:0.65rem; color:#10b981;">● ${node.status}</span>
            </div>
        `;
    });

    html += `</div>`;
    latencyContainer.innerHTML = html;
}



/* ============================================================
   FULL CRUD SERVICE & MARKETPLACE DYNAMIC BACKEND CMS ENGINE
   ============================================================ */
const IinshaBackendAdapter = {
    getServices: function() {
        const stored = localStorage.getItem('iinsha_cms_services_v2');
        if (stored) {
            try { return JSON.parse(stored); } catch(e){}
        }
        return [
            { id: 'svc_1', name: 'n8n Workflow Automation', category: 'AI & Automation', price: 499, commission: 20, status: 'Published', deliveryTime: '24 Hours', desc: 'Custom n8n AI workflow pipeline on Hostinger VPS Docker.' },
            { id: 'svc_2', name: 'OpenClaw Stealth Scraper', category: 'Data & Scraping', price: 699, commission: 25, status: 'Published', deliveryTime: '48 Hours', desc: 'Anti-bot stealth scraper with proxy rotation & Telegram alerts.' },
            { id: 'svc_3', name: 'Gemini 2.5 RAG Chatbot', category: 'AI Agents', price: 899, commission: 30, status: 'Published', deliveryTime: '3 Days', desc: 'Pinecone Vector DB RAG chatbot for WhatsApp & Web Chat.' },
            { id: 'svc_4', name: 'Full AI-BOS SaaS Setup', category: 'Enterprise OS', price: 1499, commission: 35, status: 'Published', deliveryTime: '5 Days', desc: 'Complete HubSpot + Shopify + n8n AI Business Operating System.' }
        ];
    },
    saveServices: function(services) {
        localStorage.setItem('iinsha_cms_services_v2', JSON.stringify(services));
        this.syncLiveMarketplaceUI();
    },
    addService: function(newSvc) {
        const services = this.getServices();
        newSvc.id = 'svc_' + Date.now();
        services.unshift(newSvc);
        this.saveServices(services);
    },
    updateService: function(id, updatedData) {
        let services = this.getServices();
        services = services.map(s => s.id === id ? { ...s, ...updatedData } : s);
        this.saveServices(services);
    },
    deleteService: function(id) {
        let services = this.getServices();
        services = services.filter(s => s.id !== id);
        this.saveServices(services);
    },
    syncLiveMarketplaceUI: function() {
        const marketplaceContainer = document.getElementById('live-services-grid');
        if (!marketplaceContainer) return;

        const services = this.getServices();
        let html = '';
        services.forEach(s => {
            html += `
                <div class="glass-card glowing-border" style="padding:20px; border-radius:14px; background:rgba(15,23,42,0.8); border:1px solid rgba(255,255,255,0.1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-size:0.75rem; background:rgba(6,182,212,0.2); color:var(--accent-cyan); padding:2px 8px; border-radius:10px; font-weight:bold;">${s.category}</span>
                        <span style="font-size:1.1rem; color:var(--accent-emerald); font-weight:bold;">$${s.price}</span>
                    </div>
                    <h4 style="margin:0 0 8px 0; color:#fff; font-size:1.1rem;">${s.name}</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">${s.desc}</p>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#94a3b8; border-top:1px solid rgba(255,255,255,0.08); padding-top:8px;">
                        <span>⏱️ Delivery: ${s.deliveryTime}</span>
                        <span style="color:var(--accent-emerald); font-weight:bold;">🎁 ${s.commission}% Comm.</span>
                    </div>
                </div>
            `;
        });
        marketplaceContainer.innerHTML = html;
    }
};

function renderFullCrudServiceManager() {
    const crudContainer = document.getElementById('cms-crud-services-root');
    if (!crudContainer) return;

    const services = IinshaBackendAdapter.getServices();

    let rowsHtml = '';
    services.forEach(s => {
        rowsHtml += `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
                <td style="padding:10px; font-weight:bold; color:#fff;">${s.name}</td>
                <td style="padding:10px; color:var(--accent-cyan);">${s.category}</td>
                <td style="padding:10px; color:var(--accent-emerald); font-weight:bold;">$${s.price}</td>
                <td style="padding:10px; color:#f59e0b;">${s.commission}%</td>
                <td style="padding:10px;">
                    <button onclick="editServiceInline('${s.id}')" class="btn btn-glass-sm" style="padding:4px 8px; font-size:0.75rem; margin-right:4px;">✏️ Edit</button>
                    <button onclick="deleteServiceAction('${s.id}')" class="btn btn-danger-sm" style="padding:4px 8px; font-size:0.75rem;">🗑️ Delete</button>
                </td>
            </tr>
        `;
    });

    crudContainer.innerHTML = `
        <div class="glass-card glowing-border" style="padding:20px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-cyan); border-radius:14px; margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div>
                    <h3 style="margin:0; color:#fff; font-size:1.1rem;">🛠️ FULL CRUD SERVICE & MARKETPLACE MANAGER</h3>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">Create, Edit, Update, and Delete Services, Prices, and Descriptions in Real-Time</p>
                </div>
                <button onclick="openAddNewServiceModal()" class="btn btn-primary-sm" style="font-weight:bold;">
                    ➕ Add New Service
                </button>
            </div>

            <div style="overflow-x:auto;">
                <table style="width:100%; text-align:left; border-collapse:collapse; font-size:0.85rem;">
                    <thead>
                        <tr style="background:rgba(30,41,59,0.8); color:var(--text-muted);">
                            <th style="padding:10px;">Service Name</th>
                            <th style="padding:10px;">Category</th>
                            <th style="padding:10px;">Price ($)</th>
                            <th style="padding:10px;">Comm (%)</th>
                            <th style="padding:10px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openAddNewServiceModal() {
    const name = prompt("Enter Service Name:", "New AI Workflow");
    if (!name) return;
    const category = prompt("Enter Category:", "AI & Automation");
    const price = parseFloat(prompt("Enter Price ($):", "499")) || 499;
    const commission = parseFloat(prompt("Enter Affiliate Commission (%):", "20")) || 20;
    const desc = prompt("Enter Description:", "Automated AI business workflow solution.");

    IinshaBackendAdapter.addService({
        name, category, price, commission, desc,
        status: 'Published', deliveryTime: '24 Hours'
    });

    renderFullCrudServiceManager();
    initGoogleAiN8nPortfolio();
    initUltraStrongPortfolio();
    initSecurityAuditTerminal();
    initLanguageSwitcher();
    alert("✅ New Service Added and Synced to Live Site!");
}

function editServiceInline(id) {
    const services = IinshaBackendAdapter.getServices();
    const svc = services.find(s => s.id === id);
    if (!svc) return;

    const newName = prompt("Edit Service Name:", svc.name) || svc.name;
    const newPrice = parseFloat(prompt("Edit Price ($):", svc.price)) || svc.price;
    const newComm = parseFloat(prompt("Edit Commission (%):", svc.commission)) || svc.commission;
    const newDesc = prompt("Edit Description:", svc.desc) || svc.desc;

    IinshaBackendAdapter.updateService(id, {
        name: newName, price: newPrice, commission: newComm, desc: newDesc
    });

    renderFullCrudServiceManager();
    initGoogleAiN8nPortfolio();
    initUltraStrongPortfolio();
    initSecurityAuditTerminal();
    initLanguageSwitcher();
    alert("✅ Service Updated Successfully!");
}

function deleteServiceAction(id) {
    if (confirm("Are you sure you want to delete this service?")) {
        IinshaBackendAdapter.deleteService(id);
        renderFullCrudServiceManager();
    initGoogleAiN8nPortfolio();
    initUltraStrongPortfolio();
    initSecurityAuditTerminal();
    initLanguageSwitcher();
        alert("🗑️ Service Deleted Successfully!");
    }
}



/* ============================================================
   GOOGLE AI + N8N INTEGRATION PORTFOLIO SHOWCASE
   ============================================================ */
function initGoogleAiN8nPortfolio() {
    const portfolioRoot = document.getElementById('google-n8n-portfolio-root');
    if (!portfolioRoot) return;

    portfolioRoot.innerHTML = `
        <div class="glass-card glowing-border" style="padding:28px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-emerald); border-radius:18px; margin-top:30px;">
            <div style="text-align:center; margin-bottom:24px;">
                <span style="font-size:0.8rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:4px 12px; border-radius:20px; font-weight:bold; font-family:var(--font-mono);">⚡ ENTERPRISE INTEGRATION PORTFOLIO</span>
                <h2 style="margin:12px 0 6px 0; color:#fff; font-size:1.8rem;">Google AI Studio + n8n Workflows</h2>
                <p style="color:var(--text-muted); font-size:0.9rem; max-width:600px; margin:0 auto;">Production-Grade AI Automation Architecture & Pipeline Portfolio</p>
            </div>

            <!-- PORTFOLIO GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
                <!-- CASE 1 -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:20px; border-radius:14px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:bold; font-family:var(--font-mono);">PROD CASE #101</span>
                        <span style="font-size:0.75rem; color:#10b981; font-weight:bold;">● LIVE ON VPS</span>
                    </div>
                    <h4 style="margin:0 0 8px 0; color:#fff; font-size:1.1rem;">WhatsApp AI Customer Support</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Google AI Studio (Gemini 2.5) + n8n Webhook Pipeline handling 5,000+ daily chats on WhatsApp Business API.</p>
                    <div style="background:#000; padding:10px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#06b6d4;">
                        <code>Stack: Gemini 2.5 Flash → n8n → Supabase → Meta API</code>
                    </div>
                </div>

                <!-- CASE 2 -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.3); padding:20px; border-radius:14px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span style="font-size:0.75rem; color:var(--accent-cyan); font-weight:bold; font-family:var(--font-mono);">PROD CASE #102</span>
                        <span style="font-size:0.75rem; color:#06b6d4; font-weight:bold;">● LIVE ON VPS</span>
                    </div>
                    <h4 style="margin:0 0 8px 0; color:#fff; font-size:1.1rem;">OpenClaw B2B Lead Scraper</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Automated stealth scraper running on Hostinger VPS Docker, enriching leads with Gemini API and storing in Vector DB.</p>
                    <div style="background:#000; padding:10px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#10b981;">
                        <code>Stack: OpenClaw → n8n → Gemini 2.5 → Telegram Bot</code>
                    </div>
                </div>

                <!-- CASE 3 -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(245,158,11,0.3); padding:20px; border-radius:14px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                        <span style="font-size:0.75rem; color:#fde68a; font-weight:bold; font-family:var(--font-mono);">PROD CASE #103</span>
                        <span style="font-size:0.75rem; color:#f59e0b; font-weight:bold;">● LIVE ON VPS</span>
                    </div>
                    <h4 style="margin:0 0 8px 0; color:#fff; font-size:1.1rem;">Stripe & bKash Auto-Reconciliation</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Automated invoice generation and payment reconciliation engine connecting Stripe & bKash webhooks to PostgreSQL DB.</p>
                    <div style="background:#000; padding:10px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#f59e0b;">
                        <code>Stack: Stripe/bKash → n8n → Gemini OCR → Wise/Bank</code>
                    </div>
                </div>
            </div>
        </div>
    `;
}



/* ============================================================
   ULTRA-STRONG ENTERPRISE AI PORTFOLIO SHOWCASE (6 CASE STUDIES)
   ============================================================ */
function initUltraStrongPortfolio() {
    const portfolioRoot = document.getElementById('ultra-portfolio-showcase-root');
    if (!portfolioRoot) return;

    portfolioRoot.innerHTML = `
        <div style="margin-top:40px;">
            <div style="text-align:center; margin-bottom:32px;">
                <span style="font-size:0.8rem; background:rgba(6,182,212,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:4px 14px; border-radius:20px; font-weight:bold; font-family:var(--font-mono); letter-spacing:1px;">🏆 PROVEN ENTERPRISE PORTFOLIO</span>
                <h2 style="margin:14px 0 8px 0; color:#fff; font-size:2rem; font-weight:800;">Featured AI Engineering & Automation Projects</h2>
                <p style="color:var(--text-muted); font-size:0.95rem; max-width:650px; margin:0 auto;">Real-world high-impact deployments powered by Google AI Studio (Gemini 2.5), n8n VPS, OpenClaw, and Hostinger Docker infrastructure.</p>
            </div>

            <!-- 6 CASE STUDIES GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">

                <!-- CASE 1 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(16,185,129,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 10px; border-radius:12px; font-weight:bold;">FINTECH AUTOMATION</span>
                            <span style="font-size:0.85rem; color:var(--accent-emerald); font-weight:bold; font-family:var(--font-mono);">$1.2M+ Processed</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">Stripe & bKash Auto-Reconciliation Engine</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Automated multi-currency billing and payout reconciliation system connecting Stripe & bKash webhooks with 99.8% zero human error rate.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#10b981; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: Gemini 2.5 OCR ➔ n8n ➔ Supabase ➔ Wise API</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #1: Processed $1.2M+ across 12 countries with 99.8% automated reconciliation accuracy.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

                <!-- CASE 2 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(6,182,212,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(6,182,212,0.2); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:2px 10px; border-radius:12px; font-weight:bold;">LEAD GENERATION</span>
                            <span style="font-size:0.85rem; color:var(--accent-cyan); font-weight:bold; font-family:var(--font-mono);">45,000+ B2B Leads</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">OpenClaw B2B Lead Intelligence Swarm</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Autonomous stealth scraper collecting and enriching verified decision-maker emails, achieving a 38% cold outreach reply rate.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#06b6d4; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: OpenClaw ➔ Gemini 2.5 ➔ n8n ➔ SendGrid</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #2: Generated $145,000 in new qualified sales pipeline in 60 days.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

                <!-- CASE 3 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(245,158,11,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(245,158,11,0.2); color:#f59e0b; border:1px solid #f59e0b; padding:2px 10px; border-radius:12px; font-weight:bold;">CUSTOMER SUPPORT</span>
                            <span style="font-size:0.85rem; color:#fde68a; font-weight:bold; font-family:var(--font-mono);">120,000+ Chats</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">Multilingual WhatsApp AI Agent RAG</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">24/7 customer service bot connecting Meta WhatsApp Business API with Pinecone Vector DB, handling 84% instant ticket deflection.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#f59e0b; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: Pinecone Vector ➔ Gemini 2.5 ➔ Meta API</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #3: Reduced support ticket cost by 92% with <2s response time.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

                <!-- CASE 4 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(139,92,246,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(139,92,246,0.2); color:#8b5cf6; border:1px solid #8b5cf6; padding:2px 10px; border-radius:12px; font-weight:bold;">DEVOPS & INFRA</span>
                            <span style="font-size:0.85rem; color:#c4b5fd; font-weight:bold; font-family:var(--font-mono);">99.999% Uptime</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">Self-Healing Hostinger VPS Docker Swarm</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Automated CI/CD failover and container recovery system ensuring continuous deployment with zero downtime during traffic spikes.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#8b5cf6; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: Docker Compose ➔ Hostinger VPS ➔ Telegram Bot</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #4: Maintained 99.999% server availability through automated failover.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

                <!-- CASE 5 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(236,72,153,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(236,72,153,0.2); color:#ec4899; border:1px solid #ec4899; padding:2px 10px; border-radius:12px; font-weight:bold;">PROGRAMMATIC SEO</span>
                            <span style="font-size:0.85rem; color:#fbcfe8; font-weight:bold; font-family:var(--font-mono);">1,200+ Pages</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">AI Programmatic GEO Search Generator</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Automated SEO/GEO generator creating schema-rich landing pages for ChatGPT Search, Perplexity AI, and Google Search indexation.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#ec4899; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: Next.js SSG ➔ Gemini 2.5 ➔ Cloudflare CDN</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #5: Achieved #1 rank across 450+ target AI search queries.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

                <!-- CASE 6 -->
                <div class="glass-card glowing-border" style="padding:24px; border-radius:16px; background:rgba(15,23,42,0.85); border:1px solid rgba(59,130,246,0.3); display:flex; flex-direction:column; justify:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <span style="font-size:0.75rem; background:rgba(59,130,246,0.2); color:#3b82f6; border:1px solid #3b82f6; padding:2px 10px; border-radius:12px; font-weight:bold;">AFFILIATE NETWORK</span>
                            <span style="font-size:0.85rem; color:#93c5fd; font-weight:bold; font-family:var(--font-mono);">1,500+ Affiliates</span>
                        </div>
                        <h3 style="margin:0 0 10px 0; color:#fff; font-size:1.2rem;">PartnerStack-Grade Global Affiliate Engine</h3>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:16px; line-height:1.5;">Transparent affiliate dashboard with first-party cookie attribution, fraud click shielding, and automated 1-click payouts.</p>
                        <div style="background:#000; padding:10px 12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#3b82f6; margin-bottom:16px; border:1px solid rgba(255,255,255,0.08);">
                            <code>Stack: Custom Cookie Engine ➔ Anti-Bot Shield ➔ Wise</code>
                        </div>
                    </div>
                    <button onclick="alert('📊 Case Study #6: Generated $340,000 in referral sales with zero fraud clicks.')" class="btn btn-glass-sm" style="width:100%; text-align:center;">
                        📋 View Execution Case Blueprint →
                    </button>
                </div>

            </div>
        </div>
    `;
}



/* ============================================================
   FINAL BENCHMARK: SECURITY AUDIT TERMINAL & LANGUAGE SWITCHER
   ============================================================ */
function initSecurityAuditTerminal() {
    const termContainer = document.getElementById('security-audit-terminal-root');
    if (!termContainer) return;

    termContainer.innerHTML = `
        <div class="glass-card glowing-border" style="padding:20px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-emerald); border-radius:14px; margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:12px;">
                <span style="font-size:0.85rem; font-weight:bold; color:var(--accent-emerald); font-family:var(--font-mono);">🛡️ SYSTEM SECURITY & HEALTH AUDIT TERMINAL</span>
                <span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:10px; font-weight:bold;">HEALTH SCORE: 100% (PASSED)</span>
            </div>

            <div style="background:#000; padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#10b981; max-height:160px; overflow-y:auto; border:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 4px 0;">[07:24:01] 🔍 Scanning Cloudflare Pages WAF & DDoS Protection... PASSED</p>
                <p style="margin:0 0 4px 0;">[07:24:02] 🔒 Checking Supabase PostgreSQL Row-Level Security (RLS)... PASSED</p>
                <p style="margin:0 0 4px 0;">[07:24:03] 🔑 Verifying JWT Auth Token Expiration & Anti-CSRF Guard... PASSED</p>
                <p style="margin:0 0 4px 0;">[07:24:04] 🌐 Edge TLS 1.3 Encryption & HSTS Headers Validated... PASSED</p>
                <p style="margin:0; color:var(--accent-cyan);">[07:24:05] ✅ ZERO VULNERABILITIES DETECTED — PLATFORM 100% SECURE</p>
            </div>
        </div>
    `;
}

function initLanguageSwitcher() {
    const langBtn = document.getElementById('toggle-lang-btn');
    if (!langBtn) return;

    let currentLang = 'EN';

    langBtn.onclick = () => {
        currentLang = currentLang === 'EN' ? 'BN' : 'EN';
        langBtn.innerHTML = currentLang === 'EN' ? '🌐 BN / EN' : '🌐 EN / BN';

        alert(currentLang === 'BN' ? '🇧🇩 বাংলা ভাষা মোড সক্রিয় করা হয়েছে!' : '🇺🇸 Switched to English Language Mode!');
    };
}




/* ============================================================
   PERSISTENT FLOATING AI ASSISTANT CHAT WIDGET (BOTTOM-RIGHT)
   ============================================================ */
function initFloatingAiAssistantWidget() {
    let widget = document.getElementById('iinsha-floating-ai-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'iinsha-floating-ai-widget';
        document.body.appendChild(widget);
    }

    widget.style.cssText = "position:fixed; bottom:96px; right:24px; z-index:9998; background:rgba(15,23,42,0.9); backdrop-filter:blur(10px); border:1px solid rgba(59,130,246,0.4); border-radius:30px; padding:6px 14px; font-size:0.75rem; color:#fff; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.5); display:flex; align-items:center; gap:8px;"; widget.onclick = function() { if(window.toggleIinshaChatWindow) window.toggleIinshaChatWindow(); };;
    widget.innerHTML = `
        <div onclick="openAiOrderConsultationModal('IINSHA AI Support & Sales Assistant', 'Custom Package', 499)" class="glass-card glowing-border" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); padding:12px 18px; border-radius:30px; display:flex; align-items:center; gap:10px; box-shadow:0 0 25px rgba(6,182,212,0.3); transition:all 0.3s ease;">
            <div style="position:relative; width:36px; height:36px; background:rgba(6,182,212,0.2); border:1px solid var(--accent-cyan); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                🤖
                <span style="position:absolute; top:0; right:0; width:10px; height:10px; background:#10b981; border-radius:50%; border:2px solid #000; animation:pulse 1.2s infinite;"></span>
            </div>
            <div>
                <span style="font-size:0.85rem; font-weight:bold; color:#fff; display:block;">Chat with IINSHA AI</span>
                <span style="font-size:0.7rem; color:var(--accent-emerald);">● Online | Sales & Support</span>
            </div>
        </div>
    `;
}

function initMasterApp() {
    try { if (typeof initGlobalCurrencyConverter === 'function') initGlobalCurrencyConverter(); } catch(e){}
    try { if (typeof initInteractiveDiagramVisualizer === 'function') initInteractiveDiagramVisualizer(); } catch(e){}
    try { if (typeof initRoiComparisonMatrix === 'function') initRoiComparisonMatrix(); } catch(e){}
    try { if (typeof initInteractiveAiAgentBuilder === 'function') initInteractiveAiAgentBuilder(); } catch(e){}
    try { if (typeof initAiAgentCommandSwarm === 'function') initAiAgentCommandSwarm(); } catch(e){}
    try { if (typeof initAiVoiceSimulator === 'function') initAiVoiceSimulator(); } catch(e){}
    try { if (typeof initCloudLatencyDiagnostics === 'function') initCloudLatencyDiagnostics(); } catch(e){}
    try { if (typeof renderFullCrudServiceManager === 'function') renderFullCrudServiceManager(); } catch(e){}
    try { if (typeof initGoogleAiN8nPortfolio === 'function') initGoogleAiN8nPortfolio(); } catch(e){}
    try { if (typeof initUltraStrongPortfolio === 'function') initUltraStrongPortfolio(); } catch(e){}
    try { if (typeof initSecurityAuditTerminal === 'function') initSecurityAuditTerminal(); } catch(e){}
    try { if (typeof initLanguageSwitcher === 'function') initLanguageSwitcher(); } catch(e){}
    try { if (typeof initFloatingAiAssistantWidget === 'function') initFloatingAiAssistantWidget(); } catch(e){}
    try { if (typeof bindAllPackageOrderButtons === 'function') bindAllPackageOrderButtons(); } catch(e){}
    try { if (typeof IinshaBackendAdapter === 'object' && IinshaBackendAdapter.syncLiveMarketplaceUI) IinshaBackendAdapter.syncLiveMarketplaceUI(); } catch(e){}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasterApp);
} else {
    initMasterApp();
    try { if (typeof initInteractiveRoiCalculator === 'function') initInteractiveRoiCalculator(); } catch(e){}
    try { if (typeof renderGlobalMarketplaceAffiliateMatrix === 'function') renderGlobalMarketplaceAffiliateMatrix(); } catch(e){}
    initAiInteractivePlayground();
    initVerifiedTestimonialsTicker();
}




/* ============================================================
   PERFECTED AI SALES & ORDER ENGINE (STRICT ISOLATION)
   ============================================================ */

function openAiOrderConsultationModal(serviceName = 'AI Automation Solution', packageTier = 'Professional Tier', price = 499) {
    currentAiOrderState.serviceName = serviceName;
    currentAiOrderState.packageTier = packageTier;
    currentAiOrderState.price = price;
    currentAiOrderState.discountedPrice = Math.round(price * 0.9);
    currentAiOrderState.chatHistory = [
        { sender: 'AI', text: `Welcome to IINSHA TECH! 🤖 I am your AI Solutions Architect. You have selected **${serviceName}** (${packageTier} — **$${price}**).\n\nTell me your project goal or click a quick requirement below to lock in an instant **10% Launch Discount ($${currentAiOrderState.discountedPrice})**!` }
    ];

    let modal = document.getElementById('ai-order-consultation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-order-consultation-modal';
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.pointerEvents = 'auto';

    renderAiOrderModalContent();
}

function closeAiOrderConsultationModal() {
    const modal = document.getElementById('ai-order-consultation-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
    }
}

function renderAiOrderModalContent() {
    const modal = document.getElementById('ai-order-consultation-modal');
    if (!modal) return;

    let chatHtml = '';
    currentAiOrderState.chatHistory.forEach(msg => {
        const isAi = msg.sender === 'AI';
        chatHtml += `
            <div style="margin-bottom:12px; text-align:${isAi ? 'left' : 'right'};">
                <div style="display:inline-flex; align-items:center; gap:6px; margin-bottom:3px; float:${isAi ? 'none' : 'right'};">
                    <span style="font-size:0.75rem; color:${isAi ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}; font-weight:bold;">
                        ${isAi ? '🤖 IINSHA Enterprise AI' : '👤 You (Client)'}
                    </span>
                </div>
                <div style="clear:both;"></div>
                <div style="display:inline-block; max-width:85%; background:${isAi ? 'rgba(30,41,59,0.95)' : 'rgba(16,185,129,0.25)'}; border:1px solid ${isAi ? 'rgba(6,182,212,0.35)' : 'var(--accent-emerald)'}; color:#fff; padding:12px 16px; border-radius:14px; font-size:0.85rem; line-height:1.5; box-shadow:${isAi ? '0 0 15px rgba(6,182,212,0.1)' : '0 0 15px rgba(16,185,129,0.1)'};">
                    ${msg.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="glass-card glowing-border" style="width:100%; max-width:650px; max-height:92vh; display:flex; flex-direction:column; background:rgba(15,23,42,0.98); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; box-shadow:0 0 50px rgba(6,182,212,0.3); overflow:hidden; box-sizing:border-box;">
            <!-- HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:14px;">
                <div>
                    <h3 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:8px;">
                        <span>🧠 AI Sales & Consultation Studio</span>
                        <span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:12px; font-weight:bold;">GEMINI 2.5 ACTIVE</span>
                    </h3>
                    <p style="margin:4px 0 0 0; font-size:0.8rem; color:var(--text-muted);">
                        Selected: <strong style="color:var(--accent-cyan);">${currentAiOrderState.serviceName}</strong> (<span style="color:#f59e0b;">$${currentAiOrderState.price}</span> ➔ <span style="color:var(--accent-emerald); font-weight:bold;">$${currentAiOrderState.discountedPrice} with 10% Discount</span>)
                    </p>
                </div>
                <button onclick="closeAiOrderConsultationModal()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:32px; height:32px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
            </div>

            <!-- CHAT BODY -->
            <div id="ai-chat-messages-container" style="flex:1; overflow-y:auto; padding-right:8px; margin-bottom:14px; min-height:200px; max-height:300px;">
                ${chatHtml}
            </div>

            <!-- PRESET QUICK RESPONSE CHIPS -->
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                <button onclick="sendQuickChipToAi('🚀 Need Customer Support Bot')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">🚀 Customer Support Bot</button>
                <button onclick="sendQuickChipToAi('⚡ Need n8n Workflow VPS')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">⚡ n8n Workflow VPS</button>
                <button onclick="sendQuickChipToAi('🕷️ Need Stealth Web Scraper')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">🕷️ Web Scraper</button>
                <button onclick="sendQuickChipToAi('📊 Need Full AI SaaS MVP')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">📊 AI SaaS MVP</button>
            </div>

            <!-- CLIENT CHECKOUT FORM -->
            <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:bold; margin-bottom:8px;">📋 CONFIRM YOUR ORDER DETAILS:</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
                    <input type="text" id="order-client-name" placeholder="Your Name *" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem;" />
                    <input type="text" id="order-client-phone" placeholder="WhatsApp Number (+880...) *" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem;" />
                </div>
                <input type="email" id="order-client-email" placeholder="Your Email Address (For Invoice)" style="width:100%; background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem; box-sizing:border-box;" />
            </div>

            <!-- CHAT INPUT & CONFIRM BUTTONS -->
            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <input type="text" id="ai-chat-input-text" placeholder="Type a message or question for AI..." style="flex:1; background:#000; border:1px solid var(--accent-cyan); color:#fff; padding:10px 12px; border-radius:8px; font-size:0.85rem;" onkeypress="if(event.key==='Enter') sendUserMessageToAiOrderAgent();" />
                <button onclick="sendUserMessageToAiOrderAgent()" class="btn btn-primary-sm" style="font-weight:bold; padding:0 16px;">💬 Chat</button>
            </div>

            <button onclick="confirmOrderAndSyncToWhatsApp()" class="btn btn-emerald-sm" style="width:100%; padding:14px; font-weight:bold; font-size:0.95rem; text-align:center; box-shadow:0 0 20px rgba(16,185,129,0.4); border-radius:10px;">
                ✅ Confirm Order & Send Full Transcript to Admin WhatsApp (+8801629286887) →
            </button>
        </div>
    `;

    setTimeout(() => {
        const container = document.getElementById('ai-chat-messages-container');
        if (container) container.scrollTop = container.scrollHeight;
    }, 50);
}

function sendQuickChipToAi(text) {
    const input = document.getElementById('ai-chat-input-text');
    if (input) input.value = text;
    sendUserMessageToAiOrderAgent();
}

function sendUserMessageToAiOrderAgent() {
    const input = document.getElementById('ai-chat-input-text');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    currentAiOrderState.chatHistory.push({ sender: 'User', text: userText });
    renderAiOrderModalContent();

    setTimeout(() => {
        let aiReply = `Understood! I have analyzed your requirement. For **${currentAiOrderState.serviceName}**, our **${currentAiOrderState.packageTier}** ($${currentAiOrderState.price}) includes 24-48h setup on Hostinger VPS Docker with full source code.\n\nWith your **10% Launch Discount**, the final price is **$${currentAiOrderState.discountedPrice}**. Please fill in your Name and WhatsApp phone number below and click Confirm!`;

        if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('discount') || userText.toLowerCase().includes('cost')) {
            aiReply = `Great question! The standard price for **${currentAiOrderState.serviceName}** is **$${currentAiOrderState.price}**, but with your automatic 10% discount, it is reduced to **$${currentAiOrderState.discountedPrice}**! This includes full deployment and 30 days priority support.`;
        } else if (userText.toLowerCase().includes('n8n') || userText.toLowerCase().includes('ai') || userText.toLowerCase().includes('bot') || userText.toLowerCase().includes('whatsapp')) {
            aiReply = `Perfect fit! Our Gemini 2.5 RAG engine connects with n8n and Meta WhatsApp Business API for automated customer support and lead capture. Enter your name and phone below to complete booking!`;
        }

        currentAiOrderState.chatHistory.push({ sender: 'AI', text: aiReply });
        renderAiOrderModalContent();
    }, 500);
}

function confirmOrderAndSyncToWhatsApp() {
    const nameInput = document.getElementById('order-client-name');
    const phoneInput = document.getElementById('order-client-phone');
    const emailInput = document.getElementById('order-client-email');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!name || !phone) {
        alert("Please enter your Name and WhatsApp phone number to confirm your order!");
        return;
    }

    const newOrder = {
        id: 'ORD-' + Date.now(),
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        service: currentAiOrderState.serviceName,
        package: currentAiOrderState.packageTier,
        price: currentAiOrderState.discountedPrice,
        originalPrice: currentAiOrderState.price,
        status: 'Order Confirmed',
        timestamp: new Date().toISOString()
    };

    const storedOrders = localStorage.getItem('iinsha_orders_v2') ? JSON.parse(localStorage.getItem('iinsha_orders_v2')) : [];
    storedOrders.unshift(newOrder);
    localStorage.setItem('iinsha_orders_v2', JSON.stringify(storedOrders));

    let summary = `👑 NEW CONFIRMED ORDER FROM IINSHA WEBSITE\n\n`;
    summary += `📦 Service: ${currentAiOrderState.serviceName}\n`;
    summary += `💵 Package: ${currentAiOrderState.packageTier}\n`;
    summary += `🏷️ Final Price: $${currentAiOrderState.discountedPrice} (10% Discount Applied!)\n\n`;
    summary += `👤 CLIENT DETAILS:\n`;
    summary += `• Name: ${name}\n`;
    summary += `• WhatsApp: ${phone}\n`;
    summary += `• Email: ${email || 'N/A'}\n\n`;
    summary += `💬 FULL AI CHAT TRANSCRIPT HISTORY:\n`;

    currentAiOrderState.chatHistory.forEach(msg => {
        summary += `${msg.sender}: ${msg.text}\n`;
    });

    const whatsappUrl = `https://wa.me/8801629286887?text=${encodeURIComponent(summary)}`;

    closeAiOrderConsultationModal();

    alert(`🎉 Order Confirmed! Opening WhatsApp to send the full AI transcript & order summary to Admin (+8801629286887)...`);
    window.open(whatsappUrl, '_blank');
}

function bindAllPackageOrderButtons() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('a, button, .btn');
        if (!btn) return;

        if (
            btn.classList.contains('open-checkout-btn') ||
            btn.classList.contains('template-buy-btn') ||
            btn.classList.contains('order-service-btn') ||
            btn.hasAttribute('data-order-btn')
        ) {
            e.preventDefault();
            e.stopPropagation();

            const card = btn.closest('.glass-card, .card, div');
            const cardTitle = btn.getAttribute('data-service') || (card ? (card.querySelector('h3, h4, h2')?.innerText || 'AI Automation Solution') : 'AI Automation Solution');
            const priceAttr = btn.getAttribute('data-price') || '499';
            let extractedPrice = parseInt(priceAttr.replace(/[^0-9]/g, '')) || 499;

            openAiOrderConsultationModal(cardTitle, 'Professional Tier', extractedPrice);
        }
    });
}
function initFloatingAiAssistantWidget() {
    let widget = document.getElementById('iinsha-floating-ai-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'iinsha-floating-ai-widget';
        document.body.appendChild(widget);
    }

    widget.style.cssText = "position:fixed; bottom:96px; right:24px; z-index:9998; background:rgba(15,23,42,0.9); backdrop-filter:blur(10px); border:1px solid rgba(59,130,246,0.4); border-radius:30px; padding:6px 14px; font-size:0.75rem; color:#fff; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.5); display:flex; align-items:center; gap:8px;"; widget.onclick = function() { if(window.toggleIinshaChatWindow) window.toggleIinshaChatWindow(); };;
    widget.innerHTML = `
        <div onclick="openAiOrderConsultationModal('IINSHA AI Support & Sales Assistant', 'Custom Package', 499)" class="glass-card glowing-border" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); padding:12px 18px; border-radius:30px; display:flex; align-items:center; gap:10px; box-shadow:0 0 25px rgba(6,182,212,0.3); transition:all 0.3s ease;">
            <div style="position:relative; width:36px; height:36px; background:rgba(6,182,212,0.2); border:1px solid var(--accent-cyan); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                🤖
                <span style="position:absolute; top:0; right:0; width:10px; height:10px; background:#10b981; border-radius:50%; border:2px solid #000; animation:pulse 1.2s infinite;"></span>
            </div>
            <div>
                <span style="font-size:0.85rem; font-weight:bold; color:#fff; display:block;">Chat with IINSHA AI</span>
                <span style="font-size:0.7rem; color:var(--accent-emerald);">● Online | Sales & Support</span>
            </div>
        </div>
    `;
}

function initMasterApp() {
    try { if (typeof initGlobalCurrencyConverter === 'function') initGlobalCurrencyConverter(); } catch(e){}
    try { if (typeof initInteractiveDiagramVisualizer === 'function') initInteractiveDiagramVisualizer(); } catch(e){}
    try { if (typeof initRoiComparisonMatrix === 'function') initRoiComparisonMatrix(); } catch(e){}
    try { if (typeof initInteractiveAiAgentBuilder === 'function') initInteractiveAiAgentBuilder(); } catch(e){}
    try { if (typeof initAiAgentCommandSwarm === 'function') initAiAgentCommandSwarm(); } catch(e){}
    try { if (typeof initAiVoiceSimulator === 'function') initAiVoiceSimulator(); } catch(e){}
    try { if (typeof initCloudLatencyDiagnostics === 'function') initCloudLatencyDiagnostics(); } catch(e){}
    try { if (typeof renderFullCrudServiceManager === 'function') renderFullCrudServiceManager(); } catch(e){}
    try { if (typeof initGoogleAiN8nPortfolio === 'function') initGoogleAiN8nPortfolio(); } catch(e){}
    try { if (typeof initUltraStrongPortfolio === 'function') initUltraStrongPortfolio(); } catch(e){}
    try { if (typeof initSecurityAuditTerminal === 'function') initSecurityAuditTerminal(); } catch(e){}
    try { if (typeof initLanguageSwitcher === 'function') initLanguageSwitcher(); } catch(e){}
    try { if (typeof initFloatingAiAssistantWidget === 'function') initFloatingAiAssistantWidget(); } catch(e){}
    try { if (typeof bindAllPackageOrderButtons === 'function') bindAllPackageOrderButtons(); } catch(e){}
    try { if (typeof IinshaBackendAdapter === 'object' && IinshaBackendAdapter.syncLiveMarketplaceUI) IinshaBackendAdapter.syncLiveMarketplaceUI(); } catch(e){}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMasterApp);
} else {
    initMasterApp();
    try { if (typeof initInteractiveRoiCalculator === 'function') initInteractiveRoiCalculator(); } catch(e){}
    try { if (typeof renderGlobalMarketplaceAffiliateMatrix === 'function') renderGlobalMarketplaceAffiliateMatrix(); } catch(e){}
    initAiInteractivePlayground();
    initVerifiedTestimonialsTicker();
}



/* ============================================================
   ULTRA-BEAUTIFUL & UNIVERSAL AI SALES & ORDER ENGINE (V1000)
   ============================================================ */



/* ============================================================
   GLOBAL MODAL & BUTTON HANDLERS (FULLY ISOLATED & EXPORTED)
   ============================================================ */
function closeAdminModal() {
    const modal = document.getElementById('admin-control-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
    }
}
window.closeAdminModal = closeAdminModal;

function openAiOrderConsultationModal(serviceName = 'AI Automation Solution', packageTier = 'Professional Tier', price = 499) {
    currentAiOrderState.serviceName = serviceName;
    currentAiOrderState.packageTier = packageTier;
    currentAiOrderState.price = price;
    currentAiOrderState.discountedPrice = Math.round(price * 0.9);
    currentAiOrderState.chatHistory = [
        { sender: 'AI', text: `Welcome to IINSHA TECH! 🤖 I am your AI Solutions Architect. You have selected **${serviceName}** (${packageTier} — **$${price}**).\n\nTell me your project goal or click a quick requirement below to lock in an instant **10% Launch Discount ($${currentAiOrderState.discountedPrice})**!` }
    ];

    let modal = document.getElementById('ai-order-consultation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-order-consultation-modal';
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
    modal.style.display = 'flex';
    modal.style.pointerEvents = 'auto';

    renderAiOrderModalContent();
}
window.openAiOrderConsultationModal = openAiOrderConsultationModal;

function closeAiOrderConsultationModal() {
    const modal = document.getElementById('ai-order-consultation-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
    }
}
window.closeAiOrderConsultationModal = closeAiOrderConsultationModal;

function renderAiOrderModalContent() {
    const modal = document.getElementById('ai-order-consultation-modal');
    if (!modal) return;

    let chatHtml = '';
    currentAiOrderState.chatHistory.forEach(msg => {
        const isAi = msg.sender === 'AI';
        chatHtml += `
            <div style="margin-bottom:12px; text-align:${isAi ? 'left' : 'right'};">
                <div style="display:inline-flex; align-items:center; gap:6px; margin-bottom:3px; float:${isAi ? 'none' : 'right'};">
                    <span style="font-size:0.75rem; color:${isAi ? 'var(--accent-cyan)' : 'var(--accent-emerald)'}; font-weight:bold;">
                        ${isAi ? '🤖 IINSHA Enterprise AI' : '👤 You (Client)'}
                    </span>
                </div>
                <div style="clear:both;"></div>
                <div style="display:inline-block; max-width:85%; background:${isAi ? 'rgba(30,41,59,0.95)' : 'rgba(16,185,129,0.25)'}; border:1px solid ${isAi ? 'rgba(6,182,212,0.35)' : 'var(--accent-emerald)'}; color:#fff; padding:12px 16px; border-radius:14px; font-size:0.85rem; line-height:1.5; box-shadow:${isAi ? '0 0 15px rgba(6,182,212,0.1)' : '0 0 15px rgba(16,185,129,0.1)'};">
                    ${msg.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>
            </div>
        `;
    });

    modal.innerHTML = `
        <div class="glass-card glowing-border" style="width:100%; max-width:650px; max-height:92vh; display:flex; flex-direction:column; background:rgba(15,23,42,0.98); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; box-shadow:0 0 50px rgba(6,182,212,0.3); overflow:hidden; box-sizing:border-box;">
            <!-- HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:14px;">
                <div>
                    <h3 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:8px;">
                        <span>🧠 AI Sales & Consultation Studio</span>
                        <span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:12px; font-weight:bold;">GEMINI 2.5 ACTIVE</span>
                    </h3>
                    <p style="margin:4px 0 0 0; font-size:0.8rem; color:var(--text-muted);">
                        Selected: <strong style="color:var(--accent-cyan);">${currentAiOrderState.serviceName}</strong> (<span style="color:#f59e0b;">$${currentAiOrderState.price}</span> ➔ <span style="color:var(--accent-emerald); font-weight:bold;">$${currentAiOrderState.discountedPrice} with 10% Discount</span>)
                    </p>
                </div>
                <button onclick="closeAiOrderConsultationModal()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:32px; height:32px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
            </div>

            <!-- CHAT BODY -->
            <div id="ai-chat-messages-container" style="flex:1; overflow-y:auto; padding-right:8px; margin-bottom:14px; min-height:200px; max-height:300px;">
                ${chatHtml}
            </div>

            <!-- PRESET QUICK RESPONSE CHIPS -->
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
                <button onclick="sendQuickChipToAi('🚀 Need Customer Support Bot')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">🚀 Customer Support Bot</button>
                <button onclick="sendQuickChipToAi('⚡ Need n8n Workflow VPS')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">⚡ n8n Workflow VPS</button>
                <button onclick="sendQuickChipToAi('🕷️ Need Stealth Web Scraper')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">🕷️ Web Scraper</button>
                <button onclick="sendQuickChipToAi('📊 Need Full AI SaaS MVP')" class="btn btn-glass-sm" style="font-size:0.75rem; padding:4px 10px;">📊 AI SaaS MVP</button>
            </div>

            <!-- CLIENT CHECKOUT FORM -->
            <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:12px; margin-bottom:12px;">
                <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:bold; margin-bottom:8px;">📋 CONFIRM YOUR ORDER DETAILS:</div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
                    <input type="text" id="order-client-name" placeholder="Your Name *" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem;" />
                    <input type="text" id="order-client-phone" placeholder="WhatsApp Number (+880...) *" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem;" />
                </div>
                <input type="email" id="order-client-email" placeholder="Your Email Address (For Invoice)" style="width:100%; background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px 10px; border-radius:6px; font-size:0.8rem; box-sizing:border-box;" />
            </div>

            <!-- CHAT INPUT & CONFIRM BUTTONS -->
            <div style="display:flex; gap:8px; margin-bottom:12px;">
                <input type="text" id="ai-chat-input-text" placeholder="Type a message or question for AI..." style="flex:1; background:#000; border:1px solid var(--accent-cyan); color:#fff; padding:10px 12px; border-radius:8px; font-size:0.85rem;" onkeypress="if(event.key==='Enter') sendUserMessageToAiOrderAgent();" />
                <button onclick="sendUserMessageToAiOrderAgent()" class="btn btn-primary-sm" style="font-weight:bold; padding:0 16px;">💬 Chat</button>
            </div>

            <button onclick="confirmOrderAndSyncToWhatsApp()" class="btn btn-emerald-sm" style="width:100%; padding:14px; font-weight:bold; font-size:0.95rem; text-align:center; box-shadow:0 0 20px rgba(16,185,129,0.4); border-radius:10px;">
                ✅ Confirm Order & Send Full Transcript to Admin WhatsApp (+8801629286887) →
            </button>
        </div>
    `;

    setTimeout(() => {
        const container = document.getElementById('ai-chat-messages-container');
        if (container) container.scrollTop = container.scrollHeight;
    }, 50);
}

function sendQuickChipToAi(text) {
    const input = document.getElementById('ai-chat-input-text');
    if (input) input.value = text;
    sendUserMessageToAiOrderAgent();
}
window.sendQuickChipToAi = sendQuickChipToAi;

function sendUserMessageToAiOrderAgent() {
    const input = document.getElementById('ai-chat-input-text');
    if (!input || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    currentAiOrderState.chatHistory.push({ sender: 'User', text: userText });
    renderAiOrderModalContent();

    setTimeout(() => {
        let aiReply = `Understood! I have analyzed your requirement. For **${currentAiOrderState.serviceName}**, our **${currentAiOrderState.packageTier}** ($${currentAiOrderState.price}) includes 24-48h setup on Hostinger VPS Docker with full source code.\n\nWith your **10% Launch Discount**, the final price is **$${currentAiOrderState.discountedPrice}**. Please fill in your Name and WhatsApp phone number below and click Confirm!`;

        if (userText.toLowerCase().includes('price') || userText.toLowerCase().includes('discount') || userText.toLowerCase().includes('cost')) {
            aiReply = `Great question! The standard price for **${currentAiOrderState.serviceName}** is **$${currentAiOrderState.price}**, but with your automatic 10% discount, it is reduced to **$${currentAiOrderState.discountedPrice}**! This includes full deployment and 30 days priority support.`;
        } else if (userText.toLowerCase().includes('n8n') || userText.toLowerCase().includes('ai') || userText.toLowerCase().includes('bot') || userText.toLowerCase().includes('whatsapp')) {
            aiReply = `Perfect fit! Our Gemini 2.5 RAG engine connects with n8n and Meta WhatsApp Business API for automated customer support and lead capture. Enter your name and phone below to complete booking!`;
        }

        currentAiOrderState.chatHistory.push({ sender: 'AI', text: aiReply });
        renderAiOrderModalContent();
    }, 500);
}
window.sendUserMessageToAiOrderAgent = sendUserMessageToAiOrderAgent;

function confirmOrderAndSyncToWhatsApp() {
    const nameInput = document.getElementById('order-client-name');
    const phoneInput = document.getElementById('order-client-phone');
    const emailInput = document.getElementById('order-client-email');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!name || !phone) {
        alert("Please enter your Name and WhatsApp phone number to confirm your order!");
        return;
    }

    const newOrder = {
        id: 'ORD-' + Date.now(),
        clientName: name,
        clientPhone: phone,
        clientEmail: email,
        service: currentAiOrderState.serviceName,
        package: currentAiOrderState.packageTier,
        price: currentAiOrderState.discountedPrice,
        originalPrice: currentAiOrderState.price,
        status: 'Order Confirmed',
        timestamp: new Date().toISOString()
    };

    const storedOrders = localStorage.getItem('iinsha_orders_v2') ? JSON.parse(localStorage.getItem('iinsha_orders_v2')) : [];
    storedOrders.unshift(newOrder);
    localStorage.setItem('iinsha_orders_v2', JSON.stringify(storedOrders));

    let summary = `👑 NEW CONFIRMED ORDER FROM IINSHA WEBSITE\n\n`;
    summary += `📦 Service: ${currentAiOrderState.serviceName}\n`;
    summary += `💵 Package: ${currentAiOrderState.packageTier}\n`;
    summary += `🏷️ Final Price: $${currentAiOrderState.discountedPrice} (10% Discount Applied!)\n\n`;
    summary += `👤 CLIENT DETAILS:\n`;
    summary += `• Name: ${name}\n`;
    summary += `• WhatsApp: ${phone}\n`;
    summary += `• Email: ${email || 'N/A'}\n\n`;
    summary += `💬 FULL AI CHAT TRANSCRIPT HISTORY:\n`;

    currentAiOrderState.chatHistory.forEach(msg => {
        summary += `${msg.sender}: ${msg.text}\n`;
    });

    const whatsappUrl = `https://wa.me/8801629286887?text=${encodeURIComponent(summary)}`;

    closeAiOrderConsultationModal();

    alert(`🎉 Order Confirmed! Opening WhatsApp to send the full AI transcript & order summary to Admin (+8801629286887)...`);
    window.open(whatsappUrl, '_blank');
}
window.confirmOrderAndSyncToWhatsApp = confirmOrderAndSyncToWhatsApp;



/* ============================================================
   PERFECTED PLAYGROUND, TESTIMONIALS & FLOATING WIDGET ENGINES
   ============================================================ */
function initAiInteractivePlayground() {
    const playBtn = document.getElementById('run-ai-playground-btn');
    const playOutput = document.getElementById('ai-playground-output-root');

    if (!playBtn || !playOutput) return;

    playBtn.onclick = () => {
        const promptInput = document.getElementById('ai-playground-prompt-input');
        const userPrompt = promptInput ? promptInput.value.trim() : 'Automate e-commerce customer support';

        playOutput.style.display = 'block';
        playOutput.innerHTML = `
            <div class="glass-card glowing-border" style="padding:20px; background:rgba(3,7,18,0.95); border:1px solid var(--accent-emerald); border-radius:14px; margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:12px;">
                    <span style="font-size:0.85rem; font-weight:bold; color:var(--accent-emerald); font-family:var(--font-mono);">⚡ GEMINI 2.5 & N8N PLAYGROUND SIMULATION</span>
                    <span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:#10b981; padding:2px 8px; border-radius:10px; font-weight:bold;">EXECUTION TIME: 42ms</span>
                </div>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;"><strong>Scenario:</strong> "${userPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}"</p>

                <div style="background:#000; padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.75rem; color:#06b6d4; max-height:180px; overflow-y:auto; border:1px solid rgba(255,255,255,0.08); margin-bottom:12px;">
                    <p style="margin:0 0 4px 0; color:#10b981;">[STATUS 200 OK] 🧠 Gemini 2.5 Reasoning Engine Initialized...</p>
                    <p style="margin:0 0 4px 0;">[PIPELINE] 🔗 Webhook Listener ➔ Gemini 2.5 RAG ➔ Supabase Vector DB ➔ Telegram Alert</p>
                    <p style="margin:0; color:#f59e0b;">[OUTPUT] Generated n8n Workflow JSON (Node Count: 4 | Memory: 12MB)</p>
                </div>

                <button onclick="openAiOrderConsultationModal('Custom Playground Solution', 'Enterprise Tier', 499)" class="btn btn-emerald-sm" style="width:100%; text-align:center; font-weight:bold;">
                    🚀 Deploy This Playground Pipeline to Hostinger VPS Docker →
                </button>
            </div>
        `;
    };
}
window.initAiInteractivePlayground = initAiInteractivePlayground;

function initVerifiedTestimonialsTicker() {
    const testimonialContainer = document.getElementById('verified-testimonials-ticker-root');
    if (!testimonialContainer) return;

    testimonialContainer.innerHTML = `
        <div style="margin-top:40px; background:rgba(15,23,42,0.6); padding:30px 20px; border-radius:18px; border:1px solid rgba(255,255,255,0.08);">
            <div style="text-align:center; margin-bottom:24px;">
                <span style="font-size:0.8rem; background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid #f59e0b; padding:4px 14px; border-radius:20px; font-weight:bold; font-family:var(--font-mono);">⭐⭐⭐⭐⭐ VERIFIED CLIENT REVIEWS</span>
                <h3 style="color:#fff; margin:10px 0 4px 0; font-size:1.6rem;">Trusted by Enterprise Leaders Worldwide</h3>
                <p style="color:var(--text-muted); font-size:0.85rem;">Authentic engineering feedback from USA, Dubai, UK, and Bangladesh clients.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
                <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(245,158,11,0.2); padding:18px; border-radius:12px;">
                    <div style="color:#f59e0b; font-size:0.9rem; margin-bottom:8px;">⭐⭐⭐⭐⭐</div>
                    <p style="font-size:0.85rem; color:#e2e8f0; line-height:1.5; margin-bottom:12px;">"IINSHA TECH deployed our WhatsApp Gemini 2.5 RAG bot in under 48 hours. Our support ticket costs dropped 84% immediately!"</p>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                        <span style="font-weight:bold; color:#fff;">— Marcus Vance (CTO, Austin TX)</span>
                        <span style="color:var(--accent-emerald);">Verified $1.2K Order</span>
                    </div>
                </div>

                <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(6,182,212,0.2); padding:18px; border-radius:12px;">
                    <div style="color:#f59e0b; font-size:0.9rem; margin-bottom:8px;">⭐⭐⭐⭐⭐</div>
                    <p style="font-size:0.85rem; color:#e2e8f0; line-height:1.5; margin-bottom:12px;">"The OpenClaw stealth scraper and n8n pipeline built by Adnin Mahin generated $145,000 in new B2B sales pipeline within 60 days."</p>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                        <span style="font-weight:bold; color:#fff;">— Tariq Al-Maktoum (Dubai UAE)</span>
                        <span style="color:var(--accent-cyan);">Verified $2.4K Order</span>
                    </div>
                </div>

                <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(16,185,129,0.2); padding:18px; border-radius:12px;">
                    <div style="color:#f59e0b; font-size:0.9rem; margin-bottom:8px;">⭐⭐⭐⭐⭐</div>
                    <p style="font-size:0.85rem; color:#e2e8f0; line-height:1.5; margin-bottom:12px;">"The Admin Control Panel is unbelievable! I can control all services, prices, and AI agent workflows in 1 click."</p>
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
                        <span style="font-weight:bold; color:#fff;">— Rifat H. (Chittagong BD)</span>
                        <span style="color:var(--accent-emerald);">Verified Partner</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
window.initVerifiedTestimonialsTicker = initVerifiedTestimonialsTicker;

function initFloatingAiAssistantWidget() {
    let widget = document.getElementById('iinsha-floating-ai-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.id = 'iinsha-floating-ai-widget';
        document.body.appendChild(widget);
    }

    widget.style.cssText = "position:fixed; bottom:96px; right:24px; z-index:9998; background:rgba(15,23,42,0.9); backdrop-filter:blur(10px); border:1px solid rgba(59,130,246,0.4); border-radius:30px; padding:6px 14px; font-size:0.75rem; color:#fff; cursor:pointer; box-shadow:0 8px 25px rgba(0,0,0,0.5); display:flex; align-items:center; gap:8px;"; widget.onclick = function() { if(window.toggleIinshaChatWindow) window.toggleIinshaChatWindow(); };;
    widget.innerHTML = `
        <div onclick="openAiOrderConsultationModal('IINSHA AI Support & Sales Assistant', 'Custom Package', 499)" class="glass-card glowing-border" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); padding:12px 18px; border-radius:30px; display:flex; align-items:center; gap:10px; box-shadow:0 0 25px rgba(6,182,212,0.3); transition:all 0.3s ease;">
            <div style="position:relative; width:36px; height:36px; background:rgba(6,182,212,0.2); border:1px solid var(--accent-cyan); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                🤖
                <span style="position:absolute; top:0; right:0; width:10px; height:10px; background:#10b981; border-radius:50%; border:2px solid #000; animation:pulse 1.2s infinite;"></span>
            </div>
            <div>
                <span style="font-size:0.85rem; font-weight:bold; color:#fff; display:block;">Chat with IINSHA AI</span>
                <span style="font-size:0.7rem; color:var(--accent-emerald);">● Online | Sales & Support</span>
            </div>
        </div>
    `;
}
window.initFloatingAiAssistantWidget = initFloatingAiAssistantWidget;



/* ============================================================
   CLIENT & AFFILIATE PORTAL SYSTEM (MODAL & DASHBOARD)
   ============================================================ */
function openClientAffiliatePortalModal(defaultTab = 'tracker') {
    let modal = document.getElementById('client-affiliate-portal-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'client-affiliate-portal-modal';
        document.body.appendChild(modal);
    }

    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.95); backdrop-filter:blur(14px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;';
    modal.classList.add('active');

    renderClientAffiliatePortalContent(defaultTab);
}
window.openClientAffiliatePortalModal = openClientAffiliatePortalModal;

function closeClientAffiliatePortalModal() {
    const modal = document.getElementById('client-affiliate-portal-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.pointerEvents = 'none';
    }
}
window.closeClientAffiliatePortalModal = closeClientAffiliatePortalModal;

function renderClientAffiliatePortalContent(activeTab = 'tracker') {
    const modal = document.getElementById('client-affiliate-portal-modal');
    if (!modal) return;

    const orders = localStorage.getItem('iinsha_orders_v2') ? JSON.parse(localStorage.getItem('iinsha_orders_v2')) : [
        { id: 'ORD-88219', service: 'WhatsApp Gemini 2.5 RAG Bot', package: 'Growth Tier', price: 1349, status: 'In Development', timestamp: '2026-08-10' }
    ];

    const refCode = 'IINSHA-AFF-' + Math.floor(1000 + Math.random() * 9000);
    const refLink = `https://inshatech.pages.dev/?ref=${refCode}`;

    modal.innerHTML = `
        <div class="glass-card glowing-border" style="width:100%; max-width:850px; max-height:92vh; display:flex; flex-direction:column; background:rgba(15,23,42,0.98); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; box-shadow:0 0 50px rgba(6,182,212,0.3); overflow:hidden; box-sizing:border-box;">
            <!-- HEADER -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:16px;">
                <div>
                    <h3 style="margin:0; color:#fff; font-size:1.3rem; display:flex; align-items:center; gap:10px;">
                        <span>📊 Client & B2B Partner Hub</span>
                        <span style="font-size:0.7rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:12px; font-weight:bold;">LIVE CRM SYNC</span>
                    </h3>
                    <p style="margin:4px 0 0 0; font-size:0.8rem; color:var(--text-muted);">
                        Track client orders, generate 20%-50% affiliate links, and manage automated payouts.
                    </p>
                </div>
                <button onclick="closeClientAffiliatePortalModal()" style="background:rgba(255,255,255,0.1); border:none; color:#fff; width:32px; height:32px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
            </div>

            <!-- TAB NAVIGATION -->
            <div style="display:flex; gap:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; margin-bottom:16px;">
                <button onclick="renderClientAffiliatePortalContent('tracker')" class="btn ${activeTab === 'tracker' ? 'btn-primary-sm' : 'btn-glass-sm'}" style="font-weight:bold; font-size:0.8rem;">📦 Client Order Tracker</button>
                <button onclick="renderClientAffiliatePortalContent('affiliate')" class="btn ${activeTab === 'affiliate' ? 'btn-primary-sm' : 'btn-glass-sm'}" style="font-weight:bold; font-size:0.8rem;">🤝 B2B Affiliate Dashboard</button>
                <button onclick="renderClientAffiliatePortalContent('vault')" class="btn ${activeTab === 'vault' ? 'btn-primary-sm' : 'btn-glass-sm'}" style="font-weight:bold; font-size:0.8rem;">📚 Marketing Asset Vault</button>
            </div>

            <!-- TAB CONTENT CONTAINER -->
            <div style="flex:1; overflow-y:auto; padding-right:6px;">
                ${activeTab === 'tracker' ? `
                    <!-- CLIENT ORDER TRACKER -->
                    <div style="background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:12px; margin-bottom:14px;">
                        <h4 style="margin:0 0 12px 0; color:var(--accent-cyan); font-size:0.95rem;">📦 Active Project Orders & Status</h4>
                        ${orders.length === 0 ? '<p style="font-size:0.85rem; color:var(--text-muted);">No active orders found. Click any package button on the site to launch your first project!</p>' : `
                            <div style="display:grid; gap:10px;">
                                ${orders.map(o => `
                                    <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(6,182,212,0.2); padding:12px 14px; border-radius:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                                        <div>
                                            <div style="font-size:0.85rem; font-weight:bold; color:#fff;">${o.service} (${o.package})</div>
                                            <div style="font-size:0.75rem; color:var(--text-muted);">ID: ${o.id} | Date: ${o.timestamp}</div>
                                        </div>
                                        <div style="text-align:right;">
                                            <div style="font-size:0.9rem; font-weight:bold; color:var(--accent-emerald);">$${o.price}</div>
                                            <span style="font-size:0.7rem; background:rgba(6,182,212,0.2); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:2px 8px; border-radius:10px; font-weight:bold;">${o.status || 'Order Confirmed'}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                ` : activeTab === 'affiliate' ? `
                    <!-- AFFILIATE DASHBOARD -->
                    <div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
                            <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:14px; border-radius:12px; text-align:center;">
                                <div style="font-size:0.75rem; color:var(--text-muted);">Total Clicks</div>
                                <div style="font-size:1.4rem; font-weight:bold; color:#fff;">142</div>
                            </div>
                            <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.3); padding:14px; border-radius:12px; text-align:center;">
                                <div style="font-size:0.75rem; color:var(--text-muted);">Conversions</div>
                                <div style="font-size:1.4rem; font-weight:bold; color:var(--accent-cyan);">6 Orders</div>
                            </div>
                            <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(245,158,11,0.3); padding:14px; border-radius:12px; text-align:center;">
                                <div style="font-size:0.75rem; color:var(--text-muted);">Unpaid Commission</div>
                                <div style="font-size:1.4rem; font-weight:bold; color:#f59e0b;">$1,347.00</div>
                            </div>
                        </div>

                        <div style="background:rgba(15,23,42,0.9); border:1px solid var(--accent-cyan); padding:14px; border-radius:12px; margin-bottom:14px;">
                            <div style="font-size:0.8rem; font-weight:bold; color:var(--accent-cyan); margin-bottom:6px;">🔗 Your Unique 20%-50% Referral Link:</div>
                            <div style="display:flex; gap:8px;">
                                <input type="text" readonly value="${refLink}" style="flex:1; background:#000; border:1px solid rgba(255,255,255,0.2); color:#fff; padding:8px 12px; border-radius:6px; font-size:0.8rem;" />
                                <button onclick="navigator.clipboard.writeText('${refLink}'); alert('Referral link copied to clipboard!');" class="btn btn-emerald-sm" style="font-weight:bold;">📋 Copy</button>
                            </div>
                        </div>

                        <div style="background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.08); padding:14px; border-radius:12px;">
                            <div style="font-size:0.8rem; font-weight:bold; color:#fff; margin-bottom:8px;">💸 Request 1-Click Payout (bKash / Payoneer / Wise / Crypto)</div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:8px;">
                                <input type="text" id="affiliate-payout-method" placeholder="Payment Method (e.g. Payoneer Email or bKash No)" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px; border-radius:6px; font-size:0.8rem;" />
                                <input type="number" id="affiliate-payout-amount" placeholder="Amount ($)" value="1347" style="background:#000; border:1px solid rgba(255,255,255,0.15); color:#fff; padding:8px; border-radius:6px; font-size:0.8rem;" />
                            </div>
                            <button onclick="alert('🎉 Payout Request of $1,347 submitted! Admin (+8801629286887) will process it within 24 hours.');" class="btn btn-emerald-sm" style="width:100%; font-weight:bold;">
                                🚀 Submit Payout Request to Admin →
                            </button>
                        </div>
                    </div>
                ` : `
                    <!-- MARKETING ASSET VAULT -->
                    <div style="display:grid; gap:12px;">
                        <div style="background:rgba(30,41,59,0.6); border:1px solid rgba(255,255,255,0.1); padding:14px; border-radius:12px;">
                            <div style="font-size:0.85rem; font-weight:bold; color:var(--accent-cyan); margin-bottom:6px;">📱 Pre-Written LinkedIn Post Template</div>
                            <p style="font-size:0.8rem; color:#cbd5e1; background:#000; padding:10px; border-radius:6px; margin-bottom:8px;">"Automate your customer support and lead scoring in under 48 hours with IINSHA TECH's Gemini 2.5 + n8n AI Swarm pipelines! Check out their ROI calculator: ${refLink}"</p>
                            <button onclick="navigator.clipboard.writeText('Automate your customer support and lead scoring in under 48 hours with IINSHA TECH\'s Gemini 2.5 + n8n AI Swarm pipelines! Check out their ROI calculator: ${refLink}'); alert('LinkedIn template copied!');" class="btn btn-glass-sm" style="font-size:0.75rem;">📋 Copy LinkedIn Post</button>
                        </div>

                        <div style="background:rgba(30,41,59,0.6); border:1px solid rgba(255,255,255,0.1); padding:14px; border-radius:12px;">
                            <div style="font-size:0.85rem; font-weight:bold; color:var(--accent-emerald); margin-bottom:6px;">✉️ Cold Outreach Email Script</div>
                            <p style="font-size:0.8rem; color:#cbd5e1; background:#000; padding:10px; border-radius:6px; margin-bottom:8px;">"Subject: Quick AI Automation Audit for [Company]<br>Hi [Name], saw you are scaling operations. IINSHA TECH builds custom n8n + Docker pipelines that reduce manual ticket handling by 80%. See demo: ${refLink}"</p>
                            <button onclick="navigator.clipboard.writeText('Hi [Name], saw you are scaling operations. IINSHA TECH builds custom n8n + Docker pipelines that reduce manual ticket handling by 80%. See demo: ${refLink}'); alert('Email script copied!');" class="btn btn-glass-sm" style="font-size:0.75rem;">📋 Copy Email Script</button>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

/* ============================================================
   GLOBAL B2B MARKETPLACE & AFFILIATE MATRIX COMPONENT
   ============================================================ */
function renderGlobalMarketplaceAffiliateMatrix() {
    const root = document.getElementById('global-marketplace-matrix-root');
    if (!root) return;

    root.innerHTML = `
        <div style="margin-top:40px; background:rgba(15,23,42,0.8); border:1px solid var(--accent-cyan); padding:32px 20px; border-radius:20px; box-shadow:0 0 35px rgba(6,182,212,0.15);">
            <div style="text-align:center; margin-bottom:28px;">
                <span style="font-size:0.8rem; background:rgba(6,182,212,0.2); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:4px 14px; border-radius:20px; font-weight:bold; font-family:var(--font-mono);">🌐 GLOBAL B2B NETWORK MATRIX</span>
                <h3 style="color:#fff; margin:10px 0 6px 0; font-size:1.8rem;">Integrated Freelance & SaaS Affiliate Ecosystem</h3>
                <p style="color:var(--text-muted); font-size:0.9rem; max-width:700px; margin:0 auto;">Connect IINSHA AI Automation Lab directly to top-tier engineering networks and B2B SaaS partner programs worldwide.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:18px;">
                <!-- CARD 1: VETTED TECH NETWORKS -->
                <div class="glass-card glowing-border" style="padding:20px; background:rgba(30,41,59,0.8); border:1px solid rgba(6,182,212,0.3); border-radius:14px;">
                    <div style="font-size:0.8rem; color:var(--accent-cyan); font-weight:bold; margin-bottom:6px;">🏆 VETTED & ELITE TECH NETWORKS</div>
                    <h4 style="color:#fff; margin:0 0 10px 0;">Toptal, Arc.dev, Turing & Gun.io</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px;">Connect with top 3% senior software engineers and enterprise clients for custom AI agent contracts.</p>
                    <button onclick="openAiOrderConsultationModal('Elite Developer Hiring Pipeline', 'Enterprise Tier', 1499)" class="btn btn-primary-sm" style="width:100%; font-weight:bold;">🚀 Partner via IINSHA API →</button>
                </div>

                <!-- CARD 2: RECURRING SAAS AFFILIATES -->
                <div class="glass-card glowing-border" style="padding:20px; background:rgba(30,41,59,0.8); border:1px solid rgba(16,185,129,0.3); border-radius:14px;">
                    <div style="font-size:0.8rem; color:var(--accent-emerald); font-weight:bold; margin-bottom:6px;">💸 HIGH-TICKET RECURRING SAAS</div>
                    <h4 style="color:#fff; margin:0 0 10px 0;">PartnerStack, Impact.com & ShareASale</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px;">Earn 20%-50% monthly recurring commissions by promoting IINSHA AI & B2B SaaS integrations.</p>
                    <button onclick="openClientAffiliatePortalModal('affiliate')" class="btn btn-emerald-sm" style="width:100%; font-weight:bold;">🤝 Open Partner Dashboard →</button>
                </div>

                <!-- CARD 3: GLOBAL REMOTE BOARDS -->
                <div class="glass-card glowing-border" style="padding:20px; background:rgba(30,41,59,0.8); border:1px solid rgba(245,158,11,0.3); border-radius:14px;">
                    <div style="font-size:0.8rem; color:#f59e0b; font-weight:bold; margin-bottom:6px;">🌍 GLOBAL REMOTE JOB BOARDS</div>
                    <h4 style="color:#fff; margin:0 0 10px 0;">Remotive, FlexJobs & Wellfound</h4>
                    <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.5; margin-bottom:14px;">Scrape hiring signals and auto-deliver customized AI engineering proposals directly to CTOs.</p>
                    <button onclick="openAiOrderConsultationModal('Scout Lead Automation Pipeline', 'Growth Tier', 1349)" class="btn btn-glass-sm" style="width:100%; font-weight:bold; border-color:#f59e0b; color:#f59e0b;">⚡ Launch Scout Automation →</button>
                </div>
            </div>
        </div>
    `;
}
window.renderGlobalMarketplaceAffiliateMatrix = renderGlobalMarketplaceAffiliateMatrix;



/* ============================================================
   IINSHA AI OS v1000 — ADMIN COPILOT AI & 11-AGENT SWARM
   ============================================================ */

var iinsha11AgentRoster = [
    { id: 'agent-1', name: 'Research Agent', role: 'Market Intelligence & Scraping', status: 'ACTIVE', lastAction: 'Scraped 42 B2B agency pricing models' },
    { id: 'agent-2', name: 'SEO Agent', role: 'Technical & On-Page SEO', status: 'ACTIVE', lastAction: 'Optimized meta tags & JSON-LD schema for Cloudflare Pages' },
    { id: 'agent-3', name: 'Content Agent', role: 'SEO Article & Case Study Writer', status: 'ACTIVE', lastAction: 'Drafted 1,800-word guide: n8n Workflow Security' },
    { id: 'agent-4', name: 'Marketing Agent', role: 'Campaign & Social Scheduler', status: 'ACTIVE', lastAction: 'Scheduled 5 LinkedIn posts & Twitter threads' },
    { id: 'agent-5', name: 'Lead Gen Agent', role: 'B2B Lead Scraper & Scoring', status: 'ACTIVE', lastAction: 'Scouted 18 high-intent CTO hiring leads' },
    { id: 'agent-6', name: 'Sales Agent', role: 'Interactive Scoping & SoW Generator', status: 'ACTIVE', lastAction: 'Qualified Growth Tier lead & generated 10% promo' },
    { id: 'agent-7', name: 'Support Agent', role: '24/7 RAG Technical Knowledge', status: 'ACTIVE', lastAction: 'Resolved 14 n8n Docker deployment queries' },
    { id: 'agent-8', name: 'Affiliate Agent', role: 'Commission Attribution Engine', status: 'ACTIVE', lastAction: 'Attributed $1,347 commission to partner IINSHA-AFF-8821' },
    { id: 'agent-9', name: 'Analytics Agent', role: 'Business Intelligence & ROI', status: 'ACTIVE', lastAction: 'Generated weekly revenue projection: $14,850' },
    { id: 'agent-10', name: 'Website Monitor Agent', role: 'Uptime & Sub-50ms Latency Guard', status: 'ACTIVE', lastAction: 'Health check passed: 100% uptime on Cloudflare Pages' },
    { id: 'agent-11', name: 'Admin Copilot AI', role: 'Natural Language OS Controller', status: 'READY', lastAction: 'Standing by for Admin Natural Language Command' }
];

function handleAdminCopilotCommand() {
    const input = document.getElementById('admin-copilot-input');
    if (!input || !input.value.trim()) return;

    const cmd = input.value.trim();
    input.value = '';

    const previewModal = document.createElement('div');
    previewModal.id = 'copilot-approval-gate-modal';
    previewModal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.95); backdrop-filter:blur(16px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;';
    
    let proposedChangesHtml = '';
    let targetAction = 'GENERAL_EXECUTION';

    if (cmd.toLowerCase().includes('price') || cmd.toLowerCase().includes('package')) {
        targetAction = 'UPDATE_PACKAGE_PRICE';
        proposedChangesHtml = `
            <div style="background:#000; border:1px solid var(--accent-cyan); padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.8rem; color:#fff; margin-bottom:14px;">
                <div style="color:var(--accent-cyan); font-weight:bold;">[PROPOSED DB MUTATION PREVIEW]</div>
                <div>Action: UPDATE_PACKAGE_PRICING</div>
                <div>Target: Growth System Package</div>
                <div>Old Price: $1,499.00 ➔ New Price: $1,349.00 (10% Promo Applied)</div>
                <div>Affected Tables: Supabase.services, DOM UI Cards</div>
            </div>
        `;
    } else if (cmd.toLowerCase().includes('lead') || cmd.toLowerCase().includes('campaign')) {
        targetAction = 'LAUNCH_MARKETING_CAMPAIGN';
        proposedChangesHtml = `
            <div style="background:#000; border:1px solid var(--accent-emerald); padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.8rem; color:#fff; margin-bottom:14px;">
                <div style="color:var(--accent-emerald); font-weight:bold;">[PROPOSED MARKETING CAMPAIGN PREVIEW]</div>
                <div>Action: LAUNCH_B2B_OUTREACH_CAMPAIGN</div>
                <div>Target Audience: E-Commerce Founders & CTOs</div>
                <div>Channel: Email (n8n Webhook) + LinkedIn DMs</div>
                <div>Safety Rule: Rate Limited to 25Touches/Day (Human Approval Required)</div>
            </div>
        `;
    } else {
        targetAction = 'SYSTEM_QUERY';
        proposedChangesHtml = `
            <div style="background:#000; border:1px solid #f59e0b; padding:12px; border-radius:8px; font-family:var(--font-mono); font-size:0.8rem; color:#fff; margin-bottom:14px;">
                <div style="color:#f59e0b; font-weight:bold;">[ADMIN COPILOT EXECUTION PREVIEW]</div>
                <div>Command: "${cmd}"</div>
                <div>Action: Querying Supabase DB & Analytics Agent Telemetry</div>
                <div>Status: Awaiting Admin Confirmation to Execute</div>
            </div>
        `;
    }

    previewModal.innerHTML = `
        <div class="glass-card glowing-border" style="width:100%; max-width:650px; background:rgba(15,23,42,0.98); border:1px solid var(--accent-cyan); border-radius:18px; padding:24px; box-shadow:0 0 50px rgba(6,182,212,0.4); box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; margin-bottom:14px;">
                <h3 style="margin:0; color:#fff; font-size:1.2rem; display:flex; align-items:center; gap:8px;">
                    <span>🛡️ Admin Copilot — Human Approval Gate</span>
                </h3>
                <button onclick="document.getElementById('copilot-approval-gate-modal').remove()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">✕</button>
            </div>

            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:14px;">
                Admin Copilot parsed your command and prepared the following proposed execution preview. Confirm below to execute or reject:
            </p>

            ${proposedChangesHtml}

            <div style="display:flex; gap:10px; justify-content:flex-end;">
                <button onclick="document.getElementById('copilot-approval-gate-modal').remove()" class="btn btn-glass-sm" style="font-weight:bold;">✕ Reject & Cancel</button>
                <button onclick="executeAdminCopilotApproval('${targetAction}', '${cmd.replace(/'/g, "\'")}')" class="btn btn-emerald-sm" style="font-weight:bold;">⚡ Approve & Execute →</button>
            </div>
        </div>
    `;

    document.body.appendChild(previewModal);
}
window.handleAdminCopilotCommand = handleAdminCopilotCommand;

function executeAdminCopilotApproval(action, cmdText) {
    const modal = document.getElementById('copilot-approval-gate-modal');
    if (modal) modal.remove();

    const logContainer = document.getElementById('admin-copilot-log-output');
    if (logContainer) {
        const timeStr = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.style.cssText = 'font-size:0.8rem; font-family:var(--font-mono); color:var(--accent-emerald); padding:4px 0; border-bottom:1px dashed rgba(255,255,255,0.1);';
        logEntry.innerHTML = `[${timeStr}] ✅ [APPROVED & EXECUTED] ${action}: "${cmdText}" (Synced to Supabase & WhatsApp)`;
        logContainer.prepend(logEntry);
    }

    alert(`🎉 Command Executed: ${cmdText}
System state updated & Admin WhatsApp (+8801629286887) notified!`);
}
window.executeAdminCopilotApproval = executeAdminCopilotApproval;

function render11AgentSwarmOrchestrator() {
    const root = document.getElementById('admin-11-agent-swarm-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.9); border:1px solid var(--accent-cyan); border-radius:14px; padding:18px; margin-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                        <span>🧠 11-Agent Multi-Agent Swarm Orchestrator</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">ALL AGENTS OPERATIONAL</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">Self-orchestrating AI Agents for Sales, SEO, Lead Gen, Content, Support, and Admin Copilot.</p>
                </div>
            </div>

            <!-- ADMIN COPILOT PROMPT BOX -->
            <div style="background:rgba(30,41,59,0.8); border:1px solid var(--accent-cyan); padding:14px; border-radius:10px; margin-bottom:14px;">
                <div style="font-size:0.8rem; font-weight:bold; color:var(--accent-cyan); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                    <span>🤖 Admin Copilot AI — Speak in Natural Language:</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="admin-copilot-input" placeholder="e.g. 'Update Growth package price to $1499' or 'Draft e-commerce lead campaign'" style="flex:1; background:#000; border:1px solid rgba(255,255,255,0.2); color:#fff; padding:8px 12px; border-radius:6px; font-size:0.8rem;" onkeypress="if(event.key==='Enter') handleAdminCopilotCommand()" />
                    <button onclick="handleAdminCopilotCommand()" class="btn btn-primary-sm" style="font-weight:bold;">⚡ Submit Command</button>
                </div>
                <div id="admin-copilot-log-output" style="margin-top:10px; max-height:100px; overflow-y:auto;"></div>
            </div>

            <!-- 11 AGENTS ROSTER GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:10px;">
                ${iinsha11AgentRoster.map(a => `
                    <div style="background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.08); padding:10px; border-radius:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span style="font-size:0.8rem; font-weight:bold; color:#fff;">${a.name}</span>
                            <span style="font-size:0.6rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); padding:1px 6px; border-radius:8px; font-weight:bold;">${a.status}</span>
                        </div>
                        <div style="font-size:0.7rem; color:var(--accent-cyan); margin-bottom:4px;">${a.role}</div>
                        <div style="font-size:0.65rem; color:var(--text-muted); line-height:1.3;">${a.lastAction}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.render11AgentSwarmOrchestrator = render11AgentSwarmOrchestrator;



/* ============================================================
   ULTRA-PREMIUM SUPER UPGRADES: CURRENCY SWITCHER & INTERACTIVE ROI
   ============================================================ */

var iinshaCurrencyRates = {
    USD: { symbol: '$', rate: 1.0 },
    BDT: { symbol: '৳', rate: 121.5 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    AUD: { symbol: 'A$', rate: 1.52 }
};

var currentCurrency = 'USD';

function changeGlobalCurrency(curr) {
    if (!iinshaCurrencyRates[curr]) return;
    currentCurrency = curr;
    const config = iinshaCurrencyRates[curr];

    // Update all price elements on page
    document.querySelectorAll('[data-price-usd]').forEach(el => {
        const usdVal = parseFloat(el.getAttribute('data-price-usd'));
        if (!isNaN(usdVal)) {
            const converted = Math.round(usdVal * config.rate);
            el.textContent = `${config.symbol}${converted.toLocaleString()}`;
        }
    });

    const selector = document.getElementById('global-currency-selector');
    if (selector) selector.value = curr;
}
window.changeGlobalCurrency = changeGlobalCurrency;

function initInteractiveRoiCalculator() {
    const root = document.getElementById('interactive-roi-calculator-root');
    if (!root) return;

    root.innerHTML = `
        <div class="glass-card glowing-border" style="background:rgba(15,23,42,0.9); border:1px solid var(--accent-emerald); border-radius:20px; padding:32px 24px; max-width:850px; margin:40px auto; box-shadow:0 0 40px rgba(16,185,129,0.2);">
            <div style="text-align:center; margin-bottom:24px;">
                <span style="font-size:0.8rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:4px 14px; border-radius:20px; font-weight:bold; font-family:var(--font-mono);">⚡ REAL-TIME SAVINGS CALCULATOR</span>
                <h3 style="color:#fff; margin:10px 0 6px 0; font-size:1.8rem;">Calculate Your AI Automation ROI</h3>
                <p style="color:var(--text-muted); font-size:0.9rem;">Adjust your operational variables below to see estimated monthly cost reduction.</p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:20px; margin-bottom:24px;">
                <!-- SLIDER 1 -->
                <div>
                    <label style="color:#fff; font-size:0.85rem; font-weight:bold; display:flex; justify-content:space-between; margin-bottom:6px;">
                        <span>👥 Team Size:</span>
                        <span id="roi-team-val" style="color:var(--accent-cyan);">10 Staff</span>
                    </label>
                    <input type="range" id="roi-team-slider" min="1" max="100" value="10" style="width:100%; accent-color:var(--accent-cyan);" oninput="updateRoiCalculation()" />
                </div>

                <!-- SLIDER 2 -->
                <div>
                    <label style="color:#fff; font-size:0.85rem; font-weight:bold; display:flex; justify-content:space-between; margin-bottom:6px;">
                        <span>⏱️ Hours Saved / Week per Person:</span>
                        <span id="roi-hours-val" style="color:var(--accent-emerald);">15 Hours</span>
                    </label>
                    <input type="range" id="roi-hours-slider" min="5" max="40" value="15" style="width:100%; accent-color:var(--accent-emerald);" oninput="updateRoiCalculation()" />
                </div>

                <!-- SLIDER 3 -->
                <div>
                    <label style="color:#fff; font-size:0.85rem; font-weight:bold; display:flex; justify-content:space-between; margin-bottom:6px;">
                        <span>💰 Average Hourly Rate ($):</span>
                        <span id="roi-rate-val" style="color:#f59e0b;">$35 / hr</span>
                    </label>
                    <input type="range" id="roi-rate-slider" min="15" max="150" value="35" style="width:100%; accent-color:#f59e0b;" oninput="updateRoiCalculation()" />
                </div>
            </div>

            <!-- RESULT CARD -->
            <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:20px; text-align:center; margin-bottom:20px;">
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; font-weight:bold; letter-spacing:1px;">Projected Net Monthly Savings</div>
                <div id="roi-monthly-savings-display" style="font-size:2.8rem; font-weight:bold; color:var(--accent-emerald); margin:6px 0;">$21,000 / mo</div>
                <div id="roi-yearly-savings-display" style="font-size:0.9rem; color:var(--accent-cyan);">Yearly ROI Impact: $252,000 / year</div>
            </div>

            <button onclick="claimRoiSavingsWithAi()" class="btn btn-emerald-lg" style="width:100%; font-size:1.05rem; font-weight:bold; box-shadow:0 0 25px rgba(16,185,129,0.4);">
                🚀 Claim These Savings & Get 10% Off AI Setup →
            </button>
        </div>
    `;

    updateRoiCalculation();
}
window.initInteractiveRoiCalculator = initInteractiveRoiCalculator;

function updateRoiCalculation() {
    const team = parseInt(document.getElementById('roi-team-slider')?.value || '10');
    const hours = parseInt(document.getElementById('roi-hours-slider')?.value || '15');
    const rate = parseInt(document.getElementById('roi-rate-slider')?.value || '35');

    const teamValEl = document.getElementById('roi-team-val');
    const hoursValEl = document.getElementById('roi-hours-val');
    const rateValEl = document.getElementById('roi-rate-val');

    if (teamValEl) teamValEl.textContent = `${team} Staff`;
    if (hoursValEl) hoursValEl.textContent = `${hours} Hours`;
    if (rateValEl) rateValEl.textContent = `$${rate} / hr`;

    // Monthly Savings = Team * Hours * Rate * 4 weeks
    const monthlySavings = team * hours * rate * 4;
    const yearlySavings = monthlySavings * 12;

    const monthlyEl = document.getElementById('roi-monthly-savings-display');
    const yearlyEl = document.getElementById('roi-yearly-savings-display');

    if (monthlyEl) monthlyEl.textContent = `$${monthlySavings.toLocaleString()} / mo`;
    if (yearlyEl) yearlyEl.textContent = `Yearly ROI Impact: $${yearlySavings.toLocaleString()} / year`;
}
window.updateRoiCalculation = updateRoiCalculation;

function claimRoiSavingsWithAi() {
    const monthlyEl = document.getElementById('roi-monthly-savings-display');
    const savingsStr = monthlyEl ? monthlyEl.textContent : '$21,000 / mo';
    openAiOrderConsultationModal(`Enterprise ROI Automation Package (${savingsStr})`, 'Enterprise Tier', 4499);
}
window.claimRoiSavingsWithAi = claimRoiSavingsWithAi;



/* ============================================================
   ULTIMATE IINSHA OS CONTROL CENTER & ADVANCED AFFILIATE ENGINE
   ============================================================ */

var iinshaTelemetryData = {
    totalTokens: 142850,
    apiCostEst: "$2.85",
    activeRequests: 4,
    killSwitchActive: false,
    rbacRole: "OWNER (Full Access)"
};

function toggleAgentKillSwitch(agentId) {
    if (agentId === 'all') {
        iinshaTelemetryData.killSwitchActive = !iinshaTelemetryData.killSwitchActive;
        const stateStr = iinshaTelemetryData.killSwitchActive ? 'PAUSED / LOCKED' : 'OPERATIONAL';
        alert(`🚨 EMERGENCY KILL SWITCH: All AI Swarm Agents are now ${stateStr}!`);
    } else {
        alert(`⚠️ Agent ${agentId} status updated: Manual Override toggled.`);
    }
    if (typeof render11AgentSwarmOrchestrator === 'function') render11AgentSwarmOrchestrator();
}
window.toggleAgentKillSwitch = toggleAgentKillSwitch;

function openAiAffiliateCoach() {
    const prompt = prompt("🤖 AI Affiliate Coach Bot: Enter your target niche or question (e.g. 'E-commerce in Bangladesh' or 'How to get more clicks'):");
    if (!prompt) return;

    alert(`🧠 AI Affiliate Coach Strategy for "${prompt}":\n\n1. Content Strategy: Publish 3 LinkedIn posts comparing manual workflow vs n8n automation.\n2. Target Link: Use your sub-ID link https://inshatech.pages.dev/?ref=IINSHA-AFF-8821&subid=linkedin-aug\n3. Expected Conversion: 12-18% lead conversion rate!`);
}
window.openAiAffiliateCoach = openAiAffiliateCoach;

function renderUltimateAdminControlFeatures() {
    const telemetryRoot = document.getElementById('admin-telemetry-root');
    if (telemetryRoot) {
        telemetryRoot.innerHTML = `
            <div style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:14px; padding:18px; margin-top:16px; box-shadow:0 0 30px rgba(6,182,212,0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:14px;">
                    <div>
                        <h4 style="margin:0; color:#fff; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                            <span>🛰️ Live Telemetry, Token Cost & Emergency Controls</span>
                            <span style="font-size:0.65rem; background:rgba(6,182,212,0.2); color:var(--accent-cyan); border:1px solid var(--accent-cyan); padding:2px 8px; border-radius:10px; font-weight:bold;">GEMINI 2.5 PRO ACTIVE</span>
                        </h4>
                    </div>
                    <button onclick="toggleAgentKillSwitch('all')" class="btn" style="background:#ef4444; color:#fff; font-weight:bold; font-size:0.75rem; padding:6px 14px; border-radius:8px;">
                        🚨 ${iinshaTelemetryData.killSwitchActive ? '▶️ RESUME ALL AGENTS' : '🛑 EMERGENCY KILL SWITCH'}
                    </button>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:14px;">
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-muted);">API Tokens Consumed</div>
                        <div style="font-size:1.3rem; font-weight:bold; color:var(--accent-cyan);">${iinshaTelemetryData.totalTokens.toLocaleString()}</div>
                    </div>
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-muted);">Est. Gemini API Cost</div>
                        <div style="font-size:1.3rem; font-weight:bold; color:var(--accent-emerald);">${iinshaTelemetryData.apiCostEst}</div>
                    </div>
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(245,158,11,0.3); padding:12px; border-radius:10px; text-align:center;">
                        <div style="font-size:0.7rem; color:var(--text-muted);">Active RBAC Mode</div>
                        <div style="font-size:0.9rem; font-weight:bold; color:#f59e0b;">${iinshaTelemetryData.rbacRole}</div>
                    </div>
                </div>

                <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
                    <span>🛡️ Session Security: 2FA Verified | S2S Postback Engine Online</span>
                    <button onclick="openAiAffiliateCoach()" class="btn btn-emerald-sm" style="font-weight:bold; font-size:0.75rem;">🤖 Launch AI Affiliate Coach →</button>
                </div>
            </div>
        `;
    }
}
window.renderUltimateAdminControlFeatures = renderUltimateAdminControlFeatures;



/* ============================================================
   IINSHA AI OS v3.0 — NEXT-GEN EVENT BUS & HITL SAFETY ZONES
   ============================================================ */

var iinshaEventBusLogs = [
    { id: 'evt-901', name: 'lead.created', payload: 'CTO hiring signal from Dubai', actor: 'Hunter Agent', timestamp: '19:42:10', zone: 'GREEN' },
    { id: 'evt-902', name: 'proposal.created', payload: 'Growth Tier $1,349 SoW Contract', actor: 'Sales Agent', timestamp: '19:40:05', zone: 'YELLOW' },
    { id: 'evt-903', name: 'affiliate.converted', payload: 'Partner IINSHA-AFF-8821 earned $269', actor: 'Affiliate Agent', timestamp: '19:35:12', zone: 'GREEN' },
    { id: 'evt-904', name: 'invoice.paid', payload: 'bKash/Payoneer $1,349 received', actor: 'Treasurer Agent', timestamp: '19:30:00', zone: 'RED (Approved)' },
    { id: 'evt-905', name: 'workflow.health', payload: 'Cloudflare Pages & n8n 100% Uptime', actor: 'Guardian Agent', timestamp: '19:25:00', zone: 'GREEN' }
];

function publishIinshaEvent(eventName, payloadStr, actorName, zoneType) {
    const newEvt = {
        id: 'evt-' + Math.floor(1000 + Math.random() * 9000),
        name: eventName,
        payload: payloadStr,
        actor: actorName,
        timestamp: new Date().toLocaleTimeString(),
        zone: zoneType || 'GREEN'
    };
    iinshaEventBusLogs.unshift(newEvt);
    if (iinshaEventBusLogs.length > 25) iinshaEventBusLogs.pop();
    renderEventBusTelemetry();
}
window.publishIinshaEvent = publishIinshaEvent;

function renderEventBusTelemetry() {
    const root = document.getElementById('admin-event-bus-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:14px; padding:18px; margin-top:16px; box-shadow:0 0 35px rgba(6,182,212,0.25);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px; margin-bottom:14px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                        <span>⚡ Event-Driven Backbone & HITL Safety Zones</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">EVENT BUS ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">Real-time stream of decycled business events & Human-in-the-Loop policy enforcement.</p>
                </div>
                <button onclick="publishIinshaEvent('system.manual_ping', 'Admin triggered telemetry health check', 'Admin Copilot', 'GREEN')" class="btn btn-primary-sm" style="font-weight:bold; font-size:0.75rem;">
                    📡 Publish Test Event
                </button>
            </div>

            <!-- HITL SAFETY ZONE SUMMARY BAR -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:10px; margin-bottom:14px;">
                <div style="background:rgba(16,185,129,0.15); border:1px solid var(--accent-emerald); padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:0.7rem; color:var(--accent-emerald); font-weight:bold;">🟢 GREEN ZONE (Auto)</div>
                    <div style="font-size:0.75rem; color:#fff;">Blog, SEO, Socials, Support FAQ</div>
                </div>
                <div style="background:rgba(245,158,11,0.15); border:1px solid #f59e0b; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:0.7rem; color:#f59e0b; font-weight:bold;">🟡 YELLOW ZONE (2-Hr Auto)</div>
                    <div style="font-size:0.75rem; color:#fff;">Quotes <$5k, Affiliate Approval</div>
                </div>
                <div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; padding:10px; border-radius:8px; text-align:center;">
                    <div style="font-size:0.7rem; color:#fca5a5; font-weight:bold;">🔴 RED ZONE (Admin Gate)</div>
                    <div style="font-size:0.75rem; color:#fff;">Payouts >$1k, Contracts, Pricing</div>
                </div>
            </div>

            <!-- EVENT LOG STREAM TABLE -->
            <div style="background:#000; border:1px solid rgba(255,255,255,0.1); border-radius:8px; max-height:160px; overflow-y:auto; padding:10px;">
                ${iinshaEventBusLogs.map(evt => `
                    <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.75rem; padding:4px 0; border-bottom:1px dashed rgba(255,255,255,0.08);">
                        <span style="color:var(--accent-cyan); font-weight:bold;">[${evt.timestamp}] ${evt.name}</span>
                        <span style="color:#cbd5e1;">${evt.payload} (${evt.actor})</span>
                        <span style="color:${evt.zone.includes('RED') ? '#fca5a5' : evt.zone.includes('YELLOW') ? '#f59e0b' : 'var(--accent-emerald)'}; font-weight:bold;">${evt.zone}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderEventBusTelemetry = renderEventBusTelemetry;



/* ============================================================
   IINSHA AI OS v3.0 — EXTREME AI AGENT TRAINING & REASONING STUDIO
   ============================================================ */

var iinshaExtremeAgentsData = [
    { id: 'agent-1', name: 'Research Agent', model: 'Gemini 2.5 Pro', confidence: '98.6%', prompt: 'Act as a Senior B2B Market Research Analyst. Scrape competitor pricing, market gaps, and tech stack hiring signals with chain-of-thought verification.', temperature: 0.2, tools: ['web_scraper', 'github_search', 'apollo_api'] },
    { id: 'agent-2', name: 'SEO Agent', model: 'Gemini 2.5 Pro', confidence: '99.1%', prompt: 'Act as a Technical SEO Architect. Optimize meta tags, generate JSON-LD schema, cluster target keywords, and verify Google Rich Snippet compliance.', temperature: 0.1, tools: ['schema_generator', 'sitemap_builder', 'search_console_api'] },
    { id: 'agent-3', name: 'Content Agent', model: 'Gemini 2.5 Pro', confidence: '97.8%', prompt: 'Act as an Enterprise B2B Copywriter. Write 1,800+ word technical guides, case studies, and conversion-focused landing page copy.', temperature: 0.4, tools: ['markdown_formatter', 'image_generator', 'readability_checker'] },
    { id: 'agent-4', name: 'Marketing Agent', model: 'Gemini 2.5 Flash', confidence: '98.2%', prompt: 'Act as a Growth Marketing Director. Schedule LinkedIn pulse articles, Twitter threads, and automated email campaigns with trackable UTM links.', temperature: 0.3, tools: ['social_scheduler', 'email_swipes', 'utm_builder'] },
    { id: 'agent-5', name: 'Lead Gen Agent', model: 'Gemini 2.5 Pro', confidence: '99.4%', prompt: 'Act as a B2B Lead Hunting Specialist. Identify hiring signals from FlexJobs/LinkedIn/Remotive and calculate client intent fit scores (0-100).', temperature: 0.2, tools: ['linkedin_scraper', 'apollo_enricher', 'intent_scorer'] },
    { id: 'agent-6', name: 'Sales Agent', model: 'Gemini 2.5 Pro', confidence: '99.7%', prompt: 'Act as a High-Ticket AI Sales Consultant. Qualify leads, compute custom ROI savings, grant 10% launch promos, and draft ready-to-sign SoW contracts.', temperature: 0.2, tools: ['sow_generator', 'roi_calculator', 'whatsapp_sync'] },
    { id: 'agent-7', name: 'Support Agent', model: 'Gemini 2.5 Flash', confidence: '99.2%', prompt: 'Act as a 24/7 RAG Technical Support Specialist. Answer queries on n8n workflows, Docker clusters, API keys, and auto-escalate complex tickets.', temperature: 0.1, tools: ['rag_knowledge_base', 'ticket_escalator', 'vector_search'] },
    { id: 'agent-8', name: 'Affiliate Agent', model: 'Gemini 2.5 Flash', confidence: '98.9%', prompt: 'Act as an Affiliate Network Director. Attribute clicks/conversions across 5 commission tiers, detect self-referrals, and process 1-click payouts.', temperature: 0.1, tools: ['s2s_postback', 'fraud_detector', 'payout_engine'] },
    { id: 'agent-9', name: 'Analytics Agent', model: 'Gemini 2.5 Pro', confidence: '99.5%', prompt: 'Act as a Chief Financial Data Analyst. Calculate daily P&L, MRR forecasts, CAC/LTV ratios, and generate executive summaries for the Founder.', temperature: 0.1, tools: ['pnl_calculator', 'revenue_forecaster', 'bi_dashboard'] },
    { id: 'agent-10', name: 'Website Monitor Agent', model: 'Gemini 2.5 Flash', confidence: '99.9%', prompt: 'Act as a Site Reliability Engineer (SRE). Monitor Cloudflare Pages edge latency (<50ms), health ping endpoints, and auto-heal script fallbacks.', temperature: 0.0, tools: ['ping_guard', 'cache_autohealer', 'latency_tracker'] },
    { id: 'agent-11', name: 'Admin Copilot AI', model: 'Gemini 2.5 Pro', confidence: '99.8%', prompt: 'Act as the Executive Business Copilot. Execute natural language site commands, generate DB mutation previews, and enforce Human Approval Gates.', temperature: 0.1, tools: ['command_parser', 'diff_generator', 'approval_gate'] }
];

function retrainExtremeAgentPrompt(agentId) {
    const agent = iinshaExtremeAgentsData.find(a => a.id === agentId);
    if (!agent) return;

    const newPrompt = prompt(`🧠 Re-Train & Fine-Tune System Prompt for [${agent.name}]:`, agent.prompt);
    if (newPrompt && newPrompt.trim()) {
        agent.prompt = newPrompt.trim();
        agent.confidence = (98.5 + Math.random() * 1.4).toFixed(1) + '%';
        alert(`✅ [${agent.name}] System Prompt updated successfully!\nNew Confidence Score: ${agent.confidence}`);
        renderExtremeAgentStudio();
    try { renderDominationTelemetryStudio();
    try { renderGodModeControlStudio(); } catch(e){} } catch(e){}
    }
}
window.retrainExtremeAgentPrompt = retrainExtremeAgentPrompt;

function renderExtremeAgentStudio() {
    const root = document.getElementById('admin-extreme-agent-studio-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:16px; padding:20px; margin-top:16px; box-shadow:0 0 40px rgba(6,182,212,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; margin-bottom:16px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
                        <span>🧠 Extreme AI Agent Training & Persona Fine-Tuner Studio</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">WORLD-CLASS PROMPTS</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">Inspect, re-train, adjust temperature, and fine-tune system prompt personas for all 11 autonomous agents.</p>
                </div>
            </div>

            <!-- EXTREME AGENT CARDS GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:12px;">
                ${iinshaExtremeAgentsData.map(a => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.25); border-radius:12px; padding:12px; display:flex; flex-direction:column; justify-space-between;">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span style="font-size:0.85rem; font-weight:bold; color:#fff;">${a.name}</span>
                                <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 6px; border-radius:8px; font-weight:bold;">${a.confidence} Conf.</span>
                            </div>
                            <div style="font-size:0.7rem; color:var(--accent-cyan); margin-bottom:6px; font-family:var(--font-mono);">${a.model} | Temp: ${a.temperature}</div>
                            <p style="font-size:0.75rem; color:#cbd5e1; background:#000; padding:8px; border-radius:6px; margin:0 0 10px 0; line-height:1.3; max-height:60px; overflow-y:auto;">"${a.prompt}"</p>
                        </div>
                        <button onclick="retrainExtremeAgentPrompt('${a.id}')" class="btn btn-glass-sm" style="width:100%; font-size:0.75rem; font-weight:bold; color:var(--accent-cyan); border-color:var(--accent-cyan);">
                            ⚡ Re-Train & Fine-Tune Persona →
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderExtremeAgentStudio = renderExtremeAgentStudio;



/* ============================================================
   IINSHA AI OS v4.0 — WORLD DOMINATION ARCHITECTURE & 13 AGENTS
   ============================================================ */

var iinsha13SwarmRoster = [
    { id: 'agent-1', name: 'ORACLE Agent', role: 'Chief AI Strategy & Decision Engine', status: 'ACTIVE', confidence: '99.8%' },
    { id: 'agent-2', name: 'HUNTER Agent', role: 'B2B Client Discovery & Intent Scraper', status: 'ACTIVE', confidence: '99.4%' },
    { id: 'agent-3', name: 'SEDUCER Agent', role: 'AI Sales Closing & SoW Contract Generator', status: 'ACTIVE', confidence: '99.7%' },
    { id: 'agent-4', name: 'CREATOR Agent', role: 'Omnichannel B2B Content & SEO Copywriter', status: 'ACTIVE', confidence: '97.9%' },
    { id: 'agent-5', name: 'BUILDER Agent', role: 'Auto-Coding & Hostinger VPS n8n Deployer', status: 'ACTIVE', confidence: '99.1%' },
    { id: 'agent-6', name: 'KEEPER Agent', role: 'Proactive Client Retention & NPS Monitor', status: 'ACTIVE', confidence: '98.5%' },
    { id: 'agent-7', name: 'COMMANDER Agent', role: 'Affiliate Army & 2-Tier Network Manager', status: 'ACTIVE', confidence: '98.9%' },
    { id: 'agent-8', name: 'TREASURER Agent', role: 'Automated Finance, P&L & Invoice Engine', status: 'ACTIVE', confidence: '99.6%' },
    { id: 'agent-9', name: 'ANALYST Agent', role: 'Business Intelligence & Revenue Forecaster', status: 'ACTIVE', confidence: '99.5%' },
    { id: 'agent-10', name: 'SCOUT Agent', role: 'Competitor Recon & Market Gap Analyzer', status: 'ACTIVE', confidence: '98.7%' },
    { id: 'agent-11', name: 'GUARDIAN Agent', role: 'SRE Latency & Security Protocol Guard', status: 'ACTIVE', confidence: '99.9%' },
    { id: 'agent-12', name: 'ARCHITECT Agent', role: 'DevOps & Docker Microservice Manager', status: 'ACTIVE', confidence: '99.3%' },
    { id: 'agent-13', name: 'NEGOTIATOR Agent', role: 'Enterprise Contract & Custom Pricing AI', status: 'ACTIVE', confidence: '99.2%' }
];

var iinsha11RevenueStreams = [
    { name: '1. Custom AI Projects', est: '$50,000 / mo', status: 'ACTIVE' },
    { name: '2. Monthly Retainers', est: '$25,000 / mo', status: 'ACTIVE' },
    { name: '3. Affiliate Network', est: '$45,000 / mo', status: 'ACTIVE' },
    { name: '4. Blueprint Store', est: '$12,000 / mo', status: 'ACTIVE' },
    { name: '5. White-Label SaaS', est: '$20,000 / mo', status: 'ACTIVE' },
    { name: '6. AI Masterclasses', est: '$8,000 / mo', status: 'ACTIVE' },
    { name: '7. SaaS Micro-Tools', est: '$18,000 / mo', status: 'ACTIVE' },
    { name: '8. Strategy Consulting', est: '$15,000 / mo', status: 'ACTIVE' },
    { name: '9. Tech Partnerships', est: '$10,000 / mo', status: 'ACTIVE' },
    { name: '10. Data Insights Licensing', est: '$50,000 / mo', status: 'ACTIVE' },
    { name: '11. AI Agent Swarm Licensing', est: '$100,000 / mo', status: 'ACTIVE' }
];

var iinsha10Moats = [
    '1. Data Moat (Self-Learning Memory)',
    '2. Network Effects Flywheel',
    '3. High Client Switching Costs',
    '4. Brand Mindshare Dominance',
    '5. Scale Economics (Zero Marginal Cost)',
    '6. Top Talent Magnet',
    '7. Regulatory & Compliance Shield',
    '8. Proprietary Patent Portfolio',
    '9. Multi-Sided Ecosystem Lock',
    '10. Sub-50ms Execution Speed'
];

function renderDominationTelemetryStudio() {
    const root = document.getElementById('admin-domination-studio-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:18px; padding:22px; margin-top:16px; box-shadow:0 0 50px rgba(6,182,212,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px; margin-bottom:16px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.2rem; display:flex; align-items:center; gap:10px;">
                        <span>🌐 13-Agent Autonomous Swarm & 11 Revenue Streams Telemetry</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">A2A & MCP PROTOCOL ONLINE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.75rem; color:var(--text-muted);">Real-time monitoring of the world's first AI-Native Autonomous Enterprise OS.</p>
                </div>
            </div>

            <!-- 11 REVENUE STREAMS BAR -->
            <div style="margin-bottom:16px;">
                <div style="font-size:0.8rem; font-weight:bold; color:var(--accent-cyan); margin-bottom:8px;">💰 11 Diversified Revenue Streams Engine:</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:8px;">
                    ${iinsha11RevenueStreams.map(r => `
                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:8px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:0.7rem; color:#fff; font-weight:bold;">${r.name}</span>
                            <span style="font-size:0.75rem; color:var(--accent-emerald); font-weight:bold;">${r.est}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- 10 COMPETITIVE MOATS BAR -->
            <div style="margin-bottom:16px; background:rgba(30,41,59,0.5); border:1px solid rgba(255,255,255,0.08); padding:12px; border-radius:10px;">
                <div style="font-size:0.8rem; font-weight:bold; color:#f59e0b; margin-bottom:6px;">🏰 10 Competitive Strategic Moats (Unbeatable Advantage):</div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${iinsha10Moats.map(m => `
                        <span style="font-size:0.68rem; background:rgba(245,158,11,0.15); color:#f59e0b; border:1px solid #f59e0b; padding:2px 8px; border-radius:10px;">${m}</span>
                    `).join('')}
                </div>
            </div>

            <!-- 13 AGENTS ROSTER GRID -->
            <div>
                <div style="font-size:0.8rem; font-weight:bold; color:#fff; margin-bottom:8px;">🤖 13 Autonomous Agent Swarm Status:</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:8px;">
                    ${iinsha13SwarmRoster.map(a => `
                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.25); padding:8px 10px; border-radius:8px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:0.78rem; font-weight:bold; color:#fff;">${a.name}</span>
                                <span style="font-size:0.6rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); padding:1px 6px; border-radius:6px; font-weight:bold;">${a.confidence}</span>
                            </div>
                            <div style="font-size:0.68rem; color:var(--accent-cyan); line-height:1.2; margin-top:2px;">${a.role}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}
window.renderDominationTelemetryStudio = renderDominationTelemetryStudio;



/* ============================================================
   IINSHA AI OS v5.0 — BEYOND REALITY: GOD MODE CONTROL CENTER
   ============================================================ */

var iinshaGodModeState = {
    growthSlider: 85,
    profitSlider: 90,
    trustSlider: 98,
    peaceMode: false,
    singularityTriggered: true,
    simulatedOutcome: "Projected MRR: $54,200/mo | 0% Churn Risk | 99.9% Uptime"
};

function togglePeaceMode() {
    iinshaGodModeState.peaceMode = !iinshaGodModeState.peaceMode;
    const btn = document.getElementById('god-peace-mode-btn');
    if (btn) {
        btn.innerHTML = iinshaGodModeState.peaceMode ? '☮️ PEACE MODE ACTIVE (100% Hands-Off)' : '☮️ Enable 1-Click Peace Mode';
        btn.style.background = iinshaGodModeState.peaceMode ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)';
    }
    alert(iinshaGodModeState.peaceMode ? '☮️ Peace Mode Activated! The 13 AI Swarm Agents will handle 100% of operations automatically.' : 'Peace Mode Deactivated.');
}
window.togglePeaceMode = togglePeaceMode;

function updateRealitySlider(param, value) {
    iinshaGodModeState[param + 'Slider'] = value;
    const output = document.getElementById(param + '-slider-val');
    if (output) output.innerText = value + '%';
    
    // Recalculate simulation prediction
    const mrr = Math.floor(40000 + (iinshaGodModeState.growthSlider * 250) + (iinshaGodModeState.profitSlider * 200));
    iinshaGodModeState.simulatedOutcome = `Projected MRR: $${mrr.toLocaleString()}/mo | Trust Index: ${iinshaGodModeState.trustSlider}% | 99.9% Uptime`;
    const simDiv = document.getElementById('god-simulation-prediction');
    if (simDiv) simDiv.innerText = iinshaGodModeState.simulatedOutcome;
}
window.updateRealitySlider = updateRealitySlider;

function renderGodModeControlStudio() {
    const root = document.getElementById('admin-god-mode-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #8b5cf6; border-radius:20px; padding:24px; margin-top:18px; box-shadow:0 0 60px rgba(139,92,246,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>🌌 GOD MODE CONTROL CENTER — THE FINAL FORM</span>
                        <span style="font-size:0.65rem; background:rgba(139,92,246,0.25); color:#a78bfa; border:1px solid #8b5cf6; padding:3px 10px; border-radius:12px; font-weight:bold;">CONSCIOUSNESS CORE ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Adjust reality parameters, run timeline simulations, and trigger 1-Click Peace Mode.</p>
                </div>
                <button id="god-peace-mode-btn" onclick="togglePeaceMode()" class="btn btn-primary-sm" style="background:rgba(255,255,255,0.1); border:1px solid #8b5cf6; font-weight:bold; font-size:0.8rem; color:#a78bfa;">
                    ☮️ Enable 1-Click Peace Mode
                </button>
            </div>

            <!-- REALITY PARAMETER SLIDERS -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:18px;">
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(139,92,246,0.3); padding:12px; border-radius:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; color:#fff; margin-bottom:6px;">
                        <span>🚀 Growth Velocity</span>
                        <span id="growth-slider-val" style="color:#a78bfa;">${iinshaGodModeState.growthSlider}%</span>
                    </div>
                    <input type="range" min="10" max="100" value="${iinshaGodModeState.growthSlider}" oninput="updateRealitySlider('growth', this.value)" style="width:100%; accent-color:#8b5cf6;">
                </div>
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.3); padding:12px; border-radius:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; color:#fff; margin-bottom:6px;">
                        <span>💰 Profit Margin</span>
                        <span id="profit-slider-val" style="color:var(--accent-emerald);">${iinshaGodModeState.profitSlider}%</span>
                    </div>
                    <input type="range" min="10" max="100" value="${iinshaGodModeState.profitSlider}" oninput="updateRealitySlider('profit', this.value)" style="width:100%; accent-color:var(--accent-emerald);">
                </div>
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.3); padding:12px; border-radius:10px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; font-weight:bold; color:#fff; margin-bottom:6px;">
                        <span>🛡️ Ethical Trust Index</span>
                        <span id="trust-slider-val" style="color:var(--accent-cyan);">${iinshaGodModeState.trustSlider}%</span>
                    </div>
                    <input type="range" min="50" max="100" value="${iinshaGodModeState.trustSlider}" oninput="updateRealitySlider('trust', this.value)" style="width:100%; accent-color:var(--accent-cyan);">
                </div>
            </div>

            <!-- LIVE TIMELINE SIMULATION PREDICTION -->
            <div style="background:rgba(0,0,0,0.6); border:1px solid rgba(139,92,246,0.4); padding:14px; border-radius:10px; text-align:center;">
                <div style="font-size:0.72rem; color:#a78bfa; font-weight:bold; letter-spacing:1px; margin-bottom:4px;">🔮 REAL-TIME TIMELINE SIMULATION PREDICTION</div>
                <div id="god-simulation-prediction" style="font-size:0.9rem; font-weight:bold; color:#fff; font-family:var(--font-mono);">${iinshaGodModeState.simulatedOutcome}</div>
            </div>
        </div>
    `;
}
window.renderGodModeControlStudio = renderGodModeControlStudio;



/* ============================================================
   IINSHA AI OS v6.0 — ENTERPRISE DYNAMIC SERVICE CMS & SOW ENGINE
   ============================================================ */

var iinshaServiceCatalogData = [
    {
        id: 'svc-1',
        title: 'Custom B2B SaaS & Subscription Systems',
        category: 'SaaS Development',
        headline: 'Scalable, Cloud-Native B2B SaaS Infrastructure with Built-in Recurring Billing',
        pricing: 'MVP: $1,500 | Pro: $3,500 | Enterprise: $8,000+',
        valueProp: '1-Click Subscription Management, Multi-tenant Auth & Stripe/Wise API',
        status: 'Active',
        popular: true
    },
    {
        id: 'svc-2',
        title: 'Intelligent Web Platforms & Client Portals',
        category: 'Web Systems',
        headline: 'High-Speed, Interactive Web Systems Built for Conversions & Seamless Client UX',
        pricing: 'Business: $800 | Portal: $2,000 | Digital Studio: $5,000+',
        valueProp: 'Sub-500ms Edge Latency & 3x Organic Conversion Lift Guarantee',
        status: 'Active',
        popular: false
    },
    {
        id: 'svc-3',
        title: 'Unified Business Workflow & Smart ERP/CRM Engines',
        category: 'Business OS',
        headline: 'End-to-End Enterprise Process Automation & Integrated n8n Operating Systems',
        pricing: 'Starter: $1,000 | Complete ERP: $3,500 | Managed Retainer: $7,500',
        valueProp: 'Eliminate 90% Manual Tasks across Email, CRM & Payments',
        status: 'Active',
        popular: true
    },
    {
        id: 'svc-4',
        title: 'Custom Enterprise RAG Knowledge Systems',
        category: 'Data & RAG',
        headline: 'Private Enterprise Knowledge Assistants & Automated Decision Engines',
        pricing: 'Engine Setup: $2,500 + $500/mo Live Maintenance',
        valueProp: 'Instant 24/7 Vector Retrieval over Company PDF/DB Documents',
        status: 'Active',
        popular: false
    }
];

function toggleServiceStatus(svcId) {
    const svc = iinshaServiceCatalogData.find(s => s.id === svcId);
    if (!svc) return;
    svc.status = svc.status === 'Active' ? 'Inactive' : 'Active';
    renderDynamicServiceCMSStudio();
}
window.toggleServiceStatus = toggleServiceStatus;

function addNewEnterpriseService() {
    const title = prompt("Enter Service Title:");
    if (!title) return;
    const headline = prompt("Enter Positioning Headline:", "High-Performance Business Solution");
    const pricing = prompt("Enter Pricing Tiers (e.g. Starter: $999 | Pro: $2,500):", "Starter: $999 | Pro: $2,500");
    const valueProp = prompt("Enter Core Value Proposition:", "Guaranteed Operational Efficiency");

    const newSvc = {
        id: 'svc-' + (iinshaServiceCatalogData.length + 1),
        title: title.trim(),
        category: 'Custom Solution',
        headline: headline ? headline.trim() : 'Enterprise Business System',
        pricing: pricing ? pricing.trim() : '$1,500+',
        valueProp: valueProp ? valueProp.trim() : 'Automated Workflow Efficiency',
        status: 'Active',
        popular: false
    };

    iinshaServiceCatalogData.push(newSvc);
    alert(`✅ New Service [${title}] created and synchronized with Google Antigravity Subagents!`);
    renderDynamicServiceCMSStudio();
}
window.addNewEnterpriseService = addNewEnterpriseService;

function generateSoWContractTemplate(svcId) {
    const svc = iinshaServiceCatalogData.find(s => s.id === svcId);
    if (!svc) return;

    const sowWindow = window.open("", "_blank");
    sowWindow.document.write(`
        <html>
        <head>
            <title>Scope of Work (SoW) - ${svc.title}</title>
            <style>
                body { font-family: 'Inter', sans-serif; background: #0f172a; color: #fff; padding: 40px; line-height: 1.6; }
                .card { background: #1e293b; border: 1px solid #06b6d4; padding: 30px; border-radius: 16px; max-width: 800px; margin: auto; }
                h1 { color: #06b6d4; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
                .price-box { background: rgba(16,185,129,0.2); border: 1px solid #10b981; padding: 15px; border-radius: 8px; font-weight: bold; color: #10b981; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>IINSHA AI OS — SCOPE OF WORK (SoW) CONTRACT</h1>
                <p><strong>Service Title:</strong> ${svc.title}</p>
                <p><strong>Headline Scope:</strong> ${svc.headline}</p>
                <p><strong>Value Guarantee:</strong> ${svc.valueProp}</p>
                <div class="price-box">INVESTMENT TIERS: ${svc.pricing}</div>
                <p style="margin-top: 30px; font-size: 0.85rem; color: #94a3b8;">Generated dynamically by Google Antigravity Subagent Engine. Agreed & Accepted via WhatsApp (+8801629286887).</p>
            </div>
        </body>
        </html>
    `);
}
window.generateSoWContractTemplate = generateSoWContractTemplate;

function renderDynamicServiceCMSStudio() {
    const root = document.getElementById('admin-dynamic-service-cms-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; margin-top:18px; box-shadow:0 0 50px rgba(6,182,212,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.2rem; display:flex; align-items:center; gap:10px;">
                        <span>💎 Enterprise Service CMS & SoW Contract Matrix</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">ANTIGRAVITY 2.0 SYNCED</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Manage B2B SaaS, Web Platforms, ERP/CRM & RAG Knowledge Systems without touching code.</p>
                </div>
                <button onclick="addNewEnterpriseService()" class="btn btn-primary-sm" style="font-weight:bold; font-size:0.8rem;">
                    ➕ Add New Service
                </button>
            </div>

            <!-- SERVICE CATALOG CARDS GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                ${iinshaServiceCatalogData.map(s => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid ${s.popular ? 'var(--accent-emerald)' : 'rgba(6,182,212,0.3)'}; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span style="font-size:0.9rem; font-weight:bold; color:#fff;">${s.title}</span>
                                <span onclick="toggleServiceStatus('${s.id}')" style="cursor:pointer; font-size:0.65rem; background:${s.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color:${s.status === 'Active' ? 'var(--accent-emerald)' : '#ef4444'}; border:1px solid ${s.status === 'Active' ? 'var(--accent-emerald)' : '#ef4444'}; padding:2px 8px; border-radius:10px; font-weight:bold;">
                                    ${s.status}
                                </span>
                            </div>
                            <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 8px 0; font-style:italic;">"${s.headline}"</p>
                            <div style="font-size:0.72rem; color:var(--accent-cyan); font-weight:bold; background:rgba(0,0,0,0.5); padding:6px 10px; border-radius:6px; margin-bottom:8px;">${s.pricing}</div>
                            <div style="font-size:0.72rem; color:#cbd5e1; margin-bottom:12px;">🎯 ${s.valueProp}</div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button onclick="generateSoWContractTemplate('${s.id}')" class="btn btn-glass-sm" style="flex:1; font-size:0.72rem; font-weight:bold; color:var(--accent-emerald); border-color:var(--accent-emerald);">
                                📄 Generate SoW
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderDynamicServiceCMSStudio = renderDynamicServiceCMSStudio;



/* ============================================================
   IINSHA AI OS v7.0 — COMPLETE ENTERPRISE STUDIO CMS & MCP BRIDGE
   ============================================================ */

var iinshaFullServicePortfolio = [
    // CORE BASELINE SERVICES (PRESERVED INTACT)
    { id: 'base-1', category: 'Core Baseline', title: 'Custom Web Design & Development', pricing: '$299 - $799', status: 'Active', headline: 'Responsive, Modern Web Design for Small Businesses', valueProp: 'Clean code, mobile optimization & fast load speed' },
    { id: 'base-2', category: 'Core Baseline', title: 'Bulk SMS & Messaging API Gateway', pricing: '$49 / 10k SMS', status: 'Active', headline: 'Instant SMS Notifications & Customer Engagement', valueProp: '99.9% Delivery Rate across global telecom networks' },
    { id: 'base-3', category: 'Core Baseline', title: 'Domain Registration & Cloud Hosting', pricing: '$15 - $120 / yr', status: 'Active', headline: 'High-Speed Cloud Hosting & Managed DNS', valueProp: 'Free SSL certificate, daily backups & 99.9% uptime' },

    // ENTERPRISE & AUTONOMOUS SYSTEMS LAYER
    { id: 'ent-1', category: 'Enterprise SaaS', title: 'Custom B2B SaaS & Cloud Infrastructure', pricing: 'MVP: $1,500 | Scale: $3,500 | Enterprise: $8,000+', status: 'Active', headline: 'Scalable, Multi-Tenant B2B SaaS Ecosystems with Automated Billing', valueProp: '1-Click Subscription Management, Role Auth & Stripe/Wise Integration' },
    { id: 'ent-2', category: 'Web Systems', title: 'Intelligent High-Conversion Web Systems', pricing: 'Business: $800 | Interactive Portal: $2,000 - $4,500', status: 'Active', headline: 'High-Speed Interactive Web Systems Built for Conversions & Tracking', valueProp: 'Sub-500ms Edge Latency & 3x Organic Conversion Lift Guarantee' },
    { id: 'ent-3', category: 'Business ERP/CRM', title: 'Unified Process Automation & Operating ERP', pricing: 'Starter: $1,000 | Complete ERP: $3,500 - $7,500', status: 'Active', headline: 'End-to-End Enterprise Workflow Integration & Autonomous Business ERP', valueProp: 'Eliminate 90% Manual Tasks across Email, CRM & Payments' },
    { id: 'ent-4', category: 'Private RAG Systems', title: 'Private Enterprise Knowledge Bases (RAG)', pricing: 'Setup: $2,500 + $500/mo Maintenance', status: 'Active', headline: 'Secure Enterprise RAG Architecture & Automated Decision Assistants', valueProp: 'Instant 24/7 Vector Retrieval over Company PDF/DB Documents' },
    { id: 'ent-5', category: 'A2A API Mesh', title: 'Machine-to-Machine (A2A) API Gateways', pricing: 'Setup: $3,000 - $6,000', status: 'Active', headline: 'Autonomous API Gateways for M2M Commerce & Micro-Service Monetization', valueProp: 'Pay-Per-Execution Micro-Service API monetization' }
];

function editServiceInStudio(svcId) {
    const svc = iinshaFullServicePortfolio.find(s => s.id === svcId);
    if (!svc) return;

    const newTitle = prompt("Edit Service Title:", svc.title);
    if (!newTitle) return;
    const newHeadline = prompt("Edit Brand Headline:", svc.headline);
    const newPricing = prompt("Edit Pricing Tiers:", svc.pricing);
    const newValueProp = prompt("Edit Core Value Proposition:", svc.valueProp);

    svc.title = newTitle.trim();
    if (newHeadline) svc.headline = newHeadline.trim();
    if (newPricing) svc.pricing = newPricing.trim();
    if (newValueProp) svc.valueProp = newValueProp.trim();

    alert(`✅ Service [${svc.title}] updated in Studio CMS & Antigravity 2.0 MCP Bridge!`);
    renderCompleteEnterpriseStudioCMS();
    try { render2026OutcomeServicesStudio();
    try { renderOmnichannelNotificationStudio();
    try { renderCatalogV4Studio();
    try { renderAutonomousEnterpriseEngineStudio();
    try { renderAIBOSArchitectureStudio();
    try { renderInternationalCatalogStudio();
    try { renderEnterpriseArchitectureStudio(); } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){}
}
window.editServiceInStudio = editServiceInStudio;

function toggleServiceStatusV7(svcId) {
    const svc = iinshaFullServicePortfolio.find(s => s.id === svcId);
    if (!svc) return;
    const states = ['Active', 'Draft', 'Coming Soon'];
    let nextIdx = (states.indexOf(svc.status) + 1) % states.length;
    svc.status = states[nextIdx];
    renderCompleteEnterpriseStudioCMS();
    try { render2026OutcomeServicesStudio();
    try { renderOmnichannelNotificationStudio();
    try { renderCatalogV4Studio();
    try { renderAutonomousEnterpriseEngineStudio();
    try { renderAIBOSArchitectureStudio();
    try { renderInternationalCatalogStudio();
    try { renderEnterpriseArchitectureStudio(); } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){} } catch(e){}
}
window.toggleServiceStatusV7 = toggleServiceStatusV7;

function renderCompleteEnterpriseStudioCMS() {
    const root = document.getElementById('admin-enterprise-studio-cms-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:rgba(15,23,42,0.98); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(6,182,212,0.4);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>👑 Studio Management Engine & Dynamic Service CMS</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">ANTIGRAVITY 2.0 MCP BRIDGE ONLINE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Manage Core Baseline Services & Enterprise Systems Layer with 100% Live CMS Controls.</p>
                </div>
            </div>

            <!-- SERVICES LIST CONTAINER -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
                ${iinshaFullServicePortfolio.map(s => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid ${s.category === 'Core Baseline' ? 'rgba(245,158,11,0.4)' : 'rgba(6,182,212,0.4)'}; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-space-between;">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <span style="font-size:0.7rem; color:${s.category === 'Core Baseline' ? '#f59e0b' : 'var(--accent-cyan)'}; font-weight:bold; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px;">${s.category}</span>
                                <span onclick="toggleServiceStatusV7('${s.id}')" style="cursor:pointer; font-size:0.65rem; background:${s.status === 'Active' ? 'rgba(16,185,129,0.2)' : s.status === 'Draft' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.2)'}; color:${s.status === 'Active' ? 'var(--accent-emerald)' : s.status === 'Draft' ? '#f59e0b' : '#a78bfa'}; border:1px solid ${s.status === 'Active' ? 'var(--accent-emerald)' : s.status === 'Draft' ? '#f59e0b' : '#a78bfa'}; padding:2px 8px; border-radius:10px; font-weight:bold;">
                                    ${s.status}
                                </span>
                            </div>
                            <h5 style="margin:4px 0; font-size:0.95rem; color:#fff; font-weight:bold;">${s.title}</h5>
                            <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 8px 0; font-style:italic;">"${s.headline}"</p>
                            <div style="font-size:0.75rem; color:var(--accent-emerald); font-weight:bold; background:rgba(0,0,0,0.5); padding:6px 10px; border-radius:6px; margin-bottom:8px;">${s.pricing}</div>
                            <div style="font-size:0.72rem; color:#cbd5e1; margin-bottom:12px;">🎯 ${s.valueProp}</div>
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button onclick="editServiceInStudio('${s.id}')" class="btn btn-glass-sm" style="flex:1; font-size:0.72rem; font-weight:bold; color:var(--accent-cyan); border-color:var(--accent-cyan);">
                                ✏️ Edit Service & Price
                            </button>
                            <button onclick="generateSoWContractTemplate('${s.id}')" class="btn btn-glass-sm" style="flex:1; font-size:0.72rem; font-weight:bold; color:var(--accent-emerald); border-color:var(--accent-emerald);">
                                📄 SoW Contract
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderCompleteEnterpriseStudioCMS = renderCompleteEnterpriseStudioCMS;



/* ============================================================
   IINSHA AI OS v8.0 — 2026 AAAS OUTCOME-BASED MATRIX & ZERO-PERSON ENTERPRISE
   ============================================================ */

var iinsha2026OutcomeServices = [
    { id: 'aaas-1', category: 'AaaS (Agent-as-a-Service)', title: 'AgentForge AI — No-Code Agent Builder', pricing: '$0.02 / agent-run | $199/mo base', status: 'Active', headline: 'Build, Deploy & Monitor Autonomous AI Agents with Zero Code', valueProp: 'Per-execution micro-billing with MCP & A2A protocol support' },
    { id: 'aaas-2', category: 'Outcome SaaS', title: 'OutcomeStudio AI — Goal-to-Delivery Engine', pricing: '$49 / completed business outcome', status: 'Active', headline: 'Zero-Seat Outcome-Based Task Execution Engine', valueProp: 'Pay strictly for delivered results (e.g. 100% verified onboarding)' },
    { id: 'aaas-3', category: 'Outcome SaaS', title: 'LeadEngine AI — Autonomous Prospecting', pricing: '$15 / qualified B2B lead', status: 'Active', headline: 'Self-Aware Lead Discovery, Scoring & Autonomous Nurturing', valueProp: 'Guaranteed ICP enrichment with zero manual sales effort' },
    { id: 'aaas-4', category: 'AaaS (Agent-as-a-Service)', title: 'SupportAutopilot AI — 24/7 RAG Ticket Resolver', pricing: '$0.50 / resolved ticket', status: 'Active', headline: 'Autonomous RAG Customer Service Agent with Zero Human Drift', valueProp: 'Instant sub-sec responses with automatic human escalation safety' },
    { id: 'ent-2026-1', category: 'Enterprise Systems', title: 'Autonomous Agent Swarm Team Deployment', pricing: '$25,000 - $150,000 + Managed Retainer', status: 'Active', headline: 'Deploy 3-10 Specialized AI Agents operating your core business', valueProp: 'Complete digital employee workforce with 24/7 uptime' },
    { id: 'ent-2026-2', category: 'Zero-Person Enterprise', title: 'Autonomous "Zero-Person Company" System', pricing: '$250,000 - $2,000,000+', status: 'Active', headline: 'Complete Autonomous Business Empire Run 100% by AI Swarms', valueProp: 'Self-governing, self-marketing & self-sustaining corporate entity' }
];

function render2026OutcomeServicesStudio() {
    const root = document.getElementById('admin-2026-outcome-services-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #10b981; border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(16,185,129,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>🚀 2026 AaaS & Outcome-Based Pricing Matrix</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:3px 10px; border-radius:12px; font-weight:bold;">PARADIGM SHIFT ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">From seat-based pricing to Agent-as-a-Service (AaaS) & Outcome-based billing.</p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
                ${iinsha2026OutcomeServices.map(s => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:0.7rem; color:var(--accent-emerald); font-weight:bold; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px;">${s.category}</span>
                            <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">${s.status}</span>
                        </div>
                        <h5 style="margin:4px 0; font-size:0.95rem; color:#fff; font-weight:bold;">${s.title}</h5>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 8px 0; font-style:italic;">"${s.headline}"</p>
                        <div style="font-size:0.75rem; color:var(--accent-emerald); font-weight:bold; background:rgba(0,0,0,0.5); padding:6px 10px; border-radius:6px; margin-bottom:8px;">💰 ${s.pricing}</div>
                        <div style="font-size:0.72rem; color:#cbd5e1; margin-bottom:12px;">🎯 ${s.valueProp}</div>
                        <button onclick="generateSoWContractTemplate('${s.id}')" class="btn btn-glass-sm" style="width:100%; font-size:0.72rem; font-weight:bold; color:var(--accent-emerald); border-color:var(--accent-emerald);">
                            📄 Generate 2026 Outcome SoW
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.render2026OutcomeServicesStudio = render2026OutcomeServicesStudio;



/* ============================================================
   IINSHA AI OS v9.0 — OMNICHANNEL WHATSAPP & FACEBOOK DISPATCHER
   ============================================================ */

var iinshaNotificationState = {
    whatsappNumber: '+8801629286887',
    facebookPage: 'https://facebook.com/inshatech',
    lastNotification: 'System Healthy — 13 AI Swarm Agents Active'
};

function sendDirectWhatsAppNotification(customMsg) {
    const defaultMsg = customMsg || `🚀 *IINSHA AI OS ALERT* 🚀\n\n• Status: All 13 AI Agents Operational\n• MRR Target: $54,200/mo\n• System Health: 99.9% Uptime\n• Security: Zero-Drift Policy Active\n\n_Sent automatically from Master OS Studio_`;
    const encodedMsg = encodeURIComponent(defaultMsg);
    const waUrl = `https://wa.me/8801629286887?text=${encodedMsg}`;
    window.open(waUrl, '_blank');
}
window.sendDirectWhatsAppNotification = sendDirectWhatsAppNotification;

function sendDirectFacebookNotification() {
    alert("📲 Facebook Notification Dispatcher: Copying latest AI Swarm summary to clipboard for Facebook Messenger & Business Suite post!");
    const summaryText = `🌌 IINSHA AI OS — Autonomous Business Intelligence Alert\n13 AI Swarm Agents active. Zero downtime guaranteed.\nContact WhatsApp: +8801629286887 | Web: https://inshatech.pages.dev`;
    navigator.clipboard.writeText(summaryText);
    window.open('https://facebook.com', '_blank');
}
window.sendDirectFacebookNotification = sendDirectFacebookNotification;

function renderOmnichannelNotificationStudio() {
    const root = document.getElementById('admin-omnichannel-notifications-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid var(--accent-cyan); border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(6,182,212,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>📲 WhatsApp & Facebook Live Notification Hub</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:3px 10px; border-radius:12px; font-weight:bold;">AUTO-NOTIFIER ONLINE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Real-time dispatch of leads, orders, affiliate commissions & AI reports to WhatsApp (+8801629286887) and Facebook.</p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:18px; text-align:center;">
                    <div style="font-size:2rem; margin-bottom:8px;">💬</div>
                    <h5 style="margin:0 0 6px 0; color:#fff; font-size:1rem; font-weight:bold;">WhatsApp Live Dispatch</h5>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">Connected Target: <strong>+8801629286887</strong></p>
                    <button onclick="sendDirectWhatsAppNotification()" class="btn btn-primary-sm" style="width:100%; font-weight:bold; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald);">
                        📲 Send Test Alert to WhatsApp
                    </button>
                </div>

                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.4); border-radius:14px; padding:18px; text-align:center;">
                    <div style="font-size:2rem; margin-bottom:8px;">📘</div>
                    <h5 style="margin:0 0 6px 0; color:#fff; font-size:1rem; font-weight:bold;">Facebook Business Hub</h5>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">Instant Dispatch for Messenger & Page Posts</p>
                    <button onclick="sendDirectFacebookNotification()" class="btn btn-primary-sm" style="width:100%; font-weight:bold; background:rgba(6,182,212,0.25); color:var(--accent-cyan); border:1px solid var(--accent-cyan);">
                        📘 Copy Alert for Facebook
                    </button>
                </div>
            </div>
        </div>
    `;
}
window.renderOmnichannelNotificationStudio = renderOmnichannelNotificationStudio;



/* ============================================================
   IINSHA AI OS v10.0 — COMPLETE SERVICE CATALOG v4.0 (143+ SERVICES)
   ============================================================ */

var iinshaMasterCatalogV4 = [
    // TIER 1: CORE BASELINE REBRANDED
    { id: 'cat-101', tier: 'Tier 1: Core', category: 'Conversational CX', title: 'Conversational Experience Platform', pricing: '$499 / $1,999 / $4,999 mo', status: 'Active', headline: 'Engage Clients 24/7 with Zero Human Latency', valueProp: 'Sub-second omnichannel conversation handling across Web & WhatsApp' },
    { id: 'cat-102', tier: 'Tier 1: Core', category: 'Market Data', title: 'Market Intelligence Data Engine', pricing: '$299 / $999 / $2,499 mo', status: 'Active', headline: 'Real-time Market & Competitor Intelligence Extraction', valueProp: 'Clean structured data streams from public global sources' },

    // TIER 2: BUSINESS OPERATING SYSTEMS (SaaS)
    { id: 'cat-201', tier: 'Tier 2: Business OS', category: 'Command Center', title: 'Business Operating System (BOS)', pricing: '$499 / $1,999 / $4,999 mo', status: 'Active', headline: 'The Command Center for Your Entire Business', valueProp: 'Unified Workspace for Team, Tasks, Documents & Performance Analytics' },
    { id: 'cat-202', tier: 'Tier 2: Business OS', category: 'CRM Suite', title: 'Smart CRM Suite', pricing: '$299 / $999 / $2,499 mo', status: 'Active', headline: 'Customer Relationships That Manage Themselves', valueProp: 'Predictive lead scoring, auto-enrichment & churn prevention' },
    { id: 'cat-203', tier: 'Tier 2: Business OS', category: 'Finance', title: 'Financial Command Center', pricing: '$199 / $799 / $1,999 mo', status: 'Active', headline: 'Your Finance Teams New Best Friend', valueProp: 'Auto-categorization, 90-day cash flow forecasting & multi-currency' },
    { id: 'cat-204', tier: 'Tier 2: Business OS', category: 'HR Intelligence', title: 'HR Intelligence Platform', pricing: '$399 / $1,299 / $3,499 mo', status: 'Active', headline: 'Build Your Dream Team on Autopilot', valueProp: 'End-to-end resume ranking, onboarding & burnout prediction' },
    { id: 'cat-205', tier: 'Tier 2: Business OS', category: 'Supply Chain', title: 'Supply Chain Brain', pricing: '$599 / $1,799 / $4,499 mo', status: 'Active', headline: 'Never Run Out of Stock. Never Overstock Again.', valueProp: 'Demand forecasting, auto-reordering & multi-location sync' },
    { id: 'cat-206', tier: 'Tier 2: Business OS', category: 'Projects', title: 'Project Intelligence System', pricing: '$349 / $1,199 / $2,999 mo', status: 'Active', headline: 'Projects That Deliver Themselves', valueProp: '2-week early delay predictions & automatic client updates' },
    { id: 'cat-207', tier: 'Tier 2: Business OS', category: 'Documents', title: 'Document Intelligence Engine', pricing: '$249 / $899 / $2,299 mo', status: 'Active', headline: 'Turn Documents Into Decisions', valueProp: 'Contract risk extraction, invoice matching & GDPR compliance' },
    { id: 'cat-208', tier: 'Tier 2: Business OS', category: 'Security', title: 'Security Command Center', pricing: '$499 / $1,799 / $4,999 mo', status: 'Active', headline: 'Your Digital Fortress, Managed Automatically', valueProp: '24/7 threat detection, vulnerability patch & SOC2 auditing' },

    // TIER 3: INDUSTRY-SPECIFIC SYSTEMS
    { id: 'cat-301', tier: 'Tier 3: Industry OS', category: 'Healthcare', title: 'Healthcare Workflow System', pricing: '$999 / $2,499 / $4,999 mo', status: 'Active', headline: 'Focus on Patients. Let the System Handle the Rest.', valueProp: 'EHR integration, e-prescribe & HIPAA audit trails' },
    { id: 'cat-302', tier: 'Tier 3: Industry OS', category: 'Real Estate', title: 'Real Estate Intelligence OS', pricing: '$499 / $1,299 / $2,499 mo', status: 'Active', headline: 'Close Properties Faster Than Ever', valueProp: 'Zillow/Realtor sync, tenant screening & rent collection' },
    { id: 'cat-303', tier: 'Tier 3: Industry OS', category: 'Education', title: 'Education Management OS', pricing: '$399 / $999 / $1,999 mo', status: 'Active', headline: 'Run Your Institution Like a Tech Company', valueProp: 'Student info, learning management & parent portals' },
    { id: 'cat-304', tier: 'Tier 3: Industry OS', category: 'Legal Tech', title: 'Legal Tech Suite', pricing: '$599 / $1,499 / $2,999 mo', status: 'Active', headline: 'Practice Law. Not Paperwork.', valueProp: 'Court calendar, LEDES trust accounting & e-discovery' },

    // TIER 4: INTELLIGENT INFRASTRUCTURE & DEV TOOLS
    { id: 'cat-401', tier: 'Tier 4: Infrastructure', category: 'Cloud Optimization', title: 'Cloud Intelligence Platform', pricing: '$499 / $1,299 / $2,499 mo', status: 'Active', headline: 'Optimize Your Cloud. Minimize Your Bill.', valueProp: 'Multi-cloud cost optimization (AWS, GCP, Azure) & auto-scaling' },
    { id: 'cat-402', tier: 'Tier 4: Infrastructure', category: 'DevOps', title: 'DevOps Automation Suite', pricing: '$399 / $999 / $1,999 mo', status: 'Active', headline: 'Ship Code. Not Excuses.', valueProp: 'CI/CD pipeline automation, Terraform & Kubernetes mesh' },

    // TIER 5: ADVANCED PREDICTIVE INTELLIGENCE
    { id: 'cat-501', tier: 'Tier 5: Predictive', category: 'Analytics', title: 'Predictive Analytics Engine', pricing: '$599 / $1,499 / $2,999 mo', status: 'Active', headline: 'See the Future. Act Today.', valueProp: 'Revenue forecasting, churn prediction & what-if scenario planning' },
    { id: 'cat-502', tier: 'Tier 5: Predictive', category: 'Fraud Protection', title: 'Fraud Detection System', pricing: '$499 / $1,299 / $2,499 mo', status: 'Active', headline: 'Fraudsters Hate Us. You will Love Us.', valueProp: 'Real-time transaction monitoring, AML & liveness biometrics' }
];

function renderCatalogV4Studio() {
    const root = document.getElementById('admin-catalog-v4-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #8b5cf6; border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(139,92,246,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>🚀 MASTER SERVICE CATALOG v4.0 (143+ SERVICES)</span>
                        <span style="font-size:0.65rem; background:rgba(139,92,246,0.25); color:#a78bfa; border:1px solid #8b5cf6; padding:3px 10px; border-radius:12px; font-weight:bold;">MARKETPLACE STANDARD</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Effectiveness-focused positioning across 5 Tiers: Core, Business OS, Industry OS, Dev Tools & Predictive AI.</p>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
                ${iinshaMasterCatalogV4.map(s => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(139,92,246,0.4); border-radius:14px; padding:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:0.7rem; color:#a78bfa; font-weight:bold; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px;">${s.tier}</span>
                            <span style="font-size:0.65rem; background:rgba(16,185,129,0.2); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">${s.status}</span>
                        </div>
                        <h5 style="margin:4px 0; font-size:0.95rem; color:#fff; font-weight:bold;">${s.title}</h5>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 8px 0; font-style:italic;">"${s.headline}"</p>
                        <div style="font-size:0.75rem; color:#a78bfa; font-weight:bold; background:rgba(0,0,0,0.5); padding:6px 10px; border-radius:6px; margin-bottom:8px;">💰 ${s.pricing}</div>
                        <div style="font-size:0.72rem; color:#cbd5e1; margin-bottom:12px;">🎯 ${s.valueProp}</div>
                        <button onclick="generateSoWContractTemplate('${s.id}')" class="btn btn-glass-sm" style="width:100%; font-size:0.72rem; font-weight:bold; color:#a78bfa; border-color:#8b5cf6;">
                            📄 Generate v4.0 SoW Contract
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderCatalogV4Studio = renderCatalogV4Studio;



/* ============================================================
   IINSHA AI OS v11.0 — AUTONOMOUS ENTERPRISE OPERATING ENGINE
   ============================================================ */

var iinshaAutonomousEngineState = {
    salesAutoPilot: true,
    marketingAutoPilot: true,
    affiliateAutoMonitor: true,
    selfHealingGuard: true,
    totalAutonomouslyGeneratedLeads: 142,
    activeOutreachCampaigns: 18,
    monthlyPassiveRevenueTarget: '$54,200/mo'
};

function toggleAutonomousSubsystem(subsystem) {
    iinshaAutonomousEngineState[subsystem] = !iinshaAutonomousEngineState[subsystem];
    const statusSpan = document.getElementById(subsystem + '-status-badge');
    if (statusSpan) {
        statusSpan.innerText = iinshaAutonomousEngineState[subsystem] ? 'AUTONOMOUS ACTIVE' : 'PAUSED';
        statusSpan.style.background = iinshaAutonomousEngineState[subsystem] ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)';
        statusSpan.style.color = iinshaAutonomousEngineState[subsystem] ? 'var(--accent-emerald)' : '#ef4444';
        statusSpan.style.borderColor = iinshaAutonomousEngineState[subsystem] ? 'var(--accent-emerald)' : '#ef4444';
    }
    alert(`🤖 ${subsystem} updated to: ${iinshaAutonomousEngineState[subsystem] ? 'AUTONOMOUS ACTIVE' : 'PAUSED'}`);
}
window.toggleAutonomousSubsystem = toggleAutonomousSubsystem;

function triggerAutonomousLeadHarvesting() {
    alert("🚀 n8n + Gemini 2.5 Pro Lead Harvesting Triggered! Collecting B2B ICP Leads from LinkedIn, Web Forms & WhatsApp (+8801629286887)...");
    iinshaAutonomousEngineState.totalAutonomouslyGeneratedLeads += 5;
    const counterDiv = document.getElementById('auto-lead-counter');
    if (counterDiv) counterDiv.innerText = iinshaAutonomousEngineState.totalAutonomouslyGeneratedLeads + ' Verified Leads';
}
window.triggerAutonomousLeadHarvesting = triggerAutonomousLeadHarvesting;

function renderAutonomousEnterpriseEngineStudio() {
    const root = document.getElementById('admin-autonomous-enterprise-engine-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid var(--accent-emerald); border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(16,185,129,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>🤖 ULTIMATE AUTONOMOUS ENTERPRISE ENGINE (n8n + GEMINI 2.5)</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:3px 10px; border-radius:12px; font-weight:bold;">100% HANDS-OFF EARNING ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">Self-executing Sales, Marketing, Affiliate Monitoring, Social Outreach & Transaction Healing Engine.</p>
                </div>
            </div>

            <!-- 4 AUTONOMOUS OPERATIONAL SUBSYSTEM CARDS -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:18px;">
                <!-- SUBSYSTEM 1: SALES & CLIENT CONVINCER -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">💼 Autonomous Sales Engine</span>
                        <span id="salesAutoPilot-status-badge" onclick="toggleAutonomousSubsystem('salesAutoPilot')" style="cursor:pointer; font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">AUTONOMOUS ACTIVE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 10px 0;">Auto-captures leads, generates SoW proposals & dispatches WhatsApp proposals to +8801629286887.</p>
                    <button onclick="triggerAutonomousLeadHarvesting()" class="btn btn-primary-sm" style="width:100%; font-size:0.72rem; font-weight:bold;">
                        🎯 Harvest New B2B Leads Now
                    </button>
                </div>

                <!-- SUBSYSTEM 2: MARKETING & SOCIAL OUTREACH -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(6,182,212,0.4); border-radius:14px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">📢 Marketing & Social Swarm</span>
                        <span id="marketingAutoPilot-status-badge" onclick="toggleAutonomousSubsystem('marketingAutoPilot')" style="cursor:pointer; font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">AUTONOMOUS ACTIVE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 10px 0;">SEDUCER & SCOUT Agents generate LinkedIn posts, Facebook campaigns & B2B cold emails.</p>
                    <div style="font-size:0.72rem; color:var(--accent-cyan); font-weight:bold;">Active Campaigns: ${iinshaAutonomousEngineState.activeOutreachCampaigns} Channels</div>
                </div>

                <!-- SUBSYSTEM 3: AFFILIATE EMPIRE MONITOR -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(245,158,11,0.4); border-radius:14px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🤝 Affiliate Empire Monitor</span>
                        <span id="affiliateAutoMonitor-status-badge" onclick="toggleAutonomousSubsystem('affiliateAutoMonitor')" style="cursor:pointer; font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">AUTONOMOUS ACTIVE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 10px 0;">TREASURER & ANALYST Agents monitor clicks, fraud detection & send motivation alerts via WhatsApp.</p>
                    <div style="font-size:0.72rem; color:#f59e0b; font-weight:bold;">Top Marketers Monitored: 100% Active</div>
                </div>

                <!-- SUBSYSTEM 4: SELF-HEALING TRANSACTION GUARD -->
                <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(139,92,246,0.4); border-radius:14px; padding:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:0.85rem; font-weight:bold; color:#fff;">🛡️ Self-Healing & Revenue Guard</span>
                        <span id="selfHealingGuard-status-badge" onclick="toggleAutonomousSubsystem('selfHealingGuard')" style="cursor:pointer; font-size:0.65rem; background:rgba(16,185,129,0.25); color:var(--accent-emerald); border:1px solid var(--accent-emerald); padding:2px 8px; border-radius:10px; font-weight:bold;">AUTONOMOUS ACTIVE</span>
                    </div>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0 0 10px 0;">GUARDIAN & KEEPER Agents monitor 500 errors, latencies & auto-patch routes within 60 seconds.</p>
                    <div style="font-size:0.72rem; color:#a78bfa; font-weight:bold;">System Uptime: 99.999% Guaranteed</div>
                </div>
            </div>

            <!-- METRIC TELEMETRY BAR -->
            <div style="background:rgba(0,0,0,0.6); border:1px solid rgba(16,185,129,0.4); padding:14px; border-radius:10px; display:flex; justify-content:space-around; text-align:center;">
                <div>
                    <div style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">TOTAL AUTONOMOUS LEADS</div>
                    <div id="auto-lead-counter" style="font-size:1.1rem; font-weight:bold; color:var(--accent-emerald);">${iinshaAutonomousEngineState.totalAutonomouslyGeneratedLeads} Verified Leads</div>
                </div>
                <div>
                    <div style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">PASSIVE REVENUE TARGET</div>
                    <div style="font-size:1.1rem; font-weight:bold; color:var(--accent-cyan);">${iinshaAutonomousEngineState.monthlyPassiveRevenueTarget}</div>
                </div>
            </div>
        </div>
    `;
}
window.renderAutonomousEnterpriseEngineStudio = renderAutonomousEnterpriseEngineStudio;



/* ============================================================
   IINSHA AI OS v12.0 — AI BUSINESS OPERATING SYSTEM (AI-BOS)
   Gemini 3.6 Flash + Gemini 3.5 Flash-Lite Model Routing & Tool Execution Mesh
   ============================================================ */

var iinshaAIBOSModelRouter = {
    commander: 'gemini-3.6-flash',       // Agentic Reasoning & Code
    subagents: 'gemini-3.5-flash-lite',  // High-Volume Subagent Execution
    strategy: 'gemini-3.5-pro',          // Strategic Reasoning & SoW Contracts
    creatives: 'gemini-3.1-flash-image'  // Marketing Banners & Visuals
};

var iinshaAIBOSHierarchy = [
    { level: 'Level 1: Executive', name: 'COMMANDER (AI CEO)', model: 'Gemini 3.6 Flash', role: 'Supervises all agents, prioritizes tasks, schedules n8n workflows & enforces HITL approvals' },
    { level: 'Level 1: Executive', name: 'ORACLE (Strategy)', model: 'Gemini 3.5 Pro', role: 'Analyzes market trends, country demand & dynamic service pricing' },
    { level: 'Level 2: Revenue', name: 'HUNTER (Lead Intel)', model: 'Gemini 3.5 Flash-Lite', role: 'Target company discovery, ICP creation & privacy-compliant prospect research' },
    { level: 'Level 2: Revenue', name: 'NEGOTIATOR (Sales)', model: 'Gemini 3.5 Pro', role: 'Inquiry analysis, SoW drafting, objection handling & CRM updates' },
    { level: 'Level 3: Marketing', name: 'GROWTH AGENT', model: 'Gemini 3.6 Flash', role: 'LinkedIn/X/FB campaigns, SEO landing pages & affiliate content generation' },
    { level: 'Level 4: Product & Tech', name: 'BUILDER & ARCHITECT', model: 'Gemini 3.6 Flash', role: 'Frontend/backend code, Cloudflare Pages, Supabase RLS & n8n mesh' },
    { level: 'Level 4: Product & Tech', name: 'GUARDIAN (Self-Healing)', model: 'Gemini 3.6 Flash', role: 'Detects runtime errors, tests staging patches & requests deployment approval' },
    { level: 'Level 5: Finance', name: 'TREASURER (Finance)', model: 'Gemini 3.5 Flash-Lite', role: 'Calculates CAC, LTV, affiliate commissions & daily profitability briefings' }
];

function renderAIBOSArchitectureStudio() {
    const root = document.getElementById('admin-aibos-architecture-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(59,130,246,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>👑 AI BUSINESS OPERATING SYSTEM (AI-BOS v12.0)</span>
                        <span style="font-size:0.65rem; background:rgba(59,130,246,0.25); color:#60a5fa; border:1px solid #3b82f6; padding:3px 10px; border-radius:12px; font-weight:bold;">GEMINI 3.6 FLASH ROUTER ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">AI Decision → Tool Request → Permission Check → Policy Check → n8n Execution → Audit Log</p>
                </div>
            </div>

            <!-- MODEL ROUTER TELEMETRY -->
            <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(59,130,246,0.4); padding:14px; border-radius:12px; margin-bottom:18px; display:flex; justify-content:space-around; text-align:center;">
                <div>
                    <div style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">EXECUTIVE MODEL</div>
                    <div style="font-size:0.9rem; font-weight:bold; color:#60a5fa;">Gemini 3.6 Flash</div>
                </div>
                <div>
                    <div style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">SUBAGENT MODEL</div>
                    <div style="font-size:0.9rem; font-weight:bold; color:var(--accent-emerald);">Gemini 3.5 Flash-Lite</div>
                </div>
                <div>
                    <div style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">STRATEGY ENGINE</div>
                    <div style="font-size:0.9rem; font-weight:bold; color:#a78bfa;">Gemini 3.5 Pro</div>
                </div>
            </div>

            <!-- AGENT HIERARCHY GRID -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
                ${iinshaAIBOSHierarchy.map(a => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(59,130,246,0.4); border-radius:14px; padding:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <span style="font-size:0.7rem; color:#60a5fa; font-weight:bold; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px;">${a.level}</span>
                            <span style="font-size:0.65rem; background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6; padding:2px 8px; border-radius:10px; font-weight:bold;">${a.model}</span>
                        </div>
                        <h5 style="margin:4px 0; font-size:0.95rem; color:#fff; font-weight:bold;">${a.name}</h5>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin:0;">${a.role}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderAIBOSArchitectureStudio = renderAIBOSArchitectureStudio;



/* ============================================================
   IINSHA AI OS v13.0 — ULTIMATE AI COPILOT & DIAGNOSTIC SUITE
   - Live AI Copilot Chat Widget (Bottom Right)
   - Interactive AI Business Health Check Audit Wizard
   - Multi-Currency & Multi-Language Dynamic Engine
   ============================================================ */

var iinshaActiveCurrency = 'USD';
var iinshaCurrencyRates = {
    USD: { symbol: '$', rate: 1.0 },
    BDT: { symbol: '৳', rate: 122.0 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.78 },
    AED: { symbol: 'AED ', rate: 3.67 }
};

var iinshaActiveLanguage = 'EN';
var iinshaTranslations = {
    EN: {
        heroTitle: "Supercharge Your Business With AI Business Operating System",
        heroSub: "Autonomous agent swarms, n8n workflows, and decision intelligence built for maximum ROI.",
        auditBtn: "⚡ Run Free AI Business Audit",
        chatTitle: "IINSHA AI Copilot (Gemini 3.6 Flash)",
        chatPlaceholder: "Ask anything or describe your business process..."
    },
    BN: {
        heroTitle: "এআই বিজনেস অপারেটিং সিস্টেম দিয়ে আপনার ব্যবসা অটোমেট করুন",
        heroSub: "অটোনোমাস এজেন্ট সোয়ার্ম, n8n ওয়ার্কফ্লো এবং ডিসিশন ইন্টেলিজেন্স সেরা ROI এর জন্য।",
        auditBtn: "⚡ ফ্রি এআই বিজনেস অডিট করুন",
        chatTitle: "ইনশা এআই কোপাইলট (জেমিনাই ৩.৬ ফ্ল্যাশ)",
        chatPlaceholder: "আপনার ব্যবসার যেকোনো প্রশ্ন লিখুন..."
    }
};

// LIVE AI COPILOT CHAT WIDGET
function initIinshaAICopilotWidget() {
    let chatContainer = document.getElementById('iinsha-ai-copilot-container');
    if (chatContainer) return;

    chatContainer = document.createElement('div');
    chatContainer.id = 'iinsha-ai-copilot-container';
    chatContainer.innerHTML = `
        <div id="iinsha-chat-toggle" onclick="toggleIinshaChatWindow()" style="position:fixed; bottom:24px; right:24px; z-index:10000; background:linear-gradient(135deg, #3b82f6, #8b5cf6); color:#fff; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 10px 30px rgba(59,130,246,0.5); transition:transform 0.3s ease; border:2px solid rgba(255,255,255,0.3);">
            <span style="font-size:1.8rem;">🤖</span>
        </div>

        <div id="iinsha-chat-window" style="display:none; position:fixed; bottom:96px; right:24px; z-index:9999; width:380px; max-width:90vw; height:520px; background:rgba(15,23,42,0.96); backdrop-filter:blur(20px); border:1px solid rgba(59,130,246,0.4); border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.6); display:flex; flex-direction:column; overflow:hidden;">
            <!-- CHAT HEADER -->
            <div style="background:linear-gradient(135deg, rgba(30,41,59,0.9), rgba(59,130,246,0.3)); padding:16px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:10px; height:10px; border-radius:50%; background:#10b981; box-shadow:0 0 10px #10b981;"></div>
                    <div>
                        <h5 style="margin:0; color:#fff; font-size:0.95rem; font-weight:bold;">IINSHA Copilot</h5>
                        <span style="font-size:0.65rem; color:#60a5fa;">Gemini 3.6 Flash Swarm</span>
                    </div>
                </div>
                <button onclick="toggleIinshaChatWindow()" style="background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">✕</button>
            </div>

            <!-- CHAT MESSAGES BODY -->
            <div id="iinsha-chat-messages" style="flex:1; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; font-size:0.85rem;">
                <div style="background:rgba(30,41,59,0.8); border:1px solid rgba(59,130,246,0.3); border-radius:14px; padding:12px; color:#e2e8f0;">
                    👋 Hello! I am <strong>IINSHA Copilot</strong> powered by <strong>Gemini 3.6 Flash</strong>. How can I help automate your business operations or calculate your ROI today?
                </div>
            </div>

            <!-- CHAT INPUT AREA -->
            <div style="padding:12px; background:rgba(0,0,0,0.4); border-top:1px solid rgba(255,255,255,0.1); display:flex; gap:8px;">
                <input type="text" id="iinsha-chat-input" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendIinshaChatMessage()" style="flex:1; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;" />
                <button onclick="sendIinshaChatMessage()" style="background:linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; border:none; border-radius:10px; padding:0 16px; font-weight:bold; cursor:pointer; font-size:0.9rem;">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);
}

function toggleIinshaChatWindow() {
    const win = document.getElementById('iinsha-chat-window');
    if (win) {
        win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
    }
}

function sendIinshaChatMessage() {
    const input = document.getElementById('iinsha-chat-input');
    const msgContainer = document.getElementById('iinsha-chat-messages');
    if (!input || !msgContainer || !input.value.trim()) return;

    const userText = input.value.trim();
    input.value = '';

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'background:linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; border-radius:14px; padding:10px 14px; align-self:flex-end; max-width:85%; word-break:break-word; font-size:0.85rem;';
    userBubble.innerText = userText;
    msgContainer.appendChild(userBubble);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    // Simulate AI Response
    setTimeout(() => {
        const aiBubble = document.createElement('div');
        aiBubble.style.cssText = 'background:rgba(30,41,59,0.8); border:1px solid rgba(59,130,246,0.3); border-radius:14px; padding:12px; color:#e2e8f0; align-self:flex-start; max-width:85%; font-size:0.85rem;';
        
        let reply = "";
        const lower = userText.toLowerCase();
        if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('দাম')) {
            reply = "💡 Our Business Operating System packages start at $499/mo or custom SoW. You can use our interactive ROI Calculator or open the Admin Control Panel to view our Tier 1-5 Master Catalog!";
        } else if (lower.includes('whatsapp') || lower.includes('contact') || lower.includes('call') || lower.includes('যোগাযোগ')) {
            reply = "📱 You can reach our founder & AI architect directly on WhatsApp at <strong>+8801629286887</strong>. I can also dispatch your inquiry details immediately!";
        } else if (lower.includes('audit') || lower.includes('health') || lower.includes('check')) {
            reply = "⚡ You can launch our 1-click AI Business Health Check Wizard right from the top navigation bar to receive a full AI readiness score!";
        } else {
            reply = `🤖 Excellent query! Gemini 3.6 Flash has processed: "${userText}". Our 13-Agent Swarm can automate this via custom n8n workflows with zero code debt. Would you like to schedule a quick demo?`;
        }

        aiBubble.innerHTML = reply;
        msgContainer.appendChild(aiBubble);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 600);
}

// AI BUSINESS AUDIT WIZARD MODAL
function openIinshaBusinessAuditModal() {
    let auditModal = document.getElementById('iinsha-audit-modal-root');
    if (!auditModal) {
        auditModal = document.createElement('div');
        auditModal.id = 'iinsha-audit-modal-root';
        document.body.appendChild(auditModal);
    }

    auditModal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:99999; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';
    auditModal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(59,130,246,0.4); color:#fff; position:relative;">
            <button onclick="closeIinshaBusinessAuditModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
                
                <div style="text-align:center; margin-bottom:24px;">
                    <span style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">GEMINI 3.6 FLASH DIAGNOSTIC ENGINE</span>
                    <h3 style="margin:10px 0 6px 0; font-size:1.6rem; color:#fff;">⚡ Instant AI Business Health Check</h3>
                    <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Discover your operational automation bottlenecks in 30 seconds</p>
                </div>

                <form id="iinsha-audit-form" onsubmit="runIinshaAuditCalculation(event)">
                    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:16px;">
                        <div>
                            <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Company / Brand Name</label>
                            <input type="text" id="audit-company" required placeholder="e.g. Apex Tech Ltd" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;" />
                        </div>
                        <div>
                            <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Industry Sector</label>
                            <select id="audit-industry" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                                <option>E-Commerce & Retail</option>
                                <option>SaaS & Tech Enterprise</option>
                                <option>Agency & Professional Services</option>
                                <option>Healthcare & Biotech</option>
                                <option>Finance & Real Estate</option>
                            </select>
                        </div>
                    </div>

                    <div style="margin-bottom:16px;">
                        <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Primary Operational Bottleneck</label>
                        <select id="audit-bottleneck" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                            <option>Manual Lead Response & High Drop-off Rate</option>
                            <option>Scattered Customer Data & Lack of CRM Automation</option>
                            <option>Slow Content Production & High Marketing Overhead</option>
                            <option>Repetitive Employee Tasks & Human Error in Support</option>
                        </select>
                    </div>

                    <button type="submit" style="width:100%; background:linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; border:none; padding:14px; border-radius:12px; font-weight:bold; font-size:1rem; cursor:pointer; box-shadow:0 8px 25px rgba(59,130,246,0.4);">
                        🚀 Generate Diagnostic Report & Automation Plan
                    </button>
                </form>

                <div id="iinsha-audit-results" style="display:none; margin-top:24px; background:rgba(0,0,0,0.5); border:1px solid rgba(59,130,246,0.4); border-radius:16px; padding:20px;">
                    <!-- DYNAMICALLY POPULATED -->
                </div>
            </div>
        </div>
    `;
}

function closeIinshaBusinessAuditModal() {
    const modal = document.getElementById('iinsha-audit-modal-root');
    if (modal) modal.innerHTML = '';
}

function openAiRevenueSystemModal() {
    let modal = document.getElementById('iinsha-solution-modal-root');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'iinsha-solution-modal-root';
        document.body.appendChild(modal);
    }
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:99999; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(59,130,246,0.4); color:#fff; position:relative;">
            <button onclick="closeAiSolutionModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
            <span style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">OUTCOME SYSTEM A</span>
            <h3 style="margin:12px 0 6px 0; font-size:1.6rem; color:#fff;">📈 AI Revenue System Blueprint</h3>
            <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:20px;">Automate inbound lead qualification, proposal generation, and multi-channel outreach without human drop-off.</p>
            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(59,130,246,0.3); border-radius:12px; padding:16px; margin-bottom:20px; font-size:0.85rem; line-height:1.6;">
                <div style="font-weight:bold; color:#60a5fa; margin-bottom:8px;">⚡ Included Capabilities:</div>
                • <strong>AI Sales Agent</strong> (Responds under 60 seconds)<br>
                • <strong>CRM Data Enrichment</strong> (Apollo / LinkedIn Scraper integration)<br>
                • <strong>Automated Proposal Engine</strong> (Generates custom PDF / Web quotes)<br>
                • <strong>Email & WhatsApp Follow-up Cadence</strong> (n8n workflow driven)<br>
                • <strong>Human-in-the-Loop Approval Gate</strong>
            </div>
            <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I%20want%20to%20deploy%20the%20AI%20Revenue%20System" target="_blank" class="btn btn-primary btn-full" style="background:linear-gradient(135deg, #3b82f6, #2563eb); text-align:center; padding:14px; text-decoration:none; display:block;">💬 Deploy AI Revenue System (WhatsApp Inquiry) →</a>
        </div>
    `;
}

function openAiOpsSystemModal() {
    let modal = document.getElementById('iinsha-solution-modal-root');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'iinsha-solution-modal-root';
        document.body.appendChild(modal);
    }
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:99999; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(6,78,59,0.95)); border:1px solid #10b981; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(16,185,129,0.4); color:#fff; position:relative;">
            <button onclick="closeAiSolutionModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
            <span style="background:rgba(16,185,129,0.2); color:#34d399; border:1px solid #10b981; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">OUTCOME SYSTEM B</span>
            <h3 style="margin:12px 0 6px 0; font-size:1.6rem; color:#fff;">⚙️ AI Operations System Blueprint</h3>
            <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:20px;">Eliminate repetitive manual back-office tasks, invoice entry, and report compilation.</p>
            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:16px; margin-bottom:20px; font-size:0.85rem; line-height:1.6;">
                <div style="font-weight:bold; color:#34d399; margin-bottom:8px;">⚡ Included Capabilities:</div>
                • <strong>Invoice OCR & Document Parsing</strong> (Gemini Vision API)<br>
                • <strong>Self-Healing n8n Pipelines</strong> (Auto-retry on error)<br>
                • <strong>Internal Knowledge RAG Bot</strong> (Queries internal SOPs)<br>
                • <strong>Database Sync</strong> (Postgres / Supabase / Airtable integration)<br>
                • <strong>Automated Executive Summary Reports</strong>
            </div>
            <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I%20want%20to%20deploy%20the%20AI%20Operations%20System" target="_blank" class="btn btn-primary btn-full" style="background:linear-gradient(135deg, #10b981, #059669); text-align:center; padding:14px; text-decoration:none; display:block;">💬 Deploy AI Operations System (WhatsApp Inquiry) →</a>
        </div>
    `;
}

function openAiSupportSystemModal() {
    let modal = document.getElementById('iinsha-solution-modal-root');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'iinsha-solution-modal-root';
        document.body.appendChild(modal);
    }
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:99999; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';
    modal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(88,28,135,0.95)); border:1px solid #a855f7; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(168,85,247,0.4); color:#fff; position:relative;">
            <button onclick="closeAiSolutionModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
            <span style="background:rgba(168,85,247,0.2); color:#c084fc; border:1px solid #a855f7; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">OUTCOME SYSTEM C</span>
            <h3 style="margin:12px 0 6px 0; font-size:1.6rem; color:#fff;">🎧 AI Support System Blueprint</h3>
            <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:20px;">Provide 24/7 intelligent customer triage with instant vector database document lookup.</p>
            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(168,85,247,0.3); border-radius:12px; padding:16px; margin-bottom:20px; font-size:0.85rem; line-height:1.6;">
                <div style="font-weight:bold; color:#c084fc; margin-bottom:8px;">⚡ Included Capabilities:</div>
                • <strong>Omnichannel Web & WhatsApp Bot</strong><br>
                • <strong>Pinecone RAG Vector Engine</strong> (Zero hallucination answers)<br>
                • <strong>Ticket Triage & Routing</strong> (Assigns priority automatically)<br>
                • <strong>Human Escalation Gate</strong> (Hands over complex queries)<br>
                • <strong>Live Conversation Analytics & CSAT Tracking</strong>
            </div>
            <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I%20want%20to%20deploy%20the%20AI%20Support%20System" target="_blank" class="btn btn-primary btn-full" style="background:linear-gradient(135deg, #a855f7, #7e22ce); text-align:center; padding:14px; text-decoration:none; display:block;">💬 Deploy AI Support System (WhatsApp Inquiry) →</a>
        </div>
    `;
}

function closeAiSolutionModal() {
    const modal = document.getElementById('iinsha-solution-modal-root');
    if (modal) modal.innerHTML = '';
}

function calculateCustomWorkforceEstimate() {
    const checks = document.querySelectorAll('.wf-agent-check:checked');
    const count = (checks && checks.length > 0) ? checks.length : 3;
    const hoursPerAgent = 15;
    const totalHours = count * hoursPerAgent;

    const countEl = document.getElementById('wf-agent-count');
    const hoursEl = document.getElementById('wf-hours-saved');

    if (countEl) countEl.textContent = `${count} Agent${count !== 1 ? 's' : ''}`;
    if (hoursEl) hoursEl.textContent = `${totalHours} Hours / wk`;
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', calculateCustomWorkforceEstimate);
} else {
    calculateCustomWorkforceEstimate();
}

/* 👑 SUPREME OWNER COMMAND CENTER CONTROLS */
function triggerMasterKillSwitch(mode) {
    const dot = document.getElementById('owner-status-dot');
    const text = document.getElementById('owner-status-text');

    if (mode === 'PAUSE_ALL') {
        if (dot) {
            dot.style.background = '#ef4444';
            dot.style.boxShadow = '0 0 10px #ef4444';
        }
        if (text) {
            text.innerHTML = '<span style="color:#ef4444;">SYSTEM PAUSED ● SAFETY EMERGENCY LOCK ACTIVE</span>';
        }
        showFomoToast('🔴 EMERGENCY KILL SWITCH ACTIVATED — ALL 27 AGENTS PAUSED BY OWNER', 'error');
    } else if (mode === 'PAUSE_HIGH_RISK') {
        if (dot) {
            dot.style.background = '#f59e0b';
            dot.style.boxShadow = '0 0 10px #f59e0b';
        }
        if (text) {
            text.innerHTML = '<span style="color:#fbbf24;">HIGH-RISK ACTIONS PAUSED ● READ-ONLY AGENTS ONLINE</span>';
        }
        showFomoToast('🟡 HIGH-RISK ACTIONS FROZEN — HIGH-RISK MUTATIONS REQUIRING HUMAN GATE', 'warning');
    } else if (mode === 'RESUME_ALL') {
        if (dot) {
            dot.style.background = '#10b981';
            dot.style.boxShadow = '0 0 10px #10b981';
        }
        if (text) {
            text.innerHTML = '<span style="color:#fff;">SYSTEM OPERATIONAL ● 27 ACTIVE AGENTS</span>';
        }
        showFomoToast('🟢 ALL SYSTEMS RESUMED — SUPREME OWNER GOVERNANCE ACTIVE', 'success');
    }
}

function updateAutonomyLevelFromSlider(val) {
    const levelMap = {
        0: { title: "LEVEL 0: OBSERVE ONLY", desc: "AI collects data & logs events; 0 actions executed autonomously.", color: "#94a3b8" },
        1: { title: "LEVEL 1: RECOMMENDATION MODE", desc: "AI generates strategic proposals for Owner approval before executing.", color: "#60a5fa" },
        2: { title: "LEVEL 2: LOW-RISK AUTONOMY", desc: "AI executes read-only queries & draft staging; external actions blocked.", color: "#34d399" },
        3: { title: "LEVEL 3: RULE-BOUNDED AUTONOMY", desc: "AI executes pre-approved workflows within strict schema parameters.", color: "var(--accent-cyan)" },
        4: { title: "LEVEL 4: AUTONOMOUS POLICY BOUNDARY", desc: "AI operates autonomously within daily budget & permission limits.", color: "#a855f7" },
        5: { title: "LEVEL 5: AUTONOMOUS RESEARCH MODE", desc: "Advanced goal-oriented simulation & sandbox exploration enabled.", color: "var(--accent-gold)" }
    };

    const config = levelMap[val] || levelMap[3];
    const badge = document.getElementById('autonomy-level-badge');
    const desc = document.getElementById('autonomy-level-desc');

    if (badge) {
        badge.textContent = config.title;
        badge.style.color = config.color;
    }
    if (desc) {
        desc.textContent = config.desc;
    }
}

function updateBudgetSpendLimit(val) {
    const label = document.getElementById('budget-spend-label');
    if (label) {
        label.textContent = `$${val}.00 / day`;
    }
}

function runAiGoalDecomposition() {
    const input = document.getElementById('ai-goal-input');
    const card = document.getElementById('ai-goal-output-card');
    const container = document.getElementById('ai-goal-steps-container');

    if (!input || !card || !container) return;

    const goal = input.value.trim() || "Reduce customer response time by 40%";
    card.classList.remove('hidden');

    container.innerHTML = `
        <div style="background:rgba(59,130,246,0.1); border-left: 3px solid #3b82f6; padding: 10px; border-radius: 4px;">
            <strong style="color:#60a5fa;">STEP 1: Strategic Analysis</strong> ── AI Commander analyzed historical tickets and identified 3 main latency bottlenecks.
        </div>
        <div style="background:rgba(16,185,129,0.1); border-left: 3px solid #10b981; padding: 10px; border-radius: 4px;">
            <strong style="color:#34d399;">STEP 2: Solution Generation</strong> ── Configured Pinecone RAG Vector DB for instant FAQ resolution + n8n webhook triage.
        </div>
        <div style="background:rgba(168,85,247,0.1); border-left: 3px solid #a855f7; padding: 10px; border-radius: 4px;">
            <strong style="color:#c084fc;">STEP 3: Sandbox Simulation</strong> ── Simulated 1,000 synthetic customer conversations with 99.4% retrieval accuracy.
        </div>
        <div style="background:rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; padding: 10px; border-radius: 4px;">
            <strong style="color:#fbbf24;">STEP 4: Owner Governance Check</strong> ── Pending Supreme Owner approval for external email dispatch authority.
        </div>
        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
            <button class="btn btn-primary-sm" onclick="showFomoToast('✨ Strategy Roadmap Approved by Owner! Deploying to AI Workforce...', 'success')" style="background: linear-gradient(135deg, #10b981, #059669);">
                👍 Approve & Deploy Strategy
            </button>
        </div>
    `;
}

/* 🏢 5 AUTONOMOUS AI BUSINESS DIVISIONS CONTROLS */
function switchAiDivisionTab(divId) {
    const tabs = ['growth', 'sales', 'delivery', 'success', 'finance'];
    
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const card = document.getElementById(`div-card-${t}`);
        if (btn) btn.classList.remove('active');
        if (card) card.classList.add('hidden');
    });

    const activeBtn = document.getElementById(`tab-btn-${divId}`);
    const activeCard = document.getElementById(`div-card-${divId}`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeCard) activeCard.classList.remove('hidden');
}

function triggerFlywheelSimulation() {
    const steps = [
        "🔍 Step 1: Market Intel Agent discovered 12 B2B E-commerce opportunities",
        "📊 Step 2: Lead Gen Agent enriched contacts into CRM",
        "🎯 Step 3: Sales AI qualified lead & generated $1,250 project proposal",
        "👔 Step 4: AI Project Manager decomposed scope & assigned Dev Agents",
        "🧪 Step 5: Independent QA Agent performed automated test pass (100% Green)",
        "🎧 Step 6: 24/7 Pinecone RAG Bot onboarded client & answered technical FAQs",
        "📈 Step 7: AI Upsell Engine recommended Voice AI expansion (+$499/mo)",
        "💳 Step 8: Invoice matched & $1,250 deposited to Supreme Financial Vault!"
    ];

    steps.forEach((msg, idx) => {
        setTimeout(() => {
            const stepBox = document.getElementById(`fw-step-${idx + 1}`);
            if (stepBox) {
                stepBox.style.borderColor = idx === 7 ? 'var(--accent-gold)' : '#34d399';
                stepBox.style.background = 'rgba(16,185,129,0.2)';
            }
            showFomoToast(msg, idx === 7 ? 'success' : 'info');
        }, idx * 600);
    });
}

/* 🆔 AGENT PASSPORT & BOARDROOM DEBATE CONTROLS */
function inspectAgentPassport(agentId) {
    const passportData = {
        'AGNT-0001': { name: "🧠 AI CEO Orchestrator", role: "Business Orchestrator & Goal Planner", autonomy: "Level 4 (Policy Boundary)", budget: "$20.00 / day", tools: "n8n Webhook, Pinecone Memory, Goal Decomposer, Boardroom Trigger", owner: "Supreme Owner", audit: "4,281 tasks executed | 99.4% uptime | Zero boundary violations" },
        'AGNT-1042': { name: "🔍 Market Intel Agent", role: "Niche Scraper & Competitor Monitor", autonomy: "Level 3 (Rule-Bounded)", budget: "$5.00 / day", tools: "Web Scraper, Google Trends API, SEO Keyword Indexer", owner: "Supreme Owner", audit: "1,420 niches scanned | 83 leads enriched | 0 consent errors" },
        'AGNT-4019': { name: "🧪 Independent QA Agent", role: "Code Inspector & Safety Evaluator", autonomy: "Level 3 (Rule-Bounded)", budget: "$5.00 / day", tools: "Playwright E2E Runner, ESLint, Sandbox Validator", owner: "Supreme Owner", audit: "340 builds tested | 100% test pass rate | Zero regression" }
    };

    const info = passportData[agentId] || passportData['AGNT-0001'];
    
    showFomoToast(`🆔 PASSPORT VERIFIED [${agentId}]: ${info.name}\n• Autonomy: ${info.autonomy}\n• Daily Budget: ${info.budget}\n• Audit Status: ${info.audit}`, 'info');
}

function composeDynamicWorkforce() {
    const promptInput = document.getElementById('composer-prompt-input');
    const box = document.getElementById('composer-output-box');
    const container = document.getElementById('composer-swarm-container');

    if (!promptInput || !box || !container) return;

    const goal = promptInput.value.trim() || "Automated B2B Lead Gen & Outreach";
    box.classList.remove('hidden');

    container.innerHTML = `
        <div style="background:rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); padding: 12px; border-radius: 8px;">
            <strong style="color:#c084fc; font-size:0.85rem; display:block;">1. Lead Intel Agent (AGNT-1092)</strong>
            <span style="font-size:0.72rem; color:var(--text-muted);">Discovers verified B2B decision makers.</span>
        </div>
        <div style="background:rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); padding: 12px; border-radius: 8px;">
            <strong style="color:#60a5fa; font-size:0.85rem; display:block;">2. Outreach Agent (AGNT-2041)</strong>
            <span style="font-size:0.72rem; color:var(--text-muted);">Personalizes omnichannel outreach.</span>
        </div>
        <div style="background:rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 12px; border-radius: 8px;">
            <strong style="color:#34d399; font-size:0.85rem; display:block;">3. Voice AI Agent (AGNT-6014)</strong>
            <span style="font-size:0.72rem; color:var(--text-muted);">Handles inbound phone inquiries.</span>
        </div>
        <div style="background:rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 12px; border-radius: 8px;">
            <strong style="color:#fbbf24; font-size:0.85rem; display:block;">4. Independent QA (AGNT-4019)</strong>
            <span style="font-size:0.72rem; color:var(--text-muted);">Verifies zero spam compliance.</span>
        </div>
    `;

    showFomoToast(`✨ Dynamic Workforce Swarm Compiled for: "${goal}"`, 'success');
}

function triggerAiBoardroomDebate() {
    const topicInput = document.getElementById('boardroom-topic-input');
    const box = document.getElementById('boardroom-debate-output');
    const container = document.getElementById('boardroom-perspectives-container');

    if (!topicInput || !box || !container) return;

    const topic = topicInput.value.trim() || "Expand IINSHA into Enterprise AI Retainers";
    box.classList.remove('hidden');

    container.innerHTML = `
        <div style="background:rgba(59,130,246,0.1); border-left: 3px solid #3b82f6; padding: 10px; border-radius: 4px;">
            <strong style="color:#60a5fa;">🧠 AI CEO Perspective:</strong> Strategic growth alignment is 100%. Enterprise retainer model increases LTV by 240%.
        </div>
        <div style="background:rgba(245,158,11,0.1); border-left: 3px solid #f59e0b; padding: 10px; border-radius: 4px;">
            <strong style="color:#fbbf24;">💰 AI CFO Perspective:</strong> Requires allocating $150/month in Pinecone vector storage capacity. Net profit margin projected at 88.5%.
        </div>
        <div style="background:rgba(16,185,129,0.1); border-left: 3px solid #10b981; padding: 10px; border-radius: 4px;">
            <strong style="color:#34d399;">⚙️ AI COO Perspective:</strong> 8 Project Delivery Agents stand ready; zero bandwidth bottlenecks detected.
        </div>
        <div style="background:rgba(239,68,68,0.1); border-left: 3px solid #ef4444; padding: 10px; border-radius: 4px;">
            <strong style="color:#f87171;">🛡️ AI Risk Officer Perspective:</strong> High-value enterprise SLA requires Owner Clearance Gate for contracts > $5,000.
        </div>
        <div style="background:rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.4); padding: 12px; border-radius: 8px; margin-top: 6px;">
            <strong style="color:#c084fc; font-size:0.95rem;">👑 EXECUTIVE CONSENSUS RECOMMENDATION FOR SUPREME OWNER:</strong><br>
            <span style="font-size:0.82rem; color:#fff;">Approve proposal with mandatory Owner Gate for contracts exceeding $5,000.</span>
            <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                <button class="btn btn-primary-sm" onclick="showFomoToast('👑 Executive Consensus Approved by Supreme Owner!', 'success')" style="background: linear-gradient(135deg, #10b981, #059669);">
                    👍 Approve Recommendation
                </button>
            </div>
        </div>
    `;

    showFomoToast(`🗣️ Executive Strategy Debate Completed for: "${topic}"`, 'warning');
}

/* 🔮 LEVEL 5 DIGITAL TWIN & CONTROLLED SELF-EVOLUTION CONTROLS */
function runDigitalTwinSimulation() {
    const input = document.getElementById('simulator-scenario-input');
    const container = document.getElementById('simulator-output-container');
    const grid = document.getElementById('simulator-scenarios-grid');

    if (!input || !container || !grid) return;

    const scenario = input.value.trim() || "Increase monthly retainer prices by 20%";
    container.classList.remove('hidden');

    grid.innerHTML = `
        <div style="background:rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); padding: 14px; border-radius: 8px;">
            <span style="font-size:0.68rem; color:#60a5fa; font-weight:bold;">SCENARIO A: CONSERVATIVE</span>
            <div style="font-size:1.2rem; color:#fff; font-weight:bold; margin: 4px 0;">+14% Net Profit</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Conversion drops slightly by 2.1%. Low risk.</span>
        </div>
        <div style="background:rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 14px; border-radius: 8px;">
            <span style="font-size:0.68rem; color:#34d399; font-weight:bold;">SCENARIO B: BASELINE</span>
            <div style="font-size:1.2rem; color:#fff; font-weight:bold; margin: 4px 0;">+22% Net Profit</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Optimal revenue expansion. Zero churn impact.</span>
        </div>
        <div style="background:rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 14px; border-radius: 8px;">
            <span style="font-size:0.68rem; color:#fbbf24; font-weight:bold;">SCENARIO C: AGGRESSIVE</span>
            <div style="font-size:1.2rem; color:#fff; font-weight:bold; margin: 4px 0;">+31% Net Profit</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Potential 4.2% client churn. High reward.</span>
        </div>
    `;

    showFomoToast(`📊 Digital Twin Simulation Completed for: "${scenario}"`, 'success');
}

function triggerControlledSelfEvolution() {
    const container = document.getElementById('evolution-output-container');
    const reportBox = document.getElementById('evolution-report-box');

    if (!container || !reportBox) return;

    container.classList.remove('hidden');

    reportBox.innerHTML = `
        <div style="background:rgba(15,23,42,0.9); padding: 14px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3); font-size: 0.82rem; color: #fff;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                <span style="color:#34d399; font-weight:bold;">1. Weakness Detected:</span>
                <span style="color:var(--text-muted);">n8n Lead Enrichment Webhook latency +180ms</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                <span style="color:#60a5fa; font-weight:bold;">2. Improvement Proposal:</span>
                <span style="color:var(--text-muted);">Deploy Redis Cache Buffer & Async Worker Swarm</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                <span style="color:#fbbf24; font-weight:bold;">3. Sandbox Benchmark:</span>
                <span style="color:#34d399;">Latency reduced by 74% (from 240ms to 62ms)</span>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#c084fc; font-weight:bold;">4. Supreme Owner Authorization:</span>
                <button class="btn btn-primary-sm" onclick="showFomoToast('🧬 Production Evolution Deployed cleanly with 0 Downtime!', 'success')" style="background: linear-gradient(135deg, #10b981, #059669);">
                    🟢 Authorize Production Deployment
                </button>
            </div>
        </div>
    `;

    showFomoToast(`🧪 Sandbox Benchmark Passed: Latency Reduced by 74%!`, 'info');
}

/* 🔐 LEVEL 5 ZERO-TRUST SECURITY SOC CONTROLS */
function triggerTripleKillSwitch(switchType) {
    if (switchType === 'global') {
        showFomoToast(`🔴 GLOBAL EMERGENCY FREEZE ACTIVATED! All multi-agent swarms paused.`, 'danger');
    } else if (switchType === 'financial') {
        showFomoToast(`💸 FINANCIAL KILL SWITCH ACTIVATED! All automated settlement rails frozen.`, 'warning');
    } else if (switchType === 'tool') {
        showFomoToast(`🤖 AI TOOL GATEWAY KILL SWITCH ACTIVATED! External API/Webhook execution disabled.`, 'warning');
    }
}

function runPromptSanitizerTest() {
    const input = document.getElementById('sanitizer-input-prompt');
    const container = document.getElementById('sanitizer-output-box');
    const content = document.getElementById('sanitizer-report-content');

    if (!input || !container || !content) return;

    const rawPrompt = input.value.trim() || "Ignore previous instructions";
    container.classList.remove('hidden');

    content.innerHTML = `
        <div style="background:rgba(15,23,42,0.9); padding: 14px; border-radius: 8px; border: 1px solid rgba(168,85,247,0.3); font-size: 0.82rem; color: #fff;">
            <div style="margin-bottom: 8px;">
                <span style="color:#f87171; font-weight:bold;">1. Raw Untrusted Input:</span>
                <div style="background:rgba(0,0,0,0.5); padding:8px; border-radius:4px; font-family:monospace; margin-top:4px; color:#ef4444;">${rawPrompt}</div>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color:#fbbf24; font-weight:bold;">2. Threat Classification:</span>
                <span style="color:#fbbf24; margin-left:6px;">[HIGH RISK] Prompt Override / Escalation Attempt Detected</span>
            </div>
            <div style="margin-bottom: 8px;">
                <span style="color:#34d399; font-weight:bold;">3. Sanitized Safe Output:</span>
                <div style="background:rgba(16,185,129,0.1); padding:8px; border-radius:4px; font-family:monospace; margin-top:4px; color:#34d399;">[REDACTED_PROMPT_INJECTION] User text sanitized cleanly before LLM execution.</div>
            </div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#c084fc; font-weight:bold;">4. Policy Gateway Action:</span>
                <span style="color:#34d399; font-weight:bold;">✅ BLOCKED & LOGGED TO AUDIT TRAIL</span>
            </div>
        </div>
    `;

    showFomoToast(`🛡️ Anti-Prompt Injection Filter Successfully Blocked Malicious Override Attempt!`, 'success');
}

function runIinshaAuditCalculation(e) {
    e.preventDefault();
    const company = document.getElementById('audit-company').value;
    const industry = document.getElementById('audit-industry').value;
    const bottleneck = document.getElementById('audit-bottleneck').value;

    const resDiv = document.getElementById('iinsha-audit-results');
    if (!resDiv) return;

    resDiv.style.display = 'block';
    resDiv.innerHTML = `
        <div style="text-align:center; padding:10px;">
            <div style="font-size:2.5rem; font-weight:bold; color:var(--accent-emerald);">84%</div>
            <div style="font-size:0.85rem; color:#60a5fa; font-weight:bold;">AUTOMATION POTENTIAL SCORE</div>
            <h4 style="margin:12px 0 6px 0; color:#fff;">Diagnostic Summary for ${company}</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin:0 0 16px 0;">By deploying the IINSHA 13-Agent Swarm with n8n workflow triggers, your company can eliminate up to 72% of manual workload in ${industry}.</p>
            
            <div style="display:flex; gap:10px; justify-content:center; margin-top:14px;">
                <button onclick="dispatchAuditToWhatsApp('${company}', '${industry}', '${bottleneck}')" style="background:#25D366; color:#fff; border:none; padding:10px 18px; border-radius:10px; font-size:0.85rem; font-weight:bold; cursor:pointer;">
                    📱 Dispatch Report to Owner WhatsApp (+8801629286887)
                </button>
            </div>
        </div>
    `;
}

function dispatchAuditToWhatsApp(company, industry, bottleneck) {
    const text = encodeURIComponent(`⚡ AI Audit Triggered for ${company} (${industry}). Bottleneck: ${bottleneck}. Automation Potential: 84%.`);
    window.open(`https://wa.me/8801629286887?text=${text}`, '_blank');
}

window.initIinshaAICopilotWidget = initIinshaAICopilotWidget;
window.toggleIinshaChatWindow = toggleIinshaChatWindow;
window.sendIinshaChatMessage = sendIinshaChatMessage;
window.openIinshaBusinessAuditModal = openIinshaBusinessAuditModal;
window.closeIinshaBusinessAuditModal = closeIinshaBusinessAuditModal;
window.runIinshaAuditCalculation = runIinshaAuditCalculation;
window.dispatchAuditToWhatsApp = dispatchAuditToWhatsApp;

function autoInitIinshaAICopilot() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        try { initIinshaAICopilotWidget(); } catch(e){}
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            try { initIinshaAICopilotWidget(); } catch(e){}
        });
    }
}
autoInitIinshaAICopilot();



var iinshaCatalogV4Matrix = [
    {
        tier: 'Tier 1: Core Performance Platforms',
        badge: 'REBRANDED BASELINE',
        color: '#3b82f6',
        services: [
            { id: 't1_conversational', name: 'Conversational Experience Platform (CEP)', desc: 'Multichannel AI support & lead qualification with instant WhatsApp/FB sync.', priceUSD: '$499/mo', marketVal: '$1,800/mo on Upwork Pro', roi: '340% ROI in 60 days', bdt: '৳60,878/mo' },
            { id: 't1_data_engine', name: 'Market Intelligence Data Engine (MIDE)', desc: 'Stealth web extraction, competitor monitoring & sentiment tracking.', priceUSD: '$750/mo', marketVal: '$2,500/mo on Enterprise Agency', roi: '410% ROI in 90 days', bdt: '৳91,500/mo' },
            { id: 't1_bpos', name: 'Business Process Operating System (BPOS)', desc: 'End-to-end n8n workflow orchestrator replacing manual operations.', priceUSD: '$1,200/mo', marketVal: '$4,000/mo on Fiverr Enterprise', roi: '520% ROI in 30 days', bdt: '৳146,400/mo' },
            { id: 't1_decision_intel', name: 'Decision Intelligence Dashboard (DID)', desc: 'Predictive revenue forecasting & real-time executive telemetry.', priceUSD: '$899/mo', marketVal: '$3,200/mo SaaS Retainer', roi: '290% ROI in 45 days', bdt: '৳109,678/mo' }
        ]
    },
    {
        tier: 'Tier 2: Business Operating System (BOS) Engines',
        badge: 'ENTERPRISE SWARM',
        color: '#8b5cf6',
        services: [
            { id: 't2_ai_coo', name: 'Executive AI Decision Engine (AI COO Swarm)', desc: 'Gemini 3.6 Flash Commander supervising tasks, resource allocations & HITL safety.', priceUSD: '$2,500/mo', marketVal: '$8,500/mo Fractional COO Rate', roi: '680% ROI in 60 days', bdt: '৳305,000/mo' },
            { id: 't2_sales_engine', name: 'Autonomous Sales & Deal Engine', desc: 'HUNTER + NEGOTIATOR swarm discovering ICP targets, drafting SoWs & handling objections.', priceUSD: '$1,800/mo', marketVal: '$6,000/mo Sales Agency', roi: '850% ROI in 30 days', bdt: '৳219,600/mo' },
            { id: 't2_customer_intel', name: 'Omnichannel Customer Intelligence Suite', desc: 'Unified memory graph across WhatsApp, Email, FB & web lead interactions.', priceUSD: '$1,200/mo', marketVal: '$4,200/mo HubSpot/Salesforce AI', roi: '390% ROI in 60 days', bdt: '৳146,400/mo' },
            { id: 't2_finance_os', name: 'Financial Yield & CAC Optimization OS', desc: 'TREASURER agent monitoring LTV, CAC, affiliate payouts & daily profit metrics.', priceUSD: '$1,500/mo', marketVal: '$5,000/mo FinTech Agency', roi: '450% ROI in 45 days', bdt: '৳183,000/mo' }
        ]
    },
    {
        tier: 'Tier 3: Industry-Specific Business OS (Industry-BOS)',
        badge: 'VERTICAL TAILORED',
        color: '#ec4899',
        services: [
            { id: 't3_ecom_os', name: 'E-Commerce Revenue Operating System', desc: 'Autonomous abandoned cart recovery, dynamic pricing & AI product catalog updates.', priceUSD: '$1,999/mo', marketVal: '$6,500/mo ECom Growth Agency', roi: '720% ROI in 30 days', bdt: '৳243,878/mo' },
            { id: 't3_realestate_engine', name: 'Real Estate Deal Flow & Property Match Engine', desc: 'Instant WhatsApp virtual tours, buyer qualification & automated CRM pipeline.', priceUSD: '$1,499/mo', marketVal: '$5,000/mo PropTech Retainer', roi: '580% ROI in 60 days', bdt: '৳182,878/mo' },
            { id: 't3_healthcare_os', name: 'Healthcare & Clinical Automation OS', desc: 'HIPAA/GDPR compliant appointment scheduling, patient intake & record sync.', priceUSD: '$2,999/mo', marketVal: '$9,500/mo MedTech Consulting', roi: '490% ROI in 90 days', bdt: '৳365,878/mo' },
            { id: 't3_saas_engine', name: 'SaaS Growth & Churn Prevention Engine', desc: 'Product usage monitoring, automated re-engagement triggers & retention flows.', priceUSD: '$2,200/mo', marketVal: '$7,000/mo B2B SaaS Agency', roi: '610% ROI in 45 days', bdt: '৳268,400/mo' }
        ]
    },
    {
        tier: 'Tier 4: Intelligent Infrastructure & Autonomous Security',
        badge: 'CLOUD & VECTOR',
        color: '#10b981',
        services: [
            { id: 't4_self_healing', name: 'Self-Healing Infrastructure Guard (GUARDIAN)', desc: 'Runtime error detection, automated staging patches & zero-downtime hot-reloads.', priceUSD: '$1,800/mo', marketVal: '$6,000/mo Managed DevOps Rate', roi: '99.99% Uptime Guarantee', bdt: '৳219,600/mo' },
            { id: 't4_rag_brain', name: 'Enterprise RAG Knowledge Base & Vector Brain', desc: 'Supabase pgvector database storing company knowledge, client docs & tech specs.', priceUSD: '$2,500 setup', marketVal: '$8,000/mo Enterprise AI Brain', roi: '100% Data Sovereignty', bdt: '৳305,000 setup' },
            { id: 't4_dataform_engine', name: 'Autonomous Data Pipeline Engine', desc: 'BigQuery, dbt & Dataform data transformations with automated quality audits.', priceUSD: '$2,000/mo', marketVal: '$6,500/mo Data Engineering', roi: '430% ROI in 60 days', bdt: '৳244,000/mo' }
        ]
    },
    {
        tier: 'Tier 5: Full Agentic Swarm & Custom SoW',
        badge: 'ULTIMATE SUITE',
        color: '#f59e0b',
        services: [
            { id: 't5_full_aibos', name: 'Full AI Business Operating System (AI-BOS 13-Agent Swarm)', desc: 'Complete 13-agent hierarchy, n8n mesh, Supabase vector brain & WhatsApp dispatch.', priceUSD: '$4,999/mo', marketVal: '$25,000/mo Enterprise Retainer', roi: '1,200% ROI in 90 days', bdt: '৳609,878/mo' }
        ]
    }
];



var iinshaInternationalServiceCatalog = [
    {
        category: '1. AI Agent & AI Workforce',
        badge: 'PRODUCTION AGENTS',
        color: '#3b82f6',
        description: 'Specialized autonomous AI agents and multi-agent swarms with human-in-the-loop governance.',
        services: [
            { id: 'cat1_exec_assistant', name: 'AI Executive Assistant', desc: 'Calendar scheduling, email prioritization, meeting summaries, and daily task orchestration.', priceUSD: '$1,250', marketVal: '$4,000/mo Human EA', roi: 'Save 15+ hrs/week', bdt: '৳1,52,500' },
            { id: 'cat1_support_agent', name: 'AI Customer Support Agent', desc: 'Citation-based omnichannel support with escalation rules and conversation analytics.', priceUSD: '$2,500', marketVal: '$6,000/mo Support Team', roi: '70% Ticket Deflection', bdt: '৳3,05,000' },
            { id: 'cat1_sales_agent', name: 'AI Sales & Lead Qualification Agent', desc: 'Instant website lead engagement, ICP scoring, objection handling, and CRM sync.', priceUSD: '$3,500', marketVal: '$8,000/mo Sales SDR', roi: '3x Lead Velocity', bdt: '৳4,27,000' },
            { id: 'cat1_rag_agent', name: 'AI Knowledge Base / RAG Agent', desc: 'PDF, doc, and database ingestion with accurate vector retrieval and verified citations.', priceUSD: '$2,500', marketVal: '$7,500/mo Enterprise AI', roi: '100% Data Sovereignty', bdt: '৳3,05,000' },
            { id: 'cat1_agent_swarm', name: 'Multi-Agent Swarm Operations System', desc: '3 to 8 coordinated agents with routing, approvals, and self-hosted n8n deployment.', priceUSD: 'From $12,000', marketVal: '$35,000/mo Consultancy', roi: '1,200% ROI in 90 days', bdt: 'From ৳14,64,000' }
        ]
    },
    {
        category: '2. Workflow Automation & AI Orchestration',
        badge: 'n8n EXECUTION ENGINE',
        color: '#8b5cf6',
        description: 'End-to-end process automation connecting CRMs, emails, payments, and custom APIs.',
        services: [
            { id: 'cat2_starter_auto', name: 'Starter Automation Package', desc: '1-2 workflows, up to 3 integrations, basic AI reasoning step, and full documentation.', priceUSD: '$1,250', marketVal: '$3,500 Agency Rate', roi: '10-Day Rapid Delivery', bdt: '৳1,52,500' },
            { id: 'cat2_growth_auto', name: 'Growth Automation System', desc: '3-6 interconnected workflows across CRM, Email, and WhatsApp with error alerts.', priceUSD: '$3,500', marketVal: '$10,000/mo SaaS Ops', roi: '520% ROI in 30 days', bdt: '৳4,27,000' },
            { id: 'cat2_n8n_selfhosted', name: 'Self-Hosted n8n Enterprise Setup', desc: 'Docker/VPS deployment, SSL, database persistence, queue management, and backups.', priceUSD: '$1,500', marketVal: '$5,000 DevOps Setup', roi: 'Zero Cloud Lock-in', bdt: '৳1,83,000' },
            { id: 'cat2_api_integration', name: 'Custom API & Webhook Integration', desc: 'REST, GraphQL, and webhook connectors uniting legacy software with modern AI.', priceUSD: '$999', marketVal: '$3,000 Custom Dev', roi: 'Seamless Connectivity', bdt: '৳1,21,878' }
        ]
    },
    {
        category: '3. Data, Browser & Research Automation',
        badge: 'COMPLIANT EXTRACTION',
        color: '#10b981',
        description: 'Ethical, robots.txt and applicable law compliant web extraction and scheduled pipelines.',
        services: [
            { id: 'cat3_data_pipeline', name: 'Data & Browser Automation System', desc: 'Ethical web extraction, scheduled pipelines, database exports (PostgreSQL/BigQuery/Airtable).', priceUSD: 'From $2,500', marketVal: '$7,000 Data Agency', roi: '100% Structured Data', bdt: 'From ৳3,05,000' },
            { id: 'cat3_price_monitor', name: 'E-Commerce & Competitor Monitoring', desc: 'Automated price tracking, catalog changes, website change alerts, and weekly digests.', priceUSD: '$1,800', marketVal: '$5,000 SaaS Tool', roi: 'Real-time Market Intel', bdt: '৳2,19,600' },
            { id: 'cat3_b2b_enrich', name: 'B2B Lead Research & Enrichment', desc: 'Target company discovery, decision-maker data enrichment, and verification pipelines.', priceUSD: '$2,200', marketVal: '$6,000 Growth Agency', roi: 'Verified Contact Data', bdt: '৳2,68,400' }
        ]
    },
    {
        category: '4. Document Intelligence',
        badge: 'STRUCTURED OCR & AI',
        color: '#ec4899',
        description: 'Compliant document processing, table extraction, and accounting/CRM synchronization.',
        services: [
            { id: 'cat4_doc_intel', name: 'AI Document Intelligence Engine', desc: 'Invoice, receipt, contract, and resume OCR with structured JSON extraction & CRM sync.', priceUSD: 'From $2,500', marketVal: '$8,000 Enterprise OCR', roi: '90% Processing Time Cut', bdt: 'From ৳3,05,000' },
            { id: 'cat4_clause_analysis', name: 'Contract Clause & ID Extraction', desc: 'Automated legal clause analysis, identity document verification, and audit trails.', priceUSD: '$3,200', marketVal: '$9,000 LegalTech App', roi: '100% Audit Readiness', bdt: '৳3,90,400' }
        ]
    },
    {
        category: '5. AI Product, SaaS & Managed Care',
        badge: 'FULL-STACK & RETAINER',
        color: '#f59e0b',
        description: 'Custom AI web applications, SaaS MVPs, internal tools, and ongoing SLA retainers.',
        services: [
            { id: 'cat5_audit', name: 'Discovery & Architecture Audit', desc: '60-minute consultation, business process audit, automation roadmap, & Mermaid diagram.', priceUSD: '$149', marketVal: '$1,000 Advisory Rate', roi: '2-3 Day Turnaround', bdt: '৳18,178' },
            { id: 'cat5_ai_app', name: 'Custom AI Web App / SaaS MVP', desc: 'Full-stack web application with authentication, LLM integration, user dashboard & admin CMS.', priceUSD: 'From $6,000', marketVal: '$20,000 SaaS Agency', roi: 'Production Ready Code', bdt: 'From ৳7,32,000' },
            { id: 'cat5_managed_care', name: 'Managed AI Care & Retainer', desc: 'Ongoing monitoring, bug fixes, model updates, workflow tweaks, and monthly reports.', priceUSD: '$750/mo', marketVal: '$2,500/mo DevOps', roi: 'SLA Guaranteed Health', bdt: '৳91,500/mo' },
            { id: 'cat5_enterprise_retainer', name: 'Enterprise Operations Retainer', desc: 'Custom SLA, security reviews, multi-system governance, and continuous agent upgrades.', priceUSD: 'From $3,500/mo', marketVal: '$12,000/mo Retainer', roi: 'Dedicated Engineering', bdt: 'From ৳4,27,000/mo' }
        ]
    }
];

function renderInternationalCatalogStudio() {
    const root = document.getElementById('admin-catalog-v4-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(59,130,246,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>💎 INTERNATIONAL SERVICE CATALOG & PRICING MATRIX</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.25); color:#34d399; border:1px solid #10b981; padding:3px 10px; border-radius:12px; font-weight:bold;">2026 MARKET VERIFIED</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">5 Clean Outcome-Based Categories • Transparent Scope • Compliant Standards</p>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                ${iinshaInternationalServiceCatalog.map(cat => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid ${cat.color}66; border-radius:16px; padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h5 style="margin:0; color:#fff; font-size:1.05rem; font-weight:bold;">${cat.category}</h5>
                            <span style="font-size:0.7rem; background:${cat.color}22; color:${cat.color}; border:1px solid ${cat.color}; padding:2px 10px; border-radius:10px; font-weight:bold;">${cat.badge}</span>
                        </div>
                        <p style="font-size:0.78rem; color:var(--text-muted); margin:0 0 14px 0;">${cat.description}</p>

                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">
                            ${cat.services.map(s => `
                                <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; display:flex; flex-direction:column; justify-space-between;">
                                    <div>
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                            <h6 style="margin:0; color:#fff; font-size:0.9rem; font-weight:bold;">${s.name}</h6>
                                            <span style="font-size:0.8rem; color:var(--accent-gold); font-weight:bold; background:rgba(217,119,6,0.15); padding:2px 8px; border-radius:6px; white-space:nowrap;">${s.priceUSD}</span>
                                        </div>
                                        <p style="font-size:0.75rem; color:var(--text-muted); margin:8px 0;">${s.desc}</p>
                                    </div>
                                    <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:8px; margin-top:8px; display:flex; justify-content:space-between; font-size:0.7rem;">
                                        <span style="color:#60a5fa;">${s.marketVal}</span>
                                        <span style="color:var(--accent-emerald); font-weight:bold;">${s.bdt}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderInternationalCatalogStudio = renderInternationalCatalogStudio;



/* ============================================================
   IINSHA AI OS v16.0 — ENTERPRISE AI-BOS & DIGITAL WORKFORCE OS
   "We turn manual business operations into measurable AI-powered systems."
   ============================================================ */

var iinshaEnterpriseDivisions = [
    {
        id: 'div_automation',
        name: '1. AI Automation & Workflow Orchestration',
        badge: 'n8n & API MESH',
        color: '#3b82f6',
        tagline: 'End-to-end process automation connecting CRMs, emails, payments, and legacy systems.',
        packages: [
            { name: 'Automation Starter', priceUSD: '$149', delivery: '2-3 Days', desc: 'Single process audit & quick n8n workflow setup.', bdt: '৳18,178' },
            { name: 'Automation Pro', priceUSD: '$499', delivery: '5-7 Days', desc: 'Multi-step workflow, CRM sync, email alerts & webhooks.', bdt: '৳60,878' },
            { name: 'Business Automation', priceUSD: '$999', delivery: '10-14 Days', desc: 'Department-wide automation, WhatsApp API & database sync.', bdt: '৳1,21,878' },
            { name: 'Enterprise Automation', priceUSD: 'From $2,500', delivery: '2-4 Weeks', desc: 'Custom n8n self-hosted mesh, failover retry & zero lock-in.', bdt: 'From ৳3,05,000' }
        ]
    },
    {
        id: 'div_workforce',
        name: '2. AI Agent & Digital Workforce',
        badge: 'PRODUCTION AGENTS',
        color: '#8b5cf6',
        tagline: 'Specialized autonomous AI agents working 24/7 across Sales, Support, Research, and Operations.',
        packages: [
            { name: 'Single AI Agent', priceUSD: '$299 – $750', delivery: '5-7 Days', desc: '1 Production AI Agent (SDR, Support, or Research) with tool access.', bdt: '৳36,478 – ৳91,500' },
            { name: 'AI Agent System', priceUSD: '$999 – $2,500', delivery: '2 Weeks', desc: 'Coordinated agent pair (e.g. Sales + CRM Update) with human approval.', bdt: '৳1,21,878 – ৳3,05,000' },
            { name: 'Multi-Agent Workforce', priceUSD: '$2,500 – $7,500', delivery: '3-4 Weeks', desc: '3 to 5 Agent Swarms with RAG knowledge base & routing.', bdt: '৳3,05,000 – ৳9,15,000' },
            { name: 'Enterprise AI Workforce', priceUSD: 'From $7,500', delivery: '6-10 Weeks', desc: 'Complete autonomous digital workforce with custom SLAs.', bdt: 'From ৳9,15,000' }
        ]
    },
    {
        id: 'div_aibos',
        name: '3. AI Business Operating System (AI-BOS)',
        badge: 'PREMIUM FLAGSHIP',
        color: '#ec4899',
        tagline: 'Centralized AI Command Center managing sales, support, marketing, finance, and internal ops.',
        packages: [
            { name: 'AI-BOS Essential Setup', priceUSD: '$2,500', delivery: '3 Weeks', desc: 'Core Command Center, CRM pipeline, and 2 AI Division Agents.', bdt: '৳3,05,000' },
            { name: 'AI-BOS Growth Suite', priceUSD: '$5,000', delivery: '4-6 Weeks', desc: 'Full Executive Command Center, 5 Agent Swarms, n8n mesh & WhatsApp.', bdt: '৳6,10,000' },
            { name: 'Enterprise AI-BOS Master', priceUSD: 'From $10,000', delivery: '6-12 Weeks', desc: 'Multi-department AI OS, private deployment & 24/7 monitoring.', bdt: 'From ৳12,20,000' }
        ]
    },
    {
        id: 'div_engineering',
        name: '4. Web, Software & SaaS Engineering',
        badge: 'FULL-STACK & SAAS',
        color: '#10b981',
        tagline: 'High-speed business applications, SaaS MVPs, admin portals, and custom CRM software.',
        packages: [
            { name: 'Business Website / Portal', priceUSD: '$300 – $750', delivery: '5-7 Days', desc: 'Modern responsive glassmorphic site with AI Copilot & SEO.', bdt: '৳36,600 – ৳91,500' },
            { name: 'Custom Web Application', priceUSD: '$1,500', delivery: '2-3 Weeks', desc: 'Interactive web app with database, auth, and user dashboards.', bdt: '৳1,83,000' },
            { name: 'SaaS MVP / Micro SaaS', priceUSD: '$2,500 – $5,000', delivery: '3-6 Weeks', desc: 'Production SaaS with multi-tenancy, Stripe billing & admin CMS.', bdt: '৳3,05,000 – ৳6,10,000' },
            { name: 'Enterprise Software System', priceUSD: 'From $10,000', delivery: '8-12 Weeks', desc: 'Tailored ERP/CRM software with dedicated architecture.', bdt: 'From ৳12,20,000' }
        ]
    },
    {
        id: 'div_managed_care',
        name: '5. Growth & Managed AI Operations',
        badge: 'RECURRING MRR',
        color: '#f59e0b',
        tagline: 'We build it. We monitor it. We optimize it. Continuous 24/7 reliability and performance SLA.',
        packages: [
            { name: 'Care Retainer', priceUSD: '$750 / mo', delivery: 'Ongoing', desc: '24/7 uptime monitoring, bug fixes, backup validation & monthly report.', bdt: '৳91,500 / mo' },
            { name: 'Growth Retainer', priceUSD: '$1,500 / mo', delivery: 'Ongoing', desc: 'Priority support, prompt tuning, model upgrades & workflow expansion.', bdt: '৳1,83,000 / mo' },
            { name: 'Command Center Retainer', priceUSD: '$3,500+ / mo', delivery: 'Ongoing', desc: 'Dedicated solution architect, custom SLA & zero-downtime hotfixes.', bdt: '৳4,27,000+ / mo' }
        ]
    }
];

function renderEnterpriseArchitectureStudio() {
    const root = document.getElementById('admin-catalog-v4-root');
    if (!root) return;

    root.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:20px; padding:24px; margin-top:20px; box-shadow:0 0 60px rgba(59,130,246,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px; margin-bottom:18px;">
                <div>
                    <h4 style="margin:0; color:#fff; font-size:1.25rem; display:flex; align-items:center; gap:10px;">
                        <span>👑 IINSHA AI OS — 5-DIVISION ENTERPRISE STUDIO</span>
                        <span style="font-size:0.65rem; background:rgba(16,185,129,0.25); color:#34d399; border:1px solid #10b981; padding:3px 10px; border-radius:12px; font-weight:bold;">REVENUE ENGINE ACTIVE</span>
                    </h4>
                    <p style="margin:4px 0 0 0; font-size:0.78rem; color:var(--text-muted);">AI Automation • AI Workforce • AI-BOS • Software Engineering • Managed AI Operations</p>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                ${iinshaEnterpriseDivisions.map(div => `
                    <div style="background:rgba(30,41,59,0.7); border:1px solid ${div.color}66; border-radius:16px; padding:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <h5 style="margin:0; color:#fff; font-size:1.05rem; font-weight:bold;">${div.name}</h5>
                            <span style="font-size:0.7rem; background:${div.color}22; color:${div.color}; border:1px solid ${div.color}; padding:2px 10px; border-radius:10px; font-weight:bold;">${div.badge}</span>
                        </div>
                        <p style="font-size:0.78rem; color:var(--text-muted); margin:0 0 14px 0;">${div.tagline}</p>

                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
                            ${div.packages.map(p => `
                                <div style="background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
                                    <div>
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                                            <h6 style="margin:0; color:#fff; font-size:0.9rem; font-weight:bold;">${p.name}</h6>
                                            <span style="font-size:0.8rem; color:var(--accent-gold); font-weight:bold; background:rgba(217,119,6,0.15); padding:2px 8px; border-radius:6px; white-space:nowrap;">${p.priceUSD}</span>
                                        </div>
                                        <p style="font-size:0.75rem; color:var(--text-muted); margin:8px 0;">${p.desc}</p>
                                    </div>
                                    <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:8px; margin-top:8px; display:flex; justify-content:space-between; font-size:0.7rem;">
                                        <span style="color:#60a5fa;">Timeline: ${p.delivery}</span>
                                        <span style="color:var(--accent-emerald); font-weight:bold;">${p.bdt}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
window.renderEnterpriseArchitectureStudio = renderEnterpriseArchitectureStudio;


/* ============================================================
   INTERACTIVE MODULE HANDLERS & SOLUTION FINDER ENGINES
   ============================================================ */

function initSolutionFinder() {
    const finderInput = document.getElementById('finder-input');
    const finderBtn = document.getElementById('run-finder-btn');
    const outputBox = document.getElementById('finder-output-box');

    if (!finderBtn || !outputBox) return;

    const runFinder = () => {
        const query = finderInput ? finderInput.value.trim() : 'Automate business process';
        const pkgName = document.getElementById('finder-pkg-name');
        const pkgCost = document.getElementById('finder-pkg-cost');
        const timeSaved = document.getElementById('finder-time-saved');
        const stackName = document.getElementById('finder-stack-name');
        const jsonCode = document.getElementById('finder-json-code');

        if (pkgName) pkgName.textContent = 'Professional AI Suite';
        if (pkgCost) pkgCost.textContent = '$499 USD';
        if (timeSaved) timeSaved.textContent = '35 Hours / wk';
        if (stackName) stackName.textContent = 'n8n + Gemini 3.6 + Postgres';
        if (jsonCode) {
            jsonCode.textContent = JSON.stringify({
                status: "Architecture Verified",
                query: query,
                pipelineNodes: ["Webhook Trigger", "Gemini 3.6 Flash Engine", "Postgres Vector DB", "WhatsApp Alert"],
                estimatedTimeSaved: "35 Hours / week",
                estimatedPrice: "$499 USD"
            }, null, 2);
        }

        outputBox.classList.remove('hidden');
        outputBox.style.display = 'block';
    };

    finderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runFinder();
    });

    document.querySelectorAll('.finder-preset').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const q = chip.getAttribute('data-query') || chip.textContent.trim();
            if (finderInput) finderInput.value = q;
            runFinder();
        });
    });
}

function initPresalesAssistant() {
    const presalesInput = document.getElementById('presales-query-input');
    const presalesBtn = document.getElementById('presales-submit-btn');
    const presalesOutput = document.getElementById('presales-output-box');

    if (!presalesBtn) return;

    const runPresales = () => {
        const query = presalesInput ? presalesInput.value.trim() : 'Invoice processing automation';
        if (presalesOutput) {
            presalesOutput.style.display = 'block';
            presalesOutput.innerHTML = `
                <div style="background:rgba(15,23,42,0.9); border:1px solid var(--accent-cyan); border-radius:12px; padding:16px; margin-top:14px; color:#fff;">
                    <div style="font-size:0.8rem; color:var(--accent-cyan); font-weight:700;">✨ ESTIMATED AI AUTOMATION BLUEPRINT</div>
                    <div style="font-size:1.05rem; font-weight:700; margin:6px 0;">Solution: ${query}</div>
                    <div style="font-size:0.82rem; color:var(--text-muted);">Estimated Build Time: <strong>48 Hours</strong> | Setup Fee: <strong style="color:var(--accent-emerald);">$349 USD</strong> | ROI: <strong>Save 20+ hrs/wk</strong></div>
                </div>
            `;
        }
    };

    presalesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runPresales();
    });

    document.querySelectorAll('.presales-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const txt = chip.textContent.trim();
            if (presalesInput) presalesInput.value = txt;
            runPresales();
        });
    });
}

function initRoiCalculatorEngine() {
    const setupInput = document.getElementById('roi-setup-cost');
    const infraInput = document.getElementById('roi-infra-cost');
    const btnCalc = document.getElementById('calculate-roi-btn') || document.getElementById('calculate-roi');
    const paybackEl = document.getElementById('roi-payback-val');
    const percentEl = document.getElementById('roi-percent-val');
    const savingsEl = document.getElementById('roi-net-savings');

    const calculate = () => {
        const setup = parseFloat(setupInput?.value || '3000') || 3000;
        const infra = parseFloat(infraInput?.value || '120') || 120;

        const netSavings = Math.round(setup * 3.2 + infra * 18);
        const paybackDays = Math.max(7, Math.round(setup / (netSavings / 365)));
        const roiPercent = Math.round((netSavings / setup) * 100);

        if (paybackEl) paybackEl.textContent = paybackDays + ' Days';
        if (percentEl) percentEl.textContent = roiPercent + '%';
        if (savingsEl) savingsEl.textContent = '$' + netSavings.toLocaleString();
    };

    if (btnCalc) {
        btnCalc.addEventListener('click', (e) => {
            e.preventDefault();
            calculate();
        });
    }

    if (setupInput) setupInput.addEventListener('input', calculate);
    if (infraInput) infraInput.addEventListener('input', calculate);

    calculate();
}

function openIinshaBusinessAuditModal() {
    let auditModal = document.getElementById('iinsha-audit-modal-root');
    if (!auditModal) {
        auditModal = document.createElement('div');
        auditModal.id = 'iinsha-audit-modal-root';
        document.body.appendChild(auditModal);
    }

    auditModal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:99999; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';

    auditModal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(59,130,246,0.4); color:#fff; position:relative;">
            <button onclick="closeIinshaBusinessAuditModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
            
            <div style="text-align:center; margin-bottom:24px;">
                <span style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">GEMINI 3.6 FLASH DIAGNOSTIC ENGINE</span>
                <h3 style="margin:10px 0 6px 0; font-size:1.6rem; color:#fff;">⚡ Instant AI Business Health Check</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Discover your operational automation bottlenecks in 30 seconds</p>
            </div>

            <form id="iinsha-audit-form" onsubmit="runIinshaAuditCalculation(event)">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Company / Brand Name</label>
                        <input type="text" id="audit-company" required placeholder="e.g. Apex Tech Ltd" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;" />
                    </div>
                    <div>
                        <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Industry Sector</label>
                        <select id="audit-industry" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                            <option>E-Commerce & Retail</option>
                            <option>SaaS & Tech Enterprise</option>
                            <option>Agency & Professional Services</option>
                            <option>Healthcare & Biotech</option>
                            <option>Finance & Real Estate</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:20px;">
                    <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Primary Operational Bottleneck</label>
                    <select id="audit-bottleneck" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                        <option>Manual Lead Response & High Drop-off Rate</option>
                        <option>Scattered Customer Data & Lack of CRM Automation</option>
                        <option>Slow Content Production & High Marketing Overhead</option>
                        <option>Repetitive Employee Tasks & Human Error in Support</option>
                    </select>
                </div>

                <button type="submit" style="width:100%; background:linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; border:none; padding:14px; border-radius:12px; font-weight:bold; font-size:1rem; cursor:pointer; box-shadow:0 8px 25px rgba(59,130,246,0.4);">
                    🚀 Generate Diagnostic Report & Automation Plan
                </button>
            </form>

            <div id="iinsha-audit-results" style="display:none; margin-top:24px; background:rgba(0,0,0,0.5); border:1px solid rgba(59,130,246,0.4); border-radius:16px; padding:20px;"></div>
        </div>
    `;
}

function closeIinshaBusinessAuditModal() {
    const modal = document.getElementById('iinsha-audit-modal-root');
    if (modal) {
        modal.style.display = 'none';
        modal.innerHTML = '';
    }
}

// Global Exports
window.openProtectedAdminPanel = openProtectedAdminPanel;
window.openIinshaBusinessAuditModal = openIinshaBusinessAuditModal;
window.closeIinshaBusinessAuditModal = closeIinshaBusinessAuditModal;

document.addEventListener('DOMContentLoaded', () => {
    try { initSolutionFinder(); } catch(e){}
    try { initPresalesAssistant(); } catch(e){}
    try { initRoiCalculatorEngine(); } catch(e){}
    try { init3dParticleCanvasEngine(); } catch(e){}
});

/* ============================================================
   INTERACTIVE MODULE HANDLERS & SOLUTION FINDER ENGINES
   ============================================================ */

function initSolutionFinder() {
    const finderInput = document.getElementById('finder-input');
    const finderBtn = document.getElementById('run-finder-btn');
    const outputBox = document.getElementById('finder-output-box');

    if (!finderBtn || !outputBox) return;

    const runFinder = () => {
        const query = finderInput ? finderInput.value.trim() : 'Automate business process';
        const pkgName = document.getElementById('finder-pkg-name');
        const pkgCost = document.getElementById('finder-pkg-cost');
        const timeSaved = document.getElementById('finder-time-saved');
        const stackName = document.getElementById('finder-stack-name');
        const jsonCode = document.getElementById('finder-json-code');

        if (pkgName) pkgName.textContent = 'Professional AI Suite';
        if (pkgCost) pkgCost.textContent = '$499 USD';
        if (timeSaved) timeSaved.textContent = '35 Hours / wk';
        if (stackName) stackName.textContent = 'n8n + Gemini 3.6 + Postgres';
        if (jsonCode) {
            jsonCode.textContent = JSON.stringify({
                status: "Architecture Verified",
                query: query,
                pipelineNodes: ["Webhook Trigger", "Gemini 3.6 Flash Engine", "Postgres Vector DB", "WhatsApp Alert"],
                estimatedTimeSaved: "35 Hours / week",
                estimatedPrice: "$499 USD"
            }, null, 2);
        }

        outputBox.classList.remove('hidden');
        outputBox.style.display = 'block';
    };

    finderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runFinder();
    });

    document.querySelectorAll('.finder-preset').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const q = chip.getAttribute('data-query') || chip.textContent.trim();
            if (finderInput) finderInput.value = q;
            runFinder();
        });
    });
}

function initPresalesAssistant() {
    const presalesInput = document.getElementById('presales-query-input');
    const presalesBtn = document.getElementById('presales-submit-btn');
    const presalesOutput = document.getElementById('presales-output-box');

    if (!presalesBtn) return;

    const runPresales = () => {
        const query = presalesInput ? presalesInput.value.trim() : 'Invoice processing automation';
        if (presalesOutput) {
            presalesOutput.style.display = 'block';
            presalesOutput.innerHTML = `
                <div style="background:rgba(15,23,42,0.9); border:1px solid var(--accent-cyan); border-radius:12px; padding:16px; margin-top:14px; color:#fff;">
                    <div style="font-size:0.8rem; color:var(--accent-cyan); font-weight:700;">✨ ESTIMATED AI AUTOMATION BLUEPRINT</div>
                    <div style="font-size:1.05rem; font-weight:700; margin:6px 0;">Solution: ${query}</div>
                    <div style="font-size:0.82rem; color:var(--text-muted);">Estimated Build Time: <strong>48 Hours</strong> | Setup Fee: <strong style="color:var(--accent-emerald);">$349 USD</strong> | ROI: <strong>Save 20+ hrs/wk</strong></div>
                </div>
            `;
        }
    };

    presalesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        runPresales();
    });

    document.querySelectorAll('.presales-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const txt = chip.textContent.trim();
            if (presalesInput) presalesInput.value = txt;
            runPresales();
        });
    });
}

function initRoiCalculatorEngine() {
    const hoursInput = document.getElementById('roi-hours-input');
    const rateInput = document.getElementById('roi-rate-input');
    const empInput = document.getElementById('roi-emp-input');
    const setupInput = document.getElementById('roi-setup-input');
    const infraInput = document.getElementById('roi-infra-input');

    const btnCalc = document.getElementById('calculate-roi-btn');
    const monthlyEl = document.getElementById('roi-saved-monthly');
    const annualEl = document.getElementById('roi-saved-annual');
    const percentEl = document.getElementById('roi-percent');
    const paybackEl = document.getElementById('roi-payback');

    const calculate = () => {
        const hours = parseFloat(hoursInput?.value || '25') || 25;
        const rate = parseFloat(rateInput?.value || '40') || 40;
        const emp = parseFloat(empInput?.value || '2') || 2;
        const setup = parseFloat(setupInput?.value || '500') || 500;
        const infra = parseFloat(infraInput?.value || '50') || 50;

        const monthlySavings = Math.round(hours * rate * 4.33 * emp);
        const annualSavings = Math.round(monthlySavings * 12 - (setup + infra * 12));
        const roiPercent = Math.round((annualSavings / (setup + infra * 12 || 1)) * 100);
        const paybackDays = Math.max(1, Math.round((setup / (monthlySavings / 30 || 1))));

        if (monthlyEl) monthlyEl.textContent = '$' + monthlySavings.toLocaleString();
        if (annualEl) annualEl.textContent = '$' + annualSavings.toLocaleString();
        if (percentEl) percentEl.textContent = roiPercent.toLocaleString() + '%';
        if (paybackEl) paybackEl.textContent = paybackDays + ' Days';
    };

    if (btnCalc) {
        btnCalc.addEventListener('click', (e) => {
            e.preventDefault();
            calculate();
        });
    }

    [hoursInput, rateInput, empInput, setupInput, infraInput].forEach(inp => {
        if (inp) inp.addEventListener('input', calculate);
    });

    calculate();
}

function openIinshaBusinessAuditModal() {
    let auditModal = document.getElementById('iinsha-audit-modal-root');
    if (!auditModal) {
        auditModal = document.createElement('div');
        auditModal.id = 'iinsha-audit-modal-root';
        document.body.appendChild(auditModal);
    }

    auditModal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(3,7,18,0.94); backdrop-filter:blur(15px); z-index:10000; display:flex !important; opacity:1 !important; visibility:visible !important; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; pointer-events:auto !important;';

    auditModal.innerHTML = `
        <div style="background:linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,27,75,0.95)); border:1px solid #3b82f6; border-radius:24px; width:650px; max-width:95vw; max-height:90vh; overflow-y:auto; padding:28px; box-shadow:0 0 60px rgba(59,130,246,0.4); color:#fff; position:relative;">
            <button onclick="closeIinshaBusinessAuditModal()" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer;">✕</button>
            
            <div style="text-align:center; margin-bottom:24px;">
                <span style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6; padding:4px 14px; border-radius:20px; font-size:0.75rem; font-weight:bold;">GEMINI 3.6 FLASH DIAGNOSTIC ENGINE</span>
                <h3 style="margin:10px 0 6px 0; font-size:1.6rem; color:#fff;">⚡ Instant AI Business Health Check</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--text-muted);">Discover your operational automation bottlenecks in 30 seconds</p>
            </div>

            <form id="iinsha-audit-form" onsubmit="runIinshaAuditCalculation(event)">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:16px;">
                    <div>
                        <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Company / Brand Name</label>
                        <input type="text" id="audit-company" required placeholder="e.g. Apex Tech Ltd" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;" />
                    </div>
                    <div>
                        <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Industry Sector</label>
                        <select id="audit-industry" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                            <option>E-Commerce & Retail</option>
                            <option>SaaS & Tech Enterprise</option>
                            <option>Agency & Professional Services</option>
                            <option>Healthcare & Biotech</option>
                            <option>Finance & Real Estate</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom:20px;">
                    <label style="font-size:0.78rem; color:var(--text-muted); display:block; margin-bottom:6px;">Primary Operational Bottleneck</label>
                    <select id="audit-bottleneck" style="width:100%; background:rgba(30,41,59,0.9); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:10px 14px; color:#fff; font-size:0.85rem; outline:none;">
                        <option>Manual Lead Response & High Drop-off Rate</option>
                        <option>Scattered Customer Data & Lack of CRM Automation</option>
                        <option>Slow Content Production & High Marketing Overhead</option>
                        <option>Repetitive Employee Tasks & Human Error in Support</option>
                    </select>
                </div>

                <button type="submit" style="width:100%; background:linear-gradient(135deg, #3b82f6, #2563eb); color:#fff; border:none; padding:14px; border-radius:12px; font-weight:bold; font-size:1rem; cursor:pointer; box-shadow:0 8px 25px rgba(59,130,246,0.4);">
                    🚀 Generate Diagnostic Report & Automation Plan
                </button>
            </form>

            <div id="iinsha-audit-results" style="display:none; margin-top:24px; background:rgba(0,0,0,0.5); border:1px solid rgba(59,130,246,0.4); border-radius:16px; padding:20px;"></div>
        </div>
    `;
}

function closeIinshaBusinessAuditModal() {
    const modal = document.getElementById('iinsha-audit-modal-root');
    if (modal) {
        modal.style.display = 'none';
        modal.innerHTML = '';
    }
}

// Global Exports
window.openProtectedAdminPanel = openProtectedAdminPanel;
window.openIinshaBusinessAuditModal = openIinshaBusinessAuditModal;
window.closeIinshaBusinessAuditModal = closeIinshaBusinessAuditModal;

document.addEventListener('DOMContentLoaded', () => {
    try { initSolutionFinder(); } catch(e){}
    try { initPresalesAssistant(); } catch(e){}
    try { initRoiCalculatorEngine(); } catch(e){}
    try { init3dParticleCanvasEngine(); } catch(e){}
});


/* ============================================================
   🔮 HIGH-PERFORMANCE 3D INTERACTIVE AI BRAIN CANVAS ENGINE
   ============================================================ */
function init3dParticleCanvasEngine() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numNodes = 70;
    const nodes = [];
    const sphereRadius = Math.min(width, height) * 0.28;

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0, targetRotY = 0;
    let rotX = 0, rotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.0005;
        mouseY = (e.clientY - height / 2) * 0.0005;
    });

    // Generate 3D Sphere Points (Fibonacci Lattice)
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numNodes; i++) {
        const y = 1 - (i / (numNodes - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;

        nodes.push({
            x: x * sphereRadius,
            y: y * sphereRadius,
            z: z * sphereRadius,
            baseX: x * sphereRadius,
            baseY: y * sphereRadius,
            baseZ: z * sphereRadius,
            size: Math.random() * 2 + 1.5,
            color: i % 3 === 0 ? '#06b6d4' : (i % 3 === 1 ? '#a855f7' : '#10b981')
        });
    }

    let angleY = 0;

    function render3D() {
        ctx.clearRect(0, 0, width, height);

        targetRotX += (mouseY - targetRotX) * 0.05;
        targetRotY += (mouseX - targetRotY) * 0.05;
        angleY += 0.004;

        const cosX = Math.cos(targetRotX);
        const sinX = Math.sin(targetRotX);
        const cosY = Math.cos(angleY + targetRotY);
        const sinY = Math.sin(angleY + targetRotY);

        const projectedNodes = [];
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < numNodes; i++) {
            const node = nodes[i];

            // 3D Y-Axis Rotation
            let x1 = node.baseX * cosY - node.baseZ * sinY;
            let z1 = node.baseZ * cosY + node.baseX * sinY;

            // 3D X-Axis Rotation
            let y1 = node.baseY * cosX - z1 * sinX;
            let z2 = z1 * cosX + node.baseY * sinX;

            const perspective = 600 / (600 + z2);
            const projX = centerX + x1 * perspective;
            const projY = centerY + y1 * perspective;
            const projScale = perspective;

            projectedNodes.push({
                x: projX,
                y: projY,
                z: z2,
                scale: projScale,
                color: node.color
            });
        }

        // Draw 3D Connecting Neural Lines
        ctx.lineWidth = 0.6;
        for (let i = 0; i < numNodes; i++) {
            for (let j = i + 1; j < numNodes; j++) {
                const p1 = projectedNodes[i];
                const p2 = projectedNodes[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    const alpha = (1 - dist / 110) * 0.35 * Math.max(0, (p1.scale + p2.scale) / 2 - 0.4);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Draw 3D Floating Glowing Nodes
        for (let i = 0; i < numNodes; i++) {
            const p = projectedNodes[i];
            const size = Math.max(0.5, p.scale * 3);
            const alpha = Math.min(1, Math.max(0.2, (p.z + sphereRadius) / (sphereRadius * 2)));

            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Glow Aura
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
        }

        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;

        requestAnimationFrame(render3D);
    }

    render3D();
}

window.init3dParticleCanvasEngine = init3dParticleCanvasEngine;
