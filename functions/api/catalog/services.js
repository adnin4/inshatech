/**
 * Cloudflare Pages Function: /api/catalog/services
 * Canonical Product Catalog & Ecosystem Vision Endpoint
 */

const SERVICES = [
    {
            "id": "computer-vision-systems",
            "slug": "computer-vision-systems",
            "name": "Computer Vision & Visual Intelligence Systems",
            "category": "Vision AI",
            "priceUSD": 1200,
            "priceBDT": 147000,
            "deliveryDays": 7,
            "description": "Production computer vision systems delivering automated defect detection, inventory item counting, KYC document tamper detection, and video event classification via custom visual APIs.",
            "features": [
                    "Visual Defect Detection Proof of Concept / API",
                    "Real-Time Object Detection & Inventory Counting Model",
                    "Document Tampering & Photo Fraud Verification Pipeline",
                    "Lightweight Edge-Ready Model Deployment (ONNX / Docker)",
                    "Interactive Visual Analytics Dashboard"
            ],
            "technologies": [
                    "Python / PyTorch",
                    "YOLOv8 / OpenCV",
                    "ONNX Runtime",
                    "FastAPI",
                    "Docker"
            ],
            "idealFor": [
                    "Manufacturing & Assembly Plants",
                    "Logistics & Warehouse Operations",
                    "Retail & Inventory Checkers",
                    "Security & KYC Compliance Platforms"
            ],
            "packages": [
                    {
                            "name": "Visual Feasibility Sprint & Dataset Proof",
                            "price": 1200,
                            "delivery_days": 7
                    },
                    {
                            "name": "Custom Vision API & Model Deployment",
                            "price": 4500,
                            "delivery_days": 28
                    },
                    {
                            "name": "Vision Model Maintenance & Retraining",
                            "price": 850,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 1200,
                            "delivery_days": 7
                    },
                    {
                            "name": "Standard",
                            "price": 4500,
                            "delivery_days": 28
                    },
                    {
                            "name": "Monthly",
                            "price": 850,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "cloud-finops-reliability",
            "slug": "cloud-finops-reliability",
            "name": "Cloud FinOps, Performance & Reliability Engineering",
            "category": "Cloud & DevOps",
            "priceUSD": 850,
            "priceBDT": 104125,
            "deliveryDays": 5,
            "description": "Systematic cloud infrastructure optimization and Site Reliability Engineering (SRE) service profiling bottlenecks, implementing edge caching, tuning queries, and slashing cloud bills by 30-60%.",
            "features": [
                    "Comprehensive Cloud Cost & Idle Resource Audit",
                    "PostgreSQL Query Profiling & Composite Index Optimization",
                    "Edge Caching & Cloudflare CDN Tuning (cutting origin hits by up to 80%)",
                    "Automated Daily Backup, Disaster Recovery & Rollback Drills",
                    "Centralized Observability, Latency Telemetry & Uptime Heartbeats"
            ],
            "technologies": [
                    "Cloudflare Workers / Pages",
                    "AWS / DigitalOcean / Hetzner VPS",
                    "PostgreSQL 17 / pg_stat_statements",
                    "Docker / NGINX",
                    "Prometheus / Grafana"
            ],
            "idealFor": [
                    "SaaS Startups Spending $500-$10,000/mo on AWS/GCP/Cloudflare",
                    "Companies Experiencing Database Latency Spikes",
                    "Businesses Preparing for Traffic Surges",
                    "Cloud-Hosted High-Scale Operations"
            ],
            "packages": [
                    {
                            "name": "Cloud & DB Performance Audit",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Full FinOps & SRE Optimization",
                            "price": 2900,
                            "delivery_days": 18
                    },
                    {
                            "name": "Managed SRE & Cost Watch",
                            "price": 550,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 2900,
                            "delivery_days": 18
                    },
                    {
                            "name": "Monthly",
                            "price": 550,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "software-qa-release",
            "slug": "software-qa-release",
            "name": "Software QA, Test Automation & Release Engineering",
            "category": "Quality & Reliability",
            "priceUSD": 750,
            "priceBDT": 91875,
            "deliveryDays": 5,
            "description": "Enterprise automated testing suite implementing Playwright end-to-end tests across Chromium, Firefox, WebKit, and Mobile viewports, with automated visual regression and CI/CD gates.",
            "features": [
                    "Multi-Browser Playwright End-to-End Automated Test Suite",
                    "Visual Regression Testing & Full-Page Screenshot Diffing",
                    "API Regression & Adversarial Edge-Case Test Harnesses",
                    "GitHub Actions CI/CD Quality Gates & Release Checklists",
                    "Zero-Downtime Deployment & Automated Rollback Scripts"
            ],
            "technologies": [
                    "Playwright",
                    "Vitest / Jest",
                    "GitHub Actions",
                    "Docker",
                    "Node.js 22"
            ],
            "idealFor": [
                    "SaaS Founders Preparing for Scale",
                    "Digital Agencies Delivering Web Apps",
                    "Engineering Teams Experiencing High Regression Rates",
                    "E-Commerce Checkout & Payment Critical Flows"
            ],
            "packages": [
                    {
                            "name": "Critical Path E2E Test Suite",
                            "price": 750,
                            "delivery_days": 5
                    },
                    {
                            "name": "Full QA Suite & CI/CD Gate Deployment",
                            "price": 2400,
                            "delivery_days": 14
                    },
                    {
                            "name": "Continuous Release QA Care",
                            "price": 650,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 750,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 2400,
                            "delivery_days": 14
                    },
                    {
                            "name": "Monthly",
                            "price": 650,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "enterprise-knowledge-search",
            "slug": "enterprise-knowledge-search",
            "name": "Enterprise Knowledge Search & Workspace Copilots",
            "category": "Enterprise Systems",
            "priceUSD": 850,
            "priceBDT": 104125,
            "deliveryDays": 5,
            "description": "Private, permission-aware internal search engine and workspace copilot connecting Google Drive, Notion, Slack, and company wikis with strict role-based access and source citations.",
            "features": [
                    "Unified Semantic Search Across Drive, Notion, Slack & PDFs",
                    "Permission-Aware Retrieval (users only search documents they have rights to view)",
                    "Citation-Backed Natural Language Copilot with Direct Document Links",
                    "Automated Daily Incremental Sync with Company Cloud Storage",
                    "Slack / Microsoft Teams Internal Bot Integration"
            ],
            "technologies": [
                    "Pinecone / pgvector",
                    "Gemini 1.5 Pro / Claude 3.5 Sonnet",
                    "LangChain / LlamaIndex",
                    "Google Drive API / Notion API",
                    "Slack Bolt Framework"
            ],
            "idealFor": [
                    "Professional Service Firms & Consultancies",
                    "Distributed Remote Companies (20-500 employees)",
                    "Technical Support & Customer Care Organizations",
                    "Legal, Medical & Compliance Teams"
            ],
            "packages": [
                    {
                            "name": "Single-Department Knowledge Copilot",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Enterprise Multi-Source Search System",
                            "price": 3800,
                            "delivery_days": 21
                    },
                    {
                            "name": "Knowledge Maintenance & Re-indexing",
                            "price": 750,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 3800,
                            "delivery_days": 21
                    },
                    {
                            "name": "Monthly",
                            "price": 750,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ai-data-operations",
            "slug": "ai-data-operations",
            "name": "AI Data Operations, Annotation & Evaluation Dataset Studio",
            "category": "Data & AI",
            "priceUSD": 750,
            "priceBDT": 91875,
            "deliveryDays": 5,
            "description": "Turnkey data operations pipeline providing high-accuracy document classification, multi-modal image/text annotation, synthetic dataset generation, and automated LLM benchmark evaluation.",
            "features": [
                    "Custom Labeled & Cleaned JSON/CSV/Parquet Datasets",
                    "Human-in-the-Loop Quality Assurance Annotation Workflows",
                    "Domain-Specific Synthetic Training Data Generation",
                    "Golden Evaluation Datasets for Agent & LLM Benchmarking",
                    "Automated Data Ingestion & Transformation ETL Pipelines"
            ],
            "technologies": [
                    "Python / Pandas / PyArrow",
                    "Label Studio",
                    "Gemini & Claude Data Synthesizers",
                    "PostgreSQL / DuckDB",
                    "HuggingFace Datasets"
            ],
            "idealFor": [
                    "AI & Machine Learning Startups",
                    "Computer Vision Researchers",
                    "Enterprise Data Science Teams",
                    "Domain-Specific SaaS Companies"
            ],
            "packages": [
                    {
                            "name": "Dataset Quality Audit & 500-Item Benchmark",
                            "price": 750,
                            "delivery_days": 5
                    },
                    {
                            "name": "Full Data Pipeline & 5,000+ Annotation Set",
                            "price": 2900,
                            "delivery_days": 21
                    },
                    {
                            "name": "Continuous Data Operations Retainer",
                            "price": 1200,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 750,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 2900,
                            "delivery_days": 21
                    },
                    {
                            "name": "Monthly",
                            "price": 1200,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ai-finance-automation",
            "slug": "ai-finance-automation",
            "name": "AI Finance & Back-Office Operations Automation",
            "category": "Finance Operations",
            "priceUSD": 650,
            "priceBDT": 79625,
            "deliveryDays": 5,
            "description": "Automated accounts payable and receivable pipeline utilizing multimodal Gemini OCR to parse invoices, perform 3-way purchase order matching, and sync to accounting software with human sign-off.",
            "features": [
                    "Multimodal Gemini OCR Invoice & Receipt Extraction Pipeline",
                    "3-Way Purchase Order (PO) to Invoice Matching Engine",
                    "Automated Sync to QuickBooks, Xero, Zoho Books, or PostgreSQL",
                    "Interactive Slack / Email Multi-Tier Expense Approval Workflow",
                    "Daily Bank Transaction Reconciliation & Discrepancy Alerting"
            ],
            "technologies": [
                    "Gemini 1.5 Flash / Pro Vision",
                    "n8n Self-Hosted",
                    "QuickBooks / Xero / Zoho APIs",
                    "PostgreSQL Financial Ledgers",
                    "SendGrid / Slack Alerts"
            ],
            "idealFor": [
                    "Accounting & CPA Firms",
                    "Wholesale & Distribution Companies",
                    "Mid-Sized SMEs & Agencies",
                    "High-Volume E-Commerce Businesses"
            ],
            "packages": [
                    {
                            "name": "Single-Vendor AP Automation Pilot",
                            "price": 650,
                            "delivery_days": 5
                    },
                    {
                            "name": "Full Accounts Payable / Receivable Suite",
                            "price": 2800,
                            "delivery_days": 18
                    },
                    {
                            "name": "Managed Finance Workflow Care",
                            "price": 750,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 650,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 2800,
                            "delivery_days": 18
                    },
                    {
                            "name": "Monthly",
                            "price": 750,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ecommerce-growth-operations",
            "slug": "ecommerce-growth-operations",
            "name": "E-commerce Growth & Marketplace Operations",
            "category": "Commerce Operations",
            "priceUSD": 490,
            "priceBDT": 60025,
            "deliveryDays": 4,
            "description": "Integrated commerce operational suite synchronizing Shopify/WooCommerce with local courier APIs (Steadfast, Pathao, RedX), WhatsApp conversational checkout, and real-time inventory.",
            "features": [
                    "Bi-Directional Shopify / WooCommerce / Marketplace Sync",
                    "Automated Courier API Booking & Return Risk Scoring",
                    "24/7 WhatsApp Conversational Sales & COD Confirmation Bot",
                    "Multi-Channel Real-Time Inventory & Low-Stock Alerts",
                    "Automated Product Catalog Enrichment & AI SEO Descriptions"
            ],
            "technologies": [
                    "Shopify REST / GraphQL API",
                    "WooCommerce API",
                    "Meta WhatsApp Cloud API",
                    "Steadfast / Pathao / ShipStation APIs",
                    "n8n / Node.js"
            ],
            "idealFor": [
                    "Shopify & WooCommerce Merchants",
                    "Multi-Channel D2C Brands",
                    "E-Commerce Aggregators & Agencies",
                    "F-Commerce Retailers Transitioning to Web"
            ],
            "packages": [
                    {
                            "name": "Store Operations Audit & Courier Integration",
                            "price": 490,
                            "delivery_days": 4
                    },
                    {
                            "name": "Full Multi-Channel Commerce System",
                            "price": 1850,
                            "delivery_days": 14
                    },
                    {
                            "name": "Managed Commerce Care",
                            "price": 650,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 490,
                            "delivery_days": 4
                    },
                    {
                            "name": "Standard",
                            "price": 1850,
                            "delivery_days": 14
                    },
                    {
                            "name": "Monthly",
                            "price": 650,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ai-governance-operations",
            "slug": "ai-governance-operations",
            "name": "AI Agent Governance, Safety & Operations",
            "category": "Governance & Security",
            "priceUSD": 950,
            "priceBDT": 116375,
            "deliveryDays": 5,
            "description": "Zero-trust governance framework providing tool-level permission matrixes, Slack/WhatsApp human-in-the-loop approval gates, prompt injection security testing, and audit trails.",
            "features": [
                    "Agent Tool-Access & Permission Control Matrix",
                    "Human-in-the-Loop Slack/WhatsApp Approval Gateways",
                    "Prompt-Injection & Jailbreak Adversarial Test Suite",
                    "Immutable Cryptographic Audit Trail of All Agent Actions",
                    "Automated Token Budget Circuit Breakers & Failover Routing"
            ],
            "technologies": [
                    "LangSmith / Langfuse",
                    "Python / Node.js",
                    "PostgreSQL Audit Tables",
                    "Slack / Telegram Webhooks",
                    "OpenAI Moderation API"
            ],
            "idealFor": [
                    "AI SaaS Platforms",
                    "Enterprise Automation Teams",
                    "FinTech & HealthTech Operators",
                    "Regulated Business Environments"
            ],
            "packages": [
                    {
                            "name": "AI Risk & Readiness Assessment",
                            "price": 950,
                            "delivery_days": 5
                    },
                    {
                            "name": "Complete Governance System",
                            "price": 3200,
                            "delivery_days": 21
                    },
                    {
                            "name": "Managed Agent Operations & Evals",
                            "price": 950,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 950,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 3200,
                            "delivery_days": 21
                    },
                    {
                            "name": "Monthly",
                            "price": 950,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ai-saas-engineering",
            "slug": "ai-saas-engineering",
            "name": "AI SaaS Product Engineering & MVP Accelerator",
            "category": "SaaS Engineering",
            "priceUSD": 850,
            "priceBDT": 104125,
            "deliveryDays": 5,
            "description": "Full-stack AI SaaS engineering delivering production-ready MVPs with multi-tenant PostgreSQL RLS, Stripe subscription/usage billing, LLM gateway caching, and zero-trust security.",
            "features": [
                    "Production-Ready Next.js / Fastify / Node.js AI SaaS MVP",
                    "Multi-Tenant PostgreSQL Architecture with Row-Level Security (RLS)",
                    "Stripe / LemonSqueezy Subscription & Usage Metering Billing",
                    "Unified LLM Gateway (OpenAI, Anthropic, Gemini, DeepSeek) with Fallbacks",
                    "Modern React / Tailwind Admin Control Panel & User Dashboard"
            ],
            "technologies": [
                    "TypeScript",
                    "Next.js / React 19",
                    "Fastify / Node.js",
                    "PostgreSQL 17 (Supabase)",
                    "Cloudflare Workers / Pages",
                    "Stripe / LemonSqueezy"
            ],
            "idealFor": [
                    "Funded Startup Founders",
                    "Software Agencies Needing Dev Capacity",
                    "B2B Enterprise Spin-outs",
                    "Solo Technical Entrepreneurs"
            ],
            "packages": [
                    {
                            "name": "Technical Blueprint & Architecture Sprint",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Full AI SaaS MVP Build",
                            "price": 5500,
                            "delivery_days": 28
                    },
                    {
                            "name": "Fractional Product Engineering",
                            "price": 2200,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 850,
                            "delivery_days": 5
                    },
                    {
                            "name": "Standard",
                            "price": 5500,
                            "delivery_days": 28
                    },
                    {
                            "name": "Monthly",
                            "price": 2200,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
            "id": "ai-video-studio",
            "slug": "ai-video-studio",
            "name": "AI Video, 3D Animation & Creative Production Studio",
            "category": "Creative Production",
            "priceUSD": 450,
            "priceBDT": 55125,
            "deliveryDays": 4,
            "description": "End-to-end synthetic & procedural video production pipeline leveraging state-of-the-art generative video models, Three.js 3D animation, and automated multilingual localization.",
            "features": [
                    "AI UGC-Style Video Ads (disclosed synthetic)",
                    "Short-Form Social Media Reels & TikToks",
                    "3D Interactive & Rendered Product Commercials",
                    "AI Spokesperson & Multilingual Voice Dubbing",
                    "Multi-Variant Creative Testing Packs (10-15 cuts)"
            ],
            "technologies": [
                    "Three.js",
                    "Runway Gen-3",
                    "ElevenLabs Voice AI",
                    "ComfyUI / Stable Diffusion",
                    "FFmpeg Automation"
            ],
            "idealFor": [
                    "E-commerce Brands",
                    "Marketing & Ad Agencies",
                    "SaaS Companies",
                    "Product Designers"
            ],
            "packages": [
                    {
                            "name": "Creative Pilot",
                            "price": 450,
                            "delivery_days": 4
                    },
                    {
                            "name": "Multi-Variant Ad Pack",
                            "price": 1400,
                            "delivery_days": 10
                    },
                    {
                            "name": "Monthly Creative Engine",
                            "price": 1800,
                            "delivery_days": 30
                    },
                    {
                            "name": "Pilot",
                            "price": 450,
                            "delivery_days": 4
                    },
                    {
                            "name": "Standard",
                            "price": 1400,
                            "delivery_days": 10
                    },
                    {
                            "name": "Monthly",
                            "price": 1800,
                            "delivery_days": 30
                    }
            ],
            "n8nReady": true,
            "published": true
    },
    {
        "id": "b2b-lead-swarm",
        "name": "B2B SaaS 5-Agent Hunter Swarm",
        "category": "Lead Generation",
        "priceUSD": 850,
        "priceBDT": 104125,
        "deliveryDays": 3,
        "description": "5-Agent residential resilient extraction agent extracting 100+ verified decision-makers with corporate MX validation.",
        "features": [
            "5 resilient web extraction Agents",
            "LinkedIn & Apollo Extraction",
            "Corporate MX Email Validation",
            "Auto-Sync to CRM & Google Sheets"
        ],
        "idealFor": [
            "B2B Companies",
            "Agencies",
            "SaaS Founders"
        ],
        "technologies": [
            "n8n",
            "Playwright",
            "Python",
            "Gemini Pro",
            "PostgreSQL"
        ]
    },
    {
        "id": "ecommerce-ai-whatsapp",
        "name": "24/7 E-Commerce WhatsApp & Messenger Sales Agent",
        "category": "E-Commerce Bot",
        "priceUSD": 750,
        "priceBDT": 91875,
        "deliveryDays": 2,
        "description": "Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.",
        "features": [
            "20-Min Website Catalog Ingestion",
            "WhatsApp Cloud API & Messenger",
            "Order Confirmation & COD Handling",
            "Bangla, Banglish & English Voice/Text"
        ],
        "idealFor": [
            "Shopify",
            "WooCommerce",
            "F-Commerce"
        ],
        "technologies": [
            "Gemini 1.5 Flash",
            "n8n",
            "Meta WhatsApp API",
            "Pinecone",
            "Node.js"
        ]
    },
    {
        "id": "voice-ai-receptionist",
        "name": "AI Voice Receptionist (Twilio + Gemini WebRTC)",
        "category": "Voice AI",
        "priceUSD": 1800,
        "priceBDT": 220500,
        "deliveryDays": 5,
        "description": "Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers.",
        "features": [
            "Gemini WebRTC Voice Engine",
            "Twilio & Local SIP Integration",
            "Inbound Screening & Qualification",
            "Real-time SMS & CRM Booking"
        ],
        "idealFor": [
            "Clinics",
            "Law Firms",
            "Real Estate Agencies"
        ],
        "technologies": [
            "Gemini WebRTC",
            "Twilio API",
            "n8n",
            "Python FastAPI",
            "Deepgram STT"
        ]
    },
    {
        "id": "n8n-docker-cluster",
        "name": "Self-Hosted n8n Enterprise Cluster Deployment",
        "category": "Infrastructure",
        "priceUSD": 497,
        "priceBDT": 60882,
        "deliveryDays": 1,
        "description": "Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.",
        "features": [
            "Dockerized n8n Setup",
            "PostgreSQL DB & Auto-Backups",
            "Unlimited Workflows & Tasks",
            "15+ Pre-installed Blueprints"
        ],
        "idealFor": [
            "Businesses spending $100-$1000/mo on Zapier"
        ],
        "technologies": [
            "n8n",
            "Docker",
            "Nginx",
            "PostgreSQL",
            "Ubuntu"
        ]
    },
    {
        "id": "invoice-ocr-pipeline",
        "name": "Autonomous Invoice & Document OCR Pipeline",
        "category": "Document Automation",
        "priceUSD": 249,
        "priceBDT": 30502,
        "deliveryDays": 1,
        "description": "Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.",
        "features": [
            "PDF & Image Invoice Parsing",
            "Gemini Vision Extraction",
            "Google Sheets & QuickBooks Sync",
            "Email Attachment Auto Poller"
        ],
        "idealFor": [
            "Accounting Teams",
            "Distributors",
            "Finance Managers"
        ],
        "technologies": [
            "Gemini Vision",
            "n8n",
            "Google Sheets API",
            "Python"
        ]
    },
    {
        "id": "api-backend-integration",
        "name": "AI Integration & Business Process Automation",
        "category": "System Integration",
        "priceUSD": 450,
        "priceBDT": 55125,
        "deliveryDays": 3,
        "description": "Custom API webhooks, n8n/Make pipelines, CRM/ERP sync (HubSpot, Salesforce, WooCommerce), and Human-in-the-Loop approval workflows.",
        "features": [
            "Bidirectional CRM/ERP Webhook Synchronization",
            "Human-in-the-Loop (HITL) Slack/Email Approval Gateways",
            "Automated Order Processing & Multi-channel Invoicing",
            "RAG Company Policy & Internal Knowledge Grounding",
            "Fail-closed Error Handling & Exponential Retry Queue"
        ],
        "idealFor": [
            "SMEs",
            "E-Commerce Brands",
            "Operations Managers",
            "SaaS Founders"
        ],
        "technologies": [
            "n8n",
            "Node.js",
            "FastAPI",
            "PostgreSQL",
            "Webhooks",
            "Gemini Pro"
        ],
        "packages": [
            {
                "name": "Pilot",
                "price": 250,
                "delivery_days": 2
            },
            {
                "name": "Growth",
                "price": 450,
                "delivery_days": 3
            },
            {
                "name": "Enterprise",
                "price": 1200,
                "delivery_days": 7
            }
        ]
    },
    {
        "id": "managed-ai-maintenance",
        "name": "Managed AI Services & 24/7 System Maintenance Retainer",
        "category": "Managed Care",
        "priceUSD": 249,
        "priceBDT": 30502,
        "deliveryDays": 30,
        "description": "Dedicated monthly care for AI workflows, automation monitoring, API error interception, prompt drift testing, and DB backup verification.",
        "features": [
            "24/7 Automation Health & Error Heartbeat Alerts",
            "LLM Prompt Drift & Output Quality Benchmarking",
            "API Cost Tracking & Token Budget Guardrails",
            "Database Backup & Disaster Recovery Rollback Drills",
            "Sub-4hr Emergency Hotfix SLA & Dedicated Engineer Hours"
        ],
        "idealFor": [
            "Businesses with Live Automations",
            "Agencies",
            "SaaS Founders"
        ],
        "technologies": [
            "Prometheus",
            "Grafana",
            "Docker",
            "PostgreSQL",
            "Cloudflare Workers"
        ],
        "packages": [
            {
                "name": "Bronze Retainer",
                "price": 99,
                "delivery_days": 30
            },
            {
                "name": "Silver Retainer",
                "price": 249,
                "delivery_days": 30
            },
            {
                "name": "Gold Retainer",
                "price": 499,
                "delivery_days": 30
            }
        ]
    },
    {
        "id": "vertical-saas-core",
        "name": "Vertical Industry SaaS Operations Platforms",
        "category": "Vertical SaaS",
        "priceUSD": 1450,
        "priceBDT": 177625,
        "deliveryDays": 10,
        "description": "Specialized business operating systems for niche industries: ISP billing/radius, e-commerce order pipelines, coaching/academies, and multi-warehouse inventory.",
        "features": [
            "Domain-Specific Data Schema & Multi-Tenant RLS",
            "Automated Billing, Invoice & Local Gateway Integration",
            "Real-Time Operational Dashboard & Role-Based Access",
            "White-Label Customer & Administrative Portals",
            "Complete Production Deployment with Zero Vendor Lock-in"
        ],
        "idealFor": [
            "ISPs",
            "Schools/Academies",
            "E-Commerce Brands",
            "Distributors"
        ],
        "technologies": [
            "React/Next.js",
            "PostgreSQL",
            "Supabase",
            "Cloudflare Pages",
            "Node.js"
        ],
        "packages": [
            {
                "name": "MVP Blueprint",
                "price": 950,
                "delivery_days": 7
            },
            {
                "name": "Production System",
                "price": 1450,
                "delivery_days": 10
            },
            {
                "name": "Enterprise Suite",
                "price": 2800,
                "delivery_days": 21
            }
        ]
    },
    {
        "id": "ai-security-privacy-hardening",
        "name": "Cybersecurity, AI Security & Zero-Trust Hardening",
        "category": "Cybersecurity",
        "priceUSD": 650,
        "priceBDT": 79625,
        "deliveryDays": 4,
        "description": "Defensive application security, zero-trust API key vaulting, OWASP API Top 10 mitigation, multi-tenant RLS isolation, and prompt injection defense.",
        "features": [
            "Zero-Trust Environment Isolation & API Key Vaulting",
            "Prompt Injection & Adversarial Jailbreak Defense Guards",
            "Multi-Tenant Row Level Security (RLS) Leak Auditing",
            "OWASP API Security Top 10 Hardening & Rate-Limiting",
            "GDPR/PII Data Redaction & Non-Exfiltration Gates"
        ],
        "idealFor": [
            "FinTech",
            "HealthTech",
            "SaaS Companies",
            "Enterprise Portals"
        ],
        "technologies": [
            "OWASP ZAP",
            "Cloudflare WAF",
            "PostgreSQL RLS",
            "Node.js Crypto",
            "Python"
        ],
        "packages": [
            {
                "name": "Security Audit",
                "price": 450,
                "delivery_days": 2
            },
            {
                "name": "Hardening & Remediation",
                "price": 650,
                "delivery_days": 4
            },
            {
                "name": "Continuous SecOps",
                "price": 1500,
                "delivery_days": 14
            }
        ]
    },
    {
        "id": "data-engineering-bi-pipeline",
        "name": "Data Engineering & Executive Business Intelligence",
        "category": "Data & Analytics",
        "priceUSD": 550,
        "priceBDT": 67375,
        "deliveryDays": 4,
        "description": "Multi-source ETL pipelines unifying Google Sheets, PostgreSQL, legacy SQL, accounting software, and CRMs into executive analytics dashboards.",
        "features": [
            "Multi-Source Data Ingestion & Automated Cleaning (ETL)",
            "Automated Financial & Sales Reconciliation Dashboards",
            "Predictive Customer Churn & Restocking Demand Metrics",
            "Scheduled Executive Briefs via Email & WhatsApp",
            "Role-Based Drill-down Views for Leadership"
        ],
        "idealFor": [
            "Retailers",
            "Distributors",
            "E-Commerce Brands",
            "Growing Agencies"
        ],
        "technologies": [
            "PostgreSQL",
            "DuckDB",
            "Python Pandas",
            "Metabase",
            "Google Sheets API"
        ],
        "packages": [
            {
                "name": "Pipeline Setup",
                "price": 400,
                "delivery_days": 3
            },
            {
                "name": "Complete BI Suite",
                "price": 550,
                "delivery_days": 4
            },
            {
                "name": "Enterprise Warehouse",
                "price": 1400,
                "delivery_days": 10
            }
        ]
    },
    {
        "id": "ai-qa-reliability-engineering",
        "name": "AI Quality Assurance & Reliability Engineering",
        "category": "Reliability Engineering",
        "priceUSD": 450,
        "priceBDT": 55125,
        "deliveryDays": 3,
        "description": "Systematic AI output evaluation suites, automated regression testing gates, multi-model fallback circuit breakers, and SLA verification.",
        "features": [
            "Automated Golden Dataset LLM Benchmark Evaluations",
            "Multi-Model Fallback Circuit Breakers (Claude / Gemini / OpenAI)",
            "End-to-End Workflow Edge-Case & Stress Testing",
            "Sub-second Latency Profiling & Token Waste Auditing",
            "Continuous CI/CD Quality Regression Gating"
        ],
        "idealFor": [
            "AI App Founders",
            "Enterprises Deploying LLMs",
            "Tech Leads"
        ],
        "technologies": [
            "Playwright",
            "Vitest",
            "Node.js",
            "Python",
            "GitHub Actions"
        ],
        "packages": [
            {
                "name": "Eval Suite Setup",
                "price": 300,
                "delivery_days": 2
            },
            {
                "name": "Comprehensive QA Matrix",
                "price": 450,
                "delivery_days": 3
            },
            {
                "name": "Enterprise Reliability SLA",
                "price": 1100,
                "delivery_days": 7
            }
        ]
    },
    {
        "id": "agency-white-label-partner",
        "name": "White-Label Technical Delivery Partner for Agencies",
        "category": "Agency Partnership",
        "priceUSD": 750,
        "priceBDT": 91875,
        "deliveryDays": 5,
        "description": "Silent technical execution partner for design and marketing agencies. We build the complex backend, APIs, workflows, and AI integrations under your brand.",
        "features": [
            "100% White-Label Technical Delivery Under Your Brand",
            "Fast 48-72hr Turnaround on Client Automations & APIs",
            "Fixed-Scope Predictable Wholesale Pricing for High Margins",
            "Direct Technical Architect Availability for Client Scoping",
            "Complete Source Code, Docs & Video Walkthrough Handoff"
        ],
        "idealFor": [
            "Digital Agencies",
            "Web Design Studios",
            "Marketing Consultancies"
        ],
        "technologies": [
            "Node.js",
            "n8n",
            "Python",
            "FastAPI",
            "PostgreSQL",
            "Cloudflare Pages"
        ],
        "packages": [
            {
                "name": "Pilot Project",
                "price": 499,
                "delivery_days": 3
            },
            {
                "name": "Sprint Partner",
                "price": 750,
                "delivery_days": 5
            },
            {
                "name": "Dedicated Monthly Pod",
                "price": 1499,
                "delivery_days": 30
            }
        ]
    },
    {
        "id": "saas-bug-fix-rapid-pilot",
        "name": "Rapid SaaS Bug Fixing & Architecture Audit Pilot",
        "category": "Engineering Services",
        "priceUSD": 250,
        "priceBDT": 30625,
        "deliveryDays": 2,
        "description": "Low-risk 24-48hr paid pilot to fix blocking bugs, isolate memory leaks, resolve webhook failures, or audit full-stack system architecture.",
        "features": [
            "Rapid 24-48hr Root-Cause Debugging & Surgical Hotfix",
            "Comprehensive AST-Level Code Quality & Security Audit",
            "Webhook & Async Event Flow Diagnosis",
            "Database Query Profiling & Slow Scan Elimination",
            "100% Refund Guarantee If Problem Is Not Solved"
        ],
        "idealFor": [
            "SaaS Founders",
            "Busy CTOs",
            "Teams with Stalled Features"
        ],
        "technologies": [
            "Node.js",
            "TypeScript",
            "PostgreSQL",
            "Redis",
            "Docker"
        ],
        "packages": [
            {
                "name": "Single Hotfix Pilot",
                "price": 150,
                "delivery_days": 1
            },
            {
                "name": "Deep Debug & Audit",
                "price": 250,
                "delivery_days": 2
            },
            {
                "name": "Sprint Stabilization",
                "price": 450,
                "delivery_days": 4
            }
        ]
    }
];

export async function onRequestGet(context) {
    const { request } = context;
    const origin = request.headers.get("Origin") || "*";

    const corsHeaders = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
    };

    return new Response(JSON.stringify({
        status: "SUCCESS",
        catalog_version: "v10.0.0",
        exchange_rate: 122.50,
        currency_base: "USD",
        currency_local: "BDT",
        total_products: SERVICES.length,
        products: SERVICES,
        value_proposition: "Self-hosted, zero vendor lock-in, bounded multi-agent AI operating systems.",
        timestamp: new Date().toISOString()
    }, null, 2), { status: 200, headers: corsHeaders });
}
