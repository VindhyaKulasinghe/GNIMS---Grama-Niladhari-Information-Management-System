-- Pension details for retired family members
-- Run in Supabase SQL Editor

ALTER TABLE public.family_members
  ADD COLUMN IF NOT EXISTS "isRetired" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "pensionNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "pensionSalary" TEXT,
  ADD COLUMN IF NOT EXISTS "retiredDate" DATE,
  ADD COLUMN IF NOT EXISTS "pensionDetails" TEXT;

CREATE INDEX IF NOT EXISTS idx_family_members_retired
  ON public.family_members (division, "isRetired")
  WHERE "isRetired" = true;
