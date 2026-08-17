/**
 * IINSHA AI-BOS MASTER AUTONOMOUS SALES, MARKETING & DEAL-CLOSING AI COPILOT
 * Multilingual (Bangla / Banglish / English) • 5-Layer Brain • Interactive Deal Closer
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
            
            this.messages = [];
            this.knownFacts = {};
            this.ttsEnabled = false;
            this.isOpen = false;
            
            this.initDOM();
            this.bindEvents();
            this.seedInitialGreeting();
        }

        formatBDT(usd) {
            return '৳' + Math.round(usd * USD_TO_BDT_RATE).toLocaleString('en-US');
        }

        isBengali(text) {
            const banglaCharPattern = /[\u0980-\u09FF]/;
            const banglishPattern = /\b(tumi|amar|amader|korte|parba|parbe|hobe|koto|dam|taka|bhai|vai|kivabe|kemne|lagbe|chai|ache|ase|kaj|shuru|problem|somossa|help|shathe|kotha|bolbo)\b/i;
            return banglaCharPattern.test(text) || banglishPattern.test(text);
        }

        initDOM() {
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
            trigger.setAttribute('aria-label', 'Open IINSHA AI Sales Copilot');
            trigger.innerHTML = `
                <div class="copilot-trigger-avatar">
                    🤖
                    <div class="copilot-trigger-status"></div>
                </div>
                <div class="copilot-trigger-label">
                    <span class="copilot-trigger-title">Chat with IINSHA AI ⚡</span>
                    <span class="copilot-trigger-subtitle">● Active | Sales & Architecture Agent</span>
                </div>
            `;
            document.body.appendChild(trigger);

            // 2. Interactive Teaser Bubble
            const teaser = document.createElement('div');
            teaser.id = 'iinsha-copilot-teaser';
            teaser.innerHTML = `
                <div style="flex:1;">
                    <strong style="color:#00f2fe; display:block; margin-bottom:2px;">⚡ Need an AI Agent for your Business?</strong>
                    Ask me about automation, pricing, or paste your website URL to build an AI product database in 20 mins!
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
                        <div class="copilot-header-avatar">🤖</div>
                        <div class="copilot-header-meta">
                            <h4>IINSHA Autonomous Copilot <span style="color:#10b981; font-size:0.75rem;">● Online</span></h4>
                            <span>Gemini 3.0 Pro & Flash • Sales, Growth & Closing Swarm</span>
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
                    <button class="copilot-chip" data-action="convince">⚡ How Can You Help My Business?</button>
                    <button class="copilot-chip" data-action="ingest">🛍️ Ingest My Website DB (20m)</button>
                    <button class="copilot-chip" data-action="catalog">💎 View Turnkey Products & Pricing</button>
                    <button class="copilot-chip" data-action="leadgen">🎯 B2B Lead Gen Swarm ($850)</button>
                    <button class="copilot-chip" data-action="whatsapp">📱 WhatsApp with Adnin</button>
                </div>

                <!-- Messages Stream -->
                <div class="copilot-messages" id="copilot-messages-stream"></div>

                <!-- Input Area -->
                <div class="copilot-input-area">
                    <input type="text" class="copilot-input" id="copilot-text-input" placeholder="বাংলা বা ইংরেজিতে আপনার ব্যবসার প্রয়োজন জানান..." autocomplete="off">
                    <button class="copilot-action-btn" id="copilot-mic-btn" title="Speak Voice Requirement">🎤</button>
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
                    if (action === 'convince') {
                        const q = "How can IINSHA AI-BOS solve my business problems, automate sales, and save money?";
                        this.addUserMessage(q);
                        this.processAiResponse(q);
                    } else if (action === 'catalog') {
                        this.renderStoreCatalogInChat();
                    } else if (action === 'ingest') {
                        this.renderIngestionPrompt();
                    } else if (action === 'leadgen') {
                        const q = "Tell me about the B2B SaaS 5-Agent Lead Gen Swarm ($850).";
                        this.addUserMessage(q);
                        this.processAiResponse(q);
                    } else if (action === 'whatsapp') {
                        this.triggerWhatsAppConsult('General Consultation & Custom Business Blueprint', 'Custom Quote');
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
            if (!windowEl) return;
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

        openWindow(query = null) {
            this.toggleWindow(true);
            if (query && typeof query === 'string') {
                this.addUserMessage(query);
                this.processAiResponse(query);
            }
        }

        closeWindow() {
            this.toggleWindow(false);
        }

        seedInitialGreeting() {
            const stream = document.getElementById('copilot-messages-stream');
            if (!stream || stream.children.length > 0) return;

            const greetingHTML = `
                👋 <strong>স্বাগতম! আমি IINSHA AI-BOS এর লিড অটোনোমাস সেলস ও গ্রোথ এজেন্ট।</strong><br><br>
                আমি শুধু সাধারণ চ্যাটবট নই—আপনার ব্যবসার **মার্কেটিং, লিড জেনারেশন, কাস্টমার কনভিন্সিং, ই-কমার্স প্রোডাক্ট ডাটাবেস এবং ডিল ক্লোজিং** স্বয়ংক্রিয়ভাবে পরিচালনা করতে পারি।<br><br>
                💡 **আমি যেভাবে আপনাকে সাহায্য করতে পারি:**<br>
                1. 🛍️ **২০ মিনিটে আপনার শপ/ওয়েবসাইটের জন্য AI Sales Bot** তৈরি করা।<br>
                2. 🎯 **B2B ডিসিশন-মেকার লিড সংগ্রহ** ও কোল্ড আউটরিচ অটোমেশন।<br>
                3. 💰 **Zapier-এর চেয়ে ৯০% কম খরচে** সেলফ-হোস্টেড n8n ক্লাস্টার সেটআপ।<br>
                4. 📱 **১-ক্লিকে ইনস্ট্যান্ট ডিল কনফার্মেশন ও হোয়াটসঅ্যাপ কনসালটেশন**।<br><br>
                <em>আপনার ব্যবসার কোন সমস্যাটি নিয়ে কথা বলতে চান? (যেমন: "tumi ki amar problem fix korte parba?", "pricing koto?", ইত্যাদি)</em>
            `;

            this.addAssistantMessage(greetingHTML, "স্বাগতম! আমি ইনশা এআই বিজনেস অপারেটিং সিস্টেমের লিড সেলস এজেন্ট। কিভাবে সাহায্য করতে পারি?");
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
                <span>⚡ Reasoning & Formulating Custom Solution</span>
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
            recognition.lang = 'bn-BD'; // Support Bangla & fallback to EN
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

        processAiResponse(query) {
            this.showTyping();
            const lower = query.toLowerCase().trim();
            const isBn = this.isBengali(query);

            setTimeout(() => {
                this.hideTyping();

                // 1. Problem Solving & Capability Query ("tumi ki amar problem fix korte parba?", "can you help me?", etc.)
                if (lower.includes('problem') || lower.includes('somossa') || lower.includes('fix') || lower.includes('help') || lower.includes('parba') || lower.includes('parbe') || lower.includes('kaj')) {
                    const replyBn = `
                        <div>
                            🤝 <strong>হ্যাঁ, অবশ্যই! আমি এবং আমাদের AI ইঞ্জিনিয়ার টিম আপনার সমস্যা ১০০% সমাধান করতে প্রস্তুত।</strong><br><br>
                            IINSHA AI-BOS কোনো সাধারণ ডামি চ্যাটবট নয়। আমরা কাস্টম **n8n Self-Hosted Workflows, Gemini 3.0 Pro RAG এবং Multi-Agent Swarms** দিয়ে রিয়েল বিজনেস প্রবলেম সমাধান করি:<br><br>
                            🔹 <strong>১. কাস্টমার সাপোর্ট ও সেলস অটোমেশন:</strong> মেসেঞ্জার বা হোয়াটসঅ্যাপে কাস্টমার নক দিলে AI নিজে প্রোডাক্ট বুঝিয়ে অর্ডার কনফার্ম করে CRM-এ ডাটা পাঠাবে।<br>
                            🔹 <strong>২. B2B লিড জেনারেশন:</strong> আপনার টার্গেট ইন্ডাস্ট্রির ৫০-২০০ কর্মচারীর ভেরিফাইড ডিসিশন-মেকার লিড স্বয়ংক্রিয়ভাবে স্ক্র্যাপ করে কোল্ড ইমেইল পাঠাবে।<br>
                            🔹 <strong>৩. খরচ কমানো (Cost Reduction):</strong> Zapier বা Make-এর মতো প্ল্যাটফর্মে যেখানে প্রতি মাসে $৫০০+ খরচ হয়, আমরা সেলফ-হোস্টেড ডকার ক্লাস্টারে মাত্র <strong>$৫.৯৯/মাস</strong> খরচে আনলিমিটেড অটোমেশন সেটআপ করে দিই।<br>
                            🔹 <strong>৪. টেকনিক্যাল বাগ বা ওয়েবসাইট ফিক্সিং:</strong> ২৪ ঘণ্টার মধ্যে কাস্টম আর্কিটেকচার ব্লুপ্রিন্ট সহ ডেলিভারি।<br><br>
                            👉 <em>আপনার বর্তমান ব্যবসার প্রধান সমস্যাটি কী? জানান, আমি এখনই সমাধান ব্লুপ্রিন্ট ও খরচের হিসাব দিচ্ছি!</em>
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Starter Automation Build Package', '$497')">🚀 Get Started ($497 / ${this.formatBDT(497)})</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Problem Fix & Custom Architecture Discussion', '$497')">📱 Talk Directly with Adnin (+8801629286887)</button>
                            </div>
                        </div>
                    `;

                    const replyEn = `
                        <div>
                            🤝 <strong>Yes, absolutely! We are fully engineered to solve your exact business automation bottlenecks.</strong><br><br>
                            IINSHA AI-BOS is a full autonomous operating system. We replace bloated SaaS fees and manual operational overhead with custom **self-hosted n8n workflows, Gemini 3.0 Pro RAG agents, and Playwright stealth scrapers**:<br><br>
                            1. 🎯 **Automated Sales & E-Commerce Qualifier:** Ingest your store in 20 minutes to handle inbound leads and confirm sales 24/7.<br>
                            2. 📈 **B2B Lead Generation Swarms:** Extract verified executive emails with MX validation in under 45 seconds.<br>
                            3. 💰 **90% Cost Reduction:** Move off Zapier/Make ($500/mo) to Hostinger VPS Docker ($5.99/mo) with zero per-task limits.<br>
                            4. 🛡️ **24-Hour SLA Guarantee:** Direct engineering oversight by Lead AI Architect Adnin Sadat Mahin.<br><br>
                            👉 <em>Tell me about your current bottleneck or select a turnkey solution below:</em>
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Starter Automation Package', '$497')">🚀 Starter Build ($497 / ${this.formatBDT(497)})</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Enterprise Solution Discussion', '$497')">📱 WhatsApp Consultation →</button>
                            </div>
                        </div>
                    `;

                    this.addAssistantMessage(isBn ? replyBn : replyEn, isBn ? "হ্যাঁ, আমরা আপনার ব্যবসার যেকোনো সমস্যা সমাধান করতে প্রস্তুত।" : "Yes, we can solve your business automation requirements.");
                    return;
                }

                // 2. URL Ingestion Query
                if (lower.includes('http://') || lower.includes('https://') || lower.includes('.com') || lower.includes('.bd') || lower.includes('scrape') || lower.includes('catalog') || lower.includes('database')) {
                    this.executeIngestionDemo();
                    return;
                }

                // 3. Pricing & Packages Query
                if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('dam') || lower.includes('taka') || lower.includes('koto') || lower.includes('package')) {
                    const priceHtml = `
                        <div>
                            💰 <strong>IINSHA AI-BOS Productized Pricing & Packages (USD & BDT @ ৳${USD_TO_BDT_RATE}):</strong><br><br>
                            💎 <strong>1. Starter Automation Build:</strong> $497 USD (${this.formatBDT(497)})<br>
                            <em>- 3 Core n8n Workflows + Lead Routing + Hostinger VPS Docker Setup + 14-Day SLA.</em><br><br>
                            💎 <strong>2. Production Agent Swarm:</strong> $997 USD (${this.formatBDT(997)})<br>
                            <em>- 5 Autonomous Agents + 24/7 WhatsApp AI Sales Qualifier + CRM Bi-directional Sync.</em><br><br>
                            💎 <strong>3. Enterprise AI Partner OS:</strong> $1,997 USD (${this.formatBDT(1997)})<br>
                            <em>- Full AI Operating System + Twilio Voice Receptionist + Custom pgvector RAG + Dedicated Engineer.</em><br><br>
                            ⚡ <strong>Turnkey Store Assets:</strong> Start from $29 to $850 with instant deployment!
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 Browse All Products</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('Production Agent Swarm', '$997')">🚀 Order Swarm ($997)</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('Pricing & Custom SoW Inquiry', '$997')">📱 Custom Quote on WhatsApp</button>
                            </div>
                        </div>
                    `;
                    this.addAssistantMessage(priceHtml, "Here is our productized pricing in USD and Bangladeshi Taka.");
                    return;
                }

                // 4. Lead Generation Query
                if (lower.includes('lead') || lower.includes('b2b') || lower.includes('prospect') || lower.includes('hunter')) {
                    const leadHtml = `
                        <div>
                            🎯 <strong>B2B SaaS 5-Agent Lead Gen Swarm ($850 USD / ${this.formatBDT(850)}):</strong><br><br>
                            - **Stealth Scraper Engine:** Playwright residential proxy rotators (99.8% Cloudflare bypass).<br>
                            - **ICP Filtering:** Filter by Employee Count (50-200), Industry, Tech Stack, and Revenue.<br>
                            - **Email Verification:** Zero-bounce rate via real-time MX & SMTP ping validation.<br>
                            - **Cold Outreach:** Personalized AI email sequence generation.<br>
                            - **Delivery:** 100 Verified Leads Delivered in <45 seconds.
                        </div>
                        <div class="copilot-rich-card" style="margin-top:10px;">
                            <div class="copilot-card-actions">
                                <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.triggerCheckout('B2B SaaS 5-Agent Hunter Swarm', '$850')">🛒 Order Lead Swarm ($850)</button>
                                <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('B2B Lead Gen Swarm Order', '$850')">📱 WhatsApp Adnin</button>
                            </div>
                        </div>
                    `;
                    this.addAssistantMessage(leadHtml, "Our B2B Lead Gen Swarm delivers verified leads with zero bounce rate.");
                    return;
                }

                // 5. General Intelligent Sales Pitch & Consultation
                const generalBn = `
                    <div>
                        🤖 <strong>আপনার বার্তার জন্য ধন্যবাদ!</strong> <em>"${query.replace(/</g, '&lt;')}"</em><br><br>
                        IINSHA AI-BOS এর মাধ্যমে আপনি আপনার ব্যবসার সমস্ত ম্যানুয়াল অপারেশন স্বয়ংক্রিয় করতে পারেন। আমাদের ২৫+ অ্যাক্টিভ অটোনোমাস এজেন্ট ক্লাউডে এবং সেলফ-হোস্টেড ডকারে লাইভ কাজ করছে।<br><br>
                        👉 <strong>পরবর্তী পদক্ষেপ বেছে নিন:</strong><br>
                        1. 🛍️ **টার্নকি স্টোর থেকে প্রোডাক্ট বা এআই বট বেছে নিন**<br>
                        2. ⚡ **আপনার ওয়েবসাইটের লিংক দিয়ে ২০ মিনিটে AI ডাটাবেস তৈরি করুন**<br>
                        3. 📱 **ফাউন্ডার ও লিড আর্কিটেক্ট আদনিন সাদাত মাহিনের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলুন**
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 সলিউশন ও প্রাইসিং দেখুন</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.renderIngestionPrompt()">⚡ শপ ডাটাবেস বানান</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${query.replace(/'/g, "\\'")}', 'Inquiry')">📱 হোয়াটসঅ্যাপ কনসালটেশন →</button>
                    </div>
                `;

                const generalEn = `
                    <div>
                        🤖 <strong>Thank you for your message!</strong> <em>"${query.replace(/</g, '&lt;')}"</em><br><br>
                        With IINSHA AI-BOS, you can replace repetitive manual tasks with autonomous AI swarms, custom n8n pipelines, and intelligent WhatsApp/Messenger qualification agents.<br><br>
                        👉 <strong>Recommended Next Actions:</strong><br>
                        1. 🛒 **Browse Turnkey Store Assets & Bots** ($29 - $850)<br>
                        2. ⚡ **Auto-Ingest your Store Database in 20 Minutes**<br>
                        3. 📱 **Direct Consultation with Lead Architect Adnin Sadat Mahin**
                    </div>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="copilot-btn-sm" onclick="window.UniversalAiCopilotInstance.renderStoreCatalogInChat()">🛒 Browse Solutions</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.renderIngestionPrompt()">⚡ Ingest Website DB</button>
                        <button class="copilot-btn-outline-sm" onclick="window.UniversalAiCopilotInstance.triggerWhatsAppConsult('${query.replace(/'/g, "\\'")}', 'Inquiry')">📱 WhatsApp Consultation →</button>
                    </div>
                `;

                this.addAssistantMessage(isBn ? generalBn : generalEn, isBn ? "আমি আপনার ব্যবসার জন্য সর্বোত্তম অটোমেশন সমাধান সাজিয়ে দিচ্ছি।" : "I have analyzed your requirement and provided our best automation options.");
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

    // Expose global initializer & instance
    window.UniversalAiCopilot = UniversalAiCopilot;

    function initCopilot() {
        if (!window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance = new UniversalAiCopilot();
        }
    }

    window.openIinshaChatWindow = function(query) {
        if (!window.UniversalAiCopilotInstance) initCopilot();
        if (window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance.openWindow(query);
        }
    };

    window.toggleIinshaChatWindow = function() {
        if (!window.UniversalAiCopilotInstance) initCopilot();
        if (window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance.toggleWindow();
        }
    };

    window.closeIinshaChatWindow = function() {
        if (window.UniversalAiCopilotInstance) {
            window.UniversalAiCopilotInstance.closeWindow();
        }
    };

    window.openCopilot = window.openIinshaChatWindow;
    window.openAiChat = window.openIinshaChatWindow;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCopilot);
    } else {
        initCopilot();
    }
})();
