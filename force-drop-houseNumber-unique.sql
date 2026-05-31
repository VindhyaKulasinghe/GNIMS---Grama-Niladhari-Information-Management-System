-- FORCE FIX: households_houseNumber_key still showing
-- Supabase → SQL Editor → New snippet → paste ALL → Run
-- Run the WHOLE file once (not just the SELECT at the end)

-- ============================================================
-- 1) DIAGNOSTIC — see constraints AND indexes on households
-- ============================================================
SELECT 'constraints' AS kind, con.conname AS name, pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'households'
  AND nsp.nspname = 'public'
  AND con.contype = 'u'

UNION ALL

SELECT 'indexes' AS kind, indexname AS name, indexdef AS definition
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'households'
  AND indexdef ILIKE '%unique%';

-- ============================================================
-- 2) DROP the global houseNumber rule (constraint + index)
-- ============================================================
ALTER TABLE public.households
  DROP CONSTRAINT IF EXISTS households_houseNumber_key CASCADE;

DROP INDEX IF EXISTS public.households_houseNumber_key CASCADE;
DROP INDEX IF EXISTS households_houseNumber_key CASCADE;

-- Drop ANY other unique constraint on households that is NOT division-scoped
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'households'
      AND nsp.nspname = 'public'
      AND con.contype = 'u'
      AND pg_get_constraintdef(con.oid) NOT ILIKE '%division%'
  LOOP
    EXECUTE format(
      'ALTER TABLE public.households DROP CONSTRAINT IF EXISTS %I CASCADE',
      r.conname
    );
    RAISE NOTICE 'Dropped constraint: %', r.conname;
  END LOOP;
END $$;

-- ============================================================
-- 3) ADD per-division unique (division + houseNumber)
-- ============================================================
ALTER TABLE public.households
  DROP CONSTRAINT IF EXISTS households_division_houseNumber_key CASCADE;

ALTER TABLE public.households
  ADD CONSTRAINT households_division_houseNumber_key
  UNIQUE (division, "houseNumber");

-- ============================================================
-- 4) VERIFY — households_houseNumber_key must NOT appear below
--     Only households_division_houseNumber_key should remain
-- ============================================================
SELECT con.conname AS constraint_name, pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'households'
  AND nsp.nspname = 'public'
  AND con.contype = 'u';
