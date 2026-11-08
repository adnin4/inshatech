import fs from 'fs';

function updateHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Hero Awwwards Tag -> Ponder Monospace Tag
    const tagOld = `<div class="hero-awwwards-tag" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.35); border-radius: 9999px; padding: 6px 18px; margin-bottom: 22px; backdrop-filter: blur(12px); box-shadow: 0 0 25px rgba(0, 242, 254, 0.2);">
                            <span class="os-pulse-dot" style="background: #00f2fe; width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 10px #00f2fe;"></span>
                            <span style="font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #00f2fe; font-family: var(--font-mono);">⚡ AUTONOMOUS AI SYSTEMS ARCHITECTURE</span>
                        </div>`;

    const tagNew = `<div class="hero-awwwards-tag" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9999px; padding: 6px 18px; margin-bottom: 22px; backdrop-filter: blur(14px); box-shadow: 0 2px 14px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12);">
                            <span class="os-pulse-dot" style="background: #ffffff; width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 10px #ffffff;"></span>
                            <span style="font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #f8fafc; font-family: var(--font-mono);">⚡ [ 01 // AUTONOMOUS AI SYSTEMS ARCHITECTURE ]</span>
                        </div>`;

    if (content.includes(tagOld)) {
        content = content.replace(tagOld, tagNew);
    }

    // 2. Hero Action Buttons -> Ponder High Contrast Stark White Pill & Ghost Pill
    const actionsOld = `<div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                            <a href="#solution-finder" class="btn btn-primary-glow" style="background: linear-gradient(135deg, #00f2fe, #0284c7); color: #000; font-weight: 800; padding: 14px 26px; border-radius: 10px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 25px rgba(0, 242, 254, 0.4);">
                                <span>⚡ Launch AI Solution Finder →</span>
                            </a>
                            <a href="https://wa.me/8801629286887" target="_blank" class="btn btn-glass-glow" style="background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-weight: 700; padding: 14px 24px; border-radius: 10px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                                <span>💬 Direct WhatsApp Consult</span>
                            </a>
                            <a href="affiliate.html" class="btn btn-gold-pill" style="font-size: 0.85rem; padding: 12px 18px; border-radius: 10px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; text-decoration: none; font-weight: 700;">
                                <span>🤝 Partner Network (15-25% Recurring) →</span>
                            </a>
                        </div>`;

    const actionsNew = `<div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                            <a href="#solution-finder" class="btn btn-primary-glow ponder-pill-primary" style="background: #ffffff; color: #030508; font-weight: 800; padding: 14px 26px; border-radius: 9999px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 22px rgba(255, 255, 255, 0.28); border: 1px solid #ffffff;">
                                <span>⚡ Launch AI Solution Finder →</span>
                            </a>
                            <a href="https://wa.me/8801629286887" target="_blank" class="btn btn-glass-glow ponder-pill-secondary" style="background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); font-weight: 700; padding: 14px 24px; border-radius: 9999px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(12px);">
                                <span>💬 Direct WhatsApp Consult</span>
                            </a>
                            <a href="affiliate.html" class="btn btn-gold-pill ponder-pill-amber" style="font-size: 0.85rem; padding: 14px 20px; border-radius: 9999px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; text-decoration: none; font-weight: 700;">
                                <span>🤝 Partner Network (15-25% Recurring) →</span>
                            </a>
                        </div>`;

    if (content.includes(actionsOld)) {
        content = content.replace(actionsOld, actionsNew);
    }

    // 3. Pipeline Step Items -> Ponder Numbered Flow
    const pipelineOld = `<div style="display: flex; flex-direction: column; gap: 8px;">
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(0)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #38bdf8; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">1. Inbound Prospect (WhatsApp / Web)</span>
                                    <span style="color: #38bdf8; font-size: 0.72rem; font-family: var(--font-mono);">CAPTURED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(1)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #a855f7; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">2. AI Intent & Document OCR Engine</span>
                                    <span style="color: #c084fc; font-size: 0.72rem; font-family: var(--font-mono);">PROCESSED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(2)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #10b981; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">3. Multi-Agent Reasoning Swarm</span>
                                    <span style="color: #34d399; font-size: 0.72rem; font-family: var(--font-mono);">QUALIFIED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(3)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 185, 129, 0.08); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #10b981; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #fff; font-weight: 700;">4. CRM Deal Booking & Closed</span>
                                    <span id="hero-live-deal-metric" style="color: #10b981; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 800;">+$850 USD ⚡</span>
                                </div>
                            </div>`;

    const pipelineNew = `<div style="display: flex; flex-direction: column; gap: 8px;">
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(0)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid #ffffff; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">01 // Inbound Prospect (WhatsApp / Web)</span>
                                    <span style="color: #ffffff; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 9999px;">CAPTURED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(1)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">02 // AI Intent & Document OCR Engine</span>
                                    <span style="color: #cbd5e1; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 9999px;">PROCESSED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(2)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); border-left: 3px solid rgba(255,255,255,0.4); cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #e2e8f0; font-weight: 600;">03 // Multi-Agent Reasoning Swarm</span>
                                    <span style="color: #cbd5e1; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 700; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 9999px;">QUALIFIED</span>
                                </div>
                                <div class="pipeline-step-item" onclick="window.simulatePipelineStep(3)" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.14); border-left: 3px solid #34d399; cursor: pointer; transition: all 0.25s ease;">
                                    <span style="color: #fff; font-weight: 700;">04 // CRM Deal Booking & Closed</span>
                                    <span id="hero-live-deal-metric" style="color: #34d399; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 800; background: rgba(52,211,153,0.1); padding: 2px 8px; border-radius: 9999px;">+$850 USD ⚡</span>
                                </div>
                            </div>`;

    if (content.includes(pipelineOld)) {
        content = content.replace(pipelineOld, pipelineNew);
    }

    fs.writeFileSync(filePath, content, 'utf8');
}

updateHtml('index.html');
updateHtml('live_index.html');

// Verify byte-for-byte DOM parity
const f1 = fs.readFileSync('index.html', 'utf8');
const f2 = fs.readFileSync('live_index.html', 'utf8');

if (f1 === f2) {
    console.log('✅ DOM PARITY VERIFIED: index.html and live_index.html are 100% byte-for-byte identical!');
} else {
    console.error('❌ DOM PARITY MISMATCH: index.html and live_index.html differ!');
    process.exit(1);
}
