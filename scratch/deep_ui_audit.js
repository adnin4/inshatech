const fs = require('fs');
const path = require('path');
const BASE_DIR = path.resolve(__dirname, '..');

const pages = ['index.html', 'admin.html', 'affiliate.html', 'marketplace.html', 'portal.html', 'store.html', 'compare.html', 'blog.html'];

console.log('==============================================');
console.log('🔍 DEEP AUDIT OF HTML STRUCTURE & ASSETS');
console.log('==============================================\n');

pages.forEach(p => {
    const filePath = path.join(BASE_DIR, p);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Page ${p} NOT FOUND`);
        return;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Check doctype, head, body
    const hasDoctype = /<!DOCTYPE html>/i.test(html);
    const hasHead = /<head>/i.test(html) && /<\/head>/i.test(html);
    const hasBody = /<body[^>]*>/i.test(html) && /<\/body>/i.test(html);
    
    // Check stylesheets
    const linkMatches = html.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi) || [];
    const scriptMatches = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
    const inlineStyles = (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length;
    const inlineScripts = (html.match(/<script(?![^>]*src=)[\s\S]*?<\/script>/gi) || []).length;
    
    // Check buttons & onclicks
    const buttonMatches = html.match(/<button[^>]*>/gi) || [];
    const onclickButtons = buttonMatches.filter(b => /onclick=/i.test(b)).length;
    
    // Check navigation
    const hasNav = /<nav[^>]*>/i.test(html);
    const navLinks = (html.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi) || []).map(a => {
        const hrefMatch = a.match(/href=["']([^"']+)["']/i);
        return hrefMatch ? hrefMatch[1] : '';
    });
    
    console.log(`📄 ${p} (${Math.round(html.length / 1024)} KB)`);
    console.log(`   DOCTYPE: ${hasDoctype ? '✅' : '❌'}, HEAD: ${hasHead ? '✅' : '❌'}, BODY: ${hasBody ? '✅' : '❌'}`);
    console.log(`   CSS Links (${linkMatches.length}): ${linkMatches.map(l => {
        const h = l.match(/href=["']([^"']+)["']/i);
        return h ? h[1] : l;
    }).join(', ')}`);
    console.log(`   Scripts (${scriptMatches.length}): ${scriptMatches.map(s => {
        const src = s.match(/src=["']([^"']+)["']/i);
        return src ? src[1] : s;
    }).join(', ')}`);
    console.log(`   Inline Styles: ${inlineStyles}, Inline Scripts: ${inlineScripts}`);
    console.log(`   Buttons (${buttonMatches.length} total, ${onclickButtons} with onclick)`);
    console.log(`   Nav Present: ${hasNav ? '✅' : '❌'}, Unique Links: ${[...new Set(navLinks)].length}`);
    console.log('----------------------------------------------');
});
