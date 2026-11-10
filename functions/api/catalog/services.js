/**
 * Cloudflare Pages Function: /api/catalog/services
 * Canonical Product Catalog & Ecosystem Vision Endpoint
 */

const SERVICES = [
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
