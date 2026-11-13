/**
 * PONDER TOTAL JS COLOR PURGE
 * Replaces all cyan color tokens in all JS files with Ponder monochromatic palette.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function purgeJsFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    const before = (content.match(/#00f2fe/gi) || []).length + 
                   (content.match(/rgba\(0, 242, 254/g) || []).length +
                   (content.match(/#0284c7/gi) || []).length +
                   (content.match(/#38bdf8/gi) || []).length;
    
    if (before === 0) return;
    
    content = content.replace(/#00f2fe/gi, '#ffffff');
    content = content.replace(/rgba\(0, 242, 254/g, 'rgba(255, 255, 255');
    content = content.replace(/#0284c7/gi, '#e2e8f0');
    content = content.replace(/#38bdf8/gi, '#ffffff');
    content = content.replace(/rgba\(56, 189, 248/g, 'rgba(255, 255, 255');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${path.basename(filePath)}: purged ${before} cyan tokens`);
}

// Main JS files
purgeJsFile(path.join(ROOT, 'app.js'));
purgeJsFile(path.join(ROOT, 'hero3d.js'));
purgeJsFile(path.join(ROOT, 'universal_ai_copilot.js'));
purgeJsFile(path.join(ROOT, 'src', 'js', 'ux_interactions.js'));

// Legacy copies
purgeJsFile(path.join(ROOT, 'app-DESKTOP-7EQRABL.js'));

// Functions JS
const fnDirs = ['functions/api', 'functions/_shared', 'ai_brain'];
for (const dir of fnDirs) {
    const fullDir = path.join(ROOT, dir);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir, { recursive: true });
    for (const f of files) {
        const fp = path.join(fullDir, f);
        if (fp.endsWith('.js') && fs.statSync(fp).isFile()) {
            purgeJsFile(fp);
        }
    }
}

console.log('\n📊 JS color purge complete');
