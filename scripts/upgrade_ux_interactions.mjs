import fs from 'fs';
import path from 'path';

const ROOT = 'C:\\Users\\mahin khan\\.gemini\\antigravity\\scratch\\portfolio-showcase';
const uxPath = path.join(ROOT, 'src', 'js', 'ux_interactions.js');
let js = fs.readFileSync(uxPath, 'utf8');

const advancedUxEnhancements = `
    // 8. Chronicle HQ & Linear Dynamic Cursor Spotlight Tracking
    function initSpotlightTracking() {
        const updateSpotlight = (card, e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        };

        document.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.glass-card, .ipc-card, .blueprint-card, .store-card, .tmpl-card, .solution-card, .hero-studio-card');
            if (card) {
                updateSpotlight(card, e);
            }
        }, { passive: true });
    }

    // 9. Interactive Hero Autonomous Workflow Simulator (Apiant & ChainGPT style)
    let simulatedDealRevenue = 850;
    window.simulatePipelineStep = function(stepIdx) {
        const steps = document.querySelectorAll('.pipeline-step-item');
        if (!steps || steps.length === 0) return;

        steps.forEach((s, idx) => {
            if (idx === stepIdx) {
                s.style.boxShadow = '0 0 25px rgba(0, 242, 254, 0.45)';
                s.style.borderColor = '#00f2fe';
                s.style.transform = 'scale(1.02)';
            } else {
                s.style.boxShadow = 'none';
                s.style.borderColor = 'transparent';
                s.style.transform = 'scale(1)';
            }
        });

        const msgs = [
            '⚡ Step 1: Inbound WhatsApp Lead Captured & Validated via Webhook',
            '🤖 Step 2: Gemini 3.0 Vision OCR Extracted Intent & Specifications',
            '🧠 Step 3: 18-Agent Autonomous Swarm Formulated Architecture Proposal',
            '💰 Step 4: Deal Auto-Closed & Synced to PostgreSQL 17 + Cloudflare R2'
        ];

        if (window.showToast) {
            window.showToast(msgs[stepIdx] || 'Pipeline Step Activated', 'info', 2500);
        }

        // Increment live simulated revenue badge if step 4
        if (stepIdx === 3) {
            simulatedDealRevenue += 850;
            const revBadge = document.getElementById('hero-live-deal-metric');
            if (revBadge) {
                revBadge.textContent = '+$' + simulatedDealRevenue.toLocaleString() + ' USD';
                revBadge.style.color = '#10b981';
            }
        }
    };
`;

if (!js.includes('initSpotlightTracking()')) {
    js = js.replace(
        'initLeadMagnetHandler();',
        () => 'initLeadMagnetHandler();\n        initSpotlightTracking();'
    );
    js = js.replace(
        '// Initialize all on DOM ready',
        () => advancedUxEnhancements + '\n    // Initialize all on DOM ready'
    );
    fs.writeFileSync(uxPath, js, 'utf8');
    console.log('✓ src/js/ux_interactions.js enhanced cleanly');
}
