-- ============================================================
-- IINSHA AI-BOS — INITIAL PRODUCTION SEED DATA
-- Purpose: Populate Canonical Services, FAQs, & Affiliate Tiers
-- ============================================================

-- 1. Insert Core Canonical Services
INSERT INTO ibos_services (slug, title, category, price, commission_rate, packages, features, status) VALUES
(
    'b2b-lead-swarm',
    'B2B SaaS 5-Agent Hunter Swarm',
    'Lead Generation',
    850.00,
    20.00,
    '[{"name": "Standard Hunter", "price": 850, "delivery_days": 3}]'::jsonb,
    '["5 Stealth Scraping Agents", "LinkedIn & Apollo Extraction", "Corporate MX Validation", "CRM Auto-Sync"]'::jsonb,
    'published'
),
(
    'ecommerce-ai-whatsapp',
    '24/7 E-Commerce WhatsApp & Messenger Sales Agent',
    'E-Commerce Bot',
    750.00,
    20.00,
    '[{"name": "Full Omni-Channel", "price": 750, "delivery_days": 2}]'::jsonb,
    '["20-Min Catalog Ingestion", "WhatsApp Cloud API", "Order & COD Confirmation", "Bangla & English Voice/Text"]'::jsonb,
    'published'
),
(
    'voice-ai-receptionist',
    'AI Voice Receptionist (Twilio + Gemini WebRTC)',
    'Voice AI',
    1800.00,
    20.00,
    '[{"name": "Enterprise Voice Cluster", "price": 1800, "delivery_days": 5}]'::jsonb,
    '["Gemini WebRTC Voice Engine", "Twilio Integration", "Inbound Screening", "Calendar Booking"]'::jsonb,
    'published'
),
(
    'n8n-docker-cluster',
    'Self-Hosted n8n Enterprise Cluster Deployment',
    'Infrastructure',
    497.00,
    20.00,
    '[{"name": "Hardened Cluster", "price": 497, "delivery_days": 1}]'::jsonb,
    '["Dockerized n8n Setup", "PostgreSQL & Auto-Backups", "Unlimited Workflows", "Zero Per-Task Zapier Fees"]'::jsonb,
    'published'
),
(
    'invoice-ocr-pipeline',
    'Autonomous Invoice & Document OCR Pipeline',
    'Document Automation',
    249.00,
    20.00,
    '[{"name": "Turnkey Pipeline", "price": 249, "delivery_days": 1}]'::jsonb,
    '["PDF & Image Parsing", "Gemini Vision Tabular Extraction", "QuickBooks & Google Sheets Sync"]'::jsonb,
    'published'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    commission_rate = EXCLUDED.commission_rate,
    features = EXCLUDED.features;

-- 2. Insert Default Dynamic Pages
INSERT INTO ibos_dynamic_pages (slug, title, is_published, seo_title, seo_description) VALUES
('homepage', 'IINSHA AI-BOS Studio', true, 'IINSHA AI OS — Enterprise AI Automation', 'Production-grade AI agents, Playwright Enterprise Pipeline scrapers, and Hostinger Docker VPS infrastructure.'),
('marketplace', 'Autonomous Solution Marketplace', true, 'IINSHA Marketplace — AI Workforce & Pipelines', 'Turnkey productized AI services with transparent BDT & USD pricing.'),
('affiliate', '28-Pillar Partner OS', true, 'IINSHA Partner Network — Earn 20-30% Recurring', 'Earn lifetime recurring commissions on enterprise AI automation implementations.')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Initial Content Words
INSERT INTO ibos_content_words (word_key, word_value, category) VALUES
('HERO_TITLE', 'Transform Your Business With Enterprise AI Automation', 'hero'),
('HERO_SUBTITLE', 'Production-grade AI agents, Playwright Enterprise Pipeline web scrapers, and Hostinger Docker VPS infrastructure.', 'hero'),
('HERO_CTA_TEXT', 'Explore AI Agency Solutions', 'hero'),
('WHATSAPP_NUMBER', '+8801629286887', 'contact'),
('BDT_EXCHANGE_RATE', '122.50', 'finance')
ON CONFLICT (word_key) DO UPDATE SET word_value = EXCLUDED.word_value;
