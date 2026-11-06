import fs from 'fs';

const tomlPath = 'C:\\Users\\mahin khan\\AppData\\Roaming\\xdg.config\\.wrangler\\config\\default.toml';
const toml = fs.readFileSync(tomlPath, 'utf8');
const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
const token = tokenMatch[1];
const accId = '0eaa8aeb3e2ea628065da5c05b1368a7';

async function check() {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accId}/pages/projects/inshatech/domains`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    console.log('Project domains:', JSON.stringify(data, null, 2));
}

check().catch(console.error);
