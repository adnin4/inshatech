-- IINSHA AI-BOS: Multi-Tenant RBAC Schema, MakerKit Policy Engine, and Atomic Double-Entry Settlement

-- 1. Organization Accounts (Tenants)
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    primary_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- 2. User Account Memberships & Roles
CREATE TABLE IF NOT EXISTS public.account_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_role TEXT NOT NULL CHECK (account_role IN ('owner', 'admin', 'member', 'billing_admin', 'auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(account_id, user_id)
);
ALTER TABLE public.account_memberships ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_memberships_acc_user ON public.account_memberships(account_id, user_id);

-- 3. RBAC Permission Check Helper Function (Security Definer with Cached Subquery)
CREATE OR REPLACE FUNCTION public.has_role_on_account(
    target_account_id UUID,
    required_role TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.account_memberships membership
        WHERE membership.user_id = (SELECT auth.uid())
          AND membership.account_id = target_account_id
          AND (
              membership.account_role = required_role
              OR required_role IS NULL
              OR membership.account_role = 'owner'
          )
    );
$$;

-- 4. Protected Business Entities (Projects / Services)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_projects_account_id ON public.projects(account_id);

DROP POLICY IF EXISTS "Account members can view projects" ON public.projects;
CREATE POLICY "Account members can view projects" ON public.projects
    FOR SELECT TO authenticated USING (public.has_role_on_account(account_id));

DROP POLICY IF EXISTS "Admins and Owners can mutate projects" ON public.projects;
CREATE POLICY "Admins and Owners can mutate projects" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (public.has_role_on_account(account_id, 'admin'));

DROP POLICY IF EXISTS "Admins and Owners can update projects" ON public.projects;
CREATE POLICY "Admins and Owners can update projects" ON public.projects
    FOR UPDATE TO authenticated
    USING (public.has_role_on_account(account_id, 'admin'))
    WITH CHECK (public.has_role_on_account(account_id, 'admin'));

-- 5. Reporting View Declared with security_invoker = true
CREATE OR REPLACE VIEW public.account_project_summaries
WITH (security_invoker = true) AS
SELECT
    a.id AS account_id,
    a.name AS account_name,
    COUNT(p.id) AS total_projects
FROM public.accounts a
LEFT JOIN public.projects p ON p.account_id = a.id
GROUP BY a.id, a.name;

-- 6. Price Catalog Table
CREATE TABLE IF NOT EXISTS public.price_catalog (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    base_price_bdt NUMERIC(12, 2) NOT NULL CHECK (base_price_bdt >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- 7. Double-Entry Immutable Ledger & Revenue System
CREATE TABLE IF NOT EXISTS public.ibos_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    sku TEXT NOT NULL REFERENCES public.price_catalog(sku),
    locked_amount NUMERIC(12, 2) NOT NULL CHECK (locked_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'BDT',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SETTLED', 'FAILED', 'REFUNDED')),
    idempotency_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.ibos_orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ibos_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.ibos_orders(id) ON DELETE RESTRICT,
    invoice_number TEXT NOT NULL UNIQUE,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'VOIDED')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.ibos_invoices ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ibos_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    account_head TEXT NOT NULL CHECK (account_head IN ('ACCOUNTS_RECEIVABLE', 'CASH_CLEARING', 'REVENUE', 'GATEWAY_FEES', 'REFUND_EXPENSE')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'BDT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.ibos_ledger ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_ledger_trx_id ON public.ibos_ledger(transaction_id);

CREATE TABLE IF NOT EXISTS public.ibos_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.ibos_orders(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE RESTRICT,
    recognized_amount NUMERIC(12, 2) NOT NULL CHECK (recognized_amount >= 0),
    recognized_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.ibos_revenue ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ibos_webhook_events (
    event_id TEXT PRIMARY KEY,
    gateway TEXT NOT NULL CHECK (gateway IN ('STRIPE', 'BKASH', 'NAGAD')),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'PROCESSED' CHECK (status IN ('PROCESSED', 'DUPLICATE_IGNORED', 'FAILED')),
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.ibos_webhook_events ENABLE ROW LEVEL SECURITY;

-- 8. Atomic Settlement Stored Procedure
CREATE OR REPLACE FUNCTION public.execute_financial_settlement(
    target_order_id UUID,
    gateway_name TEXT,
    gateway_trx_id TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
    v_order record;
    v_invoice_id UUID;
    v_trx_group UUID;
BEGIN
    SELECT * INTO v_order FROM public.ibos_orders WHERE id = target_order_id FOR UPDATE;
    IF v_order.id IS NULL THEN
        RAISE EXCEPTION 'Order not found: %', target_order_id;
    END IF;

    IF v_order.status = 'SETTLED' THEN
        RETURN; -- Already settled; maintain idempotency
    END IF;

    v_trx_group := gen_random_uuid();

    -- 1. Mutate Order Status
    UPDATE public.ibos_orders SET status = 'SETTLED' WHERE id = target_order_id;

    -- 2. Create Invoice
    INSERT INTO public.ibos_invoices (order_id, invoice_number, total_amount, status)
    VALUES (v_order.id, 'INV-' || upper(substr(replace(v_order.id::text, '-', ''), 1, 8)), v_order.locked_amount, 'PAID')
    RETURNING id INTO v_invoice_id;

    -- 3. Write Double-Entry Balanced Ledger Records
    -- Debit: Cash Clearing (Asset increase)
    INSERT INTO public.ibos_ledger (transaction_id, account_id, entry_type, account_head, amount, currency)
    VALUES (v_trx_group, v_order.account_id, 'DEBIT', 'CASH_CLEARING', v_order.locked_amount, v_order.currency);

    -- Credit: Revenue (Equity/Income increase)
    INSERT INTO public.ibos_ledger (transaction_id, account_id, entry_type, account_head, amount, currency)
    VALUES (v_trx_group, v_order.account_id, 'CREDIT', 'REVENUE', v_order.locked_amount, v_order.currency);

    -- 4. Record Final Recognized Revenue
    INSERT INTO public.ibos_revenue (order_id, account_id, recognized_amount)
    VALUES (v_order.id, v_order.account_id, v_order.locked_amount);
END;
$$;
