import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';

console.log('=== UPGRADING HERO & TOP BAR IN INDEX.HTML & LIVE_INDEX.HTML ===');

function upgradeHeroHtml(content) {
    // 1. Upgrade top status bar: ensure clean mobile appearance without jargon
    content = content.replace(
        /<span class="os-status-secondary-text"[^>]*>Enterprise Autonomous Systems v10\.0<\/span>/i,
        '<span class="os-status-secondary-text" style="color: #64748b;">Enterprise Autonomous AI Engineering Lab</span>'
    );

    // 2. Streamline Hero Section Header (Consolidate 3 stacked badges into 1 sleek editorial badge)
    const oldBadgesRegex = /<!-- AWWWARDS EDITORIAL NOMINEE BADGE -->[\s\S]*?<h1 class="hero-title"/i;
    const newEditorialBadge = `<!-- DEDICATED AWWWARDS / EDITORIAL EXCELLENCE BADGE -->
                        <div class="hero-awwwards-tag" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.25); border-radius: 9999px; padding: 6px 16px; margin-bottom: 18px; backdrop-filter: blur(8px);">
                            <span class="os-pulse-dot" style="background: #00f2fe; width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 10px #00f2fe;"></span>
                            <span style="font-size: 0.76rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #00f2fe; font-family: var(--font-mono);">AWWWARDS HONOREE NOMINEE • ENTERPRISE AI INFRASTRUCTURE 2026</span>
                        </div>
                        
                        <h1 class="hero-title"`;
    content = content.replace(oldBadgesRegex, newEditorialBadge);

    // 3. Upgrade Hero Title & Subtitle for maximum executive impact & conversion
    const oldTitleRegex = /<h1 class="hero-title"[\s\S]*?<\/h1>[\s\S]*?<p class="hero-subtitle"[\s\S]*?<\/p>/i;
    const newTitleHtml = `<h1 class="hero-title" style="font-size: clamp(2.3rem, 5vw, 4rem); font-weight: 800; line-height: 1.12; letter-spacing: -0.025em; margin-bottom: 18px;">
                            Autonomous AI Systems.<br>
                            <span class="hero-gradient-silver" style="background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 45%, #00f2fe 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Engineered for Exponential Scale.</span>
                        </h1>
                        
                        <p class="hero-subtitle" style="font-size: 1.08rem; color: #94a3b8; font-weight: 400; margin-bottom: 26px; line-height: 1.65; max-width: 620px;">
                            We build self-operating AI workforces, 24/7 intelligent sales pipelines, and high-precision automation systems that replace 80%+ of repetitive manual labor — with 100% data sovereignty and zero vendor lock-in. Co-architected by Lead AI Engineer <strong>Adnin Sadat Mahin</strong> for <strong>IINSHA AI Automation Lab</strong>.
                        </p>`;
    content = content.replace(oldTitleRegex, newTitleHtml);

    // 4. Upgrade Hero Action Buttons (Clean, High-Converting Hierarchy)
    const oldActionsRegex = /<div class="hero-actions"[\s\S]*?<\/div>[\s\S]*?<!-- Secondary Capability Pills -->[\s\S]*?<\/div>/i;
    const newActionsHtml = `<div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                            <a href="#solution-finder" class="btn btn-primary-glow" style="background: linear-gradient(135deg, #00f2fe, #0284c7); color: #000; font-weight: 800; padding: 13px 24px; border-radius: 10px; font-size: 0.92rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                                <span>⚡ Launch AI Solution Finder →</span>
                            </a>
                            <a href="https://wa.me/8801629286887" target="_blank" class="btn btn-glass-glow" style="background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); font-weight: 700; padding: 13px 22px; border-radius: 10px; font-size: 0.92rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                                <span>💬 Direct WhatsApp Consult</span>
                            </a>
                            <a href="affiliate.html" class="btn btn-gold-pill" style="font-size: 0.82rem; padding: 10px 16px; border-radius: 10px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; text-decoration: none; font-weight: 700;">
                                <span>🤝 Partner Network (15-25% Recurring) →</span>
                            </a>
                        </div>`;
    content = content.replace(oldActionsRegex, newActionsHtml);

    // 5. Upgrade Hero Studio Card: Replace developer clutter with Executive AI Architecture & Workforce Mesh
    const oldStudioCardRegex = /<!-- LEAD ENGINEER PROFILE & STUDIO CARD -->[\s\S]*?<!-- HONEST CAPACITY STATUS BAR -->/i;
    const newStudioCardHtml = `<!-- EXECUTIVE AI ARCHITECTURE & WORKFORCE MESH SHOWCASE -->
                    <div class="hero-studio-card glass-card glowing-border" style="padding: 24px; background: rgba(11, 15, 25, 0.94); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 18px; box-shadow: 0 25px 60px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.12); backdrop-filter: blur(16px);">
                        <!-- Architecture Showcase Titlebar -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
                                <span style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
                                <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                                <span style="font-family: var(--font-mono); font-size: 0.78rem; color: #38bdf8; font-weight: 700; margin-left: 6px;">⚡ LIVE AI WORKFORCE TOPOLOGY</span>
                            </div>
                            <span class="badge-pro" style="padding: 3px 10px; font-size: 0.7rem; letter-spacing: 0.05em; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 20px; font-weight: 700;">● 18 AGENTS ACTIVE</span>
                        </div>

                        <!-- 3 Executive High-Impact Metrics -->
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
                            <div style="background: rgba(0,0,0,0.45); padding: 12px 8px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.2); text-align: center;">
                                <div style="font-size: 1.35rem; font-weight: 900; color: #38bdf8; font-family: var(--font-mono);">85%</div>
                                <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Labor Saved</div>
                            </div>
                            <div style="background: rgba(0,0,0,0.45); padding: 12px 8px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.2); text-align: center;">
                                <div style="font-size: 1.35rem; font-weight: 900; color: #10b981; font-family: var(--font-mono);">&lt;45s</div>
                                <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Speed to Lead</div>
                            </div>
                            <div style="background: rgba(0,0,0,0.45); padding: 12px 8px; border-radius: 10px; border: 1px solid rgba(245, 158, 11, 0.2); text-align: center;">
                                <div style="font-size: 1.35rem; font-weight: 900; color: #fbbf24; font-family: var(--font-mono);">24/7</div>
                                <div style="font-size: 0.68rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Zero Downtime</div>
                            </div>
                        </div>

                        <!-- Interactive Visual AI Workflow Pipeline (Replaces Raw Code Snippet) -->
                        <div style="background: #060911; padding: 14px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.8rem; margin-bottom: 16px;">
                            <div style="color: #64748b; font-size: 0.72rem; font-family: var(--font-mono); text-transform: uppercase; margin-bottom: 8px;">Autonomous Execution Pipeline:</div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #38bdf8;">
                                    <span style="color: #e2e8f0; font-weight: 600;">1. Inbound Prospect (WhatsApp / Web)</span>
                                    <span style="color: #38bdf8; font-size: 0.72rem; font-family: var(--font-mono);">CAPTURED</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #a855f7;">
                                    <span style="color: #e2e8f0; font-weight: 600;">2. AI Intent & Document OCR Engine</span>
                                    <span style="color: #c084fc; font-size: 0.72rem; font-family: var(--font-mono);">PROCESSED</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #10b981;">
                                    <span style="color: #e2e8f0; font-weight: 600;">3. Multi-Agent Reasoning Swarm</span>
                                    <span style="color: #34d399; font-size: 0.72rem; font-family: var(--font-mono);">QUALIFIED</span>
                                </div>
                                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(16, 185, 129, 0.08); padding: 8px 10px; border-radius: 6px; border-left: 3px solid #10b981;">
                                    <span style="color: #fff; font-weight: 700;">4. CRM Update & Instant Deal Booking</span>
                                    <span style="color: #10b981; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 800;">CLOSED ✔</span>
                                </div>
                            </div>
                        </div>

                        <!-- Architect Identity & Production Contact -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <img src="adnin_sadat.jpg" alt="Adnin Sadat Mahin" style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--accent-emerald); object-fit: cover;">
                                <div>
                                    <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">Adnin Sadat Mahin</div>
                                    <div style="font-size: 0.74rem; color: #94a3b8;">Lead AI Systems Architect</div>
                                </div>
                            </div>
                            <span style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700; display: flex; align-items: center; gap: 4px;">
                                <span class="os-pulse-dot" style="background: #10b981; width: 6px; height: 6px;"></span> VERIFIED
                            </span>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px;">
                            <a href="#architecture-builder" class="btn btn-glass-sm btn-full" style="color: #fff; font-size: 0.8rem; justify-content: center; border-radius: 8px;">Architecture Builder</a>
                            <a href="https://wa.me/8801629286887" target="_blank" class="btn btn-primary-sm btn-full" style="background: linear-gradient(135deg, var(--accent-emerald), #047857); font-size: 0.8rem; justify-content: center; border-radius: 8px; font-weight: 700;">Direct WhatsApp</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- HONEST CAPACITY STATUS BAR -->`;
    content = content.replace(oldStudioCardRegex, newStudioCardHtml);

    return content;
}

const indexPath = path.join(ROOT, 'index.html');
const liveIndexPath = path.join(ROOT, 'live_index.html');

let indexHtml = fs.readFileSync(indexPath, 'utf8');
let liveIndexHtml = fs.readFileSync(liveIndexPath, 'utf8');

indexHtml = upgradeHeroHtml(indexHtml);
liveIndexHtml = upgradeHeroHtml(liveIndexHtml);

fs.writeFileSync(indexPath, indexHtml, 'utf8');
fs.writeFileSync(liveIndexPath, liveIndexHtml, 'utf8');

console.log('✓ index.html and live_index.html upgraded with executive hero, clean visual hierarchy, and 100% parity');
