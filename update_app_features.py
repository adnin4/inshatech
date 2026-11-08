import re

def update_app_js():
    with open('app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # New modular JS code for Voice Assistant, Build Your AI System, and i18n
    new_features_js = '''
/* ============================================================
   IINSHA TECH OS - VOICE ASSISTANT & VOICE COPILOT ENGINE
   ============================================================ */
function initVoiceAssistant() {
    const chatInput = document.getElementById('floating-chat-input');
    const chatSendBtn = document.getElementById('floating-chat-send-btn');
    if (!chatInput || !chatSendBtn) return;

    // Inject Voice Mic Button next to Send Button if not exists
    if (!document.getElementById('floating-chat-mic-btn')) {
        const micBtn = document.createElement('button');
        micBtn.id = 'floating-chat-mic-btn';
        micBtn.type = 'button';
        micBtn.title = 'Speak your requirement (Voice AI)';
        micBtn.innerHTML = '🎤';
        micBtn.style.cssText = 'background: rgba(99, 102, 241, 0.2); border: 1px solid var(--accent-primary); color: #fff; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 1rem; transition: all 0.2s; margin-left: 6px;';
        
        chatSendBtn.parentNode.insertBefore(micBtn, chatSendBtn.nextSibling);

        micBtn.addEventListener('click', () => {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('⚠️ Voice recognition is not supported in your current browser. Please use Chrome, Edge, or Brave.');
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;

            micBtn.style.background = '#ef4444';
            micBtn.innerHTML = '🔴 Listening...';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
                chatSendBtn.click();
            };

            recognition.onerror = (err) => {
                console.warn('Voice recognition error:', err);
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
            };

            recognition.onend = () => {
                micBtn.style.background = 'rgba(99, 102, 241, 0.2)';
                micBtn.innerHTML = '🎤';
            };

            recognition.start();
        });
    }
}

/* Voice Output Speech Synthesis Helper */
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ''));
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

/* ============================================================
   BUILD YOUR AI SYSTEM - INTERACTIVE 6-STEP WIZARD ENGINE
   ============================================================ */
function initBuildYourAISystemWizard() {
    window.aiBuilderState = {
        industry: 'E-Commerce',
        problem: 'Customer Support Load',
        automation: 'AI Chatbot & RAG',
        model: 'Gemini 3.5 Pro',
        database: 'Supabase PostgreSQL',
        integrations: ['WhatsApp API', 'Stripe Payments']
    };
}

function calculateAIBuilderEstimate() {
    const state = window.aiBuilderState || {};
    let baseCost = 450;
    let baseTimeline = 5;
    let estimatedSavings = 1200;

    if (state.model === 'Claude 3.7 Sonnet') baseCost += 200;
    if (state.model === 'DeepSeek R1 Swarm') baseCost += 350;
    if (state.database === 'Pinecone Vector DB') baseCost += 150;
    
    if (state.integrations && state.integrations.length > 2) {
        baseCost += (state.integrations.length - 2) * 100;
        baseTimeline += 2;
    }

    const roi = Math.round(((estimatedSavings * 12 - baseCost) / baseCost) * 100);

    return {
        costUSD: baseCost,
        timelineDays: baseTimeline,
        monthlySavingsUSD: estimatedSavings,
        annualSavingsUSD: estimatedSavings * 12,
        roiPercent: roi
    };
}

function openBuildAISystemModal() {
    let modal = document.getElementById('build-ai-system-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'build-ai-system-modal';
        modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(2, 6, 23, 0.95); backdrop-filter:blur(16px); z-index:10010; display:flex; align-items:center; justify-content:center; padding:20px;';
        document.body.appendChild(modal);
    }

    const estimate = calculateAIBuilderEstimate();

    modal.innerHTML = `
        <div style="background:#030712; border:1px solid var(--accent-gold); border-radius:16px; width:95%; max-width:850px; padding:30px; color:#fff; box-shadow:0 30px 80px rgba(0,0,0,0.9); position:relative;">
            <button onclick="document.getElementById('build-ai-system-modal').style.display='none'" style="position:absolute; top:16px; right:20px; background:none; border:none; color:#94a3b8; font-size:1.5rem; cursor:pointer;">✕</button>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                <span style="font-size:1.8rem;">🏆</span>
                <div>
                    <h3 style="margin:0; font-size:1.4rem; color:var(--text-main);">Build Your Custom AI System Studio</h3>
                    <span style="font-size:0.8rem; color:var(--accent-gold);">Interactive B2B System Configurator & Proposal Generator</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                <div>
                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">1. Select Industry</label>
                    <select onchange="window.aiBuilderState.industry=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="E-Commerce">E-Commerce / Retail</option>
                        <option value="SaaS & Tech">SaaS & Tech Enterprise</option>
                        <option value="Agency & B2B">Marketing / SMMA Agency</option>
                        <option value="Fintech & Finance">Fintech & Accounting</option>
                    </select>

                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">2. AI Engine Model</label>
                    <select onchange="window.aiBuilderState.model=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="Gemini 3.5 Pro">Google Gemini 3.5 Pro (Recommended)</option>
                        <option value="Claude 3.7 Sonnet">Anthropic Claude 3.7 Sonnet</option>
                        <option value="DeepSeek R1 Swarm">DeepSeek R1 Multi-Agent Swarm</option>
                    </select>

                    <label style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">3. Database & Knowledge Base</label>
                    <select onchange="window.aiBuilderState.database=this.value; renderAIBuilderSummary();" style="width:100%; padding:10px; background:rgba(30,41,59,0.8); border:1px solid var(--border-card); border-radius:8px; color:#fff; margin-bottom:12px;">
                        <option value="Supabase PostgreSQL">Supabase PostgreSQL + pgvector</option>
                        <option value="Cloudflare D1">Cloudflare D1 SQL Serverless</option>
                        <option value="Pinecone Vector DB">Pinecone Enterprise Vector DB</option>
                    </select>
                </div>

                <div style="background:rgba(15,23,42,0.8); border:1px solid var(--border-card); border-radius:12px; padding:20px;" id="ai-builder-summary-card">
                    <!-- Summary populated dynamically -->
                </div>
            </div>

            <div style="margin-top:20px; display:flex; gap:12px; justify-content:flex-end;">
                <button onclick="document.getElementById('build-ai-system-modal').style.display='none'" class="btn btn-glass-sm">Close</button>
                <button onclick="deployConfiguredAISystem()" class="btn btn-primary-sm" style="background:linear-gradient(135deg, var(--accent-gold), #d97706); color:#000; font-weight:800;">🚀 Order Configured AI System & Book Call</button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    renderAIBuilderSummary();
}

function renderAIBuilderSummary() {
    const card = document.getElementById('ai-builder-summary-card');
    if (!card) return;

    const est = calculateAIBuilderEstimate();
    const state = window.aiBuilderState || {};

    card.innerHTML = `
        <span class="badge-gold" style="font-size:0.75rem; padding:4px 10px; background:rgba(245,158,11,0.15); color:var(--accent-gold); border:1px solid var(--accent-gold);">Architecture Blueprint</span>
        <h4 style="color:#fff; margin:10px 0 6px; font-size:1.1rem;">${state.industry} AI System</h4>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">Engineered with ${state.model} & ${state.database}</p>

        <div style="background:rgba(0,0,0,0.5); padding:12px; border-radius:8px; margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span style="color:var(--text-muted);">Estimated Build Cost:</span>
                <strong style="color:var(--accent-gold);">$${est.costUSD} USD</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:6px;">
                <span style="color:var(--text-muted);">Delivery Timeline:</span>
                <strong style="color:var(--accent-cyan);">${est.timelineDays} Days</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                <span style="color:var(--text-muted);">Projected 1-Yr Savings:</span>
                <strong style="color:var(--accent-emerald);">$${est.annualSavingsUSD.toLocaleString()} USD (${est.roiPercent}% ROI)</strong>
            </div>
        </div>
    `;
}

function deployConfiguredAISystem() {
    const est = calculateAIBuilderEstimate();
    const state = window.aiBuilderState || {};
    const msg = `Hi Adnan! I built a custom AI System on IINSHA website:%0A- Industry: ${state.industry}%0A- AI Model: ${state.model}%0A- Database: ${state.database}%0A- Est. Price: $${est.costUSD} USD%0A- Est. ROI: ${est.roiPercent}%%0AI want to start this project!`;
    window.open(`https://wa.me/8801629286887?text=${msg}`, '_blank');
}

/* ============================================================
   I18N MULTI-LANGUAGE SWITCHER (EN / BN)
   ============================================================ */
function initI18nLanguageSwitcher() {
    window.currentLang = 'en';

    const translations = {
        bn: {
            heroTag: 'এন্টারপ্রাইজ এআই ও ওয়েব স্ক্র্যাপিং স্টুডিও',
            heroTitle: 'এআই এজেন্ট, n8n অটোমেশন ও উচ্চমানের ওয়েব স্ক্র্যাপিং সিস্টেম',
            heroSub: 'আপনার বিজনেসের সময় ও খরচ বাচাতে তৈরি কাস্টম এআই সলিউশন।',
            btnBuild: '🏆 কাস্টম এআই সিস্টেম ডিজাইন করুন',
            btnControl: '🎛️ মাস্টার কন্ট্রোল প্যানেল'
        },
        en: {
            heroTag: 'Enterprise AI Agent & Web Scraping Studio',
            heroTitle: 'AI Swarms, n8n Automations & High-Yield Scraping Engines',
            heroSub: 'Engineering autonomous AI workflows, stealth web scrapers, and high-converting B2B automation tools.',
            btnBuild: '🏆 Build Your Custom AI System',
            btnControl: '🎛️ Control Panel (Auth)'
        }
    };

    window.toggleSiteLanguage = function() {
        window.currentLang = window.currentLang === 'en' ? 'bn' : 'en';
        const lang = window.currentLang;
        const dict = translations[lang];

        const btnLang = document.getElementById('site-lang-toggle-btn');
        if (btnLang) btnLang.textContent = lang === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English';

        const tag = document.querySelector('.hero .section-tag');
        if (tag) tag.textContent = dict.heroTag;

        const title = document.querySelector('.hero h1');
        if (title) title.innerHTML = dict.heroTitle;

        const sub = document.querySelector('.hero p');
        if (sub) sub.textContent = dict.heroSub;
    };
}
'''

    if 'initVoiceAssistant()' not in content:
        content += '\n' + new_features_js + '\n'
        content = content.replace(
            "document.addEventListener('DOMContentLoaded', () => {",
            "document.addEventListener('DOMContentLoaded', () => {\n    initVoiceAssistant();\n    initBuildYourAISystemWizard();\n    initI18nLanguageSwitcher();\n"
        )
        with open('app.js', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Updated app.js successfully!")

update_app_js()
