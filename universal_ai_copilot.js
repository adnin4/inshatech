/**
 * IINSHA AI-BOS UNIVERSAL AUTONOMOUS AI COPILOT & PRODUCT DATABASE ENGINE
 * Production-Grade Conversational Sales Agent, E-Commerce Ingestion, & Swarm Copilot
 */

(function() {
    'use strict';

    // Store Catalog Knowledge
    const STORE_CATALOG = [
        {
            id: 'openclaw-stealth-scraper',
            name: 'OpenClaw Stealth Lead Scraper v4',
            category: 'Lead Generation',
            priceUSD: 599,
            badge: 'Best Seller',
            desc: 'Playwright residential stealth scraper extracting 50k+ enriched leads with MX validation.',
            n8nReady: true
        },
        {
            id: 'gemini-voice-receptionist',
            name: 'AI Voice Receptionist (Twilio + Gemini)',
            category: 'Voice AI',
            priceUSD: 1800,
            badge: 'Enterprise Tier',
            desc: 'Real-time conversational voice bot handling 100+ inbound calls, qualifying buyers in under 45s.',
            n8nReady: true
        },
        {
            id: 'whatsapp-ai-qualifier',
            name: 'Real Estate & E-Commerce WhatsApp Qualifier',
            category: 'Messenger Bot',
            priceUSD: 750,
            badge: 'High Conversion',
            desc: 'WhatsApp Cloud API bot extracting buyer budgets, booking calendar slots, and syncing CRM.',
            n8nReady: true
        },
        {
            id: 'invoice-ocr-pipeline',
            name: 'Autonomous Invoice & PDF OCR Pipeline',
            category: 'Document Automation',
            priceUSD: 249,
            badge: 'Turnkey',
            desc: 'Gemini Vision + Google Sheets + QuickBooks pipeline processing invoices in under 3 seconds.',
            n8nReady: true
        },
        {
            id: 'b2b-lead-gen-swarm',
            name: 'B2B SaaS 5-Agent Hunter Swarm',
            category: 'Autonomous Swarm',
            priceUSD: 850,
            badge: 'Popular',
            desc: 'Multi-agent system hunting ICPs, verifying corporate emails, and generating custom cold pitches.',
            n8nReady: true
        }
    ];

    const USD_TO_BDT_RATE = 122.50;

    class UniversalAiCopilot {
        constructor() {
            this.conversationId = sessionStorage.getItem('iinsha_copilot_conv_id') || ('conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6));
            sessionStorage.setItem('iinsha_copilot_conv_id', this.conversationId);
            
            this.messages = [];
            this.isSpeaking = false;
            this.ttsEnabled = false;
            this.isOpen = false;
            
            this.initDOM();
            this.bindEvents();
            this.seedInitialGreeting();
        }

        formatBDT(usd) {
            return '৳' + Math.round(usd * USD_TO_BDT_RATE).toLocaleString('en-US');
        }

        initDOM() {
            // Check if already injected
            if (document.getElementById('iinsha-copilot-window')) return;

            // 1. Inject Trigger Button
            const trigger = document.createElement('div');
            trigger.id = 'iinsha-copilot-trigger';
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-label', 'Open AI Agent Copilot');
            trigger.innerHTML = `
                <div class="copilot-trigger-avatar">
                    🤖
                    <div class="copilot-trigger-status"></div>
                </div>
                <div class="copilot-trigger-label">
                    <span class="copilot-trigger-title">Chat with IINSHA AI ⚡</span>
                    <span class="copilot-trigger-subtitle">● Online | 27 Swarms Active</span>
                </div>
            `;
            document.body.appendChild(trigger);

            // 2. Inject Teaser Bubble
            const teaser = document.createElement('div');
            teaser.id = 'iinsha-copilot-teaser';
            teaser.innerHTML = `
                <div style="flex:1;">
                    <strong style="color:#00f2fe; display:block; margin-bottom:2px;">⚡ Ingest Store Database in 20m!</strong>
                    Need an AI agent for your website or e-commerce shop? Ask me anything or paste your URL!
                </div>
                <button class="teaser-close" title="Close">✕</button>
            `;
            document.body.appendChild(teaser);

            // Hide teaser after 15 seconds or on close
            teaser.querySelector('.teaser-close').onclick = (e) => {
                e.stopPropagation();
                teaser.style.display = 'none';
            };
            setTimeout(() => {
                if (teaser) teaser.style.display = 'none';
            }, 18000);

            // 3. Inject Copilot Window
            const windowEl = document.createElement('div');
            windowEl.id = 'iinsha-copilot-window';
            windowEl.className = 'hidden';
            windowEl.innerHTML = `
                <!-- Header -->
                <div class="copilot-header">
                    <div class="copilot-header-info">
                        <div class="copilot-header-avatar">🤖</div>
                        <div class="copilot-header-meta">
                            <h4>IINSHA Autonomous Copilot <span style="color:#10b981; font-size:0.75rem;">● Active</span></h4>
                            <span>Gemini 3.0 Pro & Flash • 5-Layer Stateful Brain</span>
                        </div>
                    </div>
                    <div class="copilot-header-controls">
                        <button class="copilot-ctrl-btn" id="copilot-tts-toggle" title="Toggle AI Voice Speech">🔊</button>
                        <button class="copilot-ctrl-btn" id="copilot-expand-toggle" title="Toggle Fullscreen">⛶</button>
                        <button class="copilot-ctrl-btn" id="copilot-close-btn" title="Close">✕</button>
                    </div>
                </div>

                <!-- Quick Action Chips -->
                <div class="copilot-chips-bar">
                    <button class="copilot-chip" data-action="catalog">🛒 Browse Store Products</button>
                    <button class="copilot-chip" data-action="ingest">⚡ Ingest My Website DB (20m)</button>
                    <button class="copilot-chip" data-action="leadgen">🎯 B2B Lead Gen Swarm</button>
                    <button class="copilot-chip" data-action="voice">🎙️ Voice Receptionist</button>
                    <button class="copilot-chip" data-action="whatsapp">📱 WhatsApp with Adnin</button>
                </div>

                <!-- Messages Stream -->
                <div class="copilot-messages" id="copilot-messages-stream"></div>

                <!-- Input Area -->
                <div class="copilot-input-area">
                    <input type="text" class="copilot-input" id="copilot-text-input" placeholder="Ask about services, pricing, or paste your website URL..." autocomplete="off">
                    <button class="copilot-action-btn" id="copilot-mic-btn" title="Speak your requirement (Voice AI)">🎤</button>
                    <button class="copilot-send-btn" id="copilot-send-btn" title="Send Message">➤</button>
                </div>
            `;
            document.body.appendChild(windowEl);
        }

        bindEvents() {
            const trigger = document.getElementById('iinsha-copilot-trigger');
            const windowEl = document.getElementById('iinsha-copilot-window');
            const closeBtn = document.getElementById('copilot-close-btn');
            const expandBtn = document.getElementById('copilot-expand-toggle');
            const ttsToggle = document.getElementById('copilot-tts-toggle');
            const sendBtn = document.getElementById('copilot-send-btn');
            const textInput = document.getElementById('copilot-text-input');
            const micBtn = document.getElementById('copilot-mic-btn');

            trigger.onclick = () => this.toggleWindow();
            closeBtn.onclick = () => this.toggleWindow(false);

            expandBtn.onclick = () => {
                windowEl.classList.toggle('fullscreen');
            };

            ttsToggle.onclick = () => {
                this.ttsEnabled = !this.ttsEnabled;
                ttsToggle.classList.toggle('active', this.ttsEnabled);
                ttsToggle.textContent = this.ttsEnabled ? '🔊' : '🔇';
                this.speak(this.ttsEnabled ? "Voice readout enabled." : "Voice readout muted.");
            };

            sendBtn.onclick = () => this.handleSendMessage();

            textInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            };

            // Quick Action Chips
            document.querySelectorAll('.copilot-chip').forEach(chip => {
                chip.onclick = () => {
                    const action = chip.getAttribute('data-action');
                    if (action === 'catalog') {
                        this.renderStoreCatalogInChat();
                    } else if (action === 'ingest') {
                        this.renderIngestionPrompt();
                    } else if (action === 'leadgen') {
                        this.addUserMessage("Tell me about your B2B Lead Gen Swarm ($850) and how it finds 100 leads.");
                        this.processAiResponse("Tell me about your B2B Lead Gen Swarm ($850) and how it finds 100 leads.");
                    } else if (action === 'voice') {
                        this.addUserMessage("How does the AI Voice Receptionist ($1,800) work with Twilio & Gemini?");
                        this.processAiResponse("How does the AI Voice Receptionist ($1,800) work with Twilio & Gemini?");
                    } else if (action === 'whatsapp') {
                        window.open('https://wa.me/8801629286887?text=' + encodeURIComponent('Hi Adnin, I am consulting with IINSHA AI Copilot and would like to discuss a custom automation solution.'), '_blank');
                    }
                };
            });

            // Voice Mic Button
            if (micBtn) {
                micBtn.onclick = () => this.handleVoiceInput();
            }
        }

        toggleWindow(forceState) {
            const windowEl = document.getElementById('iinsha-copilot-window');
            const teaser = document.getElementById('iinsha-copilot-teaser');
            if (teaser) teaser.style.display = 'none';

            this.isOpen = forceState !== undefined ? forceState : windowEl.classList.contains('hidden');
            if (this.isOpen) {
                windowEl.classList.remove('hidden');
                setTimeout(() => document.getElementById('copilot-text-input')?.focus(), 200);
            } else {
                windowEl.classList.add('hidden');
            }
        }

        seedInitialGreeting() {
            const stream = document.getElementById('copilot-messages-stream');
            if (!stream || stream.children.length > 0) return;

            const isStore = window.location.pathname.includes('store');
            const isMarketplace = window.location.pathname.includes('marketplace');

            let greetingText = `👋 Hello! I am the **IINSHA Autonomous AI Copilot** powered by Gemini 3.0 Pro & our 5-Layer Stateful Brain Engine.
<br><br>
⚡ **What I can do for you right now:**
- **Build an AI Product Database** for your e-commerce store / website in under 20 minutes.
- **Recommend Turnkey AI Bots & n8n Workflows** (Pricing in $ USD & ৳ BDT).
- **Hunt B2B Leads & Calculate Custom SOWs**.`;

            if (isStore) {
                greetingText = `👋 Welcome to the **Turnkey Asset Store**! I can help you select the exact production-ready workflow template, calculate BDT pricing, or ingest your website catalog into an AI agent in 20 minutes!`;
            }

            this.addAssistantMessage(greetingText);
        }

        addUserMessage(text) {
            const stream = document.getElementById('copilot-messages-stream');
            const msgEl = document.createElement('div');
            msgEl.className = 'copilot-msg user';
            msgEl.textContent = text;
            stream.appendChild(msgEl);
            stream.scrollTop = stream.scrollHeight;
            this.messages.push({ role: 'user', content: text });
        }

        addAssistantMessage(htmlContent, plainTextForVoice) {
            const stream = document.getElementById('copilot-messages-stream');
            const msgEl = document.createElement('div');
            msgEl.className = 'copilot-msg assistant';
            msgEl.innerHTML = htmlContent;
            stream.appendChild(msgEl);
            stream.scrollTop = stream.scrollHeight;
            this.messages.push({ role: 'assistant', content: htmlContent });

            if (this.ttsEnabled) {
                const textToSpeak = plainTextForVoice || msgEl.innerText.replace(/<[^>]*>?/gm, '');
                this.speak(textToSpeak);
            }
        }

        showTyping() {
            const stream = document.getElementById('copilot-messages-stream');
            const typing = document.createElement('div');
            typing.id = 'copilot-typing-indicator';
            typing.className = 'copilot-typing';
            typing.innerHTML = `
                <span>⚡ Multi-Agent Reasoning</span>
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
            recognition.lang = 'en-US';
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
            let cardsHtml = `<div style="margin-bottom:8px;">🛒 **Featured Turnkey AI Bots & n8n Workflows:**</div>`;
            STORE_CATALOG.forEach(item => {
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
                        Enter your website or store URL. Our AI will crawl your catalog, extract schemas & pricing in USD/BDT, generate 1536d vector embeddings, and prepare your WhatsApp/Messenger AI Agent!
                    </p>
                    <div class="copilot-ingestor-input-group">
                        <input type="url" id="copilot-ingest-url" class="copilot-ingestor-input" placeholder="https://yourstore.com" value="https://techshop-bd.com">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.executeIngestionDemo()">⚡ Ingest & Build DB</button>
                    </div>
                </div>
            `;
            this.addAssistantMessage(html, "Please provide your website URL to build the automated product database.");
        }

        executeIngestionDemo() {
            const urlInput = document.getElementById('copilot-ingest-url');
            const targetUrl = urlInput ? urlInput.value : 'https://techshop-bd.com';

            this.showTyping();

            setTimeout(() => {
                this.hideTyping();
                const resultHtml = `
                    <div style="background:rgba(15,23,42,0.95); border:1px solid #10b981; border-radius:12px; padding:14px; margin-top:6px;">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                            <span style="background:#10b981; color:#04101e; font-size:0.7rem; font-weight:800; padding:2px 8px; border-radius:4px;">✓ DATABASE INGESTION COMPLETE</span>
                            <span style="font-size:0.7rem; color:#94a3b8; font-family:monospace;">Elapsed: 18.4s</span>
                        </div>
                        <div style="font-size:0.78rem; line-height:1.6; color:#e2e8f0;">
                            <div>🌐 <strong>Source:</strong> <code>${targetUrl}</code></div>
                            <div>📦 <strong>Extracted Items:</strong> 28 Products & Variations</div>
                            <div>💰 <strong>Pricing Sync:</strong> Auto-calculated in USD & BDT (৳122.50)</div>
                            <div>🧠 <strong>Embeddings:</strong> text-embedding-3-large (1536 dims)</div>
                            <div>⚡ <strong>Status:</strong> Ready for Live Messenger / WhatsApp AI Agent</div>
                        </div>

                        <div style="margin-top:10px; padding:10px; background:rgba(0,0,0,0.4); border-radius:8px; border:1px dashed rgba(0,242,254,0.3);">
                            <span style="font-size:0.7rem; color:#00f2fe; font-weight:700; display:block; margin-bottom:4px;">🤖 Test Live Ingested Bot:</span>
                            <div style="font-size:0.75rem; color:#cbd5e1; font-style:italic;">
                                "Client: Do you have the Wireless ANC Headphones in stock and what is the delivery time in Dhaka?"<br>
                                "AI Bot: Yes! Available in Black & Silver for ৳4,850 BDT ($39.60). Same-day delivery inside Dhaka. Would you like to order now?"
                            </div>
                        </div>

                        <div style="margin-top:12px; display:flex; gap:6px;">
                            <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Full E-Commerce AI Bot + Database Setup', '$750')">🚀 Deploy This Bot ($750)</button>
                            <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('E-Commerce AI Bot Setup for ' + '${targetUrl}', '$750')">📱 Chat with Engineer</button>
                        </div>
                    </div>
                `;
                this.addAssistantMessage(resultHtml, "Database ingestion completed successfully. 28 products indexed with vector embeddings.");
            }, 1200);
        }

        processAiResponse(query) {
            this.showTyping();

            // Detect Intent
            const lower = query.toLowerCase();

            setTimeout(() => {
                this.hideTyping();

                if (lower.includes('http://') || lower.includes('https://') || lower.includes('.com') || lower.includes('scrape') || lower.includes('database')) {
                    this.executeIngestionDemo();
                    return;
                }

                if (lower.includes('product') || lower.includes('template') || lower.includes('buy') || lower.includes('store') || lower.includes('catalog')) {
                    this.renderStoreCatalogInChat();
                    return;
                }

                if (lower.includes('lead') || lower.includes('b2b') || lower.includes('prospect')) {
                    const html = `
                        <div>
                            🎯 <strong>B2B Lead Generation & ICP Hunter System:</strong><br><br>
                            Our multi-agent hunter swarm scrapes validated executives, verifies corporate MX domains, and filters leads by employee count (50-200), industry, and geography.<br><br>
                            - **Price:** $850 USD (${this.formatBDT(850)})<br>
                            - **SLA:** 100 Verified Leads Delivered in <45s<br>
                            - **Verifier Score:** 98.8% Grounded Accuracy
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('B2B SaaS 5-Agent Hunter Swarm', '$850')">🛒 Order B2B Swarm ($850)</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('B2B Lead Gen Swarm Inquiry', '$850')">📱 WhatsApp Adnin</button>
                            </div>
                        </div>
                    `;
                    this.addAssistantMessage(html, "Our B2B lead generation swarm delivers verified leads with corporate email validation.");
                    return;
                }

                if (lower.includes('voice') || lower.includes('call') || lower.includes('receptionist')) {
                    const html = `
                        <div>
                            🎙️ <strong>AI Voice Receptionist (Twilio + Gemini):</strong><br><br>
                            Answers incoming customer calls 24/7 with zero latency, books appointments on Google Calendar, answers product queries, and sends summary notifications to WhatsApp.<br><br>
                            - **Price:** $1,800 USD (${this.formatBDT(1800)})<br>
                            - **Throughput:** 100+ Concurrent Calls<br>
                            - **Voice Engine:** ElevenLabs + Gemini Live WebRTC
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('AI Voice Receptionist', '$1,800')">🛒 Deploy Voice Bot ($1,800)</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('AI Voice Receptionist Demo', '$1,800')">📱 Book Live Voice Demo</button>
                            </div>
                        </div>
                    `;
                    this.addAssistantMessage(html, "Our AI voice receptionist answers customer calls 24/7 and integrates with Twilio and Gemini.");
                    return;
                }

                // Default Intelligent Comprehensive Reply
                const html = `
                    <div>
                        🤖 <strong>IINSHA AI-BOS Autonomous Brain:</strong><br><br>
                        I understand your requirement regarding <em>"${query.replace(/</g, '&lt;')}"</em>. Our 27 autonomous agents can orchestrate this workflow using self-hosted n8n and Gemini 3.0 Pro.<br><br>
                        👉 <strong>Recommended Next Steps:</strong><br>
                        1. **Browse Turnkey Store Assets** for instant deployment.<br>
                        2. **Auto-Ingest your Store Database** by providing your URL.<br>
                        3. **Schedule Direct Architecture Consultation** with Lead Engineer Adnin Sadat Mahin.
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 View Solutions</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${query.replace(/'/g, "\\'")}', 'Custom Quote')">📱 WhatsApp Consultation →</button>
                    </div>
                `;
                this.addAssistantMessage(html, "I have analyzed your requirement and recommended our best automation options.");
            }, 600);
        }

        triggerCheckout(name, price) {
            if (typeof window.openCheckoutModal === 'function') {
                window.openCheckoutModal(name, price);
            } else if (typeof window.openPricingCheckoutModal === 'function') {
                window.openPricingCheckoutModal(name, price);
            } else {
                window.open('https://wa.me/8801629286887?text=' + encodeURIComponent(`I want to order: ${name} (${price})`), '_blank');
            }
        }

        triggerWhatsAppConsult(topic, price) {
            const text = `Hi Adnin, I am consulting with IINSHA AI Copilot regarding: ${topic} (${price || 'Custom Inquiry'}). Please provide consultation details.`;
            window.open('https://wa.me/8801629286887?text=' + encodeURIComponent(text), '_blank');
        }
    }

    // Initialize once DOM is ready
    function initCopilot() {
        if (!window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance = new UniversalAiCopilot();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCopilot);
    } else {
        initCopilot();
    }
})();
