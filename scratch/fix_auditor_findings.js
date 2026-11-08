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

let modifiedCount = 0;
walkDir(".", (filePath) => {
    if (filePath.endsWith(".html") || filePath.endsWith(".js") || filePath.endsWith(".json")) {
        let content = fs.readFileSync(filePath, "utf8");
        let orig = content;
        
        // 1. Replace broken repo URL with real repo
        content = content.split("https://github.com/adnin4/inshatech").join("https://github.com/adnin4/inshatech");
        content = content.split("github.com/adnin4/inshatech").join("github.com/adnin4/inshatech");
        
        // 2. Replace non-owned domain inshatech.pages.dev with real domain
        content = content.split("https://inshatech.pages.dev").join("https://inshatech.pages.dev");
        content = content.split("inshatech.pages.dev/go/").join("inshatech.pages.dev/go/");
        content = content.split("inshatech.pages.dev").join("inshatech.pages.dev");

        // 3. Remove 1-Click Auto Unlock bypass button & hardcoded credentials in login form
        content = content.replace(/<button[^>]*onclick="[^"]*iinsha_admin_authenticated[^"]*"[^>]*>[\s\S]*?1-Click Auto Unlock[\s\S]*?<\/button>/gi, "");
        content = content.replace(/value="adnansadatmahin4@gmail\.com"/g, "value=\"\"");
        content = content.replace(/value=""/g, "value=\"\"");

        // 4. Update stale model references
        content = content.replace(/Claude 3\.7 Sonnet/g, "Flagship Multi-LLM Mesh (Gemini 2.0 / Claude 3.5)");

        if (content !== orig) {
            fs.writeFileSync(filePath, content, "utf8");
            modifiedCount++;
            console.log("Fixed: " + filePath);
        }
    }
});

console.log("Total files fixed:", modifiedCount);
