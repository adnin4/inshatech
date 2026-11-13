/**
 * PONDER TOTAL DESIGN SYSTEM TRANSFORMATION ENGINE
 * 
 * Replaces ALL cyan/neon color tokens across the entire codebase with
 * Ponder's high-contrast monochromatic white/silver palette.
 * 
 * Strategy:
 * 1. Transform CSS root variables from cyan to white/silver
 * 2. Replace all hardcoded cyan (#00f2fe, #00F2FE, rgba(0,242,254,...)) across style.css
 * 3. Replace all inline cyan styles across index.html and live_index.html
 * 4. Transform hero gradient text to pure white editorial
 * 5. Transform all section borders, badges, telemetry metrics to monochromatic palette
 * 6. Maintain 100% DOM parity between index.html and live_index.html
 * 7. Preserve ALL business information, text content, and functionality
 */
import fs from 'fs';

function transformCSS() {
    let css = fs.readFileSync('style.css', 'utf8');
    
    // ========== PHASE 1: ROOT VARIABLE TRANSFORMATION ==========
    // Change --accent-cyan from neon cyan to crisp white
    css = css.replace(/--accent-cyan:\s*#00F2FE;/gi, '--accent-cyan: #ffffff;');
    css = css.replace(/--accent-cyan-glow:\s*rgba\(0, 242, 254, 0\.25\);/g, '--accent-cyan-glow: rgba(255, 255, 255, 0.2);');
    css = css.replace(/--accent-cyan-surface:\s*rgba\(0, 242, 254, 0\.08\);/g, '--accent-cyan-surface: rgba(255, 255, 255, 0.06);');
    
    // Change focus-visible from cyan to white
    css = css.replace(/outline: 2px solid #00F2FE !important;/gi, 'outline: 2px solid #ffffff !important;');
    
    // ========== PHASE 2: HARDCODED CYAN PURGE IN CSS ==========
    // Replace all #00f2fe / #00F2FE with #ffffff
    css = css.replace(/#00f2fe/gi, '#ffffff');
    
    // Replace all rgba(0, 242, 254, ...) with rgba(255, 255, 255, ...)
    css = css.replace(/rgba\(0,\s*242,\s*254/g, 'rgba(255, 255, 255');
    
    // Replace #0284c7 (darker cyan) with #e2e8f0 (light silver)
    css = css.replace(/#0284c7/gi, '#e2e8f0');
    
    // Replace #38bdf8 (sky blue) with #ffffff
    css = css.replace(/#38bdf8/gi, '#ffffff');
    
    // Replace rgba(56, 189, 248, ...) (sky blue rgba) with white
    css = css.replace(/rgba\(56,\s*189,\s*248/g, 'rgba(255, 255, 255');
    
    fs.writeFileSync('style.css', css, 'utf8');
    console.log(`✅ style.css: ALL cyan tokens purged and replaced with Ponder monochromatic palette`);
}

function transformHTML(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // ========== PHASE 3: INLINE STYLE CYAN PURGE IN HTML ==========
    
    // Replace all inline #00f2fe with #ffffff
    html = html.replace(/#00f2fe/gi, '#ffffff');
    
    // Replace all inline rgba(0, 242, 254, ...) with rgba(255, 255, 255, ...)
    html = html.replace(/rgba\(0, 242, 254/g, 'rgba(255, 255, 255');
    
    // Replace #0284c7 with #e2e8f0
    html = html.replace(/#0284c7/gi, '#e2e8f0');
    
    // Replace #38bdf8 (sky blue) with #ffffff
    html = html.replace(/#38bdf8/gi, '#ffffff');
    
    // ========== PHASE 4: HERO GRADIENT TEXT → PURE WHITE EDITORIAL ==========
    // The hero gradient silver text uses cyan → transform to pure white/silver editorial
    html = html.replace(
        /background:\s*linear-gradient\(135deg,\s*#ffffff\s*15%,\s*#ffffff\s*70%,\s*#8b5cf6\s*100%\)/gi,
        'background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #94a3b8 100%)'
    );
    
    // ========== PHASE 5: TELEMETRY SECTION METRICS COLOR UPGRADE ==========
    // Hero telemetry strip - change individual metric colors to monochromatic palette
    // 85% metric → keep white (was cyan, now #ffffff from above)
    // <45s metric → silver accent 
    // 24/7 metric → soft lavender stays as purple is accent
    // 100% metric → warm amber stays as gold is accent
    
    // Studio card border
    html = html.replace(
        /border: 1px solid rgba\(255, 255, 255, 0\.2\); border-radius: 18px/g,
        'border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px'
    );
    
    // Pipeline container background
    html = html.replace(
        /background: #060911; padding: 14px; border-radius: 12px; border: 1px solid rgba\(255, 255, 255, 0\.22\)/g,
        'background: rgba(5, 7, 14, 0.9); padding: 14px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1)'
    );
    
    // Telemetry cell borders
    html = html.replace(
        /border: 1px solid rgba\(255, 255, 255, 0\.2\); text-align: center/g,
        'border: 1px solid rgba(255, 255, 255, 0.08); text-align: center'
    );
    
    // Badge PRO - API demo
    html = html.replace(
        /background: rgba\(255, 255, 255, 0\.15\); color: var\(--accent-cyan\); border: 1px solid var\(--accent-cyan\)/g,
        'background: rgba(255, 255, 255, 0.08); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.25)'
    );
    
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ ${filePath}: ALL inline cyan tokens purged`);
}

function transformSecondaryPages() {
    const pages = [
        'admin.html', 'affiliate.html', 'affiliate-dashboard.html',
        'affiliate-login.html', 'store.html', 'marketplace.html',
        'compare.html', 'blog.html', 'portal.html'
    ];
    
    for (const page of pages) {
        if (!fs.existsSync(page)) continue;
        let html = fs.readFileSync(page, 'utf8');
        
        html = html.replace(/#00f2fe/gi, '#ffffff');
        html = html.replace(/rgba\(0, 242, 254/g, 'rgba(255, 255, 255');
        html = html.replace(/#0284c7/gi, '#e2e8f0');
        html = html.replace(/#38bdf8/gi, '#ffffff');
        
        fs.writeFileSync(page, html, 'utf8');
        console.log(`✅ ${page}: cyan tokens purged`);
    }
}

// Execute transformation
transformCSS();
transformHTML('index.html');
transformHTML('live_index.html');
transformSecondaryPages();

// Verify DOM parity
const f1 = fs.readFileSync('index.html', 'utf8');
const f2 = fs.readFileSync('live_index.html', 'utf8');
console.log(`\n🔒 DOM PARITY: ${f1 === f2 ? '✅ 100% MATCH' : '❌ MISMATCH'}`);

// Count remaining cyan references
const cssRemaining = (fs.readFileSync('style.css', 'utf8').match(/#00f2fe/gi) || []).length;
const htmlRemaining = (f1.match(/#00f2fe/gi) || []).length;
console.log(`📊 Remaining #00f2fe in style.css: ${cssRemaining}`);
console.log(`📊 Remaining #00f2fe in index.html: ${htmlRemaining}`);
