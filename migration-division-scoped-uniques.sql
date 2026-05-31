-- Run this in Supabase Dashboard → SQL Editor (Create new snippet → Run)
-- If you still see error "households_houseNumber_key", run fix-households-global-unique.sql instead.

-- ========== HOUSEHOLDS (required — fixes the console error) ==========
ALTER TABLE public.households DROP CONSTRAINT IF EXISTS households_houseNumber_key;
ALTER TABLE public.households DROP CONSTRAINT IF EXISTS households_division_houseNumber_key;
ALTER TABLE public.households
  ADD CONSTRAINT households_division_houseNumber_key
  UNIQUE (division, "houseNumber");

-- ========== HOUSEHOLD_ANIMALS ==========
ALTER TABLE public.household_animals DROP CONSTRAINT IF EXISTS household_animals_houseNumber_animalId_key;
ALTER TABLE public.household_animals DROP CONSTRAINT IF EXISTS household_animals_division_houseNumber_animalId_key;
ALTER TABLE public.household_animals
  ADD CONSTRAINT household_animals_division_houseNumber_animalId_key
  UNIQUE (division, "houseNumber", "animalId");

-- ========== FAMILY_MEMBERS ==========
ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_uniqueNumber_key;
ALTER TABLE public.family_members DROP CONSTRAINT IF EXISTS family_members_division_uniqueNumber_key;
ALTER TABLE public.family_members
  ADD CONSTRAINT family_members_division_uniqueNumber_key
  UNIQUE (division, "uniqueNumber");

-- ========== VERIFY (should show households_division_houseNumber_key, NOT households_houseNumber_key) ==========
SELECT con.conname AS constraint_name
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'households' AND con.contype = 'u';