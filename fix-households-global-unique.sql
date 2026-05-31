-- FIX: "duplicate key violates unique constraint households_houseNumber_key"
-- Supabase Dashboard → SQL Editor → Create new snippet → paste ALL → Run

-- Step A: See current constraints (run this first if you want to check)
SELECT con.conname AS constraint_name
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'households'
  AND nsp.nspname = 'public'
  AND con.contype = 'u';

-- Step B: Remove the OLD global rule (house number unique everywhere)
ALTER TABLE public.households
  DROP CONSTRAINT IF EXISTS households_houseNumber_key;

-- Step C: Add the NEW rule (house number unique per division only)
ALTER TABLE public.households
  DROP CONSTRAINT IF EXISTS households_division_houseNumber_key;

ALTER TABLE public.households
  ADD CONSTRAINT households_division_houseNumber_key
  UNIQUE (division, "houseNumber");

-- Step D: Confirm — households_houseNumber_key should NOT appear below
SELECT con.conname AS constraint_name
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'households'
  AND nsp.nspname = 'public'
  AND con.contype = 'u';
