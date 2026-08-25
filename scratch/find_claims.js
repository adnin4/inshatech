const fs = require('fs');
const files = ['index.html', 'store.html', 'portal.html', 'admin.html', 'affiliate.html', 'marketplace.html', 'compare.html', 'blog.html'];
const patterns = ['8,700%', '8700%', '4 Days', 'HIPAA', 'Cloudflare Bypass', '99.8%', '99.9%', '100% Reliable'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        patterns.forEach(p => {
            if (content.toLowerCase().includes(p.toLowerCase())) {
                console.log(`Found "${p}" in ${file}`);
            }
        });
    }
});
