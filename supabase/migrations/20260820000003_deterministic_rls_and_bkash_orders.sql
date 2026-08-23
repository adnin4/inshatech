-- IINSHA AI-BOS: Deterministic RLS Event Trigger, Subquery Auth Caching & Invoker Views

-- 1. Deterministic Database Security Automation Event Trigger
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS EVENT_TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
    cmd record;
BEGIN
    FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table', 'partitioned table')
    LOOP
        IF cmd.schema_name = 'public' THEN
            EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY;', cmd.object_identity);
            RAISE NOTICE 'Auto-enforced RLS on table: %', cmd.object_identity;
        END IF;
    END LOOP;
END;
$$;

DROP EVENT TRIGGER IF EXISTS ensure_rls;
CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
EXECUTE FUNCTION public.rls_auto_enable();

-- 2. User Profiles and Role Registry with Subquery-Cached Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'client', 'owner', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);

DROP POLICY IF EXISTS "Allow public read access for user profiles" ON public.profiles;
CREATE POLICY "Allow public read access for user profiles"
ON public.profiles FOR SELECT TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Allow individual users to update own profile" ON public.profiles;
CREATE POLICY "Allow individual users to update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- 3. Commercial Service / Course Orders with Dual-Rail Payment
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    course_id TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'BDT',
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('BKASH', 'STRIPE', 'NAGAD', 'MANUAL')),
    gateway_transaction_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_gateway_trx ON public.orders(gateway_transaction_id);

DROP POLICY IF EXISTS "Users can query their own enrollment orders" ON public.orders;
CREATE POLICY "Users can query their own enrollment orders"
ON public.orders FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Service role retains full authority on order mutations" ON public.orders;
CREATE POLICY "Service role retains full authority on order mutations"
ON public.orders FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- 4. Reporting View Enforcing Caller Row Level Security (security_invoker = true)
CREATE OR REPLACE VIEW public.user_order_summaries
WITH (security_invoker = true) AS
SELECT
    o.user_id,
    p.email,
    count(o.id) AS total_orders,
    coalesce(sum(o.amount) FILTER (WHERE o.status = 'COMPLETED'), 0) AS total_spent_bdt
FROM public.orders o
JOIN public.profiles p ON p.id = o.user_id
GROUP BY o.user_id, p.email;
