-- Remove goat, duck, horse, quail from animals (and household links)
-- Run once in Supabase SQL editor if they still appear after app update

DELETE FROM public.household_animals
WHERE "animalId" IN (
  SELECT id FROM public.animals
  WHERE lower(trim(name)) IN ('goat', 'duck', 'horse', 'quail')
);

DELETE FROM public.animals
WHERE lower(trim(name)) IN ('goat', 'duck', 'horse', 'quail');
