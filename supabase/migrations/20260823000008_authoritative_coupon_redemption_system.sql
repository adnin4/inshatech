-- ==============================================================================
-- Migration: 20260823000008_authoritative_coupon_redemption_system.sql
-- Description: Authoritative DB-backed coupon storage, usage limits & atomic redemption
-- Security: Row Level Security enabled with security_invoker = true
-- ==============================================================================

CREATE TABLE IF NOT EXISTS ibos_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percent' CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    max_uses INTEGER NOT NULL DEFAULT 1000 CHECK (max_uses > 0),
    used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= max_uses),
    per_user_limit INTEGER NOT NULL DEFAULT 1 CHECK (per_user_limit > 0),
    minimum_order_usd NUMERIC(10,2) NOT NULL DEFAULT 100.00 CHECK (minimum_order_usd >= 0),
    maximum_discount_usd NUMERIC(10,2) DEFAULT 150.00 CHECK (maximum_discount_usd IS NULL OR maximum_discount_usd >= 0),
    min_floor_price_usd NUMERIC(10,2) NOT NULL DEFAULT 200.00 CHECK (min_floor_price_usd >= 0),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    service_scope JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ibos_coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES ibos_coupons(id) ON DELETE CASCADE,
    coupon_code VARCHAR(50) NOT NULL,
    order_code VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    discount_amount_usd NUMERIC(10,2) NOT NULL CHECK (discount_amount_usd >= 0),
    final_amount_usd NUMERIC(10,2) NOT NULL CHECK (final_amount_usd >= 0),
    metadata JSONB DEFAULT '{}'::jsonb,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_coupon_order UNIQUE (coupon_code, order_code)
);

-- Performance & Indexing
CREATE INDEX IF NOT EXISTS idx_ibos_coupons_code_active ON ibos_coupons (code, is_active);
CREATE INDEX IF NOT EXISTS idx_ibos_coupon_redemptions_email ON ibos_coupon_redemptions (customer_email, coupon_code);
CREATE INDEX IF NOT EXISTS idx_ibos_coupon_redemptions_order ON ibos_coupon_redemptions (order_code);

-- Enable Row Level Security
ALTER TABLE ibos_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ibos_coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ibos_coupons
DROP POLICY IF EXISTS "Public can view active coupons" ON ibos_coupons;
CREATE POLICY "Public can view active coupons"
    ON ibos_coupons
    FOR SELECT
    USING (is_active = TRUE);

DROP POLICY IF EXISTS "Service role manages coupons" ON ibos_coupons;
CREATE POLICY "Service role manages coupons"
    ON ibos_coupons
    FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for ibos_coupon_redemptions
DROP POLICY IF EXISTS "Users view own redemptions" ON ibos_coupon_redemptions;
CREATE POLICY "Users view own redemptions"
    ON ibos_coupon_redemptions
    FOR SELECT
    USING (
        customer_email = (SELECT auth.jwt() ->> 'email')
        OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Service role inserts redemptions" ON ibos_coupon_redemptions;
CREATE POLICY "Service role inserts redemptions"
    ON ibos_coupon_redemptions
    FOR INSERT
    TO service_role
    WITH CHECK (TRUE);

-- Atomic Coupon Redemption Function
CREATE OR REPLACE FUNCTION redeem_coupon_atomic(
    p_coupon_code VARCHAR,
    p_customer_email VARCHAR,
    p_order_code VARCHAR,
    p_discount_usd NUMERIC,
    p_final_usd NUMERIC
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_coupon ibos_coupons%ROWTYPE;
    v_user_redemptions INTEGER;
    v_redemption_id UUID;
BEGIN
    -- Acquire exclusive row lock on coupon
    SELECT * INTO v_coupon
    FROM ibos_coupons
    WHERE code = UPPER(TRIM(p_coupon_code))
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'COUPON_NOT_FOUND');
    END IF;

    IF NOT v_coupon.is_active THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'COUPON_INACTIVE');
    END IF;

    IF v_coupon.starts_at > NOW() THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'COUPON_NOT_YET_ACTIVE');
    END IF;

    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'COUPON_EXPIRED');
    END IF;

    IF v_coupon.used_count >= v_coupon.max_uses THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'COUPON_MAX_USES_REACHED');
    END IF;

    -- Check customer-specific usage limit
    SELECT COUNT(*) INTO v_user_redemptions
    FROM ibos_coupon_redemptions
    WHERE coupon_code = v_coupon.code AND LOWER(customer_email) = LOWER(TRIM(p_customer_email));

    IF v_user_redemptions >= v_coupon.per_user_limit THEN
        RETURN jsonb_build_object('success', FALSE, 'error', 'USER_LIMIT_REACHED');
    END IF;

    -- Increment usage atomically
    UPDATE ibos_coupons
    SET used_count = used_count + 1,
        updated_at = NOW()
    WHERE id = v_coupon.id;

    -- Record redemption entry
    INSERT INTO ibos_coupon_redemptions (
        coupon_id,
        coupon_code,
        order_code,
        customer_email,
        discount_amount_usd,
        final_amount_usd
    ) VALUES (
        v_coupon.id,
        v_coupon.code,
        p_order_code,
        LOWER(TRIM(p_customer_email)),
        p_discount_usd,
        p_final_usd
    ) RETURNING id INTO v_redemption_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'redemption_id', v_redemption_id,
        'coupon_code', v_coupon.code,
        'used_count', v_coupon.used_count + 1,
        'max_uses', v_coupon.max_uses
    );
END;
$$;

-- Seed Authoritative Canonical Coupons (Idempotent)
INSERT INTO ibos_coupons (
    code, discount_type, discount_value, max_uses, per_user_limit, minimum_order_usd, maximum_discount_usd, min_floor_price_usd, starts_at, expires_at, is_active
) VALUES
    ('EARLY2026', 'percent', 10.00, 500, 1, 100.00, 150.00, 200.00, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', TRUE),
    ('APEX15',    'percent', 15.00, 250, 1, 200.00, 250.00, 200.00, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', TRUE),
    ('FOUNDER10', 'percent', 10.00, 100, 1, 100.00, 100.00, 200.00, '2026-01-01T00:00:00Z', '2026-12-31T23:59:59Z', TRUE)
ON CONFLICT (code) DO UPDATE SET
    discount_value = EXCLUDED.discount_value,
    max_uses = EXCLUDED.max_uses,
    minimum_order_usd = EXCLUDED.minimum_order_usd,
    maximum_discount_usd = EXCLUDED.maximum_discount_usd,
    min_floor_price_usd = EXCLUDED.min_floor_price_usd,
    is_active = EXCLUDED.is_active;
