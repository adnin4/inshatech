-- ====================================================================
-- IINSHA AI-BOS MASTER SPECIFICATION ADDITIONS MIGRATION v2026.08.18
-- Additive tables for Affiliate Assets, Dynamic Pricing Rules, Service Addons & Fraud Shield
-- ====================================================================

-- 1. Affiliate Marketing Asset Center
CREATE TABLE IF NOT EXISTS ibos_affiliate_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'social_swipe', 'email_copy', 'banner', 'video_script', 'comparison'
    content TEXT NOT NULL,
    preview_url TEXT,
    copy_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Dynamic Pricing & Regional Currency Rules
CREATE TABLE IF NOT EXISTS ibos_pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(100),
    region VARCHAR(50) DEFAULT 'GLOBAL',
    currency VARCHAR(10) DEFAULT 'USD',
    exchange_rate DECIMAL(10,2) DEFAULT 122.50,
    setup_discount_percent DECIMAL(5,2) DEFAULT 0.00,
    recurring_discount_percent DECIMAL(5,2) DEFAULT 0.00,
    rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Service Add-ons & Modular Up-sells
CREATE TABLE IF NOT EXISTS ibos_service_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10,2) NOT NULL,
    price_bdt DECIMAL(10,2) NOT NULL,
    delivery_days INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Automated Affiliate Fraud Shield Logs
CREATE TABLE IF NOT EXISTS ibos_fraud_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL, -- 'duplicate_ip', 'self_referral', 'click_spike', 'cookie_tamper'
    risk_score INT DEFAULT 0, -- 0-100 scale
    ip_address VARCHAR(100),
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    action_taken VARCHAR(50) DEFAULT 'monitored', -- 'monitored', 'flagged', 'held', 'suspended'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row-Level Security
ALTER TABLE ibos_affiliate_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_fraud_events ENABLE ROW LEVEL SECURITY;

-- Read policies for public/authenticated users
CREATE POLICY "Public read affiliate assets" ON ibos_affiliate_assets FOR SELECT USING (true);
CREATE POLICY "Public read pricing rules" ON ibos_pricing_rules FOR SELECT USING (true);
CREATE POLICY "Public read service addons" ON ibos_service_addons FOR SELECT USING (true);
CREATE POLICY "Admin read fraud events" ON ibos_fraud_events FOR SELECT TO authenticated USING (true);

-- Indexes for high-speed queries
CREATE INDEX IF NOT EXISTS idx_aff_assets_service ON ibos_affiliate_assets(service_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_service ON ibos_pricing_rules(service_id);
CREATE INDEX IF NOT EXISTS idx_service_addons_service ON ibos_service_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_fraud_affiliate ON ibos_fraud_events(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_fraud_created ON ibos_fraud_events(created_at DESC);
