-- GN certificate / letter issuances
-- Run in Supabase SQL Editor (enable RLS when prompted)
--
-- Safe to run standalone: includes user_can_access_division if not already created
-- by migration-household-benefits.sql

CREATE OR REPLACE FUNCTION public.user_can_access_division(target_division TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    WHERE u.id = auth.uid()
      AND COALESCE(u.status, 'Active') = 'Active'
      AND (
        u.role IN ('Admin', 'Divisional Secretariat')
        OR u.division = target_division
      )
  );
$$;

GRANT EXECUTE ON FUNCTION public.user_can_access_division(TEXT) TO authenticated;

CREATE TABLE IF NOT EXISTS certificate_issuances (
  id BIGSERIAL PRIMARY KEY,
  division TEXT NOT NULL,
  "certificateType" TEXT NOT NULL,
  "issueDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  "houseNumber" TEXT,
  "recipientMemberId" BIGINT REFERENCES family_members(id) ON DELETE SET NULL,
  "recipientName" TEXT NOT NULL,
  "recipientNic" TEXT,
  "recipientAddress" TEXT,
  purpose TEXT,
  "referenceNumber" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_certificate_issuances_division_date
  ON certificate_issuances (division, "issueDate" DESC);

CREATE INDEX IF NOT EXISTS idx_certificate_issuances_type
  ON certificate_issuances (division, "certificateType", "issueDate" DESC);

ALTER TABLE certificate_issuances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS certificate_issuances_select ON certificate_issuances;
CREATE POLICY certificate_issuances_select
  ON certificate_issuances FOR SELECT TO authenticated
  USING (public.user_can_access_division(division));

DROP POLICY IF EXISTS certificate_issuances_insert ON certificate_issuances;
CREATE POLICY certificate_issuances_insert
  ON certificate_issuances FOR INSERT TO authenticated
  WITH CHECK (public.user_can_access_division(division));

DROP POLICY IF EXISTS certificate_issuances_update ON certificate_issuances;
CREATE POLICY certificate_issuances_update
  ON certificate_issuances FOR UPDATE TO authenticated
  USING (public.user_can_access_division(division))
  WITH CHECK (public.user_can_access_division(division));

DROP POLICY IF EXISTS certificate_issuances_delete ON certificate_issuances;
CREATE POLICY certificate_issuances_delete
  ON certificate_issuances FOR DELETE TO authenticated
  USING (public.user_can_access_division(division));

GRANT SELECT, INSERT, UPDATE, DELETE ON certificate_issuances TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE certificate_issuances_id_seq TO authenticated;
