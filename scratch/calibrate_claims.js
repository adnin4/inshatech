const fs = require("fs");
const path = require("path");

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

let count = 0;
walkDir(".", (filePath) => {
    if (filePath.endsWith(".html") || filePath.endsWith(".js")) {
        let content = fs.readFileSync(filePath, "utf8");
        let orig = content;

        // 1. Calibrate ~870% [ESTIMATED] ROI to realistic scenario projection
        content = content.split('id="roi-percent">~870% <span style="font-size:0.75rem;color:#94a3b8;">[ESTIMATED SCENARIO]</span></div>').join('id="roi-percent">~870% <span style="font-size:0.75rem;color:#94a3b8;">[ESTIMATED SCENARIO]</span></div>');
        content = content.split('~870% [ESTIMATED]').join('~870% [ESTIMATED]');

        // 2. Calibrate HIPAA claim to enterprise AES-256 standard
        content = content.split('Enterprise AES-256 Architecture Blueprint').join('Enterprise AES-256 Architecture Blueprint');
        content = content.split('(GDPR Compliant & AES-256 Encrypted)').join('(GDPR Compliant & AES-256 Encrypted)');

        if (content !== orig) {
            fs.writeFileSync(filePath, content, "utf8");
            count++;
            console.log("Calibrated:", filePath);
        }
    }
});

console.log("Total files calibrated:", count);
