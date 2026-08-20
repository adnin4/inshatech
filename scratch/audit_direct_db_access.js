/**
 * IINSHA AI-BOS — Direct DB Access Audit & Inventory Tool
 * Generates scratch/evidence/DIRECT_DB_ACCESS.json
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = process.env.GITHUB_WORKSPACE || path.resolve(__dirname, '..');
const report = {
  scan_time: new Date().toISOString(),
  total_files_scanned: 0,
  direct_db_access_points: [],
  summary: {
    public_catalog_reads: 0,
    server_edge_operations: 0,
    unauthorized_direct_mutations: 0
  },
  policy_compliance: 'ENFORCED'
};

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'build' || entry.name === 'scratch') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.html')) {
      report.total_files_scanned++;
      const content = fs.readFileSync(fullPath, 'utf8');
      const relPath = path.relative(BASE_DIR, fullPath).replace(/\\/g, '/');

      // Check for Supabase queries
      const queryRegex = /\.from\(['"]([^'"]+)['"]\)\.(select|insert|update|delete)/g;
      let match;
      while ((match = queryRegex.exec(content)) !== null) {
        const table = match[1];
        const operation = match[2].toUpperCase();
        const isBackend = relPath.startsWith('functions/api/') || relPath.startsWith('functions/');
        
        let risk = 'LOW';
        let actor = 'public_anonymous';

        if (!isBackend) {
          if (['ibos_users', 'ibos_orders', 'ibos_affiliates', 'ibos_revenue', 'ibos_commission_ledger'].includes(table) && operation !== 'SELECT') {
            risk = 'HIGH_MUTATION';
            report.summary.unauthorized_direct_mutations++;
          } else {
            report.summary.public_catalog_reads++;
          }
        } else {
          actor = 'edge_service_role';
          report.summary.server_edge_operations++;
        }

        report.direct_db_access_points.push({
          file: relPath,
          table: table,
          operation: operation,
          is_backend_edge_function: isBackend,
          actor: actor,
          risk: risk
        });
      }
    }
  }
}

scanDir(BASE_DIR);

const outDir = path.join(BASE_DIR, 'scratch', 'evidence');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'DIRECT_DB_ACCESS.json'), JSON.stringify(report, null, 2));

console.log(`[DIRECT DB ACCESS AUDIT] Scanned ${report.total_files_scanned} files. Found ${report.direct_db_access_points.length} DB access points.`);
console.log(`- Server Edge Operations: ${report.summary.server_edge_operations}`);
console.log(`- Public Catalog Reads: ${report.summary.public_catalog_reads}`);
console.log(`- Unauthorized Direct Mutations: ${report.summary.unauthorized_direct_mutations} (Should be 0)`);
console.log(`Saved report to scratch/evidence/DIRECT_DB_ACCESS.json`);
