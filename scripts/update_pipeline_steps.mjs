import fs from 'fs';

function updateSteps(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(
        '1. Inbound Prospect (WhatsApp / Web)',
        '01 // Inbound Prospect (WhatsApp / Web)'
    );
    content = content.replace(
        '2. AI Intent & Document OCR Engine',
        '02 // AI Intent & Document OCR Engine'
    );
    content = content.replace(
        '3. Multi-Agent Reasoning Swarm',
        '03 // Multi-Agent Reasoning Swarm'
    );
    content = content.replace(
        '4. CRM Deal Booking & Closed',
        '04 // CRM Deal Booking & Closed'
    );

    // Also upgrade the TEST STEP button to Ponder pill style
    content = content.replace(
        'style="font-size: 0.65rem; color: #00f2fe; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 4px; padding: 2px 6px; cursor: pointer; font-family: var(--font-mono);"',
        'style="font-size: 0.65rem; color: #ffffff; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 9999px; padding: 3px 10px; cursor: pointer; font-family: var(--font-mono); font-weight: 700;"'
    );

    fs.writeFileSync(filePath, content, 'utf8');
}

updateSteps('index.html');
updateSteps('live_index.html');

const f1 = fs.readFileSync('index.html', 'utf8');
const f2 = fs.readFileSync('live_index.html', 'utf8');

console.log('Parity check:', f1 === f2);
console.log('Has 01 // Inbound Prospect:', f1.includes('01 // Inbound Prospect'));
