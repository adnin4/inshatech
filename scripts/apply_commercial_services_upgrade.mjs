import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'index.html');
const liveIndexPath = path.join(root, 'live_index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Replace Section 3 Header and Lede
const oldHeaderRegex = /<section id="s3" data-diagram-section="s3" class="idg-section" role="region" aria-label="Services Catalogue"[\s\S]*?<!-- REAL-TIME SERVICE DISCOVERY SEARCH BAR -->/;

const newHeader = `<section id="s3" data-diagram-section="s3" class="idg-section" role="region" aria-label="Services Catalogue" style="padding: clamp(80px, 11vh, 130px) 0; position: relative;">
            <div id="services" style="position: absolute; top: 0; left: 0;" aria-hidden="true"></div>
            <div class="idg-demo-wrap container" style="max-width: 1180px; margin: 0 auto; padding: 0 24px;">
                <header class="idg-section-header" data-idg-reveal style="text-align: center; max-width: 860px; margin: 0 auto clamp(36px, 5vh, 56px) auto;">
                    <span class="idg-eyebrow section-tag">02 / Commercial Solutions & Services</span>
                    <h2 class="idg-section-title" style="font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 800; letter-spacing: -0.04em; margin: 16px 0; color: #ffffff;">
                        Production-Grade AI <span class="idg-gradient-text" style="background: linear-gradient(105deg, #ffffff 20%, #cdd0ff 60%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Systems & Solutions.</span>
                    </h2>
                    <p class="idg-section-lede" style="color: #a7adc4; font-size: 1.1rem; line-height: 1.75; margin-bottom: 24px;">
                        We help SaaS companies, digital agencies, and ambitious businesses build, integrate, debug, and maintain production software. Zero vendor lock-in, bounded AI swarms, and 100% full source code ownership.
                    </p>

                    <!-- 3-TIER COMMERCIAL STRATEGY STRIP -->
                    <div class="commercial-strategy-pills" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 0 auto;">
                        <a href="services/saas-bug-fix-rapid-pilot.html" style="text-decoration:none; background: rgba(168, 85, 247, 0.12); border: 1px solid rgba(168, 85, 247, 0.35); padding: 8px 16px; border-radius: 9999px; font-size: 0.85rem; color: #d8b4fe; display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 700;">Phase 1: Cash Flow Pilots</span> ($150–$1,500) • Rapid Turnaround
                        </a>
                        <a href="services/managed-ai-services.html" style="text-decoration:none; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); padding: 8px 16px; border-radius: 9999px; font-size: 0.85rem; color: #6ee7b7; display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 700;">Phase 2: Monthly Retainers</span> ($99–$499/mo) • 24/7 Managed Care
                        </a>
                        <a href="services/vertical-saas-solutions.html" style="text-decoration:none; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.35); padding: 8px 16px; border-radius: 9999px; font-size: 0.85rem; color: #7dd3fc; display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 700;">Phase 3: Vertical SaaS</span> ($950+) • Turnkey Platforms
                        </a>
                        <a href="services/white-label-agency-partner.html" style="text-decoration:none; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); padding: 8px 16px; border-radius: 9999px; font-size: 0.85rem; color: #fcd34d; display: flex; align-items: center; gap: 6px;">
                            <span style="font-weight: 700;">White-Label Partner</span> • Silent Agency Execution Muscle
                        </a>
                    </div>
                </header>

                <!-- REAL-TIME SERVICE DISCOVERY SEARCH BAR -->`;

html = html.replace(oldHeaderRegex, newHeader);

// Replace the 8 Bento Cards grid with updated commercial descriptions & badges
const oldBentoRegex = /<!-- 8 DOMAIN OVERVIEW CARDS WITH PACKAGES -->[\s\S]*?<!-- 80 GRANULAR MICRO-SERVICES PANELS \(Tabbed or Search Filtered\) -->/;

const newBento = `<!-- 8 DOMAIN OVERVIEW CARDS WITH PACKAGES -->
                <div class="cat-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 48px;">
                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🤖</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">AI Agent Engineering</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>Autonomous Agent Workers</li>
                            <li>Multi-Agent Swarm Loops</li>
                            <li>RAG Knowledge Grounding</li>
                            <li>Executive Assistant Agents</li>
                        </ul>
                        <a href="services/ai-agent-development.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="agents" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($199 - $1,499+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">⚡</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Workflow Automation</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>n8n & Make Workflows</li>
                            <li>Human-in-the-Loop Approvals</li>
                            <li>CRM & ERP Synchronization</li>
                            <li>Order & Invoice Automation</li>
                        </ul>
                        <a href="services/ai-business-automation.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="workflow" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($49 - $699+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🌐</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Browser Automation</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>Playwright Pipeline Scrapers</li>
                            <li>Residential Proxy Rotation</li>
                            <li>Competitor Price Watch</li>
                            <li>Lead Scraping & Enrichment</li>
                        </ul>
                        <a href="services/playwright-web-scraping.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="scraping" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($99 - $999+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">💬</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Conversational AI</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>Custom Web AI Chatbots</li>
                            <li>WhatsApp Business AI Bots</li>
                            <li>AI Voice Inbound Receptionist</li>
                            <li>In-Chat Checkout & Orders</li>
                        </ul>
                        <a href="services/hermes-ai-support-agent.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="conv" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($149 - $999+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🔬</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Data & Vision OCR</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>Gemini Vision OCR Extraction</li>
                            <li>Invoice & Contract Auditing</li>
                            <li>Multi-Source ETL Pipelines</li>
                            <li>Executive BI Dashboards</li>
                        </ul>
                        <a href="services/data-engineering-bi.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="vision" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($99 - $799+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🏢</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Vertical SaaS & Dev</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>ISP Billing & Radius OS</li>
                            <li>E-Commerce Logistics Pipelines</li>
                            <li>School & Academy Portals</li>
                            <li>Rapid 24-48hr SaaS Bug Fixing</li>
                        </ul>
                        <a href="services/vertical-saas-solutions.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="software" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($150 - $1,999+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🤝</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">API & Agency Partner</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>OpenAI / Claude / Gemini APIs</li>
                            <li>Webhook Idempotent Middleware</li>
                            <li>White-Label Agency Partner</li>
                            <li>Zero-Risk Scoped Pilots</li>
                        </ul>
                        <a href="services/white-label-agency-partner.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="infra" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Packages ($49 - $1,499+) →</a>
                    </div>

                    <div class="cat-overview-card glowing-border" style="border-radius: 20px; padding: 22px; border: 1px solid rgba(222, 229, 255, 0.1); background: linear-gradient(145deg, rgba(20,23,42,0.85), rgba(11,13,25,0.92));">
                        <div class="cat-card-header" style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                            <div class="cat-card-icon" style="font-size:1.4rem;">🛡️</div>
                            <div class="cat-card-title" style="font-weight:750; color:#fff; font-size:1.1rem;">Managed AI Care</div>
                        </div>
                        <ul class="cat-service-list" style="font-size:0.85rem; color:#a7adc4; line-height:1.8; margin-bottom:16px; padding-left:18px;">
                            <li>24/7 Error Heartbeat Alerts</li>
                            <li>Prompt Drift & Quality Evals</li>
                            <li>Token Cost Budget Tuning</li>
                            <li>Zero-Trust OWASP Security</li>
                        </ul>
                        <a href="services/managed-ai-services.html" class="btn btn-primary-sm btn-full open-pkg-modal-btn" data-cat="managed" style="display:block; text-align:center; text-decoration:none; border-radius:9999px; width:100%; padding:10px; font-weight:700;">View Retainers ($99 - $499/mo) →</a>
                    </div>
                </div>

                <!-- 80 GRANULAR MICRO-SERVICES PANELS (Tabbed or Search Filtered) -->`;

html = html.replace(oldBentoRegex, newBento);

// Update panels 1-8 to ensure all 80 cards reflect commercial focus while keeping exactly 10 cards per panel
const newPanels = `<!-- TAB PANELS (1-8) -->
                    <div id="cat-agents" class="service-panel active" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>🤖</span> AI Agent Development</div><div class="service-item-desc">Custom autonomous agents using Antigravity SDK & LangChain.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🌐</span> Multi-Agent Systems</div><div class="service-item-desc">Orchestrate collaborative agent swarms with state synchronization.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>⚡</span> Autonomous Workflows</div><div class="service-item-desc">Self-executing agentic decision loops with Human-in-the-Loop safeguards.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💼</span> AI Executive Assistant</div><div class="service-item-desc">Automated inbox triage, schedule coordination, and brief generation.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🎧</span> Customer Support Agent</div><div class="service-item-desc">24/7 intelligent tier-1 ticket resolution with CRM auto-update.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📊</span> Sales Intelligence Agent</div><div class="service-item-desc">Automated lead qualification and personalized email sequences.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔍</span> Research & Analyst Agent</div><div class="service-item-desc">Deep market competitor intelligence and automated report generation.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>✍️</span> AI Content Operator</div><div class="service-item-desc">Multi-channel social, blog, and newsletter automated publishing.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💻</span> AI Code Review Agent</div><div class="service-item-desc">Automated PR review, linting, and security vulnerability scanning.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🎯</span> Custom Task Automation</div><div class="service-item-desc">Bespoke agent architecture mapped to your proprietary business logic.</div></div>
                    </div>

                    <div id="cat-workflow" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>⚡</span> n8n Workflow Automation</div><div class="service-item-desc">Self-hosted n8n pipelines orchestrating cross-app business data.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔄</span> Business Process Auto</div><div class="service-item-desc">End-to-end task automation removing manual data entry bottlenecks.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📈</span> CRM Sync & Pipeline</div><div class="service-item-desc">Bidirectional lead syncing between HubSpot, Salesforce, and Sheets.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Human-in-the-Loop Gate</div><div class="service-item-desc">Approval gateways on Slack/WhatsApp before AI performs financial actions.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔗</span> Custom API Connectors</div><div class="service-item-desc">Bridging proprietary databases to third-party SaaS services.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📋</span> Lead Routing & Scoring</div><div class="service-item-desc">Instant lead enrichment and routing to sales reps via Telegram.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔔</span> Omnichannel Alerting</div><div class="service-item-desc">Real-time alerts to Slack, Discord, WhatsApp, and Telegram.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📊</span> Auto Report Generation</div><div class="service-item-desc">Automated weekly KPI summaries rendered to PDF and delivered.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Error Handling & Retry</div><div class="service-item-desc">Idempotent retry mechanisms with automated fallback routing.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📦</span> Inventory Auto-Sync</div><div class="service-item-desc">Multi-channel stock level synchronization for e-commerce.</div></div>
                    </div>

                    <div id="cat-web" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>🌐</span> Playwright Pipeline Scraper</div><div class="service-item-desc">Resilient headless browser data extraction pipelines.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Proxy Mesh Integration</div><div class="service-item-desc">Residential rotating proxies with auto-captcha solving.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📈</span> Price Intelligence Engine</div><div class="service-item-desc">Real-time competitor pricing monitors with discount alerts.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔍</span> Lead Harvesting Pipeline</div><div class="service-item-desc">Extracting verified business directories and social contacts.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📑</span> Content Aggregation Bot</div><div class="service-item-desc">Monitoring news, research papers, and forum feeds on schedule.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📸</span> Visual Screenshot QA</div><div class="service-item-desc">Automated full-page screenshot diffing and regression detection.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🏢</span> Real Estate Scraper</div><div class="service-item-desc">Property listing aggregator with map coordinates & rent pricing.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛒</span> E-Commerce Product Sync</div><div class="service-item-desc">Extracting variants, images, and reviews into structured JSON.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>⏱️</span> Site Uptime & Change Alert</div><div class="service-item-desc">Instant alerts when key elements or pricing change on target sites.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📂</span> Batch Asset Downloader</div><div class="service-item-desc">Automated large-scale image and PDF extraction to Cloud Storage.</div></div>
                    </div>

                    <div id="cat-conv" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>💬</span> Web AI Chatbot</div><div class="service-item-desc">Lightweight embeddable chat widget grounded on your documentation.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📱</span> WhatsApp Business Bot</div><div class="service-item-desc">Automated customer service and order placement via WhatsApp API.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>✈️</span> Telegram Assistant Bot</div><div class="service-item-desc">Interactive command bot with inline keyboards and payment hooks.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💼</span> Slack & Discord AI</div><div class="service-item-desc">Internal team copilot answering policies and searching docs.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📞</span> AI Voice Receptionist</div><div class="service-item-desc">Natural speech phone agents routing callers and taking notes.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📚</span> Multi-Doc RAG Grounding</div><div class="service-item-desc">Pinecone/Chroma vector DB ensuring zero-hallucination answers.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔄</span> Human Handoff Gateway</div><div class="service-item-desc">Seamlessly transfers complex queries to live human agents.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🌍</span> Multilingual Auto-Detect</div><div class="service-item-desc">Auto-translates chats across 95+ languages in real time.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💳</span> In-Chat Checkout Flow</div><div class="service-item-desc">Collect payments and confirm bookings directly inside the chat.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📊</span> Chat Sentiment Analytics</div><div class="service-item-desc">Daily executive summaries of customer mood and top questions.</div></div>
                    </div>

                    <div id="cat-vision" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>🔬</span> Gemini OCR Extraction</div><div class="service-item-desc">Multimodal text extraction from handwritten notes and receipts.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🧾</span> Invoice Line Parser</div><div class="service-item-desc">Structured financial tables extracted directly to accounting DB.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📑</span> PDF Document Analyzer</div><div class="service-item-desc">Semantic chunking and risk summary of 100+ page contracts.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>👔</span> HR Resume Classifier</div><div class="service-item-desc">Extracting skills, experience, and contact data into ATS formats.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🪪</span> ID & Passport OCR</div><div class="service-item-desc">Verification pipeline extracting KYC details from photos.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔄</span> Multi-Source Data ETL</div><div class="service-item-desc">Automated data cleaning and ingestion from Sheets, SQL, and CSV.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📊</span> Executive BI Dashboards</div><div class="service-item-desc">Unified revenue, customer churn, and profit margin visualizations.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔍</span> Document Diff Scanner</div><div class="service-item-desc">Detecting minute clause changes between two PDF revisions.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>✍️</span> Form-Field Auto Fill</div><div class="service-item-desc">Populating legacy enterprise forms from uploaded scans.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Sensitive PII Redactor</div><div class="service-item-desc">Auto-blurring social security numbers and phone numbers on PDFs.</div></div>
                    </div>

                    <div id="cat-software" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>💻</span> AI SaaS MVP Engine</div><div class="service-item-desc">Fast-track turnkey web apps with Stripe auth and AI features.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📡</span> Vertical ISP Billing SaaS</div><div class="service-item-desc">Mikrotik API sync, automated bKash/Nagad billing & radius portal.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📦</span> E-Commerce Logistics OS</div><div class="service-item-desc">Multi-channel order ingestion, courier API dispatch, and return risk.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🎓</span> Academy & School OS</div><div class="service-item-desc">Student fee subscription engine, DRM player, and SMS due alerts.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>⚡</span> Rapid 24-48hr Bug Fix</div><div class="service-item-desc">Fast root-cause triage, surgical code fixes, and 100% refund guarantee.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🎛️</span> Admin Control Panels</div><div class="service-item-desc">Comprehensive CRUD hubs for managing users and models.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛠️</span> Internal Operations Tools</div><div class="service-item-desc">Custom web utilities tailored to your company's daily workflow.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📱</span> Progressive Web Apps</div><div class="service-item-desc">Offline-capable mobile experiences installable on iOS and Android.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔐</span> Multi-Tenant RLS Systems</div><div class="service-item-desc">Isolated PostgreSQL schemas preventing cross-tenant leakage.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>⚡</span> Serverless Edge Workers</div><div class="service-item-desc">Sub-10ms global edge functions running on Cloudflare Workers.</div></div>
                    </div>

                    <div id="cat-infra" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>🔗</span> LLM Provider Gateway</div><div class="service-item-desc">Unified routing between OpenAI, Anthropic, Gemini, and DeepSeek.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🤝</span> Agency White-Label Pod</div><div class="service-item-desc">Silent technical delivery execution partner for digital agencies.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🐳</span> Docker VPS Deployment</div><div class="service-item-desc">Hardened containerized hosting on your dedicated Linux VPS.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Zero-Trust Key Vaulting</div><div class="service-item-desc">Isolated environment secrets and KMS API key encryption.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💾</span> Automated DB Backups</div><div class="service-item-desc">Daily encrypted snapshots synced to Cloudflare R2 / S3.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📈</span> Observability & Logging</div><div class="service-item-desc">Centralized Prometheus and Grafana telemetry dashboards.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔄</span> CI/CD GitHub Workflows</div><div class="service-item-desc">Automated testing and zero-downtime deployment pipelines.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🏎️</span> Latency & Cache Tuning</div><div class="service-item-desc">Edge Redis caching cutting AI inference response times by 70%.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💰</span> Token Cost Guardrails</div><div class="service-item-desc">Automated rate-limiting and model cascade cutting LLM bills by 60%.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🌍</span> Multi-Region Failover</div><div class="service-item-desc">High-availability redundant routing ensuring 99.9% uptime.</div></div>
                    </div>

                    <div id="cat-security" class="service-panel" style="display: none; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
                        <div class="service-item-card"><div class="service-item-title"><span>🔒</span> Bronze Uptime Retainer</div><div class="service-item-desc">24/7 VPS uptime monitoring, weekly DB backups, and monthly fixes ($99/mo).</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔄</span> Silver Systems Care</div><div class="service-item-desc">Continuous workflow improvements, token cost optimization ($249/mo).</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>👑</span> Gold Operations Retainer</div><div class="service-item-desc">Dedicated engineering pod, sub-1hr SLA, direct Slack/WhatsApp ($499/mo).</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📊</span> 24/7 Error Heartbeats</div><div class="service-item-desc">Instant alerts to Lead Engineer phone whenever a workflow fails.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🛡️</span> Prompt Drift & Evals</div><div class="service-item-desc">Automated golden dataset evals catching output regressions.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🔍</span> Prompt Injection Defense</div><div class="service-item-desc">Security sanitization guards preventing adversarial jailbreaks.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>📑</span> GDPR & Privacy Auditing</div><div class="service-item-desc">Data flow certification ensuring no customer leaks to third parties.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>⚡</span> Hotfix SLA Guarantee</div><div class="service-item-desc">Guaranteed sub-4hr resolution time on critical enterprise bugs.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>💾</span> DR Rollback Drills</div><div class="service-item-desc">Routine restoration drills verifying point-in-time database recovery.</div></div>
                        <div class="service-item-card"><div class="service-item-title"><span>🤝</span> Lead Engineer Retainer</div><div class="service-item-desc">Direct 1-on-1 strategy access to Adnin Sadat Mahin on private Slack.</div></div>
                    </div>`;

const oldPanelsRegex = /<!-- TAB PANELS \(1-8\) -->[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/section>)/;
html = html.replace(oldPanelsRegex, newPanels);

// Save index.html
fs.writeFileSync(indexPath, html, 'utf8');

// Copy byte-for-byte to live_index.html
fs.writeFileSync(liveIndexPath, html, 'utf8');

console.log('Successfully updated index.html and live_index.html with 100% byte-for-byte parity.');
