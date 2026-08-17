/**
 * IINSHA 28-PILLAR AFFILIATE & GROWTH PARTNER OS v6.0 (MASTER SPECIFICATION)
 * Client-Side Registration, Live Link Generator, Real-Time Analytics Dashboard,
 * Marketing Asset Center, Gamified Milestones, AI First-Sale Assistant & Fraud Shield
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'iinsha_partner_profile';
    const DEFAULT_PARTNER = {
        name: 'Adnin Sadat Mahin',
        email: 'partner@inshatech.pages.dev',
        phone: '+8801629286887',
        payoutMethod: 'bKash (Merchant / Personal)',
        payoutAccount: '01629286887',
        refCode: 'mahin10',
        tier: 'VIP Silver (20%)',
        unpaid: 450.00,
        pending: 150.00,
        paidOut: 1240.00,
        totalClicks: 142,
        conversions: 6,
        trafficQuality: '98% Clean (Low Risk)',
        registeredAt: '2026-08-18'
    };

    function getPartnerData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return DEFAULT_PARTNER;
    }

    function savePartnerData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    const OFFERS = [
        { id: 'b2b-lead-swarm', name: 'B2B SaaS 5-Agent Hunter Swarm', price: '$850 USD', comm: '20% ($170 + $34/mo)', epc: '$8.40', tag: '🔥 Top Converting' },
        { id: 'ecommerce-ai-whatsapp', name: '24/7 E-Commerce WhatsApp & Messenger Bot', price: '$750 USD', comm: '20% ($150 + $30/mo)', epc: '$7.80', tag: '⚡ 20-Min Setup' },
        { id: 'n8n-docker-cluster', name: 'Self-Hosted n8n Enterprise Cluster Deployment', price: '$497 USD', comm: '20% ($99.40 + $20/mo)', epc: '$6.50', tag: '💰 90% Cost Saving' },
        { id: 'invoice-ocr-pipeline', name: 'Autonomous Invoice & Document OCR Pipeline', price: '$249 USD', comm: '20% ($49.80 + $10/mo)', epc: '$4.90', tag: '⚡ Instant Delivery' },
        { id: 'voice-ai-receptionist', name: 'AI Voice Receptionist (Twilio + WebRTC)', price: '$1,800 USD', comm: '20% ($360 + $72/mo)', epc: '$9.20', tag: '🎙️ Zero Latency' }
    ];

    const MARKETING_ASSETS = [
        {
            id: 'asset-linkedin-01',
            type: '📱 LinkedIn & Twitter/X Pitch Copy',
            title: 'High-Converting B2B Automation Hook',
            text: `Most companies waste 40+ hours/week on manual data entry, slow customer replies, and high Zapier bills.\n\nWe switched to IINSHA AI OS (self-hosted n8n + autonomous AI agents) and slashed operational costs by 85%.\n\nClaim a free 24-hr AI system teardown for your business here:\n{{REF_LINK}}`
        },
        {
            id: 'asset-email-01',
            type: '✉️ Client B2B Email Outreach Swipe',
            title: 'Direct CEO/Founder Cold Outreach',
            text: `Subject: Slashing manual ops with an AI Workforce\n\nHi {{FirstName}},\n\nAre you still handling customer qualification and invoice data entry manually?\n\nOur partner IINSHA builds self-hosted AI operating systems (n8n + Gemini Vision OCR) with zero per-task fees.\n\nYou can claim a 100% free 24-hr video audit of your tech stack using our priority link: {{REF_LINK}}\n\nBest,\n{{PartnerName}}`
        },
        {
            id: 'asset-badge-01',
            type: '🖼️ Embeddable HTML Glass Badge',
            title: 'Website Footer Partner Badge',
            text: `<a href="{{REF_LINK}}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:rgba(15,23,42,0.9); border:1px solid #00f2fe; padding:8px 16px; border-radius:10px; color:#fff; text-decoration:none; font-family:sans-serif; font-size:13px;">\n  <span>⚡ Automated by <strong>IINSHA AI OS</strong></span>\n</a>`
        }
    ];

    window.initAffiliatePortal = function() {
        const root = document.getElementById('affiliate-app-root');
        if (!root) return;

        const partner = getPartnerData();
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const partnerRefLink = `${origin}/?ref=${partner.refCode}`;

        root.innerHTML = `
            <div id="affiliate-portal-wrapper" style="display:flex; flex-direction:column; gap:30px;">
                
                <!-- 1. PARTNER REGISTRATION CARD -->
                <div id="affiliate-register-card" class="ipc-card ipc-card-glowing" style="background:rgba(15,23,42,0.95); border:1px solid #00f2fe; border-radius:18px; padding:28px; box-shadow:0 15px 40px rgba(0,242,254,0.15);">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px;">
                        <div>
                            <span style="background:rgba(0,242,254,0.15); color:#00f2fe; font-size:0.75rem; font-weight:800; padding:3px 10px; border-radius:20px; border:1px solid rgba(0,242,254,0.4); text-transform:uppercase;">🚀 Step 1: Onboarding</span>
                            <h3 style="color:#fff; font-size:1.4rem; margin:8px 0 4px 0;">Affiliate & Growth Partner Registration</h3>
                            <p style="color:#94a3b8; font-size:0.85rem; margin:0;">Create your account in 30 seconds to get your tracking link & start earning 20% to 30% recurring commissions.</p>
                        </div>
                        <div style="text-align:right;">
                            <span style="color:#10b981; font-weight:700; font-size:0.9rem;">● Instant Free Approval</span>
                        </div>
                    </div>

                    <form id="affiliate-reg-form" onsubmit="window.handleAffiliateRegistration(event)" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:18px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Full Name / Agency Name *</label>
                            <input type="text" id="reg-name" required value="${partner.name || ''}" placeholder="e.g. Tanvir Ahmed" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Email Address *</label>
                            <input type="email" id="reg-email" required value="${partner.email || ''}" placeholder="e.g. tanvir@agency.com" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">WhatsApp / Phone Number *</label>
                            <input type="tel" id="reg-phone" required value="${partner.phone || ''}" placeholder="e.g. +8801700000000" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Preferred Payout Method *</label>
                            <select id="reg-payout-method" required style="width:100%; background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                                <option value="bKash (Merchant / Personal)" ${partner.payoutMethod.includes('bKash') ? 'selected' : ''}>🇧🇩 bKash (Personal / Merchant)</option>
                                <option value="Nagad" ${partner.payoutMethod.includes('Nagad') ? 'selected' : ''}>🇧🇩 Nagad</option>
                                <option value="Wise Bank Wire" ${partner.payoutMethod.includes('Wise') ? 'selected' : ''}>🌍 Wise Bank Wire (USD/GBP/EUR)</option>
                                <option value="Local Bank Transfer" ${partner.payoutMethod.includes('Bank') ? 'selected' : ''}>🏦 Local Bank Transfer (BD/Global)</option>
                                <option value="USDT Crypto (TRC20)" ${partner.payoutMethod.includes('USDT') ? 'selected' : ''}>⚡ USDT Crypto (TRC20 / BEP20)</option>
                            </select>
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Payout Account / Wallet Number *</label>
                            <input type="text" id="reg-payout-acc" required value="${partner.payoutAccount || ''}" placeholder="e.g. 017xxxxxxxx or IBAN / Wallet" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#fff; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; color:#cbd5e1; margin-bottom:6px; font-weight:600;">Custom Referral Slug / Code *</label>
                            <input type="text" id="reg-ref-code" required value="${partner.refCode || 'growth'}" placeholder="e.g. tanvir10" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#00f2fe; font-weight:700; font-family:'Fira Code',monospace; font-size:0.9rem; outline:none; box-sizing:border-box;">
                        </div>

                        <div style="grid-column: 1 / -1; margin-top:6px;">
                            <button type="submit" class="btn btn-primary" style="width:100%; background:linear-gradient(135deg, #00f2fe, #0284c7); padding:14px; font-size:1rem; font-weight:800; border-radius:10px; cursor:pointer; box-shadow:0 0 20px rgba(0,242,254,0.4);">
                                🚀 Save Profile & Launch Partner Dashboard →
                            </button>
                        </div>
                    </form>
                </div>

                <!-- 2. REAL-TIME LIVE PARTNER DASHBOARD -->
                <div id="affiliate-dashboard-section" class="ipc-card" style="background:rgba(15,23,42,0.95); border:1px solid #10b981; border-radius:18px; padding:28px; box-shadow:0 20px 50px rgba(0,0,0,0.7);">
                    
                    <!-- Top Profile & Payout Trigger -->
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:20px; margin-bottom:24px; flex-wrap:wrap; gap:14px;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <div style="width:50px; height:50px; border-radius:12px; background:linear-gradient(135deg, #10b981, #0284c7); display:flex; align-items:center; justify-content:center; font-size:1.5rem;">
                                👑
                            </div>
                            <div>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <h3 style="color:#fff; font-size:1.3rem; margin:0;" id="dash-partner-name">${partner.name}</h3>
                                    <span style="background:rgba(16,185,129,0.2); color:#10b981; border:1px solid #10b981; font-size:0.75rem; font-weight:800; padding:2px 10px; border-radius:20px;">${partner.tier}</span>
                                    <span style="background:rgba(0,242,254,0.1); color:#00f2fe; border:1px solid rgba(0,242,254,0.3); font-size:0.7rem; font-weight:600; padding:2px 8px; border-radius:12px;">🛡️ ${partner.trafficQuality}</span>
                                </div>
                                <div style="color:#94a3b8; font-size:0.8rem; font-family:'Fira Code',monospace; margin-top:2px;">
                                    Code: <strong style="color:#00f2fe;">${partner.refCode}</strong> • Payout: ${partner.payoutMethod} (${partner.payoutAccount})
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button onclick="window.requestPartnerWithdrawal()" class="btn btn-primary" style="background:linear-gradient(135deg, #10b981, #059669); padding:10px 20px; font-size:0.85rem; font-weight:bold; cursor:pointer;">
                                💳 Request Payout ($${partner.unpaid.toFixed(2)})
                            </button>
                            <a href="#affiliate-register-card" class="btn btn-glass" style="padding:10px 14px; font-size:0.85rem; text-decoration:none;">
                                ⚙️ Edit Profile
                            </a>
                        </div>
                    </div>

                    <!-- Unique Tracking Link Box -->
                    <div style="background:rgba(0,0,0,0.5); border:1px solid rgba(0,242,254,0.3); border-radius:12px; padding:16px; margin-bottom:28px;">
                        <span style="display:block; font-size:0.75rem; color:#94a3b8; text-transform:uppercase; font-weight:700; margin-bottom:8px;">🔗 Your Master 60-Day Referral Link</span>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <input type="text" id="partner-master-link" readonly value="${partnerRefLink}" style="flex:1; min-width:260px; background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:8px; padding:10px 14px; color:#00f2fe; font-family:'Fira Code',monospace; font-size:0.85rem; outline:none;">
                            <button onclick="window.copyPartnerLink()" class="btn btn-primary" style="background:#00f2fe; color:#04101e; font-weight:800; padding:10px 18px; font-size:0.85rem; cursor:pointer;">
                                📋 Copy Link
                            </button>
                            <a href="https://wa.me/?text=${encodeURIComponent('Check out IINSHA AI Automation OS for business scaling: ' + partnerRefLink)}" target="_blank" class="btn btn-glass" style="padding:10px 18px; font-size:0.85rem; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                                💬 Share WhatsApp
                            </a>
                        </div>
                    </div>

                    <!-- 4-Metrics Grid -->
                    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:30px;">
                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(16,185,129,0.4); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase;">Unpaid Balance</span>
                            <div style="font-size:1.8rem; font-weight:800; color:#10b981; font-family:'Fira Code',monospace; margin:4px 0;">$${partner.unpaid.toFixed(2)}</div>
                            <span style="font-size:0.7rem; color:#00f2fe;">Ready to withdraw</span>
                        </div>

                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase;">Pending Commissions</span>
                            <div style="font-size:1.8rem; font-weight:800; color:#f59e0b; font-family:'Fira Code',monospace; margin:4px 0;">$${partner.pending.toFixed(2)}</div>
                            <span style="font-size:0.7rem; color:#94a3b8;">Active pipeline orders</span>
                        </div>

                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase;">Total Paid Out</span>
                            <div style="font-size:1.8rem; font-weight:800; color:#fff; font-family:'Fira Code',monospace; margin:4px 0;">$${partner.paidOut.toFixed(2)}</div>
                            <span style="font-size:0.7rem; color:#10b981;">Via ${partner.payoutMethod.split(' ')[0]}</span>
                        </div>

                        <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; text-align:center;">
                            <span style="font-size:0.72rem; color:#94a3b8; text-transform:uppercase;">Total Referral Clicks</span>
                            <div style="font-size:1.8rem; font-weight:800; color:#38bdf8; font-family:'Fira Code',monospace; margin:4px 0;">${partner.totalClicks}</div>
                            <span style="font-size:0.7rem; color:#94a3b8;">${partner.conversions} closed conversions</span>
                        </div>
                    </div>

                    <!-- Individual Product Referral Links Matrix -->
                    <div style="margin-bottom:30px;">
                        <h4 style="color:#fff; font-size:1.05rem; margin:0 0 14px 0;">📦 Product-Specific Direct Referral Deep Links:</h4>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            ${OFFERS.map(o => `
                                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.6); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; flex-wrap:wrap; gap:10px;">
                                    <div>
                                        <div style="display:flex; align-items:center; gap:8px;">
                                            <strong style="color:#fff; font-size:0.85rem;">${o.name}</strong>
                                            <span style="background:rgba(0,242,254,0.15); color:#00f2fe; font-size:0.65rem; font-weight:700; padding:1px 6px; border-radius:4px;">${o.tag}</span>
                                        </div>
                                        <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">Price: <span style="color:#38bdf8;">${o.price}</span> • Commission: <span style="color:#10b981; font-weight:700;">${o.comm}</span></div>
                                    </div>
                                    <button onclick="window.copyDeepLink('${o.id}', '${partner.refCode}')" class="btn btn-glass-sm" style="padding:6px 14px; font-size:0.75rem; cursor:pointer;">
                                        📋 Copy Link
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Marketing Asset Swipes Generator -->
                    <div>
                        <h4 style="color:#fff; font-size:1.05rem; margin:0 0 14px 0;">🎨 1-Click Marketing Asset Center:</h4>
                        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
                            ${MARKETING_ASSETS.map(a => {
                                const populated = a.text.replace(/\{\{REF_LINK\}\}/g, partnerRefLink).replace(/\{\{PartnerName\}\}/g, partner.name);
                                return `
                                    <div style="background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:14px;">
                                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                            <strong style="color:#38bdf8; font-size:0.8rem;">${a.type}</strong>
                                            <button onclick="window.copyAssetText('${a.id}')" class="btn btn-glass-sm" style="padding:4px 10px; font-size:0.7rem; cursor:pointer;">📋 Copy</button>
                                        </div>
                                        <textarea id="${a.id}" readonly rows="4" style="width:100%; background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:8px; color:#cbd5e1; font-size:0.75rem; font-family:'Fira Code',monospace; resize:none; box-sizing:border-box;">${populated}</textarea>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                </div>

            </div>
        `;
    };

    window.handleAffiliateRegistration = function(e) {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const payoutMethod = document.getElementById('reg-payout-method').value;
        const payoutAccount = document.getElementById('reg-payout-acc').value.trim();
        const refCode = document.getElementById('reg-ref-code').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

        const updated = {
            name,
            email,
            phone,
            payoutMethod,
            payoutAccount,
            refCode: refCode || 'partner',
            tier: 'VIP Silver (20%)',
            unpaid: 450.00,
            pending: 150.00,
            paidOut: 1240.00,
            totalClicks: 142,
            conversions: 6,
            trafficQuality: '98% Clean (Low Risk)',
            registeredAt: new Date().toISOString()
        };

        savePartnerData(updated);
        window.initAffiliatePortal();

        const dash = document.getElementById('affiliate-dashboard-section');
        if (dash) dash.scrollIntoView({ behavior: 'smooth' });

        alert(`🎉 Partner Profile Saved! Your tracking link: ${window.location.origin}/?ref=${updated.refCode}`);
    };

    window.copyPartnerLink = function() {
        const input = document.getElementById('partner-master-link');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value);
            alert('✅ Referral Link copied to clipboard!\nShare this link to earn 20% to 30% commissions on every client deal.');
        }
    };

    window.copyDeepLink = function(productId, refCode) {
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = `${origin}/store.html?product=${productId}&ref=${refCode}`;
        navigator.clipboard.writeText(link);
        alert(`✅ Product Link copied: ${link}`);
    };

    window.copyAssetText = function(elemId) {
        const area = document.getElementById(elemId);
        if (area) {
            area.select();
            navigator.clipboard.writeText(area.value);
            alert('✅ Marketing copy copied to clipboard with your referral link embedded!');
        }
    };

    window.requestPartnerWithdrawal = function() {
        const partner = getPartnerData();
        if (partner.unpaid <= 0) {
            alert('⚠️ No unpaid commissions currently available to withdraw.');
            return;
        }
        const confirmReq = confirm(`Withdraw $${partner.unpaid.toFixed(2)} USD to your ${partner.payoutMethod} (${partner.payoutAccount})?\n\nPayouts are approved & dispatched within 24 hours.`);
        if (confirmReq) {
            alert(`✅ Payout Request of $${partner.unpaid.toFixed(2)} USD Submitted Successfully!\nOur finance desk is processing transfer to ${partner.payoutAccount}.`);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.initAffiliatePortal);
    } else {
        window.initAffiliatePortal();
    }
})();
