import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const portalJsPath = path.join(ROOT, 'js', 'core', 'affiliate-portal.js');
let js = fs.readFileSync(portalJsPath, 'utf8');

console.log('=== UPGRADING JS/CORE/AFFILIATE-PORTAL.JS WITH FUNCTION REPLACER ===');

// 1. Add LINKS_HISTORY_KEY
if (!js.includes('LINKS_HISTORY_KEY')) {
    js = js.replace(
        "const TRANSACTIONS_KEY = 'iinsha_partner_transactions';",
        () => "const TRANSACTIONS_KEY = 'iinsha_partner_transactions';\n    const LINKS_HISTORY_KEY = 'iinsha_generated_links_history';"
    );
}

// 2. Safe copy code
const safeCopyCode = `
    function safeCopyText(text, successMsg) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (window.showAffiliateToast) window.showAffiliateToast(successMsg || '✅ Copied to clipboard!');
            }).catch(() => {
                fallbackCopyText(text, successMsg);
            });
        } else {
            fallbackCopyText(text, successMsg);
        }
    }

    function fallbackCopyText(text, successMsg) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
            if (window.showAffiliateToast) window.showAffiliateToast(successMsg || '✅ Copied to clipboard!');
        } catch (e) {
            if (window.showAffiliateToast) window.showAffiliateToast('⚠️ Please select and copy manually.');
        }
        document.body.removeChild(ta);
    }
`;

if (!js.includes('function safeCopyText(')) {
    js = js.replace("const DEFAULT_PARTNERS = {", () => safeCopyCode + '\n    const DEFAULT_PARTNERS = {');
}

// 3. Links History Data & Helpers
const defaultLinksHistoryCode = `
    const DEFAULT_LINKS_HISTORY = [
        {
            id: 'lnk-101',
            serviceName: 'General Homepage (High-Intent Conversion)',
            target: '/',
            subId: 'organic',
            fullUrl: 'https://inshatech.pages.dev/?ref=mahin10&subid=organic',
            commRate: '20% Recurring',
            commEst: '$150 - $450 USD (৳18,375 - ৳55,125 BDT)',
            date: '2026-08-18',
            clicks: 142,
            leads: 14,
            conversions: 4,
            status: 'Active'
        },
        {
            id: 'lnk-102',
            serviceName: '24/7 E-Commerce WhatsApp Sales Bot ($750)',
            target: '/store.html?product=ecommerce-ai-whatsapp',
            subId: 'fb_ad_01',
            fullUrl: 'https://inshatech.pages.dev/store.html?product=ecommerce-ai-whatsapp&ref=mahin10&subid=fb_ad_01',
            commRate: '25% ($187.50 USD)',
            commEst: '$187.50 USD (৳22,968 BDT)',
            date: '2026-08-17',
            clicks: 86,
            leads: 9,
            conversions: 3,
            status: 'Active'
        },
        {
            id: 'lnk-103',
            serviceName: 'B2B SaaS 5-Agent Hunter Swarm ($850)',
            target: '/store.html?product=b2b-lead-swarm',
            subId: 'linkedin_dm',
            fullUrl: 'https://inshatech.pages.dev/store.html?product=b2b-lead-swarm&ref=mahin10&subid=linkedin_dm',
            commRate: '25% ($212.50 USD)',
            commEst: '$212.50 USD (৳26,031 BDT)',
            date: '2026-08-16',
            clicks: 64,
            leads: 7,
            conversions: 2,
            status: 'Active'
        },
        {
            id: 'lnk-104',
            serviceName: 'Self-Hosted n8n VPS Cluster ($497)',
            target: '/store.html?product=n8n-docker-cluster',
            subId: 'youtube_desc',
            fullUrl: 'https://inshatech.pages.dev/store.html?product=n8n-docker-cluster&ref=mahin10&subid=youtube_desc',
            commRate: '25% ($124.25 USD)',
            commEst: '$124.25 USD (৳15,220 BDT)',
            date: '2026-08-15',
            clicks: 52,
            leads: 5,
            conversions: 1,
            status: 'Active'
        }
    ];

    function getLinksHistory() {
        const saved = localStorage.getItem(LINKS_HISTORY_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) {}
        }
        return DEFAULT_LINKS_HISTORY;
    }

    function saveLinksHistory(links) {
        localStorage.setItem(LINKS_HISTORY_KEY, JSON.stringify(links));
    }
`;

if (!js.includes('function getLinksHistory()')) {
    js = js.replace(
        "function saveTransactions(data) {\n        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));\n    }",
        () => "function saveTransactions(data) {\n        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(data));\n    }\n" + defaultLinksHistoryCode
    );
}

// 4. Update copy functions
js = js.replace(
    /window\.copyStudioLink = function\(\) \{[\s\S]*?\};/,
    () => `window.copyStudioLink = function() {
        const output = document.getElementById('link-studio-output');
        if (output && output.value) {
            safeCopyText(output.value, '✅ Custom Tracking Link copied to clipboard!');
            if (window.saveStudioLinkToHistory) window.saveStudioLinkToHistory(true);
        }
    };`
);

js = js.replace(
    /window\.copyDeepLinkDirect = function\(productId, refCode\) \{[\s\S]*?\};/,
    () => `window.copyDeepLinkDirect = function(productId, refCode) {
        const origin = window.location.origin || 'https://inshatech.pages.dev';
        const link = \`\${origin}/store.html?product=\${productId}&ref=\${refCode}\`;
        safeCopyText(link, \`✅ Direct Product Link copied for \${productId}!\`);
    };`
);

js = js.replace(
    /window\.copyAssetText = function\(elemId\) \{[\s\S]*?\};/,
    () => `window.copyAssetText = function(elemId) {
        const el = document.getElementById(elemId);
        if (el && el.value) {
            safeCopyText(el.value, '✅ Marketing Swipe Copy copied to clipboard!');
        }
    };`
);

// 5. Expand OFFERS
const extraOffers = `
        { id: 'white-label-agency-stack', name: 'Full Agency White-Label AI Infrastructure', priceUSD: 2500, priceBDT: 306250, commUSD: 500.00, commBDT: 61250, epc: '$14.50', conversion: '2.0%', category: 'Enterprise', tag: '💎 Highest Ticket', target: 'store.html?product=white-label-agency-stack' },
        { id: 'ai-support-desk', name: '24/7 AI Multi-Channel Customer Support Desk', priceUSD: 600, priceBDT: 73500, commUSD: 150.00, commBDT: 18375, epc: '$7.50', conversion: '4.0%', category: 'Support', tag: '⚡ Instant Setup', target: 'store.html?product=ai-support-desk' },
        { id: 'restaurant-ai-order-bot', name: 'Restaurant WhatsApp & POS AI Ordering Engine', priceUSD: 450, priceBDT: 55125, commUSD: 112.50, commBDT: 13781, epc: '$6.80', conversion: '5.2%', category: 'Hospitality', tag: '🍕 High Demand', target: 'store.html?product=restaurant-ai-order-bot' },
        { id: 'legal-document-analyzer', name: 'Legal & Contract Intelligence AI Engine', priceUSD: 1100, priceBDT: 134750, commUSD: 275.00, commBDT: 33687, epc: '$9.80', conversion: '2.8%', category: 'LegalTech', tag: '⚖️ High Retainer', target: 'store.html?product=legal-document-analyzer' },
        { id: 'fintech-kyc-validator', name: 'Automated AML & KYC Verification Swarm', priceUSD: 1400, priceBDT: 171500, commUSD: 350.00, commBDT: 42875, epc: '$11.40', conversion: '2.5%', category: 'Fintech', tag: '🛡️ Bank Grade', target: 'store.html?product=fintech-kyc-validator' }
`;
if (!js.includes('white-label-agency-stack')) {
    js = js.replace(
        "tag: '⚡ Full White-Glove', target: 'store.html?product=custom-ai-agent-blueprint' }",
        () => "tag: '⚡ Full White-Glove', target: 'store.html?product=custom-ai-agent-blueprint' },\n" + extraOffers.trim()
    );
}

// 6. In tab-panel-links, add the Save Link button and the Full Links History Table
const historyTableHtml = `
                        <!-- Generated Link Actions Bar -->
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top:14px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.08);">
                            <div style="font-size:0.8rem; color:#94a3b8;">
                                💡 Links are automatically attributed via 120-day browser cookie & server-side fingerprinting.
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button type="button" onclick="window.saveStudioLinkToHistory()" class="btn btn-primary-sm" style="background:linear-gradient(135deg, #10b981, #059669); font-weight:700;">
                                    💾 Save Link to Campaign History
                                </button>
                                <button type="button" onclick="window.testActiveStudioLink()" class="btn btn-glass-sm" style="color:var(--accent-cyan);">
                                    ↗️ Test Link
                                </button>
                            </div>
                        </div>

                        <!-- INTERACTIVE GENERATED LINKS & CAMPAIGN HISTORY TABLE -->
                        <div style="margin-top:28px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                                <div>
                                    <h4 style="color:#fff; font-size:1.05rem; margin:0; display:flex; align-items:center; gap:8px;">
                                        <span>📊</span> Generated Tracking Links & Campaign History
                                    </h4>
                                    <p style="font-size:0.75rem; color:#94a3b8; margin:2px 0 0 0;">Monitor performance, copy URLs, and trigger direct WhatsApp/Social promotions for each campaign link.</p>
                                </div>
                                <button type="button" onclick="window.resetLinksHistory()" class="btn btn-glass-sm" style="font-size:0.7rem; color:#94a3b8;">
                                    🔄 Reset History
                                </button>
                            </div>

                            <div style="overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid rgba(255,255,255,0.08); border-radius:10px;">
                                <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.8rem;">
                                    <thead>
                                        <tr style="background:rgba(0,0,0,0.5); border-bottom:1px solid rgba(255,255,255,0.1); color:#94a3b8; font-family:var(--font-mono); font-size:0.72rem; text-transform:uppercase;">
                                            <th style="padding:10px 14px;">Service / Destination</th>
                                            <th style="padding:10px 14px;">SubID Tag</th>
                                            <th style="padding:10px 14px;">Commission</th>
                                            <th style="padding:10px 14px;">Clicks / Leads</th>
                                            <th style="padding:10px 14px;">Live Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="generated-links-table-body">
                                        <!-- Rendered dynamically by window.renderGeneratedLinksTable() -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
`;

if (!js.includes('generated-links-table-body')) {
    js = js.replace(
        '<!-- Deep Link Offer Cards -->',
        () => historyTableHtml + '\n\n                        <!-- Deep Link Offer Cards -->'
    );
}

// 7. Add window functions: saveStudioLinkToHistory, renderGeneratedLinksTable, testTrackingLink, shareTrackingLinkWhatsApp, deleteTrackingLink, resetLinksHistory
const historyWindowFns = `
    // Generated Links & Campaign History Engine
    window.renderGeneratedLinksTable = function() {
        const tbody = document.getElementById('generated-links-table-body');
        if (!tbody) return;
        const links = getLinksHistory();
        if (links.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="padding:20px; text-align:center; color:#94a3b8;">No campaign links generated yet. Generate your first tracking link above!</td></tr>';
            return;
        }

        tbody.innerHTML = links.map(lnk => \`
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05); background:rgba(255,255,255,0.01); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='rgba(255,255,255,0.01)'">
                <td style="padding:12px 14px;">
                    <strong style="color:#fff; display:block; font-size:0.82rem;">\${lnk.serviceName}</strong>
                    <span style="font-size:0.7rem; color:#64748b; font-family:var(--font-mono); word-break:break-all;">\${lnk.fullUrl}</span>
                </td>
                <td style="padding:12px 14px;">
                    <span style="background:rgba(0,242,254,0.12); color:var(--accent-cyan); border:1px solid rgba(0,242,254,0.3); padding:2px 8px; border-radius:6px; font-family:var(--font-mono); font-size:0.75rem;">
                        \${lnk.subId || 'direct'}
                    </span>
                </td>
                <td style="padding:12px 14px;">
                    <span style="color:#34d399; font-weight:700; font-size:0.8rem;">\${lnk.commRate || '25%'}</span>
                    <span style="display:block; font-size:0.7rem; color:#94a3b8;">\${lnk.commEst || ''}</span>
                </td>
                <td style="padding:12px 14px; font-family:var(--font-mono);">
                    <span style="color:#38bdf8; font-weight:700;">\${lnk.clicks || 0}</span> <span style="color:#64748b; font-size:0.72rem;">clicks</span> • 
                    <span style="color:var(--accent-gold); font-weight:700;">\${lnk.leads || 0}</span> <span style="color:#64748b; font-size:0.72rem;">leads</span>
                </td>
                <td style="padding:12px 14px;">
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button type="button" onclick="window.copySpecificLink('\${lnk.fullUrl}')" class="btn btn-primary-sm" style="font-size:0.7rem; padding:4px 8px;" title="Copy to Clipboard">📋 Copy</button>
                        <button type="button" onclick="window.testTrackingLink('\${lnk.id}')" class="btn btn-glass-sm" style="font-size:0.7rem; padding:4px 8px; color:var(--accent-cyan);" title="Test Link in New Tab">↗️ Test</button>
                        <button type="button" onclick="window.shareTrackingLinkWhatsApp('\${lnk.id}')" class="btn btn-glass-sm" style="font-size:0.7rem; padding:4px 8px; color:#10b981;" title="Share on WhatsApp">💬 Share</button>
                        <button type="button" onclick="window.deleteTrackingLink('\${lnk.id}')" class="btn btn-glass-sm" style="font-size:0.7rem; padding:4px 8px; color:#ef4444;" title="Delete Link">🗑️</button>
                    </div>
                </td>
            </tr>
        \`).join('');
    };

    window.copySpecificLink = function(url) {
        safeCopyText(url, '✅ Tracking Link copied to clipboard!');
    };

    window.saveStudioLinkToHistory = function(silent) {
        const partner = getActivePartner();
        const output = document.getElementById('link-studio-output');
        const targetSelect = document.getElementById('link-studio-target');
        const subidInput = document.getElementById('link-studio-subid');
        if (!output || !output.value) return;

        const fullUrl = output.value;
        const subId = subidInput ? subidInput.value.trim() : 'direct';
        const serviceName = targetSelect ? targetSelect.options[targetSelect.selectedIndex].text : 'Custom Destination';
        const targetVal = targetSelect ? targetSelect.value : '/';

        let commRate = '20% - 25%';
        let commEst = '15% - 25% recurring or fixed';
        for (const o of OFFERS) {
            if (targetVal.includes(o.id) || (o.target && targetVal.includes(o.target))) {
                commRate = '25% ($' + o.commUSD.toFixed(2) + ' USD)';
                commEst = '$' + o.commUSD.toFixed(2) + ' USD (৳' + o.commBDT.toLocaleString() + ' BDT)';
                break;
            }
        }

        const links = getLinksHistory();
        const existingIdx = links.findIndex(l => l.fullUrl === fullUrl);
        if (existingIdx !== -1) {
            if (!silent && window.showAffiliateToast) window.showAffiliateToast('ℹ️ Link already saved in history table.');
            return;
        }

        const newLnk = {
            id: 'lnk-' + Date.now(),
            serviceName,
            target: targetVal,
            subId,
            fullUrl,
            commRate,
            commEst,
            date: new Date().toISOString().split('T')[0],
            clicks: 0,
            leads: 0,
            conversions: 0,
            status: 'Active'
        };

        links.unshift(newLnk);
        saveLinksHistory(links);
        if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();
        if (!silent && window.showAffiliateToast) window.showAffiliateToast('🎉 Saved to Campaign History: ' + serviceName + ' [' + subId + ']');
    };

    window.testActiveStudioLink = function() {
        const output = document.getElementById('link-studio-output');
        if (output && output.value) {
            if (window.saveStudioLinkToHistory) window.saveStudioLinkToHistory(true);
            window.open(output.value, '_blank');
        }
    };

    window.testTrackingLink = function(linkId) {
        const links = getLinksHistory();
        const lnk = links.find(l => l.id === linkId);
        if (lnk) {
            lnk.clicks = (lnk.clicks || 0) + 1;
            saveLinksHistory(links);
            if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();
            const partner = getActivePartner();
            partner.totalClicks = (partner.totalClicks || 0) + 1;
            const reg = getPartnersRegistry();
            reg[partner.id] = partner;
            savePartnersRegistry(reg);
            window.open(lnk.fullUrl, '_blank');
        }
    };

    window.shareTrackingLinkWhatsApp = function(linkId) {
        const links = getLinksHistory();
        const lnk = links.find(l => l.id === linkId);
        if (lnk) {
            const text = encodeURIComponent('Assalamu Alaikum! Check out ' + lnk.serviceName + ' from IINSHA AI Lab: ' + lnk.fullUrl);
            window.open('https://wa.me/?text=' + text, '_blank');
        }
    };

    window.deleteTrackingLink = function(linkId) {
        let links = getLinksHistory();
        links = links.filter(l => l.id !== linkId);
        saveLinksHistory(links);
        if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();
        if (window.showAffiliateToast) window.showAffiliateToast('🗑️ Campaign link deleted from history.');
    };

    window.resetLinksHistory = function() {
        localStorage.removeItem(LINKS_HISTORY_KEY);
        if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();
        if (window.showAffiliateToast) window.showAffiliateToast('🔄 Campaign history reset to defaults.');
    };
`;

if (!js.includes('window.renderGeneratedLinksTable = function()')) {
    js += '\n' + historyWindowFns;
}

// In switchAffiliateTab, render links table when switching to links tab
if (!js.includes("if (tabName === 'links' && window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();")) {
    js = js.replace(
        "if (targetBtn) targetBtn.classList.add('active');",
        () => "if (targetBtn) targetBtn.classList.add('active');\n        if (tabName === 'links' && window.renderGeneratedLinksTable) window.renderGeneratedLinksTable();"
    );
}

// In window.initAffiliatePortal, render the generated links table on load
if (!js.includes("setTimeout(() => { if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable(); }, 50);")) {
    js = js.replace(
        "root.innerHTML = `",
        () => "setTimeout(() => { if (window.renderGeneratedLinksTable) window.renderGeneratedLinksTable(); }, 50);\n        root.innerHTML = `"
    );
}

fs.writeFileSync(portalJsPath, js, 'utf8');
console.log('✓ js/core/affiliate-portal.js successfully upgraded with function replacers');
