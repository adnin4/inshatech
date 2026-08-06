-- ============================================================
-- IINSHAA OS v250 ENTERPRISE HYBRID SERVER ARCHITECTURE
-- PostgreSQL Production Master Database Schema (Supabase + pgvector)
-- ============================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Vector memory for AI Agents & Search

-- 2. USERS & RBAC ROLES TABLE
CREATE TABLE IF NOT EXISTS ibos_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(64) DEFAULT 'admin', -- super_admin, admin, affiliate_manager, sales, editor, client
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin (Hashed Password verification)
INSERT INTO ibos_users (email, password_hash, full_name, role)
VALUES (
    'adnansadatmahin4@gmail.com',
    crypt('@@@mahin12', gen_salt('bf')),
    'Mahin Khan (Super Admin)',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- 3. SERVICE REGISTRY TABLE (Single Source of Truth)
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

-- 4. PARTNERSTACK-GRADE AFFILIATE SYSTEM
CREATE TABLE IF NOT EXISTS ibos_affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aff_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. AFF10025
    user_id UUID REFERENCES ibos_users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tier VARCHAR(32) DEFAULT 'VIP', -- Starter, VIP, Elite, Legend
    commission_rate DECIMAL(5,2) DEFAULT 20.00,
    earnings_total DECIMAL(12,2) DEFAULT 0.00,
    earnings_pending DECIMAL(12,2) DEFAULT 0.00,
    earnings_withdrawn DECIMAL(12,2) DEFAULT 0.00,
    clicks_total INT DEFAULT 0,
    sales_total INT DEFAULT 0,
    payment_method VARCHAR(64) DEFAULT 'bKash/Nagad/Bank',
    payment_details TEXT,
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

-- 5. ORDERS & ATTRIBUTION TABLE
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
    affiliate_ref_code VARCHAR(64), -- Strict Attribution Token Lock
    affiliate_commission DECIMAL(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(32) DEFAULT 'pending', -- pending, paid, refunded
    order_status VARCHAR(32) DEFAULT 'processing', -- processing, active, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CMS & DYNAMIC CONTENT CONTROL
CREATE TABLE IF NOT EXISTS ibos_cms_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_key VARCHAR(64) UNIQUE NOT NULL, -- homepage, marketplace, store, portal, affiliate, blog
    title VARCHAR(255) NOT NULL,
    hero_headline TEXT,
    hero_subtext TEXT,
    content_blocks JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CRM & CLIENT PIPELINE
CREATE TABLE IF NOT EXISTS ibos_crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64),
    company VARCHAR(255),
    budget VARCHAR(64),
    service_interest VARCHAR(128),
    stage VARCHAR(32) DEFAULT 'new', -- new, contacted, proposal, closed_won, closed_lost
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. MULTI-AGENT AI MEMORY ENGINE (pgvector)
CREATE TABLE IF NOT EXISTS ibos_ai_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(64) NOT NULL, -- hermes_admin, lead_qualifier, support_agent
    session_id VARCHAR(128),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI / Gemini Vector Embeddings
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. AUDIT TRAIL & EVENT LOGS TABLE
CREATE TABLE IF NOT EXISTS ibos_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(128) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SYSTEM CONFIG & FEATURE FLAGS TABLE
CREATE TABLE IF NOT EXISTS ibos_system_config (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Config
INSERT INTO ibos_system_config (key, value) VALUES
('bdt_exchange_rate', '{"rate": 120}'::jsonb),
('feature_flags', '{"aiChat": true, "affiliateNetwork": true, "marketplace": true, "clientPortal": true, "cloudBackend": true}'::jsonb),
('cloud_stack', '{"frontend": "Cloudflare Pages", "edge_api": "Cloudflare Workers", "database": "Supabase PostgreSQL", "vps": "Oracle Cloud Always Free (n8n/Docker)"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
