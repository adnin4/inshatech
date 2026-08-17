-- ============================================================
-- IINSHA TECH OS v500 — HEADLESS ENTERPRISE MASTER DATABASE SCHEMA
-- PostgreSQL Production Database (Supabase + pgvector + RLS)
-- Golden Rule: Zero Hardcoded Content. Everything comes from Database.
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- AI Vector Memory

-- ============================================================
-- 1. UNIVERSAL CONTENT ENGINE (KEY-VALUE DICTIONARY FOR EVERY WORD)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_content_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_key VARCHAR(128) UNIQUE NOT NULL, -- e.g. HERO_TITLE, HERO_SUBTITLE, NAVBAR_BRAND, FOOTER_TEXT
    word_value TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'homepage',
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Universal Content Words
INSERT INTO ibos_content_words (word_key, word_value, category) VALUES
('HERO_TITLE', 'Transform Your Business With Enterprise AI Automation', 'hero'),
('HERO_SUBTITLE', 'Production-grade AI agents, OpenClaw stealth web scrapers, and Hostinger Docker VPS infrastructure.', 'hero'),
('HERO_CTA_TEXT', 'Explore AI Agency Solutions', 'hero'),
('NAVBAR_BRAND', 'IINSHA TECH OS', 'navigation'),
('FOOTER_TEXT', '© 2026 IINSHA TECH OS. All Rights Reserved. Powered by Cloudflare Pages & Supabase.', 'footer'),
('WHATSAPP_NUMBER', '+8801629286887', 'contact')
ON CONFLICT (word_key) DO NOTHING;

-- ============================================================
-- 2. DYNAMIC PAGE & BLOCK BUILDER (ELEMENTOR-STYLE COMPONENT ENGINE)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_dynamic_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL, -- homepage, marketplace, services, affiliate, portal, blog
    title VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_page_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES ibos_dynamic_pages(id) ON DELETE CASCADE,
    block_type VARCHAR(64) NOT NULL, -- hero, features, faq, testimonials, pricing, cta, video, gallery, timeline, comparison
    sort_order INT DEFAULT 0,
    block_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. NAVIGATION & MENU BUILDER (NAVBAR, FOOTER, SIDEBAR)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_navigation_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_location VARCHAR(64) NOT NULL, -- main_navbar, footer_primary, sidebar_portal
    label VARCHAR(128) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(64),
    sort_order INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. DYNAMIC THEME ENGINE (COLORS, FONTS, GLASS EFFECT, ANIMATIONS)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_theme_settings (
    key VARCHAR(128) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ibos_theme_settings (key, value, description) VALUES
('primary_color', '#6366f1', 'Accent Indigo'),
('accent_cyan', '#06b6d4', 'Accent Cyan'),
('accent_gold', '#f59e0b', 'Accent Gold'),
('accent_emerald', '#10b981', 'Accent Emerald'),
('bg_mode', 'dark', 'Glassmorphism Dark Mode'),
('font_family', "'Inter', sans-serif", 'Google Font')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 5. PAYMENT GATEWAY MANAGEMENT (STRIPE, BKASH, NAGAD, BANK, ETC)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_payment_gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway_key VARCHAR(64) UNIQUE NOT NULL, -- stripe, bkash, nagad, rocket, sslcommerz, paypal, usdt, bank
    gateway_name VARCHAR(128) NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    currency VARCHAR(10) DEFAULT 'USD',
    config_params JSONB NOT NULL DEFAULT '{}'::jsonb, -- API keys, Account Numbers, Instructions
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO ibos_payment_gateways (gateway_key, gateway_name, is_enabled, currency, config_params) VALUES
('bkash', 'bKash Merchant / Personal', true, 'BDT', '{"account_number": "01629286887", "type": "Personal Send Money"}'::jsonb),
('nagad', 'Nagad Personal', true, 'BDT', '{"account_number": "01629286887", "type": "Personal"}'::jsonb),
('stripe', 'Stripe Card Checkout', true, 'USD', '{"publishable_key": "pk_test_sample", "statement_descriptor": "IINSHA TECH OS"}'::jsonb),
('bank', 'Bank Wire Transfer', true, 'USD', '{"bank_name": "City Bank PLC", "account_no": "1102938475"}'::jsonb)
ON CONFLICT (gateway_key) DO NOTHING;

-- ============================================================
-- 6. SERVICE CATALOG & UNLIMITED PRICING PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    packages JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    media_url TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(32) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. PARTNERSTACK-GRADE AFFILIATE SYSTEM 5.0
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aff_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(32) DEFAULT 'VIP',
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    earnings_total DECIMAL(12,2) DEFAULT 0.00,
    earnings_pending DECIMAL(12,2) DEFAULT 0.00,
    earnings_withdrawn DECIMAL(12,2) DEFAULT 0.00,
    clicks_total INT DEFAULT 0,
    sales_total INT DEFAULT 0,
    payment_method VARCHAR(64) DEFAULT 'bKash/Nagad/Bank',
    payment_details TEXT,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES ibos_affiliates(id),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending',
    payout_method VARCHAR(64),
    transaction_ref VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. ORDERS & CLIENT PORTAL INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(64) UNIQUE NOT NULL,
    service_id UUID REFERENCES ibos_services(id),
    service_title VARCHAR(255) NOT NULL,
    package_name VARCHAR(128),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    bdt_amount DECIMAL(12, 2),
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(64),
    affiliate_ref_code VARCHAR(64),
    affiliate_commission DECIMAL(10, 2) DEFAULT 0.00,
    payment_gateway VARCHAR(64) DEFAULT 'bKash',
    payment_status VARCHAR(32) DEFAULT 'pending',
    order_status VARCHAR(32) DEFAULT 'processing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. IDENTITY & RBAC ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(64) DEFAULT 'super_admin',
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SECURITY: Run this INSERT manually with your own secure password.
-- Example: INSERT INTO ibos_users (email, password_hash, full_name, role)
-- VALUES ('your@email.com', crypt('YOUR_SECURE_PASSWORD', gen_salt('bf')), 'Your Name', 'super_admin');

-- ============================================================
-- 10. VERSION CONTROL & IMMUTABLE AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_version_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(64) NOT NULL, -- word, page, service, pricing, payment
    entity_id VARCHAR(128) NOT NULL,
    previous_value JSONB,
    new_value JSONB,
    changed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(128) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 11. PRODUCTION AI INTELLIGENCE & CONVERSATION STATE SCHEMA
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_conversations (
    id VARCHAR(128) PRIMARY KEY, -- e.g. conv_1786975277874
    user_id VARCHAR(128) DEFAULT 'user_default',
    status VARCHAR(32) DEFAULT 'active',
    title VARCHAR(255) DEFAULT 'New Consultation',
    summary TEXT DEFAULT 'Conversation initialized.',
    active_goal TEXT,
    last_intent VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_messages (
    id VARCHAR(128) PRIMARY KEY,
    conversation_id VARCHAR(128) REFERENCES ibos_conversations(id) ON DELETE CASCADE,
    role VARCHAR(32) NOT NULL, -- user, assistant, system, tool
    content TEXT NOT NULL,
    tool_calls JSONB,
    tool_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_conversation_state (
    conversation_id VARCHAR(128) PRIMARY KEY REFERENCES ibos_conversations(id) ON DELETE CASCADE,
    known_facts JSONB DEFAULT '[]'::jsonb,
    unknown_facts JSONB DEFAULT '[]'::jsonb,
    decisions JSONB DEFAULT '[]'::jsonb,
    constraints JSONB DEFAULT '[]'::jsonb,
    asked_questions JSONB DEFAULT '[]'::jsonb,
    answered_questions JSONB DEFAULT '[]'::jsonb,
    pending_tasks JSONB DEFAULT '[]'::jsonb,
    next_action VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_memories (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    type VARCHAR(64) NOT NULL, -- CONVERSATION, USER, BUSINESS, EPISODIC, SEMANTIC
    content TEXT NOT NULL,
    importance DECIMAL(3,2) DEFAULT 0.80,
    confidence DECIMAL(3,2) DEFAULT 0.95,
    source VARCHAR(128) DEFAULT 'USER_INPUT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ibos_missions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    goal TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'RUNNING',
    plan JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_step INT DEFAULT 0,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_agent_runs (
    id VARCHAR(128) PRIMARY KEY,
    mission_id VARCHAR(128) REFERENCES ibos_missions(id) ON DELETE CASCADE,
    agent VARCHAR(64) NOT NULL,
    task TEXT NOT NULL,
    input JSONB,
    output JSONB,
    status VARCHAR(32) DEFAULT 'COMPLETED',
    latency_ms INT DEFAULT 0,
    tokens INT DEFAULT 0,
    cost_usd DECIMAL(8,6) DEFAULT 0.000000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_tool_calls (
    id VARCHAR(128) PRIMARY KEY,
    agent_run_id VARCHAR(128) REFERENCES ibos_agent_runs(id) ON DELETE CASCADE,
    tool_name VARCHAR(64) NOT NULL,
    arguments JSONB NOT NULL,
    result JSONB,
    risk_level VARCHAR(32) DEFAULT 'LEVEL_0',
    approval_status VARCHAR(32) DEFAULT 'APPROVED',
    execution_status VARCHAR(32) DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_evaluations (
    id VARCHAR(128) PRIMARY KEY,
    conversation_id VARCHAR(128),
    question TEXT NOT NULL,
    expected_behavior TEXT NOT NULL,
    actual_behavior TEXT NOT NULL,
    score DECIMAL(4,2) DEFAULT 1.00,
    failure_type VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
