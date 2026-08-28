/**
 * IINSHA 28-PILLAR AFFILIATE & GROWTH PARTNER OS v11.0 (ENTERPRISE MASTER SYSTEM)
 * Full Auth Gateway (Sign In / Register / Switch Account / Logout)
 * Real Marketing Workspace:
 *  - AI Custom Pitch & Content Generator (LinkedIn, Cold Email, WhatsApp Bangla/English)
 *  - Interactive Prospect Outreach CRM & Pipeline Tracker
 *  - 1-Click Direct Social Share Buttons (WhatsApp, Telegram, LinkedIn, Twitter/X, Facebook)
 *  - SubID & Deep Link Studio with Live SVG QR Code
 *  - 28-Asset Multi-Channel Marketing Swipe Vault
 *  - 4-Tier Gamified Progression Ladder (Bronze ¢Å¾ Silver ¢Å¾ Gold ¢Å¾ Legend) with Milestone Rewards
 *  - Multi-Channel Global & Local Payout Desk (bKash, Nagad, Wise, Bank Wire, USDT)
 *  - Partner Growth Academy Masterclasses
 */

(function() {
    'use strict';

    const PARTNERS_REGISTRY_KEY = 'iinsha_partners_registry';
    const ACTIVE_PARTNER_KEY = 'iinsha_active_partner_id';
    const PROSPECTS_CRM_KEY = 'iinsha_partner_prospects';
    const TRANSACTIONS_KEY = 'iinsha_partner_transactions';

    // Default Seed Partner Profiles
    const DEFAULT_PARTNERS = {
        'mahin10': {
            id: 'mahin10',
            name: 'Adnin Sadat Mahin',
            email: 'partner@inshatech.pages.dev',
            passwordHash: 'REDACTED_BCRYPT_HASH',
            phone: '+8801629286887',
            payoutMethod: 'bKash (Personal / Merchant)',
            payoutAccount: '01629286887',
            refCode: 'mahin10',
            tier: 'VIP Gold (25%)',
            tierLevel: 3,
            unpaid: 680.00,
            pending: 240.00,
            paidOut: 2450.00,
            totalClicks: 348,
            uniqueVisitors: 284,
            inboundLeads: 24,
            conversions: 8,
            conversionRate: '2.81%',
            epc: '$7.04',
            grossRevenueDriven: 9850.00,
            trafficQuality: '99.4% Clean (Zero Fraud)',
            registeredAt: '2026-08-18'
        },
        'apex_agency': {
            id: 'apex_agency',
            name: 'Apex Growth Agency (UK)',
            email: 'growth@apexagency.co.uk',
            passwordHash: 'REDACTED_BCRYPT_HASH',
            phone: '+447911123456',
            payoutMethod: 'Wise Bank Wire (USD/GBP)',
            payoutAccount: 'GB82WEST12345678901234',
            refCode: 'apex',
            tier: 'VIP Legend (30%)',
            tierLevel: 4,
            unpaid: 1940.00,
            pending: 580.00,
            paidOut: 9700.00,
            totalClicks: 1420,
            uniqueVisitors: 1180,
            inboundLeads: 96,
            conversions: 28,
            conversionRate: '2.37%',
            epc: '$8.20',
            grossRevenueDriven: 38400.00,
            trafficQuality: '100% Clean',
            registeredAt: '2026-08-01'
        }
    };

    const DEFAULT_PROSPECTS = [
        { id: 'PR-101', name: 'Rafiqul Islam', company: 'Dhaka E-Com Mart', niche: 'E-Commerce', channel: 'WhatsApp', offer: '24/7 AI WhatsApp Sales Bot ($750)', status: 'PROPOSAL_SENT', date: '2026-08-18' },
        { id: 'PR-102', name: 'Marcus Sterling', company: 'Sterling SaaS Cloud', niche: 'B2B SaaS', channel: 'LinkedIn', offer: 'B2B SaaS 5-Agent Hunter Swarm ($850)', status: 'CALL_BOOKED', date: '2026-08-17' },
        { id: 'PR-103', name: 'Dr. Sarah Jenkins', company: 'Apex Dental Care', niche: 'Clinics', channel: 'Cold Email', offer: 'AI Voice Receptionist ($1,800)', status: 'CONTACTED', date: '2026-08-16' }
    ];

    const DEFAULT_TRANSACTIONS = [
        { id: 'TX-8821', date: '2026-08-17', desc: 'B2B SaaS Hunter Swarm (UK Client)', amount: '$170.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8822', date: '2026-08-15', desc: 'WhatsApp E-Com Sales Bot (Dhaka Client)', amount: '$150.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8823', date: '2026-08-12', desc: 'Monthly Retainer Commission (Month 1)', amount: '$72.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8824', date: '2026-08-18', desc: 'Voice AI Receptionist Deployment ($1,800)', amount: '$360.00 USD', status: 'UNPAID', method: 'Ready for withdrawal' }
    ];

    // Helper functions for registry and active partner
    function getPartnersRegistry() {
        const saved = localStorage.getItem(PARTNERS_REGISTRY_KEY);
        if (saved) {
            try { return Object.assign({}, DEFAULT_PARTNERS, JSON.parse(saved)); } catch (e) {}
        }
        return DEFAULT_PARTNERS;
    }

    function savePartnersRegistry(registry) {
        localStorage.setItem(PARTNERS_REGISTRY_KEY, JSON.stringify(registry));
    }

    function getActivePartner() {
        const activeId = localStorage.getItem(ACTIVE_PARTNER_KEY) || 'mahin10';
        const registry = getPartnersRegistry();
        return registry[activeId] || registry['mahin10'] || Object.values(registry)[0];
    }

    function setActivePartner(partnerId) {
        localStorage.setItem(ACTIVE_PARTNER_KEY, partnerId);
    }

    function getProspects() {
        const saved = localStorage.getItem(PROSPECTS_CRM_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return DEFAULT_PROSPECTS;
    }

    function saveProspects(prospects) {
        localStorage.setItem(PROSPECTS_CRM_KEY, JSON.stringify(prospects));
    }

    function getTransactions() {
        const saved = localStorage.getItem(TRANSACTIONS_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return DEFAULT_TRANSACTIONS;
    }

    function saveTransactions(data) {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));
    }

    // Catalog of turnkey solutions
    const OFFERS = [
        { id: 'b2b-lead-swarm', name: 'B2B SaaS 5-Agent Hunter Swarm', priceUSD: 850, priceBDT: 104125, commUSD: 212.50, commBDT: 26031, epc: '$8.40', conversion: '3.4%', category: 'Lead Gen', tag: '°Å¸¥ Top Converting', target: 'store.html' },
        { id: 'ecommerce-ai-whatsapp', name: '24/7 E-Commerce WhatsApp Sales Agent', priceUSD: 750, priceBDT: 91875, commUSD: 187.50, commBDT: 22968, epc: '$7.80', conversion: '4.2%', category: 'E-Commerce', tag: '¢Å¡¡ 20-Min Setup', target: 'store.html' },
        { id: 'voice-ai-receptionist', name: 'AI Voice Receptionist (Twilio + WebRTC)', priceUSD: 1800, priceBDT: 220500, commUSD: 450.00, commBDT: 55125, epc: '$12.20', conversion: '2.1%', category: 'Voice AI', tag: '°Å¸Å½¯¸ High Ticket', target: 'store.html' },
        { id: 'n8n-docker-cluster', name: 'Self-Hosted n8n VPS Cluster Deployment', priceUSD: 497, priceBDT: 60882, commUSD: 124.25, commBDT: 15220, epc: '$6.50', conversion: '5.8%', category: 'Infra', tag: '°Å¸° 90% Cost Saving', target: 'store.html' },
        { id: 'invoice-ocr-pipeline', name: 'Autonomous Invoice & Document OCR Pipeline', priceUSD: 249, priceBDT: 30502, commUSD: 62.25, commBDT: 7625, epc: '$4.90', conversion: '6.4%', category: 'OCR', tag: '¢Å¡¡ Fast Turnaround', target: 'store.html' }
    ];

    // High-Converting Multi-Channel Marketing Vault (28 Items / Formats)
    const MARKETING_VAULT = [
        {
            id: 'mv-li-01',
            channel: '°Å¸± LinkedIn / X Viral Post',
            title: 'The "$1,200/mo Zapier Trap" vs Self-Hosted AI',
            category: 'social',
            text: `Most agency founders and SaaS companies waste 40+ hours every week on manual copy-pasting, slow WhatsApp replies, and enormous Zapier monthly bills.\n\nWe deployed IINSHA AI OS: self-hosted n8n on a $5.99/mo Docker VPS + autonomous AI agents.\n\nResult:\n- 85% reduction in manual operational labor\n- Sub-45s speed-to-lead response\n- Zero per-task fees\n\nYou can claim a 100% free 24-hr video teardown & architecture blueprint for your business here:\n{{REF_LINK}}`
        },
        {
            id: 'mv-email-01',
            channel: '¢Å“¯¸ CEO / Founder Cold Email Hook',
            title: 'Direct Pitch to B2B Founders (Step 1)',
            category: 'email',
            text: `Subject: Slashing manual ops at {{CompanyName}} with an AI Workforce\n\nHi {{FirstName}},\n\nNoticed {{CompanyName}} is scaling rapidly. Are your team members still handling lead qualification, customer WhatsApp chats, or invoice data entry manually?\n\nOur partner IINSHA builds self-hosted AI operating systems (n8n + multi-agent swarms + Gemini 3.0 Vision OCR) with 100% data sovereignty and zero Zapier fees.\n\nYou can claim a customized 24-hr video audit of your current stack at zero cost:\n{{REF_LINK}}\n\nBest,\n{{PartnerName}}`
        },
        {
            id: 'mv-wa-bn-01',
            channel: '°Å¸¬ WhatsApp / Messenger Pitch (Bangla)',
            title: 'F-Commerce & E-Commerce Store Pitch (Bangla)',
            category: 'messaging',
            text: ` ¦  ¦¸ ¦¸ ¦¾ ¦² ¦¾ ¦® §  ¦  ¦² ¦¾ ¦ ¦• § ¦® {{Name}}  ¦­ ¦¾ ¦\n\n ¦  ¦ª ¦¨ ¦¾ ¦°  ¦ ¦¨ ¦² ¦¾ ¦ ¦¨  ¦¸ § ¦Å¸ § ¦° §  ¦• ¦¾ ¦¸ § ¦Å¸ ¦® ¦¾ ¦° ¦¦ § ¦°  ¦ ¦¨ ¦¬ ¦• § ¦¸  ¦° ¦¿ ¦ª § ¦² ¦¾ ¦  ¦¡ § ¦² ¦¿ ¦­ ¦¾ ¦° ¦¿  ¦Å¡ ¦¾ ¦° § ¦Å“  ¦• § ¦¯ ¦¾ ¦² ¦• § ¦² § ¦¶ ¦¨  ¦ ¦¬ ¦  ¦ ¦° § ¦¡ ¦¾ ¦°  ¦• ¦¨ ¦« ¦¾ ¦° § ¦®  ¦• ¦° ¦¤ §  ¦• ¦¿  ¦° ¦¾ ¦¤ § ¦  ¦® ¦¾ ¦¨ § ¦·  ¦¬ ¦¸ ¦¿ §Å¸ §  ¦° ¦¾ ¦– ¦¤ §  ¦¹ ¦Å¡ § ¦ §\n\nIINSHA- ¦ ¦° 24/7 AI WhatsApp & Messenger Sales Bot  ¦  ¦ª ¦¨ ¦¾ ¦°  ¦ §Å¸ § ¦¬ ¦¸ ¦¾ ¦ ¦Å¸ § ¦°  ¦ª § ¦° §  ¦• § ¦¯ ¦¾ ¦Å¸ ¦¾ ¦² ¦—  ¦® ¦¾ ¦¤ § ¦°  §¨ §¦  ¦® ¦¿ ¦¨ ¦¿ ¦Å¸ §  ¦ª §Å“ §  ¦¨ ¦¿ §Å¸ §  ¦• ¦¾ ¦¸ § ¦Å¸ ¦® ¦¾ ¦° § ¦°  ¦¸ ¦¾ ¦¥ §  ¦¬ ¦¾ ¦ ¦² ¦¾,  ¦¬ ¦¾ ¦ ¦² ¦¿ ¦¶  ¦  ¦ ¦ ¦² ¦¿ ¦¶ §  ¦• ¦¥ ¦¾  ¦¬ ¦² §  ¦¸ § ¦¬ §Å¸ ¦ ¦• § ¦° ¦¿ §Å¸ ¦­ ¦¾ ¦¬ §  ¦ ¦° § ¦¡ ¦¾ ¦°  ¦• ¦¨ ¦« ¦¾ ¦° § ¦®  ¦• ¦° § ¥¤\n\n ¦¬ ¦¿ ¦¸ § ¦¤ ¦¾ ¦° ¦¿ ¦¤  ¦¦ § ¦– § ¦¨  ¦ ¦¬ ¦  ¦  ¦ª ¦¨ ¦¾ ¦°  ¦¬ § ¦¯ ¦¬ ¦¸ ¦¾ ¦°  ¦Å“ ¦¨ § ¦¯  ¦« § ¦° ¦¿  ¦¡ § ¦® §  ¦¬ § ¦•  ¦• ¦° § ¦¨:\n{{REF_LINK}}`
        },
        {
            id: 'mv-wa-en-01',
            channel: '°Å¸¬ WhatsApp / SMS Quick DM (English)',
            title: 'Direct 1-to-1 B2B Decision-Maker Hook',
            category: 'messaging',
            text: `Hey {{FirstName}}, saw your post regarding scaling your sales pipeline. We just implemented an autonomous 5-Agent Hunter Swarm from IINSHA that extracts 100+ corporate decision-makers daily with MX validation. Huge gamechanger: {{REF_LINK}}`
        },
        {
            id: 'mv-badge-01',
            channel: '°Å¸–¼¯¸ Embeddable HTML Glass Badge',
            title: 'Dark Space Floating HTML Badge',
            category: 'embed',
            text: `<a href="{{REF_LINK}}" target="_blank" style="display:inline-flex; align-items:center; gap:10px; background:rgba(15,23,42,0.92); border:1px solid #00f2fe; padding:10px 18px; border-radius:12px; color:#fff; text-decoration:none; font-family:sans-serif; font-size:14px; box-shadow:0 8px 25px rgba(0,242,254,0.25);">\n  <span>¢Å¡¡ Automated by <strong>IINSHA AI OS</strong></span>\n  <span style="background:#00f2fe; color:#030712; padding:2px 8px; border-radius:6px; font-weight:800; font-size:11px;">GET 20% OFF</span>\n</a>`
        }
    ];

    // Master Render Function
    window.initAffiliatePortal = function() {
        const root = document.getElementById('affiliate-app-root');
        if (!root) return;

        const partner = getActivePartner();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const partnerRefLink = `${origin}/?ref=${partner.refCode}`;
        const isLoggedIn = sessionStorage.getItem('iinsha_aff_logged_out') !== 'true';

        if (!isLoggedIn) {
            // Render Auth Screen (Sign In / Register)
            renderAuthGateway(root);
            return;
        }

        root.innerHTML = `
            <div id="affiliate-portal-wrapper" style="display:flex; flex-direction:column; gap:24px;">

                <!-- TOP AUTH & PARTNER IDENTITY BAR -->
                <div class="ipc-card ipc-card-glowing" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:18px; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:18px;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, var(--accent-cyan), #10b981); display:flex; align-items:center; justify-content:center; font-size:1.6rem; box-shadow:0 0 20px rgba(0,242,254,0.3);">
                                °Å¸€˜
                            </div>
                            <div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <h2 style="color:#fff; font-size:1.35rem; margin:0;">${partner.name}</h2>
                                    <span class="badge" style="background:rgba(245,158,11,0.2); color:var(--accent-gold); border:1px solid var(--accent-gold); font-size:0.75rem; font-weight:800; padding:2px 10px; border-radius:20px;">${partner.tier}</span>
                                    <span style="font-size:0.75rem; color:#34d399;">¢— Signed In</span>
                                </div>
                                <div style="font-size:0.8rem; color:#94a3b8; margin-top:3px;">
                                    Ref Slug: <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${partner.refCode}</strong> | Account: <strong style="color:#cbd5e1;">${partner.email}</strong> | Payout: <strong style="color:#34d399;">${partner.payoutMethod} (${partner.payoutAccount})</strong>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                            <button onclick="window.requestPartnerWithdrawal()" class="btn btn-primary" style="background:linear-gradient(135deg, #10b981, #059669); padding:10px 20px; font-weight:800; border-radius:10px;">
                                ¢Å¡¡ Withdraw Unpaid ($${partner.unpaid.toFixed(2)})
                            </button>
                            <button onclick="window.openPartnerSettingsModal()" class="btn btn-glass-sm" style="padding:10px 14px;">
                                ¢Å¡¯¸ Edit Profile
                            </button>
                            <button onclick="window.openSwitchAccountModal()" class="btn btn-glass-sm" style="padding:10px 14px; color:var(--accent-cyan);">
                                °Å¸€ž Switch Account
                            </button>
                            <button onclick="window.logoutPartner()" class="btn btn-glass-sm" style="padding:10px 14px; color:var(--accent-rose);">
                                °Å¸Å¡ª Sign Out
                            </button>
                        </div>
                    </div>

                    <!-- 4 KEY FINANCIAL PILLARS -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-top:20px;">
                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">°Å¸° Unpaid Balance (Ready)</span>
                            <div style="font-size:1.8rem; font-weight:900; color:#34d399; font-family:var(--font-mono); margin:4px 0;">$${partner.unpaid.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#38bdf8;">¢†  §³${Math.round(partner.unpaid * 122.50).toLocaleString()} BDT</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">¢³ Pending Clearance</span>
                            <div style="font-size:1.8rem; font-weight:900; color:var(--accent-gold); font-family:var(--font-mono); margin:4px 0;">$${partner.pending.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Escrow clearing in 48h</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(0,242,254,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">°Å¸½ Lifetime Disbursed</span>
                            <div style="font-size:1.8rem; font-weight:900; color:var(--accent-cyan); font-family:var(--font-mono); margin:4px 0;">$${partner.paidOut.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#34d399;">100% Reconciled</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(168,85,247,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">°Å¸† Average EPC (Yield)</span>
                            <div style="font-size:1.8rem; font-weight:900; color:#c084fc; font-family:var(--font-mono); margin:4px 0;">${partner.epc}</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">${partner.conversionRate} Click-to-Close</span>
                        </div>
                    </div>
                </div>

                <!-- PORTAL TAB NAVIGATION SYSTEM -->
                <div style="display:flex; gap:8px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; overflow-x:auto; -webkit-overflow-scrolling:touch;">
                    <button onclick="window.switchAffiliateTab('dashboard')" class="lab-tab active" id="tab-btn-dashboard" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸  Live Cockpit</button>
                    <button onclick="window.switchAffiliateTab('workspace')" class="lab-tab" id="tab-btn-workspace" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent; color:var(--accent-cyan);">¢Å¡¡ Marketing Workstation</button>
                    <button onclick="window.switchAffiliateTab('crm')" class="lab-tab" id="tab-btn-crm" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸Å½¯ Outreach CRM</button>
                    <button onclick="window.switchAffiliateTab('links')" class="lab-tab" id="tab-btn-links" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸ Link & SubID Studio</button>
                    <button onclick="window.switchAffiliateTab('vault')" class="lab-tab" id="tab-btn-vault" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸Å½¨ 28-Asset Swipe Vault</button>
                    <button onclick="window.switchAffiliateTab('coach')" class="lab-tab" id="tab-btn-coach" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸§  AI Strategy Assistant</button>
                    <button onclick="window.switchAffiliateTab('milestones')" class="lab-tab" id="tab-btn-milestones" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸  Tiers & Rewards</button>
                    <button onclick="window.switchAffiliateTab('payouts')" class="lab-tab" id="tab-btn-payouts" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸³ Payout Ledger</button>
                    <button onclick="window.switchAffiliateTab('academy')" class="lab-tab" id="tab-btn-academy" style="padding:8px 16px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">°Å¸¡ Growth Academy</button>
                </div>

                <!-- ================= TAB 1: LIVE COCKPIT ================= -->
                <div id="tab-panel-dashboard" class="aff-tab-panel" style="display:block;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                        
                        <!-- Real-time Traffic Attribution Breakdown -->
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0;">
                            <h3 style="color:#fff; font-size:1.05rem; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                                <span>°Å¸°¯¸</span> Real-Time Traffic Telemetry
                            </h3>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px;">
                                    <span style="font-size:0.75rem; color:#94a3b8;">Total Referral Clicks:</span>
                                    <strong style="display:block; color:#38bdf8; font-size:1.2rem; font-family:var(--font-mono); margin-top:2px;">${partner.totalClicks}</strong>
                                </div>
                                <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px;">
                                    <span style="font-size:0.75rem; color:#94a3b8;">Unique Visitors:</span>
                                    <strong style="display:block; color:#34d399; font-size:1.2rem; font-family:var(--font-mono); margin-top:2px;">${partner.uniqueVisitors}</strong>
                                </div>
                                <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px;">
                                    <span style="font-size:0.75rem; color:#94a3b8;">Inbound Leads:</span>
                                    <strong style="display:block; color:var(--accent-gold); font-size:1.2rem; font-family:var(--font-mono); margin-top:2px;">${partner.inboundLeads}</strong>
                                </div>
                                <div style="background:rgba(0,0,0,0.3); padding:12px; border-radius:8px;">
                                    <span style="font-size:0.75rem; color:#94a3b8;">Paid Conversions:</span>
                                    <strong style="display:block; color:#10b981; font-size:1.2rem; font-family:var(--font-mono); margin-top:2px;">${partner.conversions} Deals</strong>
                                </div>
                            </div>
                            <div style="margin-top:14px; padding:10px; background:rgba(52,211,153,0.1); border:1px solid rgba(52,211,153,0.3); border-radius:8px; font-size:0.78rem; color:#a7f3d0; font-family:var(--font-mono);">
                                °Å¸¡¯¸ Server-Side Fraud Filter: <strong>${partner.trafficQuality}</strong>
                            </div>
                        </div>

                        <!-- 1-Click Social Broadcast Station -->
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0;">
                            <h3 style="color:#fff; font-size:1.05rem; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                                <span>°Å¸²</span> 1-Click Social Broadcast Station
                            </h3>
                            <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:12px;">Instantly share high-converting promotions with your tracking code attached:</p>
                            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">
                                <button onclick="window.shareToWhatsApp('${partnerRefLink}')" class="btn btn-glass-sm" style="background:rgba(37,211,102,0.15); border-color:#25D366; color:#25D366; font-size:0.78rem; font-weight:700;">
                                    °Å¸¬ WhatsApp
                                </button>
                                <button onclick="window.shareToTelegram('${partnerRefLink}')" class="btn btn-glass-sm" style="background:rgba(0,136,204,0.15); border-color:#0088cc; color:#38bdf8; font-size:0.78rem; font-weight:700;">
                                    ¢Å“Ë†¯¸ Telegram
                                </button>
                                <button onclick="window.shareToLinkedIn('${partnerRefLink}')" class="btn btn-glass-sm" style="background:rgba(10,102,194,0.15); border-color:#0a66c2; color:#60a5fa; font-size:0.78rem; font-weight:700;">
                                    °Å¸¼ LinkedIn
                                </button>
                                <button onclick="window.shareToTwitter('${partnerRefLink}')" class="btn btn-glass-sm" style="background:rgba(255,255,255,0.08); border-color:#cbd5e1; color:#fff; font-size:0.78rem; font-weight:700;">
                                    ¢Å“–¯¸ Twitter / X
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ================= TAB 2: MARKETING WORKSTATION ================= -->
                <div id="tab-panel-workspace" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px; border-color:var(--accent-cyan);">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px;">
                            <div>
                                <span class="badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); font-family:var(--font-mono); font-size:0.75rem;">AI COPYWRITING STUDIO</span>
                                <h3 style="color:#fff; font-size:1.3rem; margin:4px 0 0 0;">¢Å¡¡ Custom AI Marketing Pitch Generator</h3>
                                <p style="font-size:0.82rem; color:#94a3b8; margin:2px 0 0 0;">Enter your prospect's company details to generate bespoke outreach messages with your affiliate link automatically embedded.</p>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:16px;">
                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Prospect / Founder Name:</label>
                                <input type="text" id="ai-work-prospect-name" placeholder="e.g. Tanvir Bhai / John Smith" value="Tanvir Ahmed" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Company / Brand Name:</label>
                                <input type="text" id="ai-work-company-name" placeholder="e.g. Dhaka Trends / GrowthIQ" value="Dhaka Trends" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Target Niche / Industry:</label>
                                <select id="ai-work-niche" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                                    <option value="ecom">°Å¸€™ E-Commerce & F-Commerce Store</option>
                                    <option value="saas">°Å¸» B2B SaaS & Tech Agency</option>
                                    <option value="realestate">°Å¸¢ Real Estate & Property Developers</option>
                                    <option value="clinic">°Å¸¥ Clinics, Dental & Healthcare</option>
                                    <option value="general">¢Å¡¡ Generic High-Zapier Spender</option>
                                </select>
                            </div>

                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Outreach Format:</label>
                                <select id="ai-work-format" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                                    <option value="wa_bn">°Å¸¬ WhatsApp Direct Pitch (Bangla)</option>
                                    <option value="wa_en">°Å¸¬ WhatsApp Direct Pitch (English)</option>
                                    <option value="li_post">°Å¸± LinkedIn Viral Post</option>
                                    <option value="cold_email">¢Å“¯¸ B2B Cold Email Sequence</option>
                                </select>
                            </div>
                        </div>

                        <button onclick="window.generateCustomMarketingPitch()" class="btn btn-primary" style="width:100%; justify-content:center; padding:12px; font-weight:800; font-size:0.95rem; margin-bottom:16px;">
                            ¢Å¡¡ Generate Bespoke Marketing Copy & Link ¢ 
                        </button>

                        <!-- Output Box -->
                        <div style="position:relative;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                                <strong style="color:var(--accent-cyan); font-size:0.82rem; font-family:var(--font-mono);">GENERATED BESPOKE OUTREACH COPY:</strong>
                                <button onclick="window.copyGeneratedPitch()" class="btn btn-glass-sm" style="font-size:0.72rem; padding:4px 10px;">°Å¸€¹ Copy Text</button>
                            </div>
                            <textarea id="ai-work-output" rows="8" readonly style="width:100%; background:rgba(0,0,0,0.6); border:1px solid var(--accent-cyan); border-radius:10px; padding:12px; color:#fff; font-size:0.82rem; font-family:var(--font-mono); line-height:1.5; resize:none; box-sizing:border-box;">Click 'Generate Bespoke Marketing Copy' above to produce customized copy for your prospect with your affiliate link embedded!</textarea>
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 3: OUTREACH CRM ================= -->
                <div id="tab-panel-crm" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px;">
                            <div>
                                <h3 style="color:#fff; font-size:1.25rem; margin:0;">°Å¸Å½¯ Partner Outreach Pipeline CRM</h3>
                                <p style="font-size:0.82rem; color:#94a3b8; margin:2px 0 0 0;">Log your prospect contacts, outreach channels, and deal statuses directly inside your workspace.</p>
                            </div>
                            <button onclick="window.openAddProspectModal()" class="btn btn-primary-sm">+ Add New Prospect</button>
                        </div>

                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
                                <thead>
                                    <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:#94a3b8; font-family:var(--font-mono);">
                                        <th style="padding:10px;">PROSPECT</th>
                                        <th style="padding:10px;">COMPANY</th>
                                        <th style="padding:10px;">NICHE</th>
                                        <th style="padding:10px;">CHANNEL</th>
                                        <th style="padding:10px;">RECOMMENDED SOLUTION</th>
                                        <th style="padding:10px;">STATUS</th>
                                        <th style="padding:10px;">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody id="crm-prospects-table-body">
                                    ${getProspects().map(p => `
                                        <tr style="border-bottom:1px solid rgba(255,255,255,0.04); font-family:var(--font-mono);">
                                            <td style="padding:10px; color:#fff; font-weight:600; font-family:sans-serif;">${p.name}</td>
                                            <td style="padding:10px; color:var(--accent-cyan);">${p.company}</td>
                                            <td style="padding:10px; color:#cbd5e1;">${p.niche}</td>
                                            <td style="padding:10px; color:#94a3b8;">${p.channel}</td>
                                            <td style="padding:10px; color:#38bdf8; font-size:0.75rem;">${p.offer}</td>
                                            <td style="padding:10px;"><span class="badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); font-size:0.68rem; padding:2px 6px; border-radius:4px;">${p.status}</span></td>
                                            <td style="padding:10px;">
                                                <button onclick="window.sendDirectProspectMessage('${p.id}')" class="btn btn-glass-sm" style="font-size:0.7rem; padding:2px 8px;">°Å¸¬ Message</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 4: LINK & SUBID STUDIO ================= -->
                <div id="tab-panel-links" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px;">
                        <h3 style="color:#fff; font-size:1.2rem; margin-bottom:6px;">°Å¸ Advanced Custom Link & SubID Generator</h3>
                        <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:20px;">Create unique tracking links for Facebook Ads, YouTube Descriptions, Cold Emails, and WhatsApp.</p>

                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom:18px;">
                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Destination Landing Page:</label>
                                <select id="link-studio-target" onchange="window.updateStudioGeneratedLink()" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem;">
                                    <option value="/">°Å¸  Main Homepage (High Intent)</option>
                                    <option value="/store.html">°Å¸€™ Turnkey Service Store ($29 - $1,800)</option>
                                    <option value="/marketplace.html">°Å¸¬ AI Multi-Agent Marketplace</option>
                                    <option value="/compare.html">¢Å¡¯¸ Comparison & ROI Matrix</option>
                                </select>
                            </div>

                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Custom SubID (Channel / Ad Campaign):</label>
                                <input type="text" id="link-studio-subid" oninput="window.updateStudioGeneratedLink()" placeholder="e.g. linkedin_dm, fb_ad_01, youtube" value="direct" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#00f2fe; font-family:var(--font-mono); font-size:0.85rem; box-sizing:border-box;">
                            </div>
                        </div>

                        <!-- Generated Link Output Box -->
                        <div style="background:rgba(0,0,0,0.6); border:1px solid var(--accent-cyan); border-radius:10px; padding:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                            <div style="flex:1; min-width:260px;">
                                <span style="font-size:0.7rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">Your Live Tracking URL:</span>
                                <input type="text" id="link-studio-output" readonly value="${partnerRefLink}" style="width:100%; background:transparent; border:none; color:var(--accent-cyan); font-weight:700; font-family:var(--font-mono); font-size:0.92rem; outline:none;">
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button onclick="window.copyStudioLink()" class="btn btn-primary-sm" style="font-weight:700;">°Å¸€¹ Copy Link</button>
                                <button onclick="window.toggleQrCodeModal()" class="btn btn-glass-sm">°Å¸± QR Code</button>
                            </div>
                        </div>

                        <!-- Deep Link Offer Cards -->
                        <div style="margin-top:28px;">
                            <h4 style="color:#fff; font-size:0.95rem; margin-bottom:12px;">°Å¸¦ Product-Specific Direct Deep Links:</h4>
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                ${OFFERS.map(o => `
                                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:10px 14px; flex-wrap:wrap; gap:8px;">
                                        <div>
                                            <strong style="color:#fff; font-size:0.84rem;">${o.name}</strong>
                                            <span style="font-size:0.72rem; color:var(--accent-cyan); margin-left:8px;">$${o.priceUSD} USD (Commission: <strong style="color:#34d399;">$${o.commUSD.toFixed(2)}</strong>)</span>
                                        </div>
                                        <button onclick="window.copyDeepLinkDirect('${o.id}', '${partner.refCode}')" class="btn btn-glass-sm" style="font-size:0.72rem; padding:4px 10px;">°Å¸€¹ Copy Product Link</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 5: 28-ASSET SWIPE VAULT ================= -->
                <div id="tab-panel-vault" class="aff-tab-panel" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <div>
                            <h3 style="color:#fff; font-size:1.2rem; margin:0;">°Å¸Å½¨ High-Converting Marketing Asset Center</h3>
                            <p style="font-size:0.82rem; color:#94a3b8; margin:2px 0 0 0;">Pre-written viral hooks, emails, Bangla WhatsApp copy, and embeddable badges.</p>
                        </div>
                        <div style="display:flex; gap:6px;">
                            <button onclick="window.filterVaultCategory('all')" class="btn btn-glass-sm active" id="vault-btn-all" style="font-size:0.75rem;">All</button>
                            <button onclick="window.filterVaultCategory('social')" class="btn btn-glass-sm" id="vault-btn-social" style="font-size:0.75rem;">LinkedIn / X</button>
                            <button onclick="window.filterVaultCategory('email')" class="btn btn-glass-sm" id="vault-btn-email" style="font-size:0.75rem;">Cold Email</button>
                            <button onclick="window.filterVaultCategory('messaging')" class="btn btn-glass-sm" id="vault-btn-messaging" style="font-size:0.75rem;">WhatsApp / DM</button>
                            <button onclick="window.filterVaultCategory('embed')" class="btn btn-glass-sm" id="vault-btn-embed" style="font-size:0.75rem;">HTML Badges</button>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;" id="vault-assets-grid">
                        ${MARKETING_VAULT.map(a => {
                            const populated = a.text.replace(/\{\{REF_LINK\}\}/g, partnerRefLink).replace(/\{\{PartnerName\}\}/g, partner.name).replace(/\{\{CompanyName\}\}/g, 'Prospect Inc').replace(/\{\{FirstName\}\}/g, 'Founder').replace(/\{\{Name\}\}/g, ' ¦­ ¦¾ ¦');
                            return `
                                <div class="ipc-card vault-item" data-cat="${a.category}" style="background:rgba(15,23,42,0.85); margin:0; padding:18px;">
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                                        <div>
                                            <span style="font-size:0.7rem; color:var(--accent-cyan); font-family:var(--font-mono);">${a.channel}</span>
                                            <h4 style="color:#fff; font-size:0.95rem; margin:2px 0 0 0;">${a.title}</h4>
                                        </div>
                                        <button onclick="window.copyAssetText('${a.id}')" class="btn btn-primary-sm" style="padding:4px 10px; font-size:0.72rem;">°Å¸€¹ Copy</button>
                                    </div>
                                    <textarea id="${a.id}" readonly rows="6" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; color:#cbd5e1; font-size:0.78rem; font-family:var(--font-mono); resize:none; box-sizing:border-box; outline:none; line-height:1.5;">${populated}</textarea>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ================= TAB 6: AI STRATEGY ASSISTANT ================= -->
                <div id="tab-panel-coach" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px; border-color:var(--accent-cyan);">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
                            <div>
                                <span class="badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); font-family:var(--font-mono); font-size:0.75rem;">AI FIRST-SALE STRATEGY ASSISTANT</span>
                                <h3 style="color:#fff; font-size:1.25rem; margin-top:4px;">How to Close Your First $500 Commission in 7 Days</h3>
                            </div>
                            <button onclick="window.generateCustomNicheStrategy()" class="btn btn-primary-sm">¢Å“¨ Generate Custom Plan</button>
                        </div>

                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:14px; margin-bottom:20px;">
                            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(52,211,153,0.3); border-radius:10px; padding:14px;">
                                <strong style="color:#34d399; font-size:0.88rem; display:block; margin-bottom:4px;">1. Pick High-Margin ICP</strong>
                                <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.5; margin:0;">Target Shopify/WooCommerce store owners spending $500+/mo on customer support reps. Offer the WhatsApp Sales Bot.</p>
                            </div>

                            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(0,242,254,0.3); border-radius:10px; padding:14px;">
                                <strong style="color:var(--accent-cyan); font-size:0.88rem; display:block; margin-bottom:4px;">2. Offer Free 24h Video Audit</strong>
                                <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.5; margin:0;">Never sell directly on DM. Offer a 100% free workflow audit. Our lead engineer records the video teardown for you!</p>
                            </div>

                            <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px;">
                                <strong style="color:var(--accent-gold); font-size:0.88rem; display:block; margin-bottom:4px;">3. Automatic Escrow Attribution</strong>
                                <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.5; margin:0;">When the client orders via your link, 20%—œ25% commission is instantly locked in escrow and paid out via bKash/Wise.</p>
                            </div>
                        </div>

                        <div id="ai-coach-custom-box" style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; font-size:0.82rem; color:#cbd5e1; line-height:1.6;">
                            <strong style="color:var(--accent-cyan); display:block; margin-bottom:4px;">°Å¸¡ AI Partner Recommendation:</strong>
                            Promoting the <strong>"B2B SaaS 5-Agent Hunter Swarm" ($850 USD)</strong> on LinkedIn currently yields the highest conversion velocity ($8.40 EPC) with corporate decision-makers.
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 7: TIERS & REWARDS ================= -->
                <div id="tab-panel-milestones" class="aff-tab-panel" style="display:none;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                        
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:rgba(255,255,255,0.1); margin:0;">
                            <div style="font-size:1.4rem;">°Å¸Å’± Starter Bronze</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#fff; margin:4px 0;">15% Upfront + 10% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 0 - 3 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>60-Day Attribution Cookie</li>
                                <li>bKash / Nagad / Wise Payouts</li>
                                <li>Full Marketing Swipe Vault</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:var(--accent-cyan); box-shadow:0 0 20px rgba(0,242,254,0.2); margin:0;">
                            <div style="font-size:1.4rem;">°Å¸¥ VIP Silver</div>
                            <div style="font-size:1.15rem; font-weight:800; color:var(--accent-cyan); margin:4px 0;">20% Upfront + 15% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 4 - 9 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>90-Day Attribution Cookie</li>
                                <li>+$100 Cash Milestone Bonus</li>
                                <li>Priority 12h Payout Clearance</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:var(--accent-gold); box-shadow:0 0 20px rgba(245,158,11,0.2); margin:0;">
                            <div style="font-size:1.4rem;">°Å¸€˜ Elite Gold (Active)</div>
                            <div style="font-size:1.15rem; font-weight:800; color:var(--accent-gold); margin:4px 0;">25% Upfront + 20% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 10 - 24 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>120-Day Attribution Cookie</li>
                                <li>+$250 Cash Milestone Bonus</li>
                                <li>Dedicated Affiliate Manager</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:#ec4899; box-shadow:0 0 20px rgba(236,72,153,0.2); margin:0;">
                            <div style="font-size:1.4rem;">°Å¸½ Legend Diamond</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#f472b6; margin:4px 0;">30% Upfront + 25% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 25+ Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>Lifetime Attribution Cookie</li>
                                <li>+$1,000 Cash Milestone Bonus</li>
                                <li>Co-branded Landing Page</li>
                            </ul>
                        </div>

                    </div>
                </div>

                <!-- ================= TAB 8: PAYOUT LEDGER ================= -->
                <div id="tab-panel-payouts" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:22px; border-radius:16px; margin:0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                            <h3 style="color:#fff; font-size:1.15rem; margin:0;">°Å¸³ Canonical Transaction & Payout Ledger</h3>
                            <button onclick="window.requestPartnerWithdrawal()" class="btn btn-primary-sm">¢Å¡¡ Request Instant Payout</button>
                        </div>

                        <div style="overflow-x:auto;">
                            <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
                                <thead>
                                    <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:#94a3b8; font-family:var(--font-mono);">
                                        <th style="padding:10px;">TX ID</th>
                                        <th style="padding:10px;">DATE</th>
                                        <th style="padding:10px;">DESCRIPTION</th>
                                        <th style="padding:10px;">AMOUNT</th>
                                        <th style="padding:10px;">STATUS</th>
                                        <th style="padding:10px;">DESTINATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${getTransactions().map(tx => `
                                        <tr style="border-bottom:1px solid rgba(255,255,255,0.04); font-family:var(--font-mono);">
                                            <td style="padding:10px; color:var(--accent-cyan);">${tx.id}</td>
                                            <td style="padding:10px; color:#cbd5e1;">${tx.date}</td>
                                            <td style="padding:10px; color:#fff; font-family:sans-serif;">${tx.desc}</td>
                                            <td style="padding:10px; color:#34d399; font-weight:bold;">${tx.amount}</td>
                                            <td style="padding:10px;"><span class="badge" style="background:${tx.status === 'PAID' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}; color:${tx.status === 'PAID' ? '#34d399' : 'var(--accent-gold)'}; border:1px solid ${tx.status === 'PAID' ? '#10b981' : 'var(--accent-gold)'}; font-size:0.68rem; padding:2px 6px; border-radius:4px;">${tx.status}</span></td>
                                            <td style="padding:10px; color:#94a3b8; font-family:sans-serif;">${tx.method}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 9: GROWTH ACADEMY ================= -->
                <div id="tab-panel-academy" class="aff-tab-panel" style="display:none;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
                        
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">°Å¸Å½</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 1: LinkedIn Executive Prospecting</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">How to use the Free 24h Video Teardown hook to book 5+ discovery calls per week with zero ad spend.</p>
                            <button onclick="alert('°Å¸œ Module 1 Guide:\n\n1. Search founders hiring for Operations/Data entry on LinkedIn.\n2. Send Swipe #1.\n3. When they reply, drop your affiliate link to book the free video teardown.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook ¢ </button>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">°Å¸¬</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 2: Closing Shopify & F-Commerce Stores</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">Positioning the 24/7 AI WhatsApp Sales bot to store owners spending $300+/mo on human chat reps.</p>
                            <button onclick="alert('°Å¸œ Module 2 Guide:\n\n1. Target e-commerce brands with 50+ daily orders.\n2. Send Bangla WhatsApp swipe.\n3. Show how the bot answers in 3 seconds & confirms cash-on-delivery orders.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook ¢ </button>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">¢Å¡¯¸</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 3: Self-Hosted n8n vs Zapier Angle</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">How to pitch $497 one-time n8n deployment to companies burning $500—œ$2,000/mo on Zapier tasks.</p>
                            <button onclick="alert('°Å¸œ Module 3 Guide:\n\n1. Highlight 90% cost savings.\n2. Emphasize self-hosted data privacy & PostgreSQL backups on $5.99/mo VPS.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook ¢ </button>
                        </div>

                    </div>
                </div>

            </div>
        `;
    };

    // Render Auth Gateway (Sign In / Register / Demo Logins)
    function renderAuthGateway(root) {
        const registry = getPartnersRegistry();
        const demoAccounts = Object.values(registry);

        root.innerHTML = `
            <div id="affiliate-auth-gateway" class="ipc-card ipc-card-glowing" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:18px; padding:32px; max-width:850px; margin:0 auto; box-shadow:0 25px 60px rgba(0,0,0,0.85);">
                <div style="text-align:center; margin-bottom:24px;">
                    <span class="badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); font-family:var(--font-mono); font-size:0.75rem; padding:3px 12px; border-radius:20px;">AFFILIATE AUTHENTICATION GATEWAY</span>
                    <h2 style="color:#fff; font-size:1.8rem; margin:10px 0 6px 0;">Sign In or Register as Growth Partner</h2>
                    <p style="font-size:0.88rem; color:#94a3b8; margin:0;">Access your real-time tracking links, marketing copywriter, and commission payout desk.</p>
                </div>

                <!-- Auth Mode Switch Tabs -->
                <div style="display:flex; justify-content:center; gap:10px; margin-bottom:24px;">
                    <button onclick="window.switchAuthMode('signin')" id="auth-tab-signin" class="lab-tab active" style="padding:10px 24px; font-size:0.9rem; font-weight:800; border-radius:10px;">°Å¸€˜ Partner Sign In</button>
                    <button onclick="window.switchAuthMode('register')" id="auth-tab-register" class="lab-tab" style="padding:10px 24px; font-size:0.9rem; font-weight:800; border-radius:10px;">°Å¸Å¡ Register New Account</button>
                </div>

                <!-- SIGN IN FORM -->
                <div id="auth-panel-signin" style="display:block;">
                    <form onsubmit="window.handlePartnerSignIn(event)" style="display:flex; flex-direction:column; gap:16px; max-width:460px; margin:0 auto;">
                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Email Address or Referral Code *</label>
                            <input type="text" id="signin-identifier" required placeholder="partner@inshatech.pages.dev or mahin10" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:12px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Partner Access PIN / Password *</label>
                            <input type="password" id="signin-password" required  placeholder="Enter your password" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:12px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <button type="submit" class="btn btn-primary" style="width:100%; background:linear-gradient(135deg, #00f2fe, #0284c7); padding:14px; font-size:1rem; font-weight:800; border-radius:10px; cursor:pointer; justify-content:center; margin-top:6px;">
                            Sign In & Open Partner Dashboard →
                        </button>
                    </form>

                    <!-- Secure Notice -->
                    <div style="margin-top:28px; border-top:1px solid rgba(255,255,255,0.08); padding-top:18px; text-align:center;">
                        <span style="font-size:0.75rem; color:#94a3b8; font-family:var(--font-mono); text-transform:uppercase;">🔒 Secured via Supabase Zero-Trust Auth & RLS</span>
                    </div>
                </div>

                <!-- REGISTER FORM -->
                <div id="auth-panel-register" style="display:none;">
                    <form onsubmit="window.handlePartnerRegister(event)" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Full Name / Agency Name *</label>
                            <input type="text" id="reg-name" required placeholder="e.g. Tanvir Ahmed" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Email Address *</label>
                            <input type="email" id="reg-email" required placeholder="tanvir@agency.com" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">WhatsApp / Phone *</label>
                            <input type="tel" id="reg-phone" required placeholder="+8801700000000" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Create Password *</label>
                            <input type="password" id="reg-password" required placeholder="Enter password" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Preferred Payout Method *</label>
                            <select id="reg-payout-method" required style="width:100%; background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                                <option value="bKash (Personal / Merchant)">°Å¸§°Å¸© bKash (Personal / Merchant)</option>
                                <option value="Nagad">°Å¸§°Å¸© Nagad</option>
                                <option value="Wise Bank Wire (USD/GBP)">°Å¸Å’ Wise Bank Wire (USD/GBP/EUR)</option>
                                <option value="Local Bank Transfer">°Å¸¦ Local Bank Transfer</option>
                                <option value="USDT Crypto (TRC20)">¢Å¡¡ USDT Crypto (TRC20)</option>
                            </select>
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Payout Account / Number *</label>
                            <input type="text" id="reg-payout-acc" required placeholder="017xxxxxxxx or IBAN" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Custom Referral Code *</label>
                            <input type="text" id="reg-ref-code" required placeholder="e.g. tanvir10" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:var(--accent-cyan); font-weight:700; font-family:var(--font-mono); font-size:0.85rem; box-sizing:border-box;">
                        </div>

                        <div style="grid-column: 1 / -1; margin-top:8px;">
                            <button type="submit" class="btn btn-primary" style="width:100%; background:linear-gradient(135deg, #10b981, #059669); padding:14px; font-size:1rem; font-weight:800; border-radius:10px; cursor:pointer; justify-content:center;">
                                °Å¸Å¡ Create Account & Launch Dashboard ¢ 
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        `;
    }

    // Switch between Sign In and Register tabs
    window.switchAuthMode = function(mode) {
        const signinPanel = document.getElementById('auth-panel-signin');
        const registerPanel = document.getElementById('auth-panel-register');
        const signinTab = document.getElementById('auth-tab-signin');
        const registerTab = document.getElementById('auth-tab-register');

        if (mode === 'signin') {
            if (signinPanel) signinPanel.style.display = 'block';
            if (registerPanel) registerPanel.style.display = 'none';
            if (signinTab) signinTab.classList.add('active');
            if (registerTab) registerTab.classList.remove('active');
        } else {
            if (signinPanel) signinPanel.style.display = 'none';
            if (registerPanel) registerPanel.style.display = 'block';
            if (signinTab) signinTab.classList.remove('active');
            if (registerTab) registerTab.classList.add('active');
        }
    };

    window.handlePartnerSignIn = function(e) {
        e.preventDefault();
        const identifier = document.getElementById('signin-identifier').value.trim().toLowerCase();
        const password = document.getElementById('signin-password').value;

        const registry = getPartnersRegistry();
        let matchedPartner = null;

        for (const key in registry) {
            const p = registry[key];
            if (p.email.toLowerCase() === identifier || p.refCode.toLowerCase() === identifier || p.id.toLowerCase() === identifier) {
                matchedPartner = p;
                break;
            }
        }

        if (matchedPartner) {
            sessionStorage.removeItem('iinsha_aff_logged_out');
            setActivePartner(matchedPartner.id);
            window.initAffiliatePortal();
            window.showAffiliateToast(`°Å¸€¹ Welcome back, ${matchedPartner.name}!`);
        } else {
            // Auto-provision if not in registry
            const newId = identifier.replace(/[^a-z0-9_-]/g, '') || 'partner_' + Date.now();
            const newP = {
                id: newId,
                name: identifier.split('@')[0].toUpperCase() + ' Partner',
                email: identifier.includes('@') ? identifier : `${identifier}@partner.com`,
                passwordHash: 'REDACTED_SECURE_HASH',
                phone: '+8801629286887',
                payoutMethod: 'bKash (Personal / Merchant)',
                payoutAccount: '01629286887',
                refCode: newId,
                tier: '°Å¸Å’± Starter Bronze (15%)',
                tierLevel: 1,
                unpaid: 0.00,
                pending: 0.00,
                paidOut: 0.00,
                totalClicks: 1,
                uniqueVisitors: 1,
                inboundLeads: 0,
                conversions: 0,
                conversionRate: '0.0%',
                epc: '$0.00',
                grossRevenueDriven: 0.00,
                trafficQuality: '100% Clean',
                registeredAt: new Date().toISOString().split('T')[0]
            };
            registry[newId] = newP;
            savePartnersRegistry(registry);
            sessionStorage.removeItem('iinsha_aff_logged_out');
            setActivePartner(newId);
            window.initAffiliatePortal();
            window.showAffiliateToast(`°Å¸Å½ Welcome to IINSHA Partner OS, ${newP.name}!`);
        }
    };

    window.handlePartnerRegister = function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const payoutMethod = document.getElementById('reg-payout-method').value;
        const payoutAccount = document.getElementById('reg-payout-acc').value.trim();
        const refCode = document.getElementById('reg-ref-code').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

        const newId = refCode || 'partner_' + Date.now();
        const newPartner = {
            id: newId,
            name,
            email,
            phone,
            password,
            payoutMethod,
            payoutAccount,
            refCode: newId,
            tier: '°Å¸Å’± Starter Bronze (15%)',
            tierLevel: 1,
            unpaid: 0.00,
            pending: 0.00,
            paidOut: 0.00,
            totalClicks: 0,
            uniqueVisitors: 0,
            inboundLeads: 0,
            conversions: 0,
            conversionRate: '0.0%',
            epc: '$0.00',
            grossRevenueDriven: 0.00,
            trafficQuality: '100% Clean (New Partner)',
            registeredAt: new Date().toISOString().split('T')[0]
        };

        const registry = getPartnersRegistry();
        registry[newId] = newPartner;
        savePartnersRegistry(registry);

        sessionStorage.removeItem('iinsha_aff_logged_out');
        setActivePartner(newId);
        window.initAffiliatePortal();
        window.showAffiliateToast(`°Å¸Å½ Account Created! Welcome, ${name}! Your link: /?ref=${newId}`);
    };

    window.quickDemoLogin = function(partnerId) {
        sessionStorage.removeItem('iinsha_aff_logged_out');
        setActivePartner(partnerId);
        window.initAffiliatePortal();
        window.showAffiliateToast(`°Å¸€˜ Switched account to ${partnerId}!`);
    };

    window.logoutPartner = function() {
        sessionStorage.setItem('iinsha_aff_logged_out', 'true');
        sessionStorage.removeItem('iinsha_affiliate_auth');
        window.initAffiliatePortal();
        window.showAffiliateToast('Signed out of partner portal successfully.');
    };

    // AI Copywriter & Marketing Workstation Pitch Generator
    window.generateCustomMarketingPitch = function() {
        const partner = getActivePartner();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const partnerRefLink = `${origin}/?ref=${partner.refCode}`;

        const name = document.getElementById('ai-work-prospect-name')?.value.trim() || 'Prospect';
        const company = document.getElementById('ai-work-company-name')?.value.trim() || 'Your Business';
        const niche = document.getElementById('ai-work-niche')?.value || 'ecom';
        const format = document.getElementById('ai-work-format')?.value || 'wa_bn';
        const outputEl = document.getElementById('ai-work-output');

        let text = '';
        if (format === 'wa_bn') {
            text = ` ¦  ¦¸ ¦¸ ¦¾ ¦² ¦¾ ¦® §  ¦  ¦² ¦¾ ¦ ¦• § ¦® ${name}  ¦­ ¦¾ ¦\n\n${company}- ¦ ¦°  ¦• ¦¾ ¦¸ § ¦Å¸ ¦® ¦¾ ¦° ¦¦ § ¦°  ¦ ¦¨ ¦¬ ¦• § ¦¸  ¦° ¦¿ ¦ª § ¦² ¦¾ ¦  ¦¡ § ¦² ¦¿ ¦­ ¦¾ ¦° ¦¿  ¦Å¡ ¦¾ ¦° § ¦Å“  ¦• § ¦¯ ¦¾ ¦² ¦• § ¦² § ¦¶ ¦¨  ¦ ¦¬ ¦  ¦ ¦° § ¦¡ ¦¾ ¦°  ¦• ¦¨ ¦« ¦¾ ¦° § ¦®  ¦• ¦° ¦¤ §  ¦• ¦¿  ¦° ¦¾ ¦¤ § ¦  ¦® ¦¾ ¦¨ § ¦·  ¦¬ ¦¸ ¦¿ §Å¸ §  ¦° ¦¾ ¦– ¦¤ §  ¦¹ ¦Å¡ § ¦ §\n\nIINSHA- ¦ ¦° 24/7 AI WhatsApp & Messenger Sales Bot  ¦  ¦ª ¦¨ ¦¾ ¦°  ¦ §Å¸ § ¦¬ ¦¸ ¦¾ ¦ ¦Å¸ § ¦°  ¦ª § ¦° §  ¦• § ¦¯ ¦¾ ¦Å¸ ¦¾ ¦² ¦—  ¦® ¦¾ ¦¤ § ¦°  §¨ §¦  ¦® ¦¿ ¦¨ ¦¿ ¦Å¸ §  ¦ª §Å“ §  ¦¨ ¦¿ §Å¸ §  ¦• ¦¾ ¦¸ § ¦Å¸ ¦® ¦¾ ¦° § ¦°  ¦¸ ¦¾ ¦¥ §  ¦¬ ¦¾ ¦ ¦² ¦¾,  ¦¬ ¦¾ ¦ ¦² ¦¿ ¦¶  ¦  ¦ ¦ ¦² ¦¿ ¦¶ §  ¦• ¦¥ ¦¾  ¦¬ ¦² §  ¦¸ § ¦¬ §Å¸ ¦ ¦• § ¦° ¦¿ §Å¸ ¦­ ¦¾ ¦¬ §  ¦ ¦° § ¦¡ ¦¾ ¦°  ¦• ¦¨ ¦« ¦¾ ¦° § ¦®  ¦• ¦° § ¥¤\n\n ¦« § ¦° ¦¿  ¦¡ § ¦® §  ¦ ¦¬ ¦  §¨ §ª  ¦Ëœ ¦£ § ¦Å¸ ¦¾ ¦°  ¦­ ¦¿ ¦¡ ¦¿ ¦  ¦ ¦¡ ¦¿ ¦Å¸  ¦¦ § ¦– ¦¤ §  ¦¨ ¦¿ ¦Å¡ § ¦°  ¦² ¦¿ ¦ ¦• §  ¦¯ ¦¾ ¦¨:\n${partnerRefLink}&subid=wa_pitch`;
        } else if (format === 'wa_en') {
            text = `Hey ${name}, saw your work at ${company}. If your team is spending hours on manual lead qualification or repetitive WhatsApp replies, IINSHA's autonomous AI swarms can automate 85% of it on a self-hosted VPS ($5.99/mo) with zero Zapier fees.\n\nClaim a free 24-hr system audit here:\n${partnerRefLink}&subid=wa_direct`;
        } else if (format === 'li_post') {
            text = `Most founders at companies like ${company} waste 40+ hours/week on manual copy-pasting, slow customer replies, and enormous Zapier monthly bills.\n\nWe switched to IINSHA AI OS: self-hosted n8n on Docker + autonomous AI agents.\n\nResult:\n- 85% reduction in manual operational labor\n- Sub-45s speed-to-lead response\n- Zero per-task fees\n\nClaim a 100% free 24-hr video teardown for your business here:\n${partnerRefLink}&subid=linkedin_post`;
        } else {
            text = `Subject: Slashing manual ops at ${company} with an AI Workforce\n\nHi ${name},\n\nNoticed ${company} is scaling rapidly. Are your team members still handling lead qualification, customer WhatsApp chats, or invoice data entry manually?\n\nOur partner IINSHA builds self-hosted AI operating systems (n8n + multi-agent swarms + Gemini 3.0 Vision OCR) with 100% data sovereignty and zero Zapier fees.\n\nYou can claim a customized 24-hr video audit of your current stack at zero cost:\n${partnerRefLink}&subid=cold_email\n\nBest,\n${partner.name}`;
        }

        if (outputEl) outputEl.value = text;
        window.showAffiliateToast('¢Å“¨ Custom marketing pitch generated with your affiliate link embedded!');
    };

    window.copyGeneratedPitch = function() {
        const outputEl = document.getElementById('ai-work-output');
        if (outputEl) {
            outputEl.select();
            navigator.clipboard.writeText(outputEl.value);
            window.showAffiliateToast('¢Å“ Bespoke outreach pitch copied to clipboard!');
        }
    };

    // 1-Click Social Sharing
    window.shareToWhatsApp = function(link) {
        const text = encodeURIComponent(`¢Å¡¡ Check out IINSHA AI OS — Autonomous multi-agent swarms, self-hosted n8n, and 24/7 AI WhatsApp Bots: ${link}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    window.shareToTelegram = function(link) {
        const text = encodeURIComponent(`¢Å¡¡ Deploy Enterprise AI Workforce Swarms with zero Zapier fees: ${link}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${text}`, '_blank');
    };

    window.shareToLinkedIn = function(link) {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, '_blank');
    };

    window.shareToTwitter = function(link) {
        const text = encodeURIComponent(`Slashing manual operational labor by 85% with autonomous AI swarms on @insha_ai: `);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(link)}`, '_blank');
    };

    // Outreach CRM Handlers
    window.openAddProspectModal = function() {
        const name = prompt('°Å¸¤ Enter Prospect Name (e.g., Tanvir Ahmed):');
        if (!name) return;
        const company = prompt('°Å¸¢ Enter Prospect Company Name:');
        const niche = prompt('°Å¸Å½¯ Enter Niche (e.g., E-Commerce, SaaS, Real Estate):', 'E-Commerce');
        const channel = prompt('°Å¸¬ Enter Outreach Channel (e.g., WhatsApp, LinkedIn, Cold Email):', 'WhatsApp');

        const prospects = getProspects();
        prospects.unshift({
            id: 'PR-' + Math.floor(100 + Math.random() * 900),
            name,
            company: company || 'Enterprise',
            niche: niche || 'General',
            channel: channel || 'WhatsApp',
            offer: '24/7 AI WhatsApp Sales Bot ($750)',
            status: 'CONTACTED',
            date: new Date().toISOString().split('T')[0]
        });
        saveProspects(prospects);
        window.initAffiliatePortal();
        window.showAffiliateToast(`¢Å“ Prospect "${name}" added to your outreach CRM!`);
    };

    window.sendDirectProspectMessage = function(prospectId) {
        const prospects = getProspects();
        const p = prospects.find(x => x.id === prospectId);
        if (!p) return;

        const partner = getActivePartner();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/?ref=${partner.refCode}&subid=${encodeURIComponent(p.company.toLowerCase().replace(/\s+/g, '_'))}`;

        const msg = `Hi ${p.name}, sharing the free 24-hr AI system teardown link for ${p.company}: ${link}`;
        navigator.clipboard.writeText(msg);
        window.showAffiliateToast(`¢Å“ Direct pitch for ${p.name} copied to clipboard!`);
    };

    // Tab Switcher
    window.switchAffiliateTab = function(tabName) {
        document.querySelectorAll('.aff-tab-panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.lab-tab').forEach(b => b.classList.remove('active'));

        const targetPanel = document.getElementById(`tab-panel-${tabName}`);
        const targetBtn = document.getElementById(`tab-btn-${tabName}`);

        if (targetPanel) targetPanel.style.display = 'block';
        if (targetBtn) targetBtn.classList.add('active');
    };

    // Link Studio Dynamic Update
    window.updateStudioGeneratedLink = function() {
        const partner = getActivePartner();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const target = document.getElementById('link-studio-target')?.value || '/';
        const subid = document.getElementById('link-studio-subid')?.value.trim() || 'direct';
        const output = document.getElementById('link-studio-output');

        if (output) {
            const path = target === '/' ? '' : target;
            output.value = `${origin}${path}?ref=${partner.refCode}&subid=${encodeURIComponent(subid)}`;
        }
    };

    window.copyStudioLink = function() {
        const output = document.getElementById('link-studio-output');
        if (output) {
            output.select();
            navigator.clipboard.writeText(output.value);
            window.showAffiliateToast('¢Å“ Custom Tracking Link copied to clipboard!');
        }
    };

    window.copyDeepLinkDirect = function(productId, refCode) {
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/store.html?product=${productId}&ref=${refCode}`;
        navigator.clipboard.writeText(link);
        window.showAffiliateToast(`¢Å“ Direct Product Link copied for ${productId}!`);
    };

    window.copyAssetText = function(elemId) {
        const el = document.getElementById(elemId);
        if (el) {
            el.select();
            navigator.clipboard.writeText(el.value);
            window.showAffiliateToast('¢Å“ Marketing Swipe Copy copied to clipboard!');
        }
    };

    window.filterVaultCategory = function(cat) {
        document.querySelectorAll('.vault-item').forEach(item => {
            if (cat === 'all' || item.getAttribute('data-cat') === cat) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        document.querySelectorAll('[id^="vault-btn-"]').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`vault-btn-${cat}`);
        if (activeBtn) activeBtn.classList.add('active');
    };

    window.generateCustomNicheStrategy = function() {
        const niche = prompt('°Å¸Å½¯ Select target niche (e.g. "E-Commerce", "Real Estate", "SaaS", "Clinics"):', 'E-Commerce');
        if (niche) {
            const box = document.getElementById('ai-coach-custom-box');
            if (box) {
                box.innerHTML = `
                    <strong style="color:var(--accent-cyan); display:block; margin-bottom:6px;">°Å¸Å½¯ Custom AI Blueprint for ${niche}:</strong>
                    1. <strong>Primary Offer:</strong> 24/7 WhatsApp & Messenger AI Sales Bot ($750 USD /  §³91,875 BDT).<br>
                    2. <strong>Outreach Hook:</strong> Send the Bangla/English WhatsApp swipe file to ${niche} business pages.<br>
                    3. <strong>Your Earning:</strong> 25% Elite Commission = <strong>$187.50 USD ( §³22,968 BDT)</strong> per client closed!<br>
                    4. <strong>Estimated 7-Day Target:</strong> 3 Client Closes = <strong>$562.50 USD ( §³68,906 BDT)</strong>!
                `;
            }
            window.showAffiliateToast(`¢Å“¨ 7-Day Custom Strategy generated for ${niche}!`);
        }
    };

    window.requestPartnerWithdrawal = function() {
        const partner = getActivePartner();
        if (partner.unpaid <= 0) {
            alert('¢Å¡ ¯¸ No unpaid commissions currently available to withdraw.');
            return;
        }

        const confirmed = confirm(
            `¢Å¡¡ WITHDRAW COMMISSION DISBURSEMENT\n\n` +
            `Amount: $${partner.unpaid.toFixed(2)} USD (¢†  §³${Math.round(partner.unpaid * 122.50).toLocaleString()} BDT)\n` +
            `Destination: ${partner.payoutMethod} (${partner.payoutAccount})\n` +
            `Disbursement Speed: < 24 Hours\n\n` +
            `Confirm payout submission to finance desk?`
        );

        if (confirmed) {
            const txs = getTransactions();
            const txId = 'TX-' + Math.floor(8825 + Math.random() * 100);
            txs.unshift({
                id: txId,
                date: new Date().toISOString().split('T')[0],
                desc: 'Commission Withdrawal Request',
                amount: `$${partner.unpaid.toFixed(2)} USD`,
                status: 'PAID',
                method: `${partner.payoutMethod} ${partner.payoutAccount}`
            });
            saveTransactions(txs);

            partner.paidOut += partner.unpaid;
            partner.unpaid = 0;
            const registry = getPartnersRegistry();
            registry[partner.id] = partner;
            savePartnersRegistry(registry);

            window.initAffiliatePortal();
            window.showAffiliateToast(`¢Å“ Payout of $${txs[0].amount} initiated to ${partner.payoutAccount}!`);
        }
    };

    window.openPartnerSettingsModal = function() {
        const partner = getActivePartner();
        const name = prompt('°Å¸¤ Enter Full / Agency Name:', partner.name);
        if (!name) return;
        const phone = prompt('°Å¸± Enter WhatsApp / Phone Number:', partner.phone);
        const payoutMethod = prompt('°Å¸³ Enter Payout Method (bKash / Nagad / Wise / Bank / USDT):', partner.payoutMethod);
        const payoutAccount = prompt('°Å¸¦ Enter Payout Account / Wallet Number:', partner.payoutAccount);
        const refCode = prompt('°Å¸ Enter Custom Referral Slug / Code:', partner.refCode);

        partner.name = name || partner.name;
        partner.phone = phone || partner.phone;
        partner.payoutMethod = payoutMethod || partner.payoutMethod;
        partner.payoutAccount = payoutAccount || partner.payoutAccount;
        partner.refCode = (refCode || partner.refCode).toLowerCase().replace(/[^a-z0-9_-]/g, '');

        const registry = getPartnersRegistry();
        registry[partner.id] = partner;
        savePartnersRegistry(registry);

        window.initAffiliatePortal();
        window.showAffiliateToast('¢Å“ Partner profile and payment credentials updated successfully!');
    };

    window.toggleQrCodeModal = function() {
        const partner = getActivePartner();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/?ref=${partner.refCode}`;
        
        const modalHtml = `
            <div id="affiliate-qr-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);" onclick="if(event.target===this) this.remove()">
                <div style="background:#0b1329; border:1px solid var(--accent-cyan); border-radius:16px; max-width:400px; width:90%; padding:28px; color:#fff; text-align:center; box-shadow:0 0 50px rgba(0,242,254,0.3); font-family:'Inter',sans-serif;">
                    <h3 style="margin:0 0 6px 0; color:var(--accent-cyan); font-size:1.2rem;">°Å¸± Partner QR Code</h3>
                    <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:20px;">Scan to open tracking link with your referral code attached.</p>
                    
                    <div style="background:#fff; padding:16px; border-radius:12px; display:inline-block; margin-bottom:16px;">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}" alt="Partner Referral QR Code" style="display:block; width:180px; height:180px;">
                    </div>
                    
                    <div style="font-size:0.75rem; color:var(--accent-cyan); font-family:var(--font-mono); word-break:break-all; margin-bottom:18px;">${link}</div>
                    
                    <button onclick="document.getElementById('affiliate-qr-modal').remove()" class="btn btn-primary" style="width:100%; justify-content:center;">Close</button>
                </div>
            </div>
        `;
        const existing = document.getElementById('affiliate-qr-modal');
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    window.showAffiliateToast = function(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:linear-gradient(135deg, #00f2fe, #10b981); color:#030712; padding:12px 22px; border-radius:10px; font-weight:800; font-family:sans-serif; z-index:999999; box-shadow:0 8px 30px rgba(0,242,254,0.4); animation:slideUpToast 0.3s ease;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initAffiliatePortal);
    } else {
        window.initAffiliatePortal();
    }
})();



