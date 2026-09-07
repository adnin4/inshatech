import fs from 'node:fs';
import path from 'node:path';

function check(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) {
            check(p);
        } else if (f.name.endsWith('.js')) {
            const txt = fs.readFileSync(p, 'utf8');
            const matches = txt.matchAll(/from\s+['"](\.[^'"]+)['"]/g);
            for (const m of matches) {
                const rel = m[1];
                const resolved = path.resolve(dir, rel);
                if (!fs.existsSync(resolved) && !fs.existsSync(resolved + '.js')) {
                    console.log(`BROKEN IMPORT in ${p}: ${rel} -> ${resolved}`);
                }
            }
        }
    }
}

check(path.resolve('functions'));
console.log('Finished checking all functions imports.');
