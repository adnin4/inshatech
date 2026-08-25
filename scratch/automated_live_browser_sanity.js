/**
 * Automated Live Website & WhatsApp Deep Link Sanity Checker
 * Directly tests live Cloudflare endpoints and builds 1-click test links
 */

const https = require('https');

console.log('================================================================================');
console.log('🌐 AUTOMATED LIVE WEBSITE & WHATSAPP SANITY CHECK (STEP 2)');
console.log('================================================================================\n');

const URLS_TO_TEST = [
    { name: 'Homepage', url: 'https://inshatech.pages.dev/' },
    { name: 'Turnkey Store', url: 'https://inshatech.pages.dev/store.html' },
    { name: 'AI Marketplace', url: 'https://inshatech.pages.dev/marketplace.html' },
    { name: 'Client Portal', url: 'https://inshatech.pages.dev/portal.html' },
    { name: 'Robots.txt', url: 'https://inshatech.pages.dev/robots.txt' },
    { name: 'Sitemap.xml', url: 'https://inshatech.pages.dev/sitemap.xml' }
];

async function checkUrl(item) {
    return new Promise((resolve) => {
        https.get(item.url, (res) => {
            console.log(`[${item.name}] URL: ${item.url}`);
            console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
            resolve(res.statusCode === 200 || res.statusCode === 304);
        }).on('error', (err) => {
            console.log(`[${item.name}] Connection notice: ${err.message}`);
            resolve(false);
        });
    });
}

async function runSanity() {
    for (const item of URLS_TO_TEST) {
        await checkUrl(item);
    }

    const testWaUrl = `https://wa.me/8801629286887?text=${encodeURIComponent('Hi Adnin! I am testing the WhatsApp Concierge on IINSHA AI-BOS website.')}`;

    console.log('\n================================================================================');
    console.log('📱 DIRECT 1-CLICK WHATSAPP LIVE TEST LINK:');
    console.log(`👉 ${testWaUrl}`);
    console.log('================================================================================\n');
}

runSanity();
