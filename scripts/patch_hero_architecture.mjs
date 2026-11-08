import fs from 'fs';
import path from 'path';

const baseDir = path.resolve('.');

// 1. Update css/iinsha-diagram-motion.css
const motionCssPath = path.join(baseDir, 'css', 'iinsha-diagram-motion.css');
let motionCss = fs.readFileSync(motionCssPath, 'utf8');

// Replace hero stage definition
const oldStageRegex = /html\[data-iinsha-design="diagram"\] #hero\.hero-section,\s*html\[data-iinsha-design="diagram"\] \.hero-centered-stage\s*\{[\s\S]*?text-align:\s*center;\s*\}/;
const newStageCss = `html[data-iinsha-design="diagram"] #hero.hero-section,
html[data-iinsha-design="diagram"] .hero-centered-stage {
  position: relative !important;
  isolation: isolate !important;
  min-height: min(840px, 92svh) !important;
  padding: clamp(70px, 10vh, 120px) 20px clamp(50px, 7vh, 80px) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  overflow: hidden !important;
  text-align: center !important;
  width: 100% !important;
  max-width: 1080px !important;
  margin: 0 auto !important;
  box-sizing: border-box !important;
}`;

if (oldStageRegex.test(motionCss)) {
  motionCss = motionCss.replace(oldStageRegex, newStageCss);
}

// Ensure hero-centered-content, title, subtitle, actions are enforced
const heroStylesPatch = `
/* ENFORCED SINGLE-COLUMN EDITORIAL HERO STAGE */
.hero-visual-backdrop {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none !important;
  overflow: hidden !important;
  z-index: 1 !important;
}
.hero-bg-video {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  min-width: 100% !important;
  min-height: 100% !important;
  width: auto !important;
  height: auto !important;
  object-fit: cover !important;
  opacity: 0.6 !important;
  filter: contrast(1.1) brightness(0.95) !important;
}
.hero-video-overlay {
  position: absolute !important;
  inset: 0 !important;
  background: radial-gradient(circle at 50% 45%, rgba(7, 8, 17, 0.35) 0%, rgba(7, 8, 17, 0.88) 75%, #070811 100%) !important;
  z-index: 2 !important;
}
html[data-iinsha-design="diagram"] .hero-centered-content,
.hero-centered-content {
  width: 100% !important;
  max-width: 920px !important;
  margin: 0 auto !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  position: relative !important;
  z-index: 3 !important;
  box-sizing: border-box !important;
}
html[data-iinsha-design="diagram"] .hero-title,
.hero-title {
  display: block !important;
  width: 100% !important;
  max-width: 920px !important;
  margin: 0 auto 22px auto !important;
  color: #ffffff !important;
  font-size: clamp(2.8rem, 6.5vw, 5.6rem) !important;
  font-weight: 780 !important;
  letter-spacing: -0.05em !important;
  line-height: 1.02 !important;
  text-align: center !important;
  text-wrap: balance !important;
}
html[data-iinsha-design="diagram"] .hero-subtitle,
.hero-subtitle {
  display: block !important;
  width: 100% !important;
  max-width: 720px !important;
  min-width: min(100%, 460px) !important;
  margin: 0 auto 32px auto !important;
  color: #a7adc4 !important;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem) !important;
  line-height: 1.75 !important;
  text-align: center !important;
  text-wrap: balance !important;
}
html[data-iinsha-design="diagram"] .hero-actions,
.hero-actions {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 14px !important;
  width: 100% !important;
  max-width: 820px !important;
  margin: 0 auto 24px auto !important;
}
html[data-iinsha-design="diagram"] .hero-trust-strip,
.hero-trust-strip {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  align-items: center !important;
  gap: clamp(14px, 3vw, 36px) !important;
  width: 100% !important;
  max-width: 860px !important;
  margin: 14px auto 0 auto !important;
}
`;

if (!motionCss.includes('ENFORCED SINGLE-COLUMN EDITORIAL HERO STAGE')) {
  motionCss += '\n' + heroStylesPatch;
}
fs.writeFileSync(motionCssPath, motionCss, 'utf8');
console.log('✅ Updated css/iinsha-diagram-motion.css with single-column editorial hero rules');

// 2. Update style.css
const styleCssPath = path.join(baseDir, 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

const oldStyleStageRegex = /\.hero-centered-stage\s*\{[\s\S]*?padding:\s*110px 24px 90px 24px !important;\s*position:\s*relative !important;\s*z-index:\s*4 !important;\s*\}/;
const newStyleStageCss = `.hero-centered-stage {
    text-align: center !important;
    max-width: 1080px !important;
    width: 100% !important;
    margin: 0 auto !important;
    padding: clamp(70px, 10vh, 120px) 20px clamp(50px, 7vh, 80px) !important;
    position: relative !important;
    z-index: 4 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;
}`;

if (oldStyleStageRegex.test(styleCss)) {
  styleCss = styleCss.replace(oldStyleStageRegex, newStyleStageCss);
}

if (!styleCss.includes('ENFORCED SINGLE-COLUMN EDITORIAL HERO STAGE')) {
  styleCss += '\n' + heroStylesPatch;
}
fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log('✅ Updated style.css with single-column editorial hero rules');

// 3. Update index.html
const indexHtmlPath = path.join(baseDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace top operational strip latency
indexHtml = indexHtml.replace(
  '<span style="color: #10b981;">Latency: 12ms</span>',
  '<span style="color: #94a3b8; font-size: 0.72rem;">Target SLA: &lt;50ms</span>'
);

// Replace Section 1 markup with video backdrop and hero-centered-content wrapper
const oldHeroSectionRegex = /<section id="s1" data-diagram-section="s1" class="hero-section idg-hero"[\s\S]*?<!-- Failsafe container for backward compatibility tests -->\s*<div class="hero-grid" style="display: none !important;">[\s\S]*?<\/div>\s*<\/section>/;

const newHeroSection = `<section id="s1" data-diagram-section="s1" class="hero-section idg-hero" style="position: relative; overflow: hidden; padding: clamp(40px, 8vh, 80px) 0 clamp(60px, 10vh, 100px); text-align: center;">
            <div id="hero" style="position: absolute; top: 0; left: 0;"></div>

            <!-- ORIGINAL CELESTIAL BACKGROUND VIDEO & ORBIT BACKDROP -->
            <div class="hero-visual-backdrop" aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: hidden; z-index: 1;">
                <video id="hero-background-video" class="hero-bg-video" autoplay muted loop playsinline preload="metadata" poster="assets/hero-celestial-poster.jpg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100%; min-height: 100%; width: auto; height: auto; object-fit: cover; opacity: 0.6;">
                    <source src="assets/hero-celestial-loop.webm" type="video/webm">
                </video>
                <div class="hero-video-overlay" style="position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, rgba(7, 8, 17, 0.35) 0%, rgba(7, 8, 17, 0.88) 75%, #070811 100%); z-index: 2;"></div>
            </div>

            <!-- CENTERED SINGLE-COLUMN EDITORIAL STAGE -->
            <div class="idg-demo-wrap container hero-centered-stage" style="max-width: 1080px; width: 100%; margin: 0 auto; position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; box-sizing: border-box;">
                <div class="hero-centered-content" style="width: 100%; max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: center; box-sizing: border-box;">
                    <!-- MEMORY BANNER -->
                    <div id="os-memory-banner" class="os-memory-banner" style="display: none; margin-bottom: 18px;"></div>

                    <!-- DIAGRAM LUMINOUS PILL BADGE -->
                    <div class="idg-eyebrow hero-awwwards-tag" style="margin-bottom: 22px;">
                        <span class="os-pulse-dot" style="background: #a855f7; width: 7px; height: 7px; border-radius: 50%; box-shadow: 0 0 12px #a855f7;"></span>
                        <span>✦ [ 01 // AUTONOMOUS AI SYSTEMS ARCHITECTURE ]</span>
                    </div>

                    <!-- GIANT SCULPTURAL HEADLINE -->
                    <h1 class="hero-title" style="font-size: clamp(2.8rem, 6.5vw, 5.6rem); font-weight: 780; letter-spacing: -0.05em; line-height: 1.02; margin: 0 auto 22px auto; max-width: 920px; width: 100%; color: #ffffff; text-align: center;">
                        Autonomous AI Systems.<br>
                        <span class="idg-gradient-text hero-gradient-silver" style="background: linear-gradient(105deg, #ffffff 10%, #d8d9ff 45%, #a855f7 75%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Engineered for Enterprise Scale.</span>
                    </h1>

                    <!-- BALANCED REFINED SUBTITLE -->
                    <p class="hero-subtitle" style="font-size: clamp(1.05rem, 1.6vw, 1.25rem); color: #a7adc4; line-height: 1.75; max-width: 720px; min-width: min(100%, 460px); width: 100%; margin: 0 auto 32px auto; text-align: center;">
                        We architect self-operating AI workforces, intelligent customer conversion pipelines, and high-precision automation systems that replace 80%+ of repetitive manual operations. Co-architected by Lead AI Engineer <strong>Adnin Sadat Mahin</strong> for <strong>IINSHA AI Automation Lab</strong>.
                    </p>

                    <!-- DIAGRAM PILL ACTION BUTTONS -->
                    <div class="idg-actions hero-actions" style="display: flex; flex-direction: row; justify-content: center; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 24px; width: 100%;">
                        <a href="#s3" class="idg-button-primary btn-primary ponder-pill-primary" style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 750; padding: 13px 28px; border-radius: 9999px; text-decoration: none; color: #080a13; background: linear-gradient(115deg, #ffffff 0%, #eaeaff 55%, #cfd5ff 100%); box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2); border: 1px solid rgba(255,255,255,0.3);">
                            <span>✦ Explore Services ↗</span>
                        </a>
                        <a href="#s6" class="idg-button-quiet btn-glass-sm ponder-pill-secondary" style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 600; padding: 13px 26px; border-radius: 9999px; text-decoration: none; color: #f5f6fb; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);">
                            <span>Discuss a Project</span>
                        </a>
                        <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20to%20discuss%20an%20AI%20architecture%20build" target="_blank" rel="noopener noreferrer" class="btn btn-glass-sm" style="display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 600; padding: 13px 24px; border-radius: 9999px; text-decoration: none; color: #34d399; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3);">
                            <span class="os-pulse-dot" style="background: #10b981; width: 6px; height: 6px; border-radius: 50%;"></span>
                            <span>Direct WhatsApp Consult</span>
                        </a>
                    </div>

                    <!-- REAL 3D WEBGL2 PLANETARY ORBIT CANVAS (Prominent Centerpiece) -->
                    <canvas id="iinsha-diagram-scene" data-iinsha-motion-scene aria-hidden="true" style="display: block; width: min(100%, 1040px); height: clamp(320px, 44vw, 500px); margin: 0 auto; position: relative; z-index: 2; pointer-events: none;"></canvas>

                    <!-- 4-METRIC TRUST STRIP -->
                    <div class="idg-proofline hero-trust-strip" style="display: flex; flex-direction: row; justify-content: center; align-items: center; flex-wrap: wrap; gap: clamp(14px, 3vw, 36px); margin-top: 14px; width: 100%;">
                        <div style="text-align: center; padding: 10px 18px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">
                            <div style="font-size: 1.45rem; font-weight: 800; color: #ffffff; font-family: var(--font-mono, monospace);">85%</div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;">Labor Saved</div>
                        </div>
                        <div style="text-align: center; padding: 10px 18px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">
                            <div style="font-size: 1.45rem; font-weight: 800; color: #38bdf8; font-family: var(--font-mono, monospace);">&lt;45s</div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;">Speed to Lead</div>
                        </div>
                        <div style="text-align: center; padding: 10px 18px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">
                            <div style="font-size: 1.45rem; font-weight: 800; color: #c084fc; font-family: var(--font-mono, monospace);">24/7</div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;">Self-Operating</div>
                        </div>
                        <div style="text-align: center; padding: 10px 18px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">
                            <div style="font-size: 1.45rem; font-weight: 800; color: #f59e0b; font-family: var(--font-mono, monospace);">100%</div>
                            <div style="font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px;">Data Sovereignty</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Failsafe container for backward compatibility tests -->
            <div class="hero-grid" style="display: none !important;">
                <div class="hero-studio-card glass-card glowing-border">
                    <div class="hero-telemetry-grid">
                        <span id="hero-live-deal-metric">01 // Inbound Prospect</span>
                    </div>
                </div>
            </div>
        </section>`;

if (oldHeroSectionRegex.test(indexHtml)) {
  indexHtml = indexHtml.replace(oldHeroSectionRegex, newHeroSection);
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log('✅ Updated index.html with new hero section markup & video backdrop');
} else {
  console.log('⚠️ oldHeroSectionRegex did not match directly, applying exact string replacement');
  const oldChunkStart = '<section id="s1" data-diagram-section="s1" class="hero-section idg-hero"';
  const oldChunkEnd = '<!-- Failsafe container for backward compatibility tests -->';
  const startIdx = indexHtml.indexOf(oldChunkStart);
  const endIdx = indexHtml.indexOf(oldChunkEnd);
  if (startIdx !== -1 && endIdx !== -1) {
    const fullEndIdx = indexHtml.indexOf('</section>', endIdx) + '</section>'.length;
    indexHtml = indexHtml.slice(0, startIdx) + newHeroSection + indexHtml.slice(fullEndIdx);
    fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
    console.log('✅ Applied exact slice replacement to index.html');
  }
}

// 4. Update js/core/enterprise_experience.js
const expJsPath = path.join(baseDir, 'js', 'core', 'enterprise_experience.js');
let expJs = fs.readFileSync(expJsPath, 'utf8');

const oldBannerRegex = /function initGdprBanner\(\) \{[\s\S]*?document\.body\.appendChild\(banner\);\s*\}/;
const newBannerJs = `function initGdprBanner() {
        if (STATE.cookieConsent || document.getElementById('iinsha-gdpr-banner')) return;
        const banner = document.createElement('div');
        banner.id = 'iinsha-gdpr-banner';
        banner.style.cssText = 'position: fixed; bottom: 24px; left: 24px; max-width: 420px; background: rgba(10, 13, 26, 0.96); backdrop-filter: blur(18px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 16px 20px; z-index: 9990; box-shadow: 0 16px 36px rgba(0,0,0,0.65); display: flex; flex-direction: column; gap: 10px; color: #f8fafc; font-size: 0.82rem;';
        banner.innerHTML = \`
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong style="color: #ffffff; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">🛡️ Privacy & Cookie Preferences</strong>
                <span style="font-size: 0.72rem; color: #38bdf8; font-weight: 600;">First-Party Telemetry</span>
            </div>
            <p style="margin: 0; color: #94a3b8; line-height: 1.45; font-size: 0.78rem;">
                We use strictly necessary session tokens and local preferences to maintain your workspace state and AI Copilot memory. No third-party ad networks are used.
            </p>
            <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; margin-top: 4px;">
                <button onclick="window.IINSHA_ENTERPRISE.openPrivacyModal()" style="background: transparent; border: 1px solid rgba(255,255,255,0.15); color: #94a3b8; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">Policy</button>
                <button onclick="window.IINSHA_ENTERPRISE.setGdprConsent('declined')" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.12); color: #cbd5e1; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">Decline</button>
                <button onclick="window.IINSHA_ENTERPRISE.setGdprConsent('accepted')" style="background: #ffffff; border: none; color: #000; font-weight: 700; padding: 5px 16px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">Accept</button>
            </div>
        \`;
        document.body.appendChild(banner);
    }`;

if (oldBannerRegex.test(expJs)) {
  expJs = expJs.replace(oldBannerRegex, newBannerJs);
  fs.writeFileSync(expJsPath, expJs, 'utf8');
  console.log('✅ Updated js/core/enterprise_experience.js with bottom-left privacy banner');
}

// 5. Synchronize live_index.html byte-for-byte with index.html
fs.writeFileSync(path.join(baseDir, 'live_index.html'), fs.readFileSync(indexHtmlPath));
console.log('✅ Synchronized index.html -> live_index.html (100% parity)');
