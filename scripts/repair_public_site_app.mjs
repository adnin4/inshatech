import fs from 'node:fs';

const file = 'app.js';
const source = fs.readFileSync(file, 'utf8');
const start = source.indexOf('function initFloatingAiAssistantWidget() {');
const end = source.indexOf('function initMasterApp() {', start);

if (start < 0 || end < 0 || end <= start) {
  throw new Error('PUBLIC_APP_REPAIR: expected floating-widget block boundaries were not found; refusing to modify app.js');
}

const oldBlock = source.slice(start, end);
if (!oldBlock.includes('widget.style.cssText') || !oldBlock.includes('widget.innerHTML')) {
  throw new Error('PUBLIC_APP_REPAIR: expected malformed widget implementation was not found; refusing to modify app.js');
}

const newBlock = String.raw`function initFloatingAiAssistantWidget() {
    const old = document.getElementById('iinsha-floating-ai-widget');
    if (old) old.remove();

    const widget = document.createElement('div');
    widget.id = 'iinsha-floating-ai-widget';
    widget.setAttribute('aria-label', 'Open IINSHA AI Assistant');
    widget.style.cssText = 'position:fixed;bottom:96px;right:24px;z-index:9998;background:rgba(15,23,42,0.9);backdrop-filter:blur(10px);border:1px solid rgba(59,130,246,0.4);border-radius:30px;padding:6px 14px;font-size:0.75rem;color:#fff;cursor:pointer;box-shadow:0 8px 25px rgba(0,0,0,0.5);display:flex;align-items:center;gap:8px;';
    widget.addEventListener('click', () => {
        if (typeof window.toggleIinshaChatWindow === 'function') window.toggleIinshaChatWindow();
    });
    widget.innerHTML = \`
        <div class="glass-card glowing-border" style="background:rgba(15,23,42,0.95);border:1px solid var(--accent-cyan);padding:12px 18px;border-radius:30px;display:flex;align-items:center;gap:10px;box-shadow:0 0 25px rgba(6,182,212,0.3);transition:all 0.3s ease;">
            <div style="position:relative;width:36px;height:36px;background:rgba(6,182,212,0.2);border:1px solid var(--accent-cyan);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">
                🤖
                <span style="position:absolute;top:0;right:0;width:10px;height:10px;background:#10b981;border-radius:50%;border:2px solid #000;animation:pulse 1.2s infinite;"></span>
            </div>
            <div>
                <span style="font-size:0.85rem;font-weight:bold;color:#fff;display:block;">Chat with IINSHA AI</span>
                <span style="font-size:0.7rem;color:var(--accent-emerald);">● Assistant</span>
            </div>
        </div>
    \`;
    document.body.appendChild(widget);
}
window.initFloatingAiAssistantWidget = initFloatingAiAssistantWidget;
window.toggleIinshaChatWindow = function() {
    if (window.UniversalAiCopilotInstance && typeof window.UniversalAiCopilotInstance.toggleWindow === 'function') {
        window.UniversalAiCopilotInstance.toggleWindow();
    }
};
window.openIinshaChatWindow = function() {
    if (window.UniversalAiCopilotInstance && typeof window.UniversalAiCopilotInstance.openWindow === 'function') {
        window.UniversalAiCopilotInstance.openWindow();
    }
};
window.openCopilot = window.openIinshaChatWindow;

`;

fs.writeFileSync(file, source.slice(0, start) + newBlock + source.slice(end), 'utf8');
console.log('PUBLIC_APP_REPAIR: repaired floating-widget block safely');
