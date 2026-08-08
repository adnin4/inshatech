import re

def fix_all_missing_ibos_helpers():
    with open('app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Define all missing helper functions cleanly at top of IBOS section
    helpers = '''
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
'''

    if 'function getServiceRegistry()' not in js:
        js = helpers + '\n' + js
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(js)
        print("Successfully injected all missing IBOS helpers into app.js!")

fix_all_missing_ibos_helpers()
