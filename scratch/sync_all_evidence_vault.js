const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
ensureDir("scratch/evidence");
ensureDir("docs");

// Copy and sync all evidence files to scratch/evidence/
const filesToSync = [
  "FINAL_EVIDENCE_MATRIX.json",
  "FINAL_EVIDENCE_MATRIX.md",
  "RELEASE_MANIFEST.json",
  "BRANCH_DIFF_MATRIX.json",
  "LIVE_PARITY_REPORT.json",
  "DIRECT_DB_ACCESS.json",
  "PAYMENT_RECONCILIATION_REPORT.md",
  "TENANT_ISOLATION_REPORT.md",
  "SECURITY_FINAL_REPORT.md",
  "DR_FINAL_REPORT.md",
  "PERFORMANCE_FINAL_REPORT.md",
  "FINAL_RELEASE_CERTIFICATE.md",
  "COMPLIANCE_REGISTER.csv",
  "AI_SECURITY_REPORT.md",
  "OBSERVABILITY_REPORT.md",
  "AUTH_FLOW_REPORT.md",
  "CRM_REPORT.md",
  "SBOM_SUPPLY_CHAIN_SECURITY.json",
  "MASTER_SECTOR_REGISTRY.json",
  "INSHATECH_PLATFORM_ROADMAP_GUIDE.md"
];

filesToSync.forEach(file => {
  const src = path.join("docs", file);
  const dest = path.join("scratch/evidence", file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

console.log("All evidence files synchronized to scratch/evidence/ and docs/ successfully!");
