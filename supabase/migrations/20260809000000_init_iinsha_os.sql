-- ============================================================
-- IINSHA TECH OS v1000 — DATABASE MIGRATION 20260809000000
-- Single Source of Truth Database Architecture
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Universal Content Dictionary
CREATE TABLE IF NOT EXISTS ibos_content_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word_key VARCHAR(128) UNIQUE NOT NULL,
    word_value TEXT NOT NULL,
    category VARCHAR(64) DEFAULT 'homepage',
    language VARCHAR(10) DEFAULT 'en',
    version INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Dynamic Page & Section Builder
CREATE TABLE IF NOT EXISTS ibos_dynamic_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
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
    block_type VARCHAR(64) NOT NULL,
    sort_order INT DEFAULT 0,
    block_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Navigation Menu Manager
CREATE TABLE IF NOT EXISTS ibos_navigation_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_location VARCHAR(64) NOT NULL,
    label VARCHAR(128) NOT NULL,
    url VARCHAR(255) NOT NULL,
    icon VARCHAR(64),
    sort_order INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Central Service Catalog (Single Source of Truth)
CREATE TABLE IF NOT EXISTS ibos_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(128) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
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

-- 5. PartnerStack-Grade Affiliate Ledger
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

-- 6. Orders & Payment Lifecycle
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

-- 7. Audit Logs & Version Control
CREATE TABLE IF NOT EXISTS ibos_version_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(64) NOT NULL,
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

-- RLS Security Policies
ALTER TABLE ibos_content_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Content" ON ibos_content_words FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON ibos_services FOR SELECT USING (status = 'published');
