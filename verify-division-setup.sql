-- Run in Supabase SQL Editor to diagnose division / duplicate house issues

-- 1) List unique constraints on households (should include division + houseNumber)
SELECT con.conname AS constraint_name
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'households'
  AND con.contype = 'u';

-- 2) GN users and their assigned divisions (each GN must have a DIFFERENT division)
SELECT email, role, division, status
FROM users
WHERE role = 'GN Officer'
ORDER BY division, email;

-- 3) Households grouped by division (same house no. in different divisions is OK)
SELECT division, "houseNumber", COUNT(*) AS count
FROM households
GROUP BY division, "houseNumber"
HAVING COUNT(*) > 1;

-- 4) If step 1 still shows households_houseNumber_key (without division), run:
-- migration-division-scoped-uniques.sql again
