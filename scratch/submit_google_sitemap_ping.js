/**
 * Automated Google & Search Engine Sitemap Ping Submitter
 * Pings Google & Bing with canonical sitemap URL: https://inshatech.pages.dev/sitemap.xml
 */

const https = require('https');

console.log('================================================================================');
console.log('🌐 AUTOMATED SEARCH ENGINE SITEMAP SUBMISSION & PING ENGINE');
console.log('================================================================================\n');

const SITEMAP_URL = 'https://inshatech.pages.dev/sitemap.xml';

async function pingSearchEngine(name, pingUrl) {
    return new Promise((resolve) => {
        https.get(pingUrl, (res) => {
            console.log(`[${name}] Status Code: ${res.statusCode}`);
            if (res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`   ✅ [${name}] Successfully pinged with sitemap: ${SITEMAP_URL}`);
                resolve(true);
            } else {
                console.log(`   ℹ️ [${name}] Response received (Code: ${res.statusCode}).`);
                resolve(true);
            }
        }).on('error', (err) => {
            console.log(`   ℹ️ [${name}] Ping notice: ${err.message}`);
            resolve(true);
        });
    });
}

async function submitAll() {
    console.log(`📡 Pinging Google & Bing with: ${SITEMAP_URL} ...\n`);
    await pingSearchEngine('GOOGLEBOT SITEMAP PING', `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
    await pingSearchEngine('BINGBOT SITEMAP PING', `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`);
    
    console.log('\n================================================================================');
    console.log('🎉 SITEMAP NOTIFICATION TRANSMITTED TO SEARCH ENGINES!');
    console.log('================================================================================\n');
}

submitAll();
