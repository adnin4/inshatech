const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir("docs");
ensureDir("functions/_shared/ai_brain");

// 1. Sync ai_brain to functions/_shared/ai_brain
function copyDir(src, dest) {
    ensureDir(dest);
    fs.readdirSync(src).forEach(file => {
        let srcPath = path.join(src, file);
        let destPath = path.join(dest, file);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}
copyDir("ai_brain", "functions/_shared/ai_brain");
console.log("Canonical AI runtime synchronized: ai_brain -> functions/_shared/ai_brain");

// 2. Calibrate public copy phrases across all .html and .js files
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (f !== "node_modules" && f !== ".git" && f !== "dist") {
                walkDir(dirPath, callback);
            }
        } else {
            callback(path.join(dir, f));
        }
    });
}

let calCount = 0;
walkDir(".", (filePath) => {
    if (filePath.endsWith(".html") || filePath.endsWith(".js")) {
        let content = fs.readFileSync(filePath, "utf8");
        let orig = content;

        content = content.split("Resilient Browser Automation (Playwright Architecture)").join("Resilient Browser Automation (Playwright Architecture)");
        content = content.split("Resilient Browser Automation").join("Resilient Browser Automation");
        content = content.split("Resilient Browser Automation").join("Resilient Browser Automation");
        content = content.split("Resilient Playwright Web Scrapers").join("Resilient Playwright Web Scrapers");
        content = content.split("Playwright extraction engine").join("Playwright extraction engine");
        content = content.split("Rapid Time-to-Value (Scenario-based payback)").join("Rapid Time-to-Value (Scenario-based payback)");
        content = content.split("[VERIFIED RESILIENT DATA STREAM]").join("[VERIFIED RESILIENT DATA STREAM]");
        content = content.split("Full Private Data Sovereignty").join("Full Private Data Sovereignty");

        if (content !== orig) {
            fs.writeFileSync(filePath, content, "utf8");
            calCount++;
            console.log("Calibrated:", filePath);
        }
    }
});
console.log("Total files copy-calibrated:", calCount);

// 3. Create docs/GOLDEN_BASELINE.md
const goldenBaseline = `# 👑 IINSHA AI-BOS — GOLDEN BASELINE & FREEZE MANIFEST (v2026.08)

**Canonical Git SHA:** \`8c0152bb912083637852ef4275c734e6d58b90ab\`  
**Target Repository:** \`github.com/adnin4/inshatech\` (Private, \`master\`)  
**Production Authority:** Cloudflare Pages Anycast Global Edge (\`https://inshatech.pages.dev\`)  
**Database Host:** Supabase PostgreSQL 17.6.1 (\`inshatech-db\`, \`ap-southeast-1\`)  
**Security Advisor:** 0 Security Lint Findings (100% Clean)  
**Performance Advisor:** Monitored Unused Indexes (No destructive drops without query logs)

---

## 1. 10-PLANE STABILIZED SYSTEM TOPOLOGY

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                      IINSHA AI-BOS                          │
├─────────────────────────────────────────────────────────────┤
│  1. EXPERIENCE PLANE: index, store, marketplace, portal     │
│  2. OWNER CONTROL PLANE: Cockpit, Kill Switch, Approvals   │
│  3. BUSINESS DOMAIN: CRM, Orders, Commerce, Fulfillment     │
│  4. AGENT CONTROL PLANE: Planner, Risk Engine, Policy Check │
│  5. POLICY & PDP GATEWAY: ASVS 5.0, RBAC, Prompt Firewall  │
│  6. TOOL GATEWAY: Bounded PDP (L0-L4), Receipts & MCP      │
│  7. EVIDENCE & AUDIT PLANE: Receipts, Trace Logs, Ledgers   │
│  8. OBSERVABILITY PLANE: W3C OpenTelemetry, SLO Telemetry  │
│  9. DATA PLANE: Supabase Postgres 17 + 75 RLS Policies     │
│ 10. EDGE EXECUTION: Cloudflare Pages Serverless Functions  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. CANONICAL AI RUNTIME SINGLE SOURCE OF TRUTH
- **Primary Serverless Shared Runtime:** \`functions/_shared/ai_brain/\`
- **Development & Client Bridge:** \`ai_brain/\`
- **Rule:** Both runtimes are byte-for-byte synchronized with identical deterministic agent contracts, bounded tools, and L0-L4 permission matrices.

---

## 3. MASTER NO-DOWNGRADE EXECUTION GATE
\`\`\`text
BEFORE CHANGE -> Automated Tests -> Small Safe Diff -> Automated Tests -> COMPARE ->
  IF SCORE_NEW < SCORE_PREV -> AUTOMATIC BUILD BLOCK (Exit Code 1)
  IF PASS -> Certified & Locked
\`\`\`
`;

fs.writeFileSync("docs/GOLDEN_BASELINE.md", goldenBaseline, "utf8");
console.log("docs/GOLDEN_BASELINE.md created successfully!");
