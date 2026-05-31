-- Sahanadara (social welfare benefits) per household
-- Run in Supabase SQL Editor
--
-- RLS is ENABLED: GN Officers see/edit only their division;
-- Admin and Divisional Secretariat see/edit all divisions.
-- Requires a logged-in Supabase Auth session (authenticated role).

CREATE TABLE IF NOT EXISTS household_benefits (
  id BIGSERIAL PRIMARY KEY,
  "houseNumber" TEXT NOT NULL,
  division TEXT NOT NULL,
  "benefitType" TEXT NOT NULL,
  "isReceiving" BOOLEAN NOT NULL DEFAULT false,
  "receiverMemberId" BIGINT REFERENCES family_members(id) ON DELETE SET NULL,
  "otherNotes" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT household_benefits_division_house_type_key
    UNIQUE (division, "houseNumber", "benefitType")
);

CREATE INDEX IF NOT EXISTS idx_household_benefits_division_type
  ON household_benefits (division, "benefitType", "isReceiving");

CREATE INDEX IF NOT EXISTS idx_household_benefits_house
  ON household_benefits (division, "houseNumber");

-- ---------------------------------------------------------------------------
-- Row Level Security (recommended — choose "Enable RLS" in Supabase)
-- ---------------------------------------------------------------------------

ALTER TABLE household_benefits ENABLE ROW LEVEL SECURITY;

-- Returns true when the signed-in user may access rows for target_division
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

DROP POLICY IF EXISTS household_benefits_select ON household_benefits;
CREATE POLICY household_benefits_select
  ON household_benefits
  FOR SELECT
  TO authenticated
  USING (public.user_can_access_division(division));

DROP POLICY IF EXISTS household_benefits_insert ON household_benefits;
CREATE POLICY household_benefits_insert
  ON household_benefits
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_access_division(division));

DROP POLICY IF EXISTS household_benefits_update ON household_benefits;
CREATE POLICY household_benefits_update
  ON household_benefits
  FOR UPDATE
  TO authenticated
  USING (public.user_can_access_division(division))
  WITH CHECK (public.user_can_access_division(division));

DROP POLICY IF EXISTS household_benefits_delete ON household_benefits;
CREATE POLICY household_benefits_delete
  ON household_benefits
  FOR DELETE
  TO authenticated
  USING (public.user_can_access_division(division));

GRANT SELECT, INSERT, UPDATE, DELETE ON household_benefits TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE household_benefits_id_seq TO authenticated;
