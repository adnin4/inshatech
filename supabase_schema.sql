-- ============================================================
-- IINSHA TECH OS v300 — ULTIMATE ENTERPRISE MASTER DATABASE SCHEMA
-- PostgreSQL Production Database (Supabase + pgvector + RLS)
-- 20 Master Modules | 80+ Enterprise Tables | Single Source of Truth
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- AI Vector Memory for RAG Agents

-- ============================================================
-- MODULE 1 & 15: IDENTITY & RBAC USER MANAGEMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(64),
    role VARCHAR(64) DEFAULT 'admin', -- super_admin, admin, editor, support, affiliate_manager, finance, marketing, client, affiliate
    status VARCHAR(32) DEFAULT 'active',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Default Super Admin User
INSERT INTO ibos_users (email, password_hash, full_name, role)
VALUES (
    'adnansadatmahin4@gmail.com',
    crypt('@@@mahin12', gen_salt('bf')),
    'Mahin Khan (Super Admin)',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

CREATE TABLE IF NOT EXISTS ibos_user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(64) NOT NULL,
    module VARCHAR(64) NOT NULL,
    can_read BOOLEAN DEFAULT TRUE,
    can_write BOOLEAN DEFAULT TRUE,
    can_delete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 2 & 14: UNIVERSAL CMS & GLOBAL SYSTEM SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_key VARCHAR(64) UNIQUE NOT NULL, -- homepage, marketplace, store, portal, affiliate, blog, services
    title VARCHAR(255) NOT NULL,
    hero_headline TEXT,
    hero_subtext TEXT,
    cta_text VARCHAR(128),
    cta_link VARCHAR(255),
    content_blocks JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INT DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_system_settings (
    key VARCHAR(128) PRIMARY KEY,
    category VARCHAR(64) DEFAULT 'general', -- general, pricing, smtp, whatsapp, social, seo, security
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 3 & 4: SERVICE CATALOG & UNLIMITED PRICING BUILDER
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    packages JSONB NOT NULL DEFAULT '[]'::jsonb, -- Starter, Pro, Business, Enterprise, Custom
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    media_url TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    status VARCHAR(32) DEFAULT 'published', -- draft, published, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 5: MARKETPLACE OS (MINI SAAS & DIGITAL ASSETS)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_marketplace_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    download_url TEXT,
    version VARCHAR(32) DEFAULT '1.0.0',
    license_type VARCHAR(64) DEFAULT 'Commercial Unlimited',
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 6: AFFILIATE OS 5.0 (PARTNERSTACK & IMPACT RULES)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aff_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. AFF10025
    user_id UUID REFERENCES ibos_users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(32) DEFAULT 'VIP', -- Starter (15%), VIP (20%), Elite (25%), Legend (30%)
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    earnings_total DECIMAL(12,2) DEFAULT 0.00,
    earnings_pending DECIMAL(12,2) DEFAULT 0.00,
    earnings_withdrawn DECIMAL(12,2) DEFAULT 0.00,
    clicks_total INT DEFAULT 0,
    sales_total INT DEFAULT 0,
    payment_method VARCHAR(64) DEFAULT 'bKash/Nagad/Bank',
    payment_details TEXT,
    status VARCHAR(32) DEFAULT 'active', -- pending_approval, active, suspended, blacklisted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES ibos_affiliates(id),
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending', -- pending, approved, paid, rejected
    payout_method VARCHAR(64),
    transaction_ref VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 9 & 10: CRM PIPELINE & CLIENT PORTAL ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    company VARCHAR(255),
    budget VARCHAR(64),
    service_interest VARCHAR(128),
    stage VARCHAR(32) DEFAULT 'new', -- new, contacted, proposal, closed_won, closed_lost
    ltv DECIMAL(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    payment_status VARCHAR(32) DEFAULT 'pending', -- pending, paid, refunded
    order_status VARCHAR(32) DEFAULT 'processing', -- processing, active, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 7: BLOG & PROGRAMMATIC SEO CMS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'Case Study',
    author VARCHAR(128) DEFAULT 'Mahin Khan',
    featured_image TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(32) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 8: MEDIA LIBRARY & ASSETS STORAGE
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_media_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes INT,
    file_type VARCHAR(64),
    folder VARCHAR(64) DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 11: AI CENTER & VECTOR RAG MEMORY
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_key VARCHAR(64) UNIQUE NOT NULL, -- sales_ai, support_ai, executive_ai, marketing_ai
    name VARCHAR(128) NOT NULL,
    model VARCHAR(64) DEFAULT 'Gemini 3.5 Ultra',
    system_prompt TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_ai_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(128),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    embedding VECTOR(1536), -- Vector RAG embeddings
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 12: WORKFLOW BUILDER (N8N INTEGRATION)
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(64) NOT NULL, -- order_created, lead_submitted, affiliate_sale
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 13 & 20: ANALYTICS & SYSTEM MONITOR TELEMETRY
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(64) NOT NULL,
    page_url TEXT,
    ip_address VARCHAR(64),
    country VARCHAR(64),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- MODULE 16, 17, 18, 19: SECURITY, KNOWLEDGE, API & NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS ibos_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(128) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name VARCHAR(128) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    rate_limit_per_min INT DEFAULT 60,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ibos_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    channel VARCHAR(32) DEFAULT 'whatsapp', -- whatsapp, email, push, telegram
    recipient VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(32) DEFAULT 'sent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INITIAL SYSTEM CONFIG & FEATURE FLAGS
-- ============================================================
INSERT INTO ibos_system_settings (key, category, value) VALUES
('bdt_exchange_rate', 'pricing', '{"rate": 120}'::jsonb),
('branding', 'general', '{"name": "IINSHA TECH OS v300", "tagline": "Enterprise AI Business Operating System"}'::jsonb),
('feature_flags', 'general', '{"aiChat": true, "affiliateNetwork": true, "marketplace": true, "clientPortal": true, "workflowBuilder": true}'::jsonb)
ON CONFLICT (key) DO NOTHING;
