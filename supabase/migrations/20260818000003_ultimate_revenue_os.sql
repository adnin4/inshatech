-- ====================================================================
-- IINSHA PARTNER & REVENUE OS — ULTIMATE MASTER MIGRATION v2026.08.18
-- Universal Offers, Multi-Touch Attribution, Digital Twin Scenarios, Reseller & Agency Engine
-- ====================================================================

-- 1. Universal Offer Engine (Unified Services, SaaS, Products & Subscriptions)
CREATE TABLE IF NOT EXISTS ibos_universal_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'service', 'saas', 'subscription', 'bundle', 'enterprise'
    category VARCHAR(100) NOT NULL,
    short_description TEXT,
    full_description TEXT,
    pricing_config JSONB NOT NULL DEFAULT '{
        "model": "fixed",
        "base_usd": 0,
        "base_bdt": 0,
        "recurring_usd": 0,
        "currency": "USD"
    }'::jsonb,
    affiliate_config JSONB NOT NULL DEFAULT '{
        "eligible": true,
        "upfront_percent": 20.0,
        "recurring_percent": 15.0,
        "cookie_days": 60,
        "min_tier": "Bronze"
    }'::jsonb,
    deliverables JSONB DEFAULT '[]'::jsonb,
    marketing_assets JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'published', -- 'draft', 'review', 'published', 'archived'
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Multi-Touch Attribution Graph Touchpoints
CREATE TABLE IF NOT EXISTS ibos_attribution_touchpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(150) NOT NULL,
    click_id VARCHAR(150),
    affiliate_id VARCHAR(100),
    lead_id UUID,
    customer_id UUID,
    order_id UUID,
    channel VARCHAR(50) DEFAULT 'affiliate', -- 'affiliate', 'direct', 'organic', 'social', 'paid'
    landing_page TEXT,
    touchpoint_order INT DEFAULT 1,
    weight DECIMAL(5,4) DEFAULT 1.0000,
    attribution_model VARCHAR(50) DEFAULT 'last_touch', -- 'first_touch', 'last_touch', 'linear', 'time_decay', 'position_based'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. White-Label Reseller & Agency Partner System
CREATE TABLE IF NOT EXISTS ibos_resellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id VARCHAR(100) NOT NULL,
    agency_name VARCHAR(255) NOT NULL,
    custom_domain VARCHAR(255),
    whitelabel_branding JSONB DEFAULT '{}'::jsonb,
    revenue_share_percent DECIMAL(5,2) DEFAULT 30.00,
    is_approved BOOLEAN DEFAULT TRUE,
    total_clients INT DEFAULT 0,
    lifetime_revenue_usd DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Agency Managed Clients
CREATE TABLE IF NOT EXISTS ibos_agency_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reseller_id UUID REFERENCES ibos_resellers(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    contract_value_usd DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Business Digital Twin Scenarios & Simulation Runs
CREATE TABLE IF NOT EXISTS ibos_digital_twin_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_name VARCHAR(255) NOT NULL,
    inputs JSONB NOT NULL, -- { price_change_percent, commission_change_percent, affiliate_growth }
    predictions JSONB NOT NULL, -- { estimated_revenue, margin_impact, projected_conversions }
    run_by VARCHAR(100) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_universal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_attribution_touchpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_agency_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_digital_twin_scenarios ENABLE ROW LEVEL SECURITY;

-- Security Policies
CREATE POLICY "Public read published universal offers" ON ibos_universal_offers FOR SELECT USING (status = 'published');
CREATE POLICY "Admin full access universal offers" ON ibos_universal_offers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin read touchpoints" ON ibos_attribution_touchpoints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin read resellers" ON ibos_resellers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin read agency clients" ON ibos_agency_clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin read digital twin scenarios" ON ibos_digital_twin_scenarios FOR ALL TO authenticated USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_offers_slug ON ibos_universal_offers(slug);
CREATE INDEX IF NOT EXISTS idx_offers_category ON ibos_universal_offers(category);
CREATE INDEX IF NOT EXISTS idx_touchpoints_session ON ibos_attribution_touchpoints(session_id);
CREATE INDEX IF NOT EXISTS idx_touchpoints_affiliate ON ibos_attribution_touchpoints(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_resellers_partner ON ibos_resellers(partner_id);
