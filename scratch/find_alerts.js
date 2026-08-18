const fs = require('fs');

function inspectAlerts(file) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('onclick=') && line.includes('alert(')) {
            console.log(`${file}:${idx + 1}: ${line.trim()}`);
        }
    });
}

inspectAlerts('index.html');
inspectAlerts('marketplace.html');
