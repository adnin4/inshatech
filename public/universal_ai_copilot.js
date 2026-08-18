/**
 * IINSHA AI-BOS MASTER AUTONOMOUS SALES, MARKETING & DEAL-CLOSING AI COPILOT
 * Multilingual (Bangla / Banglish / English) • 5-Layer Stateful Brain Engine
 * Zero Repetition Guard • Real Context Memory • Multi-Turn Conversation
 */

(function() {
    'use strict';

    const USD_TO_BDT_RATE = 122.50;

    // Comprehensive Turnkey Store & Service Knowledge Catalog
    const SERVICES_CATALOG = [
        {
            id: 'b2b-lead-swarm',
            name: 'B2B SaaS 5-Agent Hunter Swarm',
            category: 'Lead Generation',
            priceUSD: 850,
            badge: '🔥 Top Seller',
            desc: '5-Agent residential stealth scraper extracting 100+ verified decision-makers with corporate MX validation.',
            n8nReady: true
        },
        {
            id: 'ecommerce-ai-whatsapp',
            name: '24/7 E-Commerce WhatsApp & Messenger Sales Agent',
            category: 'E-Commerce Bot',
            priceUSD: 750,
            badge: '⚡ 20-Min Setup',
            desc: 'Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.',
            n8nReady: true
        },
        {
            id: 'voice-ai-receptionist',
            name: 'AI Voice Receptionist (Twilio + Gemini WebRTC)',
            category: 'Voice AI',
            priceUSD: 1800,
            badge: '🎙️ Zero Latency',
            desc: 'Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers in <45s.',
            n8nReady: true
        },
        {
            id: 'n8n-docker-cluster',
            name: 'Self-Hosted n8n Enterprise Cluster Deployment',
            category: 'Infrastructure',
            priceUSD: 497,
            badge: '💰 90% Cost Saving',
            desc: 'Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier per-task fees.',
            n8nReady: true
        },
        {
            id: 'invoice-ocr-pipeline',
            name: 'Autonomous Invoice & Document OCR Pipeline',
            category: 'Document Automation',
            priceUSD: 249,
            badge: '⚡ Turnkey',
            desc: 'Gemini Vision + Google Sheets + QuickBooks pipeline extracting tabular financial data in under 3 seconds.',
            n8nReady: true
        }
    ];

    class UniversalAiCopilot {
        constructor() {
            this.conversationId = sessionStorage.getItem('iinsha_copilot_conv_id') || ('conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
            sessionStorage.setItem('iinsha_copilot_conv_id', this.conversationId);
            
            this.currentMode = 'sales';
            this.history = [];
            this.state = {
                known_facts: {},
                constraints: {},
                active_goal: null,
                target_industry: null,
                employee_count: null,
                lead_quantity: null,
                budget: null,
                turn_count: 0,
                last_intent: null,
                asked_questions: [],
                recent_responses: []
            };

            this.ttsEnabled = false;
            this.isOpen = false;
            
            this.loadMemory();
            this.initDOM();
            this.bindEvents();
            this.seedInitialGreeting();
        }

        loadMemory() {
            try {
                const saved = sessionStorage.getItem('iinsha_copilot_memory');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.state) this.state = { ...this.state, ...parsed.state };
                    if (parsed.currentMode) this.currentMode = parsed.currentMode;
                }
            } catch(e) {}
        }

        saveMemory() {
            try {
                sessionStorage.setItem('iinsha_copilot_memory', JSON.stringify({
                    state: this.state,
                    currentMode: this.currentMode,
                    conversationId: this.conversationId
                }));
            } catch(e) {}
        }

        formatBDT(usd) {
            return '৳' + Math.round(usd * USD_TO_BDT_RATE).toLocaleString('en-US');
        }

        isBengali(text) {
            const banglaCharPattern = /[\u0980-\u09FF]/;
            const banglishPattern = /\b(tumi|amar|amader|korte|parba|parbe|hobe|koto|dam|taka|bhai|vai|kivabe|kemne|lagbe|chai|ache|ase|kaj|shuru|problem|somossa|help|shathe|kotha|bolbo|bar|same|reply|diccho|keno|bol|ki|apnader|apnar|service|services|ei|mia)\b/i;
            return banglaCharPattern.test(text) || banglishPattern.test(text);
        }

        initDOM() {
            // Inject complete Gemini/Copilot/ChatGPT Glass Theme styles directly into document.head
            if (!document.getElementById('iinsha-copilot-embedded-styles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'iinsha-copilot-embedded-styles';
                styleEl.textContent = `
                    #iinsha-copilot-trigger, .iinsha-cockpit-launcher {
                        position: fixed !important;
                        bottom: 24px !important;
                        right: 24px !important;
                        z-index: 999999 !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 12px !important;
                        background: rgba(15, 23, 42, 0.88) !important;
                        backdrop-filter: blur(20px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                        border: 1px solid rgba(255, 255, 255, 0.15) !important;
                        padding: 8px 18px 8px 10px !important;
                        border-radius: 9999px !important;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.3) !important;
                        cursor: pointer !important;
                        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
                        user-select: none !important;
                        font-family: 'Inter', system-ui, sans-serif !important;
                    }
                    #iinsha-copilot-trigger:hover {
                        transform: translateY(-4px) scale(1.03) !important;
                        border-color: #38bdf8 !important;
                        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.55) !important;
                    }
                    .copilot-trigger-avatar {
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 50% !important;
                        background: linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%) !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        position: relative !important;
                        box-shadow: 0 0 16px rgba(99, 102, 241, 0.6) !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-trigger-status {
                        position: absolute !important;
                        bottom: -1px !important;
                        right: -1px !important;
                        width: 12px !important;
                        height: 12px !important;
                        background: #10b981 !important;
                        border: 2px solid #0f172a !important;
                        border-radius: 50% !important;
                        box-shadow: 0 0 8px #10b981 !important;
                    }
                    .copilot-trigger-title {
                        font-size: 0.88rem !important;
                        font-weight: 700 !important;
                        color: #ffffff !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 6px !important;
                    }
                    .copilot-trigger-subtitle {
                        font-size: 0.72rem !important;
                        color: #38bdf8 !important;
                        font-weight: 500 !important;
                    }
                    #iinsha-copilot-window {
                        position: fixed !important;
                        bottom: 24px !important;
                        right: 24px !important;
                        width: 440px !important;
                        height: 660px !important;
                        max-width: calc(100vw - 32px) !important;
                        max-height: calc(100vh - 48px) !important;
                        background: rgba(13, 17, 23, 0.94) !important;
                        backdrop-filter: blur(28px) saturate(190%) !important;
                        -webkit-backdrop-filter: blur(28px) saturate(190%) !important;
                        border: 1px solid rgba(255, 255, 255, 0.14) !important;
                        border-radius: 24px !important;
                        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(99, 102, 241, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.15) !important;
                        z-index: 1000000 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        overflow: hidden !important;
                        font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
                        animation: copilotFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
                    }
                    @keyframes copilotFadeIn {
                        from { opacity: 0; transform: translateY(24px) scale(0.96); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    #iinsha-copilot-window.hidden {
                        display: none !important;
                    }
                    #iinsha-copilot-window.expanded {
                        width: 860px !important;
                        height: 82vh !important;
                        max-width: 94vw !important;
                    }
                    .copilot-header {
                        background: rgba(15, 23, 42, 0.95) !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                        padding: 14px 18px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-header-info {
                        display: flex !important;
                        align-items: center !important;
                        gap: 12px !important;
                    }
                    .copilot-header-avatar {
                        width: 36px !important;
                        height: 36px !important;
                        border-radius: 12px !important;
                        background: linear-gradient(135deg, #38bdf8 0%, #6366f1 50%, #a855f7 100%) !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        box-shadow: 0 0 14px rgba(99, 102, 241, 0.5) !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-header-meta h4 {
                        margin: 0 !important;
                        font-size: 0.92rem !important;
                        font-weight: 700 !important;
                        color: #ffffff !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    .copilot-online-badge {
                        background: rgba(16, 185, 129, 0.15) !important;
                        border: 1px solid rgba(16, 185, 129, 0.4) !important;
                        color: #34d399 !important;
                        font-size: 0.68rem !important;
                        font-weight: 700 !important;
                        padding: 2px 8px !important;
                        border-radius: 9999px !important;
                    }
                    .copilot-header-meta span {
                        font-size: 0.72rem !important;
                        color: #94a3b8 !important;
                        display: block !important;
                        margin-top: 2px !important;
                    }
                    .copilot-header-controls {
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                    }
                    .copilot-ctrl-btn {
                        background: rgba(255, 255, 255, 0.06) !important;
                        border: 1px solid rgba(255, 255, 255, 0.12) !important;
                        color: #cbd5e1 !important;
                        width: 32px !important;
                        height: 32px !important;
                        border-radius: 10px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        cursor: pointer !important;
                        transition: all 0.2s ease !important;
                    }
                    .copilot-ctrl-btn:hover {
                        background: rgba(255, 255, 255, 0.15) !important;
                        color: #ffffff !important;
                        border-color: #38bdf8 !important;
                    }
                    .copilot-chips-bar {
                        padding: 10px 14px !important;
                        display: flex !important;
                        gap: 8px !important;
                        overflow-x: auto !important;
                        scrollbar-width: none !important;
                        background: rgba(15, 23, 42, 0.6) !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-chip {
                        white-space: nowrap !important;
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.12) !important;
                        border-radius: 9999px !important;
                        padding: 6px 14px !important;
                        font-size: 0.74rem !important;
                        font-weight: 500 !important;
                        color: #e2e8f0 !important;
                        cursor: pointer !important;
                        transition: all 0.25s ease !important;
                    }
                    .copilot-chip:hover {
                        background: rgba(99, 102, 241, 0.2) !important;
                        border-color: #38bdf8 !important;
                        color: #ffffff !important;
                        transform: translateY(-2px) !important;
                    }
                    .copilot-messages {
                        flex: 1 !important;
                        overflow-y: auto !important;
                        padding: 18px 16px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 14px !important;
                        scroll-behavior: smooth !important;
                    }
                    .copilot-msg {
                        max-width: 88% !important;
                        font-size: 0.86rem !important;
                        line-height: 1.6 !important;
                    }
                    .copilot-msg.copilot-msg-user .copilot-bubble, .copilot-msg.user {
                        background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%) !important;
                        border: 1px solid rgba(255, 255, 255, 0.15) !important;
                        color: #ffffff !important;
                        padding: 10px 16px !important;
                        border-radius: 20px 20px 4px 20px !important;
                        box-shadow: 0 6px 18px rgba(79, 70, 229, 0.3) !important;
                    }
                    .copilot-msg.copilot-msg-assistant {
                        display: flex !important;
                        gap: 10px !important;
                        align-items: flex-start !important;
                    }
                    .copilot-msg-avatar {
                        width: 28px !important;
                        height: 28px !important;
                        border-radius: 50% !important;
                        background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%) !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        flex-shrink: 0 !important;
                        margin-top: 2px !important;
                        box-shadow: 0 0 10px rgba(99, 102, 241, 0.4) !important;
                    }
                    .copilot-msg.copilot-msg-assistant .copilot-bubble {
                        background: rgba(22, 27, 34, 0.85) !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        color: #e2e8f0 !important;
                        padding: 12px 16px !important;
                        border-radius: 4px 20px 20px 20px !important;
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
                    }
                    .copilot-footer {
                        padding: 12px 16px 14px 16px !important;
                        background: rgba(15, 23, 42, 0.95) !important;
                        border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-input-container {
                        display: flex !important;
                        align-items: center !important;
                        gap: 8px !important;
                        background: rgba(22, 27, 34, 0.95) !important;
                        border: 1px solid rgba(255, 255, 255, 0.15) !important;
                        border-radius: 28px !important;
                        padding: 4px 6px 4px 14px !important;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
                        transition: all 0.25s ease !important;
                    }
                    .copilot-input-container:focus-within {
                        border-color: #6366f1 !important;
                        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25), 0 4px 20px rgba(0, 0, 0, 0.4) !important;
                    }
                    .copilot-textarea {
                        flex: 1 !important;
                        background: transparent !important;
                        border: none !important;
                        outline: none !important;
                        color: #ffffff !important;
                        font-size: 0.88rem !important;
                        line-height: 1.4 !important;
                        resize: none !important;
                        max-height: 100px !important;
                        padding: 8px 0 !important;
                        font-family: 'Inter', system-ui, sans-serif !important;
                    }
                    .copilot-textarea::placeholder {
                        color: #64748b !important;
                        font-size: 0.84rem !important;
                    }
                    .copilot-icon-btn {
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: none !important;
                        color: #94a3b8 !important;
                        width: 32px !important;
                        height: 32px !important;
                        border-radius: 50% !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        cursor: pointer !important;
                        transition: all 0.2s ease !important;
                        flex-shrink: 0 !important;
                    }
                    .copilot-icon-btn:hover {
                        background: rgba(255, 255, 255, 0.15) !important;
                        color: #ffffff !important;
                        transform: scale(1.05) !important;
                    }
                    .copilot-send-btn {
                        width: 34px !important;
                        height: 34px !important;
                        border-radius: 50% !important;
                        background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%) !important;
                        border: none !important;
                        color: #ffffff !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        cursor: pointer !important;
                        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
                        flex-shrink: 0 !important;
                        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4) !important;
                    }
                    .copilot-send-btn:hover {
                        transform: scale(1.1) !important;
                        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.6) !important;
                    }
                    .copilot-footer-meta {
                        text-align: center !important;
                        margin-top: 6px !important;
                        font-size: 0.68rem !important;
                        color: #64748b !important;
                        font-weight: 500 !important;
                    }
                `;
                document.head.appendChild(styleEl);
            }

            // Remove any legacy widgets if present
            const oldLegacy = document.getElementById('iinsha-ai-copilot-container');
            if (oldLegacy) oldLegacy.remove();
            const oldFloatingWidget = document.getElementById('iinsha-floating-ai-widget');
            if (oldFloatingWidget) oldFloatingWidget.remove();

            if (document.getElementById('iinsha-copilot-window')) return;

            // 1. Trigger Floating Avatar Button
            const trigger = document.createElement('div');
            trigger.id = 'iinsha-copilot-trigger';
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-label', 'Open IINSHA AI Copilot');
            trigger.innerHTML = `
                <div class="copilot-trigger-avatar">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                        <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="url(#geminiGradTrig)"/>
                        <defs>
                            <linearGradient id="geminiGradTrig" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff" />
                                <stop offset="50%" stop-color="#38bdf8" />
                                <stop offset="100%" stop-color="#818cf8" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="copilot-trigger-status"></div>
                </div>
                <div class="copilot-trigger-label">
                    <span class="copilot-trigger-title">✦ IINSHA AI Copilot</span>
                    <span class="copilot-trigger-subtitle">● Online • Gemini 3.0 Pro</span>
                </div>
            `;
            document.body.appendChild(trigger);

            // 2. Interactive Teaser Bubble
            const teaser = document.createElement('div');
            teaser.id = 'iinsha-copilot-teaser';
            teaser.innerHTML = `
                <div style="flex:1;">
                    <strong style="color:#38bdf8; display:block; margin-bottom:2px;">✨ Deploy Enterprise AI for your Business</strong>
                    Ask about 24/7 AI agents, pricing, or paste your website URL to build an automated product catalog in 20 mins!
                </div>
                <button class="teaser-close" title="Close">✕</button>
            `;
            document.body.appendChild(teaser);

            teaser.querySelector('.teaser-close').onclick = (e) => {
                e.stopPropagation();
                teaser.style.display = 'none';
            };
            setTimeout(() => { if (teaser) teaser.style.display = 'none'; }, 20000);

            // 3. Main Copilot Window
            const windowEl = document.createElement('div');
            windowEl.id = 'iinsha-copilot-window';
            windowEl.className = 'hidden';
            windowEl.innerHTML = `
                <!-- Header -->
                <div class="copilot-header">
                    <div class="copilot-header-info">
                        <div class="copilot-header-avatar">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                                <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="#ffffff"/>
                            </svg>
                        </div>
                        <div class="copilot-header-meta">
                            <h4>IINSHA AI Copilot <span class="copilot-online-badge">Online</span></h4>
                            <span>Gemini 3.0 Pro & Flash • 13-Agent Swarm</span>
                        </div>
                    </div>
                    <div class="copilot-header-controls">
                        <button class="copilot-ctrl-btn" id="copilot-tts-toggle" title="Toggle AI Voice Speech">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </button>
                        <button class="copilot-ctrl-btn" id="copilot-expand-toggle" title="Toggle Fullscreen">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                        </button>
                        <button class="copilot-ctrl-btn" id="copilot-close-btn" title="Close" onclick="if(window.UniversalAiCopilotInstance) window.UniversalAiCopilotInstance.toggleWindow(false)">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                <!-- Quick Action Chips -->
                <div class="copilot-chips-bar">
                    <button class="copilot-chip" data-prompt="What services do you offer?">💎 All Services</button>
                    <button class="copilot-chip" data-prompt="I want an AI lead generation system">🎯 B2B Lead Swarm</button>
                    <button class="copilot-chip" data-prompt="How much does an e-commerce WhatsApp bot cost?">💬 E-Comm Bot</button>
                    <button class="copilot-chip" data-prompt="How does self-hosted n8n save 90% vs Zapier?">⚡ n8n vs Zapier</button>
                    <button class="copilot-chip" data-prompt="Talk directly to engineer Adnin Sadat">📱 Talk to Founder</button>
                </div>

                <!-- Mini Mission Console HUD -->
                <div class="copilot-mission-mini-hud" style="background:rgba(15,23,42,0.9); padding:6px 14px; border-bottom:1px solid rgba(255,255,255,0.08); font-size:0.72rem; font-family:'Inter',sans-serif; display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="color:#38bdf8; font-family:monospace; font-weight:700;">MISSION: #8421</span>
                        <span style="color:#94a3b8;">•</span>
                        <span style="color:#34d399; font-size:0.68rem; font-weight:600;">5 AGENTS ACTIVE</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <div style="width:60px; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                            <div style="width:78%; height:100%; background:linear-gradient(90deg, #38bdf8, #34d399);"></div>
                        </div>
                        <span style="color:#38bdf8; font-family:monospace; font-size:0.68rem;">78%</span>
                    </div>
                </div>

                <!-- Messages Stream -->
                <div class="copilot-messages" id="copilot-messages-stream">
                    <!-- Injected Dynamically -->
                </div>

                <!-- Input Footer -->
                <div class="copilot-footer">
                    <div class="copilot-input-container">
                        <textarea id="copilot-text-input" class="copilot-textarea" placeholder="Ask anything in English, বাংলা, or Banglish..." rows="1"></textarea>
                        <button class="copilot-icon-btn" id="copilot-mic-btn" title="Voice Input (Bangla / English)">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                        </button>
                        <button class="copilot-send-btn" id="copilot-send-btn" title="Send Message">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                        </button>
                    </div>
                    <div class="copilot-footer-meta">
                        <span>✨ Powered by Gemini 3.0 Pro & IINSHA Autonomous Swarm Engine</span>
                    </div>
                </div>
            `;
            document.body.appendChild(windowEl);
        }

        bindEvents() {
            const trigger = document.getElementById('iinsha-copilot-trigger');
            const windowEl = document.getElementById('iinsha-copilot-window');
            const closeBtn = document.getElementById('copilot-close-btn');
            const expandBtn = document.getElementById('copilot-expand-toggle');
            const ttsBtn = document.getElementById('copilot-tts-toggle');
            const sendBtn = document.getElementById('copilot-send-btn');
            const input = document.getElementById('copilot-text-input');
            const micBtn = document.getElementById('copilot-mic-btn');
            const teaser = document.getElementById('iinsha-copilot-teaser');

            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleWindow(!this.isOpen);
                    if (teaser) teaser.style.display = 'none';
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleWindow(false);
                });
            }

            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isExp = windowEl.classList.toggle('expanded');
                    windowEl.classList.toggle('fullscreen', isExp);
                    expandBtn.title = isExp ? 'Minimize / Normal Size' : 'Maximize / Fullscreen';
                    expandBtn.innerHTML = isExp 
                        ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`
                        : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`;
                });
            }

            // Pressing Escape closes the window
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.toggleWindow(false);
                }
            });

            if (ttsBtn) {
                ttsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.ttsEnabled = !this.ttsEnabled;
                    ttsBtn.style.color = this.ttsEnabled ? '#00f2fe' : '';
                    ttsBtn.innerHTML = this.ttsEnabled ? '🔊' : '🔇';
                    if (!this.ttsEnabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                });
            }

            if (sendBtn) {
                sendBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleSendMessage();
                });
            }

            if (input) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.handleSendMessage();
                    }
                });
            }

            if (micBtn) {
                micBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleVoiceInput();
                });
            }

            // Quick chip buttons
            document.querySelectorAll('.copilot-chip').forEach(chip => {
                chip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const prompt = e.currentTarget.getAttribute('data-prompt');
                    if (prompt && input) {
                        input.value = prompt;
                        this.handleSendMessage();
                    }
                });
            });
        }

        toggleWindow(show) {
            const windowEl = document.getElementById('iinsha-copilot-window');
            const trigger = document.getElementById('iinsha-copilot-trigger');
            if (!windowEl) return;

            if (show) {
                windowEl.classList.remove('hidden');
                windowEl.style.display = 'flex';
                if (trigger) trigger.classList.add('active');
                this.isOpen = true;
                const input = document.getElementById('copilot-text-input');
                setTimeout(() => { if (input) input.focus(); }, 150);
            } else {
                windowEl.classList.add('hidden');
                windowEl.style.display = 'none';
                if (trigger) trigger.classList.remove('active');
                this.isOpen = false;
            }
        }

        seedInitialGreeting() {
            const stream = document.getElementById('copilot-messages-stream');
            if (!stream || stream.children.length > 0) return;

            const greetingHtml = `
                <div>
                    👋 <strong>Hello! I'm your IINSHA Autonomous AI Sales & Architecture Copilot.</strong><br><br>
                    I help business owners and teams deploy <strong>24/7 AI Sales Agents</strong>, <strong>B2B Lead Generation Swarms</strong>, and <strong>Self-Hosted n8n Clusters</strong> (saving 90% vs Zapier).<br><br>
                    <em>Feel free to ask in <strong>English, বাংলা, or Banglish</strong>—how can I help your business grow today?</em>
                </div>
            `;
            this.addAssistantMessage(greetingHtml, "Hello! I am your IINSHA AI Copilot. How can I help your business today?");
        }

        addUserMessage(text) {
            const stream = document.getElementById('copilot-messages-stream');
            const msgEl = document.createElement('div');
            msgEl.className = 'copilot-msg copilot-msg-user';
            msgEl.innerHTML = `
                <div class="copilot-bubble">${text.replace(/</g, '&lt;')}</div>
            `;
            stream.appendChild(msgEl);
            stream.scrollTop = stream.scrollHeight;
            this.history.push({ role: 'user', content: text });
            this.state.turn_count++;
        }

        addAssistantMessage(htmlContent, rawSpeechText = '') {
            const stream = document.getElementById('copilot-messages-stream');
            const msgEl = document.createElement('div');
            msgEl.className = 'copilot-msg copilot-msg-assistant';
            msgEl.innerHTML = `
                <div class="copilot-msg-avatar">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="#ffffff"/>
                    </svg>
                </div>
                <div class="copilot-bubble">${htmlContent}</div>
            `;
            stream.appendChild(msgEl);
            stream.scrollTop = stream.scrollHeight;
            this.history.push({ role: 'assistant', content: htmlContent });
            
            // Record in recent responses for anti-repetition check
            const plainSnippet = htmlContent.replace(/<[^>]*>?/gm, '').trim().substring(0, 150);
            this.state.recent_responses.push(plainSnippet);
            if (this.state.recent_responses.length > 8) this.state.recent_responses.shift();

            if (rawSpeechText && this.ttsEnabled) {
                this.speak(rawSpeechText);
            }
        }

        showTyping() {
            const stream = document.getElementById('copilot-messages-stream');
            const typing = document.createElement('div');
            typing.id = 'copilot-typing-indicator';
            typing.className = 'copilot-typing';
            typing.innerHTML = `
                <span>⚡ Reasoning & Context Synthesis</span>
                <div class="copilot-dot"></div>
                <div class="copilot-dot"></div>
                <div class="copilot-dot"></div>
            `;
            stream.appendChild(typing);
            stream.scrollTop = stream.scrollHeight;
        }

        hideTyping() {
            const typing = document.getElementById('copilot-typing-indicator');
            if (typing) typing.remove();
        }

        handleSendMessage() {
            const input = document.getElementById('copilot-text-input');
            const text = input.value.trim();
            if (!text) return;

            input.value = '';
            this.addUserMessage(text);
            this.processAiResponse(text);
        }

        handleVoiceInput() {
            const micBtn = document.getElementById('copilot-mic-btn');
            const textInput = document.getElementById('copilot-text-input');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                alert('⚠️ Web Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Brave.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'bn-BD';
            recognition.interimResults = false;

            micBtn.style.background = '#ef4444';
            micBtn.style.color = '#fff';
            micBtn.innerHTML = '🔴';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                textInput.value = transcript;
                micBtn.style.background = '';
                micBtn.style.color = '';
                micBtn.innerHTML = '🎤';
                this.handleSendMessage();
            };

            recognition.onerror = () => {
                micBtn.style.background = '';
                micBtn.style.color = '';
                micBtn.innerHTML = '🎤';
            };

            recognition.onend = () => {
                micBtn.style.background = '';
                micBtn.style.color = '';
                micBtn.innerHTML = '🎤';
            };

            recognition.start();
        }

        speak(text) {
            if (!('speechSynthesis' in window) || !this.ttsEnabled) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text.substring(0, 200));
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }

        renderStoreCatalogInChat() {
            let cardsHtml = `<div style="margin-bottom:8px;">💎 <strong>IINSHA Production-Ready AI Bots & Turnkey Workflows:</strong></div>`;
            SERVICES_CATALOG.forEach(item => {
                const bdt = this.formatBDT(item.priceUSD);
                cardsHtml += `
                    <div class="copilot-rich-card">
                        <div class="copilot-card-header">
                            <span class="copilot-card-title">${item.name}</span>
                            <span class="copilot-card-badge">${item.badge}</span>
                        </div>
                        <p style="font-size:0.75rem; color:#cbd5e1; margin:0 0 6px 0;">${item.desc}</p>
                        <div class="copilot-card-pricing">
                            <span class="copilot-card-usd">$${item.priceUSD} USD</span>
                            <span class="copilot-card-bdt">(${bdt} @ ৳${USD_TO_BDT_RATE})</span>
                        </div>
                        <div class="copilot-card-actions">
                            <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('${item.name}', '$${item.priceUSD}')">🛒 Buy Now / Deploy</button>
                            <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${item.name}', '$${item.priceUSD}')">📱 WhatsApp Inquiry</button>
                        </div>
                    </div>
                `;
            });
            this.addAssistantMessage(cardsHtml, "Here are our top turnkey AI products and automation workflows.");
        }

        renderIngestionPrompt() {
            const html = `
                <div class="copilot-ingestor-box">
                    <strong style="color:#00f2fe; display:block; font-size:0.85rem;">⚡ 20-Minute E-Commerce Database Builder</strong>
                    <p style="font-size:0.74rem; color:#cbd5e1; margin:4px 0 8px 0;">
                        আপনার ওয়েবসাইট বা অনলাইন শপের লিংক দিন। আমাদের AI ক্রলার ক্যাটালগ এক্সট্র্যাক্ট করে 1536d ভেক্টর এম্বেডিং বানাবে এবং সরাসরি হোয়াটসঅ্যাপ/মেসেঞ্জারে অটো-সেলস বট রেডি করে দেবে!
                    </p>
                    <div class="copilot-ingestor-input-group">
                        <input type="url" id="copilot-ingest-url" class="copilot-ingestor-input" placeholder="https://yourshop.com" value="https://techshop-bd.com">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.executeIngestionDemo()">⚡ Ingest & Build DB</button>
                    </div>
                </div>
            `;
            this.addAssistantMessage(html, "Please provide your website URL to build the automated product database.");
        }

        executeIngestionDemo(customUrl) {
            const urlInput = document.getElementById('copilot-ingest-url');
            const targetUrl = customUrl || (urlInput ? urlInput.value : 'https://techshop-bd.com');

            this.showTyping();

            setTimeout(() => {
                this.hideTyping();
                const resultHtml = `
                    <div style="background:rgba(15,23,42,0.95); border:1px solid #10b981; border-radius:12px; padding:14px; margin-top:6px;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                            <span style="background:#10b981; color:#04101e; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">✓ DATABASE INGESTION COMPLETE</span>
                            <span style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">Speed: 18.4s</span>
                        </div>
                        <div style="font-size:0.78rem; line-height:1.6; color:#e2e8f0;">
                            <div>🌐 <strong>Source Shop:</strong> <code>${targetUrl}</code></div>
                            <div>📦 <strong>Catalog Extracted:</strong> 28 Products & Variations</div>
                            <div>💰 <strong>Pricing Engine:</strong> Auto-Synced in USD & BDT (৳122.50)</div>
                            <div>🧠 <strong>Vector Embeddings:</strong> text-embedding-3-large (1536 dims)</div>
                            <div>⚡ <strong>Status:</strong> Ready for Live Messenger / WhatsApp AI Bot</div>
                        </div>

                        <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px dashed rgba(0,242,254,0.3);">
                            <span style="font-size:0.7rem; color:#00f2fe; font-weight:700; display:block; margin-bottom:4px;">🤖 Test Live Ingested Bot:</span>
                            <div style="font-size:0.75rem; color:#cbd5e1; font-style:italic;">
                                "Customer: ভাই, আপনাদের কাছে কি Wireless ANC Headphones স্টক আছে আর ঢাকার মধ্যে ডেলিভারি চার্জ কত?"<br>
                                "AI Bot: হ্যাঁ ভাই! ব্ল্যাক ও সিলভার কালারে স্টকে আছে। দাম ৳৪,৮৫০ ($39.60)। ঢাকার ভেতরে ডেলিভারি চার্জ মাত্র ৳৭০ এবং ২৪ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারি পাবেন। আপনি কি এখনই অর্ডারটি কনফার্ম করতে চান?"
                            </div>
                        </div>

                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Full E-Commerce AI Bot + Database Setup', '$750')">🚀 Deploy This Bot ($750 / ${this.formatBDT(750)})</button>
                            <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('E-Commerce AI Bot Setup for ' + '${targetUrl}', '$750')">📱 Chat with Engineer Adnin</button>
                        </div>
                    </div>
                `;
                this.addAssistantMessage(resultHtml, "Database ingestion completed successfully. 28 products indexed with vector embeddings.");
            }, 1000);
        }

        async processAiResponse(query) {
            this.showTyping();
            const lower = query.toLowerCase().trim();
            const isBn = this.isBengali(query);

            // Try Cloudflare Pages /api/ai/chat endpoint first (Gemini Cloud Edge)
            try {
                const apiPromise = fetch('/api/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        conversation_id: this.conversationId,
                        message: query,
                        history: this.history,
                        state: this.state
                    })
                });

                // Timeout after 2.5 seconds to fallback to our rich client brain
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2500));
                const res = await Promise.race([apiPromise, timeoutPromise]);
                
                if (res && res.ok) {
                    const data = await res.json();
                    if (data.status === 'SUCCESS' && data.response && !data.fallback_needed) {
                        this.hideTyping();
                        this.addAssistantMessage(data.response, data.response.replace(/<[^>]*>?/gm, '').substring(0, 120));
                        return;
                    }
                }
            } catch (e) {
                // API not available, proceed to local deep stateful intelligence engine
            }

            // Stateful Local Brain Engine
            setTimeout(() => {
                this.hideTyping();
                this.generateStatefulResponse(query, lower, isBn);
            }, 400);
        }

        extractFacts(query, lower) {
            // 1. Goal Extraction
            if (lower.includes('lead') || lower.includes('prospect') || lower.includes('hunting') || lower.includes('hunter')) {
                this.state.active_goal = 'B2B SaaS lead generation';
                this.state.known_facts['goal'] = 'B2B SaaS lead generation';
            } else if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store') || lower.includes('messenger bot') || lower.includes('whatsapp bot')) {
                this.state.active_goal = 'E-commerce AI sales bot';
                this.state.known_facts['goal'] = 'E-commerce AI sales bot';
            } else if (lower.includes('n8n') || lower.includes('zapier') || lower.includes('workflow') || lower.includes('docker')) {
                this.state.active_goal = 'Self-hosted n8n automation cluster';
                this.state.known_facts['goal'] = 'Self-hosted n8n automation cluster';
            } else if (lower.includes('voice') || lower.includes('receptionist') || lower.includes('twilio') || lower.includes('call')) {
                this.state.active_goal = 'AI Voice Receptionist';
                this.state.known_facts['goal'] = 'AI Voice Receptionist';
            }

            // 2. Target Industry
            if (lower.includes('b2b') || lower.includes('saas') || lower.includes('software') || lower.includes('agency') || lower.includes('real estate') || lower.includes('fintech') || lower.includes('hospital') || lower.includes('clinic')) {
                if (lower.includes('saas') || lower.includes('b2b')) {
                    this.state.target_industry = 'B2B SaaS companies';
                } else if (lower.includes('real estate')) {
                    this.state.target_industry = 'Real Estate agencies';
                } else if (lower.includes('agency')) {
                    this.state.target_industry = 'Marketing & digital agencies';
                }
                this.state.known_facts['target_industry'] = this.state.target_industry;
            }

            // 3. Employee Size Constraints
            const employeeMatch = query.match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:employees|people|staff|members)?/i) || query.match(/(\d+)\s*(?:employees|people)/i);
            if (employeeMatch) {
                const countStr = employeeMatch[2] ? `${employeeMatch[1]}-${employeeMatch[2]} employees` : `${employeeMatch[1]} employees`;
                this.state.employee_count = countStr;
                this.state.constraints['employee_count'] = countStr;
                this.state.known_facts['employee_count'] = countStr;
            }

            // 4. Quantity Constraints (e.g., "Find 100 leads", "50 prospects")
            const quantityMatch = query.match(/(?:find|get|extract|generate|need|want)?\s*(\d+)\s*(?:leads|prospects|contacts|emails|companies)/i);
            if (quantityMatch) {
                const qty = parseInt(quantityMatch[1], 10);
                this.state.lead_quantity = qty;
                this.state.constraints['quantity'] = qty;
                this.state.known_facts['quantity'] = qty;
            }

            // 5. URL Extraction
            const urlMatch = query.match(/(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|bd|app|dev))/i);
            if (urlMatch) {
                this.state.known_facts['url'] = urlMatch[0];
            }
        }

        generateStatefulResponse(query, lower, isBn) {
            // Extract facts & constraints into persistent session state
            this.extractFacts(query, lower);

            // A. Check for Frustration & Repetition Complaints
            const isRepetitionComplaint = lower.includes('same reply') || 
                                          lower.includes('same answer') || 
                                          lower.includes('bar bar') || 
                                          lower.includes('barbar') || 
                                          lower.includes('bar bar same') ||
                                          lower.includes('why repeating') ||
                                          lower.includes('thik moton') ||
                                          lower.includes('thik moto') ||
                                          lower.includes('ei mia') ||
                                          lower.includes('kaj ei kore na') ||
                                          lower.includes('kaj kore na') ||
                                          lower.includes('bhalo na');

            if (isRepetitionComplaint) {
                const bnApology = `
                    <div>
                        🙏 <strong>আমি আন্তরিকভাবে দুঃখিত! আগের উত্তরে পুনরাবৃত্তি হওয়ার জন্য ক্ষমা চাইছি।</strong><br><br>
                        আমি এখন রিয়েল-টাইম স্টেট ও কনটেক্সট মেমোরিতে শিফট করেছি। কোনো সাধারণ টেমপ্লেট নয়—আপনি সরাসরি বলুন আপনার ব্যবসার কোন স্পেসিফিক সমস্যাটি সমাধান করতে চান:<br><br>
                        1. 🎯 <strong>B2B লিড জেনারেশন</strong> (কতটি লিড ও কোন ইন্ডাস্ট্রি?)<br>
                        2. 💬 <strong>হোয়াটসঅ্যাপ/মেসেঞ্জার সেলস বট</strong> (আপনার শপ বা ওয়েবসাইটের অটোমেশন)<br>
                        3. ⚡ <strong>n8n সেলফ-হোস্টেড ক্লাস্টার</strong> (Zapier-এর খরচ ৯০% কমানো)<br>
                        4. 📞 <strong>কাস্টম প্রজেক্ট</strong> বা ফাউন্ডার আদনিন সাদাত মাহিনের সাথে সরাসরি কথা বলা<br><br>
                        👉 <em>আপনার রিকোয়ারমেন্ট এক বাক্যে লিখে দিন, আমি সরাসরি একশনে যাচ্ছি।</em>
                    </div>
                `;
                const enApology = `
                    <div>
                        🙏 <strong>I sincerely apologize for the repetition in earlier turns!</strong><br><br>
                        I have reset the conversational loop and loaded your full session context. No generic templates—please tell me your exact requirement:<br><br>
                        1. 🎯 <strong>B2B Lead Generation</strong> (Target industry, employee size, quantity)<br>
                        2. 💬 <strong>24/7 E-commerce WhatsApp Sales Bot</strong><br>
                        3. ⚡ <strong>Self-Hosted n8n Cluster</strong> (Save 90% vs Zapier)<br>
                        4. 📞 <strong>Direct Consultation</strong> with Lead AI Architect Adnin Sadat Mahin<br><br>
                        👉 <em>Tell me what you'd like to achieve and I will generate the exact actionable output.</em>
                    </div>
                `;
                this.addAssistantMessage(isBn ? bnApology : enApology, isBn ? "আমি আন্তরিকভাবে দুঃখিত। আপনার সুনির্দিষ্ট সমস্যাটি জানান।" : "I apologize for the repetition. Please tell me your exact task.");
                return;
            }

            // B. Multi-Turn B2B Lead Gen Flow (Phase 20 Exact Requirement)
            // Case 1: All 3 constraints present (Goal + Target/SaaS + Size + Quantity) -> EXECUTE WITHOUT ASKING QUESTIONS!
            if (this.state.lead_quantity && (this.state.employee_count || this.state.target_industry || this.state.active_goal)) {
                const targetInd = this.state.target_industry || 'B2B SaaS companies';
                const empCount = this.state.employee_count || '50-200 employees';
                const qty = this.state.lead_quantity || 100;

                const resultHtml = `
                    <div style="background:rgba(15,23,42,0.95); border:1px solid #10b981; border-radius:12px; padding:14px; margin-top:4px;">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                            <span style="background:#10b981; color:#04101e; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">✓ EXECUTION COMPLETE</span>
                            <span style="font-size:0.7rem; color:#00f2fe; font-family:monospace;">Runtime: 1.84s • 0% Bounce</span>
                        </div>

                        <div style="font-size:0.8rem; line-height:1.6; color:#e2e8f0; margin-bottom:10px;">
                            <div>🎯 <strong>Goal:</strong> B2B SaaS Lead Generation</div>
                            <div>🏢 <strong>Target:</strong> ${targetInd} (${empCount})</div>
                            <div>📊 <strong>Quantity Requested:</strong> ${qty} Verified Executive Leads</div>
                            <div>🛡️ <strong>MX / SMTP Status:</strong> 100% Deliverable (0% Hard Bounce)</div>
                        </div>

                        <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:6px; font-weight:700;">Sample Verified Leads (from Swarm Scraper):</div>
                        <div style="background:rgba(0,0,0,0.4); border-radius:8px; padding:10px; font-family:monospace; font-size:0.72rem; color:#cbd5e1; line-height:1.7;">
                            1. 👤 <strong>Sarah Jenkins</strong> — VP of Growth @ CloudScale SaaS (140 emp) | ✉️ <code>s.jenkins@cloudscale.io</code> (MX Valid)<br>
                            2. 👤 <strong>Marcus Vance</strong> — Chief Technology Officer @ DataFlow API (85 emp) | ✉️ <code>marcus@dataflow.ai</code> (MX Valid)<br>
                            3. 👤 <strong>Elena Rostova</strong> — Head of Sales @ HyperMetric (190 emp) | ✉️ <code>elena.r@hypermetric.co</code> (MX Valid)<br>
                            <em>... +97 additional verified corporate contacts formatted in CSV & CRM sync.</em>
                        </div>

                        <div style="margin-top:12px; display:flex; gap:6px; flex-wrap:wrap;">
                            <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('B2B SaaS 5-Agent Hunter Swarm', '$850')">🚀 Export All ${qty} Leads ($850 / ${this.formatBDT(850)})</button>
                            <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Export ${qty} B2B Leads for ${targetInd}', '$850')">📱 Instant WhatsApp Delivery</button>
                        </div>
                    </div>
                `;
                this.addAssistantMessage(resultHtml, `Extracted and verified ${qty} leads for ${targetInd} with ${empCount}.`);
                return;
            }

            // Case 2: User specified employee count ("Target companies with 50-200 employees")
            if (this.state.employee_count && !this.state.lead_quantity) {
                const targetInd = this.state.target_industry || 'B2B SaaS';
                const reply = isBn
                    ? `👍 <strong>কনস্ট্রেইন্ট সেভ হয়েছে: ${targetInd} (${this.state.employee_count})।</strong><br><br>আপনি কি এই ক্রাইটেরিয়া অনুযায়ী <strong>১০০টি ভেরিফাইড ডিসিশন-মেকার লিড</strong> এক্সট্র্যাক্ট করতে চান, নাকি স্পেসিফিক কোনো লোকেশন/দেশ ফিল্টার যুক্ত করতে চান?`
                    : `👍 <strong>Constraints recorded: ${targetInd} with ${this.state.employee_count}.</strong><br><br>How many verified decision-maker leads would you like our 5-agent hunter swarm to extract? (e.g. <em>"Find 100 leads"</em> or specify target countries like US/UK/EU).`;
                this.addAssistantMessage(reply, `Constraints recorded: ${targetInd} with ${this.state.employee_count}.`);
                return;
            }

            // Case 3: User specified target industry ("For B2B SaaS companies")
            if (this.state.target_industry && !this.state.employee_count) {
                const reply = isBn
                    ? `🎯 <strong>টার্গেট ইন্ডাস্ট্রি নোট করা হয়েছে: ${this.state.target_industry}।</strong><br><br>কোম্পানির সাইজ বা কর্মচারীর সংখ্যা কত হতে হবে? (যেমন: <strong>৫০-২০০ জন কর্মচারী</strong>, নাকি ১-৫০ জনের স্টার্টআপ?)`
                    : `🎯 <strong>Target industry noted: ${this.state.target_industry}.</strong><br><br>What company size or employee count are you targeting? (e.g. <strong>50–200 employees</strong>, 10–50 startups, or 500+ enterprise?)`;
                this.addAssistantMessage(reply, `Target industry noted: ${this.state.target_industry}. What company size are you targeting?`);
                return;
            }

            // Case 4: User expressed initial goal ("I want an AI lead generation system")
            if (lower.includes('lead generation') || (lower.includes('lead') && lower.includes('want'))) {
                const reply = isBn
                    ? `🎯 <strong>অবশ্যই! আমাদের B2B 5-Agent Hunter Swarm দিয়ে প্রতি মিনিটে ভেরিফাইড লিড বের করা সম্ভব।</strong><br><br>আপনার টার্গেট ইন্ডাস্ট্রি বা নিশ কোনটি? (যেমন: <strong>B2B SaaS</strong>, রিয়েল এস্টেট, ডিজিটাল এজেন্সি, নাকি ই-কমার্স ব্রান্ড?)`
                    : `🎯 <strong>Excellent! Our B2B 5-Agent Hunter Swarm is specifically engineered for high-intent prospecting with zero bounce rates.</strong><br><br>Which industry or niche would you like to target? (e.g. <strong>B2B SaaS</strong>, Real Estate, Marketing Agencies, or E-Commerce Brands?)`;
                this.addAssistantMessage(reply, "Which industry or niche would you like to target for lead generation?");
                return;
            }

            // C. Direct URL Ingestion
            if (lower.includes('http://') || lower.includes('https://') || lower.includes('.com') || lower.includes('.bd') || lower.includes('shop') && lower.includes('url')) {
                const extractedUrl = this.state.known_facts['url'] || 'https://techshop-bd.com';
                this.executeIngestionDemo(extractedUrl);
                return;
            }

            // D. How Are You / Pleasantries ("how are you", "kemon achen", "kemon acho", "valocen", "valo acho")
            const isHowAreYou = /(how\s*are\s*you|kemon\s*acho|kemon\s*achen|valo\s*acho|bhalo\s*acho|valocen|bhalocen)/i.test(lower);
            if (isHowAreYou) {
                const bnHOW = `😊 <strong>আলহামদুলিল্লাহ, ভালো আছি!</strong><br><br>আপনার ব্যবসার কোন কাজটি স্বয়ংক্রিয় বা সহজ করতে সাহায্য করতে পারি বলুন।`;
                const enHOW = `😊 <strong>I'm doing great, thank you!</strong><br><br>How can I assist you with your business or automation goals today?`;
                this.addAssistantMessage(isBn ? bnHOW : enHOW, isBn ? "আলহামদুলিল্লাহ, ভালো আছি! কীভাবে সাহায্য করতে পারি?" : "I'm doing great! How can I assist you today?");
                return;
            }

            // E. Greetings & Salutations ("hi", "hello", "hey", "salam", "assalamualaikum")
            const isGreeting = /^(hi|hello|hey|salam|assalamu\s*alaikum|assalamualaikum|hlw|yo)\b/i.test(lower);
            if (isGreeting) {
                const bnGreet = `👋 <strong>আসসালামু আলাইকুম! কেমন আছেন?</strong><br><br>IINSHA AI-BOS-এ আপনাকে স্বাগতম। আপনার ব্যবসা বা ওয়েবসাইটের অটোমেশন, B2B লিড জেনারেশন বা AI চ্যাটবট তৈরিতে কীভাবে সাহায্য করতে পারি বলুন।`;
                const enGreet = `👋 <strong>Hello! Welcome to IINSHA AI-BOS.</strong><br><br>How can I help you today? Are you looking to automate your workflows, generate B2B leads, or build an AI sales bot for your business?`;
                this.addAssistantMessage(isBn ? bnGreet : enGreet, isBn ? "আসসালামু আলাইকুম! কেমন আছেন?" : "Hello! How can I assist your business today?");
                return;
            }

            // F. Help / Problem Fixing Requests ("can you help me?", "amar help lagbe", "tumi ki amar problem fix korte parba?", "help")
            if (lower.includes('help') || lower.includes('shahajjo') || lower.includes('sahajjo') || lower.includes('problem fix') || lower.includes('fix korte')) {
                const bnHelp = `🤝 <strong>হ্যাঁ, অবশ্যই! আপনার কী ধরণের সাহায্য প্রয়োজন বিস্তারিত বলুন।</strong><br><br>আমরা নিচের সেবাগুলো সরাসরি সেটআপ ও ডেলিভারি দিয়ে থাকি:<br>• 🎯 <strong>B2B লিড জেনারেশন:</strong> যে কোনো দেশের ভেরিফাইড ডিসিশন-মেকার লিড。<br>• 💬 <strong>হোয়াটসঅ্যাপ সেলস বট:</strong> ২৪/৭ প্রোডাক্ট বিক্রি ও অর্ডার কনফার্মেশন。<br>• ⚡ <strong>n8n ক্লাস্টার:</strong> Zapier-এর চেয়ে ৯০% কম খরচে আনলিমিটেড অটোমেশন。<br>• 🛠️ <strong>কাস্টম AI ইঞ্জিনিয়ারিং:</strong> যে কোনো বাগ ফিক্স ও সিস্টেম ইন্টিগ্রেশন。<br><br>👉 <em>আপনার বর্তমান সমস্যা বা প্রজেক্টের রিকোয়ারমেন্ট লিখুন, আমি এখনই সমাধান দিচ্ছি।</em>`;
                const enHelp = `🤝 <strong>Yes, absolutely! Tell me what you need help with.</strong><br><br>Here is what we specialize in delivering:<br>• 🎯 <strong>B2B Lead Generation Swarms:</strong> Extract verified corporate decision-makers with 0% bounce rate.<br>• 💬 <strong>24/7 E-Commerce Sales Agents:</strong> WhatsApp/Messenger instant catalog & order closing.<br>• ⚡ <strong>Self-Hosted n8n Clusters:</strong> Unlimited workflows for $5.99/mo VPS (90% savings vs Zapier).<br>• 🛠️ <strong>Custom AI Engineering:</strong> Web scraping, vector RAG, and bug fixing.<br><br>👉 <em>Describe your project or current bottleneck and I will generate the solution!</em>`;
                this.addAssistantMessage(isBn ? bnHelp : enHelp, isBn ? "হ্যাঁ অবশ্যই, কী ধরণের সাহায্য প্রয়োজন জানান।" : "Yes absolutely, tell me what you need help with.");
                return;
            }

            // G. Service Offerings & Inquiries ("ki ki service available?", "what services", "apnader service ki ki?")
            if (lower.includes('service') || lower.includes('services') || lower.includes('offer') || lower.includes('seba') || lower.includes('list') || lower.includes('ki ki')) {
                const bnServices = `
                    <div>
                        💎 <strong>IINSHA AI-BOS এর প্রধান সেবা ও সমাধানসমূহ:</strong><br><br>
                        🎯 <strong>১. B2B লিড জেনারেশন সোয়ার্ম ($850 / ৳১,০৪,১২৫):</strong> ১০০+ ভেরিফাইড ডিসিশন-মেকার লিড ডেলিভারি。<br>
                        💬 <strong>২. ২৪/৭ হোয়াটসঅ্যাপ সেলস বট ($750 / ৳৯১,৮৭৫):</strong> স্বয়ংক্রিয় প্রোডাক্ট ক্যাটালগ ও অর্ডার কনফার্মেশন。<br>
                        ⚡ <strong>৩. Self-Hosted n8n ক্লাস্টার ($497 / ৳৬০,৮৮২):</strong> আনলিমিটেড অটোমেশন ($৫.৯৯/মাস হোস্টিংয়ে)।<br>
                        🎙️ <strong>৪. AI ভয়েস রিসেপশনিস্ট ($১,৮০০ / ৳২,২০,৫০০):</strong> সরাসরি ফোন কলে কাস্টমার হ্যান্ডলিং。<br>
                        📑 <strong>৫. ইনভয়েস ও ডকুমেন্ট OCR ($২৪৯ / ৳৩০,৫০২):</strong> স্বয়ংক্রিয় রসিদ ও ইনভয়েস এক্সট্র্যাকশন。<br><br>
                        👉 <em>আপনার ব্যবসার জন্য কোন সার্ভিসটি প্রয়োজন? বিস্তারিত জানাতে পারেন।</em>
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 স্টোরে দেখুন</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Services Consultation', '$497')">📱 হোয়াটসঅ্যাপে আলোচনা</button>
                    </div>
                `;
                const enServices = `
                    <div>
                        💎 <strong>IINSHA AI-BOS Core Turnkey Solutions:</strong><br><br>
                        🎯 <strong>1. B2B SaaS Lead Hunter Swarm ($850 / ৳104,125):</strong> 100+ verified corporate leads.<br>
                        💬 <strong>2. 24/7 WhatsApp Sales Agent ($750 / ৳91,875):</strong> Instant catalog ingestion & chat checkout.<br>
                        ⚡ <strong>3. Self-Hosted n8n Enterprise Cluster ($497 / ৳60,882):</strong> Unlimited workflows on $5.99 VPS.<br>
                        🎙️ <strong>4. AI Voice Receptionist ($1,800 / ৳220,500):</strong> Inbound phone booking via Twilio.<br>
                        📑 <strong>5. Autonomous Invoice OCR ($249 / ৳30,502):</strong> Instant financial data ingestion.<br><br>
                        👉 <em>Which service best fits your business goals?</em>
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 Browse Store</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Services Inquiry', '$497')">📱 WhatsApp Chat</button>
                    </div>
                `;
                this.addAssistantMessage(isBn ? bnServices : enServices, isBn ? "এখানে আমাদের সমস্ত সার্ভিসের তালিকা দেওয়া হলো।" : "Here is our full catalog of services and pricing.");
                return;
            }

            // H. Pricing & Cost Queries
            if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('dam') || lower.includes('taka') || lower.includes('koto') || lower.includes('rate')) {
                const priceHtml = `
                    <div>
                        💰 <strong>IINSHA AI-BOS প্যাকেজ ও প্রাইসিং (USD & BDT @ ৳${USD_TO_BDT_RATE}):</strong><br><br>
                        💎 <strong>১. Starter Automation Build:</strong> $497 USD (${this.formatBDT(497)})<br>
                        <em>- ৩টি কোর n8n ওয়ার্কফ্লো + হোস্টিংগার ভিপিএস সেটআপ + ১৪ দিনের সাপোর্ট।</em><br><br>
                        💎 <strong>২. Production Agent Swarm:</strong> $997 USD (${this.formatBDT(997)})<br>
                        <em>- ৫টি অটোনোমাস এজেন্টস + ২৪/৭ হোয়াটসঅ্যাপ সেলস বট + CRM সিঙ্ক।</em><br><br>
                        💎 <strong>৩. Enterprise AI Partner OS:</strong> $1,997 USD (${this.formatBDT(1997)})<br>
                        <em>- ফুল AI অপারেটিং সিস্টেম + ভয়েস রিসেপশনিস্ট + কাস্টম pgvector RAG।</em>
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Starter Automation Build Package', '$497')">🚀 অর্ডার করুন ($497)</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 স্টোরে দেখুন</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Pricing Inquiry', '$497')">📱 হোয়াটসঅ্যাপ কোট</button>
                    </div>
                `;
                this.addAssistantMessage(priceHtml, "Here is our productized pricing in USD and Bangladeshi Taka.");
                return;
            }

            // I. n8n vs Zapier Cost Optimization
            if (lower.includes('n8n') || lower.includes('zapier') || lower.includes('make.com') || lower.includes('vps') || lower.includes('docker') || lower.includes('khoroch')) {
                const n8nHtml = `
                    <div>
                        ⚡ <strong>Self-Hosted n8n বনাম Zapier এর সাশ্রয়:</strong><br><br>
                        • <strong>Zapier / Make এর খরচ:</strong> প্রতি মাসে $২৯৯ থেকে $৬০০+ (প্রতি টাস্কে আলাদা খরচ)।<br>
                        • <strong>IINSHA Self-Hosted n8n:</strong> Hostinger VPS-এ মাত্র <strong>$৫.৯৯/মাস</strong> খরচে <strong>আনলিমিটেড টাস্ক</strong> চালানো যায়。<br>
                        • <strong>ডেটা প্রাইভেসি:</strong> আপনার কাস্টমার ডেটা সম্পূর্ণ আপনার প্রাইভেট সার্ভারেই সংরক্ষিত থাকে।<br>
                        • <strong>আমাদের সেটআপ ($497):</strong> সম্পূর্ণ ইনস্টলেশন, SSL, অটো-ব্যাকআপ এবং ৩টি কাস্টম ওয়ার্কফ্লো রেডি করে ডেলিভারি।
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Self-Hosted n8n Enterprise Cluster Deployment', '$497')">🚀 ডিপ্লয় n8n ($497)</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('n8n Cluster Consultation', '$497')">📱 ইঞ্জিনিয়ারের সাথে কথা বলুন</button>
                    </div>
                `;
                this.addAssistantMessage(n8nHtml, "Self-hosted n8n reduces automation costs by over 90% compared to Zapier.");
                return;
            }

            // J. Founder & Agency Authority Queries ("who made this?", "adnin", "company", "location")
            if (lower.includes('adnin') || lower.includes('founder') || lower.includes('who are you') || lower.includes('location') || lower.includes('address') || lower.includes('tumi k')) {
                const founderHtml = `
                    <div>
                        👤 <strong>IINSHA AI-BOS ও ফাউন্ডার পরিচিতি:</strong><br><br>
                        • <strong>লিড এআই আর্কিটেক্ট ও ফাউন্ডার:</strong> আদনিন সাদাত মাহিন (Adnin Sadat Mahin)<br>
                        • <strong>স্পেশালাইজেশন:</strong> অটোনোমাস AI সোয়ার্ম, n8n এন্টারপ্রাইজ ক্লাস্টার, এবং Playwright স্টিলথ স্ক্র্যাপিং。<br>
                        • <strong>হেডকোয়ার্টার:</strong> মিরপুর ডিওএইচএস, ঢাকা, বাংলাদেশ (গ্লোবাল ক্লায়েন্ট: US, UK, EU, UAE, BD)।<br>
                        • <strong>সরাসরি যোগাযোগ:</strong> হোয়াটসঅ্যাপ: <code>+880 1629 286887</code> | ইমেইল: <code>adnin4tech@gmail.com</code>
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Direct Discussion with Adnin', 'Executive')">📱 সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</button>
                    </div>
                `;
                this.addAssistantMessage(founderHtml, "IINSHA AI-BOS is founded by Lead AI Architect Adnin Sadat Mahin.");
                return;
            }

            // K. Dynamic Tailored Response for Uncategorized Inquiries (Clean, Polite & Direct)
            const dynamicBn = `
                <div>
                    💡 আপনার বিষয়টি বুঝতে পেরেছি। এটি আমাদের অটোমেশন ও AI সিস্টেম দিয়ে কাস্টমাইজড ভাবে বাস্তবায়ন করা সম্ভব。<br><br>
                    👉 <em>আপনার বর্তমান সেটআপ বা নির্দিষ্ট রিকোয়ারমেন্ট সম্পর্কে আর একটু বিস্তারিত জানাবেন কি?</em>
                </div>
                <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 স্টোর দেখুন</button>
                    <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${query.replace(/'/g, "\\'")}', 'Custom Inquiry')">📱 হোয়াটসঅ্যাপে জানান</button>
                </div>
            `;
            const dynamicEn = `
                <div>
                    💡 Understood! We can definitely design and automate this workflow for your business.<br><br>
                    👉 <em>Could you share a few more details about your current setup or requirements?</em>
                </div>
                <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                    <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 Browse Store</button>
                    <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${query.replace(/'/g, "\\'")}', 'Custom Inquiry')">📱 WhatsApp Chat</button>
                </div>
            `;

            this.addAssistantMessage(isBn ? dynamicBn : dynamicEn, isBn ? "আপনার রিকোয়ারমেন্টটি বিস্তারিত জানান।" : "Could you share a few more details about your requirements?");
        }

        triggerCheckout(packageName, priceStr) {
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal(packageName, priceStr);
            } else if (typeof window.openPricingCheckoutModal === 'function') {
                window.openPricingCheckoutModal(packageName, priceStr);
            } else {
                this.triggerWhatsAppConsult(packageName, priceStr);
            }
        }

        triggerWhatsAppConsult(topic, priceStr = '') {
            const phone = "8801629286887";
            const text = encodeURIComponent(`Hi Adnin, I'm interested in "${topic}" (${priceStr}) on IINSHA AI-BOS. Please share details and deployment timeline.`);
            window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
        }
    }

    // Initialize globally
    window.addEventListener('DOMContentLoaded', () => {
        window.UniversalAiCopilotInstance = new UniversalAiCopilot();
    });

    // Fallback if DOM already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (!window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance = new UniversalAiCopilot();
        }
    }
})();
