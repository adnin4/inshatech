import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const oldHeroRegex = /<!-- TIER 1: HERO SECTION -->[\s\S]*?<!-- EXECUTIVE AI ARCHITECTURE & WORKFORCE MESH SHOWCASE -->/;

const newHeroReplacement = `<!-- TIER 1: HERO SECTION -->
        <section id="hero" class="hero-section" style="padding-top: 48px; padding-bottom: 56px; position: relative; overflow: hidden;">
            <div class="container" style="position: relative; z-index: 4;">
                <div class="hero-grid">
                    <div>
                        <!-- AI RETURNING USER MEMORY BANNER -->
                        <div id="os-memory-banner" class="os-memory-banner" style="display: none; margin-bottom: 20px;"></div>

                        <!-- DEDICATED LUMINOUS PILL BADGE -->
                        <div class="hero-awwwards-tag" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 242, 254, 0.1); border: 1px solid rgba(0, 242, 254, 0.35); border-radius: 9999px; padding: 6px 18px; margin-bottom: 22px; backdrop-filter: blur(12px); box-shadow: 0 0 25px rgba(0, 242, 254, 0.2);">
                            <span class="os-pulse-dot" style="background: #00f2fe; width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 10px #00f2fe;"></span>
                            <span style="font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #00f2fe; font-family: var(--font-mono);">⚡ AUTONOMOUS AI SYSTEMS ARCHITECTURE</span>
                        </div>
                        
                        <h1 class="hero-title" style="font-size: clamp(2.5rem, 5.5vw, 4.2rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 20px;">
                            Autonomous AI Systems.<br>
                            <span class="hero-gradient-silver" style="background: linear-gradient(135deg, #ffffff 15%, #00f2fe 70%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Engineered for Enterprise Scale.</span>
                        </h1>
                        
                        <p class="hero-subtitle" style="font-size: 1.12rem; color: #cbd5e1; font-weight: 400; margin-bottom: 28px; line-height: 1.7; max-width: 620px;">
                            We build self-operating AI workforces, intelligent customer conversion pipelines, and high-precision automation systems that replace 80%+ of repetitive manual operations — with full code ownership and zero lock-in. Co-architected by Lead AI Engineer <strong>Adnin Sadat Mahin</strong> for <strong>IINSHA AI Automation Lab</strong>.
                        </p>

                        <div class="hero-actions" style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                            <a href="#solution-finder" class="btn btn-primary-glow" style="background: linear-gradient(135deg, #00f2fe, #0284c7); color: #000; font-weight: 800; padding: 14px 26px; border-radius: 10px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 0 25px rgba(0, 242, 254, 0.4);">
                                <span>⚡ Launch AI Solution Finder →</span>
                            </a>
                            <a href="https://wa.me/8801629286887" target="_blank" class="btn btn-glass-glow" style="background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-weight: 700; padding: 14px 24px; border-radius: 10px; font-size: 0.95rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                                <span>💬 Direct WhatsApp Consult</span>
                            </a>
                            <a href="affiliate.html" class="btn btn-gold-pill" style="font-size: 0.85rem; padding: 12px 18px; border-radius: 10px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; text-decoration: none; font-weight: 700;">
                                <span>🤝 Partner Network (15-25% Recurring) →</span>
                            </a>
                        </div>

                        <!-- Clean High-Impact Executive Telemetry Strip (Chronicle HQ & AltLayer Caliber) -->
                        <div class="hero-trust-strip" style="display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 32px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.08);">
                            <div>
                                <div style="font-size: 1.45rem; font-weight: 900; color: #00f2fe; font-family: var(--font-mono);">85%</div>
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Labor Saved</div>
                            </div>
                            <div style="width: 1px; height: 32px; background: rgba(255,255,255,0.12);"></div>
                            <div>
                                <div style="font-size: 1.45rem; font-weight: 900; color: #10b981; font-family: var(--font-mono);">&lt;45s</div>
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Speed to Lead</div>
                            </div>
                            <div style="width: 1px; height: 32px; background: rgba(255,255,255,0.12);"></div>
                            <div>
                                <div style="font-size: 1.45rem; font-weight: 900; color: #a855f7; font-family: var(--font-mono);">24/7</div>
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Self-Operating</div>
                            </div>
                            <div style="width: 1px; height: 32px; background: rgba(255,255,255,0.12);"></div>
                            <div>
                                <div style="font-size: 1.45rem; font-weight: 900; color: #f59e0b; font-family: var(--font-mono);">100%</div>
                                <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Data Sovereignty</div>
                            </div>
                        </div>
                    </div>

                    <!-- EXECUTIVE AI ARCHITECTURE & WORKFORCE MESH SHOWCASE -->`;

for (const file of ['index.html', 'live_index.html']) {
    const fullPath = path.join(ROOT, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    if (!oldHeroRegex.test(content)) {
        console.error('Regex match failed on:', file);
        process.exit(1);
    }

    content = content.replace(oldHeroRegex, () => newHeroReplacement);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('✓ Successfully upgraded hero section in', file);
}
