-- ============================================================================
-- Migration: 20261113000001_seed_premium_services_catalog.sql
-- Description: Idempotent seed migration for 10 Commercial AI Engineering Suites
-- Ensures 100% price authority parity with JSON catalogs and payment checkout.
-- ============================================================================

INSERT INTO public.ibos_services (
    slug,
    title,
    category,
    price,
    currency,
    commission_rate,
    packages,
    features,
    seo_title,
    seo_description,
    status
) VALUES
(
    'ai-video-studio',
    'AI Video Automation, Motion Graphics & Autonomous UGC Studio',
    'Creative & Media AI',
    450.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 450.00, "priceUSD": 450, "description": "3 Batch Videos + Avatar Pipeline Setup (3 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 1400.00, "priceUSD": 1400, "description": "Full Multi-Language Video Factory & Automated Batch Rendering (7 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 1800.00, "priceUSD": 1800, "billing": "monthly", "description": "30 Monthly Rendered Videos, Dynamic UGC Pipelines & A/B Variations"},
        {"id": "standard", "name": "Standard Pilot", "price": 450.00, "priceUSD": 450, "description": "Standard Rapid Pilot Scope"}
    ]'::jsonb,
    '["Batch Video Rendering", "Automated Multilingual Subtitling", "AI Avatar Presenters", "Dynamic Motion Graphics", "Social Media Auto-Publishing"]'::jsonb,
    'AI Video Automation & Autonomous UGC Studio | IINSHA AI',
    'Turn raw assets, scripts, and product catalogs into broadcast-grade video reels with zero manual editing.',
    'published'
),
(
    'ai-saas-engineering',
    'AI SaaS MVP, Full-Stack Architecture & Multi-Tenant Engineering',
    'Software Architecture',
    850.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 850.00, "priceUSD": 850, "description": "Architecture Blueprint, DB Schema & Core Auth Prototype (5 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 5500.00, "priceUSD": 5500, "description": "Full Multi-Tenant SaaS with Stripe Billing, RLS & Edge Deployment (14 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 2200.00, "priceUSD": 2200, "billing": "monthly", "description": "Continuous Feature Sprints, DevOps Reliability & Performance SLA"},
        {"id": "standard", "name": "Standard Pilot", "price": 850.00, "priceUSD": 850, "description": "Standard Architecture Blueprint & Prototype"}
    ]'::jsonb,
    '["Multi-Tenant Isolation", "Stripe & SSLCommerz Billing", "Supabase Row-Level Security", "Cloudflare Workers & Pages Edge", "WCAG 2.2 AA Compliance"]'::jsonb,
    'AI SaaS MVP & Architecture Engineering | IINSHA AI',
    'Launch secure, scalable multi-tenant SaaS products with built-in subscription billing and edge deployment.',
    'published'
),
(
    'ai-governance-operations',
    'Enterprise AI Governance, Security Auditing & Compliance Operations',
    'Security & Governance',
    950.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 950.00, "priceUSD": 950, "description": "OWASP LLM Vulnerability Assessment & Architecture Review (5 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 3200.00, "priceUSD": 3200, "description": "Full Guardrail Gateway, Red Teaming & PII Redaction Pipeline (10 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 950.00, "priceUSD": 950, "billing": "monthly", "description": "Continuous Security Monitoring, Compliance Auditing & Model Drift Alerts"},
        {"id": "standard", "name": "Standard Pilot", "price": 950.00, "priceUSD": 950, "description": "Standard Vulnerability Assessment & Compliance Review"}
    ]'::jsonb,
    '["OWASP LLM Top 10 Mitigation", "NeMo Guardrails Gateway", "PII Redaction Pipeline", "Prompt Injection Defense", "Audit Trail & Compliance Logs"]'::jsonb,
    'Enterprise AI Governance & Security Auditing | IINSHA AI',
    'Protect enterprise AI deployments against prompt injection, data leakage, and compliance violations.',
    'published'
),
(
    'ecommerce-growth-operations',
    'Autonomous E-Commerce Growth, Catalog & Fulfillment Operations',
    'Commerce Automation',
    490.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 490.00, "priceUSD": 490, "description": "WhatsApp Cart Abandonment Bot & Order Status Automation (3 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 1850.00, "priceUSD": 1850, "description": "Full Shopify/WooCommerce Catalog Sync, Courier API & Review Bot (7 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 650.00, "priceUSD": 650, "billing": "monthly", "description": "Ongoing Dynamic Pricing, Inventory Monitoring & Ad Automation"},
        {"id": "standard", "name": "Standard Pilot", "price": 490.00, "priceUSD": 490, "description": "Standard Abandoned Cart Bot & Tracking Setup"}
    ]'::jsonb,
    '["Shopify & WooCommerce Sync", "WhatsApp Order Status Bot", "Abandoned Cart Recovery", "Automated Review Response", "Courier API Logistics Integration"]'::jsonb,
    'Autonomous E-Commerce Growth & Operations | IINSHA AI',
    'Scale online retail operations with automated inventory sync, WhatsApp checkout recovery, and multi-courier dispatch.',
    'published'
),
(
    'ai-finance-automation',
    'AI Finance, Invoice Extraction & 3-Way Reconciliation Pipeline',
    'FinTech & Accounting',
    650.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 650.00, "priceUSD": 650, "description": "Multi-Format Invoice Parser & CSV/Excel Reconciliation (4 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 2800.00, "priceUSD": 2800, "description": "Full QuickBooks/Xero Sync, Bank Feed & Fraud Anomaly Detection (8 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 750.00, "priceUSD": 750, "billing": "monthly", "description": "Continuous Daily Ledger Reconciliation & Real-Time Cash Flow Alerts"},
        {"id": "standard", "name": "Standard Pilot", "price": 650.00, "priceUSD": 650, "description": "Standard Invoice OCR & Ledger Pipeline"}
    ]'::jsonb,
    '["Multimodal OCR Parsing", "3-Way Invoice Matching", "QuickBooks & Xero Sync", "Fraud Anomaly Detection", "Strict Financial Invariant Auditing"]'::jsonb,
    'AI Finance & Invoice Reconciliation Pipeline | IINSHA AI',
    'Automate accounts payable, line-item extraction, and ledger reconciliation with zero arithmetic errors.',
    'published'
),
(
    'ai-data-operations',
    'High-Throughput AI Data Annotation, Synthetic Generation & Dataset Ops',
    'Data Operations',
    750.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 750.00, "priceUSD": 750, "description": "10,000 Sample Semi-Automated Annotation Pipeline (4 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 2900.00, "priceUSD": 2900, "description": "Full Synthetic Data Engine, Consensus Scoring & HuggingFace Export (8 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 1200.00, "priceUSD": 1200, "billing": "monthly", "description": "Continuous Dataset Quality Curation, Model Retraining Data & S3 Feeds"},
        {"id": "standard", "name": "Standard Pilot", "price": 750.00, "priceUSD": 750, "description": "Standard Data Annotation Pipeline"}
    ]'::jsonb,
    '["Semi-Automated Labeling", "Synthetic Data Generation", "Inter-Annotator Agreement Scoring", "HuggingFace & S3 Export", "Multi-Modal Token Alignment"]'::jsonb,
    'AI Data Annotation & Dataset Operations | IINSHA AI',
    'Generate high-accuracy training and evaluation datasets with active learning and automated quality scoring.',
    'published'
),
(
    'enterprise-knowledge-search',
    'Enterprise Knowledge Graph & Semantic RAG Search Engine',
    'Knowledge & Search',
    850.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 850.00, "priceUSD": 850, "description": "Indexed Document Search with Vector Embeddings & Chatbot (4 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 3800.00, "priceUSD": 3800, "description": "Full Slack/Drive/Confluence Connectors, Hybrid BM25 & KG RAG (10 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 750.00, "priceUSD": 750, "billing": "monthly", "description": "Weekly Document Re-Indexing, Hallucination Audits & Vector Optimization"},
        {"id": "standard", "name": "Standard Pilot", "price": 850.00, "priceUSD": 850, "description": "Standard Semantic Search Pilot"}
    ]'::jsonb,
    '["Hybrid BM25 & Vector Retrieval", "Knowledge Graph Entity Linking", "Slack & Google Drive Ingestion", "Strict Source Citation Reranking", "Zero-Hallucination Guardrails"]'::jsonb,
    'Enterprise Knowledge Graph & Semantic Search | IINSHA AI',
    'Index company internal wikis, contracts, and Slack threads for instant grounded answers with citations.',
    'published'
),
(
    'software-qa-release',
    'Software QA, Test Automation & Release Engineering Suite',
    'QA & Release Engineering',
    750.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 750.00, "priceUSD": 750, "description": "Critical User Flow E2E Suite with Playwright & Video Artifacts (5 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 2400.00, "priceUSD": 2400, "description": "Full 4-Browser Matrix, GitHub Actions CI Pipeline & Security Scan (8 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 650.00, "priceUSD": 650, "billing": "monthly", "description": "PR Verification Gating, Flaky Test Quarantine & Performance Auditing"},
        {"id": "standard", "name": "Standard Pilot", "price": 750.00, "priceUSD": 750, "description": "Standard Playwright Test Suite"}
    ]'::jsonb,
    '["Playwright 4-Browser Matrix", "GitHub Actions CI Integration", "Visual Regression Diffing", "Mobile Responsive Testing", "Zero-False-Green Telemetry"]'::jsonb,
    'Software QA & Release Engineering Suite | IINSHA AI',
    'Eliminate production bugs with comprehensive Playwright end-to-end testing and automated deployment gates.',
    'published'
),
(
    'cloud-finops-reliability',
    'Cloud FinOps, Performance & Reliability Engineering',
    'Cloud FinOps & SRE',
    850.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 850.00, "priceUSD": 850, "description": "Cloud Cost Audit, Architecture Bottleneck Report & Cache Plan (5 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 2900.00, "priceUSD": 2900, "description": "Full Cloudflare Edge Caching, Serverless Optimization & DR Drill (8 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 550.00, "priceUSD": 550, "billing": "monthly", "description": "24/7 SRE Observability, Cloud Spend Monitoring & Latency Budget SLA"},
        {"id": "standard", "name": "Standard Pilot", "price": 850.00, "priceUSD": 850, "description": "Standard FinOps Audit & Optimization"}
    ]'::jsonb,
    '["30-50% Cloud Cost Reduction", "Cloudflare Edge Caching", "Serverless Latency Optimization", "Disaster Recovery Drills", "Prometheus & Grafana Observability"]'::jsonb,
    'Cloud FinOps & Site Reliability Engineering | IINSHA AI',
    'Slash LLM and cloud hosting bills while boosting global response speeds with edge computing and autoscaling.',
    'published'
),
(
    'computer-vision-systems',
    'Computer Vision & Visual Intelligence Systems',
    'Computer Vision',
    1200.00,
    'USD',
    20.00,
    '[
        {"id": "pilot", "name": "Pilot Scope", "price": 1200.00, "priceUSD": 1200, "description": "Custom Model Proof-of-Concept on Sample Image/Video Data (7 Days)"},
        {"id": "implementation", "name": "Full Production Suite", "price": 4500.00, "priceUSD": 4500, "description": "Full Edge Camera Inference Pipeline with TensorRT & Webhook Alerts (14 Days)"},
        {"id": "monthly", "name": "Monthly Retainer", "price": 850.00, "priceUSD": 850, "billing": "monthly", "description": "Model Retraining on New Defects, Lighting Drift Calibration & SRE"},
        {"id": "standard", "name": "Standard Pilot", "price": 1200.00, "priceUSD": 1200, "description": "Standard Vision Proof-of-Concept"}
    ]'::jsonb,
    '["Real-Time Defect Detection", "YOLOv8 & TensorRT Acceleration", "Edge Camera Video Feeds", "Biometric KYC Verification", "Automated Visual Counting"]'::jsonb,
    'Computer Vision & Visual Intelligence Systems | IINSHA AI',
    'Deploy real-time industrial defect inspection, object detection, and visual security on edge hardware.',
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    commission_rate = EXCLUDED.commission_rate,
    packages = EXCLUDED.packages,
    features = EXCLUDED.features,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    status = EXCLUDED.status,
    updated_at = CURRENT_TIMESTAMP;
