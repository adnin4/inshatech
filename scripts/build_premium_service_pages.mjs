/**
 * scripts/build_premium_service_pages.mjs
 * Generates conversion-optimized service landing pages for 10 new commercial categories.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const premiumServices = JSON.parse(fs.readFileSync(path.join(ROOT, 'knowledge', 'premium_services.json'), 'utf8'));

for (const svc of premiumServices) {
  const filePath = path.join(ROOT, 'services', `${svc.slug}.html`);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${svc.name} | IINSHA AI Automation Lab</title>
    <meta name="description" content="${svc.description}">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../style.css">
</head>
<body>
    <canvas id="particleCanvas"></canvas>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>

    <header class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">
                <span class="logo-icon">${svc.icon}</span>
                <span class="logo-text">iin<span class="highlight">shaa</span> <span class="badge-pro">${svc.category.toUpperCase()}</span></span>
            </a>
            <nav class="nav-links">
                <a href="../index.html">← Back to Main Studio Portal</a>
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20to%20discuss%20${encodeURIComponent(svc.name)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm" style="background: linear-gradient(135deg, #10b981, #059669);">📱 Message Lead Engineer</a>
            </nav>
        </div>
    </header>

    <main class="container" style="padding: 50px 24px;">
        <!-- HERO CARD -->
        <div class="glass-card glowing-border" style="margin-bottom: 40px; padding: clamp(24px, 4vw, 44px);">
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 12px;">
                <span class="section-tag" style="background: rgba(168, 85, 247, 0.15); color: #d8b4fe;">${svc.category}</span>
                <span style="font-size: 0.78rem; color: #38bdf8; background: rgba(56, 189, 248, 0.12); padding: 4px 12px; border-radius: 9999px; font-weight: 700; border: 1px solid rgba(56,189,248,0.25);">✦ ${svc.marketSignal}</span>
            </div>
            <h1 class="hero-title" style="font-size: clamp(2rem, 4vw, 3rem); margin-top: 10px; line-height: 1.15;">${svc.name}</h1>
            <p style="font-size: 1.25rem; color: #fff; font-weight: 600; margin: 16px 0; line-height: 1.5;">${svc.heroHook}</p>
            <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 24px; line-height: 1.7;">${svc.solutionDescription}</p>

            <!-- 3D PROCEDURAL VISUAL COMPONENT -->
            <div style="margin: 24px 0;">
                <insha-3d-visual service="${svc.id}" label="${svc.name} 3D Visual" quality="high"></insha-3d-visual>
            </div>

            <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-top: 24px;">
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20to%20discuss%20a%20pilot%20for%20${encodeURIComponent(svc.name)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); font-size: 1.05rem; padding: 13px 26px;">
                    <span>📱 Request Pilot via WhatsApp (+8801629286887)</span>
                </a>
                <a href="../index.html#project-intake-form" class="btn btn-glass-sm" style="padding: 13px 22px;">
                    <span>Submit Project Intake Form</span>
                </a>
                <span style="font-size: 0.85rem; color: var(--text-muted);">Estimated Timeline: ${svc.timeline}</span>
            </div>
        </div>

        <!-- PROBLEM & DELIVERABLES GRID -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 48px;">
            <div class="glass-card" style="padding: 28px; border-radius: 20px;">
                <span style="font-size: 0.75rem; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">The Problem It Solves</span>
                <h3 style="color: #fff; margin: 10px 0 14px 0; font-size: 1.3rem;">Operational Friction</h3>
                <p style="color: var(--text-muted); line-height: 1.7; font-size: 0.95rem;">${svc.problemStatement}</p>
                <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
                    <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700;">IDEAL FOR:</span>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
                        ${svc.idealFor.map(b => `<span style="background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 9999px; font-size: 0.8rem; color: #c9c9e9;">${b}</span>`).join('')}
                    </div>
                </div>
            </div>

            <div class="glass-card" style="padding: 28px; border-radius: 20px;">
                <span style="font-size: 0.75rem; color: #34d399; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;">Tangible Handover</span>
                <h3 style="color: #fff; margin: 10px 0 14px 0; font-size: 1.3rem;">What You Receive</h3>
                <ul class="pkg-includes-list" style="line-height: 1.8;">
                    ${svc.deliverables.map(d => `<li><span>✓</span> ${d}</li>`).join('')}
                </ul>
            </div>
        </div>

        <!-- 3-TIER PRICING PACKAGES -->
        <h2 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 20px; color: #fff;">Proposed Delivery Packages</h2>
        <p style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 24px;">Transparent starting price estimates. Final quote confirmed upon technical discovery based on scope and integrations.</p>

        <div class="pkg-compare-grid" style="margin-bottom: 50px;">
            <!-- Pilot Tier -->
            <div class="pkg-tier-card">
                <div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">⏱️ Fast Scoped Pilot</div>
                    <div style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-top: 4px;">${svc.pricing.pilot.label}</div>
                    <div class="pkg-tier-price">$${svc.pricing.pilot.priceUSD} <span>/ Pilot</span></div>
                    <div class="pkg-tier-delivery">⏱️ ${svc.pricing.pilot.deliveryDays || 5} Business Days</div>
                    <ul class="pkg-includes-list">
                        <li><span>✓</span> ${svc.pricing.pilot.scope}</li>
                        <li><span>✓</span> Discovery & Architecture Mapping</li>
                        <li><span>✓</span> Staging Sandbox Verification</li>
                        <li><span>✓</span> Milestone Acceptance Sign-off</li>
                    </ul>
                </div>
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20to%20order%20the%20${encodeURIComponent(svc.pricing.pilot.label)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm btn-full" style="margin-top: 16px;">📱 Book Pilot ($${svc.pricing.pilot.priceUSD}) →</a>
            </div>

            <!-- Full Implementation Tier -->
            <div class="pkg-tier-card featured">
                <span class="pkg-tier-badge">RECOMMENDED</span>
                <div>
                    <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 800;">🚀 Complete System</div>
                    <div style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-top: 4px;">${svc.pricing.implementation.label}</div>
                    <div class="pkg-tier-price">$${svc.pricing.implementation.priceUSD} <span>/ Build</span></div>
                    <div class="pkg-tier-delivery">⏱️ ${svc.pricing.implementation.deliveryDays || 14} Business Days</div>
                    <ul class="pkg-includes-list">
                        <li><span>✓</span> ${svc.pricing.implementation.scope}</li>
                        <li><span>✓</span> Full Source Code & Schema Handover</li>
                        <li><span>✓</span> Automated Test Suite & Security Audit</li>
                        <li><span>✓</span> 30-Day Post-Launch Warranty</li>
                    </ul>
                </div>
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20to%20discuss%20the%20${encodeURIComponent(svc.pricing.implementation.label)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-full" style="background: linear-gradient(135deg, var(--accent-cyan), #0284c7); margin-top: 16px;">📱 Book Implementation ($${svc.pricing.implementation.priceUSD}) →</a>
            </div>

            <!-- Monthly Retainer Tier -->
            <div class="pkg-tier-card">
                <div>
                    <div style="font-size: 0.75rem; color: var(--accent-gold); font-weight: 800;">🛡️ Managed Operations</div>
                    <div style="font-size: 1.15rem; color: #fff; font-weight: 700; margin-top: 4px;">${svc.pricing.monthly.label}</div>
                    <div class="pkg-tier-price">$${svc.pricing.monthly.priceUSD} <span>/ Month</span></div>
                    <div class="pkg-tier-delivery">🔄 Ongoing Retainer Care</div>
                    <ul class="pkg-includes-list">
                        <li><span>✓</span> ${svc.pricing.monthly.scope}</li>
                        <li><span>✓</span> Continuous Error & Latency Heartbeats</li>
                        <li><span>✓</span> Bi-weekly Performance & Cost Optimization</li>
                        <li><span>✓</span> Priority Slack / WhatsApp Engineering Channel</li>
                    </ul>
                </div>
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20I'd%20like%20the%20${encodeURIComponent(svc.pricing.monthly.label)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-sm btn-full" style="background: linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:700; margin-top: 16px;">📱 Start Retainer Care →</a>
            </div>
        </div>

        <!-- PROCESS, TECH & THIRD-PARTY COSTS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 48px;">
            <div class="glass-card" style="padding: 24px; border-radius: 18px;">
                <h4 style="color: #fff; margin-bottom: 14px;">⚙️ 5-Step Delivery Lifecycle</h4>
                <ol style="padding-left: 20px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.8;">
                    ${svc.process.map(p => `<li>${p}</li>`).join('')}
                </ol>
            </div>
            <div class="glass-card" style="padding: 24px; border-radius: 18px;">
                <h4 style="color: #fff; margin-bottom: 14px;">🛠️ Technology Stack</h4>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${svc.technologies.map(t => `<span style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); color: #7dd3fc; padding: 6px 12px; border-radius: 8px; font-size: 0.85rem; font-family: var(--font-mono);">${t}</span>`).join('')}
                </div>
                <div style="margin-top: 20px; font-size: 0.85rem; color: #a7adc4;">
                    <strong style="color: #f59e0b;">Third-Party Cost Transparency:</strong> ${svc.thirdPartyCosts}
                </div>
            </div>
            <div class="glass-card" style="padding: 24px; border-radius: 18px;">
                <h4 style="color: #fff; margin-bottom: 14px;">📊 ROI & Value Methodology</h4>
                <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.7;">${svc.roiMethodology}</p>
                <div style="margin-top: 12px; font-size: 0.78rem; color: #64748b;">* Projections are illustrative models based on specified parameters. Actual savings depend on workflow complexity and human review requirements.</div>
            </div>
        </div>

        <!-- FREQUENTLY ASKED QUESTIONS -->
        <div class="glass-card" style="padding: 32px; border-radius: 22px; margin-bottom: 40px;">
            <h3 style="color: #fff; font-size: 1.5rem; margin-bottom: 20px;">Frequently Asked Questions</h3>
            <div style="display: flex; flex-direction: column; gap: 18px;">
                ${svc.faqs.map(f => `
                    <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px;">
                        <div style="color: #fff; font-weight: 700; font-size: 1rem; margin-bottom: 6px;">Q: ${f.q}</div>
                        <div style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">A: ${f.a}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- BOTTOM CONVERSION BANNER -->
        <div style="text-align: center; padding: 40px 20px; border-radius: 24px; background: linear-gradient(145deg, rgba(20,23,42,0.95), rgba(11,13,25,0.98)); border: 1px solid rgba(222, 229, 255, 0.12);">
            <h3 style="color: #fff; font-size: 1.8rem; margin-bottom: 12px;">Ready to deploy ${svc.name}?</h3>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 24px auto;">Contact Lead AI Engineer Adnin Sadat Mahin directly for technical scoping and a fixed-price milestone quote.</p>
            <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
                <a href="https://wa.me/8801629286887?text=Hi%20Adnin,%20let's%20start%20${encodeURIComponent(svc.name)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="background: linear-gradient(135deg, #10b981, #059669); font-weight: 750; padding: 13px 28px;">
                    <span>Direct WhatsApp Chat (+8801629286887)</span>
                </a>
                <a href="../index.html#s3" class="btn btn-glass-sm" style="padding: 13px 24px;">
                    <span>Explore All Services</span>
                </a>
            </div>
        </div>
    </main>

    <!-- INSHA 3D VISUAL WEB COMPONENT ENGINE -->
    <script src="../js/insha-3d-visual.js"></script>
</body>
</html>`;

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Generated: ${svc.slug}.html`);
}
console.log('All 10 commercial service pages generated successfully.');
