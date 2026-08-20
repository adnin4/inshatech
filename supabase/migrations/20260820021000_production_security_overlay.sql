-- IINSHA production security overlay
-- Canonical source-of-truth for the live Data API hardening applied on 2026-08-20.
-- Sensitive tables remain backend/service-role controlled; only explicitly public catalog/content reads are exposed.

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

GRANT SELECT ON TABLE public.ibos_services TO anon, authenticated;
GRANT SELECT ON TABLE public.ibos_cms_pages TO anon, authenticated;
GRANT SELECT ON TABLE public.ibos_content_words TO anon, authenticated;

DROP POLICY IF EXISTS public_published_services_read ON public.ibos_services;
CREATE POLICY public_published_services_read
ON public.ibos_services
FOR SELECT TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS public_published_cms_read ON public.ibos_cms_pages;
CREATE POLICY public_published_cms_read
ON public.ibos_cms_pages
FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS public_content_words_read ON public.ibos_content_words;
CREATE POLICY public_content_words_read
ON public.ibos_content_words
FOR SELECT TO anon, authenticated
USING (true);

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;

-- Deny-by-default RLS for every non-public application table. The service_role/backend bypasses RLS by design.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename NOT IN ('ibos_services','ibos_cms_pages','ibos_content_words')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
    EXECUTE format('DROP POLICY IF EXISTS deny_public_%I ON public.%I', r.tablename, r.tablename);
    EXECUTE format('CREATE POLICY deny_public_%I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)', r.tablename, r.tablename);
  END LOOP;
END $$;

CREATE INDEX IF NOT EXISTS idx_ibos_affiliates_user_id ON public.ibos_affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_ibos_orders_service_id ON public.ibos_orders(service_id);
