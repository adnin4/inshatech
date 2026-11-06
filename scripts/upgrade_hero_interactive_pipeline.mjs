import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const files = ['index.html', 'live_index.html'];

for (const rel of files) {
    const fullPath = path.join(ROOT, rel);
    let content = fs.readFileSync(fullPath, 'utf8');

    const oldPipelineRegex = /<!-- Interactive Visual AI Workflow Pipeline \(Replaces Raw Code Snippet\) -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Architect Identity & Production Contact -->/;

    const newPipelineReplacement = `<!-- Interactive Visual AI Workflow Pipeline (Apiant & ChainGPT style) -->
                        <div style="background: #060911; padding: 14px; border-radius: 12px; border: 1px solid rgba(0, 242, 254, 0.22); font-size: 0.8rem; margin-bottom: 16px; box-shadow: inset 0 0 15px rgba(0, 242, 254, 0.05);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div style="color: #64748b; font-size: 0.72rem; font-family: var(--font-mono); text-transform: uppercase;">Autonomous Execution Pipeline:</div>
                                <button type="button" class="btn-micro" onclick="window.simulatePipelineStep(Math.floor(Math.random()*4))" style="font-size: 0.65rem; color: #00f2fe; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 4px; padding: 2px 6px; cursor: pointer; font-family: var(--font-mono);">⚡ TEST STEP</button>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
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
                                    <span id="hero-live-deal-metric" style="color: #10b981; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 800;">+$850 USD ✔</span>
                                </div>
                            </div>
                        </div>

                        <!-- Architect Identity & Production Contact -->`;

    if (!oldPipelineRegex.test(content)) {
        console.error('Regex match failed on:', rel);
        process.exit(1);
    }

    content = content.replace(oldPipelineRegex, () => newPipelineReplacement);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('✓ Successfully upgraded interactive pipeline in', rel);
}
