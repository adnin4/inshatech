import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MOJIBAKE_MAP = [
    // Corrupted Taka symbol (0xE0 0xA7 0xB3 decoded as Windows-1252)
    { from: /à§³/g, to: '৳' },
    { from: /à§³/g, to: '৳' },
    // Corrupted Bengali phrases in ai_brain / sales_engine
    { from: /à¦†à¦ªà¦¨à¦¾à¦° à¦¬à§ à¦¯à¦¬à¦¸à¦¾ à¦•à§‹à¦¨ à¦¶à¦¿à¦²à§ à¦ªà§‡\?/g, to: 'আপনার ব্যবসা কোন শিল্পে?' },
    { from: /à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¬à¦šà§‡à§Ÿà§‡ à¦¬à§œ à¦¸à¦®à¦¸à§ à¦¯à¦¾ à¦•à§€\?/g, to: 'আপনার সবচেয়ে বড় সমস্যা কী?' },
    { from: /à¦†à¦ªà¦¨à¦¿ à¦•à§‹à¦¨ à¦šà§ à¦¯à¦¾à¦¨à§‡à¦² à¦¬à§ à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§‡à¦¨\?/g, to: 'আপনি কোন চ্যানেল ব্যবহার করেন?' },
    { from: /à¦†à¦ªà¦¨à¦¾à¦° à¦Ÿà¦¿à¦®à§‡ à¦•à¦¤à¦œà¦¨ à¦†à¦›à§‡à¦¨\?/g, to: 'আপনার টিমে কতজন আছেন?' },
    { from: /à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦Ÿà§‹à¦®à§‡à¦¶à¦¨à§‡à¦° à¦¬à¦¾à¦œà§‡à¦Ÿ à¦•à¦¤\?/g, to: 'আপনার অটোমেশনের বাজেট কত?' },
    { from: /à¦•à¦¬à§‡ à¦¡à¦¿à¦ªà§ à¦²à§Ÿ à¦•à¦°à¦¤à§‡ à¦šà¦¾à¦¨\?/g, to: 'কবে ডিপ্লয় করতে চান?' },
    { from: /à¦†à¦®à¦¿ à¦¬à§ à¦ à¦¤à§‡ à¦ªà¦¾à¦°à¦›à¦¿ à¦¬à¦¾à¦œà§‡à¦Ÿ à¦—à§ à¦°à§ à¦¤à§ à¦¬à¦ªà§‚à¦°à§ à¦£à¥¤ à¦­à¦¾à¦¬à§ à¦¨: n8n à¦¸à§‡à¦Ÿà¦†à¦ª à¦ à¦•à¦¬à¦¾à¦° \$497 vs Zapier à¦®à¦¾à¦¸à¦¿à¦• \$100\+à¥¤ à¦¬à¦›à¦°à§‡ \$1,200\+ à¦¸à¦¾à¦¶à§ à¦°à¦¯à¦¼!/g, to: 'আমি বুঝতে পারছি বাজেট গুরুত্বপূর্ণ। ভাবুন: n8n সেটআপ একবার $497 vs Zapier মাসিক $100+। বছরে $1,200+ সাশ্রয়!' },
    { from: /à¦•à§‹à¦¨ à¦¸à¦®à¦¸à§ à¦¯à¦¾ à¦¨à§‡à¦‡à¥¤ à¦†à¦®à¦¿ à¦ à¦•à¦Ÿà¦¾ à¦¡à¦¿àŸà§‡à¦‡à¦²à§ à¦¡ à¦ªà§ à¦°à§‹à¦ªà§‹à¦œà¦¾à¦² à¦¤à§ˆà¦°à¦¿ à¦•à¦°à§‡ à¦¦à¦¿à¦‡à¥¤ à¦‡à¦®à§‡à¦‡à¦² à¦¨à¦¾à¦•à¦¿ à¦¹à§‹à§Ÿà¦¾à¦Ÿà¦¸à¦…à§ à¦¯à¦¾à¦ªà§‡ à¦ªà¦¾à¦ à¦¾à¦¬\?/g, to: 'কোন সমস্যা নেই। আমি একটা ডিটেইল্ড প্রোপোজাল তৈরি করে দিই। ইমেইল নাকি হোয়াটসঅ্যাপে পাঠাব?' },
    { from: /à¦­à¦¾à¦²à§‹ à¦ªà§ à¦°à¦¶à§ à¦¨! à¦†à¦®à¦¾à¦¦à§‡à¦° à¦­à§‡à¦°à¦¿à¦«à¦¾à¦‡à¦¡ à¦•à§‡à¦¸ à¦¸à§ à¦Ÿà¦¾à¦¡à¦¿ à¦†à¦›à§‡à¥¤ à¦†à¦®à¦¿ à¦Ÿà§‡à¦•à¦¨à¦¿à¦•à§ à¦¯à¦¾à¦² à¦†à¦°à§ à¦•à¦¿à¦Ÿà§‡à¦•à¦šà¦¾à¦° à¦¦à§‡à¦–à¦¾à¦¤à§‡ à¦ªà¦¾à¦°à¦¿à¥¤/g, to: 'ভালো প্রশ্ন! আমাদের ভেরিফাইড কেস স্টাডি আছে। আমি টেকনিক্যাল আর্কিটেকচার দেখাতে পারি।' },
    { from: /à¦¸à¦ à¦¿à¦• à¦ªà§Ÿà§‡à¦¨à§ à¦Ÿà¥¤ à¦ªà¦¾à¦°à§ à¦¥à¦•à§ à¦¯: à¦†à¦®à¦°à¦¾ self-hosted n8n à¦¬à§ à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à¦¿ \(\$5\.99\/mo VPS\)à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦¡à¦¾à¦Ÿà¦¾ à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦¾à¦°à§ à¦­à¦¾à¦°à§‡ à¦¥à¦¾à¦•à§‡à¥¤ à¦•à§‹à¦¨ à¦ªà§ à¦°à¦¤à¦¿-à¦Ÿà¦¾à¦¸à§ à¦• à¦«à¦¿ à¦¨à§‡à¦‡à¥¤/g, to: 'সঠিক পয়েন্ট। পার্থক্য: আমরা self-hosted n8n ব্যবহার করি ($5.99/mo VPS)। আপনার ডাটা আপনার সার্ভারে থাকে। কোন প্রতি-টাস্ক ফি নেই।' },
    { from: /à¦†à¦®à¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦‰à¦¦à§ à¦¬à§‡à¦— à¦¬à§ à¦ à¦¤à§‡ à¦ªà¦¾à¦°à¦›à¦¿à¥¤ à¦†à¦¸à§ à¦¨ à¦†à¦°à§‡à¦•à¦Ÿà§  à¦¬à¦¿à¦¸à§ à¦¤à¦¾à¦°à¦¿à¦¤ à¦†à¦²à§‹à¦šà¦¨à¦¾ à¦•à¦°à¦¿à¥¤/g, to: 'আমি আপনার উদ্বেগ বুঝতে পারছি। আসুন আরেকটু বিস্তারিত আলোচনা করি।' }
];

function walk(dir) {
    let files = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(walk(fullPath));
        } else if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.json') || file.endsWith('.html') || file.endsWith('.md')) {
            files.push(fullPath);
        }
    }
    return files;
}

const targets = [
    path.join(ROOT_DIR, 'functions'),
    path.join(ROOT_DIR, 'src'),
    path.join(ROOT_DIR, 'ai_brain')
];

let totalFixedFiles = 0;

for (const targetDir of targets) {
    if (!fs.existsSync(targetDir)) continue;
    const files = walk(targetDir);
    for (const filePath of files) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        for (const { from, to } of MOJIBAKE_MAP) {
            if (from.test(content)) {
                content = content.replace(from, to);
                modified = true;
            }
        }

        // Catch any remaining standalone à§³
        if (content.includes('à§³')) {
            content = content.replaceAll('à§³', '৳');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            totalFixedFiles++;
            console.log(`[✓] Fixed mojibake in: ${path.relative(ROOT_DIR, filePath)}`);
        }
    }
}

console.log(`\n✅ Mojibake repair completed. Repaired ${totalFixedFiles} files.`);
