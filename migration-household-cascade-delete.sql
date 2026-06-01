-- Optional: document cascade delete behaviour for households.
-- GNIMS deletes related rows in application code when a household is removed.
-- Run this only if you want DB-level ON DELETE CASCADE (requires FK constraints).

-- Example pattern (adjust if your schema uses different FK names):
-- ALTER TABLE public.family_members
--   ADD CONSTRAINT family_members_house_fkey
--   FOREIGN KEY (division, "houseNumber")
--   REFERENCES public.households (division, "houseNumber")
--   ON DELETE CASCADE;
