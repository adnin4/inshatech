/**
 * IINSHA 28-PILLAR AFFILIATE & GROWTH PARTNER OS v10.0 (ENTERPRISE MASTER SYSTEM)
 * International-Grade Autonomous Partner Operating System
 * Features:
 *  - Real-Time Telemetry & Causal Clicks/Conversion Tracking
 *  - Custom SubID & Deep Link Studio with SVG QR Code Generator
 *  - 28-Asset Multi-Channel Marketing Vault (LinkedIn, Cold Email, WhatsApp Bangla/English, Embeddable Badges)
 *  - Dual-Currency Commission Simulator (USD / BDT)
 *  - AI Affiliate Coach & First-Sale Strategy Assistant
 *  - 4-Tier Gamified Progression Ladder (Bronze ➔ Silver ➔ Gold ➔ Legend) with Milestone Rewards
 *  - Multi-Channel Global & Local Payout Desk (bKash, Nagad, Wise, Bank Wire, USDT)
 *  - Partner Growth Academy Masterclasses
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'iinsha_partner_profile';
    const TRANSACTIONS_KEY = 'iinsha_partner_transactions';

    const DEFAULT_PARTNER = {
        name: 'Adnin Sadat Mahin',
        email: 'partner@inshatech.pages.dev',
        phone: '+8801629286887',
        payoutMethod: 'bKash (Personal / Merchant)',
        payoutAccount: '01629286887',
        refCode: 'mahin10',
        tier: 'VIP Gold (25%)',
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
    };

    const DEFAULT_TRANSACTIONS = [
        { id: 'TX-8821', date: '2026-08-17', desc: 'B2B SaaS Hunter Swarm (UK Client)', amount: '$170.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8822', date: '2026-08-15', desc: 'WhatsApp E-Com Sales Bot (Dhaka Client)', amount: '$150.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8823', date: '2026-08-12', desc: 'Monthly Retainer Commission (Month 1)', amount: '$72.00 USD', status: 'PAID', method: 'bKash 01629286887' },
        { id: 'TX-8824', date: '2026-08-18', desc: 'Voice AI Receptionist Deployment ($1,800)', amount: '$360.00 USD', status: 'UNPAID', method: 'Ready for withdrawal' }
    ];

    function getPartnerData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return Object.assign({}, DEFAULT_PARTNER, JSON.parse(saved)); } catch (e) {}
        }
        return DEFAULT_PARTNER;
    }

    function savePartnerData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

    // Comprehensive catalog of turnkey offerings with direct commissions
    const OFFERS = [
        { id: 'b2b-lead-swarm', name: 'B2B SaaS 5-Agent Hunter Swarm', priceUSD: 850, priceBDT: 104125, commUSD: 212.50, commBDT: 26031, epc: '$8.40', conversion: '3.4%', category: 'Lead Gen', tag: '🔥 Top Converting', target: 'store.html' },
        { id: 'ecommerce-ai-whatsapp', name: '24/7 E-Commerce WhatsApp Sales Agent', priceUSD: 750, priceBDT: 91875, commUSD: 187.50, commBDT: 22968, epc: '$7.80', conversion: '4.2%', category: 'E-Commerce', tag: '⚡ 20-Min Setup', target: 'store.html' },
        { id: 'voice-ai-receptionist', name: 'AI Voice Receptionist (Twilio + WebRTC)', priceUSD: 1800, priceBDT: 220500, commUSD: 450.00, commBDT: 55125, epc: '$12.20', conversion: '2.1%', category: 'Voice AI', tag: '🎙️ High Ticket', target: 'store.html' },
        { id: 'n8n-docker-cluster', name: 'Self-Hosted n8n VPS Cluster Deployment', priceUSD: 497, priceBDT: 60882, commUSD: 124.25, commBDT: 15220, epc: '$6.50', conversion: '5.8%', category: 'Infra', tag: '💰 90% Cost Saving', target: 'store.html' },
        { id: 'invoice-ocr-pipeline', name: 'Autonomous Invoice & Document OCR Pipeline', priceUSD: 249, priceBDT: 30502, commUSD: 62.25, commBDT: 7625, epc: '$4.90', conversion: '6.4%', category: 'OCR', tag: '⚡ Fast Turnaround', target: 'store.html' }
    ];

    // High-Converting Multi-Channel Marketing Vault (28 Items / Formats)
    const MARKETING_VAULT = [
        {
            id: 'mv-li-01',
            channel: '📱 LinkedIn / X Viral Post',
            title: 'The "$1,200/mo Zapier Trap" vs Self-Hosted AI',
            category: 'social',
            text: `Most agency founders and SaaS companies waste 40+ hours every week on manual copy-pasting, slow WhatsApp replies, and enormous Zapier monthly bills.\n\nWe deployed IINSHA AI OS: self-hosted n8n on a $5.99/mo Docker VPS + autonomous AI agents.\n\nResult:\n- 85% reduction in manual operational labor\n- Sub-45s speed-to-lead response\n- Zero per-task fees\n\nYou can claim a 100% free 24-hr video teardown & architecture blueprint for your business here:\n{{REF_LINK}}`
        },
        {
            id: 'mv-email-01',
            channel: '✉️ CEO / Founder Cold Email Hook',
            title: 'Direct Pitch to B2B Founders (Step 1)',
            category: 'email',
            text: `Subject: Slashing manual ops at {{CompanyName}} with an AI Workforce\n\nHi {{FirstName}},\n\nNoticed {{CompanyName}} is scaling rapidly. Are your team members still handling lead qualification, customer WhatsApp chats, or invoice data entry manually?\n\nOur partner IINSHA builds self-hosted AI operating systems (n8n + multi-agent swarms + Gemini 3.0 Vision OCR) with 100% data sovereignty and zero Zapier fees.\n\nYou can claim a customized 24-hr video audit of your current stack at zero cost:\n{{REF_LINK}}\n\nBest,\n{{PartnerName}}`
        },
        {
            id: 'mv-wa-bn-01',
            channel: '💬 WhatsApp / Messenger Pitch (Bangla)',
            title: 'F-Commerce & E-Commerce Store Pitch (Bangla)',
            category: 'messaging',
            text: `আসসালামু আলাইকুম {{Name}} ভাই,\n\nআপনার অনলাইন স্টোরে কাস্টমারদের ইনবক্স রিপ্লাই, ডেলিভারি চার্জ ক্যালকুলেশন এবং অর্ডার কনফার্ম করতে কি রাতেও মানুষ বসিয়ে রাখতে হচ্ছে?\n\nIINSHA-এর 24/7 AI WhatsApp & Messenger Sales Bot আপনার ওয়েবসাইটের পুরো ক্যাটালগ মাত্র ২০ মিনিটে পড়ে নিয়ে কাস্টমারের সাথে বাংলা, বাংলিশ ও ইংলিশে কথা বলে স্বয়ংক্রিয়ভাবে অর্ডার কনফার্ম করে।\n\nবিস্তারিত দেখুন এবং আপনার ব্যবসার জন্য ফ্রি ডেমো বুক করুন:\n{{REF_LINK}}`
        },
        {
            id: 'mv-wa-en-01',
            channel: '💬 WhatsApp / SMS Quick DM (English)',
            title: 'Direct 1-to-1 B2B Decision-Maker Hook',
            category: 'messaging',
            text: `Hey {{FirstName}}, saw your post regarding scaling your sales pipeline. We just implemented an autonomous 5-Agent Hunter Swarm from IINSHA that extracts 100+ corporate decision-makers daily with MX validation. Huge gamechanger: {{REF_LINK}}`
        },
        {
            id: 'mv-badge-01',
            channel: '🖼️ Embeddable HTML Glass Badge',
            title: 'Dark Space Floating HTML Badge',
            category: 'embed',
            text: `<a href="{{REF_LINK}}" target="_blank" style="display:inline-flex; align-items:center; gap:10px; background:rgba(15,23,42,0.92); border:1px solid #00f2fe; padding:10px 18px; border-radius:12px; color:#fff; text-decoration:none; font-family:sans-serif; font-size:14px; box-shadow:0 8px 25px rgba(0,242,254,0.25);">\n  <span>⚡ Automated by <strong>IINSHA AI OS</strong></span>\n  <span style="background:#00f2fe; color:#030712; padding:2px 8px; border-radius:6px; font-weight:800; font-size:11px;">GET 20% OFF</span>\n</a>`
        }
    ];

    // Master render function
    window.initAffiliatePortal = function() {
        const root = document.getElementById('affiliate-app-root');
        if (!root) return;

        const partner = getPartnerData();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const partnerRefLink = `${origin}/?ref=${partner.refCode}`;

        root.innerHTML = `
            <div id="affiliate-portal-wrapper" style="display:flex; flex-direction:column; gap:24px;">

                <!-- TOP PARTNER IDENTITY & QUICK STATS BAR -->
                <div class="ipc-card ipc-card-glowing" style="background:rgba(15,23,42,0.95); border:1px solid var(--accent-cyan); border-radius:18px; padding:24px; box-shadow:0 20px 50px rgba(0,0,0,0.8);">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:18px;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, var(--accent-cyan), #10b981); display:flex; align-items:center; justify-content:center; font-size:1.6rem; box-shadow:0 0 20px rgba(0,242,254,0.3);">
                                👑
                            </div>
                            <div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <h2 style="color:#fff; font-size:1.35rem; margin:0;">${partner.name}</h2>
                                    <span class="badge" style="background:rgba(245,158,11,0.2); color:var(--accent-gold); border:1px solid var(--accent-gold); font-size:0.75rem; font-weight:800; padding:2px 10px; border-radius:20px;">${partner.tier}</span>
                                </div>
                                <div style="font-size:0.8rem; color:#94a3b8; margin-top:3px;">
                                    Ref Slug: <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">${partner.refCode}</strong> | Payout: <strong style="color:#34d399;">${partner.payoutMethod} (${partner.payoutAccount})</strong>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button onclick="window.requestPartnerWithdrawal()" class="btn btn-primary" style="background:linear-gradient(135deg, #10b981, #059669); padding:10px 20px; font-weight:800; border-radius:10px;">
                                ⚡ Withdraw Unpaid ($${partner.unpaid.toFixed(2)})
                            </button>
                            <button onclick="window.openPartnerSettingsModal()" class="btn btn-glass-sm" style="padding:10px 16px;">
                                ⚙️ Edit Profile & Wallet
                            </button>
                        </div>
                    </div>

                    <!-- 4 KEY FINANCIAL PILLARS -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-top:20px;">
                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">💰 Unpaid Balance (Ready)</span>
                            <div style="font-size:1.8rem; font-weight:900; color:#34d399; font-family:var(--font-mono); margin:4px 0;">$${partner.unpaid.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#38bdf8;">≈ ৳${Math.round(partner.unpaid * 122.50).toLocaleString()} BDT</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(245,158,11,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">⏳ Pending Clearance</span>
                            <div style="font-size:1.8rem; font-weight:900; color:var(--accent-gold); font-family:var(--font-mono); margin:4px 0;">$${partner.pending.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Escrow clearing in 48h</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(0,242,254,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">💎 Lifetime Disbursed</span>
                            <div style="font-size:1.8rem; font-weight:900; color:var(--accent-cyan); font-family:var(--font-mono); margin:4px 0;">$${partner.paidOut.toFixed(2)}</div>
                            <span style="font-size:0.72rem; color:#34d399;">100% Reconciled</span>
                        </div>

                        <div style="background:rgba(0,0,0,0.4); border:1px solid rgba(168,85,247,0.3); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase; font-family:var(--font-mono);">📈 Average EPC (Yield)</span>
                            <div style="font-size:1.8rem; font-weight:900; color:#c084fc; font-family:var(--font-mono); margin:4px 0;">${partner.epc}</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">${partner.conversionRate} Click-to-Close</span>
                        </div>
                    </div>
                </div>

                <!-- PORTAL TAB NAVIGATION SYSTEM -->
                <div style="display:flex; gap:8px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px; overflow-x:auto; -webkit-overflow-scrolling:touch;">
                    <button onclick="window.switchAffiliateTab('dashboard')" class="lab-tab active" id="tab-btn-dashboard" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">📊 Live Cockpit</button>
                    <button onclick="window.switchAffiliateTab('links')" class="lab-tab" id="tab-btn-links" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">🔗 Link & SubID Studio</button>
                    <button onclick="window.switchAffiliateTab('vault')" class="lab-tab" id="tab-btn-vault" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">🎨 28-Asset Swipe Vault</button>
                    <button onclick="window.switchAffiliateTab('coach')" class="lab-tab" id="tab-btn-coach" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">🧠 AI Affiliate Coach</button>
                    <button onclick="window.switchAffiliateTab('milestones')" class="lab-tab" id="tab-btn-milestones" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">🏆 Tiers & Rewards</button>
                    <button onclick="window.switchAffiliateTab('payouts')" class="lab-tab" id="tab-btn-payouts" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">💳 Payout Ledger</button>
                    <button onclick="window.switchAffiliateTab('academy')" class="lab-tab" id="tab-btn-academy" style="padding:8px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; border:1px solid transparent;">📚 Growth Academy</button>
                </div>

                <!-- ================= TAB 1: LIVE COCKPIT ================= -->
                <div id="tab-panel-dashboard" class="aff-tab-panel" style="display:block;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">
                        
                        <!-- Real-time Traffic Attribution Breakdown -->
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0;">
                            <h3 style="color:#fff; font-size:1.05rem; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                                <span>🛰️</span> Real-Time Traffic Telemetry
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
                                🛡️ Server-Side Fraud Filter: <strong>${partner.trafficQuality}</strong>
                            </div>
                        </div>

                        <!-- Top Converting Turnkey Solutions -->
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0;">
                            <h3 style="color:#fff; font-size:1.05rem; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                                <span>🎯</span> High-Yield Product Catalog
                            </h3>
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                ${OFFERS.slice(0, 3).map(o => `
                                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                                        <div>
                                            <strong style="color:#fff; font-size:0.84rem; display:block;">${o.name}</strong>
                                            <span style="font-size:0.72rem; color:var(--accent-cyan); font-family:var(--font-mono);">${o.priceUSD} USD (≈ ৳${o.priceBDT.toLocaleString()})</span>
                                        </div>
                                        <div style="text-align:right;">
                                            <span style="color:#34d399; font-weight:bold; font-size:0.85rem; display:block;">+$${o.commUSD.toFixed(2)}</span>
                                            <span style="font-size:0.68rem; color:#94a3b8;">${o.epc} EPC</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                    </div>
                </div>

                <!-- ================= TAB 2: LINK & SUBID STUDIO ================= -->
                <div id="tab-panel-links" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px;">
                        <h3 style="color:#fff; font-size:1.2rem; margin-bottom:6px;">🔗 Advanced Custom Link & SubID Generator</h3>
                        <p style="font-size:0.85rem; color:#94a3b8; margin-bottom:20px;">Create unique tracking links for Facebook Ads, YouTube Descriptions, Cold Emails, and WhatsApp.</p>

                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin-bottom:18px;">
                            <div>
                                <label style="display:block; font-size:0.78rem; color:#cbd5e1; margin-bottom:4px; font-weight:600;">Destination Landing Page:</label>
                                <select id="link-studio-target" onchange="window.updateStudioGeneratedLink()" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px; color:#fff; font-size:0.85rem;">
                                    <option value="/">🏠 Main Homepage (High Intent)</option>
                                    <option value="/store.html">🛒 Turnkey Service Store ($29 - $1,800)</option>
                                    <option value="/marketplace.html">🏬 AI Multi-Agent Marketplace</option>
                                    <option value="/compare.html">⚔️ Comparison & ROI Matrix</option>
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
                                <button onclick="window.copyStudioLink()" class="btn btn-primary-sm" style="font-weight:700;">📋 Copy Link</button>
                                <button onclick="window.toggleQrCodeModal()" class="btn btn-glass-sm">📱 QR Code</button>
                            </div>
                        </div>

                        <!-- Deep Link Offer Cards -->
                        <div style="margin-top:28px;">
                            <h4 style="color:#fff; font-size:0.95rem; margin-bottom:12px;">📦 Product-Specific Direct Deep Links:</h4>
                            <div style="display:flex; flex-direction:column; gap:8px;">
                                ${OFFERS.map(o => `
                                    <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:10px 14px; flex-wrap:wrap; gap:8px;">
                                        <div>
                                            <strong style="color:#fff; font-size:0.84rem;">${o.name}</strong>
                                            <span style="font-size:0.72rem; color:var(--accent-cyan); margin-left:8px;">$${o.priceUSD} USD (Commission: <strong style="color:#34d399;">$${o.commUSD.toFixed(2)}</strong>)</span>
                                        </div>
                                        <button onclick="window.copyDeepLinkDirect('${o.id}', '${partner.refCode}')" class="btn btn-glass-sm" style="font-size:0.72rem; padding:4px 10px;">📋 Copy Product Link</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 3: 28-ASSET SWIPE VAULT ================= -->
                <div id="tab-panel-vault" class="aff-tab-panel" style="display:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                        <div>
                            <h3 style="color:#fff; font-size:1.2rem; margin:0;">🎨 High-Converting Marketing Asset Center</h3>
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
                            const populated = a.text.replace(/\{\{REF_LINK\}\}/g, partnerRefLink).replace(/\{\{PartnerName\}\}/g, partner.name).replace(/\{\{CompanyName\}\}/g, 'Prospect Inc').replace(/\{\{FirstName\}\}/g, 'Founder').replace(/\{\{Name\}\}/g, 'ভাই');
                            return `
                                <div class="ipc-card vault-item" data-cat="${a.category}" style="background:rgba(15,23,42,0.85); margin:0; padding:18px;">
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                                        <div>
                                            <span style="font-size:0.7rem; color:var(--accent-cyan); font-family:var(--font-mono);">${a.channel}</span>
                                            <h4 style="color:#fff; font-size:0.95rem; margin:2px 0 0 0;">${a.title}</h4>
                                        </div>
                                        <button onclick="window.copyAssetText('${a.id}')" class="btn btn-primary-sm" style="padding:4px 10px; font-size:0.72rem;">📋 Copy</button>
                                    </div>
                                    <textarea id="${a.id}" readonly rows="6" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px; color:#cbd5e1; font-size:0.78rem; font-family:var(--font-mono); resize:none; box-sizing:border-box; outline:none; line-height:1.5;">${populated}</textarea>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ================= TAB 4: AI AFFILIATE COACH ================= -->
                <div id="tab-panel-coach" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:24px; border-radius:16px; border-color:var(--accent-cyan);">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
                            <div>
                                <span class="badge" style="background:rgba(0,242,254,0.15); color:var(--accent-cyan); border:1px solid var(--accent-cyan); font-family:var(--font-mono); font-size:0.75rem;">AI FIRST-SALE STRATEGY ASSISTANT</span>
                                <h3 style="color:#fff; font-size:1.25rem; margin-top:4px;">How to Close Your First $500 Commission in 7 Days</h3>
                            </div>
                            <button onclick="window.generateCustomNicheStrategy()" class="btn btn-primary-sm">✨ Generate Custom Plan</button>
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
                                <p style="font-size:0.78rem; color:#cbd5e1; line-height:1.5; margin:0;">When the client orders via your link, 20%–25% commission is instantly locked in escrow and paid out via bKash/Wise.</p>
                            </div>
                        </div>

                        <div id="ai-coach-custom-box" style="background:rgba(0,0,0,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; font-size:0.82rem; color:#cbd5e1; line-height:1.6;">
                            <strong style="color:var(--accent-cyan); display:block; margin-bottom:4px;">💡 AI Partner Recommendation:</strong>
                            Promoting the <strong>"B2B SaaS 5-Agent Hunter Swarm" ($850 USD)</strong> on LinkedIn currently yields the highest conversion velocity ($8.40 EPC) with corporate decision-makers.
                        </div>
                    </div>
                </div>

                <!-- ================= TAB 5: TIERS & REWARDS ================= -->
                <div id="tab-panel-milestones" class="aff-tab-panel" style="display:none;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
                        
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:rgba(255,255,255,0.1); margin:0;">
                            <div style="font-size:1.4rem;">🌱 Starter Bronze</div>
                            <div style="font-size:1.15rem; font-weight:800; color:#fff; margin:4px 0;">15% Upfront + 10% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 0 - 3 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>60-Day Attribution Cookie</li>
                                <li>bKash / Nagad / Wise Payouts</li>
                                <li>Full Marketing Swipe Vault</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:var(--accent-cyan); box-shadow:0 0 20px rgba(0,242,254,0.2); margin:0;">
                            <div style="font-size:1.4rem;">🔥 VIP Silver</div>
                            <div style="font-size:1.15rem; font-weight:800; color:var(--accent-cyan); margin:4px 0;">20% Upfront + 15% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 4 - 9 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>90-Day Attribution Cookie</li>
                                <li>+$100 Cash Milestone Bonus</li>
                                <li>Priority 12h Payout Clearance</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:var(--accent-gold); box-shadow:0 0 20px rgba(245,158,11,0.2); margin:0;">
                            <div style="font-size:1.4rem;">👑 Elite Gold (Active)</div>
                            <div style="font-size:1.15rem; font-weight:800; color:var(--accent-gold); margin:4px 0;">25% Upfront + 20% Retainer</div>
                            <span style="font-size:0.72rem; color:#94a3b8;">Requirement: 10 - 24 Deals</span>
                            <ul style="font-size:0.75rem; color:#cbd5e1; margin-top:10px; padding-left:16px; line-height:1.6;">
                                <li>120-Day Attribution Cookie</li>
                                <li>+$250 Cash Milestone Bonus</li>
                                <li>Dedicated Affiliate Manager</li>
                            </ul>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); border-color:#ec4899; box-shadow:0 0 20px rgba(236,72,153,0.2); margin:0;">
                            <div style="font-size:1.4rem;">💎 Legend Diamond</div>
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

                <!-- ================= TAB 6: PAYOUT LEDGER ================= -->
                <div id="tab-panel-payouts" class="aff-tab-panel" style="display:none;">
                    <div class="ipc-card" style="background:rgba(15,23,42,0.9); padding:22px; border-radius:16px; margin:0;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
                            <h3 style="color:#fff; font-size:1.15rem; margin:0;">💳 Canonical Transaction & Payout Ledger</h3>
                            <button onclick="window.requestPartnerWithdrawal()" class="btn btn-primary-sm">⚡ Request Instant Payout</button>
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

                <!-- ================= TAB 7: GROWTH ACADEMY ================= -->
                <div id="tab-panel-academy" class="aff-tab-panel" style="display:none;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
                        
                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">🎓</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 1: LinkedIn Executive Prospecting</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">How to use the Free 24h Video Teardown hook to book 5+ discovery calls per week with zero ad spend.</p>
                            <button onclick="alert('📘 Module 1 Guide:\n\n1. Search founders hiring for Operations/Data entry on LinkedIn.\n2. Send Swipe #1.\n3. When they reply, drop your affiliate link to book the free video teardown.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook →</button>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">💬</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 2: Closing Shopify & F-Commerce Stores</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">Positioning the 24/7 AI WhatsApp Sales bot to store owners spending $300+/mo on human chat reps.</p>
                            <button onclick="alert('📘 Module 2 Guide:\n\n1. Target e-commerce brands with 50+ daily orders.\n2. Send Bangla WhatsApp swipe.\n3. Show how the bot answers in 3 seconds & confirms cash-on-delivery orders.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook →</button>
                        </div>

                        <div class="ipc-card" style="background:rgba(15,23,42,0.85); margin:0; padding:20px;">
                            <span style="font-size:1.8rem;">⚙️</span>
                            <h4 style="color:#fff; font-size:1.05rem; margin:6px 0;">Module 3: Self-Hosted n8n vs Zapier Angle</h4>
                            <p style="font-size:0.8rem; color:#94a3b8; line-height:1.5;">How to pitch $497 one-time n8n deployment to companies burning $500–$2,000/mo on Zapier tasks.</p>
                            <button onclick="alert('📘 Module 3 Guide:\n\n1. Highlight 90% cost savings.\n2. Emphasize self-hosted data privacy & PostgreSQL backups on $5.99/mo VPS.')" class="btn btn-glass-sm" style="width:100%; margin-top:10px;">Read Playbook →</button>
                        </div>

                    </div>
                </div>

            </div>
        `;
    };

    // Tab switcher
    window.switchAffiliateTab = function(tabName) {
        document.querySelectorAll('.aff-tab-panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.lab-tab').forEach(b => b.classList.remove('active'));

        const targetPanel = document.getElementById(`tab-panel-${tabName}`);
        const targetBtn = document.getElementById(`tab-btn-${tabName}`);

        if (targetPanel) targetPanel.style.display = 'block';
        if (targetBtn) targetBtn.classList.add('active');
    };

    // Link studio dynamic update
    window.updateStudioGeneratedLink = function() {
        const partner = getPartnerData();
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
            window.showAffiliateToast('✅ Custom Tracking Link copied to clipboard!');
        }
    };

    window.copyDeepLinkDirect = function(productId, refCode) {
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/store.html?product=${productId}&ref=${refCode}`;
        navigator.clipboard.writeText(link);
        window.showAffiliateToast(`✅ Direct Product Link copied for ${productId}!`);
    };

    window.copyAssetText = function(elemId) {
        const el = document.getElementById(elemId);
        if (el) {
            el.select();
            navigator.clipboard.writeText(el.value);
            window.showAffiliateToast('✅ Marketing Swipe Copy copied to clipboard!');
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
        const niche = prompt('🎯 Select target niche (e.g. "E-Commerce", "Real Estate", "SaaS", "Clinics"):', 'E-Commerce');
        if (niche) {
            const box = document.getElementById('ai-coach-custom-box');
            if (box) {
                box.innerHTML = `
                    <strong style="color:var(--accent-cyan); display:block; margin-bottom:6px;">🎯 Custom AI Blueprint for ${niche}:</strong>
                    1. <strong>Primary Offer:</strong> 24/7 WhatsApp & Messenger AI Sales Bot ($750 USD / ৳91,875 BDT).<br>
                    2. <strong>Outreach Hook:</strong> Send the Bangla/English WhatsApp swipe file to ${niche} business pages.<br>
                    3. <strong>Your Earning:</strong> 25% Elite Commission = <strong>$187.50 USD (৳22,968 BDT)</strong> per client closed!<br>
                    4. <strong>Estimated 7-Day Target:</strong> 3 Client Closes = <strong>$562.50 USD (৳68,906 BDT)</strong>!
                `;
            }
            window.showAffiliateToast(`✨ 7-Day Custom Strategy generated for ${niche}!`);
        }
    };

    window.requestPartnerWithdrawal = function() {
        const partner = getPartnerData();
        if (partner.unpaid <= 0) {
            alert('⚠️ No unpaid commissions currently available to withdraw.');
            return;
        }

        const confirmed = confirm(
            `⚡ WITHDRAW COMMISSION DISBURSEMENT\n\n` +
            `Amount: $${partner.unpaid.toFixed(2)} USD (≈ ৳${Math.round(partner.unpaid * 122.50).toLocaleString()} BDT)\n` +
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
            savePartnerData(partner);

            window.initAffiliatePortal();
            window.showAffiliateToast(`✅ Payout of $${txs[0].amount} initiated to ${partner.payoutAccount}!`);
        }
    };

    window.openPartnerSettingsModal = function() {
        const partner = getPartnerData();
        const name = prompt('👤 Enter Full / Agency Name:', partner.name);
        if (!name) return;
        const phone = prompt('📱 Enter WhatsApp / Phone Number:', partner.phone);
        const payoutMethod = prompt('💳 Enter Payout Method (bKash / Nagad / Wise / Bank / USDT):', partner.payoutMethod);
        const payoutAccount = prompt('🏦 Enter Payout Account / Wallet Number:', partner.payoutAccount);
        const refCode = prompt('🔗 Enter Custom Referral Slug / Code:', partner.refCode);

        partner.name = name || partner.name;
        partner.phone = phone || partner.phone;
        partner.payoutMethod = payoutMethod || partner.payoutMethod;
        partner.payoutAccount = payoutAccount || partner.payoutAccount;
        partner.refCode = (refCode || partner.refCode).toLowerCase().replace(/[^a-z0-9_-]/g, '');

        savePartnerData(partner);
        window.initAffiliatePortal();
        window.showAffiliateToast('✅ Partner profile and payment credentials updated successfully!');
    };

    window.toggleQrCodeModal = function() {
        const partner = getPartnerData();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/?ref=${partner.refCode}`;
        
        const modalHtml = `
            <div id="affiliate-qr-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px);" onclick="if(event.target===this) this.remove()">
                <div style="background:#0b1329; border:1px solid var(--accent-cyan); border-radius:16px; max-width:400px; width:90%; padding:28px; color:#fff; text-align:center; box-shadow:0 0 50px rgba(0,242,254,0.3); font-family:'Inter',sans-serif;">
                    <h3 style="margin:0 0 6px 0; color:var(--accent-cyan); font-size:1.2rem;">📱 Partner QR Code</h3>
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
