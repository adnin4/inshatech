/**
 * Static Scanner: Checking for unauthorized Supabase Direct Service-Role Client Invasions
 */
const fs = require('fs');
const path = require('path');

function scanDirectory(dir, infractions = []) {
  if (!fs.existsSync(dir)) return infractions;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !fullPath.includes('node_modules') && !fullPath.includes('.git')) {
      scanDirectory(fullPath, infractions);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('SUPABASE_SERVICE_ROLE_KEY') && !fullPath.includes('functions') && !fullPath.includes('scripts')) {
        infractions.push({ file: fullPath, line: 'Found SUPABASE_SERVICE_ROLE_KEY' });
      }
    }
  }
  return infractions;
}

const infractions = scanDirectory('src');
if (infractions.length > 0) {
  console.error("CRITICAL SECURITY BREACH: Exposed Service Role Key in client source code!", infractions);
  process.exit(1);
} else {
  console.log("✅ All client source passes security scan. Zero direct administrative mutations detected.");
}
