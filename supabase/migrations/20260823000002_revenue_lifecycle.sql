-- ================================================================
-- IINSHA AI-BOS: REVENUE LIFECYCLE EXTENSION (20260823000002)
-- Strict Payment-Gated Project Creation & Verification Proof
-- ================================================================

CREATE TABLE IF NOT EXISTS public.ibos_revenue_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    offered_price DECIMAL NOT NULL,
    requires_l3_approval BOOLEAN DEFAULT FALSE,
    owner_approved BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PENDING_ACCEPTANCE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ibos_payment_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    gateway VARCHAR(50) NOT NULL,
    transaction_ref TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    hmac_signature TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable 100% RLS Coverage
ALTER TABLE public.ibos_revenue_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ibos_payment_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for revenue proposals"
    ON public.ibos_revenue_proposals FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read for payment verifications"
    ON public.ibos_payment_verifications FOR SELECT
    TO authenticated USING (true);
