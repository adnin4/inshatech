/**
 * Cloudflare Pages Function: /api/services
 * Canonical Serverless API for IINSHA AI Services & Package Registry
 */

export const CANONICAL_SERVICES = [
    {
        "id": "b2b-lead-swarm",
        "slug": "b2b-lead-swarm",
        "name": "B2B SaaS 5-Agent Hunter Swarm",
        "category": "Lead Generation",
        "priceUSD": 850,
        "badge": "🔥 Top Seller",
        "description": "5-Agent residential resilient extraction agent extracting 100+ verified decision-makers with corporate MX validation.",
        "deliveryDays": 3,
        "features": [
            "5 resilient web extraction Agents",
            "LinkedIn & Apollo Extraction",
            "Corporate MX Email Validation",
            "Auto-Sync to CRM & Google Sheets"
        ],
        "technologies": [
            "n8n",
            "Playwright",
            "Python",
            "Gemini Pro",
            "PostgreSQL"
        ],
        "idealFor": "B2B Companies, Agencies, SaaS Founders",
        "packages": [
            {
                "name": "Standard",
                "price": 850,
                "delivery_days": 3
            }
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "ecommerce-ai-whatsapp",
        "slug": "ecommerce-ai-whatsapp",
        "name": "24/7 E-Commerce WhatsApp & Messenger Sales Agent",
        "category": "E-Commerce Bot",
        "priceUSD": 750,
        "badge": "⚡ 20-Min Setup",
        "description": "Auto-ingests your website catalog, answers customer queries, calculates delivery, and confirms orders in chat.",
        "deliveryDays": 2,
        "features": [
            "20-Min Website Catalog Ingestion",
            "WhatsApp Cloud API & Messenger",
            "Order Confirmation & COD Handling",
            "Bangla, Banglish & English Voice/Text"
        ],
        "technologies": [
            "Gemini 1.5 Flash",
            "n8n",
            "Meta WhatsApp API",
            "Pinecone",
            "Node.js"
        ],
        "idealFor": "Shopify, WooCommerce, F-Commerce",
        "packages": [
            {
                "name": "Standard",
                "price": 750,
                "delivery_days": 2
            }
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "voice-ai-receptionist",
        "slug": "voice-ai-receptionist",
        "name": "AI Voice Receptionist (Twilio + Gemini WebRTC)",
        "category": "Voice AI",
        "priceUSD": 1800,
        "badge": "🎙️ Zero Latency",
        "description": "Conversational voice bot answering 100+ inbound calls, booking appointments, and qualifying buyers.",
        "deliveryDays": 5,
        "features": [
            "Gemini WebRTC Voice Engine",
            "Twilio & Local SIP Integration",
            "Inbound Screening & Qualification",
            "Real-time SMS & CRM Booking"
        ],
        "technologies": [
            "Gemini WebRTC",
            "Twilio API",
            "n8n",
            "Python FastAPI",
            "Deepgram STT"
        ],
        "idealFor": "Clinics, Law Firms, Real Estate Agencies",
        "packages": [
            {
                "name": "Standard",
                "price": 1800,
                "delivery_days": 5
            }
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "n8n-docker-cluster",
        "slug": "n8n-docker-cluster",
        "name": "Self-Hosted n8n Enterprise Cluster Deployment",
        "category": "Infrastructure",
        "priceUSD": 497,
        "badge": "💰 90% Cost Saving",
        "description": "Dockerized n8n on Hostinger VPS ($5.99/mo) with unlimited workflows, PostgreSQL, and zero Zapier fees.",
        "deliveryDays": 1,
        "features": [
            "Dockerized n8n Setup",
            "PostgreSQL DB & Auto-Backups",
            "Unlimited Workflows & Tasks",
            "15+ Pre-installed Blueprints"
        ],
        "technologies": [
            "n8n",
            "Docker",
            "Nginx",
            "PostgreSQL",
            "Ubuntu"
        ],
        "idealFor": "Businesses spending $100-$1000/mo on Zapier",
        "packages": [
            {
                "name": "Standard",
                "price": 497,
                "delivery_days": 1
            }
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "invoice-ocr-pipeline",
        "slug": "invoice-ocr-pipeline",
        "name": "Autonomous Invoice & Document OCR Pipeline",
        "category": "Document Automation",
        "priceUSD": 249,
        "badge": "⚡ Turnkey",
        "description": "Gemini Vision + Google Sheets pipeline extracting tabular financial data in under 3 seconds.",
        "deliveryDays": 1,
        "features": [
            "PDF & Image Invoice Parsing",
            "Gemini Vision Extraction",
            "Google Sheets & QuickBooks Sync",
            "Email Attachment Auto Poller"
        ],
        "technologies": [
            "Gemini Vision",
            "n8n",
            "Google Sheets API",
            "Python"
        ],
        "idealFor": "Accounting Teams, Distributors, Finance Managers",
        "packages": [
            {
                "name": "Standard",
                "price": 249,
                "delivery_days": 1
            }
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "api-backend-integration",
        "slug": "api-backend-integration",
        "name": "AI Integration & Business Process Automation",
        "category": "System Integration",
        "priceUSD": 450,
        "badge": "⚡ Phase 1 Cash Flow",
        "description": "Custom API webhooks, n8n/Make pipelines, CRM/ERP sync (HubSpot, Salesforce, WooCommerce), and Human-in-the-Loop approval workflows.",
        "deliveryDays": 3,
        "features": [
            "Bidirectional CRM/ERP Webhook Synchronization",
            "Human-in-the-Loop (HITL) Slack/Email Approval Gateways",
            "Automated Order Processing & Multi-channel Invoicing",
            "RAG Company Policy & Internal Knowledge Grounding",
            "Fail-closed Error Handling & Exponential Retry Queue"
        ],
        "technologies": [
            "n8n",
            "Node.js",
            "FastAPI",
            "PostgreSQL",
            "Webhooks",
            "Gemini Pro"
        ],
        "idealFor": "SMEs, E-Commerce Brands, Operations Managers, SaaS Founders",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "managed-ai-maintenance",
        "slug": "managed-ai-maintenance",
        "name": "Managed AI Services & 24/7 System Maintenance Retainer",
        "category": "Managed Care",
        "priceUSD": 249,
        "badge": "🛡️ Phase 2 Recurring Retainer",
        "description": "Dedicated monthly care for AI workflows, automation monitoring, API error interception, prompt drift testing, and DB backup verification.",
        "deliveryDays": 30,
        "features": [
            "24/7 Automation Health & Error Heartbeat Alerts",
            "LLM Prompt Drift & Output Quality Benchmarking",
            "API Cost Tracking & Token Budget Guardrails",
            "Database Backup & Disaster Recovery Rollback Drills",
            "Sub-4hr Emergency Hotfix SLA & Dedicated Engineer Hours"
        ],
        "technologies": [
            "Prometheus",
            "Grafana",
            "Docker",
            "PostgreSQL",
            "Cloudflare Workers"
        ],
        "idealFor": "Businesses with Live Automations, Agencies, SaaS Founders",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "vertical-saas-core",
        "slug": "vertical-saas-core",
        "name": "Vertical Industry SaaS Operations Platforms",
        "category": "Vertical SaaS",
        "priceUSD": 1450,
        "badge": "🏢 Phase 3 Vertical SaaS",
        "description": "Specialized business operating systems for niche industries: ISP billing/radius, e-commerce order pipelines, coaching/academies, and multi-warehouse inventory.",
        "deliveryDays": 10,
        "features": [
            "Domain-Specific Data Schema & Multi-Tenant RLS",
            "Automated Billing, Invoice & Local Gateway Integration",
            "Real-Time Operational Dashboard & Role-Based Access",
            "White-Label Customer & Administrative Portals",
            "Complete Production Deployment with Zero Vendor Lock-in"
        ],
        "technologies": [
            "React/Next.js",
            "PostgreSQL",
            "Supabase",
            "Cloudflare Pages",
            "Node.js"
        ],
        "idealFor": "ISPs, Schools/Academies, E-Commerce Brands, Distributors",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "ai-security-privacy-hardening",
        "slug": "ai-security-privacy-hardening",
        "name": "Cybersecurity, AI Security & Zero-Trust Hardening",
        "category": "Cybersecurity",
        "priceUSD": 650,
        "badge": "🚀 Active",
        "description": "Defensive application security, zero-trust API key vaulting, OWASP API Top 10 mitigation, multi-tenant RLS isolation, and prompt injection defense.",
        "deliveryDays": 4,
        "features": [
            "Zero-Trust Environment Isolation & API Key Vaulting",
            "Prompt Injection & Adversarial Jailbreak Defense Guards",
            "Multi-Tenant Row Level Security (RLS) Leak Auditing",
            "OWASP API Security Top 10 Hardening & Rate-Limiting",
            "GDPR/PII Data Redaction & Non-Exfiltration Gates"
        ],
        "technologies": [
            "OWASP ZAP",
            "Cloudflare WAF",
            "PostgreSQL RLS",
            "Node.js Crypto",
            "Python"
        ],
        "idealFor": "FinTech, HealthTech, SaaS Companies, Enterprise Portals",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "data-engineering-bi-pipeline",
        "slug": "data-engineering-bi-pipeline",
        "name": "Data Engineering & Executive Business Intelligence",
        "category": "Data & Analytics",
        "priceUSD": 550,
        "badge": "🚀 Active",
        "description": "Multi-source ETL pipelines unifying Google Sheets, PostgreSQL, legacy SQL, accounting software, and CRMs into executive analytics dashboards.",
        "deliveryDays": 4,
        "features": [
            "Multi-Source Data Ingestion & Automated Cleaning (ETL)",
            "Automated Financial & Sales Reconciliation Dashboards",
            "Predictive Customer Churn & Restocking Demand Metrics",
            "Scheduled Executive Briefs via Email & WhatsApp",
            "Role-Based Drill-down Views for Leadership"
        ],
        "technologies": [
            "PostgreSQL",
            "DuckDB",
            "Python Pandas",
            "Metabase",
            "Google Sheets API"
        ],
        "idealFor": "Retailers, Distributors, E-Commerce Brands, Growing Agencies",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "ai-qa-reliability-engineering",
        "slug": "ai-qa-reliability-engineering",
        "name": "AI Quality Assurance & Reliability Engineering",
        "category": "Reliability Engineering",
        "priceUSD": 450,
        "badge": "🚀 Active",
        "description": "Systematic AI output evaluation suites, automated regression testing gates, multi-model fallback circuit breakers, and SLA verification.",
        "deliveryDays": 3,
        "features": [
            "Automated Golden Dataset LLM Benchmark Evaluations",
            "Multi-Model Fallback Circuit Breakers (Claude / Gemini / OpenAI)",
            "End-to-End Workflow Edge-Case & Stress Testing",
            "Sub-second Latency Profiling & Token Waste Auditing",
            "Continuous CI/CD Quality Regression Gating"
        ],
        "technologies": [
            "Playwright",
            "Vitest",
            "Node.js",
            "Python",
            "GitHub Actions"
        ],
        "idealFor": "AI App Founders, Enterprises Deploying LLMs, Tech Leads",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "agency-white-label-partner",
        "slug": "agency-white-label-partner",
        "name": "White-Label Technical Delivery Partner for Agencies",
        "category": "Agency Partnership",
        "priceUSD": 750,
        "badge": "🤝 Wholesale Agency Partner",
        "description": "Silent technical execution partner for design and marketing agencies. We build the complex backend, APIs, workflows, and AI integrations under your brand.",
        "deliveryDays": 5,
        "features": [
            "100% White-Label Technical Delivery Under Your Brand",
            "Fast 48-72hr Turnaround on Client Automations & APIs",
            "Fixed-Scope Predictable Wholesale Pricing for High Margins",
            "Direct Technical Architect Availability for Client Scoping",
            "Complete Source Code, Docs & Video Walkthrough Handoff"
        ],
        "technologies": [
            "Node.js",
            "n8n",
            "Python",
            "FastAPI",
            "PostgreSQL",
            "Cloudflare Pages"
        ],
        "idealFor": "Digital Agencies, Web Design Studios, Marketing Consultancies",
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
        ],
        "n8nReady": true,
        "published": true
    },
    {
        "id": "saas-bug-fix-rapid-pilot",
        "slug": "saas-bug-fix-rapid-pilot",
        "name": "Rapid SaaS Bug Fixing & Architecture Audit Pilot",
        "category": "Engineering Services",
        "priceUSD": 250,
        "badge": "⏱️ 24-48hr Rapid Pilot",
        "description": "Low-risk 24-48hr paid pilot to fix blocking bugs, isolate memory leaks, resolve webhook failures, or audit full-stack system architecture.",
        "deliveryDays": 2,
        "features": [
            "Rapid 24-48hr Root-Cause Debugging & Surgical Hotfix",
            "Comprehensive AST-Level Code Quality & Security Audit",
            "Webhook & Async Event Flow Diagnosis",
            "Database Query Profiling & Slow Scan Elimination",
            "100% Refund Guarantee If Problem Is Not Solved"
        ],
        "technologies": [
            "Node.js",
            "TypeScript",
            "PostgreSQL",
            "Redis",
            "Docker"
        ],
        "idealFor": "SaaS Founders, Busy CTOs, Teams with Stalled Features",
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
        ],
        "n8nReady": true,
        "published": true
    }
];

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q")?.toLowerCase();

    // Check if we can resolve from shared DB catalog resolver
    let catalogResolution = { services: CANONICAL_SERVICES, source: 'STATIC_PROJECTION' };
    try {
        const { resolveAuthoritativeCatalog } = await import('../_shared/knowledge/services_catalog.js');
        if (resolveAuthoritativeCatalog) {
            catalogResolution = await resolveAuthoritativeCatalog(env);
        }
    } catch (e) {
        // Fall back to CANONICAL_SERVICES
    }

    let results = catalogResolution.services || CANONICAL_SERVICES;

    if (category) {
        results = results.filter(s => s.category?.toLowerCase() === category.toLowerCase());
    }

    if (q) {
        results = results.filter(s => 
            s.name.toLowerCase().includes(q) || 
            s.description.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q)
        );
    }

    return new Response(JSON.stringify({
        status: "SUCCESS",
        source: catalogResolution.source,
        count: results.length,
        usd_to_bdt_rate: Number(env?.BDT_EXCHANGE_RATE) || 122.50,
        services: results
    }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
