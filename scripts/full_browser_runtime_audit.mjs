import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesToTest = [
    'index.html',
    'store.html',
    'marketplace.html',
    'portal.html',
    'admin.html',
    'affiliate.html',
    'affiliate-login.html',
    'affiliate-dashboard.html',
    'compare.html',
    'blog.html',
    'privacy.html',
    'terms.html'
];

console.log("================================================================================");
console.log("🚀 STARTING DEEP BROWSER RUNTIME & INTERACTION AUDIT (12 PAGES)");
console.log("================================================================================\n");

let allPassed = true;

async function auditPage(pageName) {
    console.log(`\n📄 Auditing [${pageName}]...`);
    const filePath = path.join(__dirname, '..', pageName);
    const html = fs.readFileSync(filePath, 'utf-8');

    const errors = [];
    const warnings = [];

    // Create Virtual DOM with full script execution capability
    const dom = new JSDOM(html, {
        runScripts: "dangerously",
        resources: "usable",
        url: `http://localhost:8080/${pageName}`,
        beforeParse(window) {
            // Mock matchMedia
            window.matchMedia = window.matchMedia || function() {
                return {
                    matches: false,
                    addListener: function() {},
                    removeListener: function() {},
                    addEventListener: function() {},
                    removeEventListener: function() {}
                };
            };

            // Mock canvas getContext
            window.HTMLCanvasElement.prototype.getContext = () => ({
                clearRect: () => {},
                fillRect: () => {},
                beginPath: () => {},
                arc: () => {},
                fill: () => {},
                stroke: () => {}
            });

            // Mock fetch
            window.fetch = async (url) => ({
                ok: true,
                status: 200,
                json: async () => ({ status: 'SUCCESS', count: 12, results: [] }),
                text: async () => 'OK'
            });

            // Capture console and errors
            window.console.error = (...args) => {
                errors.push(`[Console Error] ${args.join(' ')}`);
            };
            window.addEventListener('error', (event) => {
                errors.push(`[Runtime Error] ${event.message} at ${event.filename}:${event.lineno}`);
            });
            window.addEventListener('unhandledrejection', (event) => {
                errors.push(`[Unhandled Rejection] ${event.reason}`);
            });
        }
    });

    const { window } = dom;
    const { document } = window;

    // Trigger DOMContentLoaded
    try {
        const dclEvent = new window.Event('DOMContentLoaded');
        document.dispatchEvent(dclEvent);
        const loadEvent = new window.Event('load');
        window.dispatchEvent(loadEvent);
    } catch(err) {
        errors.push(`[Lifecycle Error] ${err.message}`);
    }

    // Wait a tick for async DOM init
    await new Promise(resolve => setTimeout(resolve, 300));

    // Test specific interactive elements on each page
    try {
        // 1. Test Category Package Modals (if on index.html)
        const pkgBtns = document.querySelectorAll('.open-pkg-modal-btn');
        if (pkgBtns.length > 0) {
            console.log(`  🔍 Testing ${pkgBtns.length} Category Package buttons...`);
            pkgBtns.forEach((btn, idx) => {
                try {
                    btn.click();
                } catch(e) {
                    errors.push(`Error clicking pkgBtn[${idx}]: ${e.message}`);
                }
            });
        }

        // 2. Test Checkout Modal triggers
        if (typeof window.openCheckoutModal === 'function') {
            console.log(`  🔍 Testing openCheckoutModal execution...`);
            try {
                window.openCheckoutModal('Enterprise AI Swarm', 997, 397);
                const modal = document.getElementById('iinsha-checkout-modal');
                if (!modal || modal.style.display !== 'flex') {
                    warnings.push('Checkout modal was not visible after openCheckoutModal call.');
                }
            } catch(e) {
                errors.push(`Error calling openCheckoutModal: ${e.message}`);
            }
        }

        // 3. Test Outcome Details Modal (if on index.html)
        if (typeof window.openOutcomeDetailModal === 'function') {
            console.log(`  🔍 Testing openOutcomeDetailModal execution...`);
            try {
                window.openOutcomeDetailModal(1);
            } catch(e) {
                errors.push(`Error calling openOutcomeDetailModal: ${e.message}`);
            }
        }

        // 4. Test Store Tier Switchers (if on store.html)
        const tierBtns = document.querySelectorAll('.tier-btn');
        if (tierBtns.length > 0) {
            console.log(`  🔍 Testing ${tierBtns.length} Store Tier buttons...`);
            tierBtns.forEach((btn, idx) => {
                try {
                    btn.click();
                } catch(e) {
                    errors.push(`Error clicking tierBtn[${idx}]: ${e.message}`);
                }
            });
        }

        // 5. Test Marketplace Category Filters & Currency Toggles (if on marketplace.html)
        const catChips = document.querySelectorAll('#market-category-chips button');
        if (catChips.length > 0) {
            console.log(`  🔍 Testing ${catChips.length} Marketplace category chips...`);
            catChips.forEach(chip => chip.click());
        }
        const currBtns = document.querySelectorAll('.currency-toggle-btn');
        if (currBtns.length > 0) {
            console.log(`  🔍 Testing ${currBtns.length} Currency Toggle buttons...`);
            currBtns.forEach(btn => btn.click());
        }

    } catch(err) {
        errors.push(`[Interaction Test Error] ${err.message}`);
    }

    if (errors.length === 0) {
        console.log(`  ✅ [PASS] ${pageName} — 0 Runtime Errors, 0 Broken Interactions!`);
    } else {
        allPassed = false;
        console.log(`  ❌ [FAIL] ${pageName} — Found ${errors.length} errors:`);
        errors.forEach(e => console.log(`     🚨 ${e}`));
    }

    if (warnings.length > 0) {
        warnings.forEach(w => console.log(`     ⚠️ ${w}`));
    }
}

async function runAll() {
    for (const page of pagesToTest) {
        await auditPage(page);
    }
    console.log("\n================================================================================");
    if (allPassed) {
        console.log("🎉 ALL 12 PUBLIC PAGES PASSED RUNTIME JSDOM BROWSER AUDIT WITH ZERO ERRORS!");
    } else {
        console.log("❌ SOME PAGES ENCOUNTERED RUNTIME ISSUES. REVIEW LOGS ABOVE.");
    }
    console.log("================================================================================");
}

runAll();
