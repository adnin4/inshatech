-- Migration: 20260823000007_zero_trust_rls_security_invoker.sql
-- Zero-Trust PostgreSQL Database, Security Invoker Views, and Subquery Cache Optimization

-- 1. Subquery Cache Optimization: Use (select auth.uid()) in RLS policies to prevent per-row evaluation
DO $$
BEGIN
    -- Ensure accounts table has optimized cached RLS
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ibos_users') THEN
        ALTER TABLE public.ibos_users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Security Invoker View Declaration (Fixes RLS bypass through views)
CREATE OR REPLACE VIEW public.v_active_service_catalog
WITH (security_invoker = true) AS
SELECT id, name, category, price_usd, price_bdt, delivery_days
FROM public.ibos_services
WHERE is_active = true;

-- 3. Mutating RLS Policy with Symmetric WITH CHECK Clause
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ibos_orders') THEN
        DROP POLICY IF EXISTS "orders_customer_mutate_policy" ON public.ibos_orders;
        CREATE POLICY "orders_customer_mutate_policy" ON public.ibos_orders
            FOR ALL
            TO authenticated
            USING (customer_id = (SELECT auth.uid()))
            WITH CHECK (customer_id = (SELECT auth.uid()));
    END IF;
END $$;

-- 4. Event Trigger for Automated RLS on New DDL Tables
CREATE OR REPLACE FUNCTION public.auto_enable_rls_on_new_table()
RETURNS event_trigger AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands() WHERE command_tag = 'CREATE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY;', obj.object_identity);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. 14-Role MakerKit RBAC Rules Engine (Hardened against caller role spoofing)
CREATE OR REPLACE FUNCTION public.check_user_role_permission(required_permission VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_role VARCHAR;
BEGIN
    -- Securely derive role from authenticated user context (table lookup or verified JWT claim)
    SELECT role INTO v_user_role FROM public.ibos_users WHERE id = auth.uid();
    IF v_user_role IS NULL THEN
        v_user_role := COALESCE(auth.jwt()->>'user_role', auth.jwt()->>'role', 'anonymous');
    END IF;

    IF v_user_role IN ('super_admin', 'sovereign_owner') THEN
        RETURN TRUE;
    ELSIF v_user_role = 'admin' AND required_permission IN ('READ_ALL', 'WRITE_ALL', 'DEPLOY_STAGING') THEN
        RETURN TRUE;
    ELSIF v_user_role = 'developer' AND required_permission IN ('READ_PROJECTS', 'EXECUTE_SANDBOX_BUILD') THEN
        RETURN TRUE;
    ELSIF v_user_role = 'customer' AND required_permission IN ('READ_OWN_ORDERS', 'SUBMIT_TICKET') THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public;

-- Backwards-compatible 2-argument signature: validates that caller-provided role matches verified session role
CREATE OR REPLACE FUNCTION public.check_user_role_permission(user_role VARCHAR, required_permission VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_actual_role VARCHAR;
BEGIN
    -- Service role bypass for backend jobs
    IF (SELECT current_setting('role', true)) = 'service_role' THEN
        IF user_role IN ('super_admin', 'sovereign_owner') THEN
            RETURN TRUE;
        ELSIF user_role = 'admin' AND required_permission IN ('READ_ALL', 'WRITE_ALL', 'DEPLOY_STAGING') THEN
            RETURN TRUE;
        ELSIF user_role = 'developer' AND required_permission IN ('READ_PROJECTS', 'EXECUTE_SANDBOX_BUILD') THEN
            RETURN TRUE;
        ELSIF user_role = 'customer' AND required_permission IN ('READ_OWN_ORDERS', 'SUBMIT_TICKET') THEN
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    END IF;

    -- For user requests: Verify claimed role against database records (prevent spoofing)
    SELECT role INTO v_actual_role FROM public.ibos_users WHERE id = auth.uid();
    IF v_actual_role IS NULL OR v_actual_role != user_role THEN
        RETURN FALSE;
    END IF;

    RETURN public.check_user_role_permission(required_permission);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public;
